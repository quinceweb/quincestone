import { useMemo, useState } from "react";
import { submit } from "../lib/submissions";

type Answers = Record<string, string>;
type Step = { id: string; eyebrow: string; title: string; prompt: string; options?: string[]; type?: "text" | "email" | "url" };

const steps: Step[] = [
  { id: "name", eyebrow: "01 / BUSINESS", title: "First, who are we understanding?", prompt: "Your name", type: "text" },
  { id: "email", eyebrow: "02 / CONTACT", title: "Where should the reviewed assessment reach you?", prompt: "Work email", type: "email" },
  { id: "company", eyebrow: "03 / BUSINESS", title: "What is the business?", prompt: "Business or organization name", type: "text" },
  { id: "website", eyebrow: "04 / FRONT DOOR", title: "What does the customer see today?", prompt: "Website URL — leave blank if you do not have one", type: "url" },
  { id: "digital_state", eyebrow: "05 / FRONT DOOR", title: "Which description is closest?", prompt: "Choose the state that feels most accurate.", options: ["We do not have a website yet.", "We have a website, but it does not generate enough enquiries.", "We get enquiries, but they are poorly qualified.", "We get good enquiries, but follow-up or routing is weak.", "The journey works, but we cannot see where it breaks."] },
  { id: "demand", eyebrow: "06 / DEMAND", title: "Where do opportunities usually begin?", prompt: "Choose the strongest source of customer intent.", options: ["Search / organic traffic", "Advertising / paid traffic", "Referrals / word of mouth", "Social / content", "Existing customers / repeat business", "Several of these are important"] },
  { id: "leak", eyebrow: "07 / REVENUE LEAKAGE", title: "Where do you think value is being lost?", prompt: "Choose the closest problem.", options: ["People leave before contacting us.", "We receive enquiries without enough context.", "Good enquiries reach the wrong person or team.", "Response time is too slow.", "Staff repeatedly answer the same questions.", "We cannot tell why opportunities are lost."] },
  { id: "qualification", eyebrow: "08 / QUALIFICATION", title: "What must your team know before acting?", prompt: "Describe the context that separates a useful opportunity from a weak one.", type: "text" },
  { id: "knowledge", eyebrow: "09 / KNOWLEDGE", title: "What does the business already know?", prompt: "Think services, pricing rules, service areas, FAQs, policies, eligibility, product information, or operating knowledge.", type: "text" },
  { id: "policy", eyebrow: "10 / POLICY", title: "Where should a human remain in control?", prompt: "What should never happen without a person deciding first?", type: "text" },
  { id: "outcome", eyebrow: "11 / OUTCOME", title: "If this worked, what would change first?", prompt: "Describe the business outcome you want most.", type: "text" },
];

function scoreAnswers(answers: Answers) {
  let score = 0;
  const flags: string[] = [];
  if (answers.digital_state === "We do not have a website yet.") { score += 12; flags.push("No structured digital front door"); }
  if (answers.digital_state?.includes("does not generate")) { score += 18; flags.push("Weak conversion path"); }
  if (answers.digital_state?.includes("poorly qualified")) { score += 22; flags.push("Qualification gap"); }
  if (answers.digital_state?.includes("follow-up")) { score += 20; flags.push("Routing / response gap"); }
  if (answers.digital_state?.includes("cannot see")) { score += 16; flags.push("Observability gap"); }
  if (answers.leak) score += 12;
  if (answers.qualification?.trim()) score += 8;
  if (answers.knowledge?.trim()) score += 6;
  if (answers.policy?.trim()) score += 6;
  return { score: Math.min(100, score), flags };
}

