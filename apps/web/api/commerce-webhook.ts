import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

async function rawBody(req: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function verifyStripeSignature(payload: Buffer, header: string, secret: string) {
  const parts = header.split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signature = parts.find((part) => part.startsWith("v1="))?.slice(3);
  if (!timestamp || !signature) return false;
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload.toString("utf8")}`).digest("hex");
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(signature, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const signature = req.headers?.["stripe-signature"];
  if (!secret || !supabaseUrl || !serviceKey) return res.status(503).json({ error: "Commerce webhook is not configured." });
  if (typeof signature !== "string") return res.status(400).json({ error: "Missing Stripe signature." });
  const payload = await rawBody(req);
  if (!verifyStripeSignature(payload, signature, secret)) return res.status(400).json({ error: "Invalid Stripe signature." });

  try {
    const event = JSON.parse(payload.toString("utf8")) as { id: string; type: string; data: { object: any } };
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const object = event.data.object;

    if (event.type === "checkout.session.completed") {
      const orderId = typeof object.metadata?.order_id === "string" ? object.metadata.order_id : object.client_reference_id;
      if (!orderId || object.payment_status !== "paid") return res.status(200).json({ received: true, reconciled: false });
      const { data: existing } = await supabase.from("commerce_payments").select("id,verified").eq("provider_event_id", event.id).maybeSingle();
      if (existing?.verified) return res.status(200).json({ received: true, duplicate: true });
      const { data: payment } = await supabase.from("commerce_payments").select("id").eq("provider_checkout_session_id", object.id).eq("order_id", orderId).maybeSingle();
      if (!payment) return res.status(409).json({ error: "Payment record not found." });
      await supabase.from("commerce_payments").update({ provider_event_id: event.id, provider_payment_intent_id: typeof object.payment_intent === "string" ? object.payment_intent : null, verified: true, status: "succeeded" }).eq("id", payment.id);
      await supabase.from("commerce_orders").update({ status: "fulfillment_required", paid_at: new Date().toISOString() }).eq("id", orderId);
      const { data: fulfillment } = await supabase.from("commerce_fulfillments").select("id").eq("order_id", orderId).maybeSingle();
      if (!fulfillment) await supabase.from("commerce_fulfillments").insert({ order_id: orderId, source: "supplier", status: "required" });
      return res.status(200).json({ received: true, reconciled: true });
    }

    if (event.type === "payment_intent.payment_failed") {
      const { data: payment } = await supabase.from("commerce_payments").select("id,order_id").eq("provider_payment_intent_id", object.id).maybeSingle();
      if (payment) {
        await supabase.from("commerce_payments").update({ provider_event_id: event.id, verified: true, status: "failed" }).eq("id", payment.id);
        await supabase.from("commerce_orders").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", payment.order_id).eq("status", "pending_payment");
      }
      return res.status(200).json({ received: true });
    }

    if (event.type === "charge.refunded") {
      const paymentIntent = typeof object.payment_intent === "string" ? object.payment_intent : null;
      if (paymentIntent) {
        const { data: payment } = await supabase.from("commerce_payments").select("id,order_id,currency").eq("provider_payment_intent_id", paymentIntent).maybeSingle();
        if (payment) {
          const amount = Number(object.amount_refunded || 0);
          await supabase.from("commerce_payments").update({ provider_event_id: event.id, status: amount >= Number(object.amount || 0) ? "refunded" : "partially_refunded", verified: true }).eq("id", payment.id);
          const { data: refund } = await supabase.from("commerce_refunds").select("id").eq("provider_refund_id", event.id).maybeSingle();
          if (!refund) await supabase.from("commerce_refunds").insert({ order_id: payment.order_id, payment_id: payment.id, provider: "stripe", provider_refund_id: event.id, amount, currency: payment.currency, status: "succeeded" });
          if (amount >= Number(object.amount || 0)) await supabase.from("commerce_orders").update({ status: "refunded" }).eq("id", payment.order_id);
        }
      }
      return res.status(200).json({ received: true });
    }

    return res.status(200).json({ received: true, ignored: true });
  } catch {
    return res.status(400).json({ error: "Webhook event could not be processed." });
  }
}
