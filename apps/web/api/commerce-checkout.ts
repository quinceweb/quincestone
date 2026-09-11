import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

type ApiResult = { status: number; body: Record<string, unknown> };
type Line = { variantId: string; sku: string; productName: string; quantity: number; unitAmount: number; currency: string };
type Variant = { id: string; sku: string; price_amount: number | null; currency: string; status: string; inventory_policy: string; commerce_products: unknown };
type Order = { id: string; order_number: number; total_amount: number; currency: string; status: string; checkout_fingerprint: string };
type Payment = { id: string; provider_checkout_session_id: string | null };
type StripeSession = { id: string; url: string; status?: string };

export class PersistenceError extends Error {}
export class DuplicateError extends PersistenceError {}
export class StripeError extends Error {}

export type CheckoutDependencies = {
  loadVariants(ids: string[]): Promise<Variant[]>;
  loadInventory(variantId: string): Promise<number | null>;
  insertOrder(value: Record<string, unknown>): Promise<Order>;
  findOrder(attemptId: string): Promise<Order | null>;
  upsertItems(values: Array<Record<string, unknown>>): Promise<void>;
  insertPayment(value: Record<string, unknown>): Promise<Payment>;
  findPayment(orderId: string): Promise<Payment | null>;
  recordSession(paymentId: string, sessionId: string): Promise<void>;
  createStripeSession(params: URLSearchParams, idempotencyKey: string): Promise<StripeSession>;
  retrieveStripeSession(sessionId: string): Promise<StripeSession>;
};

function parseBody(body: unknown): Record<string, unknown> {
  if (typeof body === "string") return JSON.parse(body) as Record<string, unknown>;
  return body && typeof body === "object" ? body as Record<string, unknown> : {};
}

function requestOrigin(req: any) {
  const host = req.headers?.["x-forwarded-host"] || req.headers?.host;
  const proto = req.headers?.["x-forwarded-proto"] || "https";
  return host ? `${Array.isArray(proto) ? proto[0] : proto}://${Array.isArray(host) ? host[0] : host}` : "https://shop.quincestone.com";
}

