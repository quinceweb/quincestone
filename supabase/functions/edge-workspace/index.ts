import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { runEdgePipeline } from "../_shared/edge-pipeline.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, x-client-info, apikey, content-type", "access-control-allow-methods": "POST, OPTIONS" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json(null, 204);
  if (req.method !== "POST") return json({ error: { code: "method_not_allowed", message: "Use POST." } }, 405);
  if (Number(req.headers.get("content-length") ?? 0) > 8192) return json({ error: { code: "request_too_large", message: "Request is too large." } }, 413);
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: { code: "unauthorized", message: "Authentication is required." } }, 401);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRole) return json({ error: { code: "configuration_error", message: "The workspace runtime is not configured." } }, 500);
  const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) return json({ error: { code: "unauthorized", message: "The session could not be verified." } }, 401);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: { code: "invalid_json", message: "Request body must be valid JSON." } }, 400); }
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const workspaceId = typeof input.workspace_id === "string" ? input.workspace_id : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const customerId = typeof input.customer_id === "string" ? input.customer_id : null;
  const idempotencyKey = typeof input.idempotency_key === "string" ? input.idempotency_key.trim() : crypto.randomUUID();
  if (!workspaceId) return json({ error: { code: "workspace_required", message: "A workspace is required." } }, 400);
  if (message.length < 3 || message.length > 2000) return json({ error: { code: "invalid_message", message: "Message must be between 3 and 2,000 characters." } }, 400);
  if (idempotencyKey.length < 16 || idempotencyKey.length > 200) return json({ error: { code: "invalid_idempotency_key", message: "The interaction idempotency key is invalid." } }, 400);
  const { data: membership } = await admin.from("workspace_members").select("workspace_id").eq("workspace_id", workspaceId).eq("user_id", userData.user.id).maybeSingle();
  if (!membership) return json({ error: { code: "forbidden", message: "You are not a member of this workspace." } }, 403);
  const { data: workspace } = await admin.from("workspaces").select("id, name, slug").eq("id", workspaceId).maybeSingle();
  if (!workspace) return json({ error: { code: "workspace_not_found", message: "Workspace not found." } }, 404);
  if (customerId) {
    const { data: customer } = await admin.from("customers").select("id").eq("id", customerId).eq("workspace_id", workspaceId).maybeSingle();
    if (!customer) return json({ error: { code: "customer_not_found", message: "Customer does not belong to this workspace." } }, 400);
  }
  try {
    return json(await runEdgePipeline({ admin, workspace, message, customerId, idempotencyKey, source: "app" }));
  } catch (error) {
    console.error(JSON.stringify({ code: "workspace_edge_failed", error: error instanceof Error ? error.message : "unknown" }));
    return json({ error: { code: "runtime_failure", message: "The workspace intelligence runtime could not complete this request." } }, 500);
  }
});
