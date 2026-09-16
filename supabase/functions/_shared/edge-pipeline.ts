type AdminClient = any;

export type EdgePipelineInput = {
  admin: AdminClient;
  workspace: { id: string; name: string; slug?: string };
  message: string;
  customerId?: string | null;
  installationId?: string | null;
  channelSessionId?: string | null;
  idempotencyKey: string;
  source: "app" | "edge_installation";
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
  const confidence = match ? 0.91 : 0.64;
  return {
    primary: match?.[0] ?? "general_inquiry",
    confidence,
    urgency: /(urgent|asap|emergency|immediately|today)/.test(text) ? "high" : "normal",
    entities: {
      emailPresent: /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/.test(message),
      phonePresent: /(?:\+?\d[\d\s().-]{7,}\d)/.test(message),
    },
    ambiguity: confidence < 0.8 ? ["The interaction does not identify a specific business intent yet."] : [],
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

export async function runEdgePipeline(input: EdgePipelineInput) {
  const { admin, workspace, message, idempotencyKey, source } = input;
  const customerId = input.customerId ?? null;
  const installationId = input.installationId ?? null;

  const existing = await admin.from("interactions")
    .select("id, customer_id, trace_id, status, outcome")
    .eq("workspace_id", workspace.id).eq("idempotency_key", idempotencyKey).maybeSingle();
  let interactionId: string;
  if (existing.data) {
    if (existing.data.status !== "failed") return { duplicate: true, interaction: existing.data };
    const reset = await admin.from("interactions").update({ status: "received", outcome: {} })
      .eq("id", existing.data.id).eq("workspace_id", workspace.id).eq("status", "failed");
    if (reset.error) throw new Error("INTERACTION_RETRY_FAILED");
    interactionId = existing.data.id as string;
  } else {
    const inserted = await admin.from("interactions").insert({
      workspace_id: workspace.id,
      customer_id: customerId,
      installation_id: installationId,
      channel_session_id: input.channelSessionId ?? null,
      source,
      status: "received",
      message,
      idempotency_key: idempotencyKey,
    }).select("id").single();
    if (inserted.error || !inserted.data) {
      if (inserted.error?.code === "23505") {
        const duplicate = await admin.from("interactions").select("id, customer_id, trace_id, status, outcome")
          .eq("workspace_id", workspace.id).eq("idempotency_key", idempotencyKey).maybeSingle();
        if (duplicate.data) return { duplicate: true, interaction: duplicate.data };
      }
      throw new Error("INTERACTION_CREATE_FAILED");
    }
    interactionId = inserted.data.id as string;
  }
  const traceId = `qn_${crypto.randomUUID()}`;
  let traceRecordId: string | null = null;
  try {
    const intent = classify(message);
    const qualification = {
      status: intent.clarificationRequired ? "needs_clarification" : "qualified",
      reasonCodes: intent.clarificationRequired ? ["LOW_CONFIDENCE_INTENT"] : [intent.primary.toUpperCase()],
      nextRequiredInformation: intent.clarificationRequired ? ["specific request details"] : [],
    };
    const { data: knowledgeRows } = await admin.from("knowledge_documents")
      .select("id, title, content, version").eq("workspace_id", workspace.id).eq("status", "active")
      .order("updated_at", { ascending: false }).limit(20);
    const knowledge = {
      matches: (knowledgeRows ?? []).map((row: any) => ({ ...row, score: overlapScore(message, row.content) }))
        .filter((row: any) => row.score > 0).sort((a: any, b: any) => b.score - a.score).slice(0, 5)
        .map(({ id, title, version, score }: any) => ({ id, title, version, score })),
    };
    const { data: policyRows } = await admin.from("policies")
      .select("id, name, description, effect, priority, status").eq("workspace_id", workspace.id)
      .eq("status", "active").order("priority", { ascending: true }).limit(20);
    const policies = policyRows ?? [];
    const strongestEffect = policies.some((p: any) => p.effect === "deny") ? "deny"
      : policies.some((p: any) => p.effect === "constrain") ? "constrain"
      : policies.some((p: any) => p.effect === "require_review") ? "require_review" : "allow";
    const policy = {
      source: policies.length ? "workspace" : "system-default",
      decisions: policies.length
        ? policies.map((p: any) => ({ id: p.id, result: p.effect, explanation: p.description, priority: p.priority }))
        : [{ id: "system-human-boundary-v1", result: "require_review", explanation: "No workspace policy has authorized autonomous external side effects; proposed actions remain reviewable.", priority: 100 }],
    };
    const workflowName = intent.primary === "booking_request" ? "booking-intake"
      : intent.primary === "quote_request" ? "quote-intake"
      : intent.primary === "support_request" ? "support-intake"
      : intent.primary === "service_request" ? "service-intake" : "general-inquiry";
    const workflow = { name: workflowName, route: intent.primary, status: qualification.status };
    const consequential = ["booking_request", "quote_request", "support_request"].includes(intent.primary);
    const humanReviewRequired = intent.clarificationRequired || consequential || strongestEffect !== "allow";
    const escalation = {
      required: humanReviewRequired,
      reason: intent.clarificationRequired ? "Low-confidence interpretation" : consequential ? "Proposed action may affect a customer or external system" : strongestEffect !== "allow" ? "Workspace policy requires review or constrains execution" : null,
      priority: intent.urgency === "high" ? "high" : humanReviewRequired ? "normal" : "low",
      safeNextAction: humanReviewRequired ? "Present the proposed next step for human review." : "Record the interaction without external side effects.",
    };
    const actionProposal = {
      kind: humanReviewRequired ? "human_review" : "record_only", execute: false,
      authorizationRequired: consequential, externalSideEffect: false,
      description: humanReviewRequired ? `Review the ${workflowName} proposal before any external action.` : `Record ${workflowName} without external side effects.`,
    };
    const outcome = qualification.status === "needs_clarification"
      ? { status: "needs_information", summary: "More information is required before the business can determine a next step." }
      : humanReviewRequired
        ? { status: "ready_for_review", summary: "The request was received and routed for business review." }
        : { status: "recorded", summary: "The request was received by the business." };

    const traceInsert = await admin.from("intelligence_traces").insert({
      trace_id: traceId, mode: "workspace", tenant_key: `workspace:${workspace.id}`,
      workspace_id: workspace.id, interaction_id: interactionId, customer_id: customerId,
      execution_version: "edge-workspace-3", observed_facts: { source, installationId, messageLength: message.length, messageReceived: true },
      intent, qualification, policy, workflow, escalation, action_proposal: actionProposal, outcome,
      status: "completed", duration_ms: 0,
    }).select("id").single();
    if (traceInsert.error || !traceInsert.data) throw new Error("TRACE_CREATE_FAILED");
    traceRecordId = traceInsert.data.id as string;
    if (humanReviewRequired) {
      const review = await admin.from("human_reviews").insert({
        workspace_id: workspace.id, interaction_id: interactionId, customer_id: customerId,
        trace_id: traceRecordId, status: "pending", priority: escalation.priority,
        reason: escalation.reason ?? "Human review is required by the governed action boundary.", proposed_action: actionProposal,
      });
      if (review.error) throw new Error("REVIEW_CREATE_FAILED");
    }
    const updated = await admin.from("interactions").update({
      status: humanReviewRequired ? "escalated" : "qualified", intent, qualification, outcome, trace_id: traceId,
    }).eq("id", interactionId).eq("workspace_id", workspace.id);
    if (updated.error) throw new Error("INTERACTION_UPDATE_FAILED");
    return {
      duplicate: false,
      trace: { traceId, workspaceId: workspace.id, interactionId, customerId, executionVersion: "edge-workspace-3", intent, qualification, knowledge, policy, workflow, escalation, actionProposal, outcome },
    };
  } catch (error) {
    await admin.from("interactions").update({ status: "failed", outcome: { status: "failed", summary: "Processing did not complete." } })
      .eq("id", interactionId).eq("workspace_id", workspace.id);
    if (traceRecordId) await admin.from("intelligence_traces").update({ status: "failed" }).eq("id", traceRecordId);
    throw error;
  }
}
