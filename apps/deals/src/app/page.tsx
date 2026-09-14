import Link from "next/link";

const flow = [
  ["01", "Compose", "Define the commercial offer: parties, scope, price, terms and expiry."],
  ["02", "Negotiate", "Keep changes, questions and counter-terms attached to the deal itself."],
  ["03", "Approve", "Move from discussion to an explicit accepted commercial state."],
  ["04", "Settle", "Connect deposit or payment execution without breaking the deal record."],
  ["05", "Remember", "Retain the final agreement, activity and outcome as durable commercial context."],
] as const;

export default function HomePage() {
  return (
    <main>
      <section className="hero shell">
        <div className="eyebrow"><span className="signal" /> A Quincestone commerce product</div>
        <h1>Business deals deserve<br />a system of record.</h1>
        <p className="hero-copy">
          Quincestone Deals brings the offer, negotiation, approval and commercial outcome into one deliberate workspace—before fragments disappear into inboxes, chats and spreadsheets.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/new">Create a deal</Link>
          <a className="button button-secondary" href="#product">See how it works</a>
        </div>
        <div className="status-strip" role="note">
          <span>Foundation release</span>
          <strong>Local drafting is available now.</strong>
          <span>Shared records, identity and payments activate in the data phase.</span>
        </div>
      </section>

      <section className="shell thesis" id="product">
        <div className="section-kicker">The commercial layer</div>
        <div className="thesis-grid">
          <h2>Not another CRM.<br />Not another invoice tool.</h2>
          <div>
            <p>A CRM remembers that an opportunity exists. An invoice records what should be paid. Quincestone Deals is designed for the space between them: the actual agreement taking shape.</p>
            <p>One deal can carry the scope, parties, pricing, terms, revision history, approval state, settlement context and final outcome.</p>
          </div>
        </div>
      </section>

      <section className="shell flow" aria-labelledby="flow-title">
        <div className="section-heading">
          <div>
            <div className="section-kicker">One commercial thread</div>
            <h2 id="flow-title">From offer to outcome.</h2>
          </div>
          <p>Designed around the transaction itself rather than disconnected tools.</p>
        </div>
        <ol className="flow-list">
          {flow.map(([number, title, copy]) => (
            <li key={number}>
              <span className="flow-number">{number}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell split" id="principles">
        <div className="dark-panel">
          <div className="section-kicker light">Built for serious commerce</div>
          <h2>Clarity before automation.</h2>
          <p>Deals should remain understandable to both sides. Automation can assist the work; it should never obscure price, terms, responsibility or status.</p>
          <div className="principle-list">
            <span>Explicit states</span><span>Visible terms</span><span>Controlled changes</span><span>Durable history</span>
          </div>
        </div>
        <div className="light-panel">
          <div className="section-kicker">Built to expand</div>
          <h2>A focused wedge, not a narrow ceiling.</h2>
          <p>The first product is a deal workspace. The architecture leaves room for buyer identity, approvals, payment milestones, attachments, signatures, AI-assisted review and operational integrations later.</p>
          <Link className="text-link" href="/new">Open the local deal composer →</Link>
        </div>
      </section>

      <section className="shell final-cta">
        <p className="section-kicker">Quincestone Deals</p>
        <h2>Put the deal in one place.</h2>
        <p>Start with a local draft now. Persistent, shareable deal rooms activate when the production data layer is connected.</p>
        <Link className="button button-primary" href="/new">Create a deal draft</Link>
      </section>
    </main>
  );
}
