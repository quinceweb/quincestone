import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./intelligence-demo.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { ContentPage, type PageContent } from "./components/Page";
import { Home } from "./pages/Home";
import { FormPage } from "./pages/Forms";
import { Checkout } from "./pages/Checkout";

const DemoExperience = lazy(() => import("./pages/DemoExperience").then((module) => ({ default: module.DemoExperience })));
const DemoOperations = lazy(() => import("./pages/DemoOperations").then((module) => ({ default: module.DemoOperations })));

const pages: Record<string, PageContent> = {
  platform: { eyebrow: "THE PLATFORM", title: "An intelligence layer for digital operations.", intro: "Quincestone connects interaction, interpretation, business knowledge, deterministic policy, workflow, escalation, and operational visibility." },
  intelligence: { eyebrow: "INTELLIGENCE", title: "Interpret before you act.", intro: "Quincestone turns incoming interaction into structured intent, context, qualification, and a traceable next-action decision." },
  knowledge: { eyebrow: "KNOWLEDGE", title: "Approved knowledge at the point of interaction.", intro: "Structure service information, operating boundaries, and approved context so intelligence can work from what the business actually knows." },
  policies: { eyebrow: "POLICIES", title: "Policy is authority.", intro: "Define deterministic business rules that constrain what can happen, when it can happen, and when human review is required." },
  workflows: { eyebrow: "WORKFLOWS", title: "Route qualified interaction into governed work.", intro: "Move each qualified interaction into a defined workflow with ownership, escalation, review requirements, and controlled side effects." },
  escalations: { eyebrow: "ESCALATIONS", title: "Automation should know when to stop.", intro: "Surface ambiguous, sensitive, urgent, or policy-bound interactions for human judgment without losing the operational trace." },
  integrations: { eyebrow: "INTEGRATIONS", title: "Authorized systems at the edge of action.", intro: "Connect operational systems through controlled server-side workflows. Quincestone does not give the browser arbitrary authority." },
  "workflow-routing": { eyebrow: "WORKFLOW ROUTING", title: "Every interaction enters the right workflow.", intro: "Route qualified demand by explicit business rules, escalation thresholds, ownership, and review requirements." },
  "edge-experience": { eyebrow: "CAPABILITY 01", title: "Edge experience that understands context.", intro: "Move beyond static pages with responsive journeys governed by clear rules, consent, and accessible interaction design." },
  "ai-concierge": { eyebrow: "CAPABILITY 02", title: "Controlled AI, not uncontrolled conversation.", intro: "Use bounded assistance to clarify intent and summarize context while policy and people retain authority." },
  qualification: { eyebrow: "CAPABILITY 03", title: "Qualification that produces useful signals.", intro: "Collect only the information required to assess fit, urgency, service area, risk, and the correct next action." },
  operations: { eyebrow: "OPERATIONAL VISIBILITY", title: "See why the system acted.", intro: "Inspect classifications, policy decisions, workflow state, knowledge references, and human-review requirements." },
  demo: { eyebrow: "LIVE PRODUCT DEMONSTRATION", title: "Watch interaction become action.", intro: "Use a deterministic fictional roofing journey, then inspect how Quincestone explains and routes the interaction.", sections: [{ title: "Visitor experience", text: "Walk through intent, context, qualification, appointment, and confirmation." }, { title: "Operations console", text: "Search fictional records, inspect policy decisions, and advance a simulated workflow." }] },
  industries: { eyebrow: "SOLUTIONS", title: "Built for complex service journeys.", intro: "Quincestone is suited to organizations where intent, urgency, location, qualification, policy, and human judgment shape the next action." },
  "industries/roofing": { eyebrow: "INDUSTRY / ROOFING", title: "From urgent damage to the correct response.", intro: "Identify emergency context, service area, property details, safety concerns, and the right inspection workflow." },
  "industries/solar": { eyebrow: "INDUSTRY / SOLAR", title: "Qualify project context before the sales handoff.", intro: "Structure property, ownership, energy, readiness, and location signals into a coherent assessment path." },
  "industries/dental": { eyebrow: "INDUSTRY / DENTAL", title: "Route patient intent with care.", intro: "Separate routine, cosmetic, urgent, and administrative needs with privacy-aware boundaries and staff escalation." },
  "industries/professional-services": { eyebrow: "INDUSTRY / PROFESSIONAL SERVICES", title: "Turn ambiguous enquiries into structured briefs.", intro: "Clarify matter type, timing, jurisdiction, fit, and required human review before operational handoff." },
  process: { eyebrow: "IMPLEMENTATION PROCESS", title: "Diagnose. Design. Govern. Operate.", intro: "Each implementation begins with the real interaction journey, business knowledge, policy, systems, and human responsibilities." },
  about: { eyebrow: "ABOUT QUINCESTONE", title: "Intelligence between interaction and action.", intro: "Quincestone is edge intelligence infrastructure for modern business websites and applications. It is built by Quinceweb." },
};

function Legal({ type }: { type: string }) {
  return <section className="page-hero"><p className="eyebrow">LEGAL</p><h1>{type}</h1><p className="lede">This document is a production foundation and will be reviewed before public launch. Contact <a href="mailto:hello@quincestone.com">hello@quincestone.com</a> for questions.</p></section>;
}

export function App() {
  return <ErrorBoundary><Suspense fallback={<div className="loading" role="status">Loading…</div>}><Routes><Route element={<Layout />}>
    <Route index element={<Home />} />
    {Object.entries(pages).map(([path, content]) => <Route key={path} path={path} element={<ContentPage {...content} />} />)}
    <Route path="demo/experience" element={<DemoExperience />} /><Route path="demo/operations" element={<DemoOperations />} />
    <Route path="assessment" element={<FormPage kind="assessment_requests" />} /><Route path="apply" element={<FormPage kind="implementation_applications" />} /><Route path="contact" element={<FormPage kind="contact_messages" />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="privacy" element={<Legal type="Privacy notice" />} /><Route path="terms" element={<Legal type="Terms of use" />} /><Route path="cookies" element={<Legal type="Cookie notice" />} />
    <Route path="*" element={<section className="page-hero"><p className="eyebrow">404 / NOT FOUND</p><h1>This route is outside the map.</h1><p className="lede">Return to the platform or begin an edge assessment.</p><Link className="button" to="/">Return home</Link></section>} />
  </Route></Routes></Suspense></ErrorBoundary>;
}
