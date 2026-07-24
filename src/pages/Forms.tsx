import { LeadForm } from "../components/LeadForm";
import type { SubmissionKind } from "../lib/submissions";

const copy: Record<SubmissionKind, [string, string, string]> = {
  assessment_requests: ["EDGE ASSESSMENT", "Find the intelligence gap.", "Describe your current website or application and the operational journey behind it. We’ll identify where intent, knowledge, qualification, and routing can become more coherent."],
  implementation_applications: ["IMPLEMENTATION", "Apply to build with Quincestone.", "Tell us about the platform, workflow, and operating constraints you want to connect."],
  contact_messages: ["CONTACT", "Begin a direct conversation.", "For product, partnership, or implementation questions, send a concise note."],
};

export function FormPage({ kind }: { kind: SubmissionKind }) {
  const [eyebrow, title, intro] = copy[kind];
  return <section className="form-page"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{intro}</p><LeadForm kind={kind} /></section>;
}
