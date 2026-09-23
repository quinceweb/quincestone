# QEU 1.0 — One Quincestone / Two Modes

## Status

This document freezes the Phase 1 relationship between the institutional and commerce experiences. It does not authorize Phase 2 capabilities.

## One company, two experience modes

| Mode | Surface | Purpose | Experience character |
|---|---|---|---|
| Institution | `quincestone.com` | Understand, assess, build trust, explore systems, enter the ecosystem | Editorial, architectural, calm, authoritative |
| Commerce | `shop.quincestone.com` | Discover, evaluate, compare, configure supported variants and purchase | Product-led, tactile, precise, high-confidence |

Institution mode is served by `apps/web`; Commerce mode is served by `apps/shop`. Both consume QVS 2.0 from `packages/config/src/brand.css` and sit above the one canonical Quincestone Supabase backend.

## Canonical design constitution

`packages/config/src/brand.css` remains the only token authority for color, typography, spacing, geometry, elevation, controls, focus and motion. Surface styles may compose these tokens but must not redefine their meaning or create a competing palette.

The component hierarchy is:

1. Foundation — canonical QVS tokens.
2. Primitives — buttons, links, inputs, selects, media, dividers and containers already expressed through shared semantics.
3. Patterns — navigation, hero, editorial sections, product cards, evidence, empty states, search, filters and commerce controls.
4. Modes — Corporate in `apps/web`, Commerce in `apps/shop`; Account, Business, Deals and Admin remain separate application boundaries.

## Cross-surface continuity

- Corporate routes to Shop as the fixed-price commerce department of Quincestone.
- Shop identifies itself as Quincestone Shop and routes institutional context back to `www.quincestone.com`.
- Shop routes orders, saved items, profile, addresses and security to `account.quincestone.com`.
- Navigation may preserve intent, but authentication never manufactures customer, workspace or operator authority.
- Platform-admin authority is never inferred from Shop or Account state.

## Commerce publication contract

Shop is the public publication layer of the Commerce Operating System:

`Demand → Discovery → Product intelligence → Qualification → Supplier and economic evidence → Human authorization → Published product → Order and experience → Outcome → Learning`

The public catalog remains `commerce_catalog`. An empty or unavailable catalog produces a truthful state. Internal candidates, supplier identities, private economics and restricted evidence are not exposed.

Customer-facing evidence may state that publication was authorized. Individual certifications, supplier checks, fulfillment promises or verification claims may be shown only when the published record explicitly supports them.

## Product and kit readiness

Phase 1 supports products, variants, specifications, included items, media, shipping/returns content and publication-gated discovery. The current collection taxonomy is retained until catalog evidence supports a governed change.

The architecture reserves future kit concepts—purpose, scenario, components, quantities, specifications, replacement intervals, intended users, capability coverage, evidence, inventory and version—without creating a second product authority or migrating production schema in this phase.

## Phase 2 seam — not implemented

The following remain explicitly deferred: Build Your Kit intelligence, recommendations, My Readiness, readiness scoring, membership, replenishment, reminders, advanced personalization, lifecycle recommendations, fleet ordering, recurring revenue and advanced lifecycle analytics.

The Ready Lab section in Phase 1 explains this boundary; it does not calculate, recommend, register or persist readiness.

## Release requirements

Before merge, the branch must pass the repository quality gate, Web lint/typecheck/tests/build, Shop and Corporate regression checks, diff validation, and configured CI. Production and deployed Supabase claims require separate runtime evidence. Phase 2 requires explicit authorization after this freeze is merged.
