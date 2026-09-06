# Quincestone — Security & Trust

## Purpose

Security is an operating boundary, not a presentation feature. Authentication identifies a principal; server-side authorization determines what that principal may read or mutate.

## Authority boundaries

1. Authenticated principal — Supabase Auth establishes identity.
2. Server-side authorization — workspace membership and administrative authority are evaluated server-side/database-side.
3. Durable state — persisted workspace and interaction state is authoritative over browser state.
4. Policy — explicit policy decisions constrain proposed actions.
5. Human decision — required for consequential review boundaries.
6. Provider result — external execution is represented as completed only when the provider confirms it.
7. UI — presentation is never an authority source.

Browser-supplied workspace IDs, roles, customer identifiers, status fields, and action claims are selectors/input only and must not establish authorization.

## Human-review boundary

`public.decide_human_review` is a `SECURITY DEFINER` function because the mutation crosses multiple protected tables. Its implementation verifies the authenticated principal and requires workspace owner/admin authority before changing a review, interaction, or trace.

Direct PostgREST execution by `anon` and `authenticated` is revoked in the current database. Human-review mutations must enter through a trusted server-side boundary that can execute the function without exposing privileged database credentials to the browser.

This is intentional: a privileged database function must not become a general authenticated-user RPC surface.

## RLS doctrine

- Production workspace data requires RLS.
- Client roles receive only the minimum operations required by the product surface.
- Server-side writes are preferred for consequential mutations and event recording.
- Demo tables are not customer-data surfaces and remain inaccessible to browser roles unless an explicit public read policy is deliberately introduced.
- The canonical `events` ledger is readable only to authenticated workspace members and has no client write policy.

## Secret handling

Never expose or persist provider credentials in frontend code, browser storage, public configuration, logs, or Git history. This includes Supabase service-role credentials, Stripe secrets/webhook secrets, OAuth client secrets and refresh tokens, Resend API keys, and equivalent provider credentials.

Public environment variables may contain only intentionally public configuration.

## Payment trust

Stripe is authoritative for payment state. The browser may request checkout and return from hosted checkout, but successful payment must be confirmed server-side against Stripe before paid onboarding or fulfillment is unlocked.

## Demo trust

Northstone Roofing is fictional demonstration content. Demo execution must not create real appointments, payments, messages, CRM records, or external operational side effects.

## Security review findings

The P10 review identified and addressed:

- `decide_human_review` as a privileged `SECURITY DEFINER` function; direct client execution has been removed.
- `appointment_requests`, `demo_events`, and `demo_interactions` have RLS enabled without client policies and now have explicit PostgREST role privileges revoked; they remain server-side/demo infrastructure.
- Supabase Auth leaked-password protection remains an external dashboard configuration item because the connected database tooling does not expose that Auth security setting.

## Operational rule

Security changes must be reversible, least-privilege, and verified against the actual deployed database. A security warning is not considered resolved merely because application code claims an authorization check exists.
