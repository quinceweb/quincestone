# Phase 1 — Corporate Experience Freeze

Status: release candidate approved for production

Date: 2026-09-14

Release authority: `main` after merge of PR #104

## Frozen product sequence

1. Corporate experience
2. Backend, identity, accounts and business operations
3. Intelligent commerce and product house
4. Edge assessment and governed execution
5. Artemis intelligence and agentic execution

Phase 2 must preserve the Phase 1 public architecture and may replace illustrative state only with verified backend state.

## Canonical corporate routes

- `/` — complete Quincestone operating model
- `/discover` — demand, interactions, assessments and research
- `/build` — business systems, commerce, intelligence and knowledge
- `/operate` — Edge, workflows, policy, routing and human review
- `/scale` — outcomes, analytics, learning and improvement
- `/edge` — intelligence with an authority boundary
- `/commerce` — demand-led commerce and the relationship to Shop
- `/business` — the business operating model
- `/assessment` — structured assessment entry point
- `/about` — purpose, operating principles and truth standard

## Cross-domain contract

- Corporate primary CTA: `https://app.quincestone.com/sign-up`
- Corporate assessment CTA: `https://www.quincestone.com/assessment`
- Sign in: `https://app.quincestone.com/sign-in`
- Commerce: `https://shop.quincestone.com`
- Individual account: `https://account.quincestone.com`

## Truth boundary

- Public demonstrations are fictional, deterministic and labelled as illustrative.
- No customer, metric, activity, evidence, product claim, integration or provider state may be fabricated.
- Observed facts remain separate from derived intelligence.
- Intelligence is not authority.
- Consequential action stops for human review when authority is insufficient.

## Release gate

- Canonical routes and navigation are present.
- Homepage exposes the operating model through interaction.
- Edge, Commerce, Business, Assessment and About have dedicated public experiences.
- CTA and domain destinations follow the cross-domain contract.
- Responsive behavior, keyboard semantics and reduced-motion behavior are implemented.
- Route metadata, robots and canonical sitemap entries are present.
- Lint, type-check, automated tests and production build pass.
- GitHub quality and Vercel deployment checks pass for the release candidate.
- Production must be verified against the exact merged commit before Phase 1 is declared complete.

Changes to this contract after the production release require a reviewed pull request. Phase 2 may extend the system; it must not silently rewrite the Phase 1 boundaries.
