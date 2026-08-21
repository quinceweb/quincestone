import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export async function createWorkspace(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required.");

  const cleanName = name.trim();
  if (cleanName.length < 2 || cleanName.length > 120) {
    throw new Error("Workspace name must be between 2 and 120 characters.");
  }

  const baseSlug = slugify(cleanName);
  if (!baseSlug) throw new Error("Workspace name must contain letters or numbers.");

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .insert({ name: cleanName, slug, created_by: user.id })
      .select("id")
      .single();

    if (workspaceError) {
      if (workspaceError.code === "23505") continue;
      throw new Error(workspaceError.message);
    }

    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert({ workspace_id: workspace.id, user_id: user.id, role: "owner" });

    if (memberError) {
      await supabase.from("workspaces").delete().eq("id", workspace.id);
      throw new Error(memberError.message);
    }

    return workspace.id;
  }

  throw new Error("A workspace with that name already exists.");
}
