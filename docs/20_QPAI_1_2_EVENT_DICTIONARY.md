# QPAI 1.2 — Canonical Product Event Dictionary

**Status:** Proposed specification; not implementation evidence  
**Baseline:** `6e1f9615f747788c318e7d5d098e374e4d9dbce5`  
**Provider target:** Statsig  
**Owner:** Quincestone product/platform architecture

## 1. Purpose and authority

This dictionary defines the product-measurement events Quincestone may send to Statsig. It does not replace the canonical Supabase business-event model, product audit records, payment records, or operational traces.

- `public.events` remains the durable, workspace-scoped business-event ledger.
- `public.deal_events` remains the durable QDE deal-history stream.
- `public.action_executions`, `public.interactions`, and `public.intelligence_traces` remain authoritative for their respective operational states.
- Statsig receives a minimized, derived measurement stream for product analysis and experimentation only.
- Client-side events describe observed UI behavior. They never prove a consequential business outcome.

The current production snapshot observed zero rows in `public.events`, `public.interactions`, `public.action_executions`, `public.integration_events`, and `public.demo_events`; it observed two `intelligence_traces`. Those counts are a point-in-time snapshot, not a claim that no activity exists elsewhere.

## 2. Event naming

Use lowercase dot-separated names:

`<product>.<object_or_journey>_<past_tense_action>`

Product namespaces:

- `corporate`
- `business_os`
- `shop`
- `deals`
- `account`
- `admin`

Names describe facts that occurred, not commands or intended future actions. Do not reuse an event name with a different meaning. Breaking semantic changes require a new event name or an approved schema version change.

## 3. Shared event envelope

Every event sent through the Quincestone adapter must conform to this logical contract:

| Field | Type | Required | Rule |
|---|---|---:|---|
| `event_name` | string | yes | Registered name from this dictionary |
| `schema_version` | integer | yes | Starts at 1 |
| `product` | enum | yes | One of the six product namespaces |
| `environment` | enum | yes | `development`, `staging`, `production` |
| `source` | enum | yes | `client` or `server` |
| `occurred_at` | ISO timestamp | yes | Event occurrence time |
| `event_id` | opaque ID | yes | Unique delivery/deduplication identity |
| `actor_id` | pseudonymous string | conditional | Never raw Supabase Auth UUID, email, or username |
| `workspace_id` | pseudonymous string | conditional | Never raw workspace UUID |
| `session_id` | opaque string | conditional | Only where consent and product purpose allow |
| `route_key` | registered route key | conditional | Template/key only; never full URL or query string |
| `metadata` | object | yes | Allowlisted, low-cardinality properties only |

The adapter may translate this envelope into Statsig's SDK `logEvent(eventName, value, metadata)` interface. It must not serialize the entire envelope blindly or pass arbitrary caller-supplied objects.

## 4. Event registry

The events below are proposed measurement events unless explicitly marked as an existing source event. A proposal is not evidence that the event is currently emitted or that the corresponding product journey is production-ready.

### 4.1 Corporate — acquisition and discovery

| Event | Trigger | Source | Allowed metadata |
|---|---|---|---|
| `corporate.page_viewed` | Consent-approved view of a registered public route | client | `route_key`, `page_group` |
| `corporate.product_viewed` | User opens a product detail/overview | client | `product_key`, `route_key` |
| `corporate.assessment_started` | Assessment flow begins | client | `assessment_type` |
| `corporate.assessment_submitted` | Server confirms a valid assessment submission | server | `assessment_type`, `submission_channel` |
| `corporate.demo_started` | Demo session starts | client | `demo_key`, `demo_mode` |
| `corporate.demo_completed` | Demo completion criteria are met | server/client by verified contract | `demo_key`, `completion_state` |
| `corporate.contact_submitted` | Server confirms valid contact submission | server | `form_key`, `submission_channel` |

Do not send form values, contact details, free-text messages, full referrer URLs, or arbitrary campaign query parameters. Attribution fields require a separately approved allowlist.

### 4.2 Business OS — workspace adoption and operation

| Event | Trigger | Source | Authority / notes |
|---|---|---|---|
| `business_os.onboarding_started` | Authenticated user begins onboarding | client | Product engagement only |
| `business_os.workspace_created` | Workspace creation transaction succeeds | server | Never infer from a button click |
| `business_os.business_profile_completed` | Required profile state is durably saved | server | Send completion category only |
| `business_os.edge_installation_created` | Edge installation is durably created | server | Map from canonical event |
| `business_os.edge_installation_enabled` | Installation becomes active | server | Existing canonical source name: `edge.installation_enabled` |
| `business_os.edge_installation_disabled` | Installation is disabled | server | Existing canonical source name: `edge.installation_disabled` |
| `business_os.edge_installation_revoked` | Installation is irrevocably revoked | server | Existing canonical source name: `edge.installation_revoked` |
| `business_os.interaction_received` | Durable interaction record is created | server | Map from documented canonical family `interaction.received`; emitted status must be verified |
| `business_os.workflow_started` | Durable workflow execution begins | server | Requires authoritative workflow execution record |
| `business_os.workflow_completed` | Workflow reaches verified completed state | server | Not a UI completion event |
| `business_os.human_review_decided` | Human decision transaction commits | server | Do not send decision reason or proposed-action payload |
| `business_os.action_execution_succeeded` | Provider result is verified and persisted as success | server | Source from authoritative action execution result |
| `business_os.action_execution_failed` | Action execution is durably marked failed | server | Send safe error category only |
| `business_os.outcome_recorded` | Canonical outcome is durably recorded | server | Outcome category only; no free text |

