-- Executor transitions are callable only with the server-side execution credential.
create or replace function public.claim_action_execution(target_id uuid)
returns public.action_executions
language plpgsql
security definer
set search_path = ''
as $$
begin
  return private.claim_action_execution(target_id);
end;
$$;

create or replace function public.complete_action_execution(target_id uuid, target_provider_reference text, target_result jsonb)
returns public.action_executions
language plpgsql
security definer
set search_path = ''
as $$
begin
  return private.complete_action_execution(target_id, target_provider_reference, target_result);
end;
$$;

create or replace function public.fail_action_execution(target_id uuid, target_status text, target_error_code text, target_error_message text, target_retry_at timestamptz, target_provider_reference text)
returns public.action_executions
language plpgsql
security definer
set search_path = ''
as $$
begin
  return private.fail_action_execution(target_id, target_status, target_error_code, target_error_message, target_retry_at, target_provider_reference);
end;
$$;

revoke all on function public.claim_action_execution(uuid) from public, anon, authenticated;
revoke all on function public.complete_action_execution(uuid,text,jsonb) from public, anon, authenticated;
revoke all on function public.fail_action_execution(uuid,text,text,text,timestamptz,text) from public, anon, authenticated;
grant execute on function public.claim_action_execution(uuid) to service_role;
grant execute on function public.complete_action_execution(uuid,text,jsonb) to service_role;
grant execute on function public.fail_action_execution(uuid,text,text,text,timestamptz,text) to service_role;

-- Canonical event writes are server-authorized and workspace-scoped.
create or replace function private.emit_event(
  target_workspace_id uuid, target_aggregate_type text, target_aggregate_id uuid, target_event_type text,
  target_actor_type text, target_actor_id uuid, target_correlation_id text, target_causation_id uuid,
  target_idempotency_key text, target_payload jsonb
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare event_id uuid;
begin
  if target_workspace_id is null then raise exception using errcode = '22023', message = 'Workspace is required for canonical events.'; end if;
  if (select auth.uid()) is not null and not (select private.is_workspace_member(target_workspace_id)) then
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
grant execute on function private.emit_event(uuid,text,uuid,text,text,uuid,text,uuid,text,jsonb) to authenticated, service_role;
