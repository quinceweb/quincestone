# Quincestone — Edge Architecture

## Business installation boundary

Edge has two governed intake paths: authenticated Business OS intake (`edge-workspace`) and public business-channel intake (`edge-channel-gateway`). A public request supplies an opaque installation key and idempotency key. The gateway resolves the installation and workspace server-side, validates its active state and exact configured origin, applies durable rate control, then calls the same server-only operating pipeline used by authenticated intake. Browser-supplied workspace, role, policy, provider and authority claims are ignored.

The embed is a framework-independent script with isolated styles. It retains failed input and the same idempotency key for safe retry. A returned reference means the canonical interaction was persisted; it does not mean the business approved or executed an action.

The first slice is single-message intake. Classification is deterministic and knowledge matching is lexical. It is not semantic RAG, autonomous execution or binding advice. Future channel adapters must enter through the same installation, workspace, event and human-authority contracts.

Edge operates inside the shared `quincestone` Supabase backend boundary. It may recommend, route, and orchestrate through Core contracts, but it does not own a separate identity, database, policy authority, or provider source of truth. See [One Quincestone Backend](03_ONE_QUINCESTONE_BACKEND.md).

## Role

Quincestone Edge is the governed intelligence and orchestration layer between customer interaction and business action.

It is not a generic chatbot.

## Execution model

```text
Interaction
  ↓
Understand
  ↓
Structured Intent
  ↓
Qualification
  ↓
Knowledge
  ↓
Policy
  ↓
Decision
  ↓
Route
  ↓
Proposed Action
  ↓
Human Review when required
  ↓
Outcome
  ↓
Trace + Audit
```

## Governance

Each execution should be attributable to the workspace, interaction, customer where applicable, execution/trace, knowledge/policy context, decision, proposed or completed action, outcome and relevant timestamps.

Observed facts, derived intelligence, policy decisions, actions and human decisions remain separate.

## Action boundary

The current safe baseline favors understanding, qualification, recommendation, routing and recording. Actions with external or irreversible effects require explicit authorization and idempotent provider-backed execution before they can be represented as executed.

The existing deterministic Edge runtime remains the authoritative baseline until a production-grade model/provider boundary is intentionally introduced.
