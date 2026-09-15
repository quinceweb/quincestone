# Quincestone — Identity, Authorization and Data Ownership

**Status:** Canonical architecture contract  
**Scope:** All Quincestone products, applications, server routes, Supabase policies, Edge Functions, integrations and operational tooling  
**Repository:** `quinceweb/quincestone`

This document defines how Quincestone answers three questions consistently across every product surface:

1. **Who is this actor?** — identity
2. **What may this actor do here?** — authorization
3. **Who owns this record and which system is authoritative for it?** — data ownership

It extends the existing identity, domain-model and security contracts. It does not replace the principle that authentication establishes identity while server-side authorization and Row Level Security (RLS) establish authority.

---

## 1. Core law

Quincestone operates as **one product ecosystem over one governed backend boundary**.

A person may move between Corporate, Shop, Account, Business, Deals and Admin, but that movement does not create new identities and never increases authority by itself.

The canonical chain is:

```text
Authenticated principal
        ↓
Canonical Quincestone identity
        ↓
Relationship / membership lookup
        ↓
Role + policy + resource ownership
        ↓
Server-side authorization
        ↓
RLS / database enforcement
        ↓
Permitted read or mutation
```

UI state, routes, query parameters, cookies, browser storage, hidden fields, form values and client-supplied IDs are not authority sources.

---

## 2. Identity model

### 2.1 Authentication principal

Supabase Auth is the currently inspected authentication authority for Quincestone.

`auth.users.id` is the canonical authentication principal identifier where Supabase Auth is in use.

Authentication answers only:

> Which authenticated principal is making this request?

It does **not** answer:

- which business the person may operate,
- which customer records they own,
- whether they are an operator,
- whether they may approve or execute an action,
- whether they may access another person's data.

### 2.2 One human, one canonical identity

A Quincestone user should not acquire unrelated identity records because they use multiple products.

The same authenticated principal may have several relationships:

```text
Person
├── Individual customer relationship
├── One or more business/workspace memberships
├── Deal-party relationships
└── Platform operator relationship, if separately granted
```

These relationships are separate authorization facts, not separate people.

### 2.3 Account is relationship, not elevated authority

`account.quincestone.com` is the individual relationship surface.

Account may expose profile, orders, saved items, addresses, payments, notifications, support and other individual-facing records when those records exist and the authenticated person is entitled to them.

Being signed in to Account does not grant Business or Admin authority.

### 2.4 Cross-product navigation

Safe navigation between Quincestone products may preserve intent, but never authority.

Examples:

- Shop → Account
- Account → Shop
- Account → Business
- Deals → Account

Return destinations must be allowlisted. A `return_to`, `next`, host name, path, workspace ID or product selector is routing input only.

---

## 3. Actor classes

Quincestone recognizes distinct actor classes. A single person may belong to more than one class, but each class must be proven independently.

| Actor | Meaning | Authority source |
| --- | --- | --- |
| Anonymous visitor | Unauthenticated public user | Public route/policy only |
| Authenticated individual | Signed-in person | Supabase Auth principal |
| Customer | Person linked to customer/commerce records | Server/database relationship |
| Business member | Person belonging to a business/workspace | Canonical membership record |
| Business owner/admin | Member with elevated workspace role | Canonical membership + role |
| Deal participant | Authorized party to a deal | Deal-party relationship + policy |
| Platform operator | Internal Quincestone operator | Separate platform-operator authorization |
| Service principal | Trusted server/service runtime | Server-held credential + explicit scope |
| External provider | Stripe, email, commerce or other provider callback | Verified provider signature / trusted integration |

No actor class may be inferred from frontend presentation alone.

---

## 4. Authorization model

Every consequential operation must be evaluated as:

```text
principal × relationship × role × resource × action × state × policy
```

Authorization must answer all of the following where applicable:

