import { useEffect, lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./intelligence-demo.css";
import "./p3-marketing.css";
import "./commerce-product.css";
import "./shop-elite.css";
import "./legal.css";
import "./edge-assessment.css";
import "./business-page.css";
import "./home-architecture-refinement.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { ContentPage, type PageContent } from "./components/Page";
import { Home } from "./pages/Home";
import { ProductDiscovery } from "./pages/ProductDiscovery";
import { Pricing } from "./pages/Pricing";
import { Onboarding } from "./pages/Onboarding";
import { ShopCartExperience } from "./pages/ShopExperience";
import { ShopHomeEditorial, ShopStandardPage, ShopFieldNotesPage } from "./pages/ShopEditorialPages";
import { ShopEliteCollection, ShopEliteProduct, ShopEliteSearch, ShopEliteCompare } from "./pages/ShopElite";
import { ShopAccount } from "./pages/ShopAccount";
import { FormPage } from "./pages/Forms";
import { EdgeAssessment } from "./pages/EdgeAssessment";
import { BusinessPage } from "./pages/BusinessPage";
import { LegalPage, type LegalPageKind } from "./pages/LegalPage";

const DemoExperience = lazy(() => import("./pages/DemoExperience").then((module) => ({ default: module.DemoExperience })));
const DemoOperations = lazy(() => import("./pages/DemoOperations").then((module) => ({ default: module.DemoOperations })));

const pages: Record<string, PageContent> = {
  commerce: { eyebrow: "QUINCESTONE COMMERCE", title: "Better products. Better value. Built around the customer.", intro: "Commerce starts with demand, validation, sourcing, and learning—not a random catalog or a dropshipping identity." },
  platform: { eyebrow: "THE PLATFORM", title: "Demand in. Governed action out.", intro: "Quincestone connects public interaction, intelligence, policy, routing, human judgment, and outcomes into one operating path." },
  industries: { eyebrow: "INDUSTRIES", title: "The model adapts to the work.", intro: "The same operating discipline can support different customer journeys, operational boundaries, and commercial contexts." },
  workflows: { eyebrow: "WORKFLOWS", title: "Make important work move.", intro: "Structured workflows connect qualified demand to the next accountable action without hiding the boundary between automation and judgment." },
  operations: { eyebrow: "OPERATIONS", title: "Control what happens after the interaction.", intro: "Make work visible, governed, reviewable, and easier to improve from real outcomes." },
  knowledge: { eyebrow: "KNOWLEDGE", title: "Separate what is known from what is inferred.", intro: "Quincestone keeps observed facts, derived intelligence, business knowledge, and policy distinct so action remains traceable." },
  escalations: { eyebrow: "ESCALATIONS", title: "Automation should know when to stop.", intro: "Consequential, ambiguous, sensitive, or policy-bound work can stop at an explicit human review boundary." },
};

function App() {
  return <ErrorBoundary><Layout><Suspense fallback={<div className="page-loading" aria-label="Loading">Loading…</div>}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/assessment" element={<ProductDiscovery />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/onboarding" element={<Onboarding />} />
    <Route path="/commerce" element={<ContentPage {...pages.commerce} />} />
    <Route path="/platform" element={<ContentPage {...pages.platform} />} />
    <Route path="/industries" element={<ContentPage {...pages.industries} />} />
    <Route path="/workflows" element={<ContentPage {...pages.workflows} />} />
    <Route path="/operations" element={<ContentPage {...pages.operations} />} />
    <Route path="/knowledge" element={<ContentPage {...pages.knowledge} />} />
    <Route path="/escalations" element={<ContentPage {...pages.escalations} />} />
    <Route path="/business" element={<BusinessPage />} />
    <Route path="/edge" element={<EdgeAssessment />} />
    <Route path="/shop" element={<ShopHomeEditorial />} />
    <Route path="/products" element={<ShopEliteCollection />} />
    <Route path="/search" element={<ShopEliteSearch />} />
    <Route path="/compare" element={<ShopEliteCompare />} />
    <Route path="/bag" element={<ShopCartExperience />} />
    <Route path="/standard" element={<ShopStandardPage />} />
    <Route path="/field-notes" element={<ShopFieldNotesPage />} />
    <Route path="/account" element={<ShopAccount />} />
    <Route path="/demo/experience" element={<DemoExperience />} />
    <Route path="/demo/operations" element={<DemoOperations />} />
    <Route path="/demo" element={<ContentPage eyebrow="DEMO" title="See the system move." intro="Explore the operating model through controlled demonstrations." />} />
    <Route path="/contact" element={<FormPage />} />
    <Route path="/privacy" element={<LegalPage kind="privacy" />} />
    <Route path="/terms" element={<LegalPage kind="terms" />} />
    <Route path="/cookies" element={<LegalPage kind="cookies" />} />
    <Route path="/security" element={<LegalPage kind="security" />} />
    <Route path="*" element={<ContentPage eyebrow="QUINCESTONE" title="The page you requested is not available." intro="Return to the main path and choose the part of the system closest to your outcome." />} />
  </Routes></Suspense></ErrorBoundary>;
}

export default App;
