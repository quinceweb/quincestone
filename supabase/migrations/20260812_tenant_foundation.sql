create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  status text not null default 'active' check (status in ('active', 'invited')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists tenant_memberships_user_id_idx on public.tenant_memberships(user_id);
create index if not exists tenant_memberships_tenant_id_idx on public.tenant_memberships(tenant_id);

alter table public.tenants enable row level security;
alter table public.tenant_memberships enable row level security;

create policy "members can read their tenants"
on public.tenants for select
to authenticated
using (
  exists (
    select 1 from public.tenant_memberships m
    where m.tenant_id = tenants.id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

create policy "members can read their membership"
on public.tenant_memberships for select
to authenticated
using (user_id = auth.uid());

-- This migration is intentionally not applied by this architecture branch.
-- Tenant creation, membership management, and elevated roles require the
-- authenticated application authorization layer to be deployed and verified first.
