import { useState } from "react";
import { Link } from "react-router-dom";

const steps = [
  ["Request received", "A tree damaged part of my roof last night and water is coming in.", "Simulated AI identifies likely emergency intent from the visitor's supplied statement. No repair instructions are provided.", "SIMULATED AI", "high"],
  ["Service area", "ZIP code: 97205", "A deterministic fictional service-area rule confirms that the address is inside Northstone's demonstration territory.", "DETERMINISTIC RULE", "rule"],
  ["Property context", "Residential · Detached home · Active water entry", "Structured intake captures property type and visible conditions without diagnosing the roof or making a real-world safety determination.", "STRUCTURED INTAKE", "rule"],
  ["Urgency and safety", "Occupants are safely away from the affected room.", "The fictional policy set activates human review for active water entry or reported structural risk.", "POLICY", "human"],
  ["Contact", "Jordan Lee · jordan@example.test · (555) 010-0248", "Fictional contact data is collected only for this demonstration and is never sent to a real business.", "DEMO DATA", "rule"],
  ["Appointment", "Today · 2:30–3:00 PM", "A deterministic fixture slot is displayed to demonstrate scheduling UX. No calendar request is made and no real appointment is created.", "SIMULATED WORKFLOW", "demo"],
  ["Review", "Emergency inspection request · Residential · In area", "The visitor reviews the structured facts before Quincestone selects a fictional workflow.", "CONFIRMATION", "rule"],
  ["Workflow selected", "Emergency Triage / Human Review", "A deterministic policy routes the request to a fictional emergency review queue. The system does not take a consequential action.", "ROUTING", "human"],
  ["Internal summary", "Likely storm-related roof damage with active water entry. Inspection requested today.", "Simulated AI condenses only the supplied facts. A human must verify before any operational action.", "SIMULATED AI", "high"],
  ["Confirmed", "Demo interaction QN-1048 is ready for operational review.", "No real submission, appointment, payment, subscription, or operational record was created. Continue into the fictional operations console.", "DEMO BOUNDARY", "demo"],
] as const;

export function DemoExperience() {
  const [step, setStep] = useState(0);
  const item = steps[step];
  const progress = ((step + 1) / steps.length) * 100;
  return (
    <section className="demo-page">
      <div className="demo-notice"><strong>Demonstration data only.</strong> Northstone Roofing is a fictional company created to demonstrate Quincestone. No real appointment, payment, or operational action is created from this route.</div>
      <div className="demo-head"><div><p className="eyebrow">NORTHSTONE ROOFING / VISITOR EXPERIENCE</p><h1>From a sentence to a decision record.</h1><p className="lede">Walk a fictional emergency request through the same categories Quincestone is designed to handle in a production journey.</p></div><span>{String(step + 1).padStart(2, "0")} / {steps.length}</span></div>
      <div className="demo-progress"><span style={{ width: `${progress}%` }} /></div>
      <div className="demo-stage">
        <aside><div className="demo-stage-label">JOURNEY</div>{steps.map(([title], index) => <button key={title} className={index === step ? "active" : ""} onClick={() => setStep(index)} aria-current={index === step ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{title}</button>)}</aside>
        <article className="demo-card">
          <div className="decision-top"><p className="eyebrow">{item[3]}</p><span className={`status-pill ${item[4]}`}>{item[3]}</span></div>
          <h2>{item[1]}</h2>
          <div className="decision"><strong>{item[0]}</strong><p>{item[2]}</p></div>
          <div className="demo-principles"><div><span>01</span><strong>Facts first</strong><small>Only supplied or fixture data is used.</small></div><div><span>02</span><strong>Policy controls action</strong><small>AI remains advisory where it matters.</small></div><div><span>03</span><strong>Human authority</strong><small>Review stays visible at the boundary.</small></div></div>
          <div className="actions">{step > 0 && <button className="button secondary" onClick={() => setStep(step - 1)}>Back</button>}{step < steps.length - 1 ? <button className="button" onClick={() => setStep(step + 1)}>Continue</button> : <Link className="button" to="/demo/operations">Open fictional operations desk →</Link>}</div>
        </article>
      </div>
    </section>
  );
}
