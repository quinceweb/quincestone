# P12 — SEO & Acquisition

## Objective

Make Quincestone discoverable through search while keeping the public narrative aligned with the product architecture: Discover → Build → Operate → Scale.

## Implemented

- Centralized route-level title, description, canonical, robots, Open Graph, and Twitter metadata through `apps/web/src/seo.ts`.
- Added metadata to public discovery and pricing acquisition surfaces and to canonical content pages.
- Added an XML sitemap covering indexable public product, outcome, industry, assessment, pricing, demonstration, company, and legal surfaces.
- Added `robots.txt` with explicit crawl access for public content and disallow rules for authenticated, administrative, API, onboarding, and checkout surfaces.
- Preserved fictional/demo disclosure on demonstration pages; demo routes remain indexable only where the content is useful as a clearly labeled acquisition example.

## Acquisition architecture

### Primary discovery surfaces

1. `/` — company narrative and primary conversion path.
2. `/discover` — guided product discovery.
3. `/business` — Quincestone for Business.
4. `/edge` — Quincestone Edge.
5. `/commerce` — Quincestone Commerce.
6. `/industries/*` — outcome-oriented industry examples.
7. `/assessment` — qualification entry point.
8. `/pricing` — post-assessment commercial continuation.
9. `/demo/experience` — interactive product demonstration.

### Internal linking rule

Public pages should move visitors toward a useful next step rather than create isolated SEO pages. Preferred progression is:

`Discovery → Product understanding → Demonstration/Assessment → Pricing → Checkout → Onboarding`

Industry pages should link to the relevant product capability and assessment/demo surfaces. Product pages should link to assessment or demonstration. Legal and operational/private surfaces must not be used as acquisition landing pages.

## Structured data

The base document publishes Organization, WebSite, and relevant Service structured data. Route-level metadata is managed by the application for SPA navigation. Structured data must remain factual and should only describe real Quincestone capabilities; fictional demo content must never be emitted as real customer evidence.

## Search truth rules

- Never manufacture customer counts, rankings, testimonials, case-study outcomes, revenue, uptime, or other evidence for SEO.
- Do not create doorway pages that differ only to target search phrases.
- Keep canonical URLs stable and use one preferred hostname for the public company site.
- Keep authenticated application, admin, API, checkout, and onboarding routes out of the acquisition index.
- Use descriptive page titles and descriptions that match the visible page content.
- Update the sitemap when public acquisition routes change.

## Verification gate

P12 is complete when crawl directives exist, indexable public routes are represented in the sitemap, route-level metadata is centralized and applied to acquisition surfaces, structured metadata remains factual, internal acquisition paths are coherent, and the resulting branch is reviewed and merged before production deployment.

## Remaining external work

Search engine ownership verification, sitemap submission, Search Console/Bing Webmaster registration, analytics attribution, and ongoing query/content performance review remain external operating activities. Their status must not be inferred from repository changes.
