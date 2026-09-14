import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applySeo } from "../seo";

const edgeLayers = [
  ["Facts", "What the person or connected system actually supplied. Facts remain separate from interpretation."],
  ["Intelligence", "A traceable interpretation of intent, context, fit and the decision that may be needed."],
  ["Policy", "The explicit authority boundary: what may proceed, what must stop and who can decide."],
  ["Next action", "A proposed, owned route. No consequential side effect occurs without the required authority."],
] as const;

export function EdgePage() {
  const [active, setActive] = useState(0);
  useEffect(() => applySeo({ title: "Quincestone Edge — Intelligence with an authority boundary", description: "Understand requests, apply approved knowledge and policy, route the next action, and preserve human judgment.", path: "/edge" }), []);
  return <main className="detail-page detail-page--edge">
    <section className="detail-hero"><p className="eyebrow">QUINCESTONE EDGE</p><h1>Intelligence with an authority boundary.</h1><p>Edge sits between customer interaction and business operations. It understands the request, uses approved knowledge, evaluates policy and proposes what happens next—without pretending every decision belongs to automation.</p><div className="actions"><Link className="button" to="/assessment">Start with an assessment</Link><Link className="text-link" to="/operate">See the operating model →</Link></div></section>
    <section className="detail-instrument"><div className="detail-instrument__intro"><p className="eyebrow">ILLUSTRATIVE INTERACTION</p><h2>A request enters. Select a layer to inspect the decision.</h2><p>This demonstration uses fictional, deterministic content. It is not connected to customer activity.</p></div><div className="edge-instrument"><div className="edge-request"><small>OBSERVED INPUT</small><strong>“I need help deciding what happens next.”</strong></div><div className="edge-layer-tabs" role="tablist" aria-label="Edge decision layers">{edgeLayers.map(([title], index) => <button type="button" role="tab" aria-selected={active === index} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} key={title}><span>{String(index + 1).padStart(2,"0")}</span>{title}</button>)}</div><div className="edge-layer-result" role="tabpanel"><small>ACTIVE LAYER</small><h3>{edgeLayers[active][0]}</h3><p>{edgeLayers[active][1]}</p>{active === 2 && <div className="authority-stop"><span>AUTHORITY CHECK</span><strong>Human review required</strong><p>The system may prepare the decision. A person must authorize the exception.</p></div>}</div></div></section>
    <section className="detail-rule"><p className="eyebrow">THE EDGE RULE</p><h2>Observed facts are not derived intelligence. Intelligence is not authority. Authority is evaluated before action.</h2></section>
    <section className="detail-cta"><h2>Find the point where your operating path needs judgment.</h2><Link className="button" to="/assessment">Start the assessment</Link></section>
  </main>;
}

const commerceLoop = ["Demand", "Research", "Source", "Product", "Purchase", "Outcome", "Learning"];
export function CommercePage() {
  const [active, setActive] = useState(0);
  useEffect(() => applySeo({ title: "Quincestone Commerce — Better products built around demand", description: "Demand-led product research, sourcing, commerce and learning from Quincestone.", path: "/commerce" }), []);
  return <main className="detail-page detail-page--commerce">
    <section className="detail-hero"><p className="eyebrow">QUINCESTONE COMMERCE</p><h1>Better products. Better value. Built around demand.</h1><p>Quincestone Commerce begins with what people are trying to accomplish, then applies research, sourcing discipline, clear evidence and responsible transaction design.</p><div className="actions"><a className="button" href="https://shop.quincestone.com">Enter Shop</a><Link className="text-link" to="/discover">See how demand is discovered →</Link></div></section>
    <section className="detail-instrument"><div className="detail-instrument__intro"><p className="eyebrow">THE DEMAND LOOP</p><h2>Commerce is a learning system, not a random catalogue.</h2><p>Select a stage to see how value moves through the product house.</p></div><div className="commerce-loop" role="tablist" aria-label="Commerce demand loop">{commerceLoop.map((stage,index)=><button type="button" role="tab" aria-selected={active===index} className={active===index?"is-active":""} onClick={()=>setActive(index)} key={stage}><span>{String(index+1).padStart(2,"0")}</span><strong>{stage}</strong></button>)}</div><div className="commerce-state"><span>ACTIVE STAGE</span><strong>{commerceLoop[active]}</strong><p>{["A customer need becomes visible through repeated intent and friction.","Claims, alternatives and unknowns are examined before selection.","Quality, reliability, economics and operating fit are evaluated.","A useful offer is shaped around evidence—not catalogue volume.","The transaction stays clear, controlled and connected to account continuity.","The real result is recorded beyond the moment of payment.","Evidence from outcomes improves what Quincestone selects and builds next."][active]}</p></div></section>
    <section className="detail-rule"><p className="eyebrow">THE COMMERCE STANDARD</p><h2>We say what we verified. We show what remains unknown. We do not manufacture proof.</h2></section>
    <section className="detail-cta"><h2>Explore the product house.</h2><a className="button" href="https://shop.quincestone.com">Visit Shop</a></section>
  </main>;
}

export function AboutPage() {
  useEffect(() => applySeo({ title: "About Quincestone — Why we exist and how we operate", description: "Quincestone builds business systems, governed intelligence and commerce experiences around real demand.", path: "/about" }), []);
  return <main className="detail-page detail-page--about">
    <section className="detail-hero"><p className="eyebrow">ABOUT QUINCESTONE</p><h1>Built for the distance between demand and outcome.</h1><p>Quincestone exists because interest alone does not create value. The systems between a person’s need and a useful outcome must understand, decide, act and learn with discipline.</p></section>
    <section className="belief-grid"><article><span>01</span><h2>Why we exist</h2><p>To make demand more useful: better understood, better qualified and connected to a practical next action.</p></article><article><span>02</span><h2>How we operate</h2><p>Discover before building. Establish authority before action. Record outcomes before claiming improvement.</p></article><article><span>03</span><h2>What we build</h2><p>Business systems, governed intelligence and commerce experiences that move real work forward.</p></article><article><span>04</span><h2>What we refuse to fake</h2><p>Customers, evidence, activity, certainty, integrations, product claims or intelligence that does not yet exist.</p></article></section>
    <section className="detail-rule"><p className="eyebrow">ONE QUINCESTONE</p><h2>Understand demand. Operate what happens next. Scale what works.</h2></section>
    <section className="detail-cta"><h2>Start with the outcome that needs to change.</h2><Link className="button" to="/assessment">Start with an assessment</Link></section>
  </main>;
}
