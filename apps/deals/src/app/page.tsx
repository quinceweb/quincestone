import Link from "next/link";

const capabilities = [
  ["Deal graph", "Canonical typed model for parties, offers, terms, decisions, events and outcomes."],
  ["Negotiation", "Version-ready offers and term states without overwriting commercial history."],
  ["Authority", "Explicit decision and approval objects; no implied authority."],
  ["Execution readiness", "Readiness is derived from known state. Payment remains disconnected."],
];
export default function HomePage() {
  return <main>
    <section className="hero shell">
      <div className="eyebrow"><span className="signal"/> QUINCESTONE DEALS · QDE 3.0 FOUNDATION</div>
      <h1>Business deals deserve<br/>a system of record.</h1>
      <p className="hero-copy">Every offer. Every change. Every decision. One commercial truth.</p>
      <div className="hero-actions"><Link className="button button-primary" href="/new">Create a deal</Link><Link className="button button-secondary" href="/deals">Open workspace</Link></div>
      <div className="truth-bar"><strong>Current production truth</strong><span>Drafting is browser-local. Persistent deal rooms, counterparty identity, approvals, signatures and payments are not connected yet.</span></div>
    </section>
    <section className="shell operating-model" id="product"><div className="section-kicker">Negotiated commerce OS</div><h2>Intent → structure → negotiation → authority → outcome.</h2><p className="lead">Quincestone Deals is being built around the deal itself: a living commercial record rather than fragments spread across inboxes, chats, documents and memory.</p><div className="capability-grid">{capabilities.map(([title,copy])=><article key={title}><span>QDE</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="shell workspace-preview"><div><div className="section-kicker">Operational surfaces</div><h2>Work from what requires action.</h2></div><div className="surface-links"><Link href="/deals"><strong>Portfolio</strong><span>Search, filter and open verified deals.</span></Link><Link href="/inbox"><strong>Decision inbox</strong><span>Action, waiting, approvals and expiry.</span></Link><Link href="/new"><strong>Composer 2.0</strong><span>Structure commercial intent without pretending it is binding.</span></Link></div></section>
  </main>;
}
