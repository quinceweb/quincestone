# Quincestone Business OS

## Edge installation management

`/integrations` lets workspace members inspect Edge installations. Only workspace owners and admins can create, enable, disable or irrevocably revoke one. The generated embed requires `NEXT_PUBLIC_EDGE_ASSET_URL` and `NEXT_PUBLIC_EDGE_GATEWAY_URL`; neither value is privileged. The public installation key is intentionally browser-visible and grants no workspace or action authority.

`apps/app` is the authenticated Business Operating System for workspaces, customers, demand, interactions, Edge, opportunities, assessments, knowledge, policies, workflows, Human Review, actions, outcomes, calendar, commerce operations, analytics, integrations and workspace settings.

Authentication must be followed by server-authoritative membership, role and policy checks. This application is not the individual Account, Quincestone Deals or the internal Admin plane.

Business OS uses the shared `quincestone` Supabase backend and owns the workspace operating experience. Workspace data remains product-bounded by RLS and server authorization; membership never creates a separate identity or grants Admin authority.

Development: `pnpm --filter @quincestone/app dev`. Quality gate: `pnpm --filter @quincestone/app check`.

See the [canonical architecture](../../docs/00_COMPANY_ARCHITECTURE.md), [One Quincestone Backend](../../docs/03_ONE_QUINCESTONE_BACKEND.md), [Identity and Access](../../docs/04_IDENTITY_AND_ACCESS.md) and [Edge operating model](../../docs/EDGE_OPERATING_MODEL.md).
