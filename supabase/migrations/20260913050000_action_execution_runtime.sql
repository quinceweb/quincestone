-- Durable execution state transitions. Provider workers must claim before side effects.
create or replace function private.claim_action_execution(target_id uuid)
returns public.action_executions
language plpgsql
security definer
set search_path = ''
as $$
declare row_value public.action_executions%rowtype;
begin
  update public.action_executions
  set status = 'running', attempt_count = attempt_count + 1, started_at = coalesce(started_at, now()), updated_at = now()
  where id = target_id and status in ('authorized','queued','retryable')
  returning * into row_value;
  if row_value.id is null then
    select * into row_value from public.action_executions where id = target_id;
    if row_value.id is null then raise exception using errcode = 'P0002', message = 'Action execution not found.'; end if;
    raise exception using errcode = '55000', message = 'Action execution is not claimable.';
  end if;
  return row_value;
end;
$$;

create or replace function private.complete_action_execution(target_id uuid, target_provider_reference text, target_result jsonb)
returns public.action_executions
language plpgsql
security definer
set search_path = ''
as $$
declare row_value public.action_executions%rowtype;
begin
  update public.action_executions
  set status = 'succeeded', provider_reference = coalesce(target_provider_reference, provider_reference), result = coalesce(target_result, '{}'::jsonb), error_code = null, error_message = null, next_retry_at = null, completed_at = now(), updated_at = now()
  where id = target_id and status = 'running'
  returning * into row_value;
  if row_value.id is null then raise exception using errcode = '55000', message = 'Action execution is not running.'; end if;
  perform private.emit_event(row_value.workspace_id, 'action_execution', row_value.id, 'action.executed', 'system', null, 'action:' || row_value.id::text, null, 'action.executed:' || row_value.id::text, jsonb_build_object('status','succeeded','provider',row_value.provider,'provider_reference',row_value.provider_reference));
  return row_value;
end;
$$;

create or replace function private.fail_action_execution(target_id uuid, target_status text, target_error_code text, target_error_message text, target_retry_at timestamptz, target_provider_reference text)
returns public.action_executions
language plpgsql
security definer
set search_path = ''
as $$
declare row_value public.action_executions%rowtype;
  final_status text;
begin
  final_status := case when target_status in ('failed','retryable','unknown') then target_status else 'failed' end;
  update public.action_executions
  set status = final_status, provider_reference = coalesce(target_provider_reference, provider_reference), error_code = left(coalesce(target_error_code,'EXECUTION_FAILED'),128), error_message = left(coalesce(target_error_message,'Action execution failed.'),2000), next_retry_at = case when final_status = 'retryable' then target_retry_at else null end, completed_at = case when final_status in ('failed','unknown') then now() else null end, updated_at = now()
  where id = target_id and status = 'running'
  returning * into row_value;
  if row_value.id is null then raise exception using errcode = '55000', message = 'Action execution is not running.'; end if;
  perform private.emit_event(row_value.workspace_id, 'action_execution', row_value.id, 'action.execution_failed', 'system', null, 'action:' || row_value.id::text, null, 'action.execution_failed:' || row_value.id::text, jsonb_build_object('status',row_value.status,'error_code',row_value.error_code));
  return row_value;
end;
$$;

revoke all on function private.claim_action_execution(uuid) from public, anon, authenticated;
revoke all on function private.complete_action_execution(uuid,text,jsonb) from public, anon, authenticated;
revoke all on function private.fail_action_execution(uuid,text,text,text,timestamptz,text) from public, anon, authenticated;
