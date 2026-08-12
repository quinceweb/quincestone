import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { submit, type SubmissionKind } from "../lib/submissions";
import { CalendarBooking } from "./CalendarBooking";
import { isContactSchedulingEligible } from "../lib/scheduling";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  company: z.string().trim().max(120),
  website: z.union([z.literal(""), z.string().trim().url().max(300)]),
  message: z.string().trim().min(10).max(2000),
  contact_reason: z.enum(["request-assessment", "discuss-implementation", "platform-integration", "media", "general", "technical", "legal-privacy"]).optional(),
  company_site: z.string().max(0),
});
type FormValues = z.infer<typeof schema>;

export function LeadForm({ kind }: { kind: SubmissionKind }) {
  const started = useRef(Date.now());
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<{ reference: string; values: FormValues }>();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({ defaultValues: { name: "", email: "", company: "", website: "", message: "", company_site: "", contact_reason: kind === "contact_messages" ? "general" : undefined } });

  const onSubmit = handleSubmit(async (values) => {
    if (busy) return;
    const parsed = schema.safeParse(values);
    if (!parsed.success || Date.now() - started.current < 2500) {
      setStatus("Please review the form and take a moment before submitting.");
      return;
    }
    setBusy(true);
    const normalized = { ...parsed.data, website: parsed.data.website ? new URL(parsed.data.website).toString() : "" };
    const result = await submit(kind, normalized);
    setBusy(false);
    if (result.ok) { setStatus(kind === "implementation_applications" ? "Your application has been submitted for review." : "Submission received."); setSaved({ reference: result.reference, values: parsed.data }); reset(); }
    else setStatus(result.message);
  });

  return (
    <>{!saved && <form className="lead-form" onSubmit={onSubmit} noValidate>
      <div className="field-grid">
        <label>Name<input {...register("name")} autoComplete="name" maxLength={100} />{errors.name && <span>Enter your name.</span>}</label>
        <label>Email<input {...register("email")} type="email" autoComplete="email" maxLength={254} />{errors.email && <span>Enter a valid email.</span>}</label>
        <label>Organization<input {...register("company")} autoComplete="organization" maxLength={120} /></label>
        <label>Website<input {...register("website")} type="url" inputMode="url" placeholder="https://" maxLength={300} />{errors.website && <span>Use a complete URL.</span>}</label>
      </div>
      {kind === "contact_messages" && <label>Reason<select {...register("contact_reason")}><option value="request-assessment">Request an assessment</option><option value="discuss-implementation">Discuss implementation</option><option value="platform-integration">Platform integration</option><option value="media">Media enquiry</option><option value="general">General enquiry</option><option value="technical">Technical issue</option><option value="legal-privacy">Legal or privacy enquiry</option></select></label>}
      <label>What should become more intelligent?<textarea {...register("message")} rows={6} maxLength={2000} />{errors.message && <span>Provide at least 10 characters.</span>}</label>
      <label className="honeypot" aria-hidden="true">Company site<input {...register("company_site")} tabIndex={-1} autoComplete="off" /></label>
      <button className="button" type="submit" disabled={busy}>{busy ? "Sending…" : "Submit securely"}</button>
      <p className="form-status" role="status" aria-live="polite">{status}</p>
    </form>}{saved && <><p className="form-status" role="status">{status} Reference: {saved.reference}</p>{(kind !== "contact_messages" || isContactSchedulingEligible(saved.values.contact_reason ?? "general")) && <CalendarBooking sourceType={kind === "assessment_requests" ? "assessment" : kind === "implementation_applications" ? "implementation" : "contact"} sourceRecordId={saved.reference} fullName={saved.values.name} email={saved.values.email} companyName={saved.values.company} />}</>}</>
  );
}
