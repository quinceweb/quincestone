import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

const model = [
  ["01", "Discover", "Find meaningful demand."],
  ["02", "Build", "Create the experience around it."],
  ["03", "Operate", "Move the work toward an outcome."],
  ["04", "Scale", "Learn from what actually works."],
] as const;

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`qs-reveal ${className}`}>{children}</div>;
}

function QuincestoneMonument() {
  return <Reveal className="qs-monument" aria-label="Quincestone architectural mark">
    <div className="qs-monument-field" aria-hidden="true"><div className="qs-monument-horizon" /><div className="qs-monument-q"><span className="qs-monument-ring" /><span className="qs-monument-cut" /><span className="qs-monument-tail" /></div><div className="qs-monument-plinth"><span>Q</span><small>QUINCESTONE / INSTITUTIONAL SYSTEM</small></div></div>
    <div className="qs-monument-caption"><span>INTELLIGENCE</span><span>HUMAN JUDGMENT</span><span>AUTHORITY</span><span>OUTCOMES</span></div>
  </Reveal>;
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
    <Reveal className="qs-show-me-heading"><div><p className="eyebrow">SIGNATURE DEMONSTRATION</p><h2 id="show-me-title">Watch governed intelligence move toward an outcome.</h2></div><p>One interaction moves through intelligence, governance and action while the authority boundary stays visible. Interactive demonstration. No live customer activity is represented.</p></Reveal>
    <Reveal className="qs-show-me-console">
      <div className="qs-show-me-nav" aria-label="Demonstration stages">{frames.map(([number, title], index) => <button key={number} type="button" className={step === index ? "is-active" : ""} aria-current={step === index ? "step" : undefined} onClick={() => setStep(index)}><span>{number}</span><strong>{title}</strong></button>)}</div>
      <div className="qs-show-me-stage"><div><p className="eyebrow">STAGE {frame[0]}</p><h3>{frame[1]}</h3><p>{frame[2]}</p></div><div className="qs-show-me-flow"><span>INPUT</span><i aria-hidden="true">→</i><strong>{frame[1].toUpperCase()}</strong><i aria-hidden="true">→</i><span>NEXT</span></div></div>
    </Reveal>
    <div className="actions"><Link className="button" to="/demo/experience">See it in action</Link></div>
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
          <p className="eyebrow">ONE QUINCESTONE / GOVERNED INTELLIGENCE</p>
          <h1>Turn demand<br />into <em>outcomes.</em></h1>
          <p className="qs-hero-lede">Understand what people need. Qualify what matters. Move the right work forward—with intelligence, policy and human authority built into the path.</p>
          <div className="actions"><Link className="button qs-hero-primary" to="/assessment">Start an assessment <span aria-hidden="true">→</span></Link><Link className="button secondary" to="/demo/experience">See the system in action</Link></div>
        </Reveal>
        <QuincestoneMonument />
      </div>
      <div className="qs-hero-rule"><span>UNDERSTAND</span><span>QUALIFY</span><span>GOVERN</span><span>ACT</span><span>LEARN</span></div>
    </section>

    <section className="qs-statement">
      <Reveal><p className="eyebrow">FROM DEMAND TO EXECUTION</p><h2>Interest becomes valuable<br /><span>when the right action follows.</span></h2></Reveal>
      <Reveal className="qs-statement-side"><p>Quincestone connects what people need with the knowledge, policy, authority and operating path required to move that demand forward.</p><Link className="text-link" to="/platform">Explore the platform →</Link></Reveal>
    </section>

    <section className="qs-model" id="system">
      <Reveal className="qs-section-intro"><p className="eyebrow">ONE OPERATING MODEL</p><h2>Discover. Build.<br />Operate. Scale.</h2><p>One system, expressed through business operations and commerce.</p></Reveal>
      <div className="qs-model-grid">{model.map(([number, title, text]) => <Reveal className="qs-model-step" key={number}><Link to={`/${title.toLowerCase()}`}><span>{number}</span><strong>{title}</strong><p>{text}</p><i aria-hidden="true">Explore →</i></Link></Reveal>)}</div>
    </section>

    <ShowMeExperience />

    <section className="qs-ecosystem" aria-labelledby="ecosystem-title">
      <Reveal className="qs-ecosystem-heading"><div><p className="eyebrow">ONE QUINCESTONE</p><h2 id="ecosystem-title">One operating intelligence.<br />Different places to act.</h2></div><p>The same governed foundation meets different kinds of demand without collapsing product authority.</p></Reveal>
      <div className="qs-ecosystem-grid">
        <Reveal className="qs-ecosystem-item qs-ecosystem-business"><span>01 / BUSINESS</span><h3>Operate the work.</h3><p>Turn customer interaction into governed workflows, knowledge, policy and accountable decisions.</p><a href="https://app.quincestone.com">Open Business <i aria-hidden="true">↗</i></a></Reveal>
        <Reveal className="qs-ecosystem-item qs-ecosystem-edge"><span>02 / EDGE</span><h3>Understand before acting.</h3><p>Qualify intent, apply business context and preserve the authority boundary before consequential action.</p><Link to="/edge">Explore Edge <i aria-hidden="true">→</i></Link></Reveal>
        <Reveal className="qs-ecosystem-item qs-ecosystem-commerce"><span>03 / COMMERCE</span><h3>Move qualified demand into commerce.</h3><p>Discover, validate and transact through a dedicated commerce experience built around customer intent.</p><a href="https://shop.quincestone.com">Shop Quincestone <i aria-hidden="true">↗</i></a></Reveal>
      </div>
    </section>

    <section className="qs-human">
      <Reveal><p className="eyebrow">HUMAN JUDGMENT</p><h2>Automation should know<br /><em>when to stop.</em></h2></Reveal>
      <Reveal className="qs-human-side"><p>Consequential, ambiguous, sensitive, or policy-bound work can stop at a human review boundary. The system preserves the reasoning, the decision, and the resulting outcome.</p><Link className="text-link" to="/escalations">See human review →</Link></Reveal>
    </section>

    <section className="qs-final">
      <Reveal><p className="eyebrow">THE QUINCESTONE PRINCIPLE</p><h2>Understand demand.<br />Operate what happens next.<br /><span>Scale what works.</span></h2><div className="actions"><Link className="button" to="/assessment">Start an assessment</Link><Link className="text-link" to="/about">About Quincestone →</Link></div></Reveal>
    </section>
  </main>;
}
