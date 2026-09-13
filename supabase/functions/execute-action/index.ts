import { serverClient, google } from "../_shared/core.ts";

const corsHeaders = { "content-type": "application/json" };

type Execution = {
  id: string; workspace_id: string; interaction_id: string | null; trace_id: string | null;
  human_review_id: string | null; action_type: string; provider: string; status: string;
  parameters: Record<string, unknown>; attempt_count: number; provider_reference: string | null;
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function retryAt(attempt: number) {
  const seconds = Math.min(3600, 15 * 2 ** Math.max(0, attempt - 1));
  return new Date(Date.now() + seconds * 1000).toISOString();
}

function stringValue(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function executeCalendarCreate(execution: Execution) {
  const p = execution.parameters;
  const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");
  if (!calendarId) throw new Error("GOOGLE_NOT_CONFIGURED");

  const start = stringValue(p.start ?? p.startDateTime, 80);
  const end = stringValue(p.end ?? p.endDateTime, 80);
  const timezone = stringValue(p.timezone, 100);
  const title = stringValue(p.title, 200) || "Quincestone appointment";
  if (!start || !end || !timezone) throw new Error("INVALID_ACTION_PARAMETERS");

  const event = {
    summary: title,
    description: stringValue(p.description, 2000) || undefined,
    start: { dateTime: start, timeZone: timezone },
    end: { dateTime: end, timeZone: timezone },
    conferenceData: { createRequest: { requestId: execution.id, conferenceSolutionKey: { type: "hangoutsMeet" } } },
  };

  const googleResponse = await google(`/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1&sendUpdates=none`, {
    method: "POST", body: JSON.stringify(event),
  });
  const created = await googleResponse.json();
  if (!created?.id) throw new Error("GOOGLE_UNAVAILABLE");
  return { providerReference: String(created.id), result: { calendarEventId: String(created.id), meetingUrl: created.hangoutLink ?? created.conferenceData?.entryPoints?.find((point: { entryPointType: string }) => point.entryPointType === "video")?.uri ?? null } };
}

async function run(executionId: string) {
  const db = serverClient();
  const { data: execution, error: claimError } = await db.rpc("claim_action_execution", { target_id: executionId });
  if (claimError || !execution) throw new Error(claimError?.message || "ACTION_NOT_CLAIMABLE");
  const row = execution as Execution;

  try {
    if (row.provider === "google-calendar" && ["calendar.create", "calendar.create_booking", "create_calendar_booking"].includes(row.action_type)) {
      const outcome = await executeCalendarCreate(row);
      const { data, error } = await db.rpc("complete_action_execution", { target_id: row.id, target_provider_reference: outcome.providerReference, target_result: outcome.result });
      if (error) throw new Error("EXECUTION_PERSISTENCE_FAILED");
      return data;
    }
    const { data, error } = await db.rpc("fail_action_execution", { target_id: row.id, target_status: "failed", target_error_code: "UNSUPPORTED_ACTION", target_error_message: "No executor is registered for this action type and provider.", target_retry_at: null, target_provider_reference: null });
    if (error) throw new Error("EXECUTION_PERSISTENCE_FAILED");
    return data;
  } catch (error) {
    const code = error instanceof Error ? error.message : "EXECUTION_FAILED";
    const retryable = ["GOOGLE_UNAVAILABLE", "GOOGLE_RATE_LIMITED", "GOOGLE_AUTH_FAILED"].includes(code);
    const unknown = ["GOOGLE_UNAVAILABLE"].includes(code);
    const status = unknown ? "unknown" : retryable ? "retryable" : "failed";
    const { data, error: persistError } = await db.rpc("fail_action_execution", {
      target_id: row.id,
      target_status: status,
      target_error_code: code.slice(0, 128),
      target_error_message: retryable ? "Provider execution did not complete; reconciliation is required before another attempt." : "Action execution failed.",
      target_retry_at: retryable ? retryAt(row.attempt_count) : null,
      target_provider_reference: null,
    });
    if (persistError) throw new Error("EXECUTION_PERSISTENCE_FAILED");
    return data;
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return response({ success: false, error: "Method not allowed" }, 405);
  const secret = Deno.env.get("ACTION_EXECUTOR_SECRET");
  if (!secret || req.headers.get("x-action-executor-secret") !== secret) return response({ success: false, error: "Unauthorized" }, 401);
  try {
    const body = await req.json();
    const executionId = stringValue(body?.actionExecutionId, 80);
    if (!/^[0-9a-f-]{36}$/i.test(executionId)) return response({ success: false, error: "Valid actionExecutionId is required." }, 400);
    const execution = await run(executionId);
    return response({ success: true, execution });
  } catch (error) {
    return response({ success: false, error: error instanceof Error ? error.message : "Execution failed." }, 500);
  }
});
