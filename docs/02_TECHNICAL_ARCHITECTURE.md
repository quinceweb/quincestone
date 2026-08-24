# Quincestone — Technical Architecture

## Monorepo boundaries

```text
apps/web    → public company + Shop surface
apps/app    → authenticated business application
apps/admin  → internal control plane
apps/api    → shared service/API boundary
```

Shared packages are created only when multiple real consumers require the abstraction.

## Infrastructure authority

- GitHub — source authority
- Vercel — application and deployment infrastructure
- Supabase — PostgreSQL, storage and Edge Functions
- Supabase Auth — current production identity authority
- Clerk — future controlled identity direction
- Stripe — payments and billing boundary
- Resend — transactional communication boundary
- Alibaba — sourcing/manufacturing network; no runtime integration is implied

## Backend boundary

Do not move working Supabase Edge Functions or application server actions merely to satisfy a diagram. `apps/api` becomes the shared service boundary where functionality genuinely benefits from a stable API/domain boundary.

## Security boundary

Browser code may contain only public configuration. Provider secrets, service-role credentials, signing secrets and privileged tokens remain server-side.

Workspace IDs are selectors, not authorization. Workspace access is established from the authenticated principal and server-side membership rules.

Internal Quincestone administrator authority is separate from customer workspace membership.

## Data boundary

Workspace-scoped records must carry explicit ownership where appropriate, use intentional RLS, preserve referential integrity, and retain auditable timestamps and lifecycle states.
