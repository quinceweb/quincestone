import { createClient } from "@supabase/supabase-js";

export type PlatformRole = "admin" | "operator";

export async function requirePlatformRole(required: PlatformRole = "admin") {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Platform authority is not configured");
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // This boundary intentionally requires an authenticated user identifier from
  // the caller's trusted server context. It must never be sourced from client input.
  throw new Error(`Platform ${required} authorization requires a trusted request identity`);
}
