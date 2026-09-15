create or replace function public.decide_human_review(target_review uuid, target_decision text, target_reason text)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  review_row public.human_reviews%rowtype;
  now_value timestamptz := now();
  next_interaction_status text;
  next_outcome jsonb;
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Authentication required.';
  end if;

  if target_decision not in ('approved', 'rejected', 'resolved') then
    raise exception using errcode = '22023', message = 'Invalid human-review decision.';
  end if;

  if char_length(trim(target_reason)) < 3 or char_length(trim(target_reason)) > 2000 then
    raise exception using errcode = '22023', message = 'A decision reason between 3 and 2,000 characters is required.';
  end if;

  select * into review_row
  from public.human_reviews
  where id = target_review
  for update;

  if review_row.id is null then
    raise exception using errcode = 'P0002', message = 'Review item not found.';
  end if;

  if not (select private.is_workspace_admin(review_row.workspace_id)) then
    raise exception using errcode = '42501', message = 'Only workspace owners and admins can make human-review decisions.';
  end if;

  if review_row.status in ('approved', 'rejected', 'resolved') then
    raise exception using errcode = '23514', message = 'This review item already has a terminal human decision.';
  end if;

  update public.human_reviews
  set status = target_decision,
      decision = target_decision,
      decision_reason = trim(target_reason),
      actor_user_id = (select auth.uid()),
      reviewed_at = now_value
  where id = review_row.id;

  next_interaction_status := case when target_decision = 'approved' then 'in_progress' else 'completed' end;
  next_outcome := coalesce((select outcome from public.interactions where id = review_row.interaction_id), '{}'::jsonb)
    || jsonb_build_object(
      'status', case when target_decision = 'approved' then 'authorized_not_executed' when target_decision = 'rejected' then 'rejected_by_human' else 'resolved_by_human' end,
      'humanDecision', target_decision,
      'humanDecisionReason', trim(target_reason),
      'humanDecisionAt', now_value,
      'externalExecution', 'not_executed'
    );

  update public.interactions
  set status = next_interaction_status,
      outcome = next_outcome
  where id = review_row.interaction_id
    and workspace_id = review_row.workspace_id;

  if review_row.trace_id is not null then
    update public.intelligence_traces
    set outcome = coalesce(outcome, '{}'::jsonb)
      || jsonb_build_object(
        'humanDecision', target_decision,
        'humanDecisionReason', trim(target_reason),
        'humanDecisionAt', now_value,
        'externalExecution', 'not_executed'
      ),
      escalation = coalesce(escalation, '{}'::jsonb)
      || jsonb_build_object(
        'resolvedByHuman', true,
        'decision', target_decision,
        'decisionReason', trim(target_reason)
      )
    where id = review_row.trace_id
      and workspace_id = review_row.workspace_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'review_id', review_row.id,
    'decision', target_decision,
    'recorded_at', now_value
  );
end;
$$;

revoke all on function public.decide_human_review(uuid, text, text) from public, anon;
grant execute on function public.decide_human_review(uuid, text, text) to authenticated;
