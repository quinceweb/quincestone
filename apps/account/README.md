# Quincestone Account

`apps/account` is the Next.js individual identity and relationship surface for authentication, profile, security, preferences, notifications, addresses, saved items, purchases/orders and support.

Account may return an authenticated person to Shop, Deals or Business OS through named allowlisted destinations and relative continuations. Absolute and protocol-relative continuations are rejected. Authentication never grants business workspace or platform-admin authority.

Account uses the shared `quincestone` Supabase Auth identity and canonical person/customer records. It owns the individual relationship experience, not an independent backend; cross-product history is resolved from governed canonical identifiers and records.

Development: `pnpm --filter @quincestone/account dev`. Quality gate: `pnpm --filter @quincestone/account check`.

Deployment uses the app-local `vercel.json`; runtime status is tracked in [deployment evidence](../../docs/09_DEPLOYMENT_AND_ENVIRONMENTS.md). See [Identity and Access](../../docs/04_IDENTITY_AND_ACCESS.md) and [One Quincestone Backend](../../docs/03_ONE_QUINCESTONE_BACKEND.md).
