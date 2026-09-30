-- FUP-C02: minimum durable Business operating context.
-- Workspace-owned, member-readable and owner/admin writable.
-- Recovery: stop writes and leave rows in place; dropping this table is not part of normal rollback.

create table public.workspace_business_context (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  description text not null check (char_length(trim(description)) between 10 and 1000),
  offerings text[] not null check (
    cardinality(offerings) between 1 and 12
    and char_length(array_to_string(offerings, ',')) <= 1440
  ),
  primary_customers text not null check (char_length(trim(primary_customers)) between 2 and 500),
  operating_region text check (operating_region is null or char_length(trim(operating_region)) between 2 and 120),
  website text check (
    website is null or (
      char_length(website) <= 300
      and website ~ '^https://[^[:space:]]+$'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workspace_business_context enable row level security;
revoke all on public.workspace_business_context from anon, authenticated;
grant select, insert, update on public.workspace_business_context to authenticated;

create policy workspace_business_context_select_member on public.workspace_business_context
  for select to authenticated
  using ((select private.is_workspace_member(workspace_id)));

create policy workspace_business_context_insert_admin on public.workspace_business_context
  for insert to authenticated
  with check ((select private.is_workspace_admin(workspace_id)));

create policy workspace_business_context_update_admin on public.workspace_business_context
  for update to authenticated
  using ((select private.is_workspace_admin(workspace_id)))
  with check ((select private.is_workspace_admin(workspace_id)));

create or replace function private.workspace_business_context_before_update()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.workspace_id = old.workspace_id;
  new.created_at = old.created_at;
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function private.workspace_business_context_before_update() from public, anon, authenticated;

create trigger workspace_business_context_before_update
before update on public.workspace_business_context
for each row execute function private.workspace_business_context_before_update();

comment on table public.workspace_business_context is
  'Minimum workspace-owned operating context consumed by governed Edge qualification.';

comment on column public.workspace_business_context.offerings is
  'Concise customer-facing offerings used to improve demand interpretation; not workflow authority.';
