import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

const model = [
  ["01", "Discover", "Find meaningful demand."],
  ["02", "Build", "Create the experience around it."],
  ["03", "Operate", "Move the work toward an outcome."],
  ["04", "Scale", "Learn from what actually works."],
] as const;

const productBridge = [
  ["01", "Discover", "Assessment, product discovery, and a clear view of what should happen next.", "/assessment", "Start with assessment"],
  ["02", "Build", "Business systems, commerce experiences, and the foundations that turn demand into something useful.", "/business", "Explore Business"],
  ["03", "Operate", "Edge, routing, operations, and governed execution around the work that matters.", "/edge", "Explore Edge"],
  ["04", "Scale", "Learn from outcomes, improve the system, and expand what is working.", "/operations", "See Operations"],
] as const;

const outcomes = [
  ["01", "Capture more qualified demand", "Make the public journey clearer, collect the right context, and turn interest into a structured next step.", "/assessment", "Start with the journey"],
  ["02", "Move requests toward action", "Connect interaction, intelligence, policy, routing, and human judgment so work does not stop at the front door.", "/edge", "Explore Edge"],
  ["03", "Build a better commerce path", "Discover what people want, validate the opportunity, source carefully, transact clearly, and learn from outcomes.", "/shop", "Enter Commerce"],
  ["04", "Create operating control", "Make important work visible, governed, reviewable, and easier to improve as the system learns.", "/operations", "See Operations"],
] as const;

const edgeStages = ["Interaction", "Understand", "Qualify", "Knowledge", "Policy", "Route", "Review", "Outcome"];

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`qs-reveal ${className}`}>{children}</div>;
}

function OutcomeExplorer() {
  const [selected, setSelected] = useState(0);
  const outcome = outcomes[selected];
  return <section className="qs-outcome-explorer" aria-labelledby="outcome-explorer-title">
    <Reveal className="qs-outcome-intro"><div><p className="eyebrow">EXPLORE BY OUTCOME</p><h2 id="outcome-explorer-title">Start with what needs to change.</h2></div><p>You do not need to understand the whole Quincestone system first. Choose the outcome closest to your problem and see the operating path underneath.</p></Reveal>
    <Reveal className="qs-outcome-interface">
      <div className="qs-outcome-options" role="tablist" aria-label="Business outcomes">
        {outcomes.map(([number, title], index) => <button key={number} type="button" role="tab" aria-selected={selected === index} className={selected === index ? "is-active" : ""} onClick={() => setSelected(index)}><span>{number}</span><strong>{title}</strong><i aria-hidden="true">→</i></button>)}
      </div>
      <div className="qs-outcome-detail" role="tabpanel">
        <p className="eyebrow">SELECTED OUTCOME</p><h3>{outcome[1]}</h3><p>{outcome[2]}</p><Link className="button" to={outcome[3]}>{outcome[4]}</Link>
        <div className="qs-outcome-trace"><span>DEMAND</span><i aria-hidden="true">→</i><span>INTELLIGENCE</span><i aria-hidden="true">→</i><span>POLICY</span><i aria-hidden="true">→</i><span>ACTION</span><i aria-hidden="true">→</i><span>OUTCOME</span></div>
      </div>
    </Reveal>
  </section>;
}

