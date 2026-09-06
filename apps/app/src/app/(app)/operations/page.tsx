import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

export default async function OperationsPage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;

  const supabase = await createClient();
  const { data: alerts, error } = await supabase
    .from("operational_alerts")
    .select("id, severity, status, title, description, source, evidence, correlation_id, first_seen_at, last_seen_at, acknowledged_at, resolved_at")
    .eq("workspace_id", context.workspace.id)
    .order("last_seen_at", { ascending: false })
    .limit(50);

  const unresolved = (alerts ?? []).filter((alert) => ["open", "acknowledged"].includes(alert.status));

  return (
    <section className="page-section">
      <div className="eyebrow">Operations · {context.workspace.name}</div>
      <h1>Operational signals</h1>
      <p className="lede">A durable view of incidents and system conditions recorded for this workspace. Absence of telemetry is reported as unknown, never as a fabricated healthy state.</p>

      {error ? (
        <div className="panel panel-empty" role="alert">
          <div className="panel-kicker">Operational error</div>
          <h2>Signal history unavailable</h2>
          <p className="empty">The operational alert store could not be read. Do not infer system health from this unavailable signal.</p>
        </div>
      ) : (
        <>
          <div className="grid command-records">
            <section className="panel"><div className="panel-kicker">Unresolved</div><div className="metric">{unresolved.length}</div><p className="record-description">Open or acknowledged operational alerts.</p></section>
            <section className="panel"><div className="panel-kicker">Recorded</div><div className="metric">{alerts?.length ?? 0}</div><p className="record-description">Recent durable alert records.</p></section>
          </div>

          {alerts?.length ? (
            <div className="record-list" style={{ marginTop: 20 }}>
              {alerts.map((alert) => (
                <article className="panel" key={alert.id}>
                  <div className="record">
                    <div>
                      <div className="panel-kicker">{alert.severity} · {alert.status} · {alert.source}</div>
                      <h2>{alert.title}</h2>
                      <p className="empty">{alert.description ?? "No description recorded."}</p>
                    </div>
                    <div className="record-meta">{new Date(alert.last_seen_at).toLocaleString()}</div>
                  </div>
                  <div className="record" style={{ marginTop: 16 }}>
                    <div><div className="panel-kicker">Evidence</div><p className="empty">{alert.evidence ? JSON.stringify(alert.evidence) : "No evidence payload recorded."}</p></div>
                    <div className="record-meta">{alert.correlation_id ?? "No correlation ID"}</div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="panel panel-empty" style={{ marginTop: 20 }}>
              <div className="panel-kicker">Operational alerts</div>
              <h2>No alerts recorded</h2>
              <p className="empty">There are currently no durable operational alerts for this workspace. This is a truthful zero state, not a health guarantee.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
