# Quincestone Web

`apps/web` is the Vite + React public application with two host-aware experience modes:

- `quincestone.com`: institution, editorial intelligence, trust, public explanation, assessment and routing.
- `shop.quincestone.com`: Quincestone Shop, the fixed-price commerce experience.

`/assessment` is a dedicated experience mode. QVS 2.0 supplies the shared visual system. The application owns no internal Admin authority and must not duplicate Quincestone Account.

Shop follows Product → Published price → Bag → Checkout → Payment → Order → Fulfillment → Outcome. Browser state is not authority for price, payment, inventory, order or publication.

Development: `pnpm --filter @quincestone/web dev`. Quality gate: `pnpm --filter @quincestone/web check`.

See the [canonical architecture](../../docs/00_COMPANY_ARCHITECTURE.md) and [commerce architecture](../../docs/07_COMMERCE_ARCHITECTURE.md).
