import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

export default async function CommandCenterPage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;

  const supabase = await createClient();
  const workspaceId = context.workspace.id;

  const [interactions, reviews, outcomes, failed] = await Promise.all([
    supabase.from("interactions").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId).in("status", ["received", "qualifying", "qualified", "routed", "in_progress", "escalated"]),
    supabase.from("human_reviews").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId).in("status", ["pending", "in_review"]),
    supabase.from("interactions").select("id, status, outcome, created_at").eq("workspace_id", workspaceId).in("status", ["completed", "in_progress"]).order("created_at", { ascending: false }).limit(5),
    supabase.from("interactions").select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId).eq("status", "failed"),
  ]);

  return (
    <section className="page-section">
      <div className="eyebrow">Command Center · {context.workspace.name}</div>
      <h1>Demand to outcome.</h1>
      <p className="lede">The operating console shows what is actually happening in this workspace: incoming demand, governed intelligence, human judgment and recorded outcomes.</p>
      <div className="grid">
        <section className="panel"><div className="panel-kicker">Demand</div><h2>{interactions.count ?? 0}</h2><p className="empty">Open interactions currently moving through the workspace.</p></section>
        <section className="panel"><div className="panel-kicker">Human judgment</div><h2>{reviews.count ?? 0}</h2><p className="empty">Pending or in-review decisions requiring accountable action.</p></section>
        <section className="panel"><div className="panel-kicker">Execution</div><h2>{failed.count ?? 0}</h2><p className="empty">Failed interaction executions requiring attention.</p></section>
        <section className="panel"><div className="panel-kicker">Outcome</div><h2>{outcomes.data?.length ?? 0}</h2><p className="empty">Recent completed or active outcomes recorded by Quincestone.</p></section>
      </div>

      <div className="panel" style={{ marginTop: 28 }}>
        <div className="panel-kicker">Recent operational activity</div>
        <h2>What happened recently</h2>
        {outcomes.data && outcomes.data.length > 0 ? (
          <div className="record-list" style={{ marginTop: 14 }}>
            {outcomes.data.map((item) => (
              <div className="record" key={item.id}>
                <div><div className="panel-kicker">{item.status}</div><p className="empty">{typeof item.outcome === "object" && item.outcome ? String((item.outcome as { summary?: string }).summary ?? "Outcome recorded") : "Outcome recorded"}</p></div>
                <div className="record-meta">{new Date(item.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">No production outcomes have been recorded yet.</p>
        )}
      </div>
    </section>
  );
}
