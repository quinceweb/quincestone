import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const nav = [
  ["/platform", "Platform"],
  ["/industries", "Industries"],
  ["/process", "Process"],
  ["/demo", "Demo"],
  ["/about", "About"],
] as const;

function Logo({ compact = false }: { compact?: boolean }) {
  return <img className={compact ? "brand-logo compact" : "brand-logo"} src="/quincestone-logo.svg" alt="Quincestone" />;
}

export function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="site-shell">
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="header">
        <Link className="brand" to="/" aria-label="Quincestone home"><Logo /></Link>
        <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="primary-nav">Menu</button>
        <nav id="primary-nav" className={open ? "nav open" : "nav"} aria-label="Primary navigation">
          {nav.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
          <Link className="button small" to="/checkout" onClick={() => setOpen(false)}>Start assessment · $49</Link>
        </nav>
      </header>
      <main id="content"><Outlet /></main>
      <footer className="footer">
        <div><Link className="brand" to="/"><Logo compact /></Link><p>Intelligence between interaction and action.</p></div>
        <div className="footer-links">
          <Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/cookies">Cookies</Link>
        </div>
        <p>Built by Quinceweb · <a href="mailto:hello@quincestone.com">hello@quincestone.com</a></p>
      </footer>
    </div>
  );
}
