import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import "../p6-conversion.css";

export function Pricing() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const assessment = params.get("assessment") || "";
  const cancelled = params.get("checkout") === "cancelled";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    if (!assessment) {
      setError("Return to your assessment and submit it before continuing.");
      return;
    }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assessmentReference: assessment }) });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout is unavailable.");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout is unavailable. Please try again.");
      setBusy(false);
    }
  }

  return <section className="p6-page"><p className="eyebrow">QUINCESTONE / NEXT STEP</p><h1>Turn the assessment into a practical implementation.</h1><p className="lede">Your assessment identifies where the journey needs structure. The next step is the initial Quincestone implementation engagement.</p>{cancelled && <div className="p6-notice" role="status">Checkout was cancelled. Nothing was charged. You can return here and try again.</div>}<div className="p6-price"><div><span className="p6-kicker">INITIAL IMPLEMENTATION</span><h2>Quincestone implementation</h2><p>One-time engagement covering the agreed initial operating foundation. The exact scope is confirmed from your assessment.</p></div><div className="p6-price__action"><strong>Continue to secure checkout</strong><button className="button" onClick={checkout} disabled={busy || !assessment}>{busy ? "Opening checkout…" : "Continue to Stripe"}</button>{!assessment && <small>Assessment reference required.</small>}{error && <p className="form-status" role="alert">{error}</p>}</div></div><p className="p6-trust">Payments are processed by Stripe. Quincestone does not receive your card details.</p><Link className="text-link" to="/assessment">Return to assessment →</Link></section>;
}
