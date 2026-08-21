"use client";

import { useState } from "react";

type EdgeResult = {
  traceId: string;
  interactionId: string;
  customerId: string | null;
  executionVersion: string;
  intent: { primary: string; confidence: number; urgency: string; clarificationRequired: boolean };
  qualification: { status: string; reasonCodes: string[]; nextRequiredInformation: string[] };
  knowledge: { matches: Array<{ id: string; title: string; version: string; score: number }> };
  policy: { source: string; decisions: Array<{ id: string; result: string; explanation: string; priority: number }> };
  workflow: { name: string; route: string; status: string };
  escalation: { required: boolean; reason: string | null; priority: string; safeNextAction: string };
  actionProposal: { kind: string; execute: boolean; authorizationRequired: boolean; externalSideEffect: boolean; description: string };
  outcome: { status: string; summary: string };
};

const examples = [
  "I need help with a service request and would like to understand the next step.",
  "Can I book a consultation for next week?",
  "I need a quote for a new project.",
];

export function EdgeRunPanel() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(examples[0]);
  const [result, setResult] = useState<EdgeResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/interactions/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          message,
          idempotency_key: crypto.randomUUID(),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? "The intelligence runtime is unavailable.");
      setResult(payload.trace);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The intelligence runtime is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel" style={{ marginTop: 28 }}>
      <div className="panel-kicker">Real workspace interaction</div>
      <h2>Send a customer request through Edge</h2>
      <p className="empty">This creates or reuses a workspace customer, records the interaction and runs the governed intelligence lifecycle. Consequential actions remain proposals until a human authorizes them.</p>
      <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
        <label>Customer name<input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Customer name" autoComplete="name" /></label>
        <label>Customer email<input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="customer@example.com" type="email" autoComplete="email" /></label>
        <label>
          <span className="panel-kicker">Customer request</span>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} rows={5} aria-label="Customer request" style={{ width: "100%", resize: "vertical", padding: 12, border: "1px solid #d9d7cf", borderRadius: 8, background: "#fff", font: "inherit" }} />
        </label>
      </div>
      <div className="actions" style={{ marginTop: 12 }}>
        {examples.map((example) => (
          <button key={example} className="button secondary" type="button" onClick={() => setMessage(example)}>Use example</button>
        ))}
        <button className="button" type="button" onClick={run} disabled={loading || fullName.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.trim().length < 3}>
          {loading ? "Running Edge…" : "Run Edge"}
        </button>
      </div>
      {error ? <p role="alert" className="empty" style={{ marginTop: 14 }}>{error}</p> : null}
      {result ? (
        <div style={{ display: "grid", gap: 10, marginTop: 22 }} aria-live="polite">
          <div className="record"><div><div className="panel-kicker">Intent</div><h2>{result.intent.primary}</h2><p className="empty">Confidence {Math.round(result.intent.confidence * 100)}% · urgency {result.intent.urgency}</p></div><div className="record-meta">{result.executionVersion}</div></div>
          <div className="record"><div><div className="panel-kicker">Qualification</div><h2>{result.qualification.status}</h2><p className="empty">{result.qualification.reasonCodes.join(" · ")}</p></div><div className="record-meta">{result.qualification.nextRequiredInformation.length ? "More information" : "Sufficient"}</div></div>
          <div className="record"><div><div className="panel-kicker">Policy</div><h2>{result.policy.source}</h2><p className="empty">{result.policy.decisions.map((decision) => decision.result).join(" · ")}</p></div><div className="record-meta">Governed</div></div>
          <div className="record"><div><div className="panel-kicker">Workflow</div><h2>{result.workflow.name}</h2><p className="empty">{result.workflow.route}</p></div><div className="record-meta">{result.workflow.status}</div></div>
          <div className="record"><div><div className="panel-kicker">Action proposal</div><h2>{result.actionProposal.kind}</h2><p className="empty">{result.actionProposal.description}</p></div><div className="record-meta">{result.actionProposal.execute ? "Executable" : "Proposal only"}</div></div>
          <div className="record"><div><div className="panel-kicker">Outcome</div><h2>{result.outcome.status}</h2><p className="empty">{result.outcome.summary}</p></div><div className="record-meta">{result.escalation.required ? "Human review" : "Recorded"}</div></div>
          <p className="empty">Trace {result.traceId} · Interaction {result.interactionId} · Customer {result.customerId ?? "not linked"}</p>
        </div>
      ) : null}
    </div>
  );
}
