import { calendarId, failure, googleRequest, json, mapError, requirePost, serverClient, validTimezone } from "../_shared/calendar.ts";

type GoogleEvent = { id?: string; htmlLink?: string; hangoutLink?: string };

Deno.serve(async (request) => {
  const methodResponse = requirePost(request);
  if (methodResponse) return methodResponse;
  try {
    const body = await request.json();
    const required = ["sourceType", "sourceRecordId", "fullName", "email", "appointmentType", "start", "end", "timezone", "idempotencyKey"];
    if (required.some((key) => !body[key])) return failure("VALIDATION_FAILED", "Required booking information is missing.");
    if (!validTimezone(String(body.timezone))) return failure("INVALID_TIMEZONE", "Select a valid timezone.");
    const start = new Date(String(body.start));
    const end = new Date(String(body.end));
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) return failure("INVALID_DATE_RANGE", "Select a valid appointment time.");

    const db = serverClient();
    const { data: existing } = await db.from("appointment_requests").select("id,booking_status,requested_start_time,requested_end_time,timezone,calendar_event_url").eq("idempotency_key", body.idempotencyKey).maybeSingle();
    if (existing) return json({ success: true, bookingId: existing.id, status: existing.booking_status, start: existing.requested_start_time, end: existing.requested_end_time, timezone: existing.timezone });

    const sourceTables: Record<string, string> = { assessment: "assessment_requests", implementation: "implementation_applications", contact: "contact_messages" };
    const sourceTable = sourceTables[String(body.sourceType)];
    if (!sourceTable) return failure("VALIDATION_FAILED", "Unsupported booking source.");
    const { data: source } = await db.from(sourceTable).select("id").eq("id", body.sourceRecordId).maybeSingle();
    if (!source) return failure("SUBMISSION_NOT_FOUND", "The related submission could not be found.", 404);

    const { data: booking, error: insertError } = await db.from("appointment_requests").insert({
      source_type: body.sourceType,
      source_record_id: body.sourceRecordId,
      full_name: String(body.fullName).trim().slice(0, 100),
      email: String(body.email).trim().toLowerCase().slice(0, 254),
      phone: body.phone ? String(body.phone).trim().slice(0, 40) : null,
      company_name: body.companyName ? String(body.companyName).trim().slice(0, 120) : null,
      appointment_type: String(body.appointmentType).trim().slice(0, 80),
      requested_date: start.toISOString().slice(0, 10),
      requested_start_time: start.toISOString(),
      requested_end_time: end.toISOString(),
      timezone: body.timezone,
      notes: body.notes ? String(body.notes).trim().slice(0, 1000) : null,
      idempotency_key: body.idempotencyKey,
    }).select("id").single();
    if (insertError || !booking) return failure("BOOKING_CREATION_FAILED", "Booking could not be created.", 409);

    const company = body.companyName ? String(body.companyName).trim() : String(body.fullName).trim();
    const conferenceRequestId = crypto.randomUUID();
    const event = await googleRequest<GoogleEvent>(`/calendars/${encodeURIComponent(calendarId())}/events?conferenceDataVersion=1`, {
      method: "POST",
      body: JSON.stringify({
        summary: `Quincestone — ${body.appointmentType} — ${company}`,
        description: `Requester: ${body.fullName}\nCompany: ${body.companyName ?? "Not provided"}\nEmail: ${body.email}\nPhone: ${body.phone ?? "Not provided"}\nSource reference: ${body.sourceRecordId}\nhttps://quincestone.com`,
        start: { dateTime: start.toISOString(), timeZone: body.timezone },
        end: { dateTime: end.toISOString(), timeZone: body.timezone },
        attendees: [{ email: body.email }],
        conferenceData: { createRequest: { requestId: conferenceRequestId, conferenceSolutionKey: { type: "hangoutsMeet" } } },
      }),
    });

    await db.from("appointment_requests").update({
      calendar_event_id: event.id ?? null,
      calendar_event_url: event.htmlLink ?? null,
      calendar_status: "created",
      booking_status: "confirmed",
    }).eq("id", booking.id);
    await db.from("integration_events").insert({ provider: "google-calendar", event_type: "booking-created", source_type: body.sourceType, source_record_id: body.sourceRecordId, status: "succeeded", request_id: body.idempotencyKey, metadata: { appointment_id: booking.id } });

    return json({ success: true, bookingId: booking.id, status: "confirmed", start: start.toISOString(), end: end.toISOString(), timezone: body.timezone, ...(event.hangoutLink ? { meetingUrl: event.hangoutLink } : {}) });
  } catch (error) {
    return mapError(error);
  }
});
