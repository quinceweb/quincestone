import { useEffect } from "react";

const configuredPaymentUrl = import.meta.env.VITE_PAYMENT_URL as string | undefined;
const paymentUrl = configuredPaymentUrl || "https://book.stripe.com/14A8wPdTc9st1qvbVq4AU00";

export function Checkout() {
  useEffect(() => {
    window.location.replace(paymentUrl);
  }, []);

  return (
    <section className="form-page checkout-page">
      <p className="eyebrow">QUINCESTONE / EDGE ASSESSMENT</p>
      <h1>Secure checkout.</h1>
      <p className="lede">A focused 30-minute assessment of where your website or application can better understand intent, qualify demand, and route work.</p>
      <div className="checkout-panel">
        <div><span>ONE-TIME</span><strong>$49</strong><small>USD</small></div>
        <p className="form-status">Redirecting to Stripe-hosted checkout…</p>
      </div>
      <p className="checkout-boundary">Payments are handled by Stripe-hosted checkout. Quincestone does not collect card details on this page.</p>
    </section>
  );
}