1. Is the principal authenticated?
2. Does the principal have a relationship to the resource?
3. Is the requested resource inside the correct customer/workspace/deal boundary?
4. Does the actor's role permit the requested action?
5. Does the resource lifecycle state permit the action?
6. Does policy require human review or stronger authority?
7. Does RLS/database enforcement agree with the server decision?

A route-level authorization check is not sufficient if the database policy permits broader access.

A database policy is not sufficient if privileged server code bypasses it without reproducing equivalent authorization intentionally.

---

## 5. Role model

Roles are capabilities inside a defined scope. They are not global identity labels.

### 5.1 Individual scope

An authenticated individual may manage only records that are canonically related to that individual, subject to domain-specific rules.

Typical individual capabilities may include:

- read/update own profile,
- manage own addresses,
- view own orders and payment records,
- create/view own support requests,
- manage own saved items and preferences.

### 5.2 Business/workspace scope

Business authority must be derived from a canonical workspace/business membership lookup.

Recommended conceptual role families:

- `member`
- `operator`
- `admin`
- `owner`

Exact persisted role values remain subordinate to the deployed schema. New code must not invent parallel role vocabularies without an architecture decision.

### 5.3 Platform scope

Quincestone Admin is a separate control-plane boundary.

Business ownership does not imply platform-operator access.

Platform operator authority must be granted and checked independently from customer/business membership.

### 5.4 Service scope

Service-role or equivalent privileged credentials are infrastructure capabilities, not human roles.

They must:

- remain server-side,
- be used only where a trusted backend workflow requires them,
- never be exposed in browser variables,
- never be treated as proof that the requesting human is authorized,
- perform explicit authorization before consequential user-initiated mutations.

---

## 6. Data ownership doctrine

Every durable record must have an unambiguous ownership model.

Ownership may be:

1. **Person-owned** — belongs to an individual relationship.
2. **Customer-owned** — belongs to a commerce customer.
3. **Workspace-owned** — belongs to a business/workspace.
4. **Deal-owned** — belongs to a negotiated commercial record and its authorized parties.
5. **Platform-owned** — internal Quincestone operational/control-plane state.
6. **Provider-authoritative** — Quincestone stores a representation, but an external provider is authoritative for a specific fact.
7. **Shared/reference** — globally readable reference data with controlled mutation.

A record must not be simultaneously treated as person-owned and workspace-owned without an explicit relationship model.

---

## 7. Canonical ownership map

This matrix defines the intended ownership boundary. Existing deployed schema names remain authoritative; this document defines the governing relationship rather than forcing table renames.