function normalizeAddress(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const limits: Record<string, number> = { name: 120, line1: 200, line2: 200, city: 120, state: 120, postal_code: 32, country: 2 };
  return Object.fromEntries(Object.entries(limits).flatMap(([key, limit]) => typeof source[key] === "string" ? [[key, (source[key] as string).trim().slice(0, limit)]] : []));
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(",")}}`;
  return JSON.stringify(value);
}

function fingerprint(email: string, address: Record<string, string>, lines: Line[]) {
  return createHash("sha256").update(stable({ email: email.toLowerCase(), address, lines: [...lines].sort((a, b) => a.variantId.localeCompare(b.variantId)) })).digest("hex");
}

function productFor(variant: Variant) {
  return Array.isArray(variant.commerce_products) ? variant.commerce_products[0] as Record<string, unknown> : variant.commerce_products as Record<string, unknown> | null;
}

export async function processCheckout(rawBody: unknown, baseUrl: string, deps: CheckoutDependencies): Promise<ApiResult> {
  let body: Record<string, unknown>;
  try { body = parseBody(rawBody); } catch { return { status: 400, body: { error: "Checkout request could not be processed." } }; }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  const attemptId = typeof body.checkoutAttemptId === "string" ? body.checkoutAttemptId : "";
  if (!rawItems.length || rawItems.length > 50 || !email || !email.includes("@") || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attemptId)) return { status: 400, body: { error: "Valid cart items, email, and checkout attempt are required." } };

  const quantities = new Map<string, number>();
  for (const rawItem of rawItems) {
    const item = rawItem && typeof rawItem === "object" ? rawItem as Record<string, unknown> : {};
    const variantId = typeof item.variantId === "string" ? item.variantId : "";
    const quantity = item.quantity;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(variantId) || !Number.isInteger(quantity) || (quantity as number) < 1) return { status: 400, body: { error: "Cart is invalid." } };
    const combined = (quantities.get(variantId) || 0) + (quantity as number);
    if (combined > 20) return { status: 400, body: { error: "Cart quantity is invalid." } };
    quantities.set(variantId, combined);
  }

  try {
    const ids = [...quantities.keys()].sort();
    const variants = await deps.loadVariants(ids);
    if (variants.length !== ids.length) return { status: 409, body: { error: "One or more products are no longer available." } };
    const lines: Line[] = [];
    for (const variantId of ids) {
      const variant = variants.find((candidate) => candidate.id === variantId);
      const product = variant ? productFor(variant) : null;
      if (!variant || variant.status !== "active" || !Number.isInteger(variant.price_amount) || (variant.price_amount || 0) <= 0 || product?.lifecycle_status !== "active" || product?.merchandising_status !== "published" || product?.publication_state !== "published") return { status: 409, body: { error: "A product is not currently sellable." } };
      const quantity = quantities.get(variantId)!;
      if (variant.inventory_policy !== "supplier") {
        const available = await deps.loadInventory(variantId);
        if (available === null || available < quantity) return { status: 409, body: { error: "A product does not have verified availability." } };
      }
      lines.push({ variantId, sku: variant.sku, productName: String(product.name || "Product"), quantity, unitAmount: variant.price_amount!, currency: variant.currency.toUpperCase() });
    }

    const currency = lines[0].currency;
    if (lines.some((line) => line.currency !== currency)) return { status: 409, body: { error: "Mixed currencies are not supported in one checkout." } };
    const subtotal = lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0);
    const address = normalizeAddress(body.shippingAddress);
    const checkoutFingerprint = fingerprint(email, address, lines);
    let order: Order;
    try {
      order = await deps.insertOrder({ checkout_attempt_id: attemptId, checkout_fingerprint: checkoutFingerprint, email, shipping_address: address, billing_address: address, subtotal_amount: subtotal, discount_amount: 0, shipping_amount: 0, tax_amount: 0, total_amount: subtotal, currency, status: "pending_payment" });
    } catch (error) {
      if (!(error instanceof DuplicateError)) throw error;
      const existing = await deps.findOrder(attemptId);
      if (!existing || existing.checkout_fingerprint !== checkoutFingerprint || existing.total_amount !== subtotal || existing.currency !== currency || existing.status !== "pending_payment") return { status: 409, body: { error: "This checkout attempt cannot be reused." } };
      order = existing;
    }

    await deps.upsertItems(lines.map((line) => ({ order_id: order.id, variant_id: line.variantId, sku: line.sku, product_name: line.productName, option_values: {}, quantity: line.quantity, unit_price_amount: line.unitAmount, line_total_amount: line.unitAmount * line.quantity, currency: line.currency })));
    let payment: Payment;
    try {
      payment = await deps.insertPayment({ order_id: order.id, provider: "stripe", amount: order.total_amount, currency: order.currency, status: "pending", verified: false });
    } catch (error) {
      if (!(error instanceof DuplicateError)) throw error;
      const existing = await deps.findPayment(order.id);
      if (!existing) throw new PersistenceError("Payment lookup failed");
      payment = existing;
    }

    let stripeSession: StripeSession;
    if (payment.provider_checkout_session_id) {
      stripeSession = await deps.retrieveStripeSession(payment.provider_checkout_session_id);
    } else {
      const params = new URLSearchParams();
      params.set("mode", "payment");
      params.set("success_url", `${baseUrl}/shop/order/${order.order_number}?session_id={CHECKOUT_SESSION_ID}`);
      params.set("cancel_url", `${baseUrl}/shop/cart?checkout=cancelled`);
      params.set("customer_email", email);
      params.set("client_reference_id", order.id);
      params.set("metadata[order_id]", order.id);
      params.set("metadata[checkout_attempt_id]", attemptId);
      lines.forEach((line, index) => {
        params.set(`line_items[${index}][price_data][currency]`, line.currency.toLowerCase());
        params.set(`line_items[${index}][price_data][product_data][name]`, line.productName);
        params.set(`line_items[${index}][price_data][product_data][metadata][sku]`, line.sku);
        params.set(`line_items[${index}][price_data][unit_amount]`, String(line.unitAmount));
        params.set(`line_items[${index}][quantity]`, String(line.quantity));
      });
      stripeSession = await deps.createStripeSession(params, `qs_checkout_${attemptId}_${checkoutFingerprint}`);
      await deps.recordSession(payment.id, stripeSession.id);
    }

    if (!stripeSession.id || !stripeSession.url || (stripeSession.status && stripeSession.status !== "open")) return { status: 409, body: { error: "This checkout session is no longer available." } };
    return { status: 200, body: { checkoutUrl: stripeSession.url, orderNumber: order.order_number } };
  } catch (error) {
    if (error instanceof StripeError) return { status: 502, body: { error: "Stripe could not create checkout." } };
    if (error instanceof PersistenceError) return { status: 503, body: { error: "Checkout could not be persisted. Retry the same checkout attempt." } };
    return { status: 500, body: { error: "Checkout could not be completed." } };
  }
}

// Supabase is intentionally untyped here because this server-only API is outside the generated browser schema.
function realDependencies(supabase: any, stripeSecret: string): CheckoutDependencies {
  const required = <T>(data: T | null, error: { code?: string; message?: string } | null, message: string): T => {
    if (error?.code === "23505") throw new DuplicateError(message);
    if (error || data === null) throw new PersistenceError(message);
    return data;
  };
  const stripeRequest = async (url: string, init: { method: string; headers: Record<string, string>; body?: URLSearchParams }): Promise<StripeSession> => {
    const response = await fetch(url, init);
    const session = await response.json() as StripeSession;
    if (!response.ok || !session.id || !session.url) throw new StripeError("Stripe request failed");
    return session;
  };
  return {
    async loadVariants(ids) { const { data, error } = await supabase.from("commerce_variants").select("id,sku,price_amount,currency,status,inventory_policy,product_id,commerce_products!inner(id,name,slug,lifecycle_status,merchandising_status,publication_state)").in("id", ids); return required(data as Variant[] | null, error, "Variant read failed"); },
    async loadInventory(variantId) { const { data, error } = await supabase.from("commerce_inventory").select("available").eq("variant_id", variantId).maybeSingle(); if (error) throw new PersistenceError("Inventory read failed"); return data ? Number((data as { available: number }).available) : null; },
    async insertOrder(value) { const { data, error } = await supabase.from("commerce_orders").insert(value).select("id,order_number,total_amount,currency,status,checkout_fingerprint").single(); return required(data as Order | null, error, "Order insert failed"); },
    async findOrder(attemptId) { const { data, error } = await supabase.from("commerce_orders").select("id,order_number,total_amount,currency,status,checkout_fingerprint").eq("checkout_attempt_id", attemptId).maybeSingle(); if (error) throw new PersistenceError("Order lookup failed"); return data as Order | null; },
    async upsertItems(values) { const { error } = await supabase.from("commerce_order_items").upsert(values, { onConflict: "order_id,variant_id" }); if (error) throw new PersistenceError("Order item persistence failed"); },
    async insertPayment(value) { const { data, error } = await supabase.from("commerce_payments").insert(value).select("id,provider_checkout_session_id").single(); return required(data as Payment | null, error, "Payment insert failed"); },
    async findPayment(orderId) { const { data, error } = await supabase.from("commerce_payments").select("id,provider_checkout_session_id").eq("order_id", orderId).eq("provider", "stripe").maybeSingle(); if (error) throw new PersistenceError("Payment lookup failed"); return data as Payment | null; },
    async recordSession(paymentId, sessionId) { const { data, error } = await supabase.from("commerce_payments").update({ provider_checkout_session_id: sessionId }).eq("id", paymentId).select("id").single(); required(data, error, "Payment session persistence failed"); },
    async createStripeSession(params, idempotencyKey) { return stripeRequest("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${stripeSecret}`, "Content-Type": "application/x-www-form-urlencoded", "Idempotency-Key": idempotencyKey }, body: params }); },
    async retrieveStripeSession(sessionId) { return stripeRequest(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, { method: "GET", headers: { Authorization: `Bearer ${stripeSecret}` } }); },
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeSecret || !supabaseUrl || !serviceKey) return res.status(503).json({ error: "Commerce checkout is not configured." });
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const result = await processCheckout(req.body, requestOrigin(req), realDependencies(supabase, stripeSecret));
  return res.status(result.status).json(result.body);
}
