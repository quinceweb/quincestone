# Quincestone Shop

`apps/shop` is the standalone Vite + React application for `shop.quincestone.com`. It owns public discovery, collections, search, product detail, bag state and server-authoritative checkout initiation. Account owns identity and durable customer state; Stripe owns provider payment state.

Anonymous browsing remains available. Authentication transitions use `return_to=shop` plus an optional relative continuation validated by Account. Browser price, inventory, publication, totals and payment state are never authoritative.

## Vercel handoff

| Setting | Value |
|---|---|
| Project | `Quincestone Shop` |
| Root | `apps/shop` |
| Framework | Vite |
| Install | `cd ../.. && pnpm install --frozen-lockfile` |
| Build | `cd ../.. && pnpm --filter @quincestone/shop build` |
| Output | `dist` |
| Domain | `shop.quincestone.com` |

Variable names are in `.env.example`. Do not detach the current domain until the standalone preview and environment contract are verified.
