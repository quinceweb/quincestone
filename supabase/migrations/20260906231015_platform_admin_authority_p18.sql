create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','operator')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.platform_admins enable row level security;

create or replace function private.is_platform_admin(target_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.platform_admins pa where pa.user_id = target_user and pa.active and pa.role = 'admin');
$$;
revoke all on function private.is_platform_admin(uuid) from public;
grant execute on function private.is_platform_admin(uuid) to authenticated;

create or replace function private.is_platform_operator(target_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.platform_admins pa where pa.user_id = target_user and pa.active and pa.role in ('admin','operator'));
$$;
revoke all on function private.is_platform_operator(uuid) from public;
grant execute on function private.is_platform_operator(uuid) to authenticated;
