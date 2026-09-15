drop policy if exists human_reviews_update_member on public.human_reviews;
drop policy if exists human_reviews_insert_member on public.human_reviews;

alter function public.decide_human_review(uuid, text, text)
  security definer;

revoke all on function public.decide_human_review(uuid, text, text) from public, anon;
grant execute on function public.decide_human_review(uuid, text, text) to authenticated;
