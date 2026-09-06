# Quincestone Edge Operating Model

## Purpose

Quincestone Edge is the governed operating layer between customer interaction and business action. It is not a generic chatbot and it is not an autonomous authority.

The Edge contract is:

**Interaction → Understand → Collect → Qualify → Knowledge → Policy → Route → Action → Human Review → Outcome → Record**

Each stage produces structured state that can be inspected, audited, and handed to the next stage. Consequential actions remain behind explicit authorization and human-review boundaries.

## Stage contract

| Stage | Responsibility | Boundary |
|---|---|---|
| Interaction | Receive the request and identify source/context | Input is untrusted |
| Understand | Classify intent, urgency, entities, ambiguity | Never invent missing facts |
| Collect | Gather only information needed for the decision | Minimize data collection |
| Qualify | Determine fit and missing information | Qualification is not authorization |
| Knowledge | Retrieve approved workspace knowledge | Use active, workspace-scoped knowledge |
| Policy | Apply explicit business rules | Policy can constrain or require review |
| Route | Select the governed workflow | Routing does not execute external effects |
| Action | Form a proposed next action | Consequential action requires authorization |
| Human Review | Put consequential/ambiguous work before a human | Human decision remains authoritative |
| Outcome | Record the resulting state | Do not claim an action occurred unless it did |
| Record | Persist the operational trace | Preserve auditability and workspace scope |

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
5. **Executed action** — what an authorized integration actually performed.
6. **Human decision** — the authoritative human approval, rejection, or modification.
7. **Outcome** — the resulting state that can be verified.

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

Use these states precisely:

- **Implemented** — code exists in the repository.
- **Configured** — required provider/runtime configuration exists.
- **Deployed** — the artifact has been deployed to the target runtime.
- **Verified** — the deployed behavior has been directly checked.
- **Planned** — intentionally not implemented yet.

P8 is complete only when the Edge implementation, authorization boundary, human-review boundary, traceability, and deployment state can all be described truthfully using this vocabulary.
