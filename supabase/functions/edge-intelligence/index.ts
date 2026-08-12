import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const TENANT = "northstone-roofing-demo";
const MAX_BODY = 8_192;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const buckets = new Map<string, { started: number; count: number }>();

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json", "access-control-allow-origin": "*", "cache-control": "no-store" },
});

const stage = (timing: Record<string, number>, name: string, started: number) => {
  timing[name] = Math.max(0, Math.round(performance.now() - started));
};

function classify(message: string) {
  const text = message.toLowerCase();
  const emergency = /(emergency|active leak|water (is )?coming|water entering|ceiling|structural|unsafe|collapsed)/.test(text);
  const storm = /(storm|hail|wind|fallen tree|weather)/.test(text);
  const inspection = /(inspect|inspection|check|assessment|evaluate)/.test(text);
  const replacement = /(replace|replacement|new roof|reroof)/.test(text);
  const estimate = /(estimate|quote|cost|price)/.test(text);
  const insurance = /(insurance|claim|adjuster)/.test(text);
  const area = /(brooklyn|new york|nyc|97205|portland|service area)/.test(text);
  const unsupported = /(solar panel|plumbing|hvac|car repair|legal advice)/.test(text);
  let primary = "general information";
  if (emergency) primary = "emergency repair";
  else if (storm && inspection) primary = "storm damage inspection";
  else if (inspection) primary = "inspection";
  else if (replacement) primary = "replacement";
  else if (estimate) primary = "estimate request";
  else if (insurance) primary = "insurance-related inquiry";
  else if (area && /(do you service|service area|serve)/.test(text)) primary = "service-area inquiry";
  else if (unsupported) primary = "unsupported request";
  const confidence = unsupported ? 0.97 : emergency ? 0.96 : (inspection || replacement || estimate || insurance) ? 0.91 : 0.68;
  const urgency = emergency ? "emergency" : storm ? "high" : "normal";
  const ambiguity = confidence < 0.8 ? ["The request does not contain enough detail to identify a specific service workflow."] : [];
  return { primary, confidence, urgency, entities: { serviceAreaSignal: area ? "present" : "unknown" }, ambiguity, clarificationRequired: confidence < 0.8 };
}

