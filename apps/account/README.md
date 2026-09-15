# Quincestone Account

`apps/account` is the Next.js individual identity and relationship surface for authentication, profile, security, preferences, notifications, addresses, saved items, purchases/orders and support.

Account may return an authenticated person to Shop, Deals or Business OS through allowlisted destinations. Authentication never grants business workspace or platform-admin authority.

Development: `pnpm --filter @quincestone/account dev`. Quality gate: `pnpm --filter @quincestone/account check`.

Deployment uses the app-local `vercel.json`; runtime status is tracked in [deployment evidence](../../docs/09_DEPLOYMENT_AND_ENVIRONMENTS.md). See [Identity and Access](../../docs/04_IDENTITY_AND_ACCESS.md).
