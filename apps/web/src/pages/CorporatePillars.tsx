import { useState } from "react";
import { Link } from "react-router-dom";

type Pillar = "discover" | "build" | "operate" | "scale";

const content = {
  discover: {
    number: "01", eyebrow: "DISCOVER", title: "Understand what is actually happening.",
    intro: "Start with demand as it exists: the questions people ask, the decisions they struggle with, and the points where useful intent becomes lost work.",
    principle: "Do not prescribe the system before you understand the interaction.",
    capabilities: [
      ["Demand", "See repeated needs, intent and friction without turning assumptions into facts."],
      ["Interactions", "Study the real moment where a person asks, compares, hesitates or needs direction."],
      ["Assessments", "Locate the highest-value gap and define a practical next move."],
      ["Research", "Separate evidence, interpretation and the unknowns that still need work."],
    ],
    flow: ["Observe", "Structure", "Qualify", "Opportunity"],
    next: ["Build the foundation", "/build"],
  },
  build: {
    number: "02", eyebrow: "BUILD", title: "Turn understanding into infrastructure.",
    intro: "Create the business, commerce and knowledge systems required to receive demand, interpret it consistently and prepare the right next action.",
    principle: "Infrastructure should make the operating decision clearer—not hide it.",
    capabilities: [
      ["Business systems", "Connect the public experience to qualified, owned work."],
      ["Commerce", "Build product discovery and transaction around verified demand."],
      ["Intelligence", "Transform interaction into structured, traceable context."],
      ["Knowledge", "Give the system approved information and explicit boundaries."],
    ],
    flow: ["Model", "Design", "Connect", "Prepare"],
    next: ["Put it into operation", "/operate"],
  },
  operate: {
    number: "03", eyebrow: "OPERATE", title: "Make the system act.",
    intro: "Route qualified work through policy, workflows and accountable human judgment so the next action is useful, governed and visible.",
    principle: "Automation should know what it may do—and exactly when to stop.",
    capabilities: [
      ["Edge", "Place governed intelligence between customer interaction and operations."],
      ["Workflows", "Move work through explicit stages, ownership and escalation."],
      ["Policy", "Evaluate authority before a consequential action occurs."],
      ["Human review", "Preserve judgment where confidence or authority is insufficient."],
    ],
    flow: ["Understand", "Apply policy", "Route", "Act"],
    next: ["Learn from the outcome", "/scale"],
  },
  scale: {
    number: "04", eyebrow: "SCALE", title: "Learn from outcomes and expand what works.",
    intro: "Record what happened, distinguish activity from value, and improve the parts of the operating model that are producing credible outcomes.",
    principle: "Scale evidence. Do not scale noise.",
    capabilities: [
      ["Outcomes", "Connect completed work to the result it was meant to change."],
      ["Analytics", "Measure the operating path without inventing certainty."],
      ["Learning", "Use decisions and outcomes to improve the next cycle."],
      ["Continuous improvement", "Expand what proves valuable; redesign what does not."],
    ],
    flow: ["Record", "Measure", "Learn", "Improve"],
    next: ["Find your starting point", "/assessment"],
  },
} as const;

export function CorporatePillarPage({ pillar }: { pillar: Pillar }) {
  const page = content[pillar];
  const [selected, setSelected] = useState(0);
  const active = page.capabilities[selected];

  return <main className={`pillar-page pillar-page--${pillar}`}>
    <section className="pillar-hero">
      <div className="pillar-hero__number" aria-hidden="true">{page.number}</div>
      <div className="pillar-hero__copy"><p className="eyebrow">{page.eyebrow} / QUINCESTONE</p><h1>{page.title}</h1><p>{page.intro}</p></div>
      <div className="pillar-flow" aria-label={`${page.eyebrow} operating sequence`}>{page.flow.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < page.flow.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div>
    </section>

    <section className="pillar-interface" aria-labelledby={`${pillar}-interface-title`}>
      <div className="pillar-interface__heading"><p className="eyebrow">SYSTEM NAVIGATOR</p><h2 id={`${pillar}-interface-title`}>Explore what {pillar} means in practice.</h2><p>Select a layer. The interface explains the work it performs inside the operating model.</p></div>
      <div className="pillar-console">
        <div className="pillar-tabs" role="tablist" aria-label={`${page.eyebrow} capabilities`}>{page.capabilities.map(([title], index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? "is-active" : ""} onClick={() => setSelected(index)} key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong></button>)}</div>
        <div className="pillar-console__detail" role="tabpanel"><p className="eyebrow">ACTIVE LAYER</p><h3>{active[0]}</h3><p>{active[1]}</p><div className="pillar-trace"><span>INPUT</span><i>→</i><strong>{active[0].toUpperCase()}</strong><i>→</i><span>USEFUL NEXT STATE</span></div></div>
      </div>
    </section>

    <section className="pillar-principle"><p className="eyebrow">OPERATING PRINCIPLE</p><blockquote>{page.principle}</blockquote></section>
    <section className="pillar-next"><div><p className="eyebrow">NEXT IN THE MODEL</p><h2>{page.next[0]}.</h2></div><div className="actions"><Link className="button" to={page.next[1]}>{page.next[0]}</Link><Link className="text-link" to="/assessment">Start with an assessment →</Link></div></section>
  </main>;
}
