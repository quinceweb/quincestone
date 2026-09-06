create or replace function private.emit_operational_alert(
  p_workspace_id uuid,
  p_source text,
  p_signal_type text,
  p_severity text,
  p_title text,
  p_description text,
  p_deduplication_key text,
  p_correlation_id text,
  p_evidence jsonb
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.operational_alerts (workspace_id, source, signal_type, severity, status, title, description, deduplication_key, correlation_id, evidence, first_seen_at, last_seen_at)
  values (p_workspace_id, p_source, p_signal_type, p_severity, 'open', p_title, p_description, p_deduplication_key, p_correlation_id, coalesce(p_evidence, '{}'::jsonb), now(), now())
  on conflict (workspace_id, deduplication_key) where deduplication_key is not null
  do update set
    severity = excluded.severity,
    status = case when public.operational_alerts.status in ('resolved', 'suppressed') then 'open' else public.operational_alerts.status end,
    description = excluded.description,
    correlation_id = excluded.correlation_id,
    evidence = excluded.evidence,
    last_seen_at = now(),
    updated_at = now();
end;
$$;

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

revoke all on function private.emit_operational_alert(uuid, text, text, text, text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function private.alert_on_interaction_failure() from public, anon, authenticated;
revoke all on function private.alert_on_integration_failure() from public, anon, authenticated;

drop trigger if exists interactions_operational_alert_on_failure on public.interactions;
create trigger interactions_operational_alert_on_failure after update of status on public.interactions for each row when (new.status = 'failed' and old.status is distinct from new.status) execute function private.alert_on_interaction_failure();

drop trigger if exists integration_events_operational_alert_on_failure_insert on public.integration_events;
create trigger integration_events_operational_alert_on_failure_insert after insert on public.integration_events for each row when (new.status in ('failed', 'error')) execute function private.alert_on_integration_failure();

drop trigger if exists integration_events_operational_alert_on_failure_update on public.integration_events;
create trigger integration_events_operational_alert_on_failure_update after update of status on public.integration_events for each row when (new.status in ('failed', 'error') and old.status is distinct from new.status) execute function private.alert_on_integration_failure();
