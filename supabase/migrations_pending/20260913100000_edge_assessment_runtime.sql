-- Durable public Edge assessment state. The public caller only receives an opaque reference.
alter table public.assessment_requests
  add column if not exists assessment_payload jsonb not null default '{}'::jsonb check (jsonb_typeof(assessment_payload) = 'object'),
  add column if not exists assessment_report jsonb not null default '{}'::jsonb check (jsonb_typeof(assessment_report) = 'object'),
  add column if not exists assessment_status text not null default 'human_review' check (assessment_status in ('human_review','in_review','approved','changes_requested','closed')),
  add column if not exists review_notes text not null default '' check (char_length(review_notes) <= 4000),
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id);

create index if not exists assessment_requests_review_queue_idx
  on public.assessment_requests (assessment_status, created_at desc);

revoke all on public.assessment_requests from anon, authenticated;

create or replace function public.submit_public_form(submission_kind text, payload jsonb) returns uuid
language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
 if coalesce(payload->>'company_site','') <> '' then raise exception 'invalid submission'; end if;
 if submission_kind = 'assessment_requests' then
  insert into public.assessment_requests(name,email,company,website,message,company_site,assessment_payload,assessment_report,assessment_status)
  values (
    payload->>'name', lower(payload->>'email'), coalesce(payload->>'company',''), coalesce(payload->>'website',''),
    payload->>'message','',
    case when jsonb_typeof(coalesce(payload->'assessment','null'::jsonb)) = 'object' then payload->'assessment' else '{}'::jsonb end,
    case when jsonb_typeof(coalesce(payload->'assessment'->'report','null'::jsonb)) = 'object' then payload->'assessment'->'report' else '{}'::jsonb end,
    'human_review'
  ) returning id into new_id;
 elsif submission_kind = 'implementation_applications' then
  insert into public.implementation_applications(name,email,company,website,message,company_site) values (payload->>'name', lower(payload->>'email'), coalesce(payload->>'company',''), coalesce(payload->>'website',''), payload->>'message','') returning id into new_id;
 elsif submission_kind = 'contact_messages' then
  insert into public.contact_messages(name,email,company,website,message,company_site,contact_reason) values (payload->>'name', lower(payload->>'email'), coalesce(payload->>'company',''), coalesce(payload->>'website',''), payload->>'message','',coalesce(payload->>'contact_reason','general')) returning id into new_id;
 else raise exception 'invalid submission kind'; end if;
 return new_id;
end $$;

revoke all on function public.submit_public_form(text,jsonb) from public;
grant execute on function public.submit_public_form(text,jsonb) to anon;
comment on table public.assessment_requests is 'Public Edge assessments. assessment_status=human_review means Edge has completed intake and the assessment is awaiting authorized human review.';
