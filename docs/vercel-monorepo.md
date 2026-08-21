# Vercel monorepo deployment

Quincestone is one pnpm workspace with two independently deployable applications sourced from the same Git repository.

## Public project — `webquincestone`

- Repository: `quinceweb/quincestone`
- Root Directory: `apps/web`
- Framework: Vite
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm --filter @quincestone/web build`
- Output Directory: `dist`
- Production Domain: `quincestone.com`
- `www.quincestone.com`: redirect to `quincestone.com`

The committed root `pnpm-lock.yaml` must be the single dependency authority for the workspace. Do not create a second lockfile under `apps/web`.

## Authenticated project — `quincestone-app`

- Repository: `quinceweb/quincestone`
- Root Directory: `apps/app`
- Framework: Next.js
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm --filter @quincestone/app build`
- Output Directory: Next.js default (`.next`)
- Production Domain: `app.quincestone.com`

The application project must resolve workspace packages from the repository root. Do not create a second package lock inside `apps/app`.

## Environment boundaries

`apps/web` receives only browser-safe public variables. `apps/app` may receive its public Supabase URL/anon key and other explicitly server-safe configuration. Privileged provider credentials remain server-side, including Supabase service-role credentials, Stripe secrets, Google refresh/client secrets, webhook signing secrets, and Turnstile secrets.

## DNS

Vercel is the authoritative DNS provider for Quincestone. Do not add Cloudflare DNS configuration for this deployment path.

Desired mapping:

- `quincestone.com` → public Vercel project → `apps/web`
- `www.quincestone.com` → redirect to `quincestone.com`
- `app.quincestone.com` → authenticated Vercel project → `apps/app`

Do not move `quincestone.com` to the authenticated project.

## Current verification state

The existing `webquincestone` Vercel project is connected to the repository and is currently producing failed previews for the monorepo branch. Its project configuration still needs to be aligned with `apps/web`, and the workspace must have a real committed `pnpm-lock.yaml` before a frozen install can be verified.

A second Vercel project for `apps/app` has not yet been created through the currently available Vercel integration. Do not claim `app.quincestone.com` is attached or TLS-verified until that project exists and the hostname is explicitly verified there.

## Promotion order

1. Resolve PR #6 / `feature/edge-intelligence-runtime` first.
2. Update or rebase `feat/quincestone-monorepo-app-foundation` onto the resulting main.
3. Generate and commit the authoritative `pnpm-lock.yaml` with a real pnpm install.
4. Configure the public Vercel project with root `apps/web` and verify a preview.
5. Create the authenticated Vercel project with root `apps/app` and verify a preview.
6. Attach `app.quincestone.com` only after the authenticated project is ready.
7. Keep production promotion, tenant migration, and DNS changes behind their existing approval boundaries.
