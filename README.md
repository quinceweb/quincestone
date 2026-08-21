# Quincestone

**Turn demand into outcomes.**

Quincestone is a commerce and operating-systems company that turns customer demand into products, experiences, and operational outcomes.

## One Quincestone

The operating model is:

**Demand → Experience → Intelligence → Transaction → Operations → Outcome → Learning → Scale**

The public expression is simpler:

**Discover → Build → Operate → Scale**

### Quincestone for Business

**Assessment → Structure → Website → Edge → Operations**

Your website should do more than receive people. Quincestone for Business helps connect the customer journey to a governed operational next action.

### Quincestone Commerce

**Demand → Product Discovery → Validation → Sourcing → Shop → Fulfillment → Improvement → Brand**

Supplier-direct fulfillment or dropshipping may be used internally for validation. It is not the public identity of Quincestone. Products are presented publicly only when the commerce surface and underlying product truth are ready.

### Quincestone Edge

Edge is the intelligence layer between customer demand and business operations:

**Interaction → Understand → Collect → Qualify → Knowledge → Policy → Route → Action → Human Review → Outcome → Record**

Edge is not a chatbot. Human judgment remains an explicit authority boundary.

## Canonical applications

```text
apps/web    Public company, acquisition, commerce discovery, demo, assessment, SEO
apps/app    Authenticated business operating application
apps/admin  Internal Quincestone control plane
apps/api    Shared Quincestone service/API boundary
```

## Canonical domains

```text
quincestone.com       Master company and public web
shop.quincestone.com  Public commerce surface served by apps/web
app.quincestone.com   Authenticated business application
admin.quincestone.com Internal control plane
api.quincestone.com   Shared service boundary
```

The shop hostname does not create a fifth application. It is a host-aware public surface of `apps/web`.

## Repository

```text
apps/
  web/       Vite + React public experience
  app/       Next.js authenticated application
  admin/     Next.js internal control plane
  api/       Next.js service boundary
packages/
  config/    Shared non-secret brand/configuration
  intelligence/ Pure deterministic intelligence contracts
  types/     Shared data contracts
  ui/        Reusable presentation primitives
supabase/
  migrations/ Database schema history
  functions/  Edge Functions and server-side provider boundaries
docs/         Canonical architecture and operating documentation
```

`main` is the production source authority. Substantive changes are made through focused branches and pull requests.

## Platform status

Status labels mean:

- **Implemented** — repository code exists and is part of the current source tree.
- **Configured** — provider/project configuration has been inspected and exists.
- **Deployed** — the provider reports a deployment/version exists.
- **Verified** — the deployed behavior has been directly checked.
- **Planned** — intentionally future work.

Current verified provider reality:

| Provider | Status | Current truth |
|---|---|---|
| GitHub | Verified | `quinceweb/quincestone`, `main` is production authority |
| Vercel | Partial | `webquincestone` and `quincestone-app` exist; current new deployments are temporarily blocked by the Hobby daily deployment limit |
| Supabase | Verified | Production project `djsfgsqsuqcgcriwfaxu` is active and current workspace/Edge foundation is deployed |
| Stripe | Sandbox | Connected account is test/sandbox with zero products; no live commerce configuration is claimed |
| Resend | Not configured | Connected tooling reports no sending domains |
| Clerk | Not verified | No inspectable connected Clerk runtime; Supabase Auth remains production identity authority |
| Alibaba | External sourcing network | No runtime software integration is claimed |

No provider is described as production-ready merely because a code boundary exists.

## Development

Prerequisite: Node.js compatible with the repository's current pnpm toolchain and `pnpm@10.15.0`.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

Run a specific application with its workspace filter, for example:

```bash
pnpm --filter @quincestone/web dev
pnpm --filter @quincestone/app dev
```

The root lockfile is authoritative. Do not create nested lockfiles.

## Environment and security

Browser applications may only receive public configuration. Server-side boundaries hold provider secrets.

Never expose:

- Supabase service-role keys
- Stripe secret keys or webhook signing secrets
- Google refresh tokens/client secrets
- Resend API keys
- other provider credentials

Workspace identifiers are selectors, not proof of authorization. Internal admin authority is separate from ordinary workspace membership.

## Public demo truth

Northstone Roofing is fictional demonstration content. Demo data must remain deterministic and clearly labeled. Demo activity is never presented as real customer evidence, revenue, appointments, or production health.

## Release policy

PR #15 remains a separate release gate for the current workspace/human-review changes. It must not be bypassed while its current head lacks a successful Vercel preview.

Foundation work that does not depend on PR #15 may proceed from `main`, but Vercel-dependent verification remains explicitly pending while the external deployment limit is active.

See [`docs/00_COMPANY_ARCHITECTURE.md`](docs/00_COMPANY_ARCHITECTURE.md) for the current architectural authority and [`docs/12_RELEASE_PROCESS.md`](docs/12_RELEASE_PROCESS.md) for promotion rules.
