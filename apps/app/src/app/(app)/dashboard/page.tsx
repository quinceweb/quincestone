import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

async function getProductionCounts(workspaceId: string) {
  const supabase = await createClient();
  const [traces, appointments, events] = await Promise.all([
    supabase.from("intelligence_traces").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("appointment_requests").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("integration_events").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId),
  ]);
  return { traces: traces.count ?? 0, appointments: appointments.count ?? 0, integrationEvents: events.count ?? 0 };
}

export default async function DashboardPage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;
  const counts = await getProductionCounts(context.workspace.id);
  const hasActivity = counts.traces + counts.appointments + counts.integrationEvents > 0;

  const records = [
    ["Intelligence traces", counts.traces, "/intelligence/traces", "Inspect governed intelligence activity"],
    ["Appointment requests", counts.appointments, "/escalations", "Review requests requiring action"],
    ["Integration events", counts.integrationEvents, "/integrations", "Inspect connected-system activity"],
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
          <div className="panel-kicker">Next action</div>
          <h2 id="next-action-title">{hasActivity ? "Review the latest operating signals." : "Connect the operating foundation."}</h2>
          <p className="empty">{hasActivity ? "Use the live workspace records below to decide where attention belongs. Quincestone does not manufacture activity when none exists." : "Your workspace has no recorded production activity yet. Configure the surfaces that will receive demand, intelligence and business actions."}</p>
        </div>
        <Link className="command-primary" href={hasActivity ? "/intelligence/traces" : "/integrations"}>{hasActivity ? "Review traces →" : "Open integrations →"}</Link>
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

      <section className="command-principles">
        <div><span>01</span><strong>Observe</strong><p>Read what the workspace actually records.</p></div>
        <div><span>02</span><strong>Decide</strong><p>Apply knowledge, policy and human judgment.</p></div>
        <div><span>03</span><strong>Act</strong><p>Move into the authorized operating surface.</p></div>
      </section>
    </section>
  );
}
