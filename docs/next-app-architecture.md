# Quincestone Authenticated App Architecture

## Purpose

`apps/web` remains the public Vite + React application at `quincestone.com`.
`apps/app` is the authenticated Next.js application at `app.quincestone.com`.

This separation is intentional: the public product optimizes for editorial presentation and lightweight browser delivery, while the authenticated product needs a server-aware runtime for identity, tenant boundaries, governed actions, and operational data.

## Runtime boundaries

```text
quincestone.com
  Vite + React
  Public experience
  Browser-safe integrations only

app.quincestone.com
  Next.js App Router
  Server Components by default
  Supabase SSR session
  Server-validated authorization
  Tenant-aware application services
```

The browser never receives privileged credentials or server authority.

## Route architecture

Public routes:

- `/sign-in`
- `/sign-up`
- `/forgot-password`
- `/callback`
- `/onboarding` (authenticated users without a workspace)

Protected route group:

- `/dashboard`
- `/intelligence/*`
- `/knowledge`
- `/policies`
- `/workflows`
- `/escalations`
- `/integrations/*`
- `/settings`

The protected route group has a server-side layout that verifies the Supabase user and workspace membership before rendering the application shell. The Next.js `proxy.ts` also refreshes the cookie-backed session and rejects unauthenticated requests to protected paths. Defense in depth is deliberate: route protection must not depend on a client-side redirect or browser state.

## Supabase session flow

```text
Browser
  -> Supabase browser client
  -> authentication
  -> cookie-backed session

Next proxy
  -> refresh session
  -> getUser()
  -> reject protected unauthenticated request

Protected server layout
  -> server Supabase client
  -> getUser()
  -> resolve workspace membership
  -> redirect to onboarding when none exists
  -> render AppShell
```

Use `@supabase/ssr` for both browser and server clients. Use `auth.getUser()` for server identity verification; do not treat decoded browser state as authorization.

## Data and authority flow

```text
UI
  -> authenticated Next.js server boundary
  -> workspace membership / authorization
  -> server application service
  -> deterministic policy
  -> governed integration/workflow
  -> auditable trace
```

Client components are limited to interactions that genuinely require browser state. Reads that determine private operational state should prefer Server Components or server-side application services. Mutations that require authority belong on the server.

## Tenant boundary

The tenant foundation is now deployed in Supabase.

`workspaces` defines the business tenant and `workspace_members` binds authenticated users to a workspace with `owner`, `admin`, or `member` roles. Operational tables that can contain private workspace state now carry `workspace_id` and use RLS membership checks.

The membership helper lives outside the exposed public schema and is used only by RLS policies. Workspace creation validates the authenticated user as the workspace creator before establishing the owner membership.

The first shared demand domain is now also established: `customers` and `interactions` are workspace-scoped records with RLS boundaries. `interactions` represents inbound demand and carries source, status, intent, qualification and outcome fields for later Edge orchestration.

Never trust a client-supplied `workspace_id` as authorization. A workspace identifier is a selector, not proof of membership.

## Shared packages

- `@quincestone/ui`: presentation primitives only; no secrets or privileged integrations.
- `@quincestone/types`: shared contracts and types.
- `@quincestone/config`: non-secret shared configuration.
- `@quincestone/intelligence`: pure contracts, deterministic logic, safe vocabularies, and sanitization helpers.

Server-only services must remain inside `apps/app` or another explicitly server-side boundary. Do not make privileged modules browser-importable.

## Build sequence

1. Keep `apps/web` independently buildable with Vite.
2. Keep `apps/app` independently buildable with Next.js.
3. Stabilize the root pnpm/Turbo graph.
4. Verify Supabase SSR auth and protected route behavior.
5. Establish tenant-aware server application services. **Completed foundation.**
6. Establish the first workspace-scoped demand records. **Completed foundation.**
7. Add governed mutations only after authorization and audit paths exist.
8. Add integrations behind explicit server-side adapters.

## Current phase boundary

The authenticated application now has a coherent operating-console surface, workspace onboarding, tenant-aware RLS boundaries, workspace-scoped customers and interactions, and truthful empty states. The command center and intelligence surfaces read real workspace records without synthesizing metrics. The next implementation boundary is governed interaction creation, Edge qualification/orchestration, workflow records, knowledge and policy data, followed by provider adapters.

Operational UI must remain truthful. Until real data exists, empty states must describe the absence of production activity rather than inventing metrics or health.
