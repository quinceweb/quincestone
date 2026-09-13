import { Link } from "react-router-dom";
import "../shop-account.css";

const areas = [
  ["Orders", "Track purchases, delivery, returns, and product support.", "/account/orders"],
  ["Saved", "Keep products and discoveries you want to return to.", "/account/saved"],
  ["Addresses", "Manage delivery addresses when you are signed in.", "/account/addresses"],
  ["Profile", "Keep your Quincestone customer details current.", "/account/profile"],
] as const;

export function ShopAccount() {
  return (
    <section className="shop-account-page">
      <div className="shop-account-hero">
        <div>
          <p className="eyebrow">YOUR QUINCESTONE</p>
          <h1>Your things.<br />Your orders.<br />Your discoveries.</h1>
          <p className="lede">One place to manage your relationship with Quincestone — without turning the Shop into a dashboard.</p>
        </div>
        <aside className="shop-account-signin">
          <span className="shop-account-kicker">CUSTOMER ACCOUNT</span>
          <h2>Sign in to see your account.</h2>
          <p>Orders, saved products, addresses, and support stay connected to your customer account.</p>
          <a className="button" href="https://app.quincestone.com/sign-in">Sign in</a>
          <span className="shop-account-note">Your account remains separate from the public Shop.</span>
        </aside>
      </div>

      <div className="shop-account-rule" />

      <div className="shop-account-section-head">
        <div><p className="eyebrow">ACCOUNT</p><h2>Everything you need, quietly in one place.</h2></div>
        <p>No invented activity. When you are not signed in, Quincestone shows the account state clearly rather than manufacturing an empty history.</p>
      </div>

      <div className="shop-account-grid">
        {areas.map(([title, text, to]) => (
          <Link className="shop-account-card" to={to} key={title}>
            <span>{title}</span>
            <p>{text}</p>
            <strong>Open {title.toLowerCase()} →</strong>
          </Link>
        ))}
      </div>

      <div className="shop-account-lower">
        <div>
          <p className="eyebrow">YOUR PRODUCTS</p>
          <h2>Stay connected to the things you choose.</h2>
          <p>When a purchase is verified, its order and product context can become the starting point for support, returns, and useful follow-up.</p>
        </div>
        <div className="shop-account-links">
          <Link to="/standard">How we choose →</Link>
          <Link to="/support">Get support →</Link>
          <Link to="/returns">Returns →</Link>
        </div>
      </div>
    </section>
  );
}
