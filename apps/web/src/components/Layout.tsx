import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "../marketing.css";
import "../web-reconciliation.css";

type Item = { label: string; to: string; description: string };
type Group = { label: string; items: Item[] };

// Public navigation follows the canonical Discover → Build → Operate → Scale model.
// Deeper internal capabilities remain available through these outcome-oriented paths.
const groups: Group[] = [
  {
    label: "Discover",
    items: [
      ["Start with an assessment", "/assessment", "Find the customer journey and opportunity worth improving first."],
      ["Customer journeys", "/platform", "Understand demand and connect it to a useful next action."],
      ["Industries", "/industries", "See how the model applies across real operating contexts."],
    ].map(([label, to, description]) => ({ label, to, description })),
  },
  {
    label: "Build",
    items: [
      ["Quincestone for Business", "/business", "Assessment, structure, website, Edge, and operations."],
      ["Quincestone Edge", "/edge", "Governed intelligence between customer demand and business operations."],
      ["Commerce", "/commerce", "Demand-led product discovery, validation, sourcing, and shop."],
      ["Knowledge & policy", "/knowledge", "Give the system the context and boundaries required to act well."],
    ].map(([label, to, description]) => ({ label, to, description })),
  },
  {
    label: "Operate",
    items: [
      ["Workflows", "/workflows", "Move qualified work through explicit, governed processes."],
      ["Qualification", "/qualification", "Structure the information required for better decisions."],
      ["Human review", "/escalations", "Keep consequential judgment explicit where it matters."],
      ["Operations", "/operations", "Understand what is happening and what should happen next."],
    ].map(([label, to, description]) => ({ label, to, description })),
  },
  {
    label: "Scale",
    items: [
      ["Demo", "/demo", "Experience the fictional Northstone Roofing journey."],
      ["Shop", "/shop", "Explore products selected through the Quincestone commerce model."],
      ["About Quincestone", "/about", "Understand the company, principles, and operating model."],
      ["Contact", "/contact", "Talk with Quincestone about what you want to improve."],
    ].map(([label, to, description]) => ({ label, to, description })),
  },
];

function Chevron() {
  return <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <img className={compact ? "brand-logo compact" : "brand-logo"} src="/quincestone-logo.svg" alt="Quincestone" />;
}

function ShopHeader({ closeAll }: { closeAll: () => void }) {
  return <header className="shop-header">
    <Link className="shop-brand" to="/" aria-label="Quincestone Shop home" onClick={closeAll}><Logo /><span>SHOP</span></Link>
    <nav aria-label="Shop navigation" className="shop-nav">
      <NavLink to="/shop">Discover</NavLink><NavLink to="/shop/new">New</NavLink><NavLink to="/shop/best-sellers">Best sellers</NavLink><NavLink to="/commerce">Our selection</NavLink>
    </nav>
    <div className="shop-actions"><a href="https://app.quincestone.com/sign-in" className="text-link">Account</a><Link className="shop-cart" to="/shop/cart" aria-label="Open cart">Cart · 0</Link></div>
  </header>;
}

export function Layout() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpenGroup(null); setMobileOpen(false); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeAll = () => { setOpenGroup(null); setMobileOpen(false); setMobileGroup(null); };
  const isShop = typeof window !== "undefined" && window.location.hostname.toLowerCase() === "shop.quincestone.com";

  if (isShop) return <div className="site-shell shop-shell">
    <a className="skip-link" href="#content">Skip to content</a><ShopHeader closeAll={closeAll} /><main id="content"><Outlet /></main>
    <footer className="shop-footer"><div><Link to="/"><Logo compact /></Link><p>Better products. Better value. Built around the customer.</p></div><div><Link to="/commerce">How we select products</Link><Link to="/shop/cart">Cart · 0</Link><Link to="/contact">Contact Quincestone</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div><div><span>Part of One Quincestone.</span><Link to="/">Company →</Link></div></footer>
  </div>;

  return <div className="site-shell">
    <a className="skip-link" href="#content">Skip to content</a>
    <header className={scrolled ? "marketing-header scrolled" : "marketing-header"}>
      <Link className="brand" to="/" aria-label="Quincestone home" onClick={closeAll}><Logo /></Link>
      <nav className="marketing-nav" aria-label="Primary navigation">
        {groups.map((group) => <div className="nav-group" key={group.label} data-open={openGroup === group.label}>
          <button className="nav-trigger" aria-expanded={openGroup === group.label} onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}>{group.label}<Chevron /></button>
          <div className="nav-popover" role="menu" onMouseLeave={() => setOpenGroup(null)}>
            {group.items.map((item) => <NavLink key={item.label} to={item.to} role="menuitem" onClick={closeAll}><strong>{item.label}</strong><small>{item.description}</small></NavLink>)}
          </div>
        </div>)}
        <NavLink to="/demo" onClick={closeAll}>Demo</NavLink>
      </nav>
      <div className="marketing-actions"><a className="text-link sign-in-link" href="https://app.quincestone.com/sign-in">Sign in</a><Link className="button small" to="/assessment">Get started</Link></div>
      <button className="marketing-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-panel" onClick={() => setMobileOpen((value) => !value)}><span /></button>
      <div id="mobile-panel" className="mobile-panel" data-open={mobileOpen}>
        {groups.map((group) => <div className="mobile-section" key={group.label}><button aria-expanded={mobileGroup === group.label} onClick={() => setMobileGroup(mobileGroup === group.label ? null : group.label)}>{group.label}<Chevron /></button><div className="mobile-sub" data-open={mobileGroup === group.label}>{group.items.map((item) => <NavLink key={item.label} to={item.to} onClick={closeAll}>{item.label}</NavLink>)}</div></div>)}
        <NavLink to="/demo" onClick={closeAll}>Demo</NavLink><a className="text-link mobile-sign-in" href="https://app.quincestone.com/sign-in" onClick={closeAll}>Sign in</a><Link className="button mobile-cta" to="/assessment" onClick={closeAll}>Get started</Link>
      </div>
    </header>
    <main id="content"><Outlet /></main>
    <footer className="footer-new"><div className="footer-grid">
      <div className="footer-brand"><Link className="brand" to="/" onClick={closeAll}><Logo compact /></Link><p>Turn demand into outcomes.</p><p className="footer-company">Commerce + operating systems.</p></div>
      {groups.map((group) => <div key={group.label}><h3>{group.label}</h3>{group.items.slice(0, 6).map((item) => <Link key={item.label} to={item.to}>{item.label}</Link>)}</div>)}
      <div><h3>Company</h3><a href="https://app.quincestone.com/sign-in">Sign in</a><Link to="/assessment">Get started</Link><Link to="/contact">Contact</Link><h3 style={{ marginTop: "1.5rem" }}>Legal</h3><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/cookies">Cookies</Link></div>
    </div><div className="footer-bottom"><span>© Quincestone · Built by Quinceweb</span><span>quincestone.com <a href="mailto:hello@quincestone.com">Contact</a></span></div></footer>
  </div>;
}
