# Deployment

1. Run `npm ci` and `npm run check`.
2. Configure `VITE_SITE_URL`, `VITE_PUBLIC_EMAIL`, and the public Supabase variables in Vercel.
3. Apply reviewed migrations to the intended Supabase project.
4. Deploy from `main`.
5. Verify every route, form failure/success mode, metadata, robots, sitemap, and mobile navigation.

The repository contains SPA rewrites in `vercel.json`.
