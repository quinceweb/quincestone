import { EdgeRunPanel } from "@/components/EdgeRunPanel";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

export default async function InteractionsPage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;

  const supabase = await createClient();
  const { data: interactions, error } = await supabase
    .from("interactions")
    .select("id, source, status, intent, created_at, customer_id, trace_id")
    .eq("workspace_id", context.workspace.id)
    .order("created_at", { ascending: false })
    .limit(25);

  const hasData = !error && (interactions?.length ?? 0) > 0;

  return (
    <section className="page-section">
      <div className="eyebrow">Intelligence · {context.workspace.name}</div>
      <h1>Interactions</h1>
      <p className="lede">Customer demand enters Quincestone as an interaction. Edge now turns that interaction into a governed intent, qualification, policy decision, workflow route, proposed action and recorded outcome.</p>

      <EdgeRunPanel />

      {hasData ? (
        <div className="record-list" aria-label="Recent customer interactions">
          {interactions!.map((interaction) => (
            <article className="record" key={interaction.id}>
              <div>
                <div className="panel-kicker">{interaction.status}</div>
                <h2>{interaction.source}</h2>
                <p className="empty">{new Date(interaction.created_at).toLocaleString()} · {interaction.customer_id ? "Known customer" : "No customer linked"}{interaction.trace_id ? " · Edge trace recorded" : ""}</p>
              </div>
              <div className="record-meta">{interaction.id.slice(0, 8)}</div>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel panel-empty">
          <div className="panel-kicker">Production state</div>
          <h2>No interactions yet</h2>
          <p className="empty">There is no production interaction data available for this workspace. Run a governed Edge interaction above to create the first operational record.</p>
        </div>
      )}
    </section>
  );
}
