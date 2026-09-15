-- Canonical Edge assessment intake: server-owned reference, lifecycle and retry safety.
alter table public.assessment_requests
  add column if not exists reference text,
  add column if not exists assessment_version integer not null default 1 check (assessment_version between 1 and 20),
  add column if not exists idempotency_key uuid,
  add column if not exists human_review_required boolean not null default true,
  add column if not exists updated_at timestamptz not null default now();

update public.assessment_requests
set reference = 'QS-A-' || upper(substr(replace(id::text, '-', ''), 1, 8))
where reference is null;

alter table public.assessment_requests alter column reference set not null;
create unique index if not exists assessment_requests_reference_key on public.assessment_requests(reference);
create unique index if not exists assessment_requests_idempotency_key on public.assessment_requests(idempotency_key) where idempotency_key is not null;

alter table public.assessment_requests drop constraint if exists assessment_requests_assessment_status_check;
alter table public.assessment_requests add constraint assessment_requests_assessment_status_check
  check (assessment_status in ('received','triage','human_review','in_review','needs_context','recommendation_ready','changes_requested','approved','rejected','closed'));

create or replace function public.submit_edge_assessment(payload jsonb, idempotency_key uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  new_id uuid := gen_random_uuid();
  row_data public.assessment_requests%rowtype;
  normalized_email text := lower(trim(coalesce(payload->>'email', '')));
  normalized_version integer;
begin
  if submit_edge_assessment.idempotency_key is null then raise exception 'idempotency key required'; end if;
  if jsonb_typeof(payload) <> 'object' or jsonb_typeof(payload->'answers') <> 'object' then raise exception 'invalid assessment payload'; end if;
  normalized_version := coalesce((payload->>'version')::integer, 2);
  if char_length(trim(coalesce(payload->>'name', ''))) not between 2 and 100 then raise exception 'invalid name'; end if;
  if char_length(normalized_email) > 254 or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'invalid email'; end if;
  if char_length(trim(coalesce(payload->>'company', ''))) not between 1 and 120 then raise exception 'invalid company'; end if;
  if char_length(coalesce(payload->>'website', '')) > 300 then raise exception 'invalid website'; end if;

  insert into public.assessment_requests(
    id, reference, name, email, company, website, message, company_site,
    assessment_payload, assessment_report, assessment_version, assessment_status,
    human_review_required, idempotency_key, updated_at
  ) values (
    new_id, 'QS-A-' || upper(substr(replace(new_id::text, '-', ''), 1, 8)),
    trim(payload->>'name'), normalized_email, trim(payload->>'company'), trim(coalesce(payload->>'website', '')),
    'Edge operational assessment received.', '', payload, coalesce(payload->'preliminary', '{}'::jsonb),
    normalized_version, 'received', true, submit_edge_assessment.idempotency_key, now()
  ) on conflict (idempotency_key) where idempotency_key is not null do nothing
  returning * into row_data;

  if row_data.id is null then
    select * into row_data from public.assessment_requests ar where ar.idempotency_key = submit_edge_assessment.idempotency_key;
  end if;
  return jsonb_build_object('reference', row_data.reference, 'status', row_data.assessment_status, 'duplicate', row_data.id <> new_id);
end $$;

revoke all on function public.submit_edge_assessment(jsonb,uuid) from public, authenticated;
grant execute on function public.submit_edge_assessment(jsonb,uuid) to anon;
comment on function public.submit_edge_assessment(jsonb,uuid) is 'Validates and persists one canonical public Edge assessment. Retries return the original reference.';
