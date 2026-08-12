import { Link } from "react-router-dom";

const capabilities = [
  ["01", "Edge Experience", "Journeys adapt to declared intent, context, policy, and the next useful action."],
  ["02", "AI Concierge", "Bounded AI clarifies intent, answers approved questions, and prepares context without taking unauthorized action."],
  ["03", "Qualification Intelligence", "Structured signals turn ambiguous demand into an operational brief your team can actually use."],
  ["04", "Workflow Routing", "Every qualified interaction enters a defined workflow with ownership, escalation, and review rules."],
  ["05", "Business Knowledge", "Approved service information and operating boundaries stay close to the interaction."],
  ["06", "Human Escalation", "Consequential decisions remain visible and move cleanly to the people responsible for them."],
  ["07", "Operational Visibility", "Teams can inspect why a decision happened, what policy applied, and what happens next."],
];

const proof = [
  ["01", "Understand", "Intent, context, urgency, and declared need become structured signals."],
  ["02", "Qualify", "Business rules and bounded intelligence determine what matters next."],
  ["03", "Route", "The interaction enters the correct workflow with an explainable decision record."],
  ["04", "Escalate", "Human review remains available wherever policy, risk, or judgment requires it."],
];

export function Home() {
  return (
    <>
      <section className="hero hero-premium">
        <div className="hero-copy">
          <p className="eyebrow">EDGE INTELLIGENCE INFRASTRUCTURE</p>
          <h1>Intelligence between interaction and action.</h1>
          <p className="lede">Quincestone gives modern business websites and applications an operating layer for understanding intent, qualifying demand, applying business knowledge, routing work, and escalating the moments that still require a human.</p>
          <div className="actions"><Link className="button" to="/demo">Explore the system</Link><Link className="button secondary" to="/checkout">Start the $49 Edge Assessment</Link></div>
          <div className="hero-proof"><span>EDGE EXPERIENCE</span><span>CONTROLLED AI</span><span>QUALIFICATION</span><span>WORKFLOW ROUTING</span></div>
        </div>
        <div className="instrument" aria-label="Quincestone operating model">
          <p>QUINCESTONE / OPERATING MODEL</p>
          <div className="instrument-core"><span>INTERACTION</span><strong>INTELLIGENCE</strong><span>ACTION</span></div>
          <dl><div><dt>Intent</dt><dd>Interpreted</dd></div><div><dt>Policy</dt><dd>Applied</dd></div><div><dt>Workflow</dt><dd>Selected</dd></div><div><dt>Human review</dt><dd>Available</dd></div></dl>
        </div>
      </section>

      <section className="section statement"><p className="eyebrow">THE THESIS</p><div className="section-heading"><h2>Your website should not stop at information.</h2><p>Most digital experiences end when a visitor clicks, submits, or leaves. Quincestone is designed for what happens between those moments: interpreting intent, applying the organization's operating logic, and moving the interaction toward a useful outcome.</p></div></section>
      <div className="capability-line">EDGE EXPERIENCE · AI CONCIERGE · QUALIFICATION INTELLIGENCE · BUSINESS KNOWLEDGE · WORKFLOW ROUTING · HUMAN ESCALATION · OPERATIONAL VISIBILITY</div>

      <section className="section"><p className="eyebrow">THE SYSTEM</p><div className="section-heading"><h2>One operating layer. Seven connected capabilities.</h2><p>Designed as infrastructure rather than another marketing widget, Quincestone connects the experience layer to the operating reality behind the business.</p></div><div className="grid capability-grid">{capabilities.map(([n, title, text]) => <article className="panel" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="section dark-flow"><div className="section-heading"><div><p className="eyebrow">FROM VISITOR TO WORKFLOW</p><h2>Every interaction should produce a better next action.</h2></div><p>Quincestone combines deterministic rules, approved knowledge, bounded AI, and human review into a traceable journey.</p></div><div className="flow-grid">{proof.map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="section demo-promo"><div className="demo-promo-copy"><p className="eyebrow">INTERACTIVE DEMONSTRATION</p><h2>See a fictional request become an operational decision.</h2><p>Northstone Roofing is a fictional company created to demonstrate Quincestone. Walk through an emergency request, inspect every decision, then open the fictional operations desk.</p><div className="actions"><Link className="button" to="/demo/experience">Run the experience</Link><Link className="text-link" to="/demo/operations">Open operations →</Link></div></div><div className="demo-frame"><div><span>VISITOR</span><strong>Intent detected</strong></div><div><span>INTELLIGENCE</span><strong>Policy applied</strong></div><div><span>WORKFLOW</span><strong>Human review</strong></div></div></section>

      <section className="section offer"><p className="eyebrow">START WITH CLARITY</p><div className="offer-grid"><div><h2>Edge Assessment</h2><p>A focused 30-minute assessment to identify where your website or application can better understand intent, qualify demand, and route work.</p><p className="offer-note">One-time payment. No subscription.</p></div><div className="offer-price"><span>ONE-TIME</span><strong>$49</strong><small>USD</small><Link className="button" to="/checkout">Continue to secure checkout</Link></div></div></section>

      <section className="section midnight"><p className="eyebrow">QUINCEWEB / QUINCESTONE</p><h2>Build the layer between what your customers say and what your organization does.</h2><p>Start with one journey. Make the decision logic visible. Expand from there.</p><div className="actions"><Link className="button light" to="/checkout">Start the $49 assessment</Link><Link className="button secondary light" to="/platform">Explore the platform</Link></div></section>
    </>
  );
}
