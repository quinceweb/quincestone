import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard, useCatalog } from "./ShopElite";
import { recommendPublishedProducts, type ReadinessAnswers, type ReadinessConcern, type ReadinessUse } from "../lib/readiness-recommendations";
import "../readiness-builder.css";

const concerns: Array<[ReadinessConcern, string]> = [["roadside", "Roadside interruption"], ["blackout", "Blackout"], ["storm", "Storm"], ["medical", "Medical supplies"], ["evacuation", "Evacuation"]];
const initialAnswers: ReadinessAnswers = { use: "vehicle", people: 1, children: false, pets: false, climate: "temperate", concerns: [], budgetCents: null };

export function ReadinessBuilder() {
  const { products, loading, error } = useCatalog();
  const [answers, setAnswers] = useState<ReadinessAnswers>(initialAnswers);
  const [submitted, setSubmitted] = useState(false);
  const recommendations = useMemo(() => submitted ? recommendPublishedProducts(products, answers) : [], [answers, products, submitted]);
  const update = <K extends keyof ReadinessAnswers>(key: K, value: ReadinessAnswers[K]) => { setAnswers((current) => ({ ...current, [key]: value })); setSubmitted(false); };
  const toggleConcern = (concern: ReadinessConcern) => update("concerns", answers.concerns.includes(concern) ? answers.concerns.filter((item) => item !== concern) : [...answers.concerns, concern]);
  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(true); };

  return <div className="qs-readiness-page">
    <header className="qs-readiness-intro"><p className="eyebrow">READY LAB / PHASE 2</p><h1>Build a readiness brief before choosing a product.</h1><p>This guided flow matches your context only to eligible products in the published Quincestone catalog. It does not calculate safety, promise protection or invent product capability.</p></header>
    <div className="qs-readiness-layout">
      <form className="qs-readiness-form" onSubmit={submit}>
        <fieldset><legend>01 / Where will you use it?</legend><div className="qs-choice-grid">{(["vehicle", "home", "travel", "work"] as ReadinessUse[]).map((item) => <label key={item}><input type="radio" name="use" value={item} checked={answers.use === item} onChange={() => update("use", item)} /><span>{item}</span></label>)}</div></fieldset>
        <fieldset><legend>02 / Who is it for?</legend><label className="qs-field">People<input type="number" min="1" max="20" value={answers.people} onChange={(event) => update("people", Math.max(1, Math.min(20, Number(event.target.value) || 1)))} /></label><div className="qs-check-row"><label><input type="checkbox" checked={answers.children} onChange={(event) => update("children", event.target.checked)} /> Children included</label><label><input type="checkbox" checked={answers.pets} onChange={(event) => update("pets", event.target.checked)} /> Pets included</label></div></fieldset>
        <fieldset><legend>03 / Operating context</legend><label className="qs-field">Primary climate<select value={answers.climate} onChange={(event) => update("climate", event.target.value as ReadinessAnswers["climate"])}><option value="temperate">Temperate</option><option value="cold">Cold</option><option value="hot">Hot</option><option value="wet">Wet / storm-prone</option></select></label><div className="qs-check-grid" aria-label="Primary concerns">{concerns.map(([item, label]) => <label key={item}><input type="checkbox" checked={answers.concerns.includes(item)} onChange={() => toggleConcern(item)} /> {label}</label>)}</div></fieldset>
        <fieldset><legend>04 / Product price ceiling</legend><label className="qs-field">Budget<select value={answers.budgetCents ?? ""} onChange={(event) => update("budgetCents", event.target.value ? Number(event.target.value) : null)}><option value="">No ceiling</option><option value="20000">Up to $200</option><option value="40000">Up to $400</option><option value="70000">Up to $700</option><option value="100000">Up to $1,000</option></select></label><p>Pricing is read from published variants. This is not a discount, quote or financing offer.</p></fieldset>
        <button className="button" type="submit" disabled={loading || error}>{loading ? "Checking published products…" : "Build my brief"}</button>
      </form>
      <aside className="qs-readiness-brief" aria-live="polite"><p className="eyebrow">YOUR BRIEF</p><h2>{submitted ? "Context recorded." : "Answer four focused questions."}</h2><dl><div><dt>Use</dt><dd>{answers.use}</dd></div><div><dt>People</dt><dd>{answers.people}</dd></div><div><dt>Children / pets</dt><dd>{answers.children ? "Children" : "No children selected"} · {answers.pets ? "Pets" : "No pets selected"}</dd></div><div><dt>Climate</dt><dd>{answers.climate}</dd></div><div><dt>Concerns</dt><dd>{answers.concerns.length ? answers.concerns.join(", ") : "Not specified"}</dd></div></dl><p className="qs-readiness-boundary">This brief stays in this browser session and does not create an Account record or readiness score.</p></aside>
    </div>
    {submitted && <section className="qs-readiness-results" aria-labelledby="readiness-results-heading"><p className="eyebrow">EXPLAINABLE MATCHES</p><h2 id="readiness-results-heading">{recommendations.length ? "Published products that meet the supported rules." : "No supported match is available."}</h2>{error ? <p role="alert">The published catalog could not be checked. No recommendation has been generated.</p> : recommendations.length ? recommendations.map((recommendation) => <article key={recommendation.product.id}><ProductCard product={recommendation.product} /><div><h3>Why this appeared</h3><ul>{recommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul><h3>What was not inferred</h3><ul>{recommendation.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div></article>) : <div className="qs-readiness-no-match"><p>The current public catalog does not contain an eligible, priced product for this selection. Quincestone will not substitute an unpublished product or infer unsupported suitability.</p><Link className="text-link" to="/products">Browse the published collection →</Link></div>}</section>}
  </div>;
}
