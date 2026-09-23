-- Edge Business Installation vertical slice.
-- Recovery: disable an installation before rollback; preserve interactions and
-- events. Dropping this table is intentionally not part of normal rollback.

create table public.edge_installations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 120),
  public_installation_key uuid not null default gen_random_uuid() unique,
  channel_type text not null default 'website' check (channel_type in ('website', 'platform')),
  status text not null default 'active' check (status in ('active', 'disabled', 'revoked')),
  allowed_origins text[] not null default '{}'::text[],
  configuration jsonb not null default '{}'::jsonb check (jsonb_typeof(configuration) = 'object'),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz,
  last_activity_at timestamptz,
  constraint edge_installations_origins_count check (cardinality(allowed_origins) between 1 and 25),
  constraint edge_installations_origins_length check (char_length(array_to_string(allowed_origins, ',')) <= 6400),
  constraint edge_installations_revocation_state check (
    (status = 'revoked' and revoked_at is not null) or (status <> 'revoked' and revoked_at is null)
  )
);

create index edge_installations_workspace_updated_idx
  on public.edge_installations(workspace_id, updated_at desc);
create index edge_installations_active_key_idx
  on public.edge_installations(public_installation_key) where status = 'active';

alter table public.interactions
  add column installation_id uuid references public.edge_installations(id) on delete set null,
  add column channel_session_id text;

alter table public.interactions
  add constraint interactions_channel_session_id_check
  check (channel_session_id is null or char_length(channel_session_id) between 16 and 200);

create index interactions_installation_created_idx
  on public.interactions(installation_id, created_at desc) where installation_id is not null;
create index interactions_installation_session_idx
  on public.interactions(installation_id, channel_session_id) where channel_session_id is not null;

create table private.edge_intake_rate_limits (
  installation_id uuid not null references public.edge_installations(id) on delete cascade,
  client_fingerprint text not null check (char_length(client_fingerprint) = 64),
  window_started_at timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  primary key (installation_id, client_fingerprint, window_started_at)
);

create index edge_intake_rate_limits_cleanup_idx
  on private.edge_intake_rate_limits(window_started_at);

alter table public.edge_installations enable row level security;
revoke all on public.edge_installations from anon, authenticated;
grant select, insert, update on public.edge_installations to authenticated;

create policy edge_installations_select_member on public.edge_installations
  for select to authenticated
  using ((select private.is_workspace_member(workspace_id)));

create policy edge_installations_insert_admin on public.edge_installations
  for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and (select private.is_workspace_admin(workspace_id))
  );

create policy edge_installations_update_admin on public.edge_installations
  for update to authenticated
  using ((select private.is_workspace_admin(workspace_id)))
  with check ((select private.is_workspace_admin(workspace_id)));

create or replace function private.edge_installation_before_update()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.workspace_id = old.workspace_id;
  new.public_installation_key = old.public_installation_key;
  new.created_by = old.created_by;
  new.created_at = old.created_at;
  new.updated_at = now();
  if old.status = 'revoked' then
    new.status = 'revoked';
    new.revoked_at = old.revoked_at;
  elsif new.status = 'revoked' then
    new.revoked_at = coalesce(new.revoked_at, now());
  else
    new.revoked_at = null;
  end if;
  return new;
end;
$$;
revoke all on function private.edge_installation_before_update() from public, anon, authenticated;

create trigger edge_installations_before_update
before update on public.edge_installations
for each row execute function private.edge_installation_before_update();

create or replace function private.audit_edge_installation_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  event_name text;
begin
  event_name := case
    when tg_op = 'INSERT' then 'edge.installation_created'
    when new.status = 'revoked' and old.status <> 'revoked' then 'edge.installation_revoked'
    when new.status = 'disabled' and old.status <> 'disabled' then 'edge.installation_disabled'
    when new.status = 'active' and old.status <> 'active' then 'edge.installation_enabled'
    else 'edge.installation_updated'
  end;
  insert into public.events (
    workspace_id, aggregate_type, aggregate_id, event_type, actor_type, actor_id,
    idempotency_key, payload
  ) values (
    new.workspace_id, 'edge_installation', new.id, event_name,
    case when (select auth.uid()) is null then 'system' else 'user' end,
    (select auth.uid()), event_name || ':' || new.id::text || ':' || extract(epoch from new.updated_at)::text,
    jsonb_build_object('status', new.status, 'channel_type', new.channel_type)
  );
  return new;
end;
$$;
revoke all on function private.audit_edge_installation_change() from public, anon, authenticated;

create trigger edge_installations_audit_insert
after insert on public.edge_installations
for each row execute function private.audit_edge_installation_change();

create trigger edge_installations_audit_update
after update on public.edge_installations
for each row when (
  old.name is distinct from new.name
  or old.channel_type is distinct from new.channel_type
  or old.status is distinct from new.status
  or old.allowed_origins is distinct from new.allowed_origins
  or old.configuration is distinct from new.configuration
)
execute function private.audit_edge_installation_change();

create or replace function public.consume_edge_intake_quota(
  target_installation_id uuid,
  target_fingerprint text,
  target_limit integer default 20,
  target_window_seconds integer default 60
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  bucket timestamptz;
  current_count integer;
begin
  if target_limit < 1 or target_limit > 1000 or target_window_seconds < 10 or target_window_seconds > 3600
    or target_fingerprint !~ '^[0-9a-f]{64}$' then
    raise exception using errcode = '22023', message = 'Invalid quota arguments.';
  end if;
  bucket := to_timestamp(floor(extract(epoch from now()) / target_window_seconds) * target_window_seconds);
  insert into private.edge_intake_rate_limits(installation_id, client_fingerprint, window_started_at)
  values(target_installation_id, target_fingerprint, bucket)
  on conflict (installation_id, client_fingerprint, window_started_at)
  do update set request_count = private.edge_intake_rate_limits.request_count + 1
  returning request_count into current_count;
  return current_count <= target_limit;
end;
$$;
revoke all on function public.consume_edge_intake_quota(uuid, text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_edge_intake_quota(uuid, text, integer, integer) to service_role;

comment on table public.edge_installations is
  'Workspace-bound public Edge channel identifiers. Public keys identify installations and confer no operator authority.';
comment on column public.edge_installations.public_installation_key is
  'Opaque public identifier; not a secret and not an authorization credential.';
comment on column public.edge_installations.configuration is
  'Browser-safe presentation configuration only. Credentials are prohibited.';
