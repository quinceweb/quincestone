import { useEffect, lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import "./intelligence-demo.css";
import "./p3-marketing.css";
import "./commerce-product.css";
import "./shop-elite.css";
import "./legal.css";
import "./edge-assessment.css";
import "./business-page.css";
import "./home-architecture-refinement.css";
import "./corporate-pillars.css";
import "./corporate-details.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { ContentPage, type PageContent } from "./components/Page";
import { Home } from "./pages/Home";
import { ProductDiscovery } from "./pages/ProductDiscovery";
import { Pricing } from "./pages/Pricing";
import { Onboarding } from "./pages/Onboarding";
import { ShopCartExperience } from "./pages/ShopExperience";
import { ShopHomeEditorial, ShopStandardPage, ShopFieldNotesPage } from "./pages/ShopEditorialPages";
import { ShopEliteCollection, ShopEliteProduct, ShopEliteSearch, ShopEliteCompare, ShopBuildSetup } from "./pages/ShopElite";
import { FormPage } from "./pages/Forms";
import { EdgeAssessment } from "./pages/EdgeAssessment";
import { BusinessPage } from "./pages/BusinessPage";
import { LegalPage, type LegalPageKind } from "./pages/LegalPage";
import { CorporatePillarPage } from "./pages/CorporatePillars";
import { AboutPage, CommercePage, EdgePage } from "./pages/CorporateDetails";

const DemoExperience = lazy(() => import("./pages/DemoExperience").then((module) => ({ default: module.DemoExperience })));
const DemoOperations = lazy(() => import("./pages/DemoOperations").then((module) => ({ default: module.DemoOperations })));

const pages: Record<string, PageContent> = {
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
  about: { eyebrow: "ABOUT QUINCESTONE", title: "One company. One operating model.", intro: "Quincestone is a commerce and product-development company that discovers, develops and operates high-quality consumer products through intelligent sourcing, premium commerce, disciplined economics and professional fulfillment." },
};

function setMeta(name: string, content: string) { const node = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`); if (node) node.content = content; }
function setProperty(property: string, content: string) { const node = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`); if (node) node.content = content; }

function PublicRoot() {
  useEffect(() => {
    const isShop = window.location.hostname.toLowerCase() === "shop.quincestone.com";
    const title = isShop ? "Quincestone Shop — Products that earn their place." : "Quincestone — Turn demand into outcomes.";
    const description = isShop ? "A deliberately considered collection of useful products for how you work, move, live and create." : "Quincestone is a commerce and product-development company that discovers, develops and operates high-quality consumer products through intelligent sourcing, premium commerce, disciplined economics and professional fulfillment.";
    const url = isShop ? "https://shop.quincestone.com/" : "https://www.quincestone.com/";
    document.title = title;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]'); if (canonical) canonical.href = url;
    setMeta("description", description); setProperty("og:title", title); setProperty("og:description", description); setProperty("og:url", url); setProperty("og:image", `${url}og/quincestone.png`); setProperty("og:image:alt", title); setMeta("twitter:title", title); setMeta("twitter:description", description); setMeta("twitter:image", `${url}og/quincestone.png`);
  }, []);
  return window.location.hostname.toLowerCase() === "shop.quincestone.com" ? <ShopHomeEditorial /> : <><Home /><MarketingPath /></>;
}

function MarketingPath() {
  const steps = [["01", "Discover", "You know something needs to change. Find the highest-value opportunity, understand the gap, and leave with a clear next move.", "/assessment", "Find the next move"], ["02", "Build", "You need the system that turns demand into something useful. Build the business, commerce, or digital foundation required to capture and convert demand.", "/business", "Build the foundation"], ["03", "Operate", "The work exists. The system needs to perform. Connect interaction, intelligence, policy, routing, workflows, and human judgment with control.", "/edge", "Put the system to work"], ["04", "Scale", "Something works. Now make it compound. Turn outcomes into learning, improve the operating system, and expand what is proving valuable.", "/operations", "Scale what works"]];
  return <><section className="qs-marketing-path"><div className="qs-marketing-path__intro"><div><p className="eyebrow">WHERE TO START</p><h2>Start with the outcome. We’ll connect the system underneath.</h2></div><p>Four ways in. One operating model. Choose the point where the value is most immediate—you do not need to understand the whole architecture before taking the first step.</p></div><div className="qs-marketing-path__steps">{steps.map(([number,title,text,href,cta]) => <article className="qs-marketing-path__step" key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div><Link className="text-link qs-marketing-path__link" to={href}>{cta} →</Link></article>)}</div><div className="qs-marketing-path__model"><span>ONE MODEL</span><strong>Four entry points.</strong><p>You don't need to know which system you need. Start with the outcome. Quincestone connects the pieces underneath.</p></div></section><section className="qs-marketing-cta"><div className="qs-marketing-cta__inner"><div><p className="eyebrow">START WHERE THE VALUE IS</p><h2>Bring us the journey that is not working well enough.</h2><p>We will help identify the intelligence gap, the operating boundary, and the next practical move.</p></div><div className="actions"><Link className="button" to="/assessment">Start an assessment</Link><Link className="text-link" to="/demo/experience">See the demonstration →</Link></div></div></section></>;
}

