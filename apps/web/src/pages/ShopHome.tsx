import { Link } from "react-router-dom";

const stages = [
  ["Demand", "Start with what customers are actually asking for."],
  ["Discovery", "Evaluate products for utility, value, and fit."],
  ["Validation", "Test carefully before committing to broad inventory."],
  ["Sourcing", "Work with reliable suppliers while increasing control over time."],
];

export function ShopHome() {
  return (
    <section className="shop-page">
      <div className="shop-hero">
        <p className="eyebrow">QUINCESTONE COMMERCE</p>
        <h1>Products worth discovering.</h1>
        <p className="lede">A focused consumer shop built around useful products, considered value, and what customers actually want.</p>
        <div className="actions">
          <a className="button" href="#discover">Explore the shop</a>
          <Link className="text-link" to="/commerce">How Quincestone selects products →</Link>
        </div>
      </div>

      <div id="discover" className="shop-categories" aria-label="Shop categories">
        <Link to="/shop" className="shop-category"><span>Discover</span><small>Products selected through demand and validation.</small></Link>
        <Link to="/shop/new" className="shop-category"><span>New</span><small>Newly introduced products as the catalog grows.</small></Link>
        <Link to="/shop/best-sellers" className="shop-category"><span>Best sellers</span><small>Proven products will appear here when real sales exist.</small></Link>
      </div>

      <div className="shop-status" role="status">
        <strong>The shop is being curated.</strong>
        <span>No products are currently published for sale. We will only show real catalog, price, inventory, and fulfillment information when those systems are ready.</span>
      </div>

      <div className="grid capability-grid shop-principles">
        {stages.map(([title, text]) => <article className="panel" key={title}><p className="eyebrow">{title}</p><p>{text}</p></article>)}
      </div>

      <div className="shop-footer-link"><span>Part of One Quincestone.</span><Link to="/">Return to Quincestone →</Link></div>
    </section>
  );
}