function ShowMeExperience() {
  const [step, setStep] = useState(0);
  const frames = [
    ["01", "Interaction", "A customer asks for help. Quincestone captures the request and the context needed to understand it."],
    ["02", "Intelligence", "The system separates what was observed from what it derives, keeping interpretation traceable."],
    ["03", "Governance", "Knowledge and policy determine what can happen automatically and where authority must stop."],
    ["04", "Action", "A proposed next step is routed. Human review remains explicit when the decision is consequential."],
    ["05", "Outcome", "The result is recorded so the next cycle can improve from what actually happened."],
  ] as const;
  const frame = frames[step];
  return <section className="qs-show-me" aria-labelledby="show-me-title">
    <Reveal className="qs-show-me-heading"><div><p className="eyebrow">SHOW ME</p><h2 id="show-me-title">See the system move, not just the story.</h2></div><p>A compact product walkthrough of the Quincestone operating model. Every stage is illustrative until connected to a real workspace.</p></Reveal>
    <Reveal className="qs-show-me-console">
      <div className="qs-show-me-nav" aria-label="Demonstration stages">{frames.map(([number, title], index) => <button key={number} type="button" className={step === index ? "is-active" : ""} aria-current={step === index ? "step" : undefined} onClick={() => setStep(index)}><span>{number}</span><strong>{title}</strong></button>)}</div>
      <div className="qs-show-me-stage"><div><p className="eyebrow">STAGE {frame[0]}</p><h3>{frame[1]}</h3><p>{frame[2]}</p></div><div className="qs-show-me-flow"><span>INPUT</span><i aria-hidden="true">→</i><strong>{frame[1].toUpperCase()}</strong><i aria-hidden="true">→</i><span>NEXT</span></div></div>
    </Reveal>
    <div className="actions"><Link className="button" to="/demo/experience">Open full demonstration</Link></div>
  </section>;
}

