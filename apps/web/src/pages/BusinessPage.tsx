import { Link } from "react-router-dom";

const steps = [
  ["01", "Interaction", "Someone arrives, asks, enquires, calls, submits, or starts a conversation."],
  ["02", "Understand", "Edge identifies what the person is actually trying to accomplish."],
  ["03", "Qualify", "The right context is collected for the decision the business needs to make."],
  ["04", "Knowledge", "Approved business knowledge answers what can be answered accurately."],
  ["05", "Policy", "Business rules define what can happen and where authority is required."],
  ["06", "Route", "Qualified demand reaches the right workflow, team, system, or next action."],
  ["07", "Review", "When consequence or ambiguity matters, Edge stops and preserves human judgment."],
  ["08", "Outcome", "The result is recorded so the business can understand what happened."],
];

export function BusinessPage() {
  return <main className="business-page">
    <section className="business-hero"><p className="eyebrow">QUINCESTONE FOR BUSINESS</p><h1>Your website should do more than receive people.</h1><p className="lede">A website can look finished and still lose the business behind every visit. Quincestone turns the public front door into an operating path: understand the request, collect the right context, apply knowledge and policy, route work, and preserve the human decision when it matters.</p><div className="actions"><Link className="button" to="/assessment">Start an Edge assessment →</Link><Link className="text-link" to="/edge">Explore Quincestone Edge →</Link></div></section>
    <section className="business-editorial"><div className="business-editorial__label">THE PROBLEM</div><div><h2>Traffic is not revenue.</h2><p>You may already be paying for search, referrals, social, advertising, partnerships, or word of mouth. Between interest and outcome, opportunities disappear: a question goes unanswered, a form captures too little context, a good enquiry reaches the wrong person, or a serious request waits until tomorrow.</p><p><strong>Sometimes you do not need more demand. You need to stop losing the demand you already have.</strong></p></div></section>
    <section className="business-flow"><div className="business-flow__head"><p className="eyebrow">FROM INTERACTION TO OUTCOME</p><h2>The front door should know what happens next.</h2></div><div className="business-flow__grid">{steps.map(([number,title,text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="business-split"><article><p className="eyebrow">NO WEBSITE?</p><h2>Start with the operating model.</h2><p>You do not need years of digital infrastructure to begin. Quincestone starts with what customers ask, what qualifies, what matters, what the business knows, what policy allows, who owns the request, and what should happen next.</p><strong>Customer intent → understanding → qualification → knowledge → policy → workflow → human judgment → outcome</strong></article><article><p className="eyebrow">ALREADY HAVE A WEBSITE?</p><h2>Find where the journey breaks.</h2><p>Keep what works. Restructure what does not. Edge connects the existing website, forms, commerce, calendar, knowledge, and operational tools into a deliberate path.</p><strong>Visitor → Edge → understand → qualify → route → review → business system → outcome</strong></article></section>
    <section className="business-edge"><p className="eyebrow">QUINCESTONE EDGE</p><h2>The intelligence layer between the customer and the business.</h2><p>Edge structures incoming demand, understands context, uses approved knowledge, applies policy, qualifies requests, routes work, and preserves the point where human judgment is required.</p><div className="business-edge__example"><span>CUSTOMER</span><strong>“I need help with a roof repair.”</strong><div>↓ Edge understands<br/>↓ collects context<br/>↓ checks approved knowledge<br/>↓ applies policy<br/>↓ determines workflow<br/>↓ routes qualified request<br/>↓ requests human review where required</div><span>BUSINESS</span><strong>Receives a structured opportunity.</strong></div></section>
    <section className="business-cta"><p className="eyebrow">START WITH THE GAP</p><h2>Do not guess where the journey is leaking value.</h2><p>Let Edge structure the assessment. Then let a human review the recommendation before anything consequential happens.</p><Link className="button" to="/assessment">Start an Edge assessment →</Link></section>
  </main>;
}
