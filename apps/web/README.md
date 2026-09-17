# Quincestone Web

`apps/web` is the Vite + React public application with two host-aware experience modes:

- `quincestone.com`: institution, editorial intelligence, trust, public explanation, assessment and routing.
- `shop.quincestone.com`: Quincestone Shop, the fixed-price commerce experience.

`/assessment` is a dedicated experience mode. QVS 2.0 supplies the shared visual system. The application owns no internal Admin authority and must not duplicate Quincestone Account.

Shop follows Product → Published price → Bag → Checkout → Payment → Order → Fulfillment → Outcome. Browser state is not authority for price, payment, inventory, order or publication.

Web and Shop use the shared `quincestone` Supabase backend through public publishable-key/RLS boundaries and trusted server commands. Shop owns its experience, not a separate identity, product, order, payment-reconciliation, event, or audit database.

Development: `pnpm --filter @quincestone/web dev`. Quality gate: `pnpm --filter @quincestone/web check`.

See the [canonical architecture](../../docs/00_COMPANY_ARCHITECTURE.md), [One Quincestone Backend](../../docs/03_ONE_QUINCESTONE_BACKEND.md), and [commerce architecture](../../docs/07_COMMERCE_ARCHITECTURE.md).

The Phase 1 Corporate/Shop relationship and the Phase 2 stop boundary are defined by [QEU 1.0](../../docs/19_QEU_PHASE_1_FREEZE.md).

The authorized Phase 2 readiness work and its current implementation boundary are recorded in the [Shop Phase 2 readiness architecture](../../docs/20_SHOP_PHASE_2_READINESS_ARCHITECTURE.md).
