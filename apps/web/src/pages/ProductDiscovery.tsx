import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../p5-discovery.css";

type Answer = { label: string; value: string };

const prompts = [
  { key: "problem", eyebrow: "01 / THE PROBLEM", title: "What are you trying to make work better?", options: ["More qualified enquiries", "Faster response and routing", "A clearer buying journey", "Better operational control"] },
  { key: "journey", eyebrow: "02 / THE JOURNEY", title: "Where does the friction show up?", options: ["Website or first interaction", "Qualification and handoff", "Checkout or transaction", "After the customer says yes"] },
  { key: "boundary", eyebrow: "03 / THE BOUNDARY", title: "What should never happen without a person?", options: ["High-risk decisions", "Exceptions to policy", "Sensitive customer situations", "Anything consequential"] },
] as const;

const guidance: Record<string, string> = {
  "More qualified enquiries": "Start with Discover. Structure the public journey before adding automation.",
  "Faster response and routing": "Start with Operate. Map intent, policy, ownership, and review before execution.",
  "A clearer buying journey": "Start with Build. Connect demand, product discovery, transaction, and post-purchase learning.",
  "Better operational control": "Start with Scale. Make important work visible, governed, and measurable before expanding it.",
};

export function ProductDiscovery() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const current = prompts[step];
  const complete = Object.keys(answers).length === prompts.length;
  const recommendation = useMemo(() => guidance[answers.problem?.value ?? ""] ?? "Begin with the journey that is costing you the most value today.", [answers.problem]);

  function choose(value: string) {
    setAnswers((previous) => ({ ...previous, [current.key]: { label: current.title, value } }));
    if (step < prompts.length - 1) setStep((value) => value + 1);
  }

  return <main className="qs-discovery">
    <section className="qs-discovery-hero">
      <div><p className="eyebrow">ASK QUINCESTONE</p><h1>Start with the problem.<br /><em>We will map the system.</em></h1><p className="lede">A short product discovery path for finding the right Quincestone entry point. No technical vocabulary required.</p></div>
      <div className="qs-discovery-note"><span>DISCOVERY MODE</span><strong>3 decisions</strong><p>Your answers shape a recommendation. Nothing is submitted or changed in your systems.</p></div>
    </section>

    <section className="qs-discovery-workspace" aria-label="Product discovery">
      <div className="qs-discovery-progress"><span>0{step + 1}</span><div><i style={{ width: `${((step + 1) / prompts.length) * 100}%` }} /></div><span>0{prompts.length}</span></div>
      <div className="qs-discovery-question"><p className="eyebrow">{current.eyebrow}</p><h2>{current.title}</h2><div className="qs-discovery-options" role="list">{current.options.map((option) => <button type="button" key={option} className={answers[current.key]?.value === option ? "is-selected" : ""} onClick={() => choose(option)}><span>{answers[current.key]?.value === option ? "✓" : "→"}</span><strong>{option}</strong></button>)}</div></div>
    </section>

    <section className="qs-discovery-result" aria-live="polite">
      <div><p className="eyebrow">{complete ? "RECOMMENDED ENTRY POINT" : "WORKING VIEW"}</p><h2>{complete ? recommendation : "Answer the three questions to reveal the path."}</h2><p>{complete ? "This is a product recommendation, not an automated commitment. An assessment can turn it into a scoped implementation path." : "Your selections stay in this session until you choose a next step."}</p></div>
      <div className="qs-discovery-answers">{prompts.map((prompt) => <div key={prompt.key}><span>{prompt.eyebrow}</span><strong>{answers[prompt.key]?.value ?? "Not selected"}</strong></div>)}</div>
      {complete && <div className="actions"><Link className="button" to="/assessment">Turn this into an assessment</Link><Link className="text-link" to="/demo/experience">See the governed demonstration →</Link></div>}
    </section>

    <section className="qs-discovery-principle"><p className="eyebrow">THE QUINCESTONE RULE</p><h2>Discovery should clarify the next move, not sell you a system you do not need.</h2><p>Ask Quincestone helps you locate the valuable part of the journey first. Architecture, automation, integrations, and operations follow only when they earn their place.</p></section>
  </main>;
}
