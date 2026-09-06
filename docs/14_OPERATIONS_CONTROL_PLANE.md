# Quincestone — P14 Operations Control Plane

## Purpose

The operations control plane is the internal authority surface for support, workflow oversight, exceptions, human review, integrations, and auditable consequential actions.

It is distinct from the customer/workspace application.

## Authority boundary

- `apps/app` is the authenticated workspace operating surface.
- `apps/admin` is the reserved internal control-plane boundary.
- Ordinary workspace membership must never imply administrator authority.
- Browser-provided workspace IDs, roles, or action parameters are selectors only; server-side authorization is authoritative.
- Consequential actions require explicit policy and, where configured, human review.

## Operational center

The control plane should prioritize durable records rather than synthetic dashboards:

1. unresolved human reviews;
2. failed Edge executions;
3. unresolved operational alerts;
4. integration failures and retries;
5. recent outcomes;
6. workflow state;
7. provider/system status where directly observable.

Zero activity is a valid state.

## Required capabilities

### Review queue

Show pending human decisions with workspace, interaction, reason, proposed action, priority, and timestamps. Decisions must use the existing authorization boundary and be auditable.

### Execution oversight

Show Edge execution state, trace identifiers, failures, retries, and outcome records without exposing chain-of-thought or provider secrets.

### Workflow oversight

Show workflow status and failed steps. Retrying a consequential operation must be idempotent and policy-controlled.

### Integration oversight

Show connected-system health only from observed provider/runtime state. Never manufacture a green state.

### Audit trail

Use canonical events as the durable history for consequential actions. The UI is a representation of authoritative state, not the authority itself.

## Implementation boundary

P14 establishes the control-plane contract and keeps the reserved `apps/admin` boundary explicit. It does not grant admin authority through workspace membership and does not invent an administrator identity source that is not yet implemented.

When `apps/admin` becomes executable, it must establish an independent administrator authorization check before rendering or mutating privileged state.

## Release rule

A control-plane feature is complete only when its authority source, data scope, mutation path, audit event, failure behavior, and verification state are explicit.