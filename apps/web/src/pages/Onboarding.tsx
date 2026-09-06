import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../p6-conversion.css";

type PaymentState = { state: "paid" | "processing" | "expired"; paid: boolean; assessmentReference?: string | null; customerEmail?: string | null; customerName?: string | null; company?: string | null };

export function Onboarding() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const [payment, setPayment] = useState<PaymentState>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    const verify = async () => {
      try {
        const response = await fetch(`/api/payment-status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Payment verification failed.");
        if (active) { setPayment(data); setError(""); }
      } catch (err) { if (active) setError(err instanceof Error ? err.message : "Payment verification failed."); }
    };
    void verify();
    return () => { active = false; };
  }, [sessionId]);

  if (!sessionId) return <section className="p6-page"><p className="eyebrow">ONBOARDING</p><h1>Your checkout session is missing.</h1><p className="lede">No payment was confirmed from this page. Return to pricing to start again.</p><Link className="button" to="/pricing">Return to pricing</Link></section>;

  if (error) return <section className="p6-page"><p className="eyebrow">PAYMENT VERIFICATION</p><h1>We could not verify the payment yet.</h1><p className="lede">Your card is not marked paid by this page. Please retry verification shortly.</p><button className="button" onClick={() => window.location.reload()}>Retry verification</button><p className="form-status" role="alert">{error}</p></section>;
  if (!payment || payment.state === "processing") return <section className="p6-page"><p className="eyebrow">PAYMENT VERIFICATION</p><h1>Confirming your payment.</h1><p className="lede">Stripe is the authority for payment state. We will only unlock onboarding after Stripe reports the session as paid.</p><div className="p6-spinner" role="status">Checking secure payment status…</div></section>;
  if (payment.state === "expired") return <section className="p6-page"><p className="eyebrow">CHECKOUT EXPIRED</p><h1>This checkout session has expired.</h1><p className="lede">Nothing is marked paid from this session. Return to pricing to create a new checkout.</p><Link className="button" to={`/pricing?assessment=${encodeURIComponent(payment.assessmentReference || "")}`}>Return to pricing</Link></section>;

  return <section className="p6-page"><p className="eyebrow">PAYMENT CONFIRMED</p><h1>Welcome to the next Quincestone stage.</h1><p className="lede">Stripe has confirmed payment. We can now collect the implementation details needed to begin.</p><div className="p6-confirmed"><span>Payment status</span><strong>Paid</strong>{payment.customerEmail && <p>Confirmation will be associated with {payment.customerEmail}.</p>}</div><div className="p6-onboarding"><label>What should we connect first?<textarea rows={5} placeholder="Describe the customer journey, workflow, or operating boundary that matters most." /></label><button className="button" type="button">Begin onboarding</button><small>Onboarding submission wiring will be connected to the authenticated operating workspace in the next application stage.</small></div></section>;
}
