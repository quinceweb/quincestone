# Quincestone — Canonical Data, State & Event Architecture

## Purpose

P9 establishes the canonical language for durable business state, execution state, and events across Quincestone. The model keeps the public experience simple while making consequential operations traceable, replayable, and auditable.

## 1. Core entities

- **Workspace** — tenant boundary and authorization scope.
- **Customer** — durable customer identity owned by a workspace.
- **Interaction** — an inbound customer or system interaction; the durable entry point into Edge.
- **Intelligence Trace** — an execution record describing observed facts, intelligence outputs, policy decisions, routing, escalation, outcome, and execution version.
- **Knowledge Document** — governed workspace knowledge with version and lifecycle status.
- **Policy** — governed workspace rule with effect, priority, and lifecycle status.
- **Workflow** — executable operating definition referenced by routing/action decisions.
- **Human Review** — explicit authority boundary for consequential decisions.
- **Outcome** — the durable result of an interaction or workflow execution.
- **Event** — immutable fact that something happened or a durable state transition was recorded.

## 2. Ownership boundaries

Workspace owns tenant-scoped configuration and customer operational state. Edge owns execution orchestration. Intelligence produces derived signals, not authority. Policy determines constraints. Human Review owns consequential approvals or overrides. Providers execute only through server-side authorized boundaries. Events provide the audit trail and integration contract.

## 3. Interaction lifecycle

`received → understood → collecting → qualified → governed → routed → action_proposed → human_review → action_executed → outcome_recorded → closed`

Not every interaction reaches every state. A policy denial, qualification failure, or safe informational response may terminate earlier. States must be explicit rather than inferred from UI copy.

## 4. Execution state

Every governed Edge execution must have:

- stable execution/trace identifier;
- workspace or explicit demo mode;
- execution version;
- current status;
- timestamps;
- observed facts;
- derived intelligence;
- policy decisions;
- proposed action;
- human-review requirement and decision where applicable;
- executed action result where applicable;
- outcome;
- failure/retry information where applicable.

Internal reasoning or chain-of-thought is never persisted or exposed as an operational trace.

## 5. Event model

Events are append-only facts. Recommended envelope:

```text
id
occurred_at
workspace_id
aggregate_type
aggregate_id
event_type
schema_version
actor_type
actor_id
correlation_id
causation_id
idempotency_key
payload
```

`payload` contains the minimum durable data required to understand the event. Secrets, provider credentials, raw tokens, and hidden model reasoning are prohibited.

### Canonical event families

- `interaction.received`
- `interaction.state_changed`
- `edge.execution_started`
- `edge.execution_completed`
- `edge.execution_failed`
- `policy.evaluated`
- `action.proposed`
- `human_review.requested`
- `human_review.decided`
- `action.executed`
- `outcome.recorded`
- `workflow.started`
- `workflow.completed`
- `workflow.failed`
- `knowledge.version_published`
- `integration.action_requested`
- `integration.action_succeeded`
- `integration.action_failed`

## 6. State vs event

Current state is optimized for operational reads. Events are optimized for history and audit. Do not use a mutable status field as a substitute for an event history. Do not rebuild consequential state from an undocumented collection of logs.

## 7. Idempotency and retries

Provider and workflow actions must carry an idempotency key derived from the durable execution/action identity. Retries may repeat transport attempts but must not create duplicate business outcomes. A successful external action must be recorded before a subsequent retry can be considered safe.

## 8. Authority order

1. Authenticated principal and server-side authorization
2. Durable workspace state
3. Explicit policy
4. Human decision when review is required
5. Proposed action
6. Provider execution result
7. Derived intelligence
8. UI representation

The UI never becomes the source of truth for authorization, payment, execution, or outcome.

## 9. Demo boundary

Demo traces remain explicitly non-production. Demo mode cannot write to customer operational state or invoke real calendar, Stripe, messaging, CRM, webhook, or other production side effects.

## 10. Migration rule

P9 should extend the existing schema rather than duplicate it. Existing `interactions`, `intelligence_traces`, `knowledge_documents`, `policies`, workspace, customer, and human-review foundations remain canonical. New event/state tables should be introduced only where they close an identified durability or audit gap.

## Release gate

P9 is complete when the same lifecycle terminology is used consistently across Edge, application UI, database state, events, workflows, and operational traces; consequential transitions are durable and auditable; retries are idempotent; and no UI or model output is treated as authoritative state.
