import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { runEdgePipeline } from "../_shared/edge-pipeline.ts";

const MAX_BODY = 8192;
const MAX_MESSAGE = 2000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function response(origin: string | null, body: unknown, status = 200) {
  const headers: Record<string, string> = { "content-type": "application/json", "cache-control": "no-store", vary: "Origin" };
  if (origin) headers["access-control-allow-origin"] = origin;
  headers["access-control-allow-headers"] = "content-type, x-idempotency-key";
  headers["access-control-allow-methods"] = "POST, OPTIONS";
  return new Response(body === null ? null : JSON.stringify(body), { status, headers });
}

function normalizeOrigin(value: string) {
  try { const url = new URL(value); return `${url.protocol}//${url.host}`; } catch { return ""; }
}

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const normalizedOrigin = origin ? normalizeOrigin(origin) : "";
  const installationKey = new URL(req.url).searchParams.get("installation") ?? "";
  if (!origin || !normalizedOrigin) return response(null, { error: { code: "origin_required", message: "This channel requires an approved website origin." } }, 403);
  if (!UUID.test(installationKey)) return response(null, { error: { code: "invalid_installation", message: "This Edge installation is unavailable." } }, 404);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRole) return response(null, { error: { code: "configuration_error", message: "This channel is temporarily unavailable." } }, 503);
  const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
  const { data: installation } = await admin.from("edge_installations")
    .select("id, workspace_id, status, allowed_origins, configuration")
    .eq("public_installation_key", installationKey).maybeSingle();
  if (!installation || installation.status !== "active") return response(null, { error: { code: "invalid_installation", message: "This Edge installation is unavailable." } }, 404);
  const allowed = (installation.allowed_origins as string[]).map(normalizeOrigin).includes(normalizedOrigin);
  if (!allowed) return response(null, { error: { code: "origin_not_allowed", message: "This website is not approved for this installation." } }, 403);
  if (req.method === "OPTIONS") return response(normalizedOrigin, null, 204);
  if (req.method !== "POST") return response(normalizedOrigin, { error: { code: "method_not_allowed", message: "Use POST." } }, 405);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return response(normalizedOrigin, { error: { code: "request_too_large", message: "Request is too large." } }, 413);

  const idempotencyKey = req.headers.get("x-idempotency-key")?.trim() ?? "";
  if (idempotencyKey.length < 16 || idempotencyKey.length > 200) return response(normalizedOrigin, { error: { code: "invalid_idempotency_key", message: "A valid request identifier is required." } }, 400);
  const clientAddress = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const fingerprint = await sha256(`${installation.id}:${clientAddress}`);
  const quota = await admin.rpc("consume_edge_intake_quota", { target_installation_id: installation.id, target_fingerprint: fingerprint, target_limit: 20, target_window_seconds: 60 });
  if (quota.error || quota.data !== true) return response(normalizedOrigin, { error: { code: "rate_limited", message: "Too many requests. Please try again shortly." } }, 429);

  let body: unknown;
  try { body = await req.json(); } catch { return response(normalizedOrigin, { error: { code: "invalid_json", message: "Request body must be valid JSON." } }, 400); }
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const sessionId = typeof input.session_id === "string" ? input.session_id.trim() : null;
  if (message.length < 3 || message.length > MAX_MESSAGE) return response(normalizedOrigin, { error: { code: "invalid_message", message: "Your request must be between 3 and 2,000 characters." } }, 400);
  if (sessionId && (sessionId.length < 16 || sessionId.length > 200)) return response(normalizedOrigin, { error: { code: "invalid_session", message: "The channel session is invalid." } }, 400);

  const { data: workspace } = await admin.from("workspaces").select("id, name, slug").eq("id", installation.workspace_id).maybeSingle();
  if (!workspace) return response(normalizedOrigin, { error: { code: "invalid_installation", message: "This Edge installation is unavailable." } }, 404);
  try {
    const result = await runEdgePipeline({ admin, workspace, message, installationId: installation.id, channelSessionId: sessionId, idempotencyKey, source: "edge_installation" });
    await admin.from("edge_installations").update({ last_activity_at: new Date().toISOString() }).eq("id", installation.id).eq("status", "active");
    const interaction = result.duplicate ? result.interaction : result.trace;
    return response(normalizedOrigin, {
      received: true,
      duplicate: result.duplicate,
      reference: interaction?.interactionId ?? interaction?.id,
      status: interaction?.outcome?.status ?? "received",
      message: interaction?.outcome?.summary ?? "Your request was received by the business.",
    }, result.duplicate ? 200 : 201);
  } catch (error) {
    console.error(JSON.stringify({ code: "edge_channel_failed", installationId: installation.id, error: error instanceof Error ? error.message : "unknown" }));
    return response(normalizedOrigin, { error: { code: "submission_failed", message: "The request could not be confirmed. Your text has not been cleared; please retry." } }, 503);
  }
});
