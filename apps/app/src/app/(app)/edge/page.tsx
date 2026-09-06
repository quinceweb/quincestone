import { EdgeRunPanel } from "@/components/EdgeRunPanel";

const lifecycle = [
  ["01", "Interaction", "Receive the customer request."],
  ["02", "Understand", "Determine intent, context and ambiguity."],
  ["03", "Collect", "Capture only the information required to proceed."],
  ["04", "Qualify", "Decide whether the request can move forward."],
  ["05", "Knowledge", "Ground the decision in active workspace knowledge."],
  ["06", "Policy", "Apply workspace policy and operating boundaries."],
  ["07", "Route", "Select the appropriate workflow."],
  ["08", "Action", "Propose an authorized next action without assuming authority."],
  ["09", "Human review", "Escalate consequential or uncertain decisions."],
  ["10", "Outcome", "Record the resulting operational state."],
  ["11", "Record", "Preserve the trace for inspection and learning."],
] as const;

export default function EdgePage() {
  return (
    <section className="page-section">
      <div className="command-header">
        <div>
          <div className="eyebrow">Quincestone Edge</div>
          <h1>Governed intelligence between demand and action.</h1>
          <p className="lede">Edge turns customer interaction into a qualified, policy-aware operating path. It can propose action, but it does not invent authority.</p>
        </div>
        <div className="command-status"><span className="status-dot" /> Workspace runtime</div>
      </div>

      <section className="panel" aria-labelledby="edge-boundary">
        <div className="panel-kicker">Operating boundary</div>
        <h2 id="edge-boundary">Observe → understand → decide → review → act → record.</h2>
        <p className="empty">Every consequential path remains explicit about what was observed, what was derived, what policy permits, what action is proposed and whether human authorization is required.</p>
      </section>

      <section style={{ marginTop: 28 }} aria-labelledby="edge-lifecycle">
        <div className="panel-kicker">Edge lifecycle</div>
        <h2 id="edge-lifecycle">The governed path</h2>
        <div className="grid" style={{ marginTop: 16 }}>
          {lifecycle.map(([number, title, description]) => (
            <section className="panel" key={number}>
              <div className="panel-kicker">{number}</div>
              <h2>{title}</h2>
              <p className="empty">{description}</p>
            </section>
          ))}
        </div>
      </section>

      <EdgeRunPanel />
    </section>
  );
}
