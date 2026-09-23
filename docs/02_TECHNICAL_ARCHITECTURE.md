# Quincestone — Technical Architecture

The [canonical ecosystem architecture](00_COMPANY_ARCHITECTURE.md) owns product, domain, Core, provider and verification boundaries.

## Implemented monorepo

| Application | Runtime | Boundary |
|---|---|---|
| `apps/web` | Vite + React 18 | Institution / Corporate only |
| `apps/shop` | Next.js 16 + React 19 | Product discovery and fixed-price commerce |
| `apps/account` | Next.js 16 + React 19 | Individual Account |
| `apps/app` | Next.js 16 + React 19 | Business OS |
| `apps/deals` | Next.js 16 + React 19 | QDE negotiated-commerce product |
| `apps/admin` | Next.js 16 + React 19 | Internal control plane |

Shared packages are justified by multiple real consumers. Supabase Edge Functions and application server boundaries remain valid; no speculative `apps/api` authority is assumed.

## Shared backend topology

Every application uses the one canonical Supabase project named `quincestone`. There is one Auth authority, migration history, canonical entity model, and event/audit foundation. Product boundaries are expressed through schemas, tables, functions, grants, RLS, and trusted server commands. A separate product database requires an approved architecture decision record under the [One Quincestone Backend](03_ONE_QUINCESTONE_BACKEND.md) policy.

## Trust boundary

Public configuration may enter browser bundles; browser Supabase access uses only publishable credentials and RLS-constrained operations. Provider secrets and privileged Supabase credentials remain server-side. Workspace IDs are selectors, not authorization. Prices, payment, agreements, approval, review and provider results require server/provider confirmation and durable trace.

Current runtime evidence belongs in [deployment](09_DEPLOYMENT_AND_ENVIRONMENTS.md), [database](database.md) and the [provider register](11_PROVIDER_REGISTER.md), not in this stable architecture summary.
