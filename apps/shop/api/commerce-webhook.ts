import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

async function rawBody(req: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function verifyStripeSignature(payload: Buffer, header: string, secret: string) {
  const parts = header.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0) return false;

  const parsedTimestamp = Number(timestamp);
  const age = Math.abs(Math.floor(Date.now() / 1000) - parsedTimestamp);
  if (!Number.isFinite(parsedTimestamp) || age > 300) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload.toString("utf8")}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return signatures.some((signature) => {
    if (!/^[0-9a-f]{64}$/i.test(signature)) return false;
    const received = Buffer.from(signature, "hex");
    return received.length === expectedBuffer.length && timingSafeEqual(expectedBuffer, received);
  });
}

function orderIdFrom(object: any) {
  return typeof object?.metadata?.order_id === "string"
    ? object.metadata.order_id
    : typeof object?.client_reference_id === "string"
      ? object.client_reference_id
      : null;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const signature = req.headers?.["stripe-signature"];

  if (!secret || !supabaseUrl || !serviceKey) {
    return res.status(503).json({ error: "Commerce webhook is not configured." });
  }
  if (typeof signature !== "string") {
    return res.status(400).json({ error: "Missing Stripe signature." });
  }

  const payload = await rawBody(req);
  if (!verifyStripeSignature(payload, signature, secret)) {
    return res.status(400).json({ error: "Invalid Stripe signature." });
  }

  let event: { id: string; type: string; data: { object: any } };
  try {
    event = JSON.parse(payload.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Webhook payload is invalid." });
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const object = event.data.object;

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const orderId = orderIdFrom(object);
      if (!orderId) return res.status(200).json({ received: true, reconciled: false });
      if (object.payment_status !== "paid") {
        return res.status(200).json({ received: true, reconciled: false, awaiting_payment: true });
      }

      const { data: payment, error: paymentReadError } = await supabase
        .from("commerce_payments")
        .select("id,status,verified")
        .eq("provider_checkout_session_id", object.id)
        .eq("order_id", orderId)
        .maybeSingle();
      if (paymentReadError) throw paymentReadError;
      if (!payment) return res.status(409).json({ error: "Payment record not found." });

      if (payment.status === "succeeded" && payment.verified) {
        return res.status(200).json({ received: true, duplicate: true });
      }

      const { error: paymentUpdateError } = await supabase
        .from("commerce_payments")
        .update({
          provider_event_id: event.id,
          provider_payment_intent_id: typeof object.payment_intent === "string" ? object.payment_intent : null,
          verified: true,
          status: "succeeded",
        })
        .eq("id", payment.id);
      if (paymentUpdateError) throw paymentUpdateError;

      const { error: orderUpdateError } = await supabase
        .from("commerce_orders")
        .update({ status: "fulfillment_required", paid_at: new Date().toISOString() })
        .eq("id", orderId)
        .eq("status", "pending_payment");
      if (orderUpdateError) throw orderUpdateError;

      const { data: fulfillment, error: fulfillmentReadError } = await supabase
        .from("commerce_fulfillments")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle();
      if (fulfillmentReadError) throw fulfillmentReadError;

      if (!fulfillment) {
        const { error: fulfillmentInsertError } = await supabase
          .from("commerce_fulfillments")
          .insert({ order_id: orderId, source: "supplier", status: "required" });
        if (fulfillmentInsertError && fulfillmentInsertError.code !== "23505") throw fulfillmentInsertError;
      }

      return res.status(200).json({ received: true, reconciled: true });
    }

    if (event.type === "checkout.session.async_payment_failed" || event.type === "payment_intent.payment_failed") {
      const orderId = orderIdFrom(object);
      let paymentQuery = supabase.from("commerce_payments").select("id,order_id");

      if (event.type === "checkout.session.async_payment_failed") {
        paymentQuery = paymentQuery.eq("provider_checkout_session_id", object.id);
      } else if (typeof object.id === "string") {
        paymentQuery = paymentQuery.eq("provider_payment_intent_id", object.id);
      } else {
        return res.status(200).json({ received: true, reconciled: false });
      }

      const { data: payment, error: paymentReadError } = await paymentQuery.maybeSingle();
      if (paymentReadError) throw paymentReadError;
      const resolvedOrderId = payment?.order_id ?? orderId;

      if (payment) {
        const { error } = await supabase
          .from("commerce_payments")
          .update({ provider_event_id: event.id, verified: true, status: "failed" })
          .eq("id", payment.id);
        if (error) throw error;
      }

      if (resolvedOrderId) {
        const { error } = await supabase
          .from("commerce_orders")
          .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
          .eq("id", resolvedOrderId)
          .eq("status", "pending_payment");
        if (error) throw error;
      }

      return res.status(200).json({ received: true, reconciled: Boolean(payment || resolvedOrderId) });
    }

    if (event.type === "charge.refunded") {
      const paymentIntent = typeof object.payment_intent === "string" ? object.payment_intent : null;
      if (!paymentIntent) return res.status(200).json({ received: true, reconciled: false });

      const { data: payment, error: paymentReadError } = await supabase
        .from("commerce_payments")
        .select("id,order_id,currency")
        .eq("provider_payment_intent_id", paymentIntent)
        .maybeSingle();
      if (paymentReadError) throw paymentReadError;
      if (!payment) return res.status(200).json({ received: true, reconciled: false });

      const refundedAmount = Number(object.amount_refunded || 0);
      const chargeAmount = Number(object.amount || 0);
      const fullyRefunded = chargeAmount > 0 && refundedAmount >= chargeAmount;

      const { error: paymentUpdateError } = await supabase
        .from("commerce_payments")
        .update({
          provider_event_id: event.id,
          status: fullyRefunded ? "refunded" : "partially_refunded",
          verified: true,
        })
        .eq("id", payment.id);
      if (paymentUpdateError) throw paymentUpdateError;

      const refunds = Array.isArray(object.refunds?.data) ? object.refunds.data : [];
      for (const refund of refunds) {
        if (typeof refund?.id !== "string") continue;
        const { data: existing, error: refundReadError } = await supabase
          .from("commerce_refunds")
          .select("id")
          .eq("provider_refund_id", refund.id)
          .maybeSingle();
        if (refundReadError) throw refundReadError;

        if (!existing) {
          const { error: refundInsertError } = await supabase.from("commerce_refunds").insert({
            order_id: payment.order_id,
            payment_id: payment.id,
            provider: "stripe",
            provider_refund_id: refund.id,
            amount: Number(refund.amount || 0),
            currency: typeof refund.currency === "string" ? refund.currency.toUpperCase() : payment.currency,
            status: refund.status === "failed" || refund.status === "canceled" ? refund.status : "succeeded",
          });
          if (refundInsertError && refundInsertError.code !== "23505") throw refundInsertError;
        }
      }

      if (fullyRefunded) {
        const { error: orderUpdateError } = await supabase
          .from("commerce_orders")
          .update({ status: "refunded" })
          .eq("id", payment.order_id);
        if (orderUpdateError) throw orderUpdateError;
      }

      return res.status(200).json({ received: true, reconciled: true });
    }

    return res.status(200).json({ received: true, ignored: true });
  } catch {
    // A 5xx tells Stripe to retry transient database/reconciliation failures.
    return res.status(500).json({ error: "Webhook event could not be reconciled." });
  }
}
