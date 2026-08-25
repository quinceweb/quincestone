import { useEffect } from "react";
import { Link } from "react-router-dom";

const model = [
  ["01", "Discover", "Find meaningful demand."],
  ["02", "Build", "Create the experience around it."],
  ["03", "Operate", "Move the work toward an outcome."],
  ["04", "Scale", "Learn from what actually works."],
] as const;

const edgeStages = ["Interaction", "Understand", "Qualify", "Knowledge", "Policy", "Route", "Review", "Outcome"];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`qs-reveal ${className}`}>{children}</div>;
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
        <Reveal className="qs-hero-console" >
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
