import { Link } from "react-router-dom";

const capabilities = [
  ["01", "Edge Experience", "Journeys adapt to declared intent, context, policy, and the next useful action."],
  ["02", "Controlled AI", "AI assists within explicit boundaries while consequential decisions remain visible and reviewable."],
  ["03", "Intelligent Qualification", "Structured signals turn ambiguous demand into operationally useful context."],
  ["04", "Workflow Routing", "Every qualified interaction enters a defined workflow with ownership and escalation rules."],
];

export function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">EDGE INTELLIGENCE FOR BUSINESS PLATFORMS</p>
          <h1>Make Every Digital Interaction More Intelligent</h1>
          <p className="lede">Quincestone installs edge intelligence across business websites and applications—helping organizations understand intent, qualify demand, personalize journeys, automate response, and route every opportunity into the correct workflow.</p>
          <div className="actions"><Link className="button" to="/assessment">Request an Edge Assessment</Link><Link className="button secondary" to="/demo">Experience the Live Demo</Link></div>
        </div>
        <div className="instrument" aria-label="Quincestone operational model">
          <p>EDGE SIGNAL / 01</p>
          <div className="instrument-core"><span>INTERACTION</span><strong>INTELLIGENCE</strong><span>ACTION</span></div>
          <dl><div><dt>Intent</dt><dd>Interpreted</dd></div><div><dt>Policy</dt><dd>Applied</dd></div><div><dt>Workflow</dt><dd>Selected</dd></div><div><dt>Human review</dt><dd>Available</dd></div></dl>
        </div>
      </section>
      <div className="capability-line">EDGE EXPERIENCE · AI CONCIERGE · QUALIFICATION · WORKFLOW ROUTING · OPERATIONAL VISIBILITY</div>
      <section className="section">
        <p className="eyebrow">THE INTELLIGENCE LAYER</p>
        <div className="section-heading"><h2>Between a visitor’s intent and your organization’s response.</h2><p>Quincestone connects digital experience, business knowledge, qualification logic, workflow policy, and human judgment into one controlled operating layer.</p></div>
        <div className="grid">{capabilities.map(([n, title, text]) => <article className="panel" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="section midnight"><p className="eyebrow">SEE THE SYSTEM OPERATE</p><h2>One fictional request. Every decision visible.</h2><p>Follow an emergency roofing enquiry from intent detection through qualification, routing, policy checks, simulated AI summarization, and human review.</p><Link className="button light" to="/demo/experience">Run the experience →</Link></section>
    </>
  );
}
