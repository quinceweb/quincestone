import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

async function createPolicy(formData: FormData) {
  "use server";
  const context = await getCurrentWorkspace();
  if (!context || !["owner", "admin"].includes(context.role)) return;

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const effect = String(formData.get("effect") ?? "require_review");
  const priority = Number(formData.get("priority") ?? 100);
  if (name.length < 2 || name.length > 160 || description.length < 1 || description.length > 2000 || !["allow", "require_review", "constrain", "deny"].includes(effect) || !Number.isInteger(priority) || priority < 1 || priority > 10000) return;

  const supabase = await createClient();
  await supabase.from("policies").insert({ workspace_id: context.workspace.id, name, description, effect, priority, status: "active" });
  revalidatePath("/policies");
  revalidatePath("/intelligence/interactions");
}

export default async function PoliciesPage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;

  const supabase = await createClient();
  const { data: policies, error } = await supabase
    .from("policies")
    .select("id, name, description, effect, priority, status, updated_at")
    .eq("workspace_id", context.workspace.id)
    .order("priority", { ascending: true })
    .limit(25);

  const canManage = ["owner", "admin"].includes(context.role);
  const hasData = !error && (policies?.length ?? 0) > 0;

  return (
    <section className="page-section">
      <div className="eyebrow">Governance · {context.workspace.name}</div>
      <h1>Policies</h1>
      <p className="lede">Policies define what Quincestone Edge may decide, what requires review, and which business rules must remain explicit.</p>

      {canManage ? (
        <form action={createPolicy} className="panel" style={{ marginTop: 28, display: "grid", gap: 12 }}>
          <div className="panel-kicker">Add decision policy</div>
          <label>Name<input name="name" required maxLength={160} placeholder="External actions require review" /></label>
          <label>Description<textarea name="description" required maxLength={2000} rows={4} placeholder="Explain the rule in terms Edge can safely record and enforce." /></label>
          <label>Effect<select name="effect" defaultValue="require_review"><option value="allow">Allow</option><option value="require_review">Require review</option><option value="constrain">Constrain</option><option value="deny">Deny</option></select></label>
          <label>Priority<input name="priority" type="number" min={1} max={10000} defaultValue={100} /></label>
          <button className="button" type="submit">Add policy</button>
        </form>
      ) : null}

      {hasData ? (
        <div className="record-list" aria-label="Workspace policies">
          {policies!.map((policy) => (
            <article className="record" key={policy.id}>
              <div>
                <div className="panel-kicker">{policy.status} · priority {policy.priority}</div>
                <h2>{policy.name}</h2>
                <p className="empty">{policy.description}</p>
              </div>
              <div className="record-meta">{policy.effect}</div>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel panel-empty">
          <div className="panel-kicker">Decision governance</div>
          <h2>No production policies configured</h2>
          <p className="empty">{canManage ? "Add the first workspace policy above. Until then, Edge keeps external side effects disabled and proposes human review for consequential requests." : "No active workspace policies are configured yet."}</p>
        </div>
      )}
    </section>
  );
}
