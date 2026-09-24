# Quincestone Shop

`apps/shop` is the standalone Next.js App Router application for `shop.quincestone.com`. It owns public discovery, collections, search, product detail, bag state and server-authoritative checkout initiation. Account owns identity and durable customer state; Stripe owns provider payment state.

Anonymous browsing remains available. Authentication transitions use `return_to=shop` plus an optional relative continuation validated by Account. Browser price, inventory, publication, totals and payment state are never authoritative.

## Vercel handoff

| Setting | Value |
|---|---|
| Project | `Quincestone Shop` |
| Root | `apps/shop` |
| Framework | Next.js |
| Install | Vercel default pnpm monorepo install |
| Build | Vercel default Next.js build (`next build`) |
| Output | Framework default; leave unset |
| Domain | `shop.quincestone.com` |

Variable names are in `.env.example`. Do not detach the current domain until the standalone preview and environment contract are verified.

## Independent verification

Run from the repository root with the root lockfile:

```bash
pnpm --filter @quincestone/shop lint
pnpm --filter @quincestone/shop typecheck
pnpm --filter @quincestone/shop test
pnpm --filter @quincestone/shop build
pnpm --filter @quincestone/shop start
```

Shop imports shared configuration only. It has zero application-code imports from `apps/web`; Corporate is a separate Vercel application.
