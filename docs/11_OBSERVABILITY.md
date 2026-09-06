# P11 — Observability & Operational Signals

## Purpose

Quincestone observability must answer three questions without inventing data:

1. Is the system functioning?
2. What is happening operationally?
3. What requires a human decision or intervention?

Observability is evidence, not decoration. Dashboards and alerts may only represent observed runtime state or explicitly derived measurements from durable events.

## Signal layers

### 1. Runtime health

Provider and application health signals include deployment state, function errors, request failures, latency, database health, and integration failures where those signals are actually available.

Runtime health must distinguish:
- healthy
- degraded
- failing
- unknown

Unknown is a valid state. Missing telemetry must never be rendered as healthy.

### 2. Business events

The canonical `public.events` stream is the source for durable business-event analytics. Relevant event families include interaction state changes, Edge execution, policy evaluation, human review, action execution, outcomes, workflows, and integration actions.

Derived analytics must preserve:
- event time
- workspace scope
- event type
- correlation ID
- aggregate identity
- schema version

### 3. Operational alerts

Alerts represent actionable conditions, not arbitrary thresholds displayed for appearance. Each alert records its source, severity, lifecycle state, workspace scope where applicable, deduplication key, and evidence reference.

Alert lifecycle:
`open → acknowledged → resolved`

An alert may also be `suppressed` when a known condition is intentionally muted. Suppression must remain auditable.

## Canonical operational signal contract

Every durable operational alert should contain:

- `id`
- `workspace_id` when workspace-scoped
- `source`
- `signal_type`
- `severity`
- `status`
- `title`
- `description`
- `deduplication_key`
- `correlation_id`
- `evidence`
- `first_seen_at`
- `last_seen_at`
- `acknowledged_at`
- `resolved_at`
- `created_at`
- `updated_at`

Evidence is structured metadata, not secrets and never chain-of-thought.

## Truth rules

- Never fabricate uptime, volume, conversion, latency, revenue, customer activity, or operational success.
- A zero count means zero observed records, not proof that a system has never been used outside the observed dataset.
- Missing telemetry is `unknown`, not `0` or `healthy`.
- Demo activity remains isolated and clearly identified as demo activity.
- Provider dashboards remain authoritative for provider-specific health where Quincestone does not ingest the underlying telemetry.
- Payment state remains Stripe-authoritative.
- Authorization remains server/database authoritative.
- Human review remains an explicit authority boundary.

## Alert ownership

- Application/runtime signals: engineering/operations
- Workspace workflow signals: workspace operators
- Integration failures: operations with provider-specific escalation
- Security signals: security/engineering
- Payment failures: payment/operations boundary; Stripe remains authoritative

## Privacy and security

Operational telemetry must minimize personal data. Store references and structured facts needed to investigate a condition rather than message bodies, credentials, access tokens, or chain-of-thought.

Workspace-scoped signals require workspace authorization. Internal/global operational signals must not be exposed through ordinary workspace routes.

## Release gate

P11 is complete only when:

- runtime health has truthful states;
- durable business-event analytics have a canonical source;
- actionable alerts have a durable lifecycle;
- alerts are deduplicated and auditable;
- workspace boundaries are enforced;
- no synthetic production metrics are presented;
- production verification confirms the deployed observability behavior.
