import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applySeo } from "../seo";

export function DealsPage() {
  useEffect(() => applySeo({ title: "Quincestone Deals — Structured negotiated commerce", description: "Structured commerce for qualified transactions that cannot be reduced to Add to Cart.", path: "/deals" }), []);
  return <main className="detail-page detail-page--about">
    <section className="detail-hero"><p className="eyebrow">QUINCESTONE DEALS</p><h1>Structured commerce for transactions that cannot be reduced to Add to Cart.</h1><p>Deals provides a dedicated path for qualified opportunities, counterparties, requirements, proposals, commercial terms, revisions, approvals, evidence, milestones and authorized acceptance.</p><div className="actions"><a className="button" href="https://quincestonedeals.app">Enter Deals</a><Link className="text-link" to="/commerce">Compare fixed-price commerce →</Link></div></section>
    <section className="belief-grid"><article><span>01</span><h2>Qualify</h2><p>Establish the opportunity, requirements and participating roles before negotiation begins.</p></article><article><span>02</span><h2>Develop terms</h2><p>Keep proposals, revisions and commercial terms visible as the transaction progresses.</p></article><article><span>03</span><h2>Authorize</h2><p>Approval and acceptance remain explicit authority events rather than implied UI state.</p></article><article><span>04</span><h2>Trace</h2><p>Milestones, evidence and deal state preserve an auditable commercial record.</p></article></section>
    <section className="detail-rule"><p className="eyebrow">COMMERCE BOUNDARY</p><h2>Shop owns published-price commerce. Deals owns negotiated commerce. Corporate explains both; it operates neither transaction flow.</h2></section>
  </main>;
}

export function ResearchPage() {
  useEffect(() => applySeo({ title: "Quincestone Research — Operating and product intelligence", description: "Field notes and technical thinking from Quincestone on demand, governed intelligence, commerce and operating systems.", path: "/research" }), []);
  return <main className="detail-page detail-page--about">
    <section className="detail-hero"><p className="eyebrow">QUINCESTONE RESEARCH</p><h1>Evidence before assertion.</h1><p>Research is the public home for field notes, operating insights, product intelligence and technical thinking. Publication remains intentionally selective until material is ready to support a claim.</p></section>
    <section className="belief-grid"><article><span>01</span><h2>Field notes</h2><p>Observed operating patterns and questions worth investigating.</p></article><article><span>02</span><h2>Operating insights</h2><p>How qualification, ownership, authority and outcomes shape useful systems.</p></article><article><span>03</span><h2>Product intelligence</h2><p>Evidence-led thinking about products, suppliers and commercial fit without invented verification.</p></article><article><span>04</span><h2>Technical thinking</h2><p>Architecture, security and system-design reasoning grounded in implemented truth.</p></article></section>
    <section className="detail-rule"><p className="eyebrow">PUBLICATION STATE</p><h2>No article library is represented as live until editorial material is actually published.</h2></section>
  </main>;
}

export function CareersPage() {
  useEffect(() => applySeo({ title: "Quincestone Careers — Build governed systems", description: "Careers and future opportunities at Quincestone.", path: "/careers" }), []);
  return <main className="detail-page detail-page--about">
    <section className="detail-hero"><p className="eyebrow">CAREERS</p><h1>Build systems that know the difference between intelligence and authority.</h1><p>Quincestone is building across product, commerce, operations and governed intelligence. No open role is represented here unless a real position has been approved for publication.</p></section>
    <section className="detail-rule"><p className="eyebrow">CURRENT STATE</p><h2>No public openings are currently published.</h2><p>Future opportunities will appear here only when role scope, location, employment terms and application handling are ready.</p></section>
    <section className="detail-cta"><h2>Company enquiries belong in the institutional channel.</h2><Link className="button" to="/contact">Contact Quincestone</Link></section>
  </main>;
}
