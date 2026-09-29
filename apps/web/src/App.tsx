import { useEffect, lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import "./intelligence-demo.css";
import "./p3-marketing.css";
import "./legal.css";
import "./edge-assessment.css";
import "./assessment-intro.css";
import "./business-page.css";
import "./home-architecture-refinement.css";
import "./corporate-pillars.css";
import "./corporate-details.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { ContentPage, type PageContent } from "./components/Page";
import { Home } from "./pages/Home";

const ProductDiscovery = lazy(() => import("./pages/ProductDiscovery").then((module) => ({ default: module.ProductDiscovery })));
const Pricing = lazy(() => import("./pages/Pricing").then((module) => ({ default: module.Pricing })));
const Onboarding = lazy(() => import("./pages/Onboarding").then((module) => ({ default: module.Onboarding })));
const FormPage = lazy(() => import("./pages/Forms").then((module) => ({ default: module.FormPage })));
const EdgeAssessment = lazy(() => import("./pages/EdgeAssessment").then((module) => ({ default: module.EdgeAssessment })));
const BusinessPage = lazy(() => import("./pages/BusinessPage").then((module) => ({ default: module.BusinessPage })));
const LegalPage = lazy(() => import("./pages/LegalPage").then((module) => ({ default: module.LegalPage })));
const CorporatePillarPage = lazy(() => import("./pages/CorporatePillars").then((module) => ({ default: module.CorporatePillarPage })));
const AboutPage = lazy(() => import("./pages/CorporateDetails").then((module) => ({ default: module.AboutPage })));
const DealsPage = lazy(() => import("./pages/EcosystemPages").then((module) => ({ default: module.DealsPage })));
const ResearchPage = lazy(() => import("./pages/EcosystemPages").then((module) => ({ default: module.ResearchPage })));
const CareersPage = lazy(() => import("./pages/EcosystemPages").then((module) => ({ default: module.CareersPage })));
const CommercePage = lazy(() => import("./pages/CorporateDetails").then((module) => ({ default: module.CommercePage })));
const EdgePage = lazy(() => import("./pages/CorporateDetails").then((module) => ({ default: module.EdgePage })));
const DemoExperience = lazy(() => import("./pages/DemoExperience").then((module) => ({ default: module.DemoExperience })));
const DemoOperations = lazy(() => import("./pages/DemoOperations").then((module) => ({ default: module.DemoOperations })));

const pages: Record<string, PageContent> = {
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
};

function setMeta(name: string, content: string) { const node = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`); if (node) node.content = content; }
function setProperty(property: string, content: string) { const node = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`); if (node) node.content = content; }

function PublicRoot() {
  useEffect(() => {
    const title = "Quincestone — Turn demand into outcomes.";
    const description = "Quincestone understands demand, builds the experience around it, and operates governed systems that move work toward valuable outcomes.";
    const url = "https://www.quincestone.com/";
    document.title = title;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]'); if (canonical) canonical.href = url;
    setMeta("description", description); setProperty("og:title", title); setProperty("og:description", description); setProperty("og:url", url); setProperty("og:image", `${url}og/quincestone.png`); setProperty("og:image:alt", title); setMeta("twitter:title", title); setMeta("twitter:description", description); setMeta("twitter:image", `${url}og/quincestone.png`);
  }, []);
  return <Home />;
}

export function App() {
  return <ErrorBoundary><Suspense fallback={<div className="loading" role="status">Loading…</div>}><Routes><Route element={<Layout />}><Route index element={<PublicRoot />} /><Route path="discover" element={<CorporatePillarPage pillar="discover" />} /><Route path="build" element={<CorporatePillarPage pillar="build" />} /><Route path="operate" element={<CorporatePillarPage pillar="operate" />} /><Route path="scale" element={<CorporatePillarPage pillar="scale" />} /><Route path="edge" element={<EdgePage />} /><Route path="commerce" element={<CommercePage />} /><Route path="about" element={<AboutPage />} /><Route path="deals" element={<DealsPage />} /><Route path="research" element={<ResearchPage />} /><Route path="careers" element={<CareersPage />} /><Route path="product-discovery" element={<ProductDiscovery />} /><Route path="pricing" element={<Pricing />} /><Route path="onboarding" element={<Onboarding />} /><Route path="business" element={<BusinessPage />} /><Route path="accessibility" element={<main className="detail-page detail-page--about"><section className="detail-hero"><p className="eyebrow">ACCESSIBILITY</p><h1>Quincestone is built to be usable.</h1><p>We design the Corporate experience for keyboard navigation, readable structure, responsive layouts, reduced motion preferences, visible focus and semantic interaction. Accessibility is part of product quality, not a separate visual mode.</p><div className="actions"><Link className="button" to="/contact">Report an accessibility issue</Link></div></section><section className="belief-grid"><article><span>01</span><h2>Keyboard</h2><p>Core navigation and actions are designed to remain reachable without a pointer.</p></article><article><span>02</span><h2>Structure</h2><p>Headings, landmarks and controls are authored to communicate hierarchy to assistive technology.</p></article><article><span>03</span><h2>Motion</h2><p>Reduced-motion preferences are respected where motion is not essential to understanding.</p></article><article><span>04</span><h2>Feedback</h2><p>If something prevents access, contact Quincestone with the page, task and assistive technology involved.</p></article></section></main>} /><Route path="assessment" element={<EdgeAssessment />} />{Object.entries(pages).map(([path, content]) => <Route key={path} path={path} element={<ContentPage {...content} />} />)}
    <Route path="demo" element={<Navigate to="/demo/experience" replace />} /><Route path="demo/experience" element={<DemoExperience />} /><Route path="demo/operations" element={<DemoOperations />} /><Route path="apply" element={<FormPage kind="implementation_applications" />} /><Route path="contact" element={<FormPage kind="contact_messages" />} />{(["privacy", "terms", "cookies", "security"] as const).map((kind) => <Route key={kind} path={kind} element={<LegalPage kind={kind} />} />)}<Route path="*" element={<main className="page-hero"><p className="eyebrow">404 / NOT FOUND</p><h1>This route is outside the map.</h1><p className="lede">Return to Quincestone or start an assessment.</p><Link className="button" to="/">Return home</Link></main>} /></Route></Routes></Suspense></ErrorBoundary>;
}
