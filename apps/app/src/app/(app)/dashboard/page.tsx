import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

async function getProductionSignals(workspaceId: string) {
  const supabase = await createClient();
  const [traces, appointments, events, alerts] = await Promise.all([
    supabase.from("intelligence_traces").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("appointment_requests").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("integration_events").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("operational_alerts").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId).in("status", ["open", "acknowledged"]),
  ]);
  return {
    traces: traces.count ?? 0,
    appointments: appointments.count ?? 0,
    integrationEvents: events.count ?? 0,
    alerts: alerts.count ?? 0,
    alertsError: alerts.error,
  };
}

export default async function DashboardPage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;
  const signals = await getProductionSignals(context.workspace.id);
  const hasActivity = signals.traces + signals.appointments + signals.integrationEvents > 0;
  const hasAttention = signals.alerts > 0;

  const records = [
    ["Intelligence traces", signals.traces, "/intelligence/traces", "Inspect governed intelligence activity"],
    ["Appointment requests", signals.appointments, "/escalations", "Review requests requiring action"],
    ["Integration events", signals.integrationEvents, "/integrations", "Inspect connected-system activity"],
  ] as const;

  return (
    <section className="page-section command-center">
      <div className="command-header">
        <div>
          <div className="eyebrow">Command Center · {context.workspace.name}</div>
          <h1>Demand to outcome.</h1>
          <p className="lede">Start with what needs attention, then move directly into the system surface that can resolve it.</p>
        </div>
        <div className="command-status"><span className="status-dot" /> Workspace authenticated</div>
      </div>

      <section className="command-next panel" aria-labelledby="next-action-title">
        <div>
          <div className="panel-kicker">Operational signal</div>
          <h2 id="next-action-title">{hasAttention ? "Review unresolved operational alerts." : hasActivity ? "Review the latest operating signals." : "Connect the operating foundation."}</h2>
          <p className="empty">
            {signals.alertsError
              ? "Operational alerts are currently unavailable. Existing workspace records remain visible, but alert state is unknown."
              : hasAttention
                ? `${signals.alerts} unresolved alert${signals.alerts === 1 ? "" : "s"} require attention.`
                : hasActivity
                  ? "Use the live workspace records below to decide where attention belongs. Quincestone does not manufacture activity when none exists."
                  : "Your workspace has no recorded production activity yet. Configure the surfaces that will receive demand, intelligence and business actions."}
          </p>
        </div>
        <Link className="command-primary" href={hasAttention ? "/escalations" : hasActivity ? "/intelligence/traces" : "/integrations"}>{hasAttention ? "Review alerts →" : hasActivity ? "Review traces →" : "Open integrations →"}</Link>
      </section>

      <div className="grid command-records">
        {records.map(([title, value, href, description]) => (
          <section className="panel" key={title}>
            <div className="panel-kicker">Production record</div>
            <h2>{title}</h2>
            <div className="metric">{value}</div>
            <p className="record-description">{description}</p>
            <Link className="panel-link" href={href}>Open surface →</Link>
          </section>
        ))}
      </div>

      <section className="panel" aria-labelledby="alert-state-title" style={{ marginTop: 20 }}>
        <div className="record">
          <div>
            <div className="panel-kicker">Operational alerts</div>
            <h2 id="alert-state-title">{signals.alertsError ? "Unknown" : signals.alerts}</h2>
            <p className="empty">Only durable alerts recorded for this workspace are shown. No synthetic health or incident data is generated.</p>
          </div>
          <div className="record-meta">{signals.alertsError ? "Telemetry unavailable" : "Live workspace state"}</div>
        </div>
      </section>

      <section className="command-principles">
        <div><span>01</span><strong>Observe</strong><p>Read what the workspace actually records.</p></div>
        <div><span>02</span><strong>Decide</strong><p>Apply knowledge, policy and human judgment.</p></div>
        <div><span>03</span><strong>Act</strong><p>Move into the authorized operating surface.</p></div>
      </section>
    </section>
  );
}
