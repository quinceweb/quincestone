import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import "../marketing.css";

type Item = { label: string; to: string; description: string };
type Group = { label: string; items: Item[] };

const APP_URL = "https://app.quincestone.com";

const groups: Group[] = [
  { label: "Platform", items: [
    ["Overview", "/platform", "The Quincestone operating model."],
    ["Intelligence", "/intelligence", "Interpret intent, context, and qualification."],
    ["Knowledge", "/knowledge", "Structure the business information intelligence depends on."],
    ["Policies", "/policies", "Define deterministic business authority."],
    ["Workflows", "/workflow-routing", "Route qualified interaction into governed processes."],
    ["Escalations", "/operations", "Preserve human judgment when required."],
    ["Integrations", "/platform", "Connect operational systems through controlled authority."],
  ].map(([label, to, description]) => ({ label, to, description })) },
  { label: "Solutions", items: [
    ["Customer Intake", "/industries", "Understand incoming requests before operations."],
    ["Qualification", "/qualification", "Apply structured criteria before action."],
    ["Scheduling Intelligence", "/platform", "Determine eligibility before Calendar execution."],
    ["Service Operations", "/workflow-routing", "Route requests into governed workflows."],
    ["Human Escalation", "/operations", "Surface interactions requiring judgment."],
    ["Edge Assessment", "/assessment", "Evaluate where Quincestone fits an existing operation."],
  ].map(([label, to, description]) => ({ label, to, description })) },
  { label: "Resources", items: [
    ["Demo", "/demo", "Experience the Northstone Roofing demonstration."],
    ["Architecture", "/platform", "Understand the intelligence pipeline."],
    ["Security", "/about", "Understand authority and integration boundaries."],
    ["Edge Assessment", "/assessment", "A structured Quincestone assessment."],
  ].map(([label, to, description]) => ({ label, to, description })) },
  { label: "Company", items: [
    ["About", "/about", "Why Quincestone exists."],
    ["Principles", "/about", "The operating principles behind the system."],
    ["Contact", "/contact", "Talk with Quincestone."],
  ].map(([label, to, description]) => ({ label, to, description })) },
];

function Chevron() { return <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>; }
function Logo({ compact = false }: { compact?: boolean }) { return <img className={compact ? "brand-logo compact" : "brand-logo"} src="/quincestone-logo.svg" alt="Quincestone" />; }

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpenGroup(null); setMobileOpen(false); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
    setMobileGroup(null);
    setScrolled(window.scrollY > 12);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeAll = () => { setOpenGroup(null); setMobileOpen(false); setMobileGroup(null); };

  return (
    <div className={isHome ? "site-shell home-shell" : "site-shell"}>
      <a className="skip-link" href="#content">Skip to content</a>
      <header className={scrolled ? "marketing-header scrolled" : "marketing-header"}>
        <Link className="brand" to="/" aria-label="Quincestone home" onClick={closeAll}><Logo /></Link>
        <nav className="marketing-nav" ref={navRef} aria-label="Primary navigation">
          {groups.map((group) => <div className="nav-group" key={group.label} data-open={openGroup === group.label}>
            <button className="nav-trigger" aria-expanded={openGroup === group.label} onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}>
              {group.label}<Chevron />
            </button>
            <div className="nav-popover" role="menu">
              {group.items.map((item) => <NavLink key={item.label} to={item.to} role="menuitem" onClick={closeAll}><strong>{item.label}</strong><small>{item.description}</small></NavLink>)}
            </div>
          </div>)}
          <NavLink to="/demo" onClick={closeAll}>Demo</NavLink>
          <NavLink to="/assessment" onClick={closeAll}>Assessment</NavLink>
        </nav>
        <div className="marketing-actions"><a className="button small" href={APP_URL} target="_blank" rel="noreferrer">Open Quincestone <span aria-hidden="true">↗</span></a></div>
        <button className="marketing-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-panel" onClick={() => setMobileOpen((value) => !value)}><span /></button>
        <div id="mobile-panel" className="mobile-panel" data-open={mobileOpen} aria-hidden={!mobileOpen}>
          {groups.map((group) => <div className="mobile-section" key={group.label}>
            <button aria-expanded={mobileGroup === group.label} onClick={() => setMobileGroup(mobileGroup === group.label ? null : group.label)}>{group.label}<Chevron /></button>
            <div className="mobile-sub" data-open={mobileGroup === group.label}>
              {group.items.map((item) => <NavLink key={item.label} to={item.to} onClick={closeAll}>{item.label}</NavLink>)}
            </div>
          </div>)}
          <NavLink to="/demo" onClick={closeAll}>Demo</NavLink>
          <NavLink to="/assessment" onClick={closeAll}>Assessment</NavLink>
          <a className="button mobile-cta" href={APP_URL} target="_blank" rel="noreferrer" onClick={closeAll}>Open Quincestone <span aria-hidden="true">↗</span></a>
        </div>
      </header>
      <main id="content"><Outlet /></main>
      <footer className="footer-new">
        <div className="footer-grid">
          <div className="footer-brand"><Link className="brand" to="/" onClick={closeAll}><Logo compact /></Link><p>Intelligence between interaction and action.</p><a className="footer-app-entry" href={APP_URL} target="_blank" rel="noreferrer">Open the authenticated control plane ↗</a></div>
          {groups.map((group) => <div key={group.label}><h3>{group.label}</h3>{group.items.slice(0, group.label === "Platform" ? 7 : 6).map((item) => <Link key={item.label} to={item.to}>{item.label}</Link>)}</div>)}
          <div><h3>Product</h3><a href={APP_URL} target="_blank" rel="noreferrer">Open Quincestone ↗</a><Link to="/demo">Experience the Demo</Link><Link to="/assessment">Edge Assessment</Link><h3 style={{ marginTop: "1.5rem" }}>Legal</h3><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/cookies">Cookies</Link></div>
        </div>
        <div className="footer-bottom"><span>© Quincestone · Built by Quinceweb</span><span>quincestone.com <a href="mailto:hello@quincestone.com">Contact</a></span></div>
      </footer>
    </div>
  );
}
