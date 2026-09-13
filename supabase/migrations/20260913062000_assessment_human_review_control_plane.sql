alter table public.assessment_requests
  add column if not exists assessment_status text not null default 'human_review',
  add column if not exists review_notes text,
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_report jsonb not null default '{}'::jsonb;

alter table public.assessment_requests
  drop constraint if exists assessment_requests_assessment_status_check;

alter table public.assessment_requests
  add constraint assessment_requests_assessment_status_check
  check (assessment_status in ('human_review','in_review','approved','changes_requested','rejected'));

create index if not exists assessment_requests_review_queue_idx
  on public.assessment_requests (assessment_status, created_at desc);

alter table public.assessment_requests enable row level security;

drop policy if exists assessment_requests_platform_read on public.assessment_requests;
create policy assessment_requests_platform_read
  on public.assessment_requests
  for select
  to authenticated
  using (private.is_platform_operator(auth.uid()));

create or replace function public.decide_assessment_review(
  target_assessment uuid,
  target_decision text,
  target_notes text default null,
  target_report jsonb default null
)
returns public.assessment_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  row_data public.assessment_requests%rowtype;
  next_report jsonb;
begin
  if actor is null or not private.is_platform_operator(actor) then
    raise exception 'forbidden';
  end if;

  if target_decision not in ('approved','changes_requested','rejected') then
    raise exception 'invalid decision';
  end if;

  select * into row_data
  from public.assessment_requests
  where id = target_assessment
  for update;

  if not found then
    raise exception 'assessment not found';
  end if;

  if row_data.assessment_status in ('approved','rejected') then
    raise exception 'assessment is already terminal';
  end if;

  next_report := coalesce(target_report, row_data.reviewed_report, '{}'::jsonb);

  update public.assessment_requests
  set assessment_status = target_decision,
      review_notes = nullif(trim(coalesce(target_notes, '')), ''),
      reviewed_by = actor,
      reviewed_at = now(),
      reviewed_report = next_report
  where id = target_assessment
  returning * into row_data;

  perform public.record_platform_audit(
    actor,
    'assessment.review.' || target_decision,
    'assessment_request',
    target_assessment::text,
    jsonb_build_object(
      'assessment_status', target_decision,
      'has_review_notes', nullif(trim(coalesce(target_notes, '')), '') is not null
    )
  );

  return row_data;
end;
$$;

revoke all on function public.decide_assessment_review(uuid,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.decide_assessment_review(uuid,text,text,jsonb) to authenticated;
