import { isSupabaseConfigured, supabase } from "../lib/supabase";

export type CalendarErrorCode =
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

export class CalendarError extends Error {
  constructor(public readonly code: CalendarErrorCode, message: string) {
    super(message);
    this.name = "CalendarError";
  }
}

export interface CalendarSlot {
  start: string;
  end: string;
  label: string;
}

export interface AvailabilityRequest {
  appointmentType: string;
  timezone: string;
  dateFrom: string;
  dateTo: string;
  durationMinutes?: number;
}

export interface AvailabilityResponse {
  success: true;
  timezone: string;
  slots: CalendarSlot[];
}

export interface BookingRequest {
  sourceType: "assessment" | "implementation" | "contact" | "manual";
  sourceRecordId: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  appointmentType: string;
  start: string;
  end: string;
  timezone: string;
  notes?: string;
  idempotencyKey: string;
}

export interface BookingResponse {
  success: true;
  bookingId: string;
  status: "confirmed";
  start: string;
  end: string;
  timezone: string;
  meetingUrl?: string;
}

async function invoke<T>(name: string, body: unknown): Promise<T> {
  if (!isSupabaseConfigured || !supabase) {
    throw new CalendarError("CALENDAR_NOT_CONFIGURED", "Live scheduling is not configured yet.");
  }

  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    throw new CalendarError("CALENDAR_UNAVAILABLE", "Scheduling is temporarily unavailable. Your submission is still safe.");
  }

  if (!data?.success) {
    const code = (data?.error?.code ?? "CALENDAR_UNAVAILABLE") as CalendarErrorCode;
    const message = data?.error?.message ?? "Scheduling could not be completed.";
    throw new CalendarError(code, message);
  }

  return data as T;
}

export function getCalendarAvailability(input: AvailabilityRequest) {
  return invoke<AvailabilityResponse>("calendar-availability", input);
}

export function createCalendarBooking(input: BookingRequest) {
  return invoke<BookingResponse>("create-calendar-booking", input);
}

export function cancelCalendarBooking(token: string) {
  return invoke<{ success: true; status: "cancelled" }>("cancel-calendar-booking", { token });
}

export function createIdempotencyKey() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function browserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
