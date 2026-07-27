# Deployment

1. Run `npm ci` and `npm run check`.
2. Configure `VITE_SITE_URL`, `VITE_PUBLIC_EMAIL`, and the public Supabase variables in Vercel.
3. Apply reviewed migrations to the intended Supabase project.
4. Deploy from `main`.
5. Verify every route, form failure/success mode, metadata, robots, sitemap, and mobile navigation.

The repository contains SPA rewrites in `vercel.json`.

## Calendar functions
Follow `docs/google-calendar.md`, set server secrets with `supabase secrets set`, then deploy `calendar-availability`, `create-calendar-booking`, `cancel-calendar-booking`, and `calendar-health`. Run `supabase db push` before deploying functions. Configure gateway rate limits and `ALLOWED_ORIGINS`. These commands are documented, not claimed as executed against production.
