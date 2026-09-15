# Quincestone Admin

`apps/admin` is the internal control plane through which Quincestone operates Quincestone: platform health, assessment review, product/commerce/deal governance, Human Review, evidence, publication, provider and security controls, analytics and support operations.

No customer access is implied. Platform-operator authority must be independently established server-side and must never be inferred from individual authentication or ordinary workspace membership.

Development: `pnpm --filter @quincestone/admin dev`. Quality gate: `pnpm --filter @quincestone/admin check`.

The current shell is fail-closed where verified operator authority is unavailable. See [Admin control plane](../../docs/18_ADMIN_CONTROL_PLANE.md) and the [canonical architecture](../../docs/00_COMPANY_ARCHITECTURE.md).
