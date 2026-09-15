create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  aggregate_type text not null,
  aggregate_id uuid,
  event_type text not null,
  schema_version integer not null default 1,
  actor_type text not null check (actor_type in ('customer','user','system','provider')),
  actor_id uuid,
  correlation_id text,
  causation_id uuid references public.events(id) on delete set null,
  idempotency_key text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists events_workspace_id_idempotency_key_uidx
  on public.events(workspace_id, idempotency_key)
  where idempotency_key is not null;

create index if not exists events_workspace_aggregate_idx
  on public.events(workspace_id, aggregate_type, aggregate_id, occurred_at desc);

create index if not exists events_workspace_event_type_idx
  on public.events(workspace_id, event_type, occurred_at desc);

create index if not exists events_correlation_idx
  on public.events(correlation_id, occurred_at desc)
  where correlation_id is not null;

alter table public.events enable row level security;
revoke all on table public.events from anon, authenticated;

drop policy if exists "Workspace members can read events" on public.events;
create policy "Workspace members can read events"
  on public.events
  for select
  to authenticated
  using (private.is_workspace_member(workspace_id));