| Domain object | Canonical owner | Primary readers | Primary writers | Authority notes |
| --- | --- | --- | --- | --- |
| Auth principal | Supabase Auth | Principal, trusted server | Auth system | Not application-owned profile data |
| Individual profile | Person | Same person, authorized operator where justified | Same person / trusted server | Must map to authenticated principal |
| Customer | Customer relationship / person | Same customer, trusted commerce server, authorized operator | Trusted commerce workflow | Customer identity must not be selected arbitrarily by browser input |
| Address | Customer/person | Same owner | Same owner / trusted server | Ownership inherited through customer/person relation |
| Saved item | Person/customer | Same owner | Same owner | No cross-user reads |
| Notification preference | Person | Same owner | Same owner | Delivery systems may read server-side |
| Support request | Requesting person/customer or workspace | Requester, authorized operator | Requester; operator for review state | Internal notes require separate visibility boundary |
| Product/catalog record | Platform/commerce domain | Public or authenticated per product | Trusted commerce/admin workflow | Public visibility does not imply public mutation |
| Cart | Person/session/customer | Owning actor | Owning actor / commerce server | Session-to-account merge must preserve ownership |
| Order | Customer | Owning customer, trusted commerce server, authorized operator | Trusted commerce workflow/provider reconciliation | Browser cannot mark paid/fulfilled |
| Payment representation | Customer/order | Owning customer, trusted server/operator | Trusted server/provider reconciliation | Payment provider remains authoritative for provider payment result |
| Fulfillment | Order/customer | Owning customer, operator | Trusted fulfillment workflow | State must follow verified fulfillment actions |
| Return/refund | Order/customer | Owning customer, operator | Customer request + trusted operator/provider mutation | Refund completion requires provider confirmation |
| Business/workspace | Workspace | Authorized members, platform operator where justified | Workspace-authorized server workflow | Membership is the authority gateway |
| Workspace membership | Workspace + person relationship | Relevant member/admin/operator | Authorized membership management workflow | Browser role claims are never trusted |
| Interaction | Workspace/customer context | Authorized workspace members | Authorized workflow | Preserve source facts separately from derived intelligence |
| Knowledge/policy | Workspace | Authorized workspace members | Authorized role | Policy mutation should require elevated workspace authority where consequential |
| Workflow/routing record | Workspace | Authorized members | Authorized server workflow | Execution authority remains explicit |
| Proposed action | Workspace | Authorized members/reviewer | Trusted workflow | Proposal is not execution |
| Human review | Workspace/platform according to domain | Authorized reviewer + permitted members | Authorized reviewer only | Human decision remains distinct from Edge output |
| Assessment | Submitter relationship + Quincestone review boundary | Submitter where supported, authorized operator | Submission workflow; operator review workflow | Client signal is not final decision |
| Deal | Deal/business context | Authorized deal parties and operators | Authorized deal workflow | Private deal links must not substitute for server authorization once authenticated context exists |
| Deal message/revision | Deal | Authorized deal parties | Authorized deal parties | Audit/history should be append-preserving where required |
| Proposal | Workspace/deal/business context | Authorized parties/operators | Authorized workflow | Approval and acceptance are explicit state transitions |
| Audit/event record | Owning domain/platform | Authorized members/operators | Trusted server only | Clients should not directly write canonical audit history |

---

## 8. Product boundary matrix

Applications are views and operating surfaces over shared governed data. They are not independent authorities.

| Surface | Primary identity context | May access | Must not assume |
| --- | --- | --- | --- |
| `quincestone.com` | Anonymous or authenticated visitor | Public institutional content, explicit public submission flows | Business/admin authority |
| `shop.quincestone.com` | Visitor/customer | Catalog, cart, customer-owned commerce records | Payment success, operator authority |
| `account.quincestone.com` | Authenticated individual | Individual/customer-owned relationship data | Workspace role, platform operator role |
| `app.quincestone.com` | Authenticated business member | Workspace-scoped operational records | Membership from URL/browser state alone |
| `admin.quincestone.com` | Authenticated platform operator | Explicitly authorized control-plane/customer/workspace views | Authority from ordinary authentication alone |
| Quincestone Deals | Authenticated/authorized deal participant | Deal-scoped records | Access from possession of an arbitrary record ID alone |

No application may create its own shadow identity system to bypass the canonical backend relationship model.

---

## 9. RLS contract

RLS is a required final boundary for browser-accessible production data where Supabase/PostgREST access is exposed.

### Required properties

- Default deny unless access is intentionally granted.
- `anon` receives only deliberately public access.
- `authenticated` access is scoped by canonical ownership/membership relationships.
- Workspace data is constrained by membership.
- Customer data is constrained by authenticated customer relationship.
- Platform-operational data is not exposed to normal customer roles.
- Canonical audit/event ledgers do not accept arbitrary client writes.
- Consequential writes should prefer trusted server transactions/functions with explicit authorization.

### RLS tests that should exist for material domains

For each sensitive domain, verify at least:

1. User A can access User A's permitted record.
2. User A cannot access User B's record.
3. Member A can access Workspace A according to role.
4. Member A cannot access Workspace B without membership.
5. Ordinary authenticated users cannot gain Admin authority.
6. Anonymous users cannot perform restricted writes.
7. Browser-supplied owner/workspace IDs cannot reassign ownership.
8. Service workflows cannot turn untrusted user input into authorization.

