"use client";

import { useState } from "react";

type EdgeResult = {
  traceId: string;
  interactionId: string;
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
  const [message, setMessage] = useState(examples[0]);
  const [result, setResult] = useState<EdgeResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/edge/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? "The intelligence runtime is unavailable.");
      setResult(payload.trace);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "The intelligence runtime is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel" style={{ marginTop: 28 }}>
      <div className="panel-kicker">Governed Edge execution</div>
      <h2>Run an interaction through the workspace intelligence layer</h2>
      <p className="empty">The current slice understands, qualifies, checks workspace knowledge and policy, routes a workflow, proposes a safe next action and records the outcome. It does not execute external side effects.</p>
      <label style={{ display: "grid", gap: 8, marginTop: 18 }}>
        <span className="panel-kicker">Customer request</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={2000}
          rows={5}
          aria-label="Customer request"
          style={{ width: "100%", resize: "vertical", padding: 12, border: "1px solid #d9d7cf", borderRadius: 8, background: "#fff", font: "inherit" }}
        />
      </label>
      <div className="actions" style={{ marginTop: 12 }}>
        {examples.map((example) => (
          <button key={example} className="button secondary" type="button" onClick={() => setMessage(example)}>
            Example
          </button>
        ))}
        <button className="button" type="button" onClick={run} disabled={loading || message.trim().length < 3}>
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
          <p className="empty">Trace {result.traceId} · Interaction {result.interactionId}</p>
        </div>
      ) : null}
    </div>
  );
}
