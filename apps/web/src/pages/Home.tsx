import { Link } from "react-router-dom";

const pipeline = [
  ["01", "Interaction"], ["02", "Intent"], ["03", "Context"], ["04", "Qualification"],
  ["05", "Knowledge"], ["06", "Policy"], ["07", "Workflow"], ["08", "Escalation"], ["09", "Outcome"],
];

const capabilities = [
  ["01", "Interpretation", "Turn incoming interaction into structured intent, context, urgency, and need."],
  ["02", "Business knowledge", "Keep approved service information and operating boundaries close to the decision."],
  ["03", "Deterministic policy", "Let explicit business rules define what the organization allows."],
  ["04", "Workflow routing", "Move qualified interaction into a defined process with ownership and review."],
  ["05", "Human escalation", "Stop when judgment, sensitivity, risk, or policy requires a person."],
  ["06", "Operational trace", "Preserve a useful record of what was understood, decided, and routed."],
];

const liveWords = ["action", "policy", "workflow"];

export function Home() {
  return (
    <>
      <section className="marketing-hero">
        <div className="hero-copy">
          <p className="eyebrow">EDGE INTELLIGENCE INFRASTRUCTURE</p>
          <h1>Intelligence between interaction and <span className="live-line" aria-hidden="true">{liveWords.map((word) => <span className="live-word" key={word}>{word}</span>)}</span><span className="sr-only">action.</span></h1>
          <p className="lede">Quincestone interprets incoming interaction, applies business knowledge and policy, and routes the right operational response while preserving human control.</p>
          <div className="actions"><a className="button" href="https://app.quincestone.com">Open Quincestone</a><Link className="button secondary" to="/demo">Experience the Demo</Link></div>
          <div className="hero-proof"><span>INTERPRETATION</span><span>KNOWLEDGE</span><span>POLICY</span><span>WORKFLOW</span><span>HUMAN CONTROL</span></div>
        </div>
        <div className="intelligence-diagram" aria-label="Quincestone intelligence pipeline">
          <div className="diagram-label">QUINCESTONE / INTELLIGENCE PIPELINE</div>
          <div className="diagram-flow">{pipeline.slice(0, 7).map(([number, label]) => <div className="diagram-step" key={number}><b>{number}</b><strong>{label.toUpperCase()}</strong></div>)}</div>
          <div className="diagram-label">CONTROLLED SIDE EFFECTS · HUMAN REVIEW AVAILABLE</div>
        </div>
      </section>

      <div className="editorial-band"><div className="editorial-band-inner"><span>UNDERSTAND</span><span>QUALIFY</span><span>APPLY POLICY</span><span>ROUTE</span><span>ESCALATE</span></div></div>

      <section className="architecture-section">
        <p className="eyebrow">THE THESIS</p>
        <div className="section-heading"><h2>Before action, understanding.</h2><p className="section-intro">Businesses receive messages, forms, requests, bookings, and other interactions continuously. Quincestone inserts an intelligence layer between input and operation—so the next action is grounded in context rather than guesswork.</p></div>
      </section>

      <section className="architecture-section" id="platform">
        <p className="eyebrow">THE SYSTEM</p><h2>One operating layer from interaction to outcome.</h2>
        <div className="pipeline">{pipeline.map(([number, label]) => <div className="pipeline-step" key={number}><span>{number}</span><strong>{label}</strong></div>)}</div>
      </section>

      <section className="split-editorial">
        <div><p className="eyebrow">KNOWLEDGE + POLICY</p><h2>Knowledge is data. Policy is authority.</h2><p>Knowledge tells Quincestone what the business knows: services, boundaries, operating information, and approved context. Policy determines what the business allows.</p><Link className="text-link" to="/knowledge">Explore the operating model →</Link></div>
        <div className="dark"><p className="eyebrow">HUMAN CONTROL</p><h2>Automation should know when to stop.</h2><p>Ambiguous, sensitive, urgent, or policy-bound interactions can move to human review. Quincestone is designed to preserve judgment, not hide it.</p><Link className="button light" to="/operations">See operational visibility</Link></div>
      </section>

      <section className="architecture-section"><p className="eyebrow">CAPABILITIES</p><h2>Built around the decisions that matter.</h2><div className="grid capability-grid">{capabilities.map(([number, title, text]) => <article className="panel" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="architecture-section dark-flow"><div className="section-heading"><div><p className="eyebrow">DEMONSTRATION</p><h2>See a fictional request become an operational decision.</h2></div><p>Northstone Roofing is a fictional company created to demonstrate Quincestone. Walk through intent, context, qualification, policy, workflow, escalation, and outcome.</p></div><div className="actions"><Link className="button light" to="/demo/experience">Experience the Demo</Link><Link className="text-link" to="/demo/operations">Open operations →</Link></div></section>

      <section className="split-editorial">
        <div><p className="eyebrow">INTEGRATION ARCHITECTURE</p><h2>Authority stays behind the boundary.</h2><p>Interaction becomes intelligence, intelligence meets policy, and only authorized workflows reach operational systems. Current integration categories include Google Calendar and Stripe where configured.</p><Link className="text-link" to="/platform">Explore the architecture →</Link></div>
        <div><p className="eyebrow">SECURITY</p><h2>Server authority. Tenant boundaries. Traceable decisions.</h2><p>Quincestone separates browser interaction from privileged execution, uses deterministic policy, protects integration credentials, and preserves an operational trace without exposing private model reasoning.</p><Link className="text-link" to="/about">Read the principles →</Link></div>
      </section>

      <section className="product-entry"><div><p className="eyebrow">QUINCESTONE EDGE ASSESSMENT</p><h2>Understand where intelligence can sit between interaction and operation.</h2><p>A focused 30-minute assessment for identifying one business journey where context, qualification, policy, and routing can create a better next action.</p></div><div className="offer-price"><span>ONE-TIME</span><strong>$49</strong><small>USD</small><Link className="button" to="/checkout">Start an Edge Assessment</Link></div></section>

      <section className="architecture-section"><p className="eyebrow">PRODUCT ENTRY</p><h2>Put intelligence between interaction and action.</h2><p className="section-intro">Operate Quincestone through the authenticated control plane. The public site explains the system; the application is where authorized users operate it.</p><div className="actions"><a className="button" href="https://app.quincestone.com">Open Quincestone</a><Link className="button secondary" to="/demo">Experience the Demo</Link></div></section>
    </>
  );
}
