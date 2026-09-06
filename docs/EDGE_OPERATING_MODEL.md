# Quincestone Edge Operating Model

Quincestone Edge is the governed operating layer between customer demand and business action.

## Lifecycle

1. **Interaction** — receive the request.
2. **Understand** — derive intent, context and ambiguity.
3. **Collect** — capture only required information.
4. **Qualify** — determine whether the request can proceed.
5. **Knowledge** — ground decisions in active workspace knowledge.
6. **Policy** — apply workspace policy and system boundaries.
7. **Route** — select the appropriate workflow.
8. **Action** — produce a proposed action with explicit authorization requirements.
9. **Human Review** — require human judgment for consequential or uncertain paths.
10. **Outcome** — represent the resulting operational state.
11. **Record** — preserve the trace for inspection, audit and learning.

## Authority boundary

Edge never treats an inferred intent, browser-provided workspace identifier, or model output as authorization. Authentication identifies the principal; server-side workspace membership and policy determine access and mutation authority.

Consequential actions are proposals until the appropriate human or authorized system boundary permits execution.

## Runtime boundaries

- Workspace runtime requires an authenticated session and verified workspace membership.
- Workspace and customer records are scoped server-side.
- Interaction requests are idempotent within a workspace.
- Knowledge and policy inputs are read from the active workspace context.
- Human-review records are created for consequential or uncertain workflows.
- The public Northstone demo remains isolated from production side effects.

## Product surface

The authenticated application exposes Edge as a first-class **Operate** surface alongside Command Center, Interactions, Traces and Escalations. The Edge surface exposes the governed lifecycle and provides a controlled way to run a real workspace interaction through the existing server-side runtime.
