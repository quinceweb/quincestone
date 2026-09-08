import { useEffect } from "react";
import { Link } from "react-router-dom";

export type LegalPageKind = "privacy" | "terms" | "cookies" | "security";

type Section = { id: string; title: string; paragraphs?: string[]; bullets?: string[] };

type LegalDocument = {
  eyebrow: string;
  title: string;
  lead: string;
  sections: Section[];
};

const updated = "September 8, 2026";
const contactHref = "mailto:hello@quincestone.com";

const documents: Record<LegalPageKind, LegalDocument> = {
  privacy: {
    eyebrow: "PRIVACY",
    title: "Privacy Policy",
    lead: "Quincestone respects the privacy of people who visit our websites, use our applications, submit information through our forms, interact with demonstrations, or communicate with us. This Privacy Policy explains the information Quincestone may process, why it is processed, how it may be shared with service providers, and choices that may be available to you.",
    sections: [
      { id: "scope", title: "1. Scope", paragraphs: ["This Policy applies to information processed through Quincestone's public websites and marketing experiences, authenticated applications, forms, product assessments, demonstrations, integrations, and direct communications. It does not replace terms or privacy notices maintained by third-party services that you access through Quincestone."] },
      { id: "information-we-collect", title: "2. Information We Collect", paragraphs: ["The information Quincestone processes depends on how you interact with the service. We aim to collect information that is relevant to providing, securing, and improving the service rather than collecting information without a defined operational purpose."] },
      { id: "information-you-provide", title: "3. Information You Provide", bullets: ["Name and email address.", "Assessment responses, contact messages, and other form submissions.", "Business name, profile information, service areas, hours, services, and operating preferences.", "Information you provide when configuring workflows, knowledge, policies, or integrations.", "Information included in authorized customer or business interactions."] },
      { id: "automatic", title: "4. Information Collected Automatically", paragraphs: ["Quincestone may process technical and request metadata needed to operate and protect the service, such as IP-related security signals, browser or device information, timestamps, diagnostic information, and security or request logs. We do not describe advertising or invasive tracking here unless those technologies are actually enabled."] },
      { id: "authentication", title: "5. Authentication and Account Data", paragraphs: ["The authenticated application uses session and authentication infrastructure to identify authorized users. The current architecture uses Supabase-based authentication and server-side authorization. Account information may include your name, email address, authentication identifiers, workspace membership, and account status. Authentication identifies a principal; protected application actions are still subject to server-side authorization and workspace boundaries."] },
      { id: "business-data", title: "6. Business and Workspace Data", paragraphs: ["If you use an authenticated Quincestone workspace, we may process business information and configuration needed to provide the service, including workspace membership, business profile information, knowledge, policies, workflow configuration, integration records, interactions, operational traces, human-review records, and outcome or event records. Access is intended to remain scoped to the relevant workspace and authorized roles."] },
      { id: "demo", title: "7. Demonstration Data", paragraphs: ["Northstone Roofing is fictional demonstration content. Public demo routes are designed to show how governed intelligence can interpret an interaction and produce a structured trace. Demo routes do not create real Calendar events, payments, CRM records, production workflows, or external messages. Demo text may be processed by the demonstration runtime and may be retained temporarily where necessary for runtime, security, or diagnostic purposes; it must not be treated as real customer activity."] },
      { id: "payments", title: "8. Payment Information", paragraphs: ["Quincestone may receive limited transaction-related information from Stripe, such as payment status and transaction references, when you use Stripe-hosted checkout for an assessment or other paid service. Payment-card details entered into Stripe-hosted checkout are handled by Stripe according to Stripe's own terms and privacy practices. Quincestone does not represent that it stores complete card numbers."] },
      { id: "calendar", title: "9. Calendar and Integration Data", paragraphs: ["Where calendar functionality is enabled and authorized, Quincestone may process information required to check availability, create approved appointments, update or cancel appointments, and maintain integration records. Calendar actions are governed by the configured workflow and authorization boundary; public demonstration activity does not create real Calendar events."] },
      { id: "use", title: "10. How We Use Information", bullets: ["Provide and operate Quincestone.", "Authenticate users and operate workspace access.", "Process assessments and respond to inquiries.", "Execute authorized workflows and maintain operational records.", "Maintain security, prevent abuse, and investigate or diagnose errors.", "Improve product reliability and service operation.", "Comply with applicable legal obligations and enforce agreements."] },
      { id: "basis", title: "11. Legal / Operational Basis for Processing", paragraphs: ["Depending on the jurisdiction and context, Quincestone may process information because it is necessary to provide a requested service or perform an agreement, because it supports legitimate operational or security interests, because consent has been provided where required, or because processing is necessary to comply with law. The applicable basis depends on the facts and the law governing the particular processing activity."] },
      { id: "providers", title: "12. Service Providers", paragraphs: ["Quincestone may use authorized providers for hosting, database and authentication, payments, calendar integrations, email, security, and other infrastructure. Providers may include Vercel, Supabase, Stripe, Google, and other providers relevant to a configured service. Those providers operate under their own terms and privacy or security programs; Quincestone does not transfer their certifications or representations to itself."] },
      { id: "retention", title: "13. Data Retention", paragraphs: ["Quincestone retains information for as long as reasonably necessary to provide the service, maintain security and operational records, satisfy legal obligations, resolve disputes, and enforce agreements. Where practical and appropriate, information may be deleted or de-identified when it is no longer needed. Specific retention can vary by data type, product, workspace configuration, and legal requirement."] },
      { id: "security", title: "14. Data Security", paragraphs: ["Quincestone uses technical and organizational controls intended to protect information, including server-side authorization, workspace-scoped access controls, row-level authorization where applicable, separation of private provider credentials from browser code, and governed paths for external side effects. No method of transmission or storage can be represented as completely risk-free."] },
      { id: "cookies", title: "15. Cookies and Similar Technologies", paragraphs: ["Quincestone may use essential cookies, local storage, or similar browser technologies for authentication, session continuity, security, navigation, preferences, and abuse prevention. See the Cookie Policy for the current operational description. Analytics or advertising technologies are not described as active unless they are actually implemented."] },
      { id: "international", title: "16. International Processing", paragraphs: ["Quincestone may use service providers and infrastructure that process information in countries other than the country in which you live or operate. The locations and transfer mechanisms can vary by provider and service configuration. Where applicable law requires safeguards for international transfers, Quincestone intends to use the safeguards required for the relevant processing."] },
      { id: "rights", title: "17. User Rights and Choices", paragraphs: ["Depending on your location and applicable law, you may have rights to request access to, correction of, deletion of, restriction of, or portability of personal information, to object to certain processing, or to withdraw consent where processing relies on consent. Rights vary by jurisdiction and may be subject to legal exceptions. Contact us to make a request or ask about the rights that apply to you."] },
      { id: "children", title: "18. Children's Privacy", paragraphs: ["Quincestone is designed for businesses and professional users and is not intentionally directed to children. We do not knowingly design the service as a child-directed product."] },
      { id: "changes", title: "19. Changes to This Policy", paragraphs: ["We may update this Policy when our services, data practices, legal requirements, or security practices change. The effective and last-updated date on this page identifies the current version."] },
      { id: "contact", title: "20. Contact", paragraphs: ["For privacy questions or requests, contact Quincestone through hello@quincestone.com. Please do not send passwords, payment-card numbers, API keys, or other sensitive credentials through ordinary email."] },
    ],
  },
  terms: {
    eyebrow: "TERMS",
    title: "Terms of Use",
    lead: "These Terms of Use describe the rules that apply when you access or use Quincestone websites, applications, demonstrations, assessments, and related services. They are written for the current product model and are not a substitute for jurisdiction-specific legal advice.",
    sections: [
      { id: "acceptance", title: "1. Acceptance of Terms", paragraphs: ["By accessing or using Quincestone, you agree to these Terms and any product-specific terms presented to you. If you use Quincestone on behalf of a business, you represent that you have authority to bind that organization to the applicable terms."] },
      { id: "eligibility", title: "2. Eligibility", paragraphs: ["Quincestone is designed for businesses and professional users. You must be legally able to enter into the applicable agreement and must not use the service where doing so would violate applicable law."] },
      { id: "services", title: "3. Quincestone Services", paragraphs: ["Quincestone provides software and infrastructure designed to help businesses interpret incoming interactions, apply business knowledge and policy, route workflows, and preserve human review where required. Features vary by product, plan, workspace configuration, and integration state."] },
      { id: "accounts", title: "4. Accounts", paragraphs: ["You are responsible for maintaining the confidentiality of account credentials and for activity performed through your account, subject to applicable law. You must provide information that is accurate enough for the service to operate and promptly address unauthorized account access."] },
      { id: "acceptable-use", title: "5. Acceptable Use", bullets: ["Do not use Quincestone for unlawful, fraudulent, abusive, or deceptive activity.", "Do not attempt unauthorized access, security attacks, malware delivery, credential harvesting, or impersonation.", "Do not attempt to bypass tenant separation, authorization controls, policy boundaries, or human-review requirements.", "Do not abuse automated interfaces or third-party integrations.", "Do not use the service to infringe the rights of others or to violate applicable law."] },
      { id: "demo", title: "6. Demo Environment", paragraphs: ["Northstone Roofing is a fictional demonstration. It does not represent a real business or actual customer. Demo outputs are illustrative, and demo routes do not create real appointments, payments, production records, or external workflow actions."] },
      { id: "assessment", title: "7. Edge Assessment", paragraphs: ["The Edge Assessment is a paid assessment/service offering. The current advertised price is presented through Quincestone's checkout experience. The assessment is intended to identify operating opportunities and practical next steps; it does not guarantee business improvement, revenue, implementation, deployment, or return on investment."] },
      { id: "payments", title: "8. Payments", paragraphs: ["Payments may be processed through third-party payment providers such as Stripe and may be subject to their terms and privacy practices. Quincestone does not guarantee continuous availability of third-party payment infrastructure. Payment status is determined from the authoritative payment-provider state used by the service."] },
      { id: "integrations", title: "9. Integrations", paragraphs: ["Quincestone may connect to third-party services, including calendar or payment infrastructure, when authorized and configured. Third-party availability, permissions, policies, and data practices are outside Quincestone's complete control. Integration actions remain subject to Quincestone's configured workflow and authorization boundaries."] },
      { id: "data", title: "10. User Content and Business Data", paragraphs: ["You retain responsibility for information and business data you submit or configure. You represent that you have the rights and permissions needed for Quincestone to process that information for the requested service. Businesses remain responsible for their own policies, customer communications, legal compliance, workflow configuration, authorized actions, account security, and accuracy of business information."] },
      { id: "ip", title: "11. Intellectual Property", paragraphs: ["Quincestone and its licensors retain rights in the Quincestone service, software, branding, designs, documentation, and other proprietary materials except for rights expressly granted to you. You may not copy, reverse engineer, or misuse proprietary materials except where applicable law permits."] },
      { id: "feedback", title: "12. Feedback", paragraphs: ["If you provide suggestions or feedback about Quincestone, you permit Quincestone to use that feedback to improve its services without creating an obligation to compensate you, subject to any separate written agreement."] },
      { id: "third-party", title: "13. Third-Party Services", paragraphs: ["Third-party services may have separate terms, privacy notices, fees, permissions, and availability. Quincestone does not adopt or transfer a third party's certifications or compliance status to Quincestone."] },
      { id: "changes", title: "14. Service Changes", paragraphs: ["Quincestone may add, modify, suspend, or discontinue features as the product evolves. Where a change materially affects an agreed service, applicable contractual terms control."] },
      { id: "availability", title: "15. Availability", paragraphs: ["The service may occasionally be unavailable because of maintenance, provider outages, security events, updates, or circumstances outside Quincestone's reasonable control. No 100% uptime commitment is made by these Terms."] },
      { id: "security-responsibilities", title: "16. Security Responsibilities", paragraphs: ["Quincestone maintains security controls appropriate to the service, but you remain responsible for account security, authorized users, credentials, business configuration, and the legality and accuracy of data and workflows you provide. You should promptly report suspected unauthorized access or misuse."] },
      { id: "suspension", title: "17. Suspension / Termination", paragraphs: ["Access may be suspended or terminated where reasonably necessary for security, abuse prevention, legal compliance, non-payment, material breach, or discontinuation of a service, subject to applicable agreements and law."] },
      { id: "disclaimers", title: "18. Disclaimers", paragraphs: ["Quincestone assists with interpreting information, applying configured rules, routing requests, and supporting workflows. Outputs can depend on available information, business configuration, integrations, and system state. Quincestone does not provide legal, medical, financial, or other professional advice merely by producing an output, and it does not guarantee perfect interpretation or a particular business result."] },
      { id: "liability", title: "19. Limitation of Liability", paragraphs: ["To the extent permitted by applicable law, Quincestone will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from use of the service. Any additional limits, exclusions, or remedies applicable to a paid service are governed by the agreement applicable to that service. Nothing in these Terms excludes liability that cannot lawfully be excluded."] },
      { id: "indemnity", title: "20. Indemnity", paragraphs: ["To the extent permitted by applicable law, you are responsible for claims arising from your unlawful use of the service, your violation of these Terms, or content and workflows you provide where your responsibility is established. Any negotiated indemnity obligations in a separate agreement control over this general statement."] },
      { id: "governing-law", title: "21. Governing Law", paragraphs: ["The governing law and courts for a particular relationship will be determined by the applicable agreement or, where none exists, by the law applicable to the contracting relationship. Quincestone does not state a governing jurisdiction here without confirming the operating legal entity and applicable contracting structure."] },
      { id: "disputes", title: "22. Dispute Resolution", paragraphs: ["Before formal proceedings, the parties should use the contact channel below to attempt to resolve a dispute in good faith, unless applicable law or a separate agreement provides another required process."] },
      { id: "changes-terms", title: "23. Changes", paragraphs: ["Quincestone may update these Terms as the service changes. Material changes will be presented through appropriate channels where required. Continued use after an effective update constitutes acceptance only to the extent permitted by applicable law."] },
      { id: "contact", title: "24. Contact", paragraphs: ["Questions about these Terms can be directed to hello@quincestone.com. Please do not send credentials or payment-card information through ordinary email."] },
    ],
  },
  cookies: {
    eyebrow: "COOKIES",
    title: "Cookie Policy",
    lead: "Quincestone uses browser technologies selectively. This page describes the categories that may be necessary to operate the public website and authenticated product without claiming analytics or advertising technologies that are not confirmed to be active.",
    sections: [
      { id: "what", title: "1. What Cookies and Local Storage Are", paragraphs: ["Cookies are small values stored by a website in a browser. Local storage and similar browser technologies can retain information on a device without functioning exactly like a cookie. Together, these technologies can support sessions, preferences, security, and application behavior."] },
      { id: "essential", title: "2. Essential Technologies", bullets: ["Authentication and session continuity.", "Security and fraud or abuse prevention.", "Navigation and core product functionality.", "User preferences needed to preserve a selected experience."] },
      { id: "authentication", title: "3. Authentication and Session Cookies", paragraphs: ["The authenticated application may use cookies or related browser storage to maintain a secure session. These technologies are part of core application operation and should not be confused with advertising tracking."] },
      { id: "security", title: "4. Security Technologies", paragraphs: ["Security-related browser technologies may be used to help recognize valid sessions, reduce abuse, preserve request context, or protect application functionality. Exact names and lifetimes can vary as infrastructure changes."] },
      { id: "preferences", title: "5. Preference Technologies", paragraphs: ["Where enabled, browser storage may preserve non-sensitive preferences so that the interface can behave consistently. Preference storage should not be treated as a customer record or authorization grant."] },
      { id: "analytics", title: "6. Analytics", paragraphs: ["Quincestone does not list a specific analytics vendor in this Policy because an active analytics implementation is not confirmed as part of the current public architecture. If analytics is introduced, this Policy should be updated to describe the relevant technology and available controls."] },
      { id: "third-party", title: "7. Third-Party Technologies", paragraphs: ["Embedded or linked third-party services may set or read their own browser technologies subject to their own policies. Examples can include authentication, payment, or integration providers. Quincestone does not control the independent cookie practices of third-party websites."] },
      { id: "control", title: "8. How You Can Control Cookies", paragraphs: ["Most browsers allow you to review, block, delete, or restrict cookies and local storage through browser settings. Disabling essential technologies may prevent authentication, session continuity, or other core features from working correctly. Where a consent control is legally required for a non-essential technology, Quincestone intends to provide the applicable control before that technology is used."] },
      { id: "updates", title: "9. Updates", paragraphs: ["We may update this Policy when browser technologies or product functionality change. The date below identifies the current version."] },
      { id: "contact", title: "10. Contact", paragraphs: ["Questions about browser technologies or privacy can be directed to hello@quincestone.com."] },
    ],
  },
  security: {
    eyebrow: "TRUST / SECURITY",
    title: "Security at Quincestone",
    lead: "Quincestone is designed around explicit authority boundaries. Interpretation, policy, workflow, and external actions are separated so that understanding an interaction does not automatically authorize an operational side effect.",
    sections: [
      { id: "identity", title: "Server-authoritative identity", paragraphs: ["Protected application access is verified server-side. Authentication identifies a principal, while authorization determines what that principal is allowed to access or change."] },
      { id: "tenant", title: "Tenant isolation", paragraphs: ["Production data is designed around workspace boundaries and row-level authorization. Browser-provided workspace identifiers are selectors, not proof of authorization."] },
      { id: "policy", title: "Policy before action", paragraphs: ["Intelligence can interpret an interaction, but interpretation is not authority. Explicit business policy and server-side authorization determine whether a proposed operation is permitted."] },
      { id: "side-effects", title: "Side-effect control", paragraphs: ["External actions are routed through governed server-side paths. The public demonstration is intentionally constrained so its fictional interactions cannot create real Calendar events, payments, production CRM records, or external messages."] },
      { id: "secrets", title: "Secret separation", paragraphs: ["Private provider credentials remain server-side. Browser code is not intended to receive Supabase service-role keys, Stripe secret or webhook secrets, Google OAuth refresh credentials, Resend API keys, or other private provider credentials."] },
      { id: "auditability", title: "Auditability", paragraphs: ["Operational decisions can produce structured traces and durable event records. Quincestone's architecture separates observed facts, derived intelligence, policy decisions, proposed actions, human decisions, executed results, and outcomes rather than presenting them as one undifferentiated AI response."] },
      { id: "intelligence", title: "The intelligence boundary", paragraphs: ["The operating sequence is: Interaction → Interpretation → Knowledge → Policy → Workflow → Human Review → Authorized Action. The interpretation layer may help determine what an interaction means. Policy determines what the system is allowed to do, and human review remains an explicit authority boundary where configured or required. Quincestone does not expose chain-of-thought or internal prompts as a product feature."] },
      { id: "providers", title: "Third-party infrastructure", paragraphs: ["Quincestone may rely on providers such as Vercel, Supabase, Stripe, and Google for specific hosting, database, authentication, payment, or integration capabilities. Each provider operates under its own security and compliance program. Quincestone does not inherit or claim a provider's certifications simply because it uses that provider."] },
      { id: "responsible-use", title: "Responsible use", paragraphs: ["Security also depends on configuration and human behavior. Workspace administrators remain responsible for authorized users, business information, policies, integration permissions, and appropriate review of consequential actions. Quincestone does not represent any system as 100% secure or risk-free."] },
      { id: "report", title: "Security reporting", paragraphs: ["If you believe you have found a security issue, use the canonical Quincestone contact channel at hello@quincestone.com and include enough non-sensitive detail for the team to understand the issue. Do not include passwords, private keys, access tokens, or other credentials in the report. A dedicated security-reporting inbox is not published here because its operational availability has not been separately verified."] },
      { id: "disclosure", title: "Public security claims", paragraphs: ["Quincestone does not currently claim SOC 2, ISO 27001, HIPAA, PCI certification, GDPR certification, regulatory approval, a particular data-residency guarantee, insurance coverage, or a guaranteed breach-response outcome on this page. Third-party provider compliance programs remain those providers' own representations."] },
    ],
  },
};

const nav = [
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Cookies", "/cookies"],
  ["Security", "/security"],
] as const;

export function LegalPage({ kind }: { kind: LegalPageKind }) {
  const document = documents[kind];
  useEffect(() => {
    const title = `${document.title} | Quincestone`;
    document.title = title;
    const canonical = window.location.origin + `/${kind}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = canonical;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = document.lead;
  }, [document, kind]);

  return <article className="legal-page">
    <header className="legal-hero">
      <p className="eyebrow">{document.eyebrow}</p>
      <h1>{document.title}</h1>
      <p className="legal-lead">{document.lead}</p>
      <div className="legal-meta"><span>Effective {updated}</span><span>Last updated {updated}</span></div>
    </header>
    <div className="legal-layout">
      <aside className="legal-index" aria-label="On this page"><p>On this page</p>{document.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title.replace(/^\d+\. /, "")}</a>)}</aside>
      <div className="legal-content">
        {document.sections.map((section) => <section className="legal-section" id={section.id} key={section.id}><h2>{section.title}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
        <nav className="legal-crosslinks" aria-label="Legal pages"><span>Quincestone trust & legal</span>{nav.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}</nav>
      </div>
    </div>
  </article>;
}
