import { describe, expect, it, vi } from "vitest";
import { DuplicateError, PersistenceError, StripeError, processCheckout, type CheckoutDependencies } from "../api/commerce-checkout";

const attemptId = "11111111-1111-4111-8111-111111111111";
const variantId = "22222222-2222-4222-8222-222222222222";
const product = { lifecycle_status: "active", merchandising_status: "published", publication_state: "published", name: "Trusted product" };
const request = { checkoutAttemptId: attemptId, email: "buyer@example.com", items: [{ variantId, quantity: 2 }] };

function dependencies(overrides: Partial<CheckoutDependencies> = {}) {
  let order: Awaited<ReturnType<CheckoutDependencies["insertOrder"]>> | undefined;
  let payment: Awaited<ReturnType<CheckoutDependencies["insertPayment"]>> | undefined;
  const deps: CheckoutDependencies = {
    loadVariants: vi.fn(async () => [{ id: variantId, sku: "SKU-1", price_amount: 2500, currency: "usd", status: "active", inventory_policy: "tracked", commerce_products: product }]),
    loadInventory: vi.fn(async () => 10),
    insertOrder: vi.fn(async (value) => (order = { id: "order-1", order_number: 42, total_amount: value.total_amount as number, currency: value.currency as string, status: "pending_payment", checkout_fingerprint: value.checkout_fingerprint as string })),
    findOrder: vi.fn(async () => order || null),
    upsertItems: vi.fn(async () => undefined),
    insertPayment: vi.fn(async () => (payment = { id: "payment-1", provider_checkout_session_id: null })),
    findPayment: vi.fn(async () => payment || null),
    recordSession: vi.fn(async (_id, sessionId) => { if (!payment) throw new PersistenceError("missing payment"); payment.provider_checkout_session_id = sessionId; }),
    createStripeSession: vi.fn(async () => ({ id: "cs_test_1", url: "https://checkout.stripe.test/session", status: "open" })),
    retrieveStripeSession: vi.fn(async () => ({ id: "cs_test_1", url: "https://checkout.stripe.test/session", status: "open" })),
    ...overrides,
  };
  return deps;
}

