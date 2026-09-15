# Quincestone — Product Architecture

All products retain distinct experience ownership while using the shared identity, canonical records, Core contracts, events, and audit foundation defined by [One Quincestone Backend](03_ONE_QUINCESTONE_BACKEND.md). Product boundaries do not authorize independent databases.

## One company

Quincestone operates fixed-price commerce, negotiated commerce, and business services on one platform.

### Quincestone for Business

- Website assessment
- Website structure
- Website build
- Quincestone Edge
- Operational workflows
- Integrations and expansion

### Quincestone Commerce

- Demand discovery
- Product validation
- Sourcing
- Public Shop
- Fulfillment
- Product improvement
- Brand development

### Quincestone Deals

- Buyer intent and seller offers
- Qualification and terms
- Negotiation and counteroffers
- Agreement, transaction, fulfillment, and outcome

## Product hierarchy

```text
Quincestone
├── Quincestone for Business
│   ├── Assessment
│   ├── Structure
│   ├── Website
│   ├── Edge
│   └── Operations
└── Quincestone Commerce
    └── Shop
```

Individual products may become dedicated brands when demand, economics and supplier control justify it. Quincestone remains the parent operating company.

## Edge operating model

```text
Interaction
  ↓
Understand
  ↓
Structured Intent
  ↓
Required Information
  ↓
Qualification
  ↓
Knowledge + Policy
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
Trace + Audit Record
```

External actions remain explicitly authorized, idempotent and provider-backed before they can be considered executed.

## Customer-facing principle

The customer should always be able to understand what came in, what Quincestone understood, what rule or knowledge applied, what happens next, what requires human judgment, and what outcome actually occurred.
