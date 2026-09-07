create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'operator')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_admins_active_idx
  on public.platform_admins (active)
  where active = true;

alter table public.platform_admins enable row level security;

-- Deliberately no client-readable policies. Platform-admin membership is resolved
-- by server-side trusted functions/API boundaries, not by workspace RLS.

create schema if not exists private;

create or replace function private.is_platform_admin(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.platform_admins pa
    where pa.user_id = target_user
      and pa.active = true
      and pa.role = 'admin'
  );
$$;

revoke all on function private.is_platform_admin(uuid) from public;
grant execute on function private.is_platform_admin(uuid) to authenticated;

create or replace function private.is_platform_operator(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.platform_admins pa
    where pa.user_id = target_user
      and pa.active = true
      and pa.role in ('admin', 'operator')
  );
$$;

revoke all on function private.is_platform_operator(uuid) from public;
grant execute on function private.is_platform_operator(uuid) to authenticated;

create or replace function private.touch_platform_admins_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists platform_admins_updated_at on public.platform_admins;
create trigger platform_admins_updated_at
before update on public.platform_admins
for each row execute function private.touch_platform_admins_updated_at();
