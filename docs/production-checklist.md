# Production checklist

- Review legal copy and retention policy.
- Apply and verify Supabase migrations.
- Configure public environment variables; confirm no service-role key is exposed.
- Add server-side abuse controls and Turnstile.
- Verify form delivery and staff access.
- Test keyboard, mobile, reduced motion, 404, and direct-route loading.
- Validate sitemap, robots, canonical URL, structured data, and monitoring.
- Confirm all external links and integration claims.
- Verify the protected calendar schema and public-table RLS/grants in the target project.
- Configure server-only Google OAuth secrets, exact allowed origins, and gateway rate limits.
- Run calendar health, controlled availability, booking, idempotent replay, Meet (if enabled), cancellation, and audit-event tests.
- Confirm demo routes produce no Supabase Function or Google requests.
- Verify the Stripe-hosted checkout destination for the existing $49 one-time price before calling payments production-ready.
