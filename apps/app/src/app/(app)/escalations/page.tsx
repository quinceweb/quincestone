import { HumanReviewActions } from "@/components/HumanReviewActions";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

export default async function EscalationsPage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;

  const supabase = await createClient();
  const { data: reviews, error } = await supabase
    .from("human_reviews")
    .select("id, status, priority, reason, proposed_action, decision, decision_reason, actor_user_id, created_at, reviewed_at, customer:customers(full_name, email), interaction:interactions(id, message, status, intent, qualification, outcome, trace_id), trace:intelligence_traces(execution_version, policy, workflow, escalation, action_proposal, outcome, created_at)")
    .eq("workspace_id", context.workspace.id)
    .order("created_at", { ascending: false })
    .limit(25);

  const active = (reviews ?? []).filter((review) => ["pending", "in_review"].includes(review.status));

  return (
    <section className="page-section">
      <div className="eyebrow">Operations · {context.workspace.name}</div>
      <h1>Human review</h1>
      <p className="lede">Accountable business judgment stays separate from Edge intelligence. Review the customer request, evidence, policy context and proposed action before authorizing the next step.</p>

      {error ? (
        <div className="panel panel-empty" role="alert">
          <div className="panel-kicker">Operational error</div>
          <h2>Review queue unavailable</h2>
          <p className="empty">The workspace review queue could not be loaded.</p>
        </div>
      ) : active.length === 0 ? (
        <div className="panel panel-empty">
          <div className="panel-kicker">Human review</div>
          <h2>No pending decisions</h2>
          <p className="empty">No production interactions currently require human review in this workspace.</p>
        </div>
      ) : (
        <div className="record-list" aria-label="Pending human reviews">
          {active.map((review) => {
            const customer = Array.isArray(review.customer) ? review.customer[0] : review.customer;
            const interaction = Array.isArray(review.interaction) ? review.interaction[0] : review.interaction;
            const trace = Array.isArray(review.trace) ? review.trace[0] : review.trace;
            return (
              <article className="panel" key={review.id}>
                <div className="record">
                  <div>
                    <div className="panel-kicker">{review.priority} · {review.status}</div>
                    <h2>{customer?.full_name ?? "Customer request"}</h2>
                    <p className="empty">{customer?.email ?? "No email"} · {new Date(review.created_at).toLocaleString()}</p>
                  </div>
                  <div className="record-meta">{review.id.slice(0, 8)}</div>
                </div>

                <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                  <div className="record"><div><div className="panel-kicker">Request</div><p>{interaction?.message ?? "No request text recorded."}</p></div></div>
                  <div className="record"><div><div className="panel-kicker">Edge interpretation</div><p className="empty">Intent: {String((interaction?.intent as { primary?: string } | null)?.primary ?? "not available")} · Qualification: {String((interaction?.qualification as { status?: string } | null)?.status ?? "not available")}</p></div></div>
                  <div className="record"><div><div className="panel-kicker">Why human review</div><p className="empty">{review.reason}</p></div><div className="record-meta">Governed boundary</div></div>
                  <div className="record"><div><div className="panel-kicker">Policy / workflow</div><p className="empty">{trace?.workflow ? JSON.stringify(trace.workflow) : "Policy and workflow context recorded in trace."}</p></div></div>
                  <div className="record"><div><div className="panel-kicker">Proposed action</div><p className="empty">{JSON.stringify(review.proposed_action)}</p></div><div className="record-meta">Not executed</div></div>
                  <div className="record"><div><div className="panel-kicker">Trace</div><p className="empty">{interaction?.trace_id ?? "No trace id"} · {trace?.execution_version ?? "unknown version"}</p></div></div>
                </div>

                {context.role === "owner" || context.role === "admin" ? <HumanReviewActions reviewId={review.id} /> : <p className="empty" style={{ marginTop: 16 }}>Your workspace role can inspect this review but cannot make the decision.</p>}
              </article>
            );
          })}
        </div>
      )}

      {reviews && reviews.some((review) => ["approved", "rejected", "resolved"].includes(review.status)) ? (
        <div className="panel" style={{ marginTop: 28 }}>
          <div className="panel-kicker">Decision history</div>
          <h2>Recent human decisions</h2>
          <div className="record-list" style={{ marginTop: 14 }}>
            {reviews.filter((review) => ["approved", "rejected", "resolved"].includes(review.status)).slice(0, 10).map((review) => (
              <div className="record" key={review.id}>
                <div><div className="panel-kicker">{review.status}</div><p className="empty">{review.decision_reason ?? "No reason recorded."}</p></div>
                <div className="record-meta">{review.reviewed_at ? new Date(review.reviewed_at).toLocaleString() : "Recorded"}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
