# Quincestone → Shopify integration

Quincestone is the product and catalog authority. Shopify is a downstream commerce channel.

## Projection contract

Only products that pass the Quincestone launch gate may be projected. The server-side adapter always sends `status: DRAFT`; it never publishes a Shopify product.

Projected fields are limited to customer-facing commerce data:

- title
- handle
- description
- vendor
- product type
- approved tags
- SEO title/description

Supplier identity, sourcing costs, MOQ, QA evidence, internal economics, and launch-gate details are never projected.

## Server configuration

The admin server requires these environment variables:

- `SHOPIFY_STORE_DOMAIN` — Shopify shop domain, such as `example.myshopify.com`
- `SHOPIFY_ADMIN_ACCESS_TOKEN` — server-only Admin API credential with the minimum product scopes required by the adapter
- `SHOPIFY_ADMIN_API_VERSION` — optional API version; defaults to `2026-07`

Never expose the Admin API token to client-side code or `NEXT_PUBLIC_*` variables.

## Operational states

`commerce_shopify_products.sync_status` records `not_synced`, `pending`, `synced`, `failed`, or `blocked`.

A blocked product is not sent to Shopify. A failed projection records a bounded error for operator diagnosis. Successful projections record the Shopify product GID and the remote draft state.

## Current rollout

The adapter and operator action are implemented behind the `feat/shopify-commerce-boundary` branch. Runtime connection remains unconfigured until the server environment contains the Shopify credentials above. No credentials are stored in the repository.
