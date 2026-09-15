# One Quincestone Backend

**Authority:** hard architectural boundary

Quincestone uses one shared Supabase backend for every product and operational surface: institutional Web, Shop, Account, Business OS, Deals/QDE, Admin, Core, Edge, and future Quincestone products.

## Non-negotiable boundary

One backend means:

- one canonical Supabase project named `quincestone`;
- one Supabase Auth identity authority;
- one controlled migration history in `supabase/migrations`;
- one canonical entity model and one record for each real-world entity;
- one shared event, outcome, trace, and audit foundation;
- shared Core capabilities and server-side provider adapters;
- product-bounded schemas, tables, functions, grants, and RLS policies; and
- explicit ownership for every cross-product entity and transition.

Separate Supabase projects or independent product databases are prohibited unless an exceptional regulatory, regional, security, or scale requirement is formally approved in an architecture decision record. An approved exception must define synchronization, identity, event, audit, residency, recovery, and decommissioning behavior; it must not silently create a competing source of truth.

One backend does not permit unrestricted product access, a giant undifferentiated schema, privileged browser access, Admin authority derived from a customer role, or arbitrary cross-product mutation. External providers never become Quincestone's canonical data model.

## Access boundaries

| Boundary | Allowed | Prohibited |
|---|---|---|
| Public browser | Publishable key; narrowly constrained public RPCs and policies | Secret/service-role key, operator authority, trusted financial or review state |
| Authenticated client | Supabase Auth session; RLS-limited self or workspace access | Inferring platform authority from authentication; bypassing server transitions |
| Trusted server | Validate identity/input/authorization; enforce idempotency; transition consequential state; invoke providers; record evidence | Trusting browser roles, prices, approvals, provider results, or completion claims |
| Authorized Admin | Separately verify platform-operator authority; issue audited server commands | Deriving operator authority from Account identity or workspace membership |

Publishable keys identify public application components; they do not authorize business actions. Secret and legacy `service_role` credentials bypass RLS and must remain in controlled server environments. RLS is mandatory on exposed data, and privileged functions require explicit grants, safe search paths, internal authorization, idempotency where relevant, and audit evidence.

## Product and Core ownership

| Owner | Canonical responsibility |
|---|---|
| Account | Individual relationship experience |
| Business OS | Workspace and business operating experience |
| Shop | Fixed-price commerce experience |
| Deals/QDE | Negotiated-commerce experience |
| Admin | Internal Quincestone control |
| Core | Shared intelligence, knowledge, policy, workflow, execution, events, outcomes, and trace contracts |
| Supabase | Shared authoritative backend underneath all owners |

Each real-world person, organization, workspace, product, customer relationship, order, payment reconciliation, assessment origin, deal, agreement, authorized action, provider execution, outcome, and audit trail has one canonical record. Product-specific projections and views are allowed only when their source, owner, refresh behavior, and mutation restrictions are explicit.

## Cross-product contract

Products exchange identifiers and use governed server functions, events, and state transitions. They do not copy canonical entities into competing stores.

- Account identity → Shop customer relationship → Order → Account order history.
- Account identity → Deal participant → Negotiation → Agreement → Transaction → Outcome.
- Account identity → Workspace membership → Business OS → Workflow → Human Review → Authorized action → Outcome.
- Assessment → Human Review → Opportunity → Proposal → Workspace or engagement.

Every consequential flow follows:

**Quincestone intent → server authorization → provider adapter → external provider → verified provider result → canonical Supabase record → event → outcome → trace**

## Provider reconciliation

- Stripe owns payment-provider state; Supabase owns canonical Quincestone orders, deals, reconciliation, workflows, and outcomes.
- Resend owns email delivery; Supabase records notification intent, delivery reference/status, and related business context where implemented.
- Colibrì is a replaceable IntelligenceProvider; Supabase records approved context, policy boundaries, classifications, decisions, and traces.
- Ever Gauzy is a replaceable BusinessProvider; Supabase records Quincestone workflow, authorization, provider execution, result, and outcome.

## Verification and migration rule

Repository source never proves deployment. Before any deployed-state claim or migration release, tooling must identify the connected project name as exactly `quincestone` and reconcile its migration ledger with `supabase/migrations`. Never apply Quincestone SQL to Neptlium or any other project. If the exact project cannot be exposed and verified, stop and report:

> ONE QUINCESTONE BACKEND ARCHITECTURE — DEFINED  
> QUINCESTONE SUPABASE PROJECT — NOT VERIFIED / ACCESS BLOCKED

