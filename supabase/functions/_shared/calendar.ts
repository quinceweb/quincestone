import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "https://quincestone.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

export type ErrorCode =
  | "CALENDAR_NOT_CONFIGURED"
  | "CALENDAR_UNAVAILABLE"
  | "CALENDAR_AUTH_FAILED"
  | "CALENDAR_RATE_LIMITED"
  | "SLOT_NO_LONGER_AVAILABLE"
  | "INVALID_TIMEZONE"
  | "INVALID_DATE_RANGE"
  | "BOOKING_ALREADY_EXISTS"
  | "BOOKING_CREATION_FAILED"
  | "BOOKING_CANCELLATION_FAILED"
  | "SUBMISSION_NOT_FOUND"
  | "VALIDATION_FAILED";

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

export function failure(code: ErrorCode, message: string, status = 400) {
  return json({ success: false, error: { code, message } }, status);
}

export function requirePost(request: Request) {
  if (request.method === "OPTIONS") return json({ success: true });
  if (request.method !== "POST") return failure("VALIDATION_FAILED", "Method not allowed.", 405);
  return null;
}

export function serverClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("SUPABASE_NOT_CONFIGURED");
  return createClient(url, key, { auth: { persistSession: false } });
}

async function accessToken() {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");
  if (!clientId || !clientSecret || !refreshToken) throw new Error("GOOGLE_NOT_CONFIGURED");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new Error("GOOGLE_AUTH_FAILED");
  const payload = await response.json();
  if (!payload.access_token) throw new Error("GOOGLE_AUTH_FAILED");
  return String(payload.access_token);
}

export async function googleRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  const response = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(12000),
  });

  if (response.status === 401 || response.status === 403) throw new Error("GOOGLE_AUTH_FAILED");
  if (response.status === 429) throw new Error("GOOGLE_RATE_LIMITED");
  if (!response.ok) throw new Error("GOOGLE_REQUEST_FAILED");
  return await response.json() as T;
}

export function mapError(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN";
  if (message === "GOOGLE_NOT_CONFIGURED" || message === "SUPABASE_NOT_CONFIGURED") {
    return failure("CALENDAR_NOT_CONFIGURED", "Live scheduling is not configured.", 503);
  }
  if (message === "GOOGLE_AUTH_FAILED") return failure("CALENDAR_AUTH_FAILED", "Calendar authentication failed.", 503);
  if (message === "GOOGLE_RATE_LIMITED") return failure("CALENDAR_RATE_LIMITED", "Calendar is temporarily busy. Please retry.", 429);
  return failure("CALENDAR_UNAVAILABLE", "Calendar service is temporarily unavailable.", 503);
}

export function validTimezone(value: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export const calendarId = () => Deno.env.get("GOOGLE_CALENDAR_ID") ?? "primary";
export const calendarTimezone = () => Deno.env.get("GOOGLE_CALENDAR_TIMEZONE") ?? "America/New_York";