---

## 10. Mutation rules

### 10.1 Browser-safe mutations

A browser may directly perform a mutation only when:

- the operation is intentionally client-accessible,
- RLS fully constrains ownership and scope,
- no trusted provider secret is required,
- no consequential authority decision is being made,
- the mutation cannot forge financial, administrative or audit truth.

### 10.2 Server-required mutations

Use trusted server routes, Edge Functions, transaction functions or equivalent for:

- payment creation/reconciliation,
- webhook processing,
- role/membership administration,
- operator decisions,
- human-review decisions,
- provider-backed execution,
- canonical audit/event creation,
- state transitions with cross-table invariants,
- privileged Admin operations.

### 10.3 Human authority

Where policy requires human review, automation may structure, classify, summarize or recommend, but must not mark the consequential action as human-approved unless an authorized human decision was actually recorded.

---

## 11. Provider authority

External providers may be authoritative for specific facts while Quincestone remains authoritative for the surrounding business record.

Examples:

- **Stripe** may be authoritative for payment execution/result.
- **Email provider** may be authoritative for delivery outcome.
- **Commerce provider** may be authoritative for provider-owned catalog/order facts where the integration contract explicitly says so.

Provider callbacks must be authenticated/verified according to provider capabilities before updating trusted Quincestone state.

A browser redirect, success query string or optimistic UI state is never sufficient proof of provider completion.

---

## 12. Derived intelligence versus source truth

Quincestone must preserve the distinction between:

```text
Source fact
Derived signal
Policy evaluation
Proposed action
Human decision
External execution
Observed outcome
```

Derived intelligence must not overwrite source facts.

A model-generated or rules-generated recommendation does not become an approved action merely because it is persisted.

This distinction applies especially to Edge, assessments, qualification, routing, proposals and operational recommendations.

---

## 13. Lifecycle authority

Lifecycle state is server-authoritative when it controls access, money, fulfillment, review, approval or operational execution.

The client may request transitions; it must not self-certify them.

Examples:

- checkout requested ≠ payment confirmed,
- assessment submitted ≠ reviewed,
- proposal created ≠ approved,
- deal shared ≠ accepted,
- refund requested ≠ refunded,
- action proposed ≠ executed.

State transitions should be explicit and auditable where they matter.

---

## 14. Auditability

Consequential changes should preserve enough information to answer:

- who initiated the action,
- under which identity and scope,
- which resource was affected,
- what authorization path permitted it,
- what state changed,
- whether human approval was required,
- which provider was involved,
- what external result was confirmed,
- when the change occurred.

Audit records are evidence, not editable UI decoration.

Canonical audit/event records should be written by trusted backend workflows, not arbitrary browser clients.

---

## 15. Data minimization and privacy boundaries

Applications should request and expose only the data required for the current product journey.

Rules:

- Do not expose internal operator notes to customers unless explicitly designed for shared visibility.
- Do not expose another customer's identity through joins, errors, logs or lookup endpoints.
- Do not duplicate sensitive identity data across product-specific tables without necessity.
- Do not persist secrets, access tokens or provider credentials in user-facing records.
- Do not log full sensitive payloads when structured identifiers and event metadata are sufficient.
- Retention/deletion requirements must be defined by the data-retention/privacy contract and implemented consistently across providers.

---

## 16. Cross-product identity rules

### Shop ↔ Account

Shop commerce records should resolve to the canonical customer/person relationship where authenticated linkage exists.

Account is the canonical individual relationship environment; legacy Shop account paths may redirect or act as compatibility entry points but must not create a second identity source.

### Account ↔ Business

The same authenticated person may enter Business only after server-authoritative membership evaluation.

Account authentication alone does not prove workspace membership.

### Business ↔ Admin

Workspace owner/admin authority and Quincestone platform-operator authority are separate domains.

