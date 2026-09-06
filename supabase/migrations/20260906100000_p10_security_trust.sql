-- P10 security boundary.
-- The human-review mutation crosses protected tables and is SECURITY DEFINER.
-- Do not expose it as a browser-callable PostgREST RPC.
revoke execute on function public.decide_human_review(uuid, text, text) from public, anon, authenticated;

-- Demo/request tables remain server-side infrastructure. RLS is already enabled;
-- these grants make the browser-facing PostgREST boundary explicit.
revoke all on table public.appointment_requests from anon, authenticated;
revoke all on table public.demo_events from anon, authenticated;
revoke all on table public.demo_interactions from anon, authenticated;
