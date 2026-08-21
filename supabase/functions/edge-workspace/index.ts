import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const MAX_BODY = 8_192;
const MAX_MESSAGE = 2_000;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;
const buckets = new Map<string, { started: number; count: number }>();

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
    "access-control-allow-methods": "POST, OPTIONS",
  },
});

const stage = (timing: Record<string, number>, name: string, started: number) => {
  timing[name] = Math.max(0, Math.round(performance.now() - started));
};

function classify(message: string) {
  const text = message.toLowerCase();
  const patterns = [
    ["booking_request", /(book|booking|schedule|appointment|availability|meeting|demo)/],
    ["quote_request", /(quote|estimate|pricing|price|cost|proposal)/],
    ["support_request", /(support|issue|problem|broken|not working|help|refund|cancel)/],
    ["service_request", /(service|repair|install|implementation|consult|assessment|audit|build)/],
  ] as const;

  const match = patterns.find(([, pattern]) => pattern.test(text));
  const primary = match?.[0] ?? "general_inquiry";
  const confidence = match ? 0.91 : 0.64;
  const urgency = /(urgent|asap|emergency|immediately|today)/.test(text) ? "high" : "normal";
  const ambiguity = confidence < 0.8 ? ["The interaction does not identify a specific business intent yet."] : [];

  return {
    primary,
    confidence,
    urgency,
    entities: {
      emailPresent: /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/.test(message),
      phonePresent: /(?:\+?\d[\d\s().-]{7,}\d)/.test(message),
    },
    ambiguity,
    clarificationRequired: confidence < 0.8,
  };
}

