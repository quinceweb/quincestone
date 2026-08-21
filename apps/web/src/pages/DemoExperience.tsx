import { useState } from "react";
import { Link } from "react-router-dom";
import { rememberDemoTrace, runDemoIntelligence } from "../lib/intelligence/client";
import type { IntelligenceTrace } from "../lib/intelligence/contracts";

const examples = [
  "My roof started leaking after last night's storm.",
  "I need someone to inspect a commercial roof next week.",
  "Do you service Brooklyn?",
];

const stages = ["intent", "context", "qualification", "knowledge", "policy", "workflow", "escalation", "outcome"] as const;

export function DemoExperience() {
  const [message, setMessage] = useState(examples[0]);
  const [trace, setTrace] = useState<IntelligenceTrace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true); setError("");
    try { const result = await runDemoIntelligence(message.trim()); setTrace(result); rememberDemoTrace(result); }
    catch (err) { setError(err instanceof Error ? err.message : "The demonstration runtime is unavailable."); }
    finally { setLoading(false); }
  }

  return <section className="demo-page">
    <div className="demo-notice"><strong>Demonstration data only.</strong> Northstone Roofing is a fictional company created to demonstrate Quincestone. No real appointment, payment, or operational action is created from this route.</div>
    <div className="demo-head"><div><p className="eyebrow">NORTHSTONE ROOFING / REAL RUNTIME DEMONSTRATION</p><h1>Give Quincestone a real sentence.</h1><p className="lede">This sandbox executes the governed intelligence runtime: intent, context, qualification, knowledge, policy, routing, escalation, and outcome.</p></div><span className="status-pill">DEMO / SANDBOX</span></div>

    <div className="demo-card" style={{ marginBottom: 24 }}>
      <p className="eyebrow">INTERACTION</p>
      <label htmlFor="demo-message">What would a visitor say?</label>
      <textarea id="demo-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} rows={5} placeholder="Describe what you need…" />
      <div className="actions"><button className="button" disabled={loading || message.trim().length < 3} onClick={run}>{loading ? "Running intelligence…" : "Run Quincestone →"}</button><Link className="button secondary" to="/demo/operations">Open operations desk</Link></div>
      <div className="demo-principles">{examples.map((example) => <button key={example} className="secondary" onClick={() => setMessage(example)}>{example}</button>)}</div>
      {error && <p role="alert" className="empty-state">{error}</p>}
    </div>

    {trace && <div className="demo-stage">
      <aside><div className="demo-stage-label">EXECUTION TRACE</div>{stages.map((stage, index) => <div key={stage} className="trace-step"><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage}</strong><small>{trace.timing[stage]} ms</small></div>)}</aside>
      <article className="demo-card">
        <div className="decision-top"><p className="eyebrow">TRACE {trace.traceId}</p><span className="status-pill">{trace.outcome.status}</span></div>
        <h2>{trace.intent.primary}</h2>
        <div className="decision"><strong>Intent</strong><p>{Math.round(trace.intent.confidence * 100)}% confidence · {trace.intent.urgency} urgency{trace.intent.clarificationRequired ? " · clarification required" : ""}</p></div>
        <div className="decision"><strong>Context</strong><p>{trace.context.serviceLocation ?? "Location not supplied"} · {trace.context.propertyType ?? "Property type unknown"} · {trace.context.damageType ?? "No damage signal"}</p></div>
        <div className="decision"><strong>Qualification</strong><p>{trace.qualification.status} · {trace.qualification.reasonCodes.join(", ")}</p></div>
        <div className="decision"><strong>Knowledge</strong><p>{trace.knowledge.matches.length ? trace.knowledge.matches.map((item) => item.title).join(" · ") : "No additional knowledge match required"}</p></div>
        <div className="decision"><strong>Policy</strong><p>{trace.policy.decisions.map((item) => item.explanation).join(" ")}</p></div>
        <div className="decision"><strong>Workflow</strong><p>{trace.workflow.name}</p></div>
        <div className="decision"><strong>Human escalation</strong><p>{trace.escalation.required ? `${trace.escalation.priority}: ${trace.escalation.reason}` : "Not required"}</p></div>
        <div className="decision"><strong>Outcome</strong><p>{trace.outcome.summary}</p></div>
        <div className="demo-notice"><strong>Side-effect firewall:</strong> this trace is permanently constrained to demo mode. No calendar, Stripe, messaging, CRM, webhook, or production workflow can be invoked.</div>
      </article>
    </div>}
  </section>;
}
