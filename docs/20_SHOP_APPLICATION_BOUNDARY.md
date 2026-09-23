# Shop Application Boundary

**Authority:** canonical ownership and migration inventory

One Supabase Auth person may be a Shop customer, Business member and Deal participant. Authentication establishes identity; customer state, workspace membership and deal authority are independently resolved server-side.

| Previous location | Canonical location | Disposition |
|---|---|---|
| `apps/web` hostname switch | none | Removed after standalone parity |
| `apps/web/src/pages/Shop*` | `apps/shop/src/views` | Moved outside Next.js reserved route directories |
| Shop routes | `apps/shop/src/app/[[...slug]]/page.tsx` | Extracted into the Next.js App Router |
| `apps/web/api/commerce-*` | `apps/shop/api/commerce-*` with `apps/shop/src/app/api/*/route.ts` boundaries | Moved; server-only |
| commerce CSS/tests | `apps/shop` | Moved |
| QVS tokens | `packages/config/src/brand.css` | Shared authority |
| commerce records | canonical `quincestone` project | Kept |
| authentication/customer account | `apps/account` | Kept; safe Shop continuation |

Shop Phase 2 intelligence, readiness scoring and lifecycle personalization remain deferred.
