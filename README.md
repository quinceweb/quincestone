# Quincestone

Quincestone is a governed business and commerce ecosystem that understands demand, operates what happens next and scales what works.

## Surfaces

| Surface | Responsibility | Source |
|---|---|---|
| `quincestone.com` | Institution, trust, public intelligence and product routing | `apps/web` |
| `shop.quincestone.com` | Quincestone Shop: product discovery and fixed-price commerce | `apps/shop` |
| `account.quincestone.com` | Quincestone Account: individual identity and relationship | `apps/account` |
| `app.quincestone.com` | Quincestone Business OS: authorized business workspaces | `apps/app` |
| `QuincestoneDeal.app` | Quincestone Deals / QDE: negotiated commerce | `apps/deals` |
| `admin.quincestone.com` | Quincestone Admin: internal control plane | `apps/admin` |

Authentication does not imply workspace access or platform administration. Shop and Deals are peer product experiences; neither is a module of the Business OS.

All surfaces use the one canonical Supabase project named `quincestone`. They share identity, canonical entities, migrations, Core contracts, events, outcomes, and audit foundations while retaining product-bounded permissions and ownership. See [One Quincestone Backend](docs/03_ONE_QUINCESTONE_BACKEND.md).

## Repository

- `apps/web` — Vite + React institutional Corporate surface.
- `apps/shop` — Next.js App Router standalone Shop application.
- `apps/account` — Next.js individual Account.
- `apps/app` — Next.js Business OS.
- `apps/deals` — Next.js negotiated-commerce application.
- `apps/admin` — Next.js internal control plane.
- `packages/*` — shared UI, types, configuration and intelligence primitives with real consumers.
- `supabase/*` — database migrations and Edge Functions; deployed state must be reconciled separately.

## Documentation authority

- [Canonical ecosystem architecture](docs/00_COMPANY_ARCHITECTURE.md)
- [One Quincestone Backend](docs/03_ONE_QUINCESTONE_BACKEND.md)
- [Deployment and environments](docs/09_DEPLOYMENT_AND_ENVIRONMENTS.md)
- [Database and data authority](docs/database.md)
- [Provider register](docs/11_PROVIDER_REGISTER.md)
- [Security and trust](docs/08_SECURITY.md)
- [Release process](docs/12_RELEASE_PROCESS.md)
- [Repository agent rules](AGENTS.md)

Historical release notes and phase documents preserve evidence but do not override these authorities.

## Development

Use Node.js compatible with the workspace and `pnpm@10.15.0`. The root lockfile is authoritative.

```bash
pnpm install --frozen-lockfile
pnpm check
```

Individual application commands are documented in each application README.

## Trust rule

Browser state is never authority for identity roles, workspace membership, prices, payment, approval, persistence or operational outcomes. Validate and authorize server-side, preserve idempotency and audit events, and require Human Review wherever consequential authority is insufficient.
