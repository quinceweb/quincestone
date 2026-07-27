# Production checklist

- Review legal copy and retention policy.
- Apply and verify Supabase migrations.
- Configure public environment variables; confirm no service-role key is exposed.
- Add server-side abuse controls and Turnstile.
- Verify form delivery and staff access.
- Test keyboard, mobile, reduced motion, 404, and direct-route loading.
- Validate sitemap, robots, canonical URL, structured data, and monitoring.
- Confirm all external links and integration claims.
- Apply the calendar migration and verify all public-table RLS and grants in the target project.
- Configure server-only Google OAuth secrets and exact allowed origins; configure gateway rate limits.
- Run calendar health, controlled availability, booking, idempotent replay, Meet (if enabled), and cancellation tests.
- Confirm demo routes produce no Supabase Function or Google requests.
