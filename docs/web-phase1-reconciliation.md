# Quincestone Web Phase 1 reconciliation

## Repository truth

Production Web is `apps/web`, a Vite + React application. Root `vercel.json` builds `@quincestone/web` and publishes `apps/web/dist` with framework `vite`. The connected Vercel project `webquincestone` owns `quincestone.com` and `www.quincestone.com`.

The former GitHub Pages workflow was a stock Next.js workflow. It was not the production pipeline for `quincestone.com`. It is retained as a manually triggered optional Vite Pages preview so workflow naming and behavior no longer imply that a failed Pages job means production is down.

## PR #106 disposition matrix

| File / intent | Classification | Reconciliation |
| --- | --- | --- |
| `App.tsx`: remove duplicated marketing path and duplicate generic corporate route definitions | A/C — already present or superseded by current dedicated pages and richer Home experience | Recover only the duplicate-removal and truthful metadata portions; preserve current Home experience and QVS imports. |
| `Layout.tsx`: richer navigation/footer and focus behavior | C/D — conceptually useful, but current main has subsequently received Web reconciliation and QVS 2.0 work | Do not transplant the old Layout wholesale. Preserve current navigation contracts and QVS foundation. |
| `Home.tsx`: extend visible system through Outcome/Learn and redirect Business/Shop CTAs | C/D — current main now has stronger outcome explorer and product walkthrough; some old branch deletions would regress it | Preserve current Home. Do not reintroduce old branch architecture. |
| `BusinessPage.tsx`: deterministic operating demonstration with explicit authority stop | B — still needed | Recover cleanly on current architecture with explicit no-live-data and no-execution truth boundaries. |
| `business-page.css`: demonstration styling | D — needed but old styling included branch-era typography choices | Recover only demonstration styling and bind it to QVS semantic variables/inherited typography. |
| `EdgeAssessment.tsx`: assessment intro before data collection | B — still needed | Recover intro gate and human-review truth boundary. |
| `assessment-intro.css`: intro presentation | B/D — needed, compatible with current surface | Recover as a narrow compatibility layer; QVS remains authoritative. |
| `phase1-corporate.test.tsx`: regression coverage | B — still needed | Recover and expand to cover both assessment entry and authority boundary. |
| `corporate-phase1.css`: footer/layout branch compatibility | C/E — current QVS/Web reconciliation supersedes it | Do not recover. |
| `pnpm-workspace.yaml`: branch environment workaround | E — obsolete | Do not recover. |

## Phase 1 completion matrix

| Requirement | State |
| --- | --- |
| Corporate homepage / hero | COMPLETE |
| Discover → Build → Operate → Scale model | COMPLETE |
| Demand → intelligence → policy → action → outcome → learning narrative | COMPLETE |
| Corporate navigation | COMPLETE |
| Mobile navigation | COMPLETE |
| Intelligence / governance narrative | COMPLETE |
| Commerce relationship | COMPLETE |
| Corporate credibility / truth boundary | COMPLETE |
| CTA architecture | COMPLETE |
| Footer / legal routing | COMPLETE |
| Responsive foundations | COMPLETE; production browser QA remains a release verification step |
| Accessibility foundations | COMPLETE with skip link, semantic controls, reduced-motion handling; browser QA remains required |
| Loading / error states | COMPLETE at application boundary |
| Metadata / SEO | COMPLETE for canonical public root; route-level expansion is future optimization, not a Phase 1 blocker |
| Performance | COMPLETE at canonical Vite build gate; production monitoring remains ongoing |
| QVS 2.0 integration | COMPLETE / HARD BOUNDARY |
| Deterministic Business operating demonstration | RECOVERED IN THIS RECONCILIATION |
| Assessment framing before information collection | RECOVERED IN THIS RECONCILIATION |

## Open-PR impact guidance

PR #106 is the only stale PR whose primary purpose is the Phase 1 corporate Web completion. Shop/editorial and shared-system PRs must be evaluated independently and are not merged by this reconciliation. Repository-wide infrastructure, Account, App, Admin, Deals, action-execution, checkout, and Shopify PRs remain outside this merge unless they independently satisfy their own product gates.

## Deployment architecture

- Production `quincestone.com`: Vercel project `webquincestone`, Vite framework.
- Canonical production build: `pnpm --filter @quincestone/web build` → `apps/web/dist`.
- Canonical Web quality gate: lint → TypeScript → Vitest → Vite build via `pnpm --filter @quincestone/web check`.
- GitHub Pages: optional manual preview only; not production.

## PR #106 final disposition

After this reconciliation is green and merged, PR #106 should be closed as **partially recovered then superseded**. Its still-valuable assessment and governed Business demonstration are recovered here; its branch-era Home/Layout/CSS/workspace changes are not merged because current main/QVS 2.0 provide the stronger implementation.

## Assessment evolution

The Phase 1 intro gate is superseded by the dedicated Edge Assessment operational plane. See [Edge Assessment operational plane](./edge-assessment-operational-plane.md) for the route shell, submission contract, server-authoritative lifecycle, human-review boundary and post-submission architecture.