The repository documents canonical event families such as `interaction.received`, `workflow.started`, `human_review.decided`, `action.executed`, and `outcome.recorded`. Their documentation does not by itself prove every producer is implemented. The only directly confirmed emitted event names in the inspected Edge installation migration are `edge.installation_created`, `edge.installation_enabled`, `edge.installation_disabled`, `edge.installation_revoked`, and `edge.installation_updated`.

### 4.3 Shop — commerce discovery and conversion

| Event | Trigger | Source | Allowed metadata |
|---|---|---|---|
| `shop.product_viewed` | Product detail viewed | client | `product_key`, `category_key` |
| `shop.collection_viewed` | Collection viewed | client | `collection_key` |
| `shop.add_to_cart` | Cart addition confirmed in UI/cart state | client | `product_key`, `quantity_band` |
| `shop.checkout_started` | Checkout flow begins | client | `cart_size_band`, `currency` |
| `shop.order_created` | Canonical order is persisted | server | `currency`, `item_count_band` |
| `shop.payment_succeeded` | Stripe-confirmed payment result is reconciled to the canonical order | server | `currency`, `item_count_band` |
| `shop.payment_failed` | Verified payment failure is reconciled | server | `failure_category`; never provider payload or payment details |

A client-side checkout completion page is not evidence of payment success. Stripe remains authoritative for provider payment state; Supabase remains authoritative for the Quincestone order and reconciliation record.

### 4.4 Deals / QDE — negotiated commerce

| Event | Trigger | Source | Notes |
|---|---|---|---|
| `deals.deal_created` | Deal record and creation event commit | server | Existing `deal_events.event_type = deal_created` |
| `deals.offer_created` | Offer creation commits | server | Existing `deal_events.event_type = offer_created` |
| `deals.offer_superseded` | Prior offer is superseded | server | Existing `deal_events.event_type = offer_superseded` |
| `deals.counteroffer_submitted` | Counteroffer is durably created | server | Map from approved deal/offer state |
| `deals.decision_requested` | Decision request is persisted | server | No decision rationale |
| `deals.decision_recorded` | Decision is durably recorded | server | Decision category only |
| `deals.agreement_reached` | Agreement state is committed under the deal authority model | server | Never infer from offer acceptance UI |
| `deals.transaction_completed` | Transaction completion is verified and persisted | server | Outcome category only |

The `deal_events` table is a product history source, not a Statsig event sink. The inspected migration confirms the table and the event names above marked existing; the remaining names are proposed and require producer-level verification before use.

### 4.5 Individual Account — account engagement

| Event | Trigger | Source | Notes |
|---|---|---|---|
| `account.onboarding_started` | Onboarding flow begins | client | Do not log credentials |
| `account.profile_completed` | Approved profile fields are saved | server | No profile values |
| `account.preference_updated` | Non-sensitive preference change is persisted | server | Allowlisted preference key only |
| `account.order_history_viewed` | Order history route viewed | client | No order IDs or details |
| `account.deal_activity_viewed` | Deal activity route viewed | client | No deal IDs, values, or counterparty data |

Authentication success/failure, password recovery, MFA, security events, and identity-provider details belong in security/audit systems. They are not included in this product-analytics dictionary by default.

### 4.6 Admin — restricted internal usage

Admin analytics are deferred from the first pilot. If later approved, only coarse internal product-usage events may be considered:

- `admin.dashboard_viewed`
- `admin.feature_used`
- `admin.report_viewed`

Do not send operator identifiers, support-case details, customer records, moderation decisions, security events, evidence contents, or privileged command payloads. Existing platform audit events remain the authority for privileged actions.

## 5. Event source and mapping rules

1. Client events record UI observations only.
2. Server events are emitted only after the authoritative transaction or provider result is committed.
3. Do not call Statsig from a Postgres trigger or make Statsig availability a condition for a business transaction.
4. Do not mirror all rows from `public.events` to Statsig. Map only explicitly approved event types.
5. Map source event names to stable product analytics names in a versioned registry.
6. Keep canonical event names unchanged; a Statsig naming decision must not cause a database migration.
7. Do not send demo events as production events. Include a distinct `demo` environment or exclude them from production reporting.
8. Unknown or unregistered event names are rejected by the adapter.

## 6. Metadata allowlist

Initial common properties:

- `product`
- `environment`
- `schema_version`
- `route_key`
- `feature_key`
- `journey_key`
- `source`
- `result_category`
- `currency` only where explicitly approved
- coarse count/size bands where explicitly approved

Avoid unbounded/high-cardinality properties. No arbitrary metadata passthrough.

## 7. Event quality

- Every registered event has one trigger definition and one source of truth.
- Event names use past tense and stable semantics.
- Events are not emitted for failed client-side attempts unless a specific failure metric is approved.
- Event retries reuse the same `event_id`.
- Client event failures never block rendering or interaction.
- Server event failures never roll back a successful business transaction.
- Event volume, conversion, and retention metrics must distinguish missing instrumentation from a true zero.

## 8. Acceptance gate

The dictionary is implementation-ready when product owners approve each event's definition, trigger, source, allowed metadata, privacy class, and KPI use; every server event has a verifiable durable source; and the adapter rejects unregistered or disallowed fields.
