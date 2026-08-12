import { useEffect, useState } from "react";
import { CalendarError, createCalendarBooking, getCalendarAvailability, type CalendarSlot } from "../services/calendar";

type Props = { sourceType: "assessment" | "implementation" | "contact"; sourceRecordId: string; fullName: string; email: string; companyName: string };
export function TimezoneSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const common = [value, "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London"].filter((item, index, all) => all.indexOf(item) === index);
  return <label>Timezone<select value={value} onChange={(event) => onChange(event.target.value)}>{common.map((zone) => <option key={zone}>{zone}</option>)}</select></label>;
}
export function AvailabilitySkeleton() { return <p role="status">Checking secure live availability…</p>; }
export function NoAvailabilityState() { return <p role="status">No appointments are available in this window. Email hello@quincestone.com for assistance.</p>; }
export function CalendarErrorState({ message }: { message: string }) { return <p className="form-status" role="alert">{message}</p>; }
export function BookingConfirmation({ meetingUrl }: { meetingUrl?: string }) { return <div className="booking-confirmation" role="status"><strong>Appointment confirmed.</strong><p>{meetingUrl ? <>Google Meet created. <a href={meetingUrl}>Open meeting details</a></> : "No video meeting was created."}</p></div>; }
export function CalendarSlotPicker({ slots, selected, onSelect }: { slots: CalendarSlot[]; selected?: CalendarSlot; onSelect: (slot: CalendarSlot) => void }) { return <div className="slot-grid">{slots.map((slot) => <button type="button" className={selected?.start === slot.start ? "selected" : ""} key={slot.start} onClick={() => onSelect(slot)}>{slot.label}</button>)}</div>; }

export function CalendarBooking(props: Props) {
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York");
  const [slots, setSlots] = useState<CalendarSlot[]>([]); const [selected, setSelected] = useState<CalendarSlot>();
  const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [meetingUrl, setMeetingUrl] = useState<string>(); const [confirmed, setConfirmed] = useState(false);
  useEffect(() => { let active = true; setLoading(true); setError(""); const from = new Date(); const to = new Date(from.getTime() + 14 * 86400000);
    getCalendarAvailability({ appointmentType: props.sourceType === "assessment" ? "edge-assessment" : "consultation", timezone, dateFrom: from.toISOString(), dateTo: to.toISOString() })
      .then((result) => { if (active) setSlots(result.slots); }).catch((reason: unknown) => { if (active) setError(reason instanceof CalendarError ? reason.message : "Scheduling is temporarily unavailable."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; };
  }, [props.sourceType, timezone]);
  async function book() { if (!selected) return; setLoading(true); setError(""); try { const result = await createCalendarBooking({ ...props, appointmentType: props.sourceType === "assessment" ? "edge-assessment" : "consultation", start: selected.start, end: selected.end, timezone, idempotencyKey: crypto.randomUUID() }); setMeetingUrl(result.meetingUrl); setConfirmed(true); } catch (reason) { setError(reason instanceof CalendarError ? reason.message : "The appointment could not be created."); } finally { setLoading(false); } }
  if (confirmed) return <BookingConfirmation meetingUrl={meetingUrl} />;
  return <section className="calendar-booking"><h2>{props.sourceType === "implementation" ? "Request an initial scope call" : "Schedule a conversation"}</h2><p>Your submission is saved. Scheduling is optional and does not imply acceptance or guaranteed implementation availability.</p><TimezoneSelector value={timezone} onChange={setTimezone} />{loading ? <AvailabilitySkeleton /> : error ? <CalendarErrorState message={error} /> : slots.length ? <><CalendarSlotPicker slots={slots} selected={selected} onSelect={setSelected} /><button type="button" className="button" disabled={!selected} onClick={book}>Confirm selected time</button></> : <NoAvailabilityState />}</section>;
}
