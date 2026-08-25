# Quincestone — Commerce Architecture

## Public surface

`shop.quincestone.com` is a host-aware public commerce surface served by `apps/web`. No fifth frontend application is required.

## Operating sequence

Demand → Product Discovery → Validation → Sourcing → Shop → Transaction → Fulfillment → Customer Data → Improvement → Inventory → Product Development → Brand

## Current implementation

- Shop host routing is implemented in `apps/web`.
- Shop has dedicated consumer navigation, collection routes, search, cart boundary, truthful empty states, commerce standards, and a complete transaction lifecycle presentation.
- The public catalog is currently empty.
- No previously approved product opportunity is recoverable from the repository or current project context, so no product has been fabricated for publication.
- The repository contains no approved product photography suitable for a product listing; the Shop currently uses the canonical Quincestone symbol only for empty-state identity.
- The connected Stripe sandbox currently has zero products, so no Shop product is sellable and no checkout/payment action is exposed as live.

## Product truth

Products must progress through an explicit internal lifecycle:

`RESEARCHED` → `VALIDATED` → `SOURCED` → `READY_TO_SELL` → `LIVE`

Only `READY_TO_SELL` or `LIVE` products may be represented as purchasable. Never fabricate stock, ratings, reviews, sales counts, discounts, supplier agreements, delivery promises, certifications, or price comparisons.

## Validation

Supplier-direct fulfillment or dropshipping may be used as a controlled validation mechanism. It must not define Quincestone's public identity or long-term operating model.

Winning products should progress toward stronger supplier relationships, improved specifications, inventory control, custom packaging, product development and owned brands when justified by evidence.

## Checkout boundary

Payment behavior belongs behind the appropriate server/provider boundary. The connected Stripe account inspected for this release is the Quincestone sandbox/test account and currently contains no products. Therefore the Shop exposes a truthful cart/checkout boundary rather than a fabricated purchase flow.

When a real sellable product and Stripe price exist, the next release should connect:

Product → Cart → Server-authorized Checkout → Payment → Order → Fulfillment

No live financial actions are used as synthetic verification.
