# Database

Migration `20260724090000_create_public_submission_tables.sql` creates:

- `assessment_requests`
- `implementation_applications`
- `contact_messages`
- `demo_interactions`
- `demo_events`

All tables use UUID primary keys, constraints, UTC timestamps, and RLS. Run migrations through the normal Supabase migration workflow only after reviewing the target project.
