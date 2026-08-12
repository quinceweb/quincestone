# Vercel monorepo deployment

The repository now contains two independently deployable applications from the same Git repository.

## Public project

- Project purpose: public Quincestone product
- Root Directory: `apps/web`
- Framework: Vite
- Build Command: `cd ../.. && pnpm exec turbo run build --filter=@quincestone/web`
- Output Directory: `apps/web/dist`
- Install Command: `pnpm install`
- Domain: `quincestone.com`

## Authenticated project

- Project purpose: Quincestone operating application
- Root Directory: `apps/app`
- Framework: Next.js
- Build Command: `cd ../.. && pnpm exec turbo run build --filter=@quincestone/app...`
- Output Directory: `.next` (default for Next.js)
- Install Command: `pnpm install`
- Domain: `app.quincestone.com`

Vercel supports multiple projects sourced from one monorepo; each project should be scoped to its application root and may share workspace packages. Keep the two projects operationally independent. citeturn1search5turn1search0

## Environment boundaries

`apps/web` receives only browser-safe public variables. `apps/app` receives its public Supabase URL/anon key for SSR/browser session handling. Privileged provider credentials remain in Supabase Edge Functions and server-only environments.

## Current manual action

The existing Vercel project was created for the original root-level Vite application. Its current preview build is therefore not a valid monorepo release verification until its Root Directory is changed to `apps/web` or its build settings are explicitly changed to use the filtered workspace build.

Do not attach `app.quincestone.com` to the public project. Create a separate Vercel project for `apps/app` before attaching that hostname.

Cloudflare DNS remains a manual operation for this project.
