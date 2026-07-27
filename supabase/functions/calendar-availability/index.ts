import { calendarId, calendarTimezone, failure, googleRequest, json, mapError, requirePost, validTimezone } from "../_shared/calendar.ts";

type BusyResponse = { calendars?: Record<string, { busy?: Array<{ start: string; end: string }> }> };

function slotsBetween(from: Date, to: Date, durationMinutes: number, busy: Array<{ start: string; end: string }>, timezone: string) {
  const slots: Array<{ start: string; end: string; label: string }> = [];
  const cursor = new Date(from);
  const notice = Date.now() + 4 * 60 * 60 * 1000;
  while (cursor < to && slots.length < 120) {
    const day = cursor.getUTCDay();
    const hour = cursor.getUTCHours();
    const end = new Date(cursor.getTime() + durationMinutes * 60_000);
    const inBusinessHours = day >= 1 && day <= 5 && hour >= 9 && end.getUTCHours() <= 17;
    const overlaps = busy.some((period) => cursor < new Date(period.end) && end > new Date(period.start));
    if (inBusinessHours && cursor.getTime() >= notice && !overlaps) {
      slots.push({
        start: cursor.toISOString(),
        end: end.toISOString(),
        label: new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }).format(cursor),
      });
    }
    cursor.setUTCMinutes(cursor.getUTCMinutes() + durationMinutes);
  }
  return slots;
}

Deno.serve(async (request) => {
  const methodResponse = requirePost(request);
  if (methodResponse) return methodResponse;
  try {
    const body = await request.json();
    const timezone = String(body.timezone ?? calendarTimezone());
    const durationMinutes = Number(body.durationMinutes ?? 30);
    const from = new Date(String(body.dateFrom));
    const to = new Date(String(body.dateTo));
    if (!validTimezone(timezone)) return failure("INVALID_TIMEZONE", "Select a valid timezone.");
    if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || to <= from) return failure("INVALID_DATE_RANGE", "Select a valid date range.");
    if (to.getTime() - from.getTime() > 31 * 86_400_000) return failure("INVALID_DATE_RANGE", "Availability requests are limited to 31 days.");
    if (![15, 30, 45, 60].includes(durationMinutes)) return failure("VALIDATION_FAILED", "Unsupported appointment duration.");

    const id = calendarId();
    const data = await googleRequest<BusyResponse>("/freeBusy", {
      method: "POST",
      body: JSON.stringify({ timeMin: from.toISOString(), timeMax: to.toISOString(), timeZone: timezone, items: [{ id }] }),
    });
    const busy = data.calendars?.[id]?.busy ?? [];
    return json({ success: true, timezone, slots: slotsBetween(from, to, durationMinutes, busy, timezone) });
  } catch (error) {
    return mapError(error);
  }
});
