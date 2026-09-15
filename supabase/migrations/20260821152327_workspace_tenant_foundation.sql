create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 2 and 80),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index if not exists workspace_members_user_idx on public.workspace_members(user_id);
create index if not exists workspace_members_workspace_idx on public.workspace_members(workspace_id);

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace
      and wm.user_id = auth.uid()
  );
$$;

revoke all on function public.is_workspace_member(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;

alter table public.appointment_requests add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.calendar_integrations add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.integration_events add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.intelligence_traces add column if not exists workspace_id uuid references public.workspaces(id) on delete cascade;

create index if not exists appointment_requests_workspace_idx on public.appointment_requests(workspace_id, created_at desc);
create index if not exists calendar_integrations_workspace_idx on public.calendar_integrations(workspace_id);
create index if not exists integration_events_workspace_idx on public.integration_events(workspace_id, created_at desc);
create index if not exists intelligence_traces_workspace_idx on public.intelligence_traces(workspace_id, created_at desc);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create policy workspaces_select_member on public.workspaces
  for select to authenticated
  using (public.is_workspace_member(id));

create policy workspaces_insert_creator on public.workspaces
  for insert to authenticated
  with check (created_by = auth.uid());

create policy workspaces_update_admin on public.workspaces
  for update to authenticated
  using (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  ))
  with check (created_by = auth.uid());

create policy workspace_members_select_member on public.workspace_members
  for select to authenticated
  using (user_id = auth.uid() or public.is_workspace_member(workspace_id));

create policy workspace_members_insert_self_owner on public.workspace_members
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and role = 'owner'
    and exists (
      select 1 from public.workspaces w
      where w.id = workspace_id and w.created_by = auth.uid()
    )
  );

create policy workspace_members_insert_admin on public.workspace_members
  for insert to authenticated
  with check (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  ));

create policy workspace_members_update_admin on public.workspace_members
  for update to authenticated
  using (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  ));

create policy workspace_members_delete_admin on public.workspace_members
  for delete to authenticated
  using (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  ));

create policy appointment_requests_select_member on public.appointment_requests
  for select to authenticated using (public.is_workspace_member(workspace_id));
create policy appointment_requests_insert_member on public.appointment_requests
  for insert to authenticated with check (public.is_workspace_member(workspace_id));
create policy appointment_requests_update_member on public.appointment_requests
  for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy appointment_requests_delete_admin on public.appointment_requests
  for delete to authenticated using (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  ));

create policy calendar_integrations_select_member on public.calendar_integrations
  for select to authenticated using (public.is_workspace_member(workspace_id));
create policy calendar_integrations_insert_admin on public.calendar_integrations
  for insert to authenticated with check (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  ));
create policy calendar_integrations_update_admin on public.calendar_integrations
  for update to authenticated using (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  )) with check (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  ));
create policy calendar_integrations_delete_admin on public.calendar_integrations
  for delete to authenticated using (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  ));

create policy integration_events_select_member on public.integration_events
  for select to authenticated using (public.is_workspace_member(workspace_id));

create policy intelligence_traces_select_member on public.intelligence_traces
  for select to authenticated using (public.is_workspace_member(workspace_id));