No workspace role may automatically grant Admin access.

### Deals ↔ Account / Business

A deal may be related to individuals, businesses or both. Access must derive from canonical party relationships and policy, not merely from a route parameter or shared client-side object.

---

## 17. Service-role doctrine

A privileged Supabase service role or equivalent trusted server credential may bypass RLS technically; therefore its use carries a higher authorization burden.

Any user-initiated privileged workflow must:

1. authenticate the initiating principal where authentication is required,
2. validate and normalize input,
3. resolve canonical ownership/membership server-side,
4. check role/policy,
5. perform the minimum privileged mutation,
6. record material state/audit evidence where required,
7. return only data the caller is entitled to see.

Service-role access is not a shortcut around authorization architecture.

---

## 18. Implementation decision table

Before introducing a new table, endpoint or mutation, answer:

| Question | Required answer |
| --- | --- |
| Who owns this record? | Person, customer, workspace, deal, platform, provider or shared/reference |
| How is the owner linked to `auth.uid()`? | Explicit canonical relationship |
| Who may read it? | Named actor classes / roles |
| Who may create it? | Named actor classes / trusted service |
| Who may update/delete it? | Explicit role + lifecycle conditions |
| Is RLS required? | Yes unless deliberately server-only/public reference data |
| Is a server transaction/function required? | Yes for privileged/consequential/provider-backed transitions |
| What is the system of record? | Quincestone or named provider for the specific fact |
| Is the state source, derived, proposed, approved or executed? | Exactly one clear classification |
| What audit evidence is required? | Defined before production use |

A domain is not ready for production if these answers are ambiguous.

---

## 19. Forbidden patterns

Do not introduce:

- product-specific shadow user tables as independent identity authorities,
- authorization based only on frontend route guards,
- trust in browser-provided roles or owner IDs,
- cross-workspace access through guessable identifiers,
- broad authenticated `ALL` policies without ownership/membership predicates,
- service-role keys in frontend variables,
- browser-authored canonical audit events,
- payment success based only on redirect/query state,
- Admin access inherited from ordinary customer/business authentication,
- separate Deal/Shop/Account identity systems for the same person,
- duplicated provider truth that cannot be reconciled.

---

## 20. Verification standard

An identity or authorization claim is considered **verified** only when the relevant deployed path has been tested at the enforcing layer.

For high-value boundaries, verification should include real isolation tests using distinct principals/roles and cleanup of test fixtures.

Documentation, TypeScript types and UI guards are necessary but are not proof that deployed RLS or privileged server authorization is correct.

---

## 21. Change governance

Changes to identity, ownership, membership, RLS, platform roles or privileged mutation paths are architecture/security changes.

They require:

1. inspection of deployed schema/policies first,
2. smallest safe forward change,
3. migration or server-code review as appropriate,
4. isolation/authorization tests,
5. application regression checks,
6. deployment verification,
7. documentation update when the contract changes.

Do not rerun old migrations to recreate intended state. Use forward-only correction where live state requires change.

---

## 22. Canonical summary

Quincestone follows these permanent rules:

1. **One person does not become multiple identities because they use multiple Quincestone products.**
2. **Authentication proves identity, not authority.**
3. **Membership and ownership are server/database facts.**
4. **Roles are scoped capabilities, not browser claims.**
5. **RLS is a final browser-data boundary, not optional decoration.**
6. **Admin authority is separate from customer and business authority.**
7. **Service credentials never replace user authorization.**
8. **Every durable record has one explicit ownership model.**
9. **Provider-authoritative facts are confirmed by the provider, not the browser.**
10. **Source facts, derived intelligence, proposals, human decisions and execution remain distinct.**
11. **Consequential transitions are explicit, server-authoritative and auditable.**
12. **All Quincestone surfaces consume one governed backend relationship model.**

That is the identity, authorization and data-ownership contract for the Quincestone ecosystem.
