# Quincestone — Edge Architecture

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
