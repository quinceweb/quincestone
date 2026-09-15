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

The production ledger was reconciled on 2026-09-15 from starting `main`
`4b572ce269bef9e91de54b6295d837c94846ed37`.

- Ledger SQL was recovered verbatim for deployed-only human-review hardening,
  Shopify projection, ActionExecution, and QDE migrations.
- Both production versions named `action_execution_substrate` are preserved.
  Their stored SQL is identical; neither ledger row was removed or rewritten.
- Recovered files retain deployed 14-digit versions. Older repository files with
  shorter timestamps are retained as historical source and classified as
  normalized or superseded rather than renamed destructively.
- `execute-action` is represented by the exact deployed Edge Function source.
- Already-deployed recovered migrations were not re-applied.
- A forward migration, `harden_privileged_function_search_paths`, fixes the
  search path of the assessment review and alert-trigger functions without
  changing their bodies, grants, ownership, or authorization behavior.

Repository-only migrations must still be assessed against a clean replay; their
presence never authorizes applying them to production. The canonical authority
remains chronological SQL under `supabase/migrations`, reconciled against the
production ledger before release.

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

## Verified authority boundaries

- Account tables use authenticated self-access policies; account identity does
  not grant workspace or platform authority.
- Workspace access is resolved through database membership helpers and RLS.
- Platform operators are checked independently by `private.is_platform_operator`.
- ActionExecution claim/complete/fail RPCs are executable only by
  `service_role`; their privileged implementations have an empty search path.
- Human-review decisions require an authenticated workspace administrator.
- Assessment decisions require an authenticated platform operator.
- QDE draft, counteroffer, request, and decision RPCs require authentication
  and owner/creator or assigned-decision-maker authority as applicable.
- Shopify projection is downstream state. Quincestone remains commerce catalog
  authority and the public wrapper is an authenticated, security-invoker RPC.

All 55 inspected public tables had RLS enabled. Tables intentionally carrying no
client policy are server/internal boundaries with direct client privileges
revoked. RLS, grants, functions, indexes, triggers, storage policies, and Edge
Function deployment must be compared again after every database release.
