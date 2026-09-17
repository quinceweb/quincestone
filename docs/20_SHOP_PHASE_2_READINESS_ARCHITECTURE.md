# Quincestone Shop Phase 2 — Readiness Architecture

## Status

Phase 2 is **IN PROGRESS**. The first implemented vertical slice is a deterministic, explainable readiness brief over the publication-gated catalog. This document does not upgrade deferred capabilities to implemented status.

## Implemented slice

`/build-your-kit` collects purpose, household context, climate, concerns and a product-price ceiling. The browser passes this context to a pure recommendation function. That function can return only products already present in `commerce_catalog`, with a priced variant, a supported collection mapping and a price inside the selected ceiling.

Each result separates:

- the rules that caused the match;
- contextual answers that were collected;
- attributes the public product record cannot yet support;
- a direct link to the published product record.

No model-generated claim, unpublished product, internal sourcing candidate, safety guarantee or arbitrary readiness percentage enters the result.

## Authority boundary

The first slice is intentionally session-only. It does not create a customer record, claim authentication, write to Supabase, register an owned system or send notifications. Product publication, price and checkout remain server-authoritative.

Future persistence belongs to Quincestone Account and requires an authenticated customer, owner-scoped RLS, explicit consent, versioned recommendation inputs and an immutable explanation snapshot. It must not trust a browser-supplied customer ID, product eligibility decision, price or readiness state.

## Metadata gap

The current public catalog supports collection and priced variants, but it does not yet publish governed recommendation attributes for household size, children, pets, climate, concern coverage, duration or replacement intervals. Those answers therefore do not affect eligibility in the first slice. The UI discloses that limitation.

Before those attributes influence a result, the Commerce OS must define their authority, validation, publication gate and public projection. A production schema migration is not part of this slice.

## Next vertical slices

1. Governed recommendation metadata and eligibility projection.
2. Account-owned readiness-system persistence with owner-scoped RLS.
3. Registered owned-product/module state derived from verified orders.
4. Replacement and replenishment schedules derived only from published component metadata.
5. Consent-aware reminders and ReadyCare evaluation.
6. Human-reviewed Business/Fleet requirements and quote workflow.

Readiness remains product organization and lifecycle support. It is never a guarantee of safety, survival, medical performance or risk elimination.
