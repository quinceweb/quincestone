import { useEffect, useState } from "react";

const paymentUrl = import.meta.env.VITE_PAYMENT_URL as string | undefined;

export function Checkout() {
  const [status, setStatus] = useState("Preparing secure checkout…");

  useEffect(() => {
    if (!paymentUrl) {
      setStatus("Secure checkout is being configured.");
      return;
    }
    window.location.replace(paymentUrl);
  }, []);

  return (
    <section className="form-page checkout-page">
      <p className="eyebrow">QUINCESTONE / EDGE ASSESSMENT</p>
      <h1>Secure checkout.</h1>
      <p className="lede">A focused 30-minute assessment of where your website or application can better understand intent, qualify demand, and route work.</p>
      <div className="checkout-panel">
        <div><span>ONE-TIME</span><strong>$49</strong><small>USD</small></div>
        <p>{status}</p>
        {!paymentUrl && <p className="form-status">The assessment price is configured in Stripe. The hosted checkout destination still needs to be connected as <code>VITE_PAYMENT_URL</code>. No payment is attempted until that destination is configured.</p>}
        {paymentUrl && <p className="form-status">Redirecting to Stripe-hosted checkout…</p>}
      </div>
      <p className="checkout-boundary">Payments are handled by Stripe-hosted checkout. Quincestone does not collect card details on this page.</p>
    </section>
  );
}