describe("commerce checkout", () => {
  it("creates a normal checkout from trusted catalog amounts", async () => {
    const deps = dependencies();
    const result = await processCheckout({ ...request, total: 1, unitPrice: 1, currency: "eur", paymentStatus: "paid" }, "https://shop.example", deps);
    expect(result.status).toBe(200);
    expect(deps.insertOrder).toHaveBeenCalledWith(expect.objectContaining({ total_amount: 5000, currency: "USD", status: "pending_payment" }));
    expect(deps.createStripeSession).toHaveBeenCalledWith(expect.any(URLSearchParams), expect.stringMatching(/^qs_checkout_11111111-.*_[0-9a-f]{64}$/));
    const params = vi.mocked(deps.createStripeSession).mock.calls[0][0];
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe("2500");
    expect(params.get("metadata[order_id]")).toBe("order-1");
  });

  it("reuses one order and Stripe Session for the same logical retry", async () => {
    const deps = dependencies();
    expect((await processCheckout(request, "https://shop.example", deps)).status).toBe(200);
    vi.mocked(deps.insertOrder).mockRejectedValueOnce(new DuplicateError("duplicate"));
    vi.mocked(deps.insertPayment).mockRejectedValueOnce(new DuplicateError("duplicate"));
    expect((await processCheckout(request, "https://shop.example", deps)).status).toBe(200);
    expect(deps.createStripeSession).toHaveBeenCalledTimes(1);
    expect(deps.retrieveStripeSession).toHaveBeenCalledTimes(1);
  });

  it("rejects an invalid or missing variant", async () => {
    const deps = dependencies({ loadVariants: vi.fn(async () => []) });
    expect((await processCheckout(request, "https://shop.example", deps)).status).toBe(409);
  });

  it("rejects unpublished or inactive catalog state", async () => {
    const deps = dependencies({ loadVariants: vi.fn(async () => [{ id: variantId, sku: "SKU", price_amount: 2500, currency: "USD", status: "active", inventory_policy: "tracked", commerce_products: { ...product, publication_state: "draft" } }]) });
    expect((await processCheckout(request, "https://shop.example", deps)).status).toBe(409);
  });

  it.each([0, -1, 1.5, 21, "2"])("rejects invalid quantity %p", async (quantity) => {
    const deps = dependencies();
    expect((await processCheckout({ ...request, items: [{ variantId, quantity }] }, "https://shop.example", deps)).status).toBe(400);
    expect(deps.loadVariants).not.toHaveBeenCalled();
  });

  it("rejects insufficient tracked inventory", async () => {
    const deps = dependencies({ loadInventory: vi.fn(async () => 1) });
    expect((await processCheckout(request, "https://shop.example", deps)).status).toBe(409);
  });

  it("handles order insert failure without creating Stripe state", async () => {
    const deps = dependencies({ insertOrder: vi.fn(async () => { throw new PersistenceError("db"); }) });
    expect((await processCheckout(request, "https://shop.example", deps)).status).toBe(503);
    expect(deps.createStripeSession).not.toHaveBeenCalled();
  });

  it("handles order-item persistence failure without creating Stripe state", async () => {
    const deps = dependencies({ upsertItems: vi.fn(async () => { throw new PersistenceError("db"); }) });
    expect((await processCheckout(request, "https://shop.example", deps)).status).toBe(503);
    expect(deps.createStripeSession).not.toHaveBeenCalled();
  });

  it("handles payment placeholder failure without creating Stripe state", async () => {
    const deps = dependencies({ insertPayment: vi.fn(async () => { throw new PersistenceError("db"); }) });
    expect((await processCheckout(request, "https://shop.example", deps)).status).toBe(503);
    expect(deps.createStripeSession).not.toHaveBeenCalled();
  });

  it("handles Stripe Session creation failure explicitly", async () => {
    const deps = dependencies({ createStripeSession: vi.fn(async () => { throw new StripeError("stripe"); }) });
    expect((await processCheckout(request, "https://shop.example", deps)).status).toBe(502);
    expect(deps.recordSession).not.toHaveBeenCalled();
  });

  it("retains recoverable state and fails if Session persistence fails", async () => {
    const deps = dependencies({ recordSession: vi.fn(async () => { throw new PersistenceError("db"); }) });
    const result = await processCheckout(request, "https://shop.example", deps);
    expect(result.status).toBe(503);
    expect(result.body).not.toHaveProperty("checkoutUrl");
    expect(deps.createStripeSession).toHaveBeenCalledTimes(1);
  });

  it("uses the same bounded Stripe key for concurrent duplicate attempts", async () => {
    let savedOrder: Awaited<ReturnType<CheckoutDependencies["insertOrder"]>> | undefined;
    let savedPayment: Awaited<ReturnType<CheckoutDependencies["insertPayment"]>> | undefined;
    const keys: string[] = [];
    const deps = dependencies({
      insertOrder: vi.fn(async (value) => { if (savedOrder) throw new DuplicateError("duplicate"); const created = { id: "order-1", order_number: 42, total_amount: Number(value.total_amount), currency: String(value.currency), status: "pending_payment", checkout_fingerprint: String(value.checkout_fingerprint) }; savedOrder = created; return created; }),
      findOrder: vi.fn(async () => savedOrder || null),
      insertPayment: vi.fn(async () => { if (savedPayment) throw new DuplicateError("duplicate"); savedPayment = { id: "payment-1", provider_checkout_session_id: null }; return savedPayment; }),
      findPayment: vi.fn(async () => savedPayment || null),
      createStripeSession: vi.fn(async (_params, key) => { keys.push(key); return { id: "cs_test_same", url: "https://checkout.stripe.test/same", status: "open" }; }),
      recordSession: vi.fn(async (_id, sessionId) => { if (!savedPayment) throw new PersistenceError("missing payment"); savedPayment.provider_checkout_session_id = sessionId; }),
    });
    const [first, second] = await Promise.all([processCheckout(request, "https://shop.example", deps), processCheckout(request, "https://shop.example", deps)]);
    expect([first.status, second.status]).toEqual([200, 200]);
    expect(new Set(keys).size).toBeLessThanOrEqual(1);
    expect(savedOrder?.id).toBe("order-1");
  });

  it("rejects a reused attempt when trusted commerce state changed", async () => {
    const deps = dependencies();
    await processCheckout(request, "https://shop.example", deps);
    vi.mocked(deps.insertOrder).mockRejectedValueOnce(new DuplicateError("duplicate"));
    vi.mocked(deps.loadVariants).mockResolvedValueOnce([{ id: variantId, sku: "SKU-1", price_amount: 3000, currency: "USD", status: "active", inventory_policy: "tracked", commerce_products: product }]);
    const result = await processCheckout(request, "https://shop.example", deps);
    expect(result.status).toBe(409);
    expect(result.body.renewCheckoutAttempt).toBe(true);
  });

  it("renews an attempt whose persisted Stripe Session is no longer open", async () => {
    const deps = dependencies({ retrieveStripeSession: vi.fn(async () => ({ id: "cs_test_1", url: "https://checkout.stripe.test/session", status: "expired" })) });
    expect((await processCheckout(request, "https://shop.example", deps)).status).toBe(200);
    vi.mocked(deps.insertOrder).mockRejectedValueOnce(new DuplicateError("duplicate"));
    vi.mocked(deps.insertPayment).mockRejectedValueOnce(new DuplicateError("duplicate"));
    const result = await processCheckout(request, "https://shop.example", deps);
    expect(result.status).toBe(409);
    expect(result.body.renewCheckoutAttempt).toBe(true);
  });

  it("does not expose internal persistence details", async () => {
    const deps = dependencies({ insertOrder: vi.fn(async () => { throw new PersistenceError("secret database detail"); }) });
    const result = await processCheckout(request, "https://shop.example", deps);
    expect(JSON.stringify(result.body)).not.toContain("secret database detail");
  });
});
