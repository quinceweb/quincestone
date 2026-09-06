import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export type PlatformRole = "admin" | "operator";

async function getServerClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} },
    },
  });
}

export async function requirePlatformRole(required: PlatformRole = "admin") {
  const supabase = await getServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthenticated");
  const functionName = required === "admin" ? "is_platform_admin" : "is_platform_operator";
  const { data: allowed, error } = await supabase.rpc(functionName, { target_user: user.id });
  if (error || allowed !== true) throw new Error("Forbidden");
  return { user, role: required };
}

export async function recordPlatformAudit(input: { action: string; resourceType: string; resourceId?: string | null; metadata?: Record<string, unknown> }) {
  const supabase = await getServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthenticated");
  const { data, error } = await supabase.rpc("record_platform_audit", {
    target_actor: user.id,
    target_action: input.action,
    target_resource_type: input.resourceType,
    target_resource_id: input.resourceId ?? null,
    target_metadata: input.metadata ?? {},
  });
  if (error) throw new Error("Audit recording failed");
  return data as string;
}
