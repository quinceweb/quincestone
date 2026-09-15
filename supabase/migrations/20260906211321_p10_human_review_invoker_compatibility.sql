-- Restore the human-review mutation to SECURITY INVOKER.
-- The function's authorization is enforced by auth.uid() plus workspace-admin checks,
-- and the underlying table RLS policies remain the final database boundary.
alter function public.decide_human_review(uuid, text, text)
  security invoker;

revoke execute on function public.decide_human_review(uuid, text, text) from public, anon;
grant execute on function public.decide_human_review(uuid, text, text) to authenticated;
