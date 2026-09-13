-- Governed bridge from a reviewed public assessment into the Quincestone operating model.
-- Assessment approval creates a proposal; proposal approval never executes provider side effects directly.
create table if not exists public.implementation_proposals (
  id uuid primary key default gen_random_uuid(),
  assessment_request_id uuid not null references public.assessment_requests(id) on delete cascade,
  workspace_id uuid null,
  status text not null default 'proposed',
  policy_status text not null default 'requires_human',
  policy_version text not null default 'assessment-v1',
  title text not null,
  summary text not null,
  priority text not null default 'p1',
  proposed_action jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '{}'::jsonb,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint implementation_proposals_status_check check (status in ('proposed','approved','rejected','superseded')),
  constraint implementation_proposals_policy_status_check check (policy_status in ('allowed','requires_human','blocked')),
  constraint implementation_proposals_priority_check check (priority in ('p0','p1','p2','p3')),
  constraint implementation_proposals_proposed_action_object check (jsonb_typeof(proposed_action) = 'object'),
  constraint implementation_proposals_evidence_object check (jsonb_typeof(evidence) = 'object'),
  unique (assessment_request_id)
);

create index if not exists implementation_proposals_queue_idx
  on public.implementation_proposals (status, created_at desc);
create index if not exists implementation_proposals_workspace_idx
  on public.implementation_proposals (workspace_id, status, created_at desc);

alter table public.implementation_proposals enable row level security;
revoke all on public.implementation_proposals from public, anon, authenticated;
grant select on public.implementation_proposals to authenticated;

drop policy if exists implementation_proposals_platform_read on public.implementation_proposals;
create policy implementation_proposals_platform_read
  on public.implementation_proposals
  for select to authenticated
  using (private.is_platform_operator(auth.uid()));

create or replace function private.assessment_proposal_from_review(target_assessment uuid)
returns public.implementation_proposals
language plpgsql
security definer
set search_path = public
as $$
declare
  assessment_row public.assessment_requests%rowtype;
  proposal_row public.implementation_proposals%rowtype;
  report jsonb;
  priority_value text;
  opportunity text;
  recommendation text;
begin
  select * into assessment_row
  from public.assessment_requests
  where id = target_assessment
  for update;

  if not found then raise exception 'assessment not found'; end if;
  if assessment_row.assessment_status <> 'approved' then raise exception 'assessment must be approved'; end if;

  report := coalesce(nullif(assessment_row.reviewed_report, '{}'::jsonb), '{}'::jsonb);
  priority_value := lower(coalesce(report->>'structuralPriority', report->>'priority', 'p1'));
  if priority_value not in ('p0','p1','p2','p3') then priority_value := 'p1'; end if;
  opportunity := coalesce(nullif(report->>'primaryOpportunity',''), 'Improve the path from customer intent to a structured business outcome.');
  recommendation := coalesce(nullif(report->>'recommendedPath',''), 'Discovery → Edge assessment → knowledge → policy → workflow → human review → outcome.');

  insert into public.implementation_proposals (
    assessment_request_id,
    status,
    policy_status,
    policy_version,
    title,
    summary,
    priority,
    proposed_action,
    evidence
  ) values (
    target_assessment,
    'proposed',
    'requires_human',
    'assessment-v1',
    'Quincestone implementation proposal for ' || coalesce(nullif(assessment_row.company,''), assessment_row.name),
    opportunity,
    priority_value,
    jsonb_build_object(
      'actionType', 'implementation.start',
      'provider', 'quincestone',
      'recommendedPath', recommendation,
      'requiresHumanAuthorization', true
    ),
    jsonb_build_object(
      'assessmentId', target_assessment,
      'website', assessment_row.website,
      'company', assessment_row.company,
      'report', report
    )
  )
  on conflict (assessment_request_id) do update
    set updated_at = now()
  returning * into proposal_row;

  perform public.record_platform_audit(
    assessment_row.reviewed_by,
    'assessment.implementation_proposal.created',
    'implementation_proposal',
    proposal_row.id::text,
    jsonb_build_object('assessment_id', target_assessment, 'priority', proposal_row.priority)
  );

  return proposal_row;
end;
$$;

revoke all on function private.assessment_proposal_from_review(uuid) from public, anon, authenticated;

create or replace function public.decide_implementation_proposal(
  target_proposal uuid,
  target_decision text,
  target_workspace_id uuid default null,
  target_reason text default null
)
returns public.implementation_proposals
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  proposal_row public.implementation_proposals%rowtype;
  next_status text;
begin
  if actor is null or not private.is_platform_operator(actor) then raise exception 'forbidden'; end if;
  if target_decision not in ('approved','rejected') then raise exception 'invalid proposal decision'; end if;

  select * into proposal_row
  from public.implementation_proposals
  where id = target_proposal
  for update;

  if not found then raise exception 'proposal not found'; end if;
  if proposal_row.status in ('approved','rejected','superseded') then raise exception 'proposal is already terminal'; end if;
  if target_decision = 'approved' and proposal_row.policy_status = 'blocked' then raise exception 'proposal is policy blocked'; end if;

  next_status := target_decision;
  update public.implementation_proposals
  set status = next_status,
      workspace_id = coalesce(target_workspace_id, workspace_id),
      approved_by = case when next_status = 'approved' then actor else null end,
      approved_at = case when next_status = 'approved' then now() else null end,
      rejection_reason = case when next_status = 'rejected' then nullif(trim(coalesce(target_reason,'')), '') else null end,
      updated_at = now()
  where id = target_proposal
  returning * into proposal_row;

  perform public.record_platform_audit(
    actor,
    'implementation_proposal.' || target_decision,
    'implementation_proposal',
    target_proposal::text,
    jsonb_build_object('workspace_id', proposal_row.workspace_id, 'reason', target_reason)
  );

  return proposal_row;
end;
$$;

revoke all on function public.decide_implementation_proposal(uuid,text,uuid,text) from public, anon, authenticated;
grant execute on function public.decide_implementation_proposal(uuid,text,uuid,text) to authenticated;

-- Assessment approval remains the authorization boundary. The proposal is deliberately
-- created in a non-executing state and must receive a separate human decision.
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
  if actor is null or not private.is_platform_operator(actor) then raise exception 'forbidden'; end if;
  if target_decision not in ('approved','changes_requested','rejected') then raise exception 'invalid decision'; end if;

  select * into row_data from public.assessment_requests where id = target_assessment for update;
  if not found then raise exception 'assessment not found'; end if;
  if row_data.assessment_status in ('approved','rejected') then raise exception 'assessment is already terminal'; end if;

  next_report := coalesce(target_report, row_data.reviewed_report, '{}'::jsonb);
  update public.assessment_requests
  set assessment_status = target_decision,
      review_notes = nullif(trim(coalesce(target_notes,'')),''),
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
    jsonb_build_object('assessment_status', target_decision, 'has_review_notes', nullif(trim(coalesce(target_notes,'')), '') is not null)
  );

  if target_decision = 'approved' then
    perform private.assessment_proposal_from_review(target_assessment);
  end if;

  return row_data;
end;
$$;

revoke all on function public.decide_assessment_review(uuid,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.decide_assessment_review(uuid,text,text,jsonb) to authenticated;
