import { createClient } from "@supabase/supabase-js";

function parseBody(body: unknown): Record<string, unknown> {
  if (typeof body === "string") return JSON.parse(body) as Record<string, unknown>;
  return (body || {}) as Record<string, unknown>;
}

function origin(req: any) {
  const host = req.headers?.["x-forwarded-host"] || req.headers?.host;
  const proto = req.headers?.["x-forwarded-proto"] || "https";
  return host ? `${proto}://${Array.isArray(host) ? host[0] : host}` : "https://shop.quincestone.com";
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeSecret || !supabaseUrl || !serviceKey) return res.status(503).json({ error: "Commerce checkout is not configured." });

  try {
    const body = parseBody(req.body);
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
    if (!rawItems.length || rawItems.length > 50 || !email || !email.includes("@")) return res.status(400).json({ error: "Valid cart items and email are required." });

    const items = rawItems.map((item) => {
      const value = item && typeof item === "object" ? item as Record<string, unknown> : {};
      return { variantId: typeof value.variantId === "string" ? value.variantId : "", quantity: Math.max(1, Math.min(20, Number(value.quantity || 0))) };
    }).filter((item) => item.variantId && Number.isFinite(item.quantity));
    if (!items.length) return res.status(400).json({ error: "Cart is invalid." });

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const ids = [...new Set(items.map((item) => item.variantId))];
    const { data: variants, error: variantError } = await supabase
      .from("commerce_variants")
      .select("id,sku,price_amount,currency,status,inventory_policy,product_id,commerce_products!inner(id,name,slug,lifecycle_status,merchandising_status,publication_state)")
      .in("id", ids);
    if (variantError || !variants || variants.length !== ids.length) return res.status(409).json({ error: "One or more products are no longer available." });

    const lines: Array<{ variantId: string; sku: string; productName: string; quantity: number; unitAmount: number; currency: string }> = [];
    for (const item of items) {
      const variant = variants.find((candidate: any) => candidate.id === item.variantId) as any;
      const product = Array.isArray(variant?.commerce_products) ? variant.commerce_products[0] : variant?.commerce_products;
      if (!variant || variant.status !== "active" || !variant.price_amount || product?.lifecycle_status !== "active" || product?.merchandising_status !== "published" || product?.publication_state !== "published") return res.status(409).json({ error: "A product is not currently sellable." });
      if (variant.inventory_policy !== "supplier") {
        const { data: inventory } = await supabase.from("commerce_inventory").select("available").eq("variant_id", item.variantId).maybeSingle();
        if (!inventory || inventory.available < item.quantity) return res.status(409).json({ error: "A product does not have verified availability." });
      }
      lines.push({ variantId: item.variantId, sku: variant.sku, productName: product.name, quantity: item.quantity, unitAmount: variant.price_amount, currency: variant.currency });
    }

    const currency = lines[0].currency.toLowerCase();
    if (lines.some((line) => line.currency.toLowerCase() !== currency)) return res.status(409).json({ error: "Mixed currencies are not supported in one checkout." });
    const subtotal = lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0);
    const address = typeof body.shippingAddress === "object" && body.shippingAddress ? body.shippingAddress : {};
    const { data: order, error: orderError } = await supabase.from("commerce_orders").insert({ email, shipping_address: address, billing_address: address, subtotal_amount: subtotal, discount_amount: 0, shipping_amount: 0, tax_amount: 0, total_amount: subtotal, currency: currency.toUpperCase(), status: "pending_payment" }).select("id,order_number,total_amount,currency").single();
    if (orderError || !order) return res.status(500).json({ error: "Order could not be created." });

    const { error: itemError } = await supabase.from("commerce_order_items").insert(lines.map((line) => ({ order_id: order.id, variant_id: line.variantId, sku: line.sku, product_name: line.productName, quantity: line.quantity, unit_price_amount: line.unitAmount, line_total_amount: line.unitAmount * line.quantity, currency: line.currency })));
    if (itemError) {
      await supabase.from("commerce_orders").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", order.id);
      return res.status(500).json({ error: "Order could not be finalized." });
    }

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${origin(req)}/shop/order/${order.order_number}?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${origin(req)}/shop/cart?checkout=cancelled`);
    params.set("customer_email", email);
    params.set("client_reference_id", order.id);
    params.set("metadata[order_id]", order.id);
    lines.forEach((line, index) => {
      params.set(`line_items[${index}][price_data][currency]`, line.currency.toLowerCase());
      params.set(`line_items[${index}][price_data][product_data][name]`, line.productName);
      params.set(`line_items[${index}][price_data][product_data][metadata][sku]`, line.sku);
      params.set(`line_items[${index}][price_data][unit_amount]`, String(line.unitAmount));
      params.set(`line_items[${index}][quantity]`, String(line.quantity));
    });

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${stripeSecret}`, "Content-Type": "application/x-www-form-urlencoded" }, body: params });
    const stripeSession = await stripeResponse.json() as { id?: string; url?: string };
    if (!stripeResponse.ok || !stripeSession.id || !stripeSession.url) {
      await supabase.from("commerce_orders").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", order.id);
      return res.status(502).json({ error: "Stripe could not create checkout." });
    }
    await supabase.from("commerce_payments").insert({ order_id: order.id, provider: "stripe", provider_checkout_session_id: stripeSession.id, amount: order.total_amount, currency: order.currency, status: "pending", verified: false });
    return res.status(200).json({ checkoutUrl: stripeSession.url, orderNumber: order.order_number });
  } catch {
    return res.status(400).json({ error: "Checkout request could not be processed." });
  }
}
