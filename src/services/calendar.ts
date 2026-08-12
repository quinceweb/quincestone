import { supabase } from "../lib/supabase";

export type CalendarErrorCode = "CALENDAR_NOT_CONFIGURED" | "CALENDAR_UNAVAILABLE" | "CALENDAR_AUTH_FAILED" | "CALENDAR_RATE_LIMITED" | "SLOT_NO_LONGER_AVAILABLE" | "INVALID_TIMEZONE" | "INVALID_DATE_RANGE" | "BOOKING_ALREADY_EXISTS" | "BOOKING_CREATION_FAILED" | "BOOKING_CANCELLATION_FAILED" | "SUBMISSION_NOT_FOUND" | "VALIDATION_FAILED";
export class CalendarError extends Error { constructor(public code: CalendarErrorCode, message: string) { super(message); } }
export type CalendarSlot = { start: string; end: string; label: string };
export type AvailabilityRequest = { appointmentType: string; timezone: string; dateFrom: string; dateTo: string; durationMinutes?: number };
export type BookingRequest = { sourceType: "assessment" | "implementation" | "contact"; sourceRecordId: string; fullName: string; email: string; companyName?: string; appointmentType: string; start: string; end: string; timezone: string; notes?: string; idempotencyKey: string };

async function invoke<T>(name: string, body: object): Promise<T> {
  if (!supabase) throw new CalendarError("CALENDAR_NOT_CONFIGURED", "Live scheduling is not configured. Please contact hello@quincestone.com.");
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error || !data?.success) {
    const code = (data?.error?.code ?? "CALENDAR_UNAVAILABLE") as CalendarErrorCode;
    throw new CalendarError(code, data?.error?.message ?? "Scheduling is temporarily unavailable. Your submission is still saved.");
  }
  return data as T;
}
export const getCalendarAvailability = (request: AvailabilityRequest) => invoke<{ success: true; timezone: string; slots: CalendarSlot[] }>("calendar-availability", request);
export const createCalendarBooking = (request: BookingRequest) => invoke<{ success: true; appointmentId: string; status: "confirmed"; meetingUrl?: string }>("create-calendar-booking", request);
export const cancelCalendarBooking = (token: string) => invoke<{ success: true; status: "cancelled" }>("cancel-calendar-booking", { token });