export function Home() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".qs-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return <main className="qs-signature">
    <section className="qs-hero">
      <div className="qs-hero-inner">
        <Reveal className="qs-hero-copy">
          <p className="eyebrow">ONE QUINCESTONE</p>
          <h1>Turn demand<br /><em>into outcomes.</em></h1>
          <p className="qs-hero-lede">Quincestone discovers meaningful demand, builds the experience around it, and operates the systems that move it toward a valuable outcome.</p>
          <div className="actions"><Link className="button" to="/assessment">Start with an assessment</Link><Link className="button secondary" to="/platform">Explore Quincestone</Link></div>
        </Reveal>
        <Reveal className="qs-hero-console">
          <div className="qs-console-top"><span>QUINCESTONE EDGE</span><span>LIVE SYSTEM MODEL</span></div>
          <div className="qs-console-body">
            <div className="qs-console-request"><span className="qs-console-index">01</span><div><small>INCOMING INTERACTION</small><strong>"I need help deciding what happens next."</strong></div></div>
            <div className="qs-console-line" />
            <div className="qs-console-decision"><span className="qs-console-index">02</span><div><small>GOVERNED DECISION</small><strong>Understand → qualify → apply policy → route</strong><p>Human review remains available where judgment is required.</p></div></div>
            <div className="qs-console-footer"><span>TRACEABLE</span><span>WORKSPACE-SCOPED</span><span>AUTHORITY-AWARE</span></div>
          </div>
        </Reveal>
      </div>
      <div className="qs-hero-rule"><span>DEMAND</span><span>EXPERIENCE</span><span>INTELLIGENCE</span><span>TRANSACTION</span><span>OPERATIONS</span><span>OUTCOME</span><span>LEARNING</span><span>SCALE</span></div>
    </section>

    <section className="qs-statement">
      <Reveal><p className="eyebrow">THE IDEA</p><h2>The distance between<br /><span>interest and execution</span><br />is where value is lost.</h2></Reveal>
      <Reveal className="qs-statement-side"><p>People discover, ask, compare, request, buy and return. Businesses need to know what that demand means, what they are allowed to do, and what should happen next.</p><Link className="text-link" to="/platform">See the operating model →</Link></Reveal>
    </section>

    <section className="qs-model" id="system">
      <Reveal className="qs-section-intro"><p className="eyebrow">ONE OPERATING MODEL</p><h2>Discover. Build.<br />Operate. Scale.</h2><p>One system, expressed through business operations and commerce.</p></Reveal>
      <div className="qs-model-grid">{model.map(([number, title, text]) => <Reveal className="qs-model-step" key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></Reveal>)}</div>
    </section>

    <section className="product-entry qs-home-bridge">
      <Reveal className="qs-home-bridge-intro"><p className="eyebrow">WHERE TO START</p><h2>One model.<br />Four clear ways in.</h2><p>Choose the part of the journey closest to the outcome you need. Quincestone connects the pieces underneath.</p></Reveal>
      <div className="qs-home-bridge-grid">{productBridge.map(([number, title, text, to, cta]) => <Reveal className="qs-home-bridge-item" key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p><Link className="text-link" to={to}>{cta} →</Link></Reveal>)}</div>
    </section>

    <OutcomeExplorer />
    <ShowMeExperience />

    <section className="qs-business">
      <Reveal className="qs-business-copy"><p className="eyebrow">QUINCESTONE FOR BUSINESS</p><h2>Your website should do more than receive people.</h2><p>Turn the public front door into an operating path: understand the request, collect the right context, apply business knowledge and policy, route work, and preserve the human decision when it matters.</p><Link className="button" to="/assessment">Request an assessment</Link></Reveal>
      <Reveal className="qs-business-map"><div className="qs-map-header"><span>FROM INTERACTION</span><span>TO OUTCOME</span></div><div className="qs-map-flow">{edgeStages.map((stage, index) => <div key={stage} className="qs-map-stage"><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage}</strong>{index < edgeStages.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div><div className="qs-map-foot">Every consequential boundary remains explicit.</div></Reveal>
    </section>

    <section className="qs-edge">
      <Reveal className="qs-edge-heading"><div><p className="eyebrow">QUINCESTONE EDGE</p><h2>Intelligence with<br />an authority boundary.</h2></div><p>Edge is not a chatbot. It is the governed layer between customer interaction and business operations.</p></Reveal>
      <Reveal className="qs-edge-ui"><div className="qs-edge-ui-head"><span>INTERACTION TRACE</span><span>STRUCTURED / GOVERNED</span></div><div className="qs-edge-ui-main"><div className="qs-edge-column"><small>OBSERVED FACTS</small><strong>Customer supplied information</strong><p>Kept separate from anything the system derives.</p></div><div className="qs-edge-column"><small>DERIVED INTELLIGENCE</small><strong>Intent + qualification</strong><p>Traceable interpretation with context.</p></div><div className="qs-edge-column"><small>POLICY</small><strong>What the business permits</strong><p>Authority is evaluated before action.</p></div><div className="qs-edge-column"><small>NEXT</small><strong>Proposed action</strong><p>Human review when required.</p></div></div><div className="qs-edge-ui-foot"><span>TRACE</span><span>KNOWLEDGE</span><span>POLICY</span><span>REVIEW</span><span>OUTCOME</span></div></Reveal>
      <div className="actions"><Link className="button light" to="/edge">Explore Edge</Link><Link className="text-link light-link" to="/demo/experience">Experience the demonstration →</Link></div>
    </section>

    <section className="qs-commerce">
      <Reveal className="qs-commerce-intro"><p className="eyebrow">QUINCESTONE COMMERCE</p><h2>Better products.<br />Better value.<br />Built around demand.</h2></Reveal>
      <Reveal className="qs-commerce-copy"><p>Commerce follows the same discipline. Discover demand, validate the opportunity, source carefully, transact clearly, learn from customers, and earn the right to build more control.</p><Link className="text-link" to="/shop">Enter Shop →</Link></Reveal>
      <Reveal className="qs-commerce-rail"><div><span>01</span><strong>Discover</strong></div><div><span>02</span><strong>Validate</strong></div><div><span>03</span><strong>Source</strong></div><div><span>04</span><strong>Improve</strong></div><div><span>05</span><strong>Brand</strong></div></Reveal>
    </section>

    <section className="qs-human">
      <Reveal><p className="eyebrow">HUMAN JUDGMENT</p><h2>Automation should know<br /><em>when to stop.</em></h2></Reveal>
      <Reveal className="qs-human-side"><p>Consequential, ambiguous, sensitive, or policy-bound work can stop at a human review boundary. The system preserves the reasoning, the decision, and the resulting outcome.</p><Link className="text-link" to="/escalations">See human review →</Link></Reveal>
    </section>

    <section className="qs-final">
      <Reveal><p className="eyebrow">THE QUINCESTONE PRINCIPLE</p><h2>Understand demand.<br />Operate what happens next.<br /><span>Scale what works.</span></h2><div className="actions"><Link className="button" to="/assessment">Begin</Link><Link className="text-link" to="/about">About Quincestone →</Link></div></Reveal>
    </section>
  </main>;
}
