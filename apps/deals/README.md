# Quincestone Deals / QDE

`apps/deals` is the Next.js Negotiated Commerce Operating System and product experience for deal discovery, creation, buyer intent, seller offers, qualification, terms, counteroffers, negotiation, agreement, transaction, fulfillment and deal outcome.

QDE owns the deal experience. It uses Quincestone Identity and governed Core boundaries, while agreement, transaction and payment states remain server-authoritative. Deals is separate from both fixed-price Shop and the Business OS.

Deals uses the shared `quincestone` Supabase backend. Deal-specific tables, RPCs, and permissions remain bounded, while people, organizations, agreements, payment reconciliation, provider executions, outcomes, and audit evidence use canonical cross-product identifiers rather than a competing QDE database.

Development: `pnpm --filter @quincestone/deals dev`. Quality gate: `pnpm --filter @quincestone/deals check`.

The canonical domain contract is `QuincestoneDeal.app`; attachment was not reported by the inspected Vercel project. See [canonical architecture](../../docs/00_COMPANY_ARCHITECTURE.md) and [One Quincestone Backend](../../docs/03_ONE_QUINCESTONE_BACKEND.md).
