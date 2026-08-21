import { isSupabaseConfigured, supabase } from "./supabase";

export type SubmissionKind = "assessment_requests" | "implementation_applications" | "contact_messages";
export type SubmissionPayload = Record<string, string>;

export type SubmissionResult =
  | { ok: true; reference: string }
  | { ok: false; reason: "not_configured" | "failed"; message: string };

export async function submit(kind: SubmissionKind, payload: SubmissionPayload): Promise<SubmissionResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      reason: "not_configured",
      message: "Online submission is not configured yet. Please email hello@quincestone.com.",
    };
  }
  const { data, error } = await supabase.rpc("submit_public_form", { submission_kind: kind, payload });
  if (error) return { ok: false, reason: "failed", message: "Submission could not be completed. Please retry." };
  return { ok: true, reference: String(data) };
}
