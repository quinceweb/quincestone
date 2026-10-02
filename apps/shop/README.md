# Quincestone Shop

`apps/shop` is the standalone Next.js App Router application for `shop.quincestone.com`. It owns public discovery, collections, search, product detail, bag state and server-authoritative checkout initiation. Account owns identity and durable customer state; Stripe owns provider payment state.

Anonymous browsing remains available. New authentication transitions use the canonical App identity at `app.quincestone.com` with an allowlisted relative `next` continuation validated by App. The legacy Account application remains available only as a compatibility/rollback boundary until runtime certification closes. Browser price, inventory, publication, totals and payment state are never authoritative.

## Vercel handoff

| Setting | Value |
|---|---|
| Project | `Quincestone Shop` |
| Root | `apps/shop` |
| Framework | Next.js |
| Install | `cd ../.. && pnpm install --frozen-lockfile` |
| Build | `cd ../.. && pnpm --filter @quincestone/shop build` |
| Output | `.next` |
| Domain | `shop.quincestone.com` |

Variable names are in `.env.example`. Do not detach the current domain until the standalone preview and environment contract are verified.
