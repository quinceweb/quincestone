# Database

Migration `20260724090000_create_public_submission_tables.sql` creates:

- `assessment_requests`
- `implementation_applications`
- `contact_messages`
- `demo_interactions`
- `demo_events`

All tables use UUID primary keys, constraints, UTC timestamps, and RLS. Run migrations through the normal Supabase migration workflow only after reviewing the target project.

## Calendar integration schema
Migration `20260727090000_calendar_integration.sql` adds protected appointment, integration configuration, and sanitized audit tables. All have RLS enabled and no `anon` or `authenticated` table privileges; only service-role Edge Functions may access them. Apply reviewed migrations with `supabase link --project-ref <project-ref>` and `supabase db push`.
