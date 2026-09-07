# Quincestone — Commerce Architecture

## Purpose

Quincestone is a commerce and product-development company. The commerce platform is the operating system for discovering, validating, sourcing, selling, fulfilling and learning from consumer products.

## Public surface

`shop.quincestone.com` is a host-aware public commerce surface served by `apps/web`. No fifth storefront application is required.

## Customer flow

```text
Customer
  ↓
shop.quincestone.com
  ↓
Catalog / Pricing / Cart
  ↓
Server-authoritative checkout
  ↓
Stripe
  ↓
Signed payment event
  ↓
Order
  ↓
Human-reviewed fulfillment
  ↓
Tracking / Delivery
  ↓
Returns / Support / Retention
```

The browser never becomes the authority for price, discount, payment state, order state, refund state, fulfillment state, supplier cost, inventory authority or administrative permissions.

## Product lifecycle

```text
RESEARCH
→ SOURCING
→ SUPPLIER_SELECTED
→ SAMPLE_ORDERED
→ SAMPLE_RECEIVED
→ QA
→ ECONOMICS_REVIEW
→ APPROVED
→ READY
→ ACTIVE
```

Interruption states are `REVISE`, `PAUSED`, `REJECTED` and `ARCHIVED`.

A product cannot become active/published until the launch gate confirms sourcing, exact SKU, approved sample, quality/functional/packaging pass, media rights, economics, shipping terms, returns/warranty, price, content and final decision readiness, plus an active priced variant. Database publication enforcement makes this a system rule rather than documentation.

## Data authority

The production-shaped schema includes customers, addresses, products, variants, inventory, media rights, suppliers, supplier mappings, product QA, carts, discounts, bundles, orders, immutable order lines, payments, fulfillments, returns, refunds and commerce audit events.

Supplier costs, quotes, MOQ, supplier SKUs and QA evidence are internal operational data and are never returned by the public catalog.

## First ten candidates

The first ten requested products are seeded as internal `RESEARCH` records only. No price, stock, review, media, supplier relationship, delivery promise or specification is fabricated. Their records exist to give operations a controlled place to enter verified sourcing evidence.

## Checkout

`apps/web/api/commerce-checkout.ts` recalculates sellability and price from database state before creating a Stripe Checkout Session. The checkout session is linked to a pending order and payment record.

`apps/web/api/commerce-webhook.ts` verifies the Stripe signature, reconciles successful payments, is idempotent against provider event IDs, and creates a fulfillment requirement. Refund events reconcile payment/order state without deleting financial history.

The implementation returns a configuration error when required server secrets are absent rather than silently falling back to client-side authority.

## Fulfillment

V1 does not automatically place supplier orders. A paid order creates a `FULFILLMENT_REQUIRED` record for human review. Future supplier/3PL integrations can attach behind that boundary without changing customer-facing authority.

## Media

Public media must live under Quincestone-controlled storage/CDN and carry approved rights/publication state. Restricted or unverified supplier media cannot enter the public catalog.

## Operations

`apps/admin` is the private control plane. Commerce operations require independent platform operator/admin authority and expose product launch gates, orders, fulfillment queues and return queues. Workspace membership is not sufficient authority.

## Current truthful state

The first ten records are candidates, not active products. The public catalog therefore remains empty until the sourcing gates pass. An empty verified catalog is an acceptable production state; fabricated inventory is not.
