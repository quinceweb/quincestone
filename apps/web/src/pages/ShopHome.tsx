import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type CollectionKey = "discover" | "new" | "best-sellers";

type ShopCollectionProps = {
  title: string;
  intro: string;
  collection?: CollectionKey;
};

const commerceStandards = [
  ["Product truth", "Only validated, ready-to-sell catalog records can become purchasable."],
  ["Price truth", "Prices appear only when a real commerce price is configured."],
  ["Fulfillment truth", "Availability and delivery claims require real operational state."],
  ["Customer confidence", "Product detail, returns, support, and checkout must be explicit."],
] as const;

function ShopSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="shop-search">
      <span className="sr-only">Search products</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m16 16 5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search products" autoComplete="off" />
    </label>
  );
}

function EmptyCatalog({ query, collection }: { query: string; collection: CollectionKey }) {
  const label = collection === "new" ? "New products" : collection === "best-sellers" ? "Best sellers" : "The catalog";
  return (
    <section className="shop-empty" aria-live="polite">
      <div className="shop-empty-mark"><img src="/favicon.svg" alt="" /></div>
      <div>
        <p className="shop-kicker">{query ? "NO MATCHES" : "CATALOG STATUS"}</p>
        <h2>{query ? `Nothing published matches “${query}”.` : `${label} is being curated.`}</h2>
        <p>
          {query
            ? "Quincestone does not publish placeholder products. Search again when the catalog expands, or return to Discover."
            : "There are no products currently published for sale. We will only show real products with verified pricing, availability, and fulfillment information."}
        </p>
        <div className="shop-empty-actions">
          {collection !== "discover" && <Link className="button" to="/shop">Back to Discover</Link>}
          <Link className="text-link" to="/commerce">How Quincestone selects products →</Link>
        </div>
      </div>
    </section>
  );
}

export function ShopHome() {
  return <ShopCollection title="Products worth discovering." intro="A focused consumer shop built around useful products, considered value, and what customers actually want." collection="discover" />;
}

export function ShopCollection({ title, intro, collection = "discover" }: ShopCollectionProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = useMemo(() => query.trim(), [query]);

  return (
    <section className="shop-page shop-commerce-page">
      <div className="shop-commerce-hero">
        <div className="shop-hero-copy">
          <p className="eyebrow">QUINCESTONE COMMERCE</p>
          <h1>{title}</h1>
          <p className="lede">{intro}</p>
        </div>
        <div className="shop-hero-panel" aria-label="Quincestone commerce standard">
          <div className="shop-hero-panel-top"><span>SHOP / {collection.toUpperCase()}</span><span>VERIFIED CATALOG</span></div>
          <div className="shop-hero-panel-body">
            <span className="shop-panel-index">01</span>
            <div><small>PUBLIC COMMERCE</small><strong>Useful products, presented with evidence.</strong><p>No invented stock, ratings, reviews, discounts, or delivery promises.</p></div>
          </div>
          <div className="shop-hero-panel-foot"><span>DEMAND-LED</span><span>TRUTHFUL</span><span>TRACEABLE</span></div>
        </div>
      </div>

      <nav className="shop-collection-nav" aria-label="Shop collections">
        <Link className={collection === "discover" ? "active" : ""} to="/shop">Discover</Link>
        <Link className={collection === "new" ? "active" : ""} to="/shop/new">New</Link>
        <Link className={collection === "best-sellers" ? "active" : ""} to="/shop/best-sellers">Best sellers</Link>
        <span aria-hidden="true" />
        <Link to="/shop/cart">Cart · 0</Link>
      </nav>

      <div className="shop-discovery-tools">
        <ShopSearch value={query} onChange={setQuery} />
        <div className="shop-tool-status"><span>0 published products</span><span>·</span><span>Checkout unavailable until a real sellable product exists</span></div>
      </div>

      <EmptyCatalog query={normalizedQuery} collection={collection} />

      <section className="shop-standards" aria-labelledby="shop-standards-title">
        <div className="shop-standards-intro">
          <p className="eyebrow">THE QUINCESTONE STANDARD</p>
          <h2 id="shop-standards-title">Commerce should earn trust before asking for the transaction.</h2>
          <p>Shop is built to become a complete buying environment without pretending the catalog is further along than it is.</p>
        </div>
        <div className="shop-standards-grid">
          {commerceStandards.map(([titleText, text], index) => (
            <article key={titleText}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{titleText}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shop-commerce-journey" aria-labelledby="shop-journey-title">
        <div>
          <p className="eyebrow">COMMERCE PATH</p>
          <h2 id="shop-journey-title">Discover → decide → buy → receive → learn.</h2>
        </div>
        <div className="shop-journey-steps">
          {["Discover", "Product", "Compare", "Decide", "Cart", "Checkout", "Order", "Fulfillment", "Support", "Learning"].map((stage, index) => (
            <div key={stage}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage}</strong></div>
          ))}
        </div>
      </section>

      <div className="shop-footer-link"><span>Part of One Quincestone.</span><Link to="/">Return to Quincestone →</Link></div>
    </section>
  );
}

export function ShopCart() {
  return (
    <section className="shop-page shop-cart-page">
      <div className="shop-cart-header"><p className="eyebrow">QUINCESTONE SHOP</p><h1>Your cart is empty.</h1><p className="lede">Products can only enter the cart after they are genuinely published with a verified commerce configuration.</p></div>
      <div className="shop-cart-boundary">
        <div><span>CHECKOUT BOUNDARY</span><strong>No sellable catalog item is configured.</strong><p>Stripe currently has no Quincestone Shop product/price in the connected sandbox, so there is no truthful checkout action to expose yet.</p></div>
        <Link className="button" to="/shop">Continue shopping</Link>
      </div>
    </section>
  );
}
