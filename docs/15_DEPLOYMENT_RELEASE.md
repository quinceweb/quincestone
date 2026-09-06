# Quincestone — P15 Deployment & Release Discipline

## Source authority

`main` is the production source authority. Feature work lands through focused pull requests and is not treated as production until the resulting deployment is directly verified.

## Environment model

- **Preview:** branch/PR validation and review.
- **Production:** deployment built from the production source authority.
- **Supabase:** database/functions state must be verified independently from frontend deployment state.
- **Stripe:** billing state is provider-authoritative; live financial mutations require explicit approval.

## Release sequence

1. Inspect current main and open PR state.
2. Make the smallest safe change on a focused branch.
3. Review the diff.
4. Merge only the intended change into `main`.
5. Confirm the resulting Vercel production deployment references the expected commit.
6. Inspect build/deployment state.
7. Verify critical public routes and runtime signals.
8. Verify Supabase runtime state separately.
9. Record any blocked external configuration instead of marking it complete.

## CI baseline

The repository uses the existing pnpm/Turbo commands as the canonical checks:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm check`

If CI is unavailable or not configured, that is a release observation—not a fabricated pass.

## Production verification

A production deployment is **verified** only when its deployment metadata and runtime are directly inspected. A READY preview is not production. A successful GitHub merge is not proof of a live deployment.

## Rollback

Prefer a new corrective commit or a verified rollback deployment. Never rewrite shared history or force-push production branches.

## Domains

Canonical public and application domains remain:

- `quincestone.com`
- `shop.quincestone.com`
- `app.quincestone.com`
- `admin.quincestone.com`
- `api.quincestone.com`

Domain configuration must be inspected in the hosting provider before being described as verified.

## Release vocabulary

- **Implemented:** code/configuration exists in source control.
- **Configured:** provider setting exists.
- **Deployed:** provider has created the intended deployment.
- **Verified:** deployment/runtime was directly inspected and passed the relevant gate.
- **Blocked:** an external dependency prevents verification or completion.
