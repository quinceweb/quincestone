import { requirePlatformRole } from "@/lib/platform-authority";
import { createClient } from "@/lib/assessment";
import { decideAssessment } from "./actions";

export const dynamic = "force-dynamic";

function parseAssessment(message: string) {
  try {
    const parsed = JSON.parse(message) as { answers?: Record<string, string>; report?: { score?: number; priority?: string; flags?: string[]; recommendation?: string } };
    return { answers: parsed.answers ?? {}, report: parsed.report ?? {} };
  } catch {
    return { answers: {}, report: {} };
  }
}

export default async function AssessmentsPage() {
  let authorized = false;
  try { await requirePlatformRole("operator"); authorized = true; } catch {}
  if (!authorized) return <main className="main"><div className="content"><div className="eyebrow">EDGE / HUMAN REVIEW</div><h1>Assessment review is fail-closed.</h1><p className="lede">An authorized Quincestone platform operator is required. No assessment data was loaded.</p></div></main>;

  const supabase = await createClient();
  const { data: assessments, error } = await supabase.from("assessment_requests").select("id,name,email,company,website,message,assessment_status,review_notes,reviewed_at,created_at").order("created_at", { ascending: false }).limit(50);
  const queue = (assessments ?? []).filter((item) => ["human_review", "in_review", "changes_requested"].includes(item.assessment_status));
  const history = (assessments ?? []).filter((item) => ["approved", "rejected"].includes(item.assessment_status));

  return <main className="main"><div className="content">
    <div className="header"><div><div className="eyebrow">EDGE / HUMAN REVIEW</div><h1>Assessment control plane.</h1><p className="lede">Every public Edge assessment arrives here as a structured recommendation. Operators review the evidence, add judgment, and decide what happens next.</p></div><div className="status"><div className="status-label">Authority</div><div className="status-value">Operator</div></div></div>
    <div className="notice"><strong>AI proposes. Humans decide.</strong><span>Approval, requested changes and rejection are durable decisions and are audited server-side. No public assessment can approve itself.</span></div>
    {error ? <div className="section"><h2>Queue unavailable</h2><p className="lede">{error.message}</p></div> : <>
      <div className="grid"><section className="section"><span className="nav-label">WAITING</span><h2>{queue.length}</h2><p>Assessments awaiting platform judgment.</p></section><section className="section"><span className="nav-label">APPROVED</span><h2>{history.filter((x) => x.assessment_status === "approved").length}</h2><p>Assessments cleared for the next governed step.</p></section><section className="section"><span className="nav-label">REJECTED</span><h2>{history.filter((x) => x.assessment_status === "rejected").length}</h2><p>Assessments closed without approval.</p></section></div>
      <section className="section"><div className="section-heading"><div><div className="eyebrow">REVIEW QUEUE</div><h2>Public Edge assessments</h2></div><span>{queue.length} active</span></div>
        {queue.length === 0 ? <p className="lede">No assessments are waiting for human review.</p> : <div className="commerce-product-list">{queue.map((assessment) => { const parsed = parseAssessment(assessment.message); return <article className="commerce-product-row" key={assessment.id}><div><span className="product-collection">{parsed.report.priority ?? "REVIEW"} · {assessment.assessment_status.replace("_", " ")}</span><h3>{assessment.company || assessment.name}</h3><p>{assessment.email} · {assessment.website || "No website"}</p><div className="assessment-findings">{(parsed.report.flags ?? []).map((flag) => <span key={flag}>{flag}</span>)}</div><p className="lede">{parsed.report.recommendation ?? "No preliminary recommendation recorded."}</p><details><summary>Open assessment evidence</summary><div className="assessment-evidence">{Object.entries(parsed.answers).filter(([key]) => !["email"].includes(key)).map(([key, value]) => <div key={key}><small>{key.replaceAll("_", " ")}</small><p>{value || "—"}</p></div>)}</div></details></div><div className="product-lifecycle"><strong>{typeof parsed.report.score === "number" ? `${parsed.report.score}/100` : "—"}</strong><small>{new Date(assessment.created_at).toLocaleString()}</small><form action={decideAssessment}><input type="hidden" name="assessment_id" value={assessment.id} /><textarea name="notes" placeholder="Reviewer note / next-step context" rows={3} /><div className="assessment-actions"><button className="text-button" name="decision" value="changes_requested" type="submit">Request changes</button><button className="text-button" name="decision" value="rejected" type="submit">Reject</button><button className="button" name="decision" value="approved" type="submit">Approve →</button></div></form></div></article>; })}</div>}
      </section>
      {history.length > 0 && <section className="section"><div className="eyebrow">DECISION HISTORY</div><h2>Recent reviewed assessments</h2><div className="commerce-product-list">{history.slice(0, 12).map((assessment) => <div className="commerce-product-row" key={assessment.id}><div><span className="product-collection">{assessment.assessment_status}</span><h3>{assessment.company || assessment.name}</h3><p>{assessment.email}</p><p>{assessment.review_notes || "No review note recorded."}</p></div><div className="product-lifecycle"><small>{assessment.reviewed_at ? new Date(assessment.reviewed_at).toLocaleString() : "Recorded"}</small></div></div>)}</div></section>}
    </>}
  </div></main>;
}
