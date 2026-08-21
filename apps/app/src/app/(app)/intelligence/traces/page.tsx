import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

export default async function TracesPage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;

  const supabase = await createClient();
  const { data: traces, error } = await supabase
    .from("intelligence_traces")
    .select("trace_id, status, duration_ms, intent, created_at")
    .eq("workspace_id", context.workspace.id)
    .order("created_at", { ascending: false })
    .limit(25);

  const hasData = !error && (traces?.length ?? 0) > 0;

  return (
    <section className="page-section">
      <div className="eyebrow">Intelligence · {context.workspace.name}</div>
      <h1>Traces</h1>
      <p className="lede">Governed execution traces provide the audit trail for how Edge understood, qualified, routed and acted on an interaction.</p>

      {hasData ? (
        <div className="record-list" aria-label="Recent intelligence traces">
          {traces!.map((trace) => (
            <article className="record" key={trace.trace_id}>
              <div>
                <div className="panel-kicker">{trace.status}</div>
                <h2>{trace.trace_id}</h2>
                <p className="empty">{new Date(trace.created_at).toLocaleString()}</p>
              </div>
              <div className="record-meta">
                <span>{trace.duration_ms} ms</span>
              </div>
            </article>
          ))}
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
