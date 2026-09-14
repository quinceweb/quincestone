import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Scenario = {
  label: string;
  request: string;
  fields: Record<string, string>;
  review: boolean;
};
const scenarios: Scenario[] = [
  { label: "Damaged delivery", request: "My delivery arrived damaged and I need a replacement before Friday.", review: false, fields: {
    Interaction: "Customer requests a replacement for a damaged delivery.",
    Understand: "Intent: replacement request · urgency: time-sensitive.",
    Qualify: "Order identified · delivery condition reported · deadline supplied.",
    Knowledge: "Order and fulfilment guidance would be consulted from approved sources.",
    Policy: "Replacement eligibility must be checked against the business policy.",
    Authority: "Illustrative standard action permitted when eligibility is confirmed.",
    Action: "Prepare a replacement request and route it to fulfilment.",
    Outcome: "Proposed outcome: replacement initiated with a visible trace.",
  }},
  { label: "Service enquiry", request: "Can your team help us route urgent service enquiries after hours?", review: false, fields: {
    Interaction: "Business asks about an after-hours operating path.",
    Understand: "Intent: service design · urgency: operational.",
    Qualify: "Coverage, request types, current tools and escalation thresholds are missing.",
    Knowledge: "Approved service scope and operating hours would ground the answer.",
    Policy: "Urgent categories and eligible responders must be defined.",
    Authority: "Discovery may proceed; operational changes require an owner.",
    Action: "Route to an assessment focused on qualification and escalation.",
    Outcome: "Proposed outcome: a governed after-hours workflow brief.",
  }},
  { label: "High-value exception", request: "Approve a non-standard refund for a high-value order.", review: true, fields: {
    Interaction: "A non-standard financial exception is requested.",
    Understand: "Intent: refund exception · consequence: high.",
    Qualify: "Order context is present; exception rationale needs verification.",
    Knowledge: "Approved refund guidance informs, but does not decide, the exception.",
    Policy: "The request falls outside the standard refund boundary.",
    Authority: "Authority insufficient — human review required.",
    Action: "Prepare the evidence and route it to an authorized reviewer.",
    Outcome: "Pending human decision. No transaction is represented or executed.",
  }},
];
const stages = ["Interaction","Understand","Qualify","Knowledge","Policy","Authority","Action","Outcome"] as const;

export function BusinessPage() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [request, setRequest] = useState(scenarios[0].request);
  const [stageIndex, setStageIndex] = useState(0);
  const scenario = scenarios[scenarioIndex];
  const custom = request.trim() !== scenario.request;
  const visibleValue = useMemo(() => custom
    ? {
      Interaction: request.trim() || "Enter a request to begin.",
      Understand: "Intent and context would be structured from the supplied request.",
      Qualify: "Missing facts would be requested before a consequential decision.",
      Knowledge: "Only approved business knowledge would be used.",
      Policy: "Applicable policy would define what may proceed.",
      Authority: "Authority would be evaluated before any action.",
      Action: "A next action would be proposed, not silently executed.",
      Outcome: "The result would be recorded after a real system is connected.",
    }[stages[stageIndex]]
    : scenario.fields[stages[stageIndex]], [custom, request, scenario, stageIndex]);
  function selectScenario(index:number){setScenarioIndex(index);setRequest(scenarios[index].request);setStageIndex(0)}

  return <main className="business-page">
    <section className="business-hero"><p className="eyebrow">QUINCESTONE FOR BUSINESS</p><h1>Your website should do more than receive people.</h1><p className="lede">Turn the public front door into an operating path: understand the request, collect the right context, apply knowledge and policy, route work, and preserve human judgment where it matters.</p><div className="actions"><Link className="button" to="/assessment">Start with an assessment</Link><Link className="text-link" to="/edge">Explore Quincestone Edge →</Link></div></section>

    <section className="business-demo" aria-labelledby="business-demo-title">
      <header><div><p className="eyebrow">SYSTEM IN MOTION</p><h2 id="business-demo-title">A request enters. Something happens next.</h2></div><p className="business-demo__truth">Interactive demonstration — no live customer activity is represented.</p></header>
      <div className="business-demo__presets" aria-label="Example requests">{scenarios.map((item,index)=><button type="button" className={scenarioIndex===index&&!custom?"is-active":""} onClick={()=>selectScenario(index)} key={item.label}>{item.label}</button>)}</div>
      <div className="business-demo__surface">
        <label className="business-demo__input"><span>INCOMING INTERACTION</span><textarea rows={3} value={request} maxLength={260} onChange={(event)=>setRequest(event.target.value)} /></label>
        <div className="business-demo__rail" role="tablist" aria-label="Operating stages">{stages.map((stage,index)=><button type="button" role="tab" aria-selected={stageIndex===index} className={stageIndex===index?"is-active":""} onClick={()=>setStageIndex(index)} key={stage}><span>{String(index+1).padStart(2,"0")}</span><strong>{stage}</strong></button>)}</div>
        <div className="business-demo__state" role="tabpanel" aria-live="polite"><div><span>VISIBLE SYSTEM STATE</span><strong>{stages[stageIndex]}</strong></div><p>{visibleValue}</p>{stages[stageIndex]==="Authority"&&(scenario.review&&!custom)&&<aside><span>AUTHORITY BOUNDARY</span><strong>Human review required</strong><p>The demonstration stops here. It does not execute the exception.</p></aside>}</div>
        <div className="business-demo__legend"><span>TRACEABLE</span><span>WORKSPACE-SCOPED BY DESIGN</span><span>AUTHORITY-AWARE</span><span>DEMONSTRATION</span></div>
      </div>
    </section>

    <section className="business-editorial"><div className="business-editorial__label">THE OPERATING GAP</div><div><h2>Traffic is not an outcome.</h2><p>A question goes unanswered. A form captures too little context. A useful enquiry reaches the wrong person. A consequential exception is handled without a visible boundary.</p><p><strong>Sometimes the problem is not demand. It is what happens next.</strong></p></div></section>
    <section className="business-split"><article><p className="eyebrow">NO WEBSITE?</p><h2>Start with the operating model.</h2><p>Define what customers ask, what qualifies, what the business knows, what policy allows, who owns the request, and what result should be recorded.</p><strong>Intent → qualification → knowledge → policy → authority → outcome</strong></article><article><p className="eyebrow">ALREADY HAVE A WEBSITE?</p><h2>Find where the journey breaks.</h2><p>Keep what works. Improve the point where context disappears, routing fails, policy becomes manual, or outcomes stop being measured.</p><strong>Visitor → interaction → governed action → human review → outcome</strong></article></section>
    <section className="business-cta"><p className="eyebrow">START WITH THE GAP</p><h2>Find where value is being lost.</h2><p>The assessment structures the journey for human review. It does not fabricate a diagnosis.</p><Link className="button" to="/assessment">Start with an assessment</Link></section>
  </main>;
}
