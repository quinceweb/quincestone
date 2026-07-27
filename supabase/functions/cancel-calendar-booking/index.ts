import { calendarId, failure, googleRequest, json, mapError, requirePost, serverClient } from "../_shared/calendar.ts";

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  const methodResponse = requirePost(request);
  if (methodResponse) return methodResponse;
  try {
    const body = await request.json();
    const token = String(body.token ?? "");
    if (token.length < 32 || token.length > 256) return failure("VALIDATION_FAILED", "A valid cancellation token is required.");

    const db = serverClient();
    const tokenHash = await sha256(token);
    const { data: booking } = await db.from("appointment_requests")
      .select("id,calendar_event_id,booking_status,cancellation_token_expires_at,cancellation_token_used_at,source_type,source_record_id")
      .eq("cancellation_token_hash", tokenHash)
      .maybeSingle();

    if (!booking || booking.cancellation_token_used_at) return failure("BOOKING_CANCELLATION_FAILED", "This cancellation request is invalid or has already been used.", 404);
    if (!booking.cancellation_token_expires_at || new Date(booking.cancellation_token_expires_at) < new Date()) return failure("BOOKING_CANCELLATION_FAILED", "This cancellation link has expired.", 410);
    if (booking.booking_status === "cancelled") return json({ success: true, status: "cancelled" });

    if (booking.calendar_event_id) {
      await googleRequest<unknown>(`/calendars/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(booking.calendar_event_id)}`, { method: "DELETE" });
    }

    await db.from("appointment_requests").update({ booking_status: "cancelled", calendar_status: "cancelled", cancellation_token_used_at: new Date().toISOString() }).eq("id", booking.id);
    await db.from("integration_events").insert({ provider: "google-calendar", event_type: "booking-cancelled", source_type: booking.source_type, source_record_id: booking.source_record_id, status: "succeeded", metadata: { appointment_id: booking.id } });
    return json({ success: true, status: "cancelled" });
  } catch (error) {
    return mapError(error);
  }
});
