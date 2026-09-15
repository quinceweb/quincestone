revoke execute on function public.decide_human_review(uuid, text, text) from public, anon, authenticated;
revoke all on table public.appointment_requests from anon, authenticated;
revoke all on table public.demo_events from anon, authenticated;
revoke all on table public.demo_interactions from anon, authenticated;
