import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

const DECISIONS = new Set(["approved", "rejected", "resolved"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getCurrentWorkspace();
  if (!context) return NextResponse.json({ error: { code: "unauthorized", message: "An authenticated workspace is required." } }, { status: 401 });
  if (context.role !== "owner" && context.role !== "admin") {
    return NextResponse.json({ error: { code: "forbidden", message: "Only workspace owners and admins can make human-review decisions." } }, { status: 403 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: { code: "review_required", message: "A review id is required." } }, { status: 400 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: { code: "invalid_json", message: "Request body must be valid JSON." } }, { status: 400 }); }
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const decision = typeof input.decision === "string" ? input.decision : "";
  const reason = typeof input.reason === "string" ? input.reason.trim() : "";
  if (!DECISIONS.has(decision)) return NextResponse.json({ error: { code: "invalid_decision", message: "Decision must be approved, rejected, or resolved." } }, { status: 400 });
  if (reason.length < 3 || reason.length > 2000) return NextResponse.json({ error: { code: "invalid_reason", message: "A decision reason between 3 and 2,000 characters is required." } }, { status: 400 });

  const supabase = await createClient();
  const { data: review, error: reviewError } = await supabase
    .from("human_reviews")
    .select("id, workspace_id, interaction_id, trace_id, status, decision, decision_reason")
    .eq("id", id)
    .eq("workspace_id", context.workspace.id)
    .maybeSingle();

  if (reviewError || !review) return NextResponse.json({ error: { code: "review_not_found", message: "The review item was not found." } }, { status: 404 });
  if (["approved", "rejected", "resolved"].includes(review.status)) {
    return NextResponse.json({ error: { code: "review_already_decided", message: "This review item already has a terminal human decision." } }, { status: 409 });
  }

  const now = new Date().toISOString();
  const { error: updateReviewError } = await supabase
    .from("human_reviews")
    .update({ status: decision, decision, decision_reason: reason, actor_user_id: context.user.id, reviewed_at: now })
    .eq("id", id)
    .eq("workspace_id", context.workspace.id);
  if (updateReviewError) return NextResponse.json({ error: { code: "review_update_failed", message: "The human-review decision could not be recorded." } }, { status: 500 });

  const { data: interaction } = await supabase
    .from("interactions")
    .select("id, status, outcome, trace_id")
    .eq("id", review.interaction_id)
    .eq("workspace_id", context.workspace.id)
    .maybeSingle();

  if (interaction) {
    const outcome = {
      ...(interaction.outcome && typeof interaction.outcome === "object" ? interaction.outcome : {}),
      status: decision === "approved" ? "authorized_not_executed" : decision === "rejected" ? "rejected_by_human" : "resolved_by_human",
      humanDecision: decision,
      humanDecisionReason: reason,
      humanDecisionAt: now,
      externalExecution: "not_executed",
    };
    const nextInteractionStatus = decision === "approved" ? "in_progress" : "completed";
    await supabase.from("interactions").update({ status: nextInteractionStatus, outcome }).eq("id", interaction.id).eq("workspace_id", context.workspace.id);

    if (review.trace_id) {
      const { data: trace } = await supabase.from("intelligence_traces").select("outcome, escalation, action_proposal").eq("id", review.trace_id).eq("workspace_id", context.workspace.id).maybeSingle();
      if (trace) {
        const traceOutcome = {
          ...(trace.outcome && typeof trace.outcome === "object" ? trace.outcome : {}),
          humanDecision: decision,
          humanDecisionReason: reason,
          humanDecisionAt: now,
          externalExecution: "not_executed",
        };
        const traceEscalation = {
          ...(trace.escalation && typeof trace.escalation === "object" ? trace.escalation : {}),
          resolvedByHuman: true,
          decision,
          decisionReason: reason,
        };
        await supabase.from("intelligence_traces").update({ outcome: traceOutcome, escalation: traceEscalation }).eq("id", review.trace_id).eq("workspace_id", context.workspace.id);
      }
    }
  }

  return NextResponse.json({ ok: true, reviewId: id, decision, recordedAt: now });
}
