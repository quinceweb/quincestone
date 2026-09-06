const PRICE_ID = "price_1U3dgMDkiDyuKOPPBLvnH3jh";

function origin(req: any): string {
  const forwarded = req.headers?.["x-forwarded-host"] || req.headers?.host;
  const proto = req.headers?.["x-forwarded-proto"] || "https";
  const host = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return host ? `${proto}://${host}` : "https://www.quincestone.com";
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: "Checkout is not configured." });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const assessmentReference = typeof body.assessmentReference === "string" ? body.assessmentReference.slice(0, 120) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    const company = typeof body.company === "string" ? body.company.trim().slice(0, 120) : "";

    if (!assessmentReference) return res.status(400).json({ error: "An assessment reference is required." });

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("line_items[0][price]", PRICE_ID);
    params.set("line_items[0][quantity]", "1");
    params.set("success_url", `${origin(req)}/onboarding?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${origin(req)}/pricing?checkout=cancelled&assessment=${encodeURIComponent(assessmentReference)}`);
    params.set("client_reference_id", assessmentReference);
    params.set("metadata[assessment_reference]", assessmentReference);
    if (email) params.set("customer_email", email);
    if (name) params.set("metadata[customer_name]", name);
    if (company) params.set("metadata[company]", company);

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const data = await response.json();
    if (!response.ok || !data.url) return res.status(502).json({ error: "Stripe could not create checkout." });

    return res.status(200).json({ url: data.url, sessionId: data.id });
  } catch {
    return res.status(400).json({ error: "Checkout request could not be processed." });
  }
}
