import { Link } from "react-router-dom";

const APP_URL = "https://app.quincestone.com";

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

const liveWords = ["action", "policy", "workflow", "judgment"];

const operatingSequence = ["UNDERSTAND", "QUALIFY", "APPLY POLICY", "ROUTE", "ESCALATE"];

export function Home() {
  return (
    <>
      <section className="material-hero" aria-labelledby="hero-title">
        <div className="material-hero-field" aria-hidden="true">
          <div className="material-glow material-glow-one" />
          <div className="material-glow material-glow-two" />
          <div className="material-ridge" />
          <div className="material-grain" />
        </div>

        <div className="material-hero-content">
          <div className="material-copy">
            <p className="eyebrow">EDGE INTELLIGENCE INFRASTRUCTURE</p>
            <h1 id="hero-title">
              Intelligence between<br />interaction and <span className="material-live-line" aria-hidden="true">{liveWords.map((word) => <span key={word}>{word}.</span>)}</span>
              <span className="sr-only">action.</span>
            </h1>
            <p className="material-lede">Quincestone interprets incoming interaction, applies business knowledge and policy, and routes the right operational response while preserving human control.</p>
            <div className="actions material-actions">
              <a className="button material-primary" href={APP_URL}>Open Quincestone <span aria-hidden="true">↗</span></a>
              <Link className="material-text-link" to="/demo">Experience the Demo <span aria-hidden="true">↗</span></Link>
            </div>
            <p className="hero-app-note"><span aria-hidden="true" /> Authenticated control plane · app.quincestone.com</p>
          </div>

          <div className="material-side" aria-label="Quincestone intelligence system">
            <div className="material-side-mark">QS / 01</div>
            <div className="material-side-line" />
            <p>UNDERSTAND<br />BEFORE ACTION</p>
            <div className="material-side-status"><span />SYSTEM MODEL / CONTROLLED</div>
          </div>

          <div className="material-product-card" aria-label="Illustrative Quincestone decision path">
            <div className="material-card-top"><span>QUINCESTONE / EDGE</span><span>OPERATING MODEL</span></div>
            <div className="material-card-trace">
              <div><span>INPUT</span><strong>Interaction</strong></div>
              <div><span>DECISION</span><strong>Policy + Context</strong></div>
              <div><span>NEXT</span><strong>Governed Workflow</strong></div>
            </div>
            <div className="material-card-foot"><span>Human review available</span><span aria-hidden="true">→</span></div>
          </div>
        </div>

        <div className="material-hero-rail" aria-label="Quincestone operating sequence">
          {operatingSequence.map((item, index) => <span key={item}><b>0{index + 1}</b>{item}</span>)}
        </div>
      </section>

      <section className="editorial-band" aria-label="Product positioning">
        <div className="editorial-band-inner"><span>INTERACTION → INTELLIGENCE → OPERATION</span><span>PUBLIC SITE / QUINCESTONE.COM</span><span>CONTROL PLANE / APP.QUINCESTONE.COM</span></div>
      </section>

      <section className="architecture-section material-thesis">
        <p className="eyebrow">THE THESIS</p>
        <div className="section-heading"><h2>Before action, understanding.</h2><p className="section-intro">Businesses receive messages, forms, requests, bookings, and other interactions continuously. Most software passes them directly into workflows. Quincestone inserts an intelligence layer between input and operation.</p></div>
      </section>

      <section className="architecture-section" id="platform">
        <p className="eyebrow">THE SYSTEM</p><h2>One operating layer from interaction to outcome.</h2>
        <div className="pipeline">{pipeline.map(([number, label]) => <div className="pipeline-step" key={number}><span>{number}</span><strong>{label}</strong></div>)}</div>
      </section>

      <section className="split-editorial">
        <div><p className="eyebrow">KNOWLEDGE + POLICY</p><h2>Knowledge is data. Policy is authority.</h2><p>Knowledge tells Quincestone what the business knows: services, boundaries, operating information, and approved context. Policy determines what the business allows.</p><Link className="text-link" to="/knowledge">Explore the operating model →</Link></div>
        <div className="dark"><p className="eyebrow">HUMAN CONTROL</p><h2>Automation should know when to stop.</h2><p>Ambiguous, sensitive, urgent, or policy-bound interactions can move to human review. Quincestone is designed to preserve judgment, not hide it.</p><Link className="button light" to="/operations">See operational visibility</Link></div>
      </section>

      <section className="architecture-section">
        <p className="eyebrow">CAPABILITIES</p><h2>Built around the decisions that matter.</h2>
        <div className="grid capability-grid">{capabilities.map(([number, title, text]) => <article className="panel" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="architecture-section product-preview-section" aria-labelledby="product-preview-title">
        <div className="section-heading"><div><p className="eyebrow">PRODUCT EXPERIENCE</p><h2 id="product-preview-title">The public site explains the system. The app operates it.</h2></div><p>Open the authenticated control plane to work with the Quincestone operating model. Production activity appears only when it actually exists.</p></div>
        <div className="product-preview-shell">
          <div className="product-preview-nav"><span className="product-preview-active">Command Center</span><span>Intelligence</span><span>Knowledge</span><span>Policies</span><span>Workflows</span><span>Escalations</span></div>
          <div className="product-preview-body"><div><span className="product-preview-label">COMMAND CENTER</span><h3>No production activity yet.</h3><p>Connect the operating context, review authorized workflows, and preserve human control from the authenticated application.</p><a className="button" href={APP_URL}>Open Quincestone</a></div><div className="product-preview-trace"><span>CONTROL PLANE</span><strong>SERVER AUTHORITY</strong><small>Policy · Workflow · Human review</small></div></div>
        </div>
      </section>

      <section className="architecture-section dark-flow">
        <div className="section-heading"><div><p className="eyebrow">DEMONSTRATION</p><h2>See a fictional request become an operational decision.</h2></div><p>Northstone Roofing is a fictional company created to demonstrate Quincestone. Walk through intent, context, qualification, policy, workflow, escalation, and outcome.</p></div>
        <div className="actions"><Link className="button light" to="/demo/experience">Experience the Demo</Link><Link className="text-link" to="/demo/operations">Open operations →</Link></div>
      </section>

      <section className="split-editorial">
        <div><p className="eyebrow">INTEGRATION ARCHITECTURE</p><h2>Authority stays behind the boundary.</h2><p>Interaction becomes intelligence, intelligence meets policy, and only authorized workflows reach operational systems. Current integration categories include Google Calendar and Stripe where configured.</p><Link className="text-link" to="/platform">Explore the architecture →</Link></div>
        <div><p className="eyebrow">SECURITY</p><h2>Server authority. Tenant boundaries. Traceable decisions.</h2><p>Quincestone separates browser interaction from privileged execution, uses deterministic policy, protects integration credentials, and preserves an operational trace without exposing private model reasoning.</p><Link className="text-link" to="/about">Read the principles →</Link></div>
      </section>

      <section className="product-entry">
        <div><p className="eyebrow">QUINCESTONE EDGE ASSESSMENT</p><h2>Understand where intelligence can sit between interaction and operation.</h2><p>A focused 30-minute assessment for identifying one business journey where context, qualification, policy, and routing can create a better next action.</p></div>
        <div className="offer-price"><span>ONE-TIME</span><strong>$49</strong><small>USD</small><Link className="button" to="/checkout">Start an Edge Assessment</Link></div>
      </section>

      <section className="architecture-section material-final" aria-labelledby="final-cta-title">
        <p className="eyebrow">PRODUCT ENTRY</p>
        <h2 id="final-cta-title">Put intelligence between interaction and action.</h2>
        <p className="section-intro">Operate Quincestone through the authenticated control plane. The public site explains the system; the application is where authorized users operate it.</p>
        <div className="actions"><a className="button" href={APP_URL}>Open Quincestone <span aria-hidden="true">↗</span></a><Link className="button secondary" to="/demo">Experience the Demo</Link></div>
      </section>
    </>
  );
}
