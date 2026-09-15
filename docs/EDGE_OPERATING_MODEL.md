# Quincestone Edge Operating Model

Edge is a governed Core capability on the shared `quincestone` Supabase backend. It never creates a separate product database or identity authority; its durable inputs, decisions, executions, events, outcomes, and traces use canonical records under the [One Quincestone Backend](03_ONE_QUINCESTONE_BACKEND.md) boundary.

## Purpose

Quincestone Edge is the governed operating layer between customer interaction and business action. It is not a generic chatbot and it is not an autonomous authority.

The canonical Core loop is:

**DEMAND → INTERACTION → EDGE → UNDERSTAND → QUALIFY → KNOWLEDGE → POLICY → WORKFLOW → HUMAN DECISION → AUTHORIZED ACTION → PROVIDER → OUTCOME → TRACE → LEARNING**

Each stage produces structured state that can be inspected, audited, and handed to the next stage. Consequential actions remain behind explicit authorization and human-review boundaries.

## Stage contract

| Stage | Responsibility | Boundary |
|---|---|---|
| Demand | Establish the need or opportunity entering the ecosystem | Demand is not proof of intent or authority |
| Interaction | Receive the request and identify source/context | Input is untrusted |
| Edge | Structure context and coordinate governed evaluation | Edge never becomes authority |
| Understand | Classify intent, urgency, entities, ambiguity | Never invent missing facts |
| Qualify | Determine fit and missing information | Qualification is not authorization |
| Knowledge | Retrieve approved workspace knowledge | Use active, workspace-scoped knowledge |
| Policy | Apply explicit business rules | Policy can constrain or require review |
| Workflow | Select and advance the governed path | Routing does not execute external effects |
| Human Decision | Review consequential/ambiguous work | Human decision remains authoritative |
| Authorized Action | Create an idempotent, authorized execution request | Recommendation is not execution |
| Provider | Supply replaceable external capability | Provider does not own policy or UX |
| Outcome | Record the resulting state | Do not claim an action occurred unless it did |
| Trace | Persist evidence and state transitions | Preserve auditability and workspace scope |
| Learning | Feed verified outcomes into future improvement | Never learn from fabricated success |

## Current runtime boundaries

### Workspace Edge

The `edge-workspace` function authenticates the bearer token, verifies workspace membership, validates customer/workspace ownership, records the interaction, evaluates knowledge and policy, creates a trace, and creates human-review work when the proposed path is consequential or ambiguous.

The runtime uses idempotency keys for interaction creation and does not execute external side effects merely because a workflow is selected. Provider authority remains server-side.

### Demonstration Edge

The `edge-intelligence` function is restricted to the fictional Northstone Roofing demonstration tenant. Demo execution is side-effect constrained and must never be represented as a real customer workflow, appointment, payment, message, or operational outcome.

## Truth model

Every consequential product surface should distinguish:

1. **Observed fact** — what the system actually received or retrieved.
2. **Derived intelligence** — classification, qualification, or inference.
3. **Policy** — the rule that constrains or permits a path.
4. **Proposed action** — what the system recommends or prepares.
5. **Authorized action** — what the system is permitted and prepared to execute.
6. **Provider result** — what an external capability actually confirmed.
7. **Human decision** — the authoritative human approval, rejection, or modification.
8. **Outcome** — the resulting state that can be verified.

The UI must not collapse these states into a single claim of autonomous action.

## Security invariants

- Authentication identifies the principal; server-side authorization determines workspace access.
- Workspace IDs supplied by the browser are selectors, never proof of access.
- Provider secrets remain server-side.
- Workspace data is isolated by workspace authorization and RLS.
- Consequential workflows are reviewable before external side effects.
- Idempotency prevents accidental duplicate interaction creation.
- Rate limits and body-size limits protect public request boundaries.
- Traces contain operational decision state, not hidden chain-of-thought.

## Production status vocabulary

Use the complete status vocabulary defined in [the canonical architecture](00_COMPANY_ARCHITECTURE.md). Never infer a stronger state from a weaker one.

P8 is complete only when the Edge implementation, authorization boundary, human-review boundary, traceability, and deployment state can all be described truthfully using this vocabulary.
