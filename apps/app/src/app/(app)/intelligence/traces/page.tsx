import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

export default async function TracesPage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;

  const supabase = await createClient();
  const { data: traces, error } = await supabase
    .from("intelligence_traces")
    .select("trace_id, status, duration_ms, intent, qualification, workflow, escalation, action_proposal, outcome, interaction_id, execution_version, created_at")
    .eq("workspace_id", context.workspace.id)
    .order("created_at", { ascending: false })
    .limit(25);

  const hasData = !error && (traces?.length ?? 0) > 0;

  return (
    <section className="page-section">
      <div className="eyebrow">Intelligence · {context.workspace.name}</div>
      <h1>Traces</h1>
      <p className="lede">Every governed Edge execution records what was observed, what was derived, what policy constrained the decision, what action was proposed and what outcome was recorded.</p>

      {hasData ? (
        <div className="record-list" aria-label="Recent intelligence traces">
          {traces!.map((trace) => {
            const intent = trace.intent as { primary?: string; confidence?: number } | null;
            const workflow = trace.workflow as { name?: string } | null;
            const escalation = trace.escalation as { required?: boolean; priority?: string } | null;
            const outcome = trace.outcome as { status?: string; summary?: string } | null;
            return (
              <article className="record" key={trace.trace_id}>
                <div>
                  <div className="panel-kicker">{trace.status} · {trace.execution_version}</div>
                  <h2>{intent?.primary ?? "Unclassified interaction"}</h2>
                  <p className="empty">{new Date(trace.created_at).toLocaleString()} · {workflow?.name ?? "No workflow"} · {outcome?.status ?? "No outcome"}</p>
                  <p className="empty">{outcome?.summary ?? "No outcome summary recorded."}</p>
                </div>
                <div className="record-meta">{trace.duration_ms} ms · {escalation?.required ? `${escalation.priority ?? "normal"} review` : "no escalation"}</div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="panel panel-empty">
          <div className="panel-kicker">Audit trail</div>
          <h2>No traces yet</h2>
          <p className="empty">No production execution traces are available for this workspace.</p>
        </div>
      )}
    </section>
  );
}
