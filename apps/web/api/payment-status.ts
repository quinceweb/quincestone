export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: "Payment verification is not configured." });

  const sessionId = typeof req.query?.session_id === "string" ? req.query.session_id : "";
  if (!sessionId || !sessionId.startsWith("cs_")) return res.status(400).json({ error: "A valid checkout session is required." });

  try {
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=payment_intent`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data = await response.json();
    if (!response.ok) return res.status(404).json({ error: "Checkout session not found." });

    const paid = data.payment_status === "paid";
    return res.status(200).json({
      state: paid ? "paid" : data.status === "expired" ? "expired" : "processing",
      paid,
      sessionId: data.id,
      assessmentReference: data.client_reference_id || data.metadata?.assessment_reference || null,
      customerEmail: data.customer_details?.email || data.customer_email || null,
      customerName: data.metadata?.customer_name || data.customer_details?.name || null,
      company: data.metadata?.company || null,
    });
  } catch {
    return res.status(502).json({ error: "Payment status could not be verified." });
  }
}
