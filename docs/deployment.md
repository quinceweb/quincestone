# Deployment

1. Run `npm ci` and `npm run check`.
2. Configure `VITE_SITE_URL`, `VITE_PUBLIC_EMAIL`, and the public Supabase variables in Vercel.
3. Apply reviewed migrations to the intended Supabase project.
4. Deploy from `main`.
5. Verify every route, form failure/success mode, metadata, robots, sitemap, and mobile navigation.

The repository contains SPA rewrites in `vercel.json`.

## Calendar functions

The production candidate contains `calendar-availability`, `create-calendar-booking`, `cancel-calendar-booking`, and `calendar-health`. Configure server-only Google OAuth secrets, exact allowed origins, and gateway rate limits before final runtime verification. Do not claim Google Calendar as healthy until health, availability, booking, idempotent replay, Meet (if enabled), cancellation, and audit-event tests pass.
