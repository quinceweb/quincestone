revoke execute on function public.decide_human_review(uuid, text, text) from public;
revoke execute on function public.decide_human_review(uuid, text, text) from anon;
revoke execute on function public.decide_human_review(uuid, text, text) from authenticated;
grant execute on function public.decide_human_review(uuid, text, text) to authenticated;
