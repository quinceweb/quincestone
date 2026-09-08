# Vacuum Compression Travel Backpack — data model

The product is represented by the existing Quincestone commerce authority plus the following extensions:

- `commerce_products`: identity, collection and lifecycle/publication state.
- `commerce_variants`: sellable SKU, price, currency and variant attributes. No variant is seeded until an exact SKU and price are verified.
- `commerce_product_content`: approved merchandising story, benefits, features, specifications, included items, usage, FAQ, policy and SEO fields.
- `commerce_product_media`: asset URL plus media type, source, rights, verification, publication, SKU association and dimensions/metadata.
- `commerce_product_qa`: sourcing, exact SKU, sample, QA, media, economics, shipping, returns/warranty, price and content gates.
- `commerce_supplier_products`: private supplier mapping and economics. Never selected as a public source of truth.

## Public boundary

`commerce_catalog` is the only storefront catalog authority. It exposes only products whose lifecycle, merchandising and publication state are published/active, active variants, approved/verified/published media, and approved public content fields.

Search, collection rendering, product routes, Product structured data and any future homepage feature consume this public authority. Internal records do not enter those surfaces.

## Launch boundary

`private.commerce_product_launch_ready(product_id)` requires every commercial QA gate, at least one active priced variant, complete approved headline/short description content, at least one approved/verified/published media asset, and no invalid media asset attached to the product.

The database publication trigger/function remains authoritative. UI controls cannot bypass it.

## Current backpack state

- Lifecycle: sourcing.
- Publication: private/draft.
- Exact SKU: pending.
- Sample: not ordered.
- QA: pending.
- Economics: pending.
- Shipping/returns/warranty: pending.
- Media: none attached.
- Public catalog rows: zero.
