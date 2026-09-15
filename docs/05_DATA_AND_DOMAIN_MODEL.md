# Quincestone — Data and Domain Model

## Core domains

The platform may eventually cover:

Identity, Organizations, Customers, Products, Catalog, Brands, Suppliers, Inventory, Orders, Payments, Fulfillment, Returns, Interactions, Knowledge, Policies, Qualification, Routing, Workflows, Scheduling, Integrations, Notifications, Human Review, Analytics, Billing and Audit.

## Current operational center

The current production foundation is centered on:

Workspace → Customer → Interaction → Edge → Knowledge → Policy → Workflow → Proposed Action → Human Review → Outcome → Trace

## Data rules

- A real-world entity has one canonical record in the shared `quincestone` Supabase backend.
- Product projections and views identify their canonical source and cannot become competing mutation authorities.
- Cross-product flows use canonical identifiers, governed server functions, events, and explicit state transitions.
- Workspace ownership is explicit.
- Workspace-scoped data is protected with intentional RLS.
- Foreign keys preserve domain integrity.
- Lifecycle states are explicit where transitions matter.
- Source facts are not overwritten by derived intelligence.
- Human decisions remain distinct from Edge decisions.
- External execution is distinct from proposed or authorized state.
- Timestamps and audit relationships are preserved.

New domains should be introduced only when a real product journey requires them.

The complete persistence and provider-reconciliation contract is defined by [One Quincestone Backend](03_ONE_QUINCESTONE_BACKEND.md).
