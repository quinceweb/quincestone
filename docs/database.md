# Quincestone — Database and Data Authority

**Authority:** deployed Supabase evidence and repository reconciliation

**Inspected:** 2026-09-15

## Project identity

The connected Supabase project was directly identified as **quincestone**, region `ca-central-1`, PostgreSQL 17, status `ACTIVE_HEALTHY`. This was not a Neptlium project. No credentials or connection strings were recorded.

Supabase Auth is the currently implemented identity provider. Authentication alone does not establish workspace or platform-operator authority.

## Deployed schema evidence

The inspected public schema has RLS enabled on every returned table. Deployed areas include:

| Domain | Deployed records/functions observed | Authority conclusion |
|---|---|---|
| Public intake | assessment, implementation, contact and demo records | **DEPLOYED**; public submission behavior must be verified separately |
| Business workspaces | workspaces, members, customers, interactions, knowledge, policies, reviews, events, alerts | **DEPLOYED**; workspace authorization remains server/RLS controlled |
| Admin | platform admins and audit events | **DEPLOYED**; ordinary membership is not operator authority |
| Commerce | products, variants, inventory, media, suppliers, carts, orders, payments, fulfillment, returns, refunds and audit | **DEPLOYED**; publication/payment/fulfillment authority varies by server/provider confirmation |
| Account | saved products, support requests and notification preferences | **DEPLOYED** |
| ActionExecution | action executions plus claim/complete/fail functions | **DEPLOYED**; provider execution must be proven per action |
| Deals / QDE | deals, participants, offers, terms, decisions and events plus deal RPCs | **DEPLOYED**; no persisted deals were present |

At inspection, almost all tables were empty. Ten internal commerce candidates, ten QA rows, one supplier row and one product-content row existed. These are internal records—not published products, inventory, customers or transactions.

Active Edge Functions observed: `calendar-health`, `calendar-availability`, `create-calendar-booking`, `cancel-calendar-booking`, `edge-intelligence`, `edge-workspace` and `execute-action`. Function deployment does not prove end-to-end provider execution.

## Repository-to-runtime reconciliation

The deployed migration ledger contains migrations for ActionExecution, assessment review, Account and QDE that are absent from the inspected `main` migration directory. Conversely, several timestamped files on `main` do not have an obvious one-to-one deployed-ledger filename because prior deployment tooling normalized versions/names.

**Status: BLOCKED — migration history is not fully reproducible from current `main`.**

Do not apply migrations to erase this discrepancy. First recover or reconstruct the exact deployed migrations in a focused database-reconciliation change, compare checksums/definitions, and establish an auditable baseline.

## RLS and RPC rules

- Browser-supplied IDs, roles, review states, prices and agreement/payment claims are untrusted input.
- Workspace records require authenticated principal plus server/database membership checks.
- Platform-admin authority is independent.
- Consequential RPCs require explicit grants, validation, authorization, idempotency and audit evidence.
- `SECURITY DEFINER` functions—observed for ActionExecution and assessment review operations—require focused search-path, grant and authorization review; their existence is not proof of safety.
- Human-review and deal decisions do not become authorized merely because a row or recommendation exists.

## Authoritative state

Supabase is authoritative only for the deployed records and constraints actually confirmed. Stripe remains payment-provider authority; provider results must be reconciled into Quincestone state. Browser state is temporary. Human operators remain authority for consequential decisions when policy requires review.

Repository migrations live in `supabase/migrations`; deployed migration state must be checked before every schema release.
