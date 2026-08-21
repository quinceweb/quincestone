import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createWorkspace } from "@/lib/workspaces";

async function submitWorkspace(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "");
  await createWorkspace(name);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { count } = await supabase
    .from("workspace_members")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) > 0) redirect("/dashboard");

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="brand">QUINCESTONE</div>
        <div className="eyebrow" style={{ marginTop: 18 }}>Workspace setup</div>
        <h1 style={{ fontSize: 30 }}>Create your workspace</h1>
        <p className="lede">Your workspace is the tenant boundary for Quincestone operations, intelligence, workflows and integrations.</p>
        <form action={submitWorkspace} style={{ display: "grid", gap: 12, marginTop: 24 }}>
          <label>
            Workspace name
            <input name="name" required minLength={2} maxLength={120} placeholder="Acme Business" />
          </label>
          <button type="submit">Create workspace</button>
        </form>
      </section>
    </main>
  );
}
