create or replace function private.alert_on_interaction_failure()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  perform private.emit_operational_alert(new.workspace_id, 'edge-workspace', 'execution_failure', 'critical', 'Workspace Edge execution failed', 'An authenticated workspace interaction failed before a verified outcome was recorded.', 'edge-workspace:execution_failure', coalesce(new.trace_id::text, new.id::text), jsonb_build_object('interaction_id', new.id, 'trace_id', new.trace_id, 'status', new.status));
  return new;
end;
$$;

create or replace function private.alert_on_integration_failure()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  perform private.emit_operational_alert(new.workspace_id, 'integration', 'provider_execution_failure', 'warning', 'Integration execution failed', 'A provider integration event entered a failed state.', 'integration:' || coalesce(new.provider, 'unknown') || ':' || coalesce(new.event_type, 'unknown') || ':failure', coalesce(new.request_id, new.source_record_id::text, new.id::text), jsonb_build_object('provider', new.provider, 'event_type', new.event_type, 'status', new.status, 'error_code', new.error_code, 'request_id', new.request_id));
  return new;
end;
$$;

revoke all on function private.alert_on_interaction_failure() from public, anon, authenticated;
revoke all on function private.alert_on_integration_failure() from public, anon, authenticated;
