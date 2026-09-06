-- P11: durable, auditable operational alerts.
-- Alert records are server-written. Workspace members may read only alerts
-- belonging to workspaces they belong to.

create table if not exists public.operational_alerts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  source text not null,
  signal_type text not null,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved', 'suppressed')),
  title text not null,
  description text,
  deduplication_key text,
  correlation_id text,
  evidence jsonb not null default '{}'::jsonb,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint operational_alerts_deduplication_scope check (
    deduplication_key is null or length(trim(deduplication_key)) > 0
  )
);

create unique index if not exists operational_alerts_workspace_dedup_uidx
  on public.operational_alerts (workspace_id, deduplication_key)
  where deduplication_key is not null;

create index if not exists operational_alerts_workspace_status_idx
  on public.operational_alerts (workspace_id, status, severity, last_seen_at desc);

create index if not exists operational_alerts_source_signal_idx
  on public.operational_alerts (source, signal_type, last_seen_at desc);

create index if not exists operational_alerts_correlation_idx
  on public.operational_alerts (correlation_id)
  where correlation_id is not null;

alter table public.operational_alerts enable row level security;

revoke all on public.operational_alerts from anon, authenticated;

drop policy if exists "workspace members can view operational alerts" on public.operational_alerts;
create policy "workspace members can view operational alerts"
  on public.operational_alerts
  for select
  to authenticated
  using (
    workspace_id is not null
    and private.is_workspace_member(workspace_id)
  );

-- No browser insert/update/delete policy. Alert mutation remains server-side.

create or replace function public.set_operational_alerts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_operational_alerts_updated_at() from public, anon, authenticated;

drop trigger if exists operational_alerts_set_updated_at on public.operational_alerts;
create trigger operational_alerts_set_updated_at
  before update on public.operational_alerts
  for each row execute function public.set_operational_alerts_updated_at();
