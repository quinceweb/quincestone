import { useEffect } from "react";
import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./intelligence-demo.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { ContentPage, type PageContent } from "./components/Page";
import { Home } from "./pages/Home";
import { ShopHome } from "./pages/ShopHome";
import { FormPage } from "./pages/Forms";

const DemoExperience = lazy(() => import("./pages/DemoExperience").then((module) => ({ default: module.DemoExperience })));
const DemoOperations = lazy(() => import("./pages/DemoOperations").then((module) => ({ default: module.DemoOperations })));

const pages: Record<string, PageContent> = {
  business: { eyebrow: "QUINCESTONE FOR BUSINESS", title: "Move business forward from the first customer interaction.", intro: "Assessment, structure, website, Edge, and operations form one governed path from demand to outcome." },
  commerce: { eyebrow: "QUINCESTONE COMMERCE", title: "Better products. Better value. Built around the customer.", intro: "Commerce starts with demand, validation, sourcing, and learning—not a random catalog or a dropshipping identity." },
  edge: { eyebrow: "QUINCESTONE EDGE", title: "The intelligence layer between customer demand and business operations.", intro: "Edge understands interaction, collects the right context, applies knowledge and policy, routes work, and preserves human review and outcome records." },
  platform: { eyebrow: "ONE QUINCESTONE", title: "Discover. Build. Operate. Scale.", intro: "Quincestone connects demand, experience, intelligence, transaction, operations, outcomes, learning, and scale without pretending every step should be automated." },
  intelligence: { eyebrow: "INTELLIGENCE", title: "Understand before you act.", intro: "Quincestone turns incoming interaction into structured intent, context, qualification, and a traceable next-action decision." },
  knowledge: { eyebrow: "KNOWLEDGE", title: "Approved knowledge at the point of interaction.", intro: "Structure approved business information and operating boundaries so intelligence works from what the business actually knows." },
  policies: { eyebrow: "POLICIES", title: "Policy is authority.", intro: "Explicit business rules define what the organization allows and where human review is required." },
  workflows: { eyebrow: "WORKFLOWS", title: "Route qualified demand into governed work.", intro: "Move qualified interaction into defined workflows with ownership, escalation, review requirements, and controlled side effects." },
  escalations: { eyebrow: "HUMAN REVIEW", title: "Automation should know when to stop.", intro: "Surface ambiguous, sensitive, urgent, or policy-bound interactions for human judgment without losing the operational trace." },
  integrations: { eyebrow: "INTEGRATIONS", title: "Authority stays behind the boundary.", intro: "Operational systems connect through controlled server-side workflows. Browser code never receives arbitrary provider authority." },
  "workflow-routing": { eyebrow: "WORKFLOW ROUTING", title: "Every interaction enters the right workflow.", intro: "Route qualified demand by explicit business rules, ownership, escalation thresholds, and review requirements." },
  qualification: { eyebrow: "QUALIFICATION", title: "Collect only what the decision needs.", intro: "Structure fit, urgency, service area, risk, and customer context without collecting unnecessary information." },
  operations: { eyebrow: "OPERATIONS", title: "See why the system acted.", intro: "Inspect classifications, policy decisions, workflow state, knowledge references, and human-review requirements." },
  industries: { eyebrow: "SOLUTIONS", title: "Built for complex customer journeys.", intro: "Quincestone is suited to organizations where intent, urgency, location, qualification, policy, and human judgment shape the next action." },
  "industries/roofing": { eyebrow: "DEMONSTRATION / ROOFING", title: "From urgent damage to the correct response.", intro: "Northstone Roofing is fictional demonstration content, not customer evidence." },
  "industries/solar": { eyebrow: "DEMONSTRATION / SOLAR", title: "Qualify project context before the handoff.", intro: "A structured example of property, ownership, energy, readiness, and location signals." },
  "industries/dental": { eyebrow: "DEMONSTRATION / DENTAL", title: "Route patient intent with care.", intro: "A conceptual example of separating routine, urgent, cosmetic, and administrative needs." },
  "industries/professional-services": { eyebrow: "DEMONSTRATION / PROFESSIONAL SERVICES", title: "Turn ambiguous enquiries into structured briefs.", intro: "A conceptual example of clarifying matter type, timing, jurisdiction, fit, and human review." },
  process: { eyebrow: "IMPLEMENTATION", title: "Diagnose. Design. Govern. Operate.", intro: "Each implementation begins with the real interaction journey, business knowledge, policy, systems, and human responsibilities." },
  about: { eyebrow: "ABOUT QUINCESTONE", title: "One company. One operating model.", intro: "Quincestone is a commerce and operating-systems company that turns customer demand into products, experiences, and operational outcomes." },
};

function Legal({ type }: { type: string }) {
  return <section className="page-hero"><p className="eyebrow">LEGAL</p><h1>{type}</h1><p className="lede">This document is a production foundation and will be reviewed before public launch. Contact <a href="mailto:hello@quincestone.com">hello@quincestone.com</a> for questions.</p></section>;
}

function PublicRoot() {
  useEffect(() => {
    const isShop = window.location.hostname.toLowerCase().startsWith("shop.");
    document.title = isShop ? "Shop — Quincestone" : "Quincestone — Turn demand into outcomes.";
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = isShop ? "https://shop.quincestone.com/" : "https://www.quincestone.com/";
  }, []);
  return window.location.hostname.toLowerCase().startsWith("shop.") ? <ShopHome /> : <Home />;
}

export function App() {
  return <ErrorBoundary><Suspense fallback={<div className="loading" role="status">Loading…</div>}><Routes><Route element={<Layout />}><Route index element={<PublicRoot />} />{Object.entries(pages).map(([path, content]) => <Route key={path} path={path} element={<ContentPage {...content} />} />)}<Route path="shop" element={<ShopHome />} /><Route path="demo/experience" element={<DemoExperience />} /><Route path="demo/operations" element={<DemoOperations />} /><Route path="assessment" element={<FormPage kind="assessment_requests" />} /><Route path="apply" element={<FormPage kind="implementation_applications" />} /><Route path="contact" element={<FormPage kind="contact_messages" />} /><Route path="privacy" element={<Legal type="Privacy notice" />} /><Route path="terms" element={<Legal type="Terms of use" />} /><Route path="cookies" element={<Legal type="Cookie notice" />} /><Route path="*" element={<section className="page-hero"><p className="eyebrow">404 / NOT FOUND</p><h1>This route is outside the map.</h1><p className="lede">Return to Quincestone or start an assessment.</p><Link className="button" to="/">Return home</Link></section>} /></Route></Routes></Suspense></ErrorBoundary>;
}
