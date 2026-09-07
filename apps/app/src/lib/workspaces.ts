import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export async function getCurrentWorkspaceMembership() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Keep membership resolution as two explicit reads. The previous embedded
  // `workspaces(...)` relation made the auth boundary depend on the related
  // table's RLS policy and could turn a valid no-workspace state into a 500.
  const { data: membership, error: membershipError } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error("We couldn't resolve your Quincestone workspace.");
  }

  if (!membership) return null;

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id, name, slug")
    .eq("id", membership.workspace_id)
    .maybeSingle();

  if (workspaceError) {
    throw new Error("We couldn't resolve your Quincestone workspace.");
  }

  if (!workspace) return null;

  return {
    workspace_id: membership.workspace_id,
    role: membership.role,
    workspaces: workspace,
  };
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
    const { data: workspace, error } = await supabase
      .from("workspaces")
      .insert({ name: cleanName, slug, created_by: user.id })
      .select("id")
      .single();

    if (!error && workspace) return workspace.id as string;
    if (error?.code === "23505") continue;
    if (error?.code === "42501") throw new Error("Workspace creation is not authorized for this account.");
    throw new Error(error?.message ?? "The workspace could not be created.");
  }

  throw new Error("A workspace with that name already exists.");
}
