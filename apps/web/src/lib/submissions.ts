import { isSupabaseConfigured, supabase } from "./supabase";

export type SubmissionKind =
  | "assessment_requests"
  | "implementation_applications"
  | "contact_messages";
export type SubmissionPayload = Record<string, string>;

export type AssessmentSubmission = {
  version: number;
  name: string;
  email: string;
  company: string;
  website: string;
  answers: Record<string, string>;
  preliminary: { score: number; priority: string; flags: string[] };
  source: "web_edge_assessment";
  attribution: Record<string, string>;
};

export type SubmissionResult =
  | { ok: true; reference: string }
  | { ok: false; reason: "not_configured" | "failed"; message: string };

export async function submit(
  kind: SubmissionKind,
  payload: SubmissionPayload,
): Promise<SubmissionResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      reason: "not_configured",
      message:
        "Online submission is not configured yet. Please email hello@quincestone.com.",
    };
  }
  const { data, error } = await supabase.rpc("submit_public_form", {
    submission_kind: kind,
    payload,
  });
  if (error)
    return {
      ok: false,
      reason: "failed",
      message: "Submission could not be completed. Please retry.",
    };
  return { ok: true, reference: String(data) };
}

export async function submitAssessment(
  payload: AssessmentSubmission,
  idempotencyKey: string,
): Promise<SubmissionResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      reason: "not_configured",
      message:
        "Online submission is not configured. Your answers remain here; please retry later.",
    };
  }

  const controller = new globalThis.AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15_000);
  try {
    const { data, error } = await supabase
      .rpc("submit_edge_assessment", {
        payload,
        idempotency_key: idempotencyKey,
      })
      .abortSignal(controller.signal);
    if (error || !data || typeof data !== "object" || !("reference" in data)) {
      return {
        ok: false,
        reason: "failed",
        message:
          "Assessment persistence was not confirmed. Your answers remain in this browser; retry when ready.",
      };
    }
    return { ok: true, reference: String(data.reference) };
  } catch {
    return {
      ok: false,
      reason: "failed",
      message:
        "The assessment service did not respond in time. Your answers remain in this browser; retry when ready.",
    };
  } finally {
    window.clearTimeout(timeout);
  }
}
