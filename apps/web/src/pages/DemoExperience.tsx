import { useState } from "react";
import { Link } from "react-router-dom";
import "../p4-demo.css";
import { rememberDemoTrace, runDemoIntelligence } from "../lib/intelligence/client";
import type { IntelligenceTrace } from "../lib/intelligence/contracts";

const examples = [
  "My roof started leaking after last night's storm.",
  "I need someone to inspect a commercial roof next week.",
  "Do you service Brooklyn?",
];

const stages = [
  ["intent", "Understand"], ["context", "Context"], ["qualification", "Qualify"], ["knowledge", "Knowledge"],
  ["policy", "Policy"], ["workflow", "Route"], ["escalation", "Review"], ["outcome", "Outcome"],
] as const;

export function DemoExperience() {
  const [message, setMessage] = useState(examples[0]);
  const [trace, setTrace] = useState<IntelligenceTrace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStage, setSelectedStage] = useState(0);

  async function run() {
    setLoading(true); setError("");
    try { const result = await runDemoIntelligence(message.trim()); setTrace(result); rememberDemoTrace(result); setSelectedStage(0); }
    catch (err) { setError(err instanceof Error ? err.message : "The demonstration runtime is unavailable."); }
    finally { setLoading(false); }
  }

  const stageKey = stages[selectedStage][0];
  const stageCopy: Record<string, string> = trace ? {
    intent: `${Math.round(trace.intent.confidence * 100)}% confidence · ${trace.intent.urgency} urgency${trace.intent.clarificationRequired ? " · clarification required" : ""}`,
    context: `${trace.context.serviceLocation ?? "Location not supplied"} · ${trace.context.propertyType ?? "Property type unknown"} · ${trace.context.damageType ?? "No damage signal"}`,
    qualification: `${trace.qualification.status} · ${trace.qualification.reasonCodes.join(", ") || "No exception codes"}`,
    knowledge: trace.knowledge.matches.length ? trace.knowledge.matches.map((item) => item.title).join(" · ") : "No additional knowledge match required",
    policy: trace.policy.decisions.map((item) => item.explanation).join(" "),
    workflow: trace.workflow.name,
    escalation: trace.escalation.required ? `${trace.escalation.priority}: ${trace.escalation.reason}` : "Not required",
    outcome: trace.outcome.summary,
  } : {};

  return <section className="demo-page">
    <div className="demo-notice"><strong>Demonstration data only.</strong> Northstone Roofing is fictional. This runtime demonstrates governed intelligence; it does not create real appointments, payments, messages, or operational actions.</div>
    <div className="demo-head"><div><p className="eyebrow">NORTHSTONE ROOFING / PRODUCT DEMONSTRATION</p><h1>See demand become a governed decision.</h1><p className="lede">Give Quincestone a normal customer sentence. Watch it turn interaction into context, qualification, policy, routing, human review, and an outcome.</p></div><span className="status-pill">DEMO / SANDBOX</span></div>

    <div className="demo-card" style={{ marginBottom: 24 }}>
      <p className="eyebrow">01 / CUSTOMER INTERACTION</p>
      <label htmlFor="demo-message">What would a customer say?</label>
      <textarea id="demo-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} rows={5} placeholder="Describe what you need…" />
      <div className="actions"><button className="button" disabled={loading || message.trim().length < 3} onClick={run}>{loading ? "Running intelligence…" : "Run Quincestone →"}</button><Link className="button secondary" to="/demo/operations">Open operations desk</Link></div>
      <div className="demo-principles">{examples.map((example) => <button key={example} className="secondary" onClick={() => setMessage(example)}>{example}</button>)}</div>
      {loading && <div className="demo-v2__loading" role="status">Executing the governed demo runtime…</div>}
      {error && <p role="alert" className="empty-state">{error}</p>}
    </div>

    {trace && <div className="demo-v2">
      <div className="demo-v2__bar"><span>LIVE EXECUTION TRACE / {trace.traceId}</span><span>{trace.timing.total} MS TOTAL · {trace.outcome.status}</span></div>
      <div className="demo-v2__signal">
        <div><p className="eyebrow">THE SIGNAL</p><h2>{trace.intent.primary}</h2><p>{trace.outcome.summary}</p><div className="demo-v2__facts"><div className="demo-v2__fact"><span>CONFIDENCE</span><strong>{Math.round(trace.intent.confidence * 100)}%</strong></div><div className="demo-v2__fact"><span>URGENCY</span><strong>{trace.intent.urgency}</strong></div><div className="demo-v2__fact"><span>QUALIFICATION</span><strong>{trace.qualification.status}</strong></div><div className="demo-v2__fact"><span>HUMAN REVIEW</span><strong>{trace.escalation.required ? "Required" : "Not required"}</strong></div></div></div>
        <div><p className="eyebrow">THE BOUNDARY</p><h3>Intelligence proposes. Policy constrains. People remain accountable.</h3><p>Quincestone exposes the decision path without exposing private model reasoning or allowing this demo to produce real-world side effects.</p><div className="demo-notice"><strong>Side-effect firewall:</strong> mode=demo, tenant=northstone-roofing-demo. Calendar, Stripe, messaging, CRM, webhooks, and production workflows are unavailable.</div></div>
      </div>
      <div className="demo-v2__flow" aria-label="Execution stages">{stages.map(([key, label], index) => <button key={key} className={index === selectedStage ? "active" : ""} onClick={() => setSelectedStage(index)}><small>{String(index + 1).padStart(2, "0")}</small><strong>{label}</strong></button>)}</div>
      <div className="demo-v2__detail"><p className="eyebrow">{String(selectedStage + 1).padStart(2, "0")} / {stages[selectedStage][1]}</p><h3>{stages[selectedStage][1]}</h3><p>{stageCopy[stageKey]}</p></div>
      <div className="demo-v2__footer"><span>Governed demo trace · safe fixture tenant · browser session only</span><Link className="text-link" to="/demo/operations">Inspect the operations trace →</Link></div>
    </div>}
  </section>;
}
