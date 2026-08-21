# Quincestone — Company Architecture

## Current authority

Quincestone is a commerce and operating-systems company built around:

**Demand → Experience → Intelligence → Transaction → Operations → Outcome → Learning → Scale**

The public company expression is:

**Discover → Build → Operate → Scale**

## Commercial model

### Quincestone for Business

Assessment → Structure → Website → Edge → Operations

The website is the entry point. Quincestone Edge is the recurring product. Operational workflows and integrations are expansion.

### Quincestone Commerce

Demand → Product Discovery → Validation → Sourcing → Shop → Fulfillment → Improvement → Brand

Dropshipping or supplier-direct fulfillment may be used internally for controlled validation. It is not the public identity of Quincestone.

## Canonical applications

| Application | Responsibility | Domain |
|---|---|---|
| `apps/web` | Public company, acquisition, assessment, commerce discovery and SEO | `quincestone.com`, `shop.quincestone.com` |
| `apps/app` | Authenticated business operating application | `app.quincestone.com` |
| `apps/admin` | Internal Quincestone control plane | `admin.quincestone.com` |
| `apps/api` | Shared service/API boundary | `api.quincestone.com` |

The shop hostname is a host-aware public surface of `apps/web`; it is not a fifth application.

## Platform principle

Quincestone Edge is the governed intelligence layer between customer demand and business operations:

**Interaction → Understand → Collect → Qualify → Knowledge → Policy → Route → Action → Human Review → Outcome → Record**

Edge is not a generic chatbot. Observed facts, derived intelligence, policy decisions, proposed actions, executed actions and human decisions remain distinct records and authority boundaries.

## Current implementation boundary

The repository currently contains the public `apps/web` application and authenticated `apps/app` foundation. `apps/admin` and `apps/api` are canonical target boundaries but are not represented as production applications until real functionality exists.

Supabase Auth remains the current production identity authority. Clerk is a future controlled identity direction, not a current runtime authority.

## Status vocabulary

- **Implemented** — source code exists.
- **Configured** — provider/application configuration exists and has been inspected.
- **Deployed** — the provider reports a deployment/version.
- **Verified** — deployed behavior has been directly checked.
- **Planned** — intentionally future work.

Do not infer a stronger state from a weaker one.
