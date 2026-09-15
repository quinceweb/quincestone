create or replace function private.emit_event(
  target_workspace_id uuid, target_aggregate_type text, target_aggregate_id uuid, target_event_type text,
  target_actor_type text, target_actor_id uuid, target_correlation_id text, target_causation_id uuid,
  target_idempotency_key text, target_payload jsonb
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare event_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Authentication required.';
  end if;
  if target_workspace_id is null then
    raise exception using errcode = '22023', message = 'Workspace is required for canonical events.';
  end if;
  if not (select private.is_workspace_member(target_workspace_id)) then
    raise exception using errcode = '42501', message = 'Workspace membership required.';
  end if;

  insert into public.events (workspace_id, aggregate_type, aggregate_id, event_type, actor_type, actor_id, correlation_id, causation_id, idempotency_key, payload)
  values (target_workspace_id, target_aggregate_type, target_aggregate_id, target_event_type, target_actor_type, target_actor_id, target_correlation_id, target_causation_id, target_idempotency_key, coalesce(target_payload, '{}'::jsonb))
  on conflict (workspace_id, idempotency_key) where idempotency_key is not null
  do update set idempotency_key = excluded.idempotency_key
  returning id into event_id;
  return event_id;
end;
$$;

revoke all on function private.emit_event(uuid,text,uuid,text,text,uuid,text,uuid,text,jsonb) from public, anon;
grant execute on function private.emit_event(uuid,text,uuid,text,text,uuid,text,uuid,text,jsonb) to authenticated;

create or replace function public.decide_human_review(target_review uuid, target_decision text, target_reason text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  review_row public.human_reviews%rowtype;
  now_value timestamptz := now();
  next_interaction_status text;
  next_outcome jsonb;
  action_row public.action_executions%rowtype;
  proposed_action jsonb;
  should_execute boolean := false;
  action_key text;
  action_hash text;
  correlation_key text;
begin
  if (select auth.uid()) is null then raise exception using errcode = '42501', message = 'Authentication required.'; end if;
  if target_decision not in ('approved', 'rejected', 'resolved') then raise exception using errcode = '22023', message = 'Invalid human-review decision.'; end if;
  if char_length(trim(target_reason)) < 3 or char_length(trim(target_reason)) > 2000 then raise exception using errcode = '22023', message = 'A decision reason between 3 and 2,000 characters is required.'; end if;
  select * into review_row from public.human_reviews where id = target_review for update;
  if review_row.id is null then raise exception using errcode = 'P0002', message = 'Review item not found.'; end if;
  if not (select private.is_workspace_admin(review_row.workspace_id)) then raise exception using errcode = '42501', message = 'Only workspace owners and admins can make human-review decisions.'; end if;
  if review_row.status in ('approved', 'rejected', 'resolved') then raise exception using errcode = '23514', message = 'This review item already has a terminal human decision.'; end if;

  proposed_action := coalesce(review_row.proposed_action, '{}'::jsonb);
  should_execute := target_decision = 'approved' and (
    coalesce((proposed_action ->> 'execute')::boolean, false)
    or coalesce((proposed_action ->> 'externalSideEffect')::boolean, false)
    or coalesce((proposed_action ->> 'external_side_effect')::boolean, false)
  );
  correlation_key := 'review:' || review_row.id::text;

  update public.human_reviews set status = target_decision, decision = target_decision, decision_reason = trim(target_reason), actor_user_id = (select auth.uid()), reviewed_at = now_value where id = review_row.id;
  next_interaction_status := case when target_decision = 'approved' then 'in_progress' else 'completed' end;
  next_outcome := coalesce((select outcome from public.interactions where id = review_row.interaction_id), '{}'::jsonb) || jsonb_build_object(
    'status', case when target_decision = 'approved' and should_execute then 'authorized' when target_decision = 'approved' then 'authorized_not_executed' when target_decision = 'rejected' then 'rejected_by_human' else 'resolved_by_human' end,
    'humanDecision', target_decision, 'humanDecisionReason', trim(target_reason), 'humanDecisionAt', now_value,
    'externalExecution', case when should_execute then 'authorized' else 'not_executed' end
  );
  update public.interactions set status = next_interaction_status, outcome = next_outcome where id = review_row.interaction_id and workspace_id = review_row.workspace_id;

  if review_row.trace_id is not null then
    update public.intelligence_traces set
      outcome = coalesce(outcome, '{}'::jsonb) || jsonb_build_object('humanDecision', target_decision, 'humanDecisionReason', trim(target_reason), 'humanDecisionAt', now_value, 'externalExecution', case when should_execute then 'authorized' else 'not_executed' end),
      escalation = coalesce(escalation, '{}'::jsonb) || jsonb_build_object('resolvedByHuman', true, 'decision', target_decision, 'decisionReason', trim(target_reason))
    where id = review_row.trace_id and workspace_id = review_row.workspace_id;
  end if;

  perform private.emit_event(review_row.workspace_id, 'human_review', review_row.id, 'human_review.decided', 'user', (select auth.uid()), correlation_key, null, 'human_review.decided:' || review_row.id::text, jsonb_build_object('decision', target_decision, 'interaction_id', review_row.interaction_id, 'reason', trim(target_reason)));

  if should_execute then
    action_key := 'human_review:' || review_row.id::text;
    action_hash := encode(digest(convert_to(proposed_action::text, 'utf8'), 'sha256'), 'hex');
    insert into public.action_executions (workspace_id, interaction_id, trace_id, human_review_id, action_type, provider, status, idempotency_key, parameters, parameters_hash, requested_by, authorized_by, authorized_at)
    values (review_row.workspace_id, review_row.interaction_id, review_row.trace_id, review_row.id,
      coalesce(proposed_action ->> 'actionType', proposed_action ->> 'action_type', 'governed_action'),
      coalesce(proposed_action ->> 'provider', 'internal'), 'authorized', action_key,
      coalesce(proposed_action -> 'parameters', proposed_action), action_hash,
      review_row.actor_user_id, review_row.actor_user_id, now_value)
    on conflict (workspace_id, idempotency_key) do nothing
    returning * into action_row;

    if action_row.id is not null then
      perform private.emit_event(review_row.workspace_id, 'action_execution', action_row.id, 'action.authorized', 'user', review_row.actor_user_id, correlation_key, null, 'action.authorized:' || action_row.id::text, jsonb_build_object('action_type', action_row.action_type, 'provider', action_row.provider, 'human_review_id', review_row.id));
    end if;
  end if;

  return jsonb_build_object('ok', true, 'review_id', review_row.id, 'decision', target_decision, 'action_execution_id', case when action_row.id is null then null else action_row.id end, 'recorded_at', now_value);
end;
$$;

revoke all on function public.decide_human_review(uuid, text, text) from public, anon;
grant execute on function public.decide_human_review(uuid, text, text) to authenticated;
