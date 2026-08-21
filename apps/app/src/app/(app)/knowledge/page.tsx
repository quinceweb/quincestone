import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

async function createKnowledge(formData: FormData) {
  "use server";
  const context = await getCurrentWorkspace();
  if (!context || !["owner", "admin"].includes(context.role)) return;

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const version = String(formData.get("version") ?? "").trim();
  if (title.length < 2 || title.length > 160 || content.length < 1 || content.length > 12000 || version.length < 1 || version.length > 80) return;

  const supabase = await createClient();
  await supabase.from("knowledge_documents").insert({
    workspace_id: context.workspace.id,
    title,
    content,
    version,
    status: "active",
  });

  revalidatePath("/knowledge");
  revalidatePath("/intelligence/interactions");
}

export default async function KnowledgePage() {
  const context = await getCurrentWorkspace();
  if (!context) return null;

  const supabase = await createClient();
  const { data: documents, error } = await supabase
    .from("knowledge_documents")
    .select("id, title, version, status, updated_at")
    .eq("workspace_id", context.workspace.id)
    .order("updated_at", { ascending: false })
    .limit(25);

  const canManage = ["owner", "admin"].includes(context.role);
  const hasData = !error && (documents?.length ?? 0) > 0;

  return (
    <section className="page-section">
      <div className="eyebrow">Governance · {context.workspace.name}</div>
      <h1>Knowledge</h1>
      <p className="lede">Approved workspace knowledge gives Edge the context it needs to understand customer demand without inventing business facts.</p>

      {canManage ? (
        <form action={createKnowledge} className="panel" style={{ marginTop: 28, display: "grid", gap: 12 }}>
          <div className="panel-kicker">Add approved knowledge</div>
          <label>Title<input name="title" required maxLength={160} placeholder="Service overview" /></label>
          <label>Version<input name="version" required maxLength={80} placeholder="2026.08" /></label>
          <label>Content<textarea name="content" required maxLength={12000} rows={7} placeholder="Approved business facts, service boundaries, operating information or customer-facing guidance." /></label>
          <button className="button" type="submit">Add knowledge source</button>
        </form>
      ) : null}

      {hasData ? (
        <div className="record-list" aria-label="Workspace knowledge sources">
          {documents!.map((document) => (
            <article className="record" key={document.id}>
              <div>
                <div className="panel-kicker">{document.status} · {document.version}</div>
                <h2>{document.title}</h2>
                <p className="empty">Updated {new Date(document.updated_at).toLocaleString()}</p>
              </div>
              <div className="record-meta">Approved context</div>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel panel-empty">
          <div className="panel-kicker">Workspace knowledge</div>
          <h2>No knowledge sources connected</h2>
          <p className="empty">{canManage ? "Add the first approved source above. Edge will only use active workspace knowledge during governed execution." : "No active workspace knowledge is available yet."}</p>
        </div>
      )}
    </section>
  );
}
