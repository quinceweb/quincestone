# QPAI 1.2 — Statsig Integration and Environment Specification

**Status:** Proposed provider specification; account configuration not verified  
**Provider:** Statsig  
**Repository baseline:** `6e1f9615f747788c318e7d5d098e374e4d9dbce5`

## 1. Provider role

Statsig is the proposed provider for:
- Product analytics from approved events.
- Feature gates for optional product rollout.
- Experiments after a reliable baseline exists.

Statsig is not:
- The canonical business-event database.
- An identity or authorization provider.
- A payment, order, deal, or workflow system of record.
- A business-execution engine.
- A security audit log.
- A substitute for Artemis verification.

## 2. Current verified baseline

The read-only audit of the default branch found:
- No Statsig SDK dependency in the root or six application manifests.
- No Statsig integration references in the inspected repository search.
- No Statsig-specific environment variables in the five Vercel projects inspected.
- One shared Supabase project and existing business-event/trace/audit foundations.
- A pnpm/Turbo monorepo with shared packages for config, types, intelligence, and UI; no analytics package was found.

The Statsig account's project count, environment configuration, key validity, team access, and billing configuration have not been inspected. No assumption should be made about them.

## 3. Project and environment strategy

Initial recommendation: one coordinated Statsig project with three Statsig environments (development, staging, production), and product-prefixed event names.

This is a recommendation, not a verified Statsig account setting. Before configuration, confirm:
- Whether the Statsig plan supports the required environments and project access controls.
- Whether team permissions allow product-level data access boundaries.
- Whether Admin events can be excluded or separately governed.
- Whether the selected billing plan is appropriate.

If project-level permissions cannot preserve the required boundaries, split projects before production collection. Do not create separate projects solely for cosmetic organization.

Never mix development, preview/staging, and production traffic. Vercel Preview deployments should use the staging environment and staging client key. Production deployments use the production key. Local development uses development credentials.

## 4. SDK selection

### Initial client SDK

Use the current Statsig JavaScript client package:

`@statsig/js-client`

The current official documentation uses `StatsigClient` and `initializeAsync()`. Do not use the retired legacy `statsig-js` package.

### Deferred plugins

Do not install in the initial pilot:
- `@statsig/web-analytics` — automatic capture is broader than QPAI's allowlist.
- `@statsig/session-replay` — privacy review and approval are outstanding.

### Server-side events

For trusted server events, evaluate the current Statsig Node Server Core SDK (`@statsig/statsig-node-core`) only in a compatible trusted Node runtime, or a documented Statsig server event API through a controlled relay. The existing Supabase Edge Functions use Deno; do not assume the Node SDK is compatible with that runtime.

Do not call Statsig from Postgres triggers. Do not block a successful Supabase transaction on analytics delivery. A durable post-commit relay/outbox must be designed and approved before server event rollout.

## 5. Environment variables

Names below are proposed. Exact values must be created in Statsig and injected by the relevant hosting provider; never commit real keys.

| Variable | Runtime | Exposure | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_STATSIG_CLIENT_KEY` | Next.js client build | Public | Client SDK key for Next.js apps |
| `VITE_STATSIG_CLIENT_KEY` | Vite client build | Public | Client SDK key for Corporate Vite app |
| `STATSIG_SERVER_SECRET_KEY` | Trusted server only | Secret | Server SDK/relay, only if selected |
| `QPAI_IDENTITY_HMAC_KEY` | Trusted server only | Secret | Derive pseudonymous actor/workspace IDs |

Use distinct credentials for each environment. Server secrets and HMAC keys must never use `NEXT_PUBLIC_` or `VITE_` prefixes. Do not store any key in GitHub source files, browser bundles, client-readable Supabase settings, or screenshots.

The audit did not reveal a separate Corporate Vercel project; confirm its actual Cloudflare hosting and secret-injection mechanism before configuring the Vite key.

## 6. Application rollout

| Order | Product | Initial scope | Release condition |
|---:|---|---|---|
| 1 | Corporate | Consent-approved route/product/assessment journey events | Confirm Cloudflare deployment and privacy notice |
| 2 | Business OS | Coarse onboarding and feature-use events | Validate workspace isolation and server event relay |
| 3 | Shop | Product discovery and client funnel events | Server order/payment event authority and Stripe reconciliation |
| 4 | Deals | Deal journey events | Deal event visibility and sensitive commercial metadata review |
| 5 | Account | Profile and engagement events | Identity pseudonymization and consent |
| 6 | Admin | Deferred; minimal internal usage only | Separate privileged-data and access review |

Corporate and Business OS are the initial pilot candidates, not permission to deploy immediately. Each must pass staging verification first.

## 7. Feature gate naming

Use:
`<product>.<surface>_<feature>_v<major>`

Examples:
- `corporate.assessment_flow_v1`
- `business_os.edge_dashboard_v1`
- `business_os.workflow_builder_v1`
- `shop.discovery_layout_v1`
- `deals.negotiation_experience_v1`
- `account.onboarding_flow_v1`

Every gate must have an owner, purpose, expected removal date, fallback, and rollback plan. Gate evaluation never substitutes for server authorization.

## 8. Experimentation policy

Experiments are deferred until:
- Event definitions are stable.
- Event delivery and deduplication are verified.
- A sufficient baseline exists.
- A primary metric and guardrail metrics are approved.
- Assignment and exposure are consistent across devices/products.
- Privacy and consent requirements are satisfied.

Do not experiment on security, authorization, payment, human review, pricing authority, deal terms, or any consequential execution path without a separate formal risk review.

## 9. Initial rollout configuration

- Client SDK only.
- Manual allowlisted events only.
- No Web Analytics auto-capture.
- No Session Replay.
- No console-log capture.
- No exact URLs or query parameters.
- No PII or confidential business data.
- Non-blocking initialization and event delivery.
- Separate environment keys.
- Product-prefixed event names.
- Feature gates limited to optional UI/release behavior.
- No production enablement until staging payloads are inspected.

## 10. Verification and release gates

### Account configuration
- [ ] Statsig project identified.
- [ ] Development, staging, and production environments verified.
- [ ] Client keys obtained and mapped to environment.
- [ ] Server secret key stored only in trusted runtime if needed.
- [ ] Team access and billing reviewed.
- [ ] Auto-capture and Session Replay disabled.

### Technical verification
- [ ] Current SDK package/version confirmed at implementation time.
- [ ] No legacy SDK dependency.
- [ ] No secrets in browser or repository.
- [ ] Consent behavior verified.
- [ ] Event allowlist validated.
- [ ] Client failures do not block app behavior.
- [ ] Server outcomes sourced from committed authoritative records.
- [ ] Retries and deduplication tested.
- [ ] Product and environment boundaries verified.
- [ ] Feature gate fallback and authorization separation tested.

### Production authorization
Production enablement requires a separate approval after staging evidence is reviewed. A successful SDK initialization alone is not proof of correct privacy, event semantics, or production readiness.

## 11. Official provider references

- JavaScript Client SDK: https://docs.statsig.com/client/javascript-sdk
- SDK initialization: https://docs.statsig.com/client/concepts/initialize
- Web Analytics auto-capture: https://docs.statsig.com/webanalytics/overview
- Session Replay privacy: https://docs.statsig.com/session-replay/privacy
- Node Server Core SDK: https://docs.statsig.com/server-core/node-core

These references are subject to change. Recheck official documentation and current package versions immediately before implementation.
