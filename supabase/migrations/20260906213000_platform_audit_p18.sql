create table if not exists public.platform_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 1 and 120),
  resource_type text not null check (char_length(resource_type) between 1 and 80),
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_audit_events_created_at_idx on public.platform_audit_events (created_at desc);
create index if not exists platform_audit_events_actor_idx on public.platform_audit_events (actor_user_id, created_at desc);
create index if not exists platform_audit_events_resource_idx on public.platform_audit_events (resource_type, resource_id, created_at desc);

alter table public.platform_audit_events enable row level security;

-- Audit records are never writable or readable directly by browser clients.
-- Privileged server functions own the write/read boundary.
revoke all on table public.platform_audit_events from anon, authenticated;

authorize create or replace function private.record_platform_audit(
  target_actor uuid,
  target_action text,
  target_resource_type text,
  target_resource_id text default null,
  target_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_id uuid;
begin
  if not private.is_platform_admin(target_actor) then
    raise exception 'platform administrator authority required';
  end if;

  insert into public.platform_audit_events(actor_user_id, action, resource_type, resource_id, metadata)
  values (target_actor, target_action, target_resource_type, target_resource_id, coalesce(target_metadata, '{}'::jsonb))
  returning id into event_id;

  return event_id;
end;
$$;

revoke all on function private.record_platform_audit(uuid,text,text,text,jsonb) from public;
grant execute on function private.record_platform_audit(uuid,text,text,text,jsonb) to authenticated;
