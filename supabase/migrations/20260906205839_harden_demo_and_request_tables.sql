revoke all on table public.appointment_requests from anon, authenticated;
revoke all on table public.demo_events from anon, authenticated;
revoke all on table public.demo_interactions from anon, authenticated;

-- These tables are intentionally server-side/demo infrastructure. RLS remains enabled with no client policies.
-- Explicitly keep the PostgREST roles unable to read or mutate them directly.
