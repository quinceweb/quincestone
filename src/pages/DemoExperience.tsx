import { useState } from "react";
import { Link } from "react-router-dom";

const steps = [
  ["Request received", "A tree damaged part of my roof last night and water is coming in.", "Simulated AI identifies likely emergency intent. No repair instructions are provided."],
  ["Service area", "ZIP code: 97205", "Deterministic rule confirms this fictional ZIP is within the demonstration service area."],
  ["Property context", "Residential · Detached home · Active water entry", "Structured fields collect property type and visible conditions without diagnosing the roof."],
  ["Urgency and safety", "Occupants are safely away from the affected room.", "Human-review policy activates for active water entry or reported structural risk."],
  ["Contact", "Jordan Lee · jordan@example.test · (555) 010-0248", "Fictional contact data is collected for this local demonstration only."],
  ["Appointment", "Today · 2:30–3:00 PM", "Deterministic fixture slots are offered. This is not a real booking."],
  ["Review", "Emergency inspection request · Residential · In area", "The visitor confirms structured information before any workflow is selected."],
  ["Workflow selected", "Emergency Triage / Human Review", "A deterministic policy routes the request to a fictional emergency review queue."],
  ["Internal summary", "Likely storm-related roof damage with active water entry. Inspection requested today.", "Simulated AI condenses supplied facts; a human must verify before action."],
  ["Confirmed", "Demo interaction QN-1048 is ready for operational review.", "No real submission was created. Continue into the fictional operations console."],
] as const;

export function DemoExperience() {
  const [step, setStep] = useState(0);
  const item = steps[step];
  return (
    <section className="demo-page">
      <div className="demo-notice">Northstone Roofing is a fictional company created to demonstrate Quincestone.</div>
      <div className="demo-head"><div><p className="eyebrow">NORTHSTONE ROOFING / VISITOR EXPERIENCE</p><h1>Emergency roof request</h1></div><span>{String(step + 1).padStart(2, "0")} / {steps.length}</span></div>
      <div className="demo-stage">
        <aside>{steps.map(([title], index) => <button key={title} className={index === step ? "active" : ""} onClick={() => setStep(index)}>{index + 1}. {title}</button>)}</aside>
        <article className="demo-card"><p className="eyebrow">{item[0]}</p><h2>{item[1]}</h2><div className="decision"><strong>Decision record</strong><p>{item[2]}</p></div>
          <div className="legend"><span>Deterministic rules</span><span>Simulated AI</span><span>Human review</span></div>
          <div className="actions">{step > 0 && <button className="button secondary" onClick={() => setStep(step - 1)}>Back</button>}{step < steps.length - 1 ? <button className="button" onClick={() => setStep(step + 1)}>Continue</button> : <Link className="button" to="/demo/operations">Open operations</Link>}</div>
        </article>
      </div>
    </section>
  );
}
