# Quincestone

**Discover. Develop. Operate. Scale.**

Quincestone is a commerce and product-development company that discovers, develops and operates high-quality consumer products through intelligent sourcing, premium commerce, disciplined economics and professional fulfillment.

## Company model

**DISCOVER → VALIDATE → SOURCE → BUILD → TEST → MEASURE → OPTIMIZE → SCALE → BRAND**

Supplier-direct fulfillment can be used internally for early validation. It is infrastructure, not the customer-facing identity. Winning products should progress toward negotiated pricing, improved specification, custom packaging, private label, dedicated inventory, regional fulfillment, product development, direct manufacturing and independent consumer brands.

Quincestone Edge remains a governed intelligence layer for demand, workflows and human review. It is reusable company infrastructure, not the definition of the company.

## Commerce architecture

```text
Customer
  ↓
shop.quincestone.com
  ↓
Commerce authority
  ├── Catalog / pricing / cart
  ├── Stripe checkout
  ├── verified payment events
  ├── Orders
  ├── Fulfillment
  ├── Tracking
  └── Returns / support / learning
```

The browser is never authoritative for price, discounts, payment state, order state, refund state, fulfillment state, supplier cost, inventory authority or administrative permissions.

## Applications

```text
apps/web    Public company + commerce storefront
apps/app    Authenticated business operating application
apps/admin  Private Quincestone platform + commerce operations
apps/api    Reserved shared service boundary when a separate API deployment is justified
```

The repository keeps `apps/web` as the public Vite application and serves `shop.quincestone.com` as a host-aware commerce surface. A separate commerce frontend is not required.

## Canonical domains

```text
quincestone.com       Parent company / corporate identity
www.quincestone.com   Public web alias
shop.quincestone.com  Customer commerce
account.quincestone.com  Reserved customer account surface
support.quincestone.com  Reserved customer support surface
admin.quincestone.com   Private operations
api.quincestone.com     Reserved service boundary
```

Current Vercel projects expose the company/shop surface and authenticated app surface. Admin and API domain deployment remain explicit infrastructure gates rather than assumed routes.

## Commerce data authority

The commerce schema contains:

- customers and addresses;
- products, variants and controlled media;
- suppliers and supplier-product mappings;
- inventory authority;
- carts and server-side price snapshots;
- orders and immutable line snapshots;
- Stripe payment reconciliation;
- human-approved fulfillment;
- returns and refunds;
- discounts and bundles;
- product QA and launch evidence;
- operational audit events.

### Product launch gate

Candidates progress through:

`RESEARCH → SOURCING → SUPPLIER_SELECTED → SAMPLE_ORDERED → SAMPLE_RECEIVED → QA → ECONOMICS_REVIEW → APPROVED → READY → ACTIVE`

`REVISE`, `PAUSED`, `REJECTED` and `ARCHIVED` interrupt or terminate the path.

A product cannot become `ACTIVE`/published unless the system verifies the required SKU, sample, quality, functional, packaging, economics, shipping, returns/warranty, media rights, price and content gates and has an active priced variant.

## First ten sourcing candidates

These are internal research records only. They are not publicly available products and contain no fabricated supplier facts, specifications, inventory, reviews, media, shipping promises or pricing.

1. Vacuum Compression Travel Backpack — Travel
2. Cordless Premium Pressure Washer / Power Cleaner — Drive
3. Hard-Bottom Dog Backseat Travel Platform — Companion
4. OBD2 Automotive Diagnostic Scanner — Drive
5. Smart Bird Feeder Camera — Home + Outdoor
6. Portable Premium CarPlay Display — Drive
7. Premium Electric Spin Scrubber — Home + Outdoor
8. Travel Vacuum Storage Bags + Rechargeable Pump — Travel
9. Premium Neck & Shoulder Massager — Home + Outdoor
10. Pet Grooming Vacuum System — Companion

## Edge and business operating system

Existing workspace, Edge, intelligence, human-review, event, calendar and onboarding foundations remain intact. Commerce builds on those boundaries instead of replacing working infrastructure merely for architectural novelty.

## Provider boundaries

| Provider | Role | Truth |
|---|---|---|
| GitHub | Source authority | `quinceweb/quincestone` / `main` |
| Vercel | Web/app deployment | Connected projects inspected; production verification is deployment-specific |
| Supabase | Database, Auth, storage and Edge | Current backend authority |
| Stripe | Payments | Provider-authoritative; commerce checkout is server-side and webhook-reconciled |
| Resend | Transactional email | Existing provider boundary; commerce messages must derive from authoritative order state |
| Alibaba / suppliers | Sourcing network | No unverified runtime integration is claimed |

## Development

Prerequisite: Node.js compatible with the repository's current pnpm toolchain and `pnpm@10.15.0`.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

The root lockfile is authoritative. Do not create nested lockfiles.

## Security

Browser applications receive only public configuration. Server-side boundaries hold provider secrets.

Never expose:

- Supabase service-role keys;
- Stripe secret keys or webhook signing secrets;
- Resend API keys;
- OAuth client secrets or refresh tokens;
- supplier costs, internal sourcing records or administrative permissions.

Workspace membership is not platform administration. Commerce operations are independently authorized server-side.

## Release truth

Status labels mean:

- **Implemented** — repository code exists on the current source branch.
- **Configured** — provider/project configuration has been inspected and exists.
- **Deployed** — the provider reports a deployment/version exists.
- **Verified** — deployed behavior has been directly checked.
- **Blocked** — an external dependency or missing authority prevents completion.

No product is considered commercially approved merely because its database record exists. No production payment is considered successful from a browser redirect; Stripe webhook reconciliation is the payment authority.
