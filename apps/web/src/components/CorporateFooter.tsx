import { Link } from "react-router-dom";
import "../corporate-footer.css";

type FooterLink = { label: string; to: string; external?: boolean };
type FooterGroup = { label: string; links: FooterLink[] };

const groups: FooterGroup[] = [
  {
    label: "Discover",
    links: [
      { label: "What Quincestone is", to: "/discover" },
      { label: "Assessment", to: "/assessment" },
      { label: "Demand", to: "/discover" },
      { label: "Research", to: "/product-discovery" },
    ],
  },
  {
    label: "Build",
    links: [
      { label: "Build the system", to: "/build" },
      { label: "Business", to: "/business" },
      { label: "Commerce", to: "/commerce" },
      { label: "Intelligence + knowledge", to: "/knowledge" },
    ],
  },
  {
    label: "Operate",
    links: [
      { label: "Operate the model", to: "/operate" },
      { label: "Edge", to: "/edge" },
      { label: "Workflows + routing", to: "/workflows" },
      { label: "Policies + human review", to: "/escalations" },
    ],
  },
  {
    label: "Scale",
    links: [
      { label: "Scale what works", to: "/scale" },
      { label: "Outcomes + analytics", to: "/operations" },
      { label: "Commerce", to: "https://shop.quincestone.com", external: true },
      { label: "About", to: "/about" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Sign in", to: "https://app.quincestone.com/sign-in", external: true },
      { label: "Get started", to: "https://app.quincestone.com/sign-up", external: true },
      { label: "Contact", to: "/contact" },
    ],
  },
];

const legal: FooterLink[] = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
  { label: "Cookies", to: "/cookies" },
  { label: "Security", to: "/security" },
];

function FooterAnchor({ link }: { link: FooterLink }) {
  return link.external ? <a href={link.to}>{link.label}</a> : <Link to={link.to}>{link.label}</Link>;
}

export function isCorporateFooterHost(hostname: string) {
  return hostname.toLowerCase() !== "shop.quincestone.com";
}

export function CorporateFooter() {
  return (
    <footer className="corporate-footer" aria-label="Quincestone corporate footer">
      <div className="corporate-footer__inner">
        <section className="corporate-footer__identity" aria-labelledby="corporate-footer-statement">
          <Link className="corporate-footer__wordmark" to="/" aria-label="Quincestone home">QUINCESTONE</Link>
          <div>
            <p id="corporate-footer-statement" className="corporate-footer__statement">Turn demand into outcomes.</p>
            <p className="corporate-footer__descriptor">Commerce + operating systems.</p>
          </div>
        </section>

        <nav className="corporate-footer__nav corporate-footer__nav--desktop" aria-label="Footer navigation">
          {groups.map((group) => (
            <section className={`corporate-footer__group corporate-footer__group--${group.label.toLowerCase()}`} key={group.label} aria-labelledby={`footer-${group.label.toLowerCase()}`}>
              <h3 id={`footer-${group.label.toLowerCase()}`}>{group.label}</h3>
              <div>{group.links.map((link) => <FooterAnchor key={`${group.label}-${link.label}`} link={link} />)}</div>
            </section>
          ))}
        </nav>

        <nav className="corporate-footer__nav corporate-footer__nav--mobile" aria-label="Footer navigation">
          {groups.map((group) => (
            <details key={group.label} className="corporate-footer__disclosure">
              <summary>{group.label}<span aria-hidden="true">+</span></summary>
              <div>{group.links.map((link) => <FooterAnchor key={`${group.label}-${link.label}`} link={link} />)}</div>
            </details>
          ))}
        </nav>

        <div className="corporate-footer__utility">
          <span>© Quincestone</span>
          <nav aria-label="Legal"><div>{legal.map((link) => <FooterAnchor key={link.label} link={link} />)}</div></nav>
        </div>
      </div>
    </footer>
  );
}
