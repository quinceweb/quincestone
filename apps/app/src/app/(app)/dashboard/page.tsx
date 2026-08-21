import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

async function getProductionCounts(workspaceId: string) {
  const supabase = await createClient();
  const [traces, appointments, events] = await Promise.all([
    supabase.from("intelligence_traces").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("appointment_requests").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("integration_events").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
  ]);

  return {
    traces: traces.count ?? 0,
    appointments: appointments.count ?? 0,
    integrationEvents: events.count ?? 0,
  };
}

export default async function DashboardPage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;

  const counts = await getProductionCounts(context.workspace.id);

  const records = [
    ["Intelligence traces", counts.traces, "/intelligence/traces"],
    ["Appointment requests", counts.appointments, "/escalations"],
    ["Integration events", counts.integrationEvents, "/integrations"],
  ] as const;

  return (
    <section className="page-section">
      <div className="eyebrow">Command Center · {context.workspace.name}</div>
      <h1>Demand to outcome.</h1>
      <p className="lede">The operating console is where incoming demand, governed intelligence and business action meet. Production figures below come from the authenticated workspace boundary.</p>

      <div className="grid">
        {records.map(([title, value, href]) => (
          <section className="panel" key={title}>
            <div className="panel-kicker">Production record</div>
            <h2>{title}</h2>
            <div className="metric">{value}</div>
            <a className="panel-link" href={href}>Open surface →</a>
          </section>
        ))}
      </div>

      <section className="panel panel-empty">
        <div className="panel-kicker">System boundary</div>
        <h2>Truthful by default</h2>
        <p className="empty">No operational metric is synthesized. Counts are read from the current workspace and remain zero until real production records exist.</p>
      </section>
    </section>
  );
}
