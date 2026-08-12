# Security

Never expose service-role credentials in frontend code. RLS is mandatory. Public demos use fixtures only. Production requires Content Security Policy, dependency review, secret scanning, rate limiting, bot controls, audit logging, incident response, and least-privilege staff access.

Report security concerns privately to `hello@quincestone.com`; do not place sensitive details in public issues.

Google OAuth credentials and the Supabase service role exist only as Supabase project secrets. Edge Functions apply input limits, method checks, origin-aware CORS, provider timeouts, safe error mapping, and sanitized audit records. Production must add gateway rate limiting and log-retention controls. Never add provider payloads, qualification details, tokens, or service-role credentials to analytics.
