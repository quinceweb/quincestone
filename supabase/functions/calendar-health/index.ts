import { calendarId, calendarTimezone, googleRequest, json, mapError, requirePost, validTimezone } from "../_shared/calendar.ts";

type BusyResponse = { calendars?: Record<string, { busy?: Array<{ start: string; end: string }> }> };

Deno.serve(async (request) => {
  const methodResponse = requirePost(request);
  if (methodResponse) return methodResponse;
  try {
    const timezone = calendarTimezone();
    if (!validTimezone(timezone)) throw new Error("INVALID_TIMEZONE");
    const id = calendarId();
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000);
    await googleRequest<BusyResponse>("/freeBusy", {
      method: "POST",
      body: JSON.stringify({ timeMin: now.toISOString(), timeMax: later.toISOString(), timeZone: timezone, items: [{ id }] }),
    });
    return json({ success: true, provider: "google-calendar", calendarReachable: true, timezone });
  } catch (error) {
    return mapError(error);
  }
});