export function EdgeAssessment() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const step = steps[index];
  const result = useMemo(() => scoreAnswers(answers), [answers]);
  const progress = Math.round(((index + 1) / steps.length) * 100);
  const value = answers[step.id] ?? "";
  const setValue = (next: string) => setAnswers((current) => ({ ...current, [step.id]: next }));
  const canContinue = value.trim().length > 0 && (step.id !== "email" || /\S+@\S+\.\S+/.test(value));

  async function finish() {
    if (!canContinue || busy) return;
    setBusy(true);
    setError("");
    const report = { status: "human_review", score: result.score, flags: result.flags, priority: result.score >= 55 ? "high" : result.score >= 30 ? "medium" : "foundational", recommendation: result.score >= 55 ? "Prioritize the interaction-to-outcome path: qualification, knowledge, policy and routing." : result.score >= 30 ? "Map the customer journey and introduce a structured Edge front door around the highest-value gap." : "Establish the operating model first, then design the simplest digital front door around it." };
    const payload = { name: answers.name ?? "", email: answers.email ?? "", company: answers.company ?? "", website: answers.website ?? "", message: `Edge assessment submitted for ${answers.company || "business"}.`, company_site: "", assessment: JSON.stringify({ version: 1, answers, report }) };
    const response = await submit("assessment_requests", payload);
    setBusy(false);
    if (!response.ok) { setError(response.message); return; }
    setReference(response.reference);
    setSubmitted(true);
  }

  if (submitted) return <section className="edge-assessment edge-assessment--complete"><div className="edge-assessment__complete"><p className="eyebrow">EDGE / HUMAN REVIEW</p><span className="edge-assessment__mark">✓</span><h1>Your assessment is now with Quincestone.</h1><p>Edge has structured the journey, identified the strongest opportunity signals, and placed the assessment into human review. We do not turn a consequential recommendation into an automated verdict.</p><div className="edge-assessment__report"><span>PRELIMINARY SIGNAL</span><strong>{result.score >= 55 ? "High opportunity" : result.score >= 30 ? "Clear opportunity" : "Foundational opportunity"}</strong><p>{result.flags.length ? result.flags.join(" · ") : "Operating model requires deeper discovery."}</p></div><small>Reference {reference}</small><a className="button" href="/">Return to Quincestone</a></div></section>;

  return <section className="edge-assessment"><div className="edge-assessment__top"><div><p className="eyebrow">QUINCESTONE EDGE / ASSESSMENT</p><span>Private business assessment</span></div><strong>{String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</strong></div><div className="edge-assessment__progress"><i style={{ width: `${progress}%` }} /></div><div className="edge-assessment__body"><div className="edge-assessment__context"><p>{step.eyebrow}</p><span>Edge is building a picture of the path between customer intent and business outcome.</span></div><div className="edge-assessment__question"><p className="eyebrow">{step.eyebrow}</p><h1>{step.title}</h1><p>{step.prompt}</p>{step.options ? <div className="edge-assessment__options">{step.options.map((option) => <button key={option} className={value === option ? "is-selected" : ""} type="button" onClick={() => setValue(option)}>{option}<span>↗</span></button>)}</div> : <label><span className="sr-only">{step.prompt}</span><input autoFocus value={value} onChange={(event) => setValue(event.target.value)} type={step.type ?? "text"} placeholder={step.id === "website" ? "https://" : "Type your answer…"} autoComplete={step.id === "email" ? "email" : step.id === "name" ? "name" : "organization"} maxLength={1200} /></label>}{error && <p className="edge-assessment__error">{error}</p>}<div className="edge-assessment__actions">{index > 0 && <button className="text-link" type="button" onClick={() => setIndex(index - 1)}>← Back</button>}{index < steps.length - 1 ? <button className="button" type="button" disabled={!canContinue} onClick={() => setIndex(index + 1)}>Continue <span>→</span></button> : <button className="button" type="button" disabled={!canContinue || busy} onClick={finish}>{busy ? "Submitting…" : "Send for human review →"}</button>}</div></div></div><div className="edge-assessment__footer"><span>Private by design</span><span>Edge structures. Humans decide.</span><span>{progress}% complete</span></div></section>;
}