function ShopWorldRoute() {
  const { world } = useParams();
  return <ShopEliteCollection collection={world} />;
}

function QuincestoneAccountRedirect() {
  useEffect(() => { window.location.assign("https://account.quincestone.com"); }, []);
  return <section className="page-hero"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>Your account continues in one place.</h1><p className="lede">Orders, saved items, preferences, addresses and security belong to Quincestone Account.</p><a className="button" href="https://account.quincestone.com">Continue to Account →</a></section>;
}

export function App() {
  return <ErrorBoundary><Suspense fallback={<div className="loading" role="status">Loading…</div>}><Routes><Route element={<Layout />}><Route index element={<PublicRoot />} /><Route path="discover" element={<CorporatePillarPage pillar="discover" />} /><Route path="build" element={<CorporatePillarPage pillar="build" />} /><Route path="operate" element={<CorporatePillarPage pillar="operate" />} /><Route path="scale" element={<CorporatePillarPage pillar="scale" />} /><Route path="edge" element={<EdgePage />} /><Route path="commerce" element={<CommercePage />} /><Route path="about" element={<AboutPage />} /><Route path="product-discovery" element={<ProductDiscovery />} /><Route path="pricing" element={<Pricing />} /><Route path="onboarding" element={<Onboarding />} /><Route path="business" element={<BusinessPage />} /><Route path="assessment" element={<EdgeAssessment />} />{Object.entries(pages).filter(([path]) => !["edge", "commerce", "about"].includes(path)).map(([path, content]) => <Route key={path} path={path} element={<ContentPage {...content} />} />)}
    <Route path="shop" element={<ShopHomeEditorial />} />
    <Route path="shop/discover" element={<Navigate to="/" replace />} />
    <Route path="shop/featured" element={<Navigate to="/products" replace />} />
    <Route path="shop/new" element={<Navigate to="/products" replace />} />
    <Route path="shop/collections" element={<Navigate to="/products" replace />} />
    <Route path="shop/field-notes" element={<ShopFieldNotesPage />} />
    <Route path="field-notes" element={<ShopFieldNotesPage />} />
    <Route path="shop/products" element={<ShopEliteCollection collection="products" />} />
    <Route path="world/:world" element={<ShopWorldRoute />} />
    <Route path="shop/world/:world" element={<ShopWorldRoute />} />
    <Route path="travel" element={<Navigate to="/world/travel" replace />} />
    <Route path="drive" element={<Navigate to="/world/drive-mobility" replace />} />
    <Route path="companion" element={<Navigate to="/world/pets-companion" replace />} />
    <Route path="home-outdoor" element={<Navigate to="/world/outdoor-everyday-carry" replace />} />
    <Route path="products" element={<ShopEliteCollection collection="products" />} />
    <Route path="product/:slug" element={<ShopEliteProduct />} />
    <Route path="shop/product/:slug" element={<ShopEliteProduct />} />
    <Route path="search" element={<ShopEliteSearch />} />
    <Route path="compare" element={<ShopEliteCompare />} />
    <Route path="build-my-setup" element={<ShopBuildSetup />} />
    <Route path="bag" element={<ShopCartExperience />} />
    <Route path="shop/cart" element={<ShopCartExperience />} />
    <Route path="checkout" element={<ShopCartExperience />} />
    <Route path="shop/checkout" element={<ShopCartExperience />} />
    <Route path="standard" element={<ShopStandardPage />} />
    <Route path="shipping" element={<ContentPage eyebrow="SHIPPING" title="Delivery should be evidence-led." intro="Shipping availability and timing are shown from fulfillment information. When it is unknown, Quincestone does not invent a promise." />} />
    <Route path="returns" element={<ContentPage eyebrow="RETURNS" title="A clear return path is part of the product." intro="Returns are governed by the actual product policy and recorded commerce state." />} />
    <Route path="support" element={<ContentPage eyebrow="SUPPORT" title="Help should remain close to the transaction." intro="Quincestone support connects the customer question to the order and product context required to resolve it." />} />
    <Route path="account/*" element={<QuincestoneAccountRedirect />} />
    <Route path="demo" element={<Navigate to="/demo/experience" replace />} /><Route path="demo/experience" element={<DemoExperience />} /><Route path="demo/operations" element={<DemoOperations />} /><Route path="apply" element={<FormPage kind="implementation_applications" />} /><Route path="contact" element={<FormPage kind="contact_messages" />} />{(["privacy", "terms", "cookies", "security"] as LegalPageKind[]).map((kind) => <Route key={kind} path={kind} element={<LegalPage kind={kind} />} />)}<Route path="*" element={<section className="page-hero"><p className="eyebrow">404 / NOT FOUND</p><h1>This route is outside the map.</h1><p className="lede">Return to Quincestone or start an assessment.</p><Link className="button" to="/">Return home</Link></section>} /></Route></Routes></Suspense></ErrorBoundary>;
}
