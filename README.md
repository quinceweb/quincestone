# Quincestone

**Intelligence between interaction and action.**

Quincestone is edge intelligence infrastructure for modern business websites and applications. It combines edge experience, controlled AI, business knowledge, intelligent qualification, workflow routing, human escalation, and operational visibility.

- Builder: Quinceweb
- Public: https://quincestone.com
- Authenticated app: https://app.quincestone.com
- Public email: hello@quincestone.com

## Repository architecture

```text
apps/web        Public Vite + React product, marketing, demo, assessment and checkout
apps/app        Authenticated Next.js operating application
packages/ui     Small shared UI primitives
packages/types  Shared intelligence and tenant contracts
packages/config Shared safe brand/configuration constants
packages/intelligence Safe deterministic contracts and policy vocabulary
supabase/       Shared Edge Functions and database migrations
docs/           Product, architecture, security and deployment documentation
```

The public application remains Vite + React intentionally. The authenticated operating application uses Next.js App Router so each surface can evolve independently while sharing governed contracts and backend infrastructure.

## Local development

```bash
pnpm install
pnpm dev
```

Run an individual application:

```bash
pnpm --filter @quincestone/web dev
pnpm --filter @quincestone/app dev
```

## Workspace commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

Turborepo coordinates workspace task execution and caching. Long-running development tasks are intentionally not cached.

## Environment boundaries

`apps/web` receives only public browser-safe configuration. `apps/app` uses Supabase SSR with browser-safe Supabase URL/anon-key configuration. Supabase Edge Functions retain privileged provider credentials server-side.

Never expose service-role keys, Google refresh tokens/client secrets, Stripe secret keys, webhook signing secrets, or other private credentials to either browser application.

## Public product

The public site preserves the existing Quincestone marketing experience, Northstone Roofing fictional demo, assessment, contact/apply flows, calendar frontend boundary and Stripe-hosted checkout.

Northstone Roofing is fictional. Public demo routes use demonstration data only and never create real appointments, payments, subscriptions, customers, or production operational records.

## Authenticated application

`apps/app` is the foundation for `app.quincestone.com`. It establishes Supabase Auth session handling, protected route architecture, an operational application shell, truthful empty states and a minimal tenant/membership contract. Deep policy editing, workflow authoring, API-key management, webhooks, advanced roles, customer onboarding and external AI remain deliberately out of scope for this phase.

Tenant authority must be established server-side; browser-provided tenant identifiers are never trusted for authorization.

## Deployment architecture

The intended Vercel separation is:

- `quincestone.com` → Vercel project rooted at `apps/web`
- `app.quincestone.com` → Vercel project rooted at `apps/app`

No DNS changes are performed by this architecture branch. Cloudflare management remains manual unless an executable connector becomes available.

## Backend

Supabase remains shared infrastructure. Existing Edge Functions and migrations stay under `/supabase`. The deterministic edge-intelligence runtime remains the authoritative intelligence baseline; external AI augmentation is intentionally deferred.

## Release boundary

This branch does not merge PR #6, deploy production, change DNS, apply a new production migration, create a calendar event, or perform a Stripe transaction. Workspace validation must be completed before this branch is considered production-ready.