function overlapScore(message: string, content: string) {
  const words = new Set(message.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3));
  const contentWords = new Set(content.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3));
  let overlap = 0;
  for (const word of words) if (contentWords.has(word)) overlap += 1;
  return overlap;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json(null, 204);
  if (req.method !== "POST") return json({ error: { code: "method_not_allowed", message: "Use POST." } }, 405);

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY) return json({ error: { code: "request_too_large", message: "Request is too large." } }, 413);

  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now - bucket.started > WINDOW_MS) buckets.set(ip, { started: now, count: 1 });
  else if (bucket.count >= MAX_REQUESTS) return json({ error: { code: "rate_limited", message: "Too many requests. Try again shortly." } }, 429);
  else bucket.count += 1;

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return json({ error: { code: "unauthorized", message: "Authentication is required." } }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRole) return json({ error: { code: "configuration_error", message: "The workspace runtime is not configured." } }, 500);

  const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) return json({ error: { code: "unauthorized", message: "The session could not be verified." } }, 401);

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: { code: "invalid_json", message: "Request body must be valid JSON." } }, 400); }
  if (!body || typeof body !== "object") return json({ error: { code: "invalid_request", message: "Request must be an object." } }, 400);

  const input = body as Record<string, unknown>;
  const workspaceId = typeof input.workspace_id === "string" ? input.workspace_id : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const customerId = typeof input.customer_id === "string" ? input.customer_id : null;

  if (!workspaceId) return json({ error: { code: "workspace_required", message: "A workspace is required." } }, 400);
  if (message.length < 3 || message.length > MAX_MESSAGE) return json({ error: { code: "invalid_message", message: "Message must be between 3 and 2,000 characters." } }, 400);

  const { data: membership } = await admin
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (!membership) return json({ error: { code: "forbidden", message: "You are not a member of this workspace." } }, 403);

  const { data: workspace, error: workspaceError } = await admin
    .from("workspaces")
    .select("id, name, slug")
    .eq("id", workspaceId)
    .maybeSingle();
  if (workspaceError || !workspace) return json({ error: { code: "workspace_not_found", message: "Workspace not found." } }, 404);

  if (customerId) {
    const { data: customer } = await admin
      .from("customers")
      .select("id")
      .eq("id", customerId)
      .eq("workspace_id", workspaceId)
      .maybeSingle();
    if (!customer) return json({ error: { code: "customer_not_found", message: "Customer does not belong to this workspace." } }, 400);
  }

  const traceId = `qn_${crypto.randomUUID()}`;
  const totalStart = performance.now();
  const timing: Record<string, number> = {};

  const interactionInsert = await admin.from("interactions").insert({
    workspace_id: workspaceId,
    customer_id: customerId,
    source: "app",
    status: "received",
    message,
  }).select("id").single();
  if (interactionInsert.error || !interactionInsert.data) {
    return json({ error: { code: "interaction_create_failed", message: "The interaction could not be recorded." } }, 500);
  }
  const interactionId = interactionInsert.data.id as string;

  try {
    const intentStart = performance.now();
    const intent = classify(message);
    stage(timing, "intent", intentStart);

    const contextStart = performance.now();
    const context = {
      workspaceId,
      workspaceName: workspace.name,
      source: "app",
      customerLinked: Boolean(customerId),
      messageLength: message.length,
    };
    stage(timing, "context", contextStart);

    const qualificationStart = performance.now();
    const missing = intent.clarificationRequired ? ["specific request details"] : [];
    const qualification = {
      status: missing.length ? "needs_clarification" : "qualified",
      reasonCodes: missing.length ? ["LOW_CONFIDENCE_INTENT"] : [intent.primary.toUpperCase()],
      nextRequiredInformation: missing,
    };
    stage(timing, "qualification", qualificationStart);

    const knowledgeStart = performance.now();
    const { data: knowledgeRows } = await admin
      .from("knowledge_documents")
      .select("id, title, content, version")
      .eq("workspace_id", workspaceId)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(20);
    const knowledge = {
      workspaceId,
      matches: (knowledgeRows ?? [])
        .map((row) => ({ ...row, score: overlapScore(message, row.content) }))
        .filter((row) => row.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(({ id, title, version, score }) => ({ id, title, version, score })),
    };
    stage(timing, "knowledge", knowledgeStart);

    const policyStart = performance.now();
    const { data: policyRows } = await admin
      .from("policies")
      .select("id, name, description, effect, priority, status")
      .eq("workspace_id", workspaceId)
      .eq("status", "active")
      .order("priority", { ascending: true })
      .limit(20);
    const policies = policyRows ?? [];
    const strongestEffect = policies.some((p) => p.effect === "deny")
      ? "deny"
      : policies.some((p) => p.effect === "constrain")
        ? "constrain"
        : policies.some((p) => p.effect === "require_review")
          ? "require_review"
          : "allow";
    const policy = {
      source: policies.length ? "workspace" : "system-default",
      decisions: policies.length
        ? policies.map((p) => ({ id: p.id, result: p.effect, explanation: p.description, priority: p.priority }))
        : [{ id: "system-human-boundary-v1", result: "require_review", explanation: "No workspace policy has authorized autonomous external side effects; proposed actions remain reviewable.", priority: 100 }],
    };
    stage(timing, "policy", policyStart);

    const workflowStart = performance.now();
    const workflowName = intent.primary === "booking_request"
      ? "booking-intake"
      : intent.primary === "quote_request"
        ? "quote-intake"
        : intent.primary === "support_request"
          ? "support-intake"
          : intent.primary === "service_request"
            ? "service-intake"
            : "general-inquiry";
    const workflow = { name: workflowName, route: intent.primary, status: qualification.status };
    stage(timing, "workflow", workflowStart);

    const escalationStart = performance.now();
    const consequential = ["booking_request", "quote_request", "support_request"].includes(intent.primary);
    const humanReviewRequired = intent.clarificationRequired || consequential || strongestEffect !== "allow";
    const escalation = {
      required: humanReviewRequired,
      reason: intent.clarificationRequired ? "Low-confidence interpretation" : consequential ? "Proposed action may affect a customer or external system" : strongestEffect !== "allow" ? "Workspace policy requires review or constrains execution" : null,
      priority: intent.urgency === "high" ? "high" : humanReviewRequired ? "normal" : "low",
      safeNextAction: humanReviewRequired ? "Present the proposed next step for human review." : "Record the interaction and continue without external side effects.",
    };
    stage(timing, "escalation", escalationStart);

    const actionStart = performance.now();
    const actionProposal = {
      kind: humanReviewRequired ? "human_review" : "record_only",
      execute: false,
      authorizationRequired: consequential,
      externalSideEffect: false,
      description: humanReviewRequired ? `Review the ${workflowName} proposal before any external action.` : `Record ${workflowName} without external side effects.`,
    };
    stage(timing, "action", actionStart);

    const outcomeStart = performance.now();
    const outcome = qualification.status === "needs_clarification"
      ? { status: "needs_information", summary: "The interaction needs more information before a reliable workflow decision can be made." }
      : humanReviewRequired
        ? { status: "ready_for_review", summary: `Routed to ${workflowName}; human review is required before consequential action.` }
        : { status: "recorded", summary: `Recorded and routed to ${workflowName} without external side effects.` };
    stage(timing, "outcome", outcomeStart);

    timing.total = Math.max(0, Math.round(performance.now() - totalStart));

    const observedFacts = {
      source: "app",
      customerLinked: Boolean(customerId),
      messageLength: message.length,
      messageReceived: true,
    };

    const { error: traceError } = await admin.from("intelligence_traces").insert({
      trace_id: traceId,
      mode: "workspace",
      tenant_key: `workspace:${workspaceId}`,
      workspace_id: workspaceId,
      interaction_id: interactionId,
      customer_id: customerId,
      execution_version: "edge-workspace-1",
      observed_facts: observedFacts,
      intent,
      qualification,
      policy,
      workflow,
      escalation,
      action_proposal: actionProposal,
      outcome,
      status: "completed",
      duration_ms: timing.total,
    });

    if (traceError) throw traceError;

    const { error: interactionError } = await admin.from("interactions").update({
      status: humanReviewRequired ? "escalated" : "qualified",
      intent,
      qualification,
      outcome,
      trace_id: traceId,
    }).eq("id", interactionId).eq("workspace_id", workspaceId);

    if (interactionError) throw interactionError;

    return json({
      trace: {
        traceId,
        workspaceId,
        interactionId,
        customerId,
        executionVersion: "edge-workspace-1",
        intent,
        context,
        qualification,
        knowledge,
        policy,
        workflow,
        escalation,
        actionProposal,
        outcome,
        timing,
      },
    });
  } catch (error) {
    await admin.from("interactions").update({ status: "failed", outcome: { status: "failed", summary: "The Edge execution failed before a verified outcome was recorded." } }).eq("id", interactionId).eq("workspace_id", workspaceId);
    console.error(JSON.stringify({ code: "workspace_edge_failed", traceId, error: error instanceof Error ? error.message : "unknown" }));
    return json({ error: { code: "runtime_failure", message: "The workspace intelligence runtime could not complete this request." }, traceId, interactionId }, 500);
  }
});