function runRuntime(message: string, traceId: string) {
  const totalStart = performance.now();
  const timing: Record<string, number> = {};
  const intentStart = performance.now();
  const intent = classify(message);
  stage(timing, "intent", intentStart);
  const contextStart = performance.now();
  const text = message.toLowerCase();
  const context = {
    serviceLocation: /(brooklyn|new york|nyc)/.test(text) ? "New York / NYC signal" : /(97205|portland)/.test(text) ? "97205 / Portland signal" : null,
    serviceAreaEligible: /(97205|portland)/.test(text) ? true : /(brooklyn|new york|nyc)/.test(text) ? false : null,
    urgency: intent.urgency,
    propertyType: /(commercial|business|office)/.test(text) ? "commercial" : /(home|house|residential)/.test(text) ? "residential" : null,
    damageType: /(leak|water|hail|storm|tree)/.test(text) ? "weather/water damage signal" : null,
    timeline: /(today|tonight|now|tomorrow|next week)/.exec(text)?.[0] ?? null,
    contactReady: /(email|call|phone|contact|schedule|book)/.test(text),
    schedulingIntent: /(schedule|book|appointment|inspection)/.test(text),
    businessHours: "Fictional demo hours: Monday–Friday, 8:00 AM–5:00 PM",
  };
  stage(timing, "context", contextStart);
  const qualificationStart = performance.now();
  const reasons: string[] = [];
  const missing: string[] = [];
  if (context.serviceAreaEligible === false) reasons.push("OUT_OF_AREA");
  if (intent.clarificationRequired) missing.push("specific service or problem details");
  if (context.serviceAreaEligible === null) missing.push("service location");
  const qualification = {
    status: context.serviceAreaEligible === false ? "not_qualified" : missing.length ? "needs_clarification" : "qualified",
    reasonCodes: reasons.length ? reasons : [intent.primary.toUpperCase().replace(/[^A-Z0-9]+/g, "_")],
    nextRequiredInformation: missing,
  } as const;
  stage(timing, "qualification", qualificationStart);
  const knowledgeStart = performance.now();
  const matches = [];
  if (intent.primary.includes("emergency")) matches.push({ id: "emergency-intake-v2", title: "Emergency intake policy", fact: "Active water entry requires human confirmation before scheduling." });
  if (context.serviceAreaEligible === false) matches.push({ id: "service-area-v1", title: "Fictional service-area map", fact: "The supplied location is outside the fictional Northstone territory." });
  if (context.serviceAreaEligible === true) matches.push({ id: "service-area-v1", title: "Fictional service-area map", fact: "The supplied location is inside the fictional Northstone territory." });
  if (intent.primary.includes("inspection")) matches.push({ id: "inspection-v1", title: "Inspection intake", fact: "Inspection requests require contact and property context before routing." });
  const knowledge = { tenant: TENANT, version: "northstone-demo-2026.08", matches };
  stage(timing, "knowledge", knowledgeStart);
  const policyStart = performance.now();
  const decisions = [{ id: "demo-side-effect-firewall", result: "constrain", explanation: "Public demo mode cannot create appointments, payments, notifications, or production records.", constraint: "No external side effects" }];
  if (intent.urgency === "emergency") decisions.push({ id: "emergency-human-review", result: "require_review", explanation: "Emergency requests require human confirmation before any scheduling or operational action.", constraint: "Human review required" });
  if (context.serviceAreaEligible === false) decisions.push({ id: "service-area-boundary", result: "constrain", explanation: "Out-of-area requests cannot proceed to scheduling in the fictional demo.", constraint: "No scheduling" });
  const policy = { decisions };
  stage(timing, "policy", policyStart);
  const workflowStart = performance.now();
  let workflow: string = "general-information";
  if (context.serviceAreaEligible === false) workflow = "out-of-area";
  else if (intent.clarificationRequired) workflow = "request-more-information";
  else if (intent.urgency === "emergency") workflow = "priority-human-review";
  else if (intent.primary.includes("inspection")) workflow = "inspection-intake";
  else if (intent.primary.includes("estimate") || intent.primary.includes("replacement")) workflow = "estimate-intake";
  else if (intent.primary === "unsupported request") workflow = "unsupported-service";
  else if (context.schedulingIntent) workflow = "scheduling-preview";
  stage(timing, "workflow", workflowStart);
  const escalationStart = performance.now();
  const escalation = intent.urgency === "emergency"
    ? { required: true, reason: "Emergency request", priority: "urgent", safeNextAction: "Place the fictional request into priority human review." }
    : intent.clarificationRequired
      ? { required: true, reason: "Low-confidence interpretation", priority: "normal", safeNextAction: "Ask for the missing service or location detail." }
      : { required: false, reason: null, priority: "low", safeNextAction: "Continue with the selected fictional workflow." };
  stage(timing, "escalation", escalationStart);
  const outcomeStart = performance.now();
  const outcome = qualification.status === "not_qualified"
    ? { status: "blocked", summary: "The fictional request is outside the service-area boundary." }
    : qualification.status === "needs_clarification"
      ? { status: "needs_information", summary: "The engine needs more information before selecting a consequential workflow." }
      : { status: "ready_for_review", summary: `Routed to ${workflow}; ${escalation.required ? "human review is required" : "no human escalation is required"}.` };
  stage(timing, "outcome", outcomeStart);
  timing.total = Math.max(0, Math.round(performance.now() - totalStart));
  return { traceId, mode: "demo", tenant: TENANT, input: { message }, intent, context, qualification, knowledge, policy, workflow: { name: workflow }, escalation, outcome, timing };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, x-client-info, apikey, content-type", "access-control-allow-methods": "POST, OPTIONS" } });
  if (req.method !== "POST") return json({ error: { code: "method_not_allowed", message: "Use POST." } }, 405);
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now - bucket.started > WINDOW_MS) buckets.set(ip, { started: now, count: 1 });
  else if (bucket.count >= MAX_REQUESTS) return json({ error: { code: "rate_limited", message: "Too many demo requests. Try again shortly." } }, 429);
  else bucket.count += 1;
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY) return json({ error: { code: "request_too_large", message: "Request is too large." } }, 413);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: { code: "invalid_json", message: "Request body must be valid JSON." } }, 400); }
  if (!body || typeof body !== "object") return json({ error: { code: "invalid_request", message: "Request must be an object." } }, 400);
  const input = body as Record<string, unknown>;
  if (input.mode !== "demo" || input.tenant !== TENANT) return json({ error: { code: "demo_boundary", message: "Only the Northstone demo tenant is accepted by this endpoint." } }, 403);
  if (typeof input.message !== "string" || input.message.trim().length < 3 || input.message.length > 2_000) return json({ error: { code: "invalid_message", message: "Message must be between 3 and 2,000 characters." } }, 400);
  const traceId = `qn_demo_${crypto.randomUUID()}`;
  try {
    const trace = runRuntime(input.message.trim(), traceId);
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && serviceRole) {
      const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
      const { error } = await admin.from("intelligence_traces").insert({ trace_id: trace.traceId, mode: trace.mode, tenant_key: trace.tenant, intent: trace.intent, qualification: trace.qualification, policy: trace.policy, workflow: trace.workflow, escalation: trace.escalation, outcome: trace.outcome, status: "completed", duration_ms: trace.timing.total });
      if (error) console.error(JSON.stringify({ code: "trace_persistence_failed", message: error.message }));
    }
    return json({ trace });
  } catch {
    return json({ error: { code: "runtime_failure", message: "The intelligence runtime could not complete this request." } }, 500);
  }
});
