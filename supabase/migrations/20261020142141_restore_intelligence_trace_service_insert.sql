-- The demo runtime writes traces server-side with service_role.
-- BYPASSRLS does not supply the table INSERT privilege.
-- Keep anon/authenticated grants and all RLS policies unchanged.
-- Rollback: REVOKE INSERT ON TABLE public.intelligence_traces FROM service_role;
GRANT INSERT ON TABLE public.intelligence_traces TO service_role;
