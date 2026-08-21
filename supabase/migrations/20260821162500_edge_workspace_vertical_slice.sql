alter table public.interactions
  add column if not exists message text;

alter table public.interactions
  add constraint interactions_message_check
  check (message is null or char_length(message) between 3 and 2000);

alter table public.intelligence_traces
  add column if not exists interaction_id uuid references public.interactions(id) on delete cascade,
  add column if not exists customer_id uuid references public.customers(id) on delete set null,
  add column if not exists execution_version text not null default 'edge-workspace-1',
  add column if not exists observed_facts jsonb not null default '{}'::jsonb,
  add column if not exists action_proposal jsonb not null default '{}'::jsonb;

alter table public.intelligence_traces
  drop constraint if exists intelligence_traces_mode_check,
  drop constraint if exists intelligence_traces_tenant_key_check;

alter table public.intelligence_traces
  add constraint intelligence_traces_mode_check
  check (mode in ('demo', 'workspace')),
  add constraint intelligence_traces_tenant_key_check
  check (char_length(tenant_key) between 1 and 160),
  add constraint intelligence_traces_workspace_mode_check
  check ((mode = 'demo' and workspace_id is null) or (mode = 'workspace' and workspace_id is not null));

create index if not exists interactions_created_at_idx on public.interactions (created_at desc);
create index if not exists intelligence_traces_interaction_idx on public.intelligence_traces (interaction_id);
create index if not exists intelligence_traces_customer_idx on public.intelligence_traces (customer_id);
create index if not exists intelligence_traces_execution_version_idx on public.intelligence_traces (execution_version);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 160),
  content text not null check (char_length(content) between 1 and 12000),
  version text not null check (char_length(version) between 1 and 80),
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_documents_workspace_idx on public.knowledge_documents (workspace_id, status, updated_at desc);

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 160),
  description text not null check (char_length(description) between 1 and 2000),
  effect text not null check (effect in ('allow', 'require_review', 'constrain', 'deny')),
  priority integer not null default 100 check (priority between 1 and 10000),
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists policies_workspace_idx on public.policies (workspace_id, status, priority);

alter table public.knowledge_documents enable row level security;
alter table public.policies enable row level security;

drop policy if exists knowledge_documents_select_member on public.knowledge_documents;
create policy knowledge_documents_select_member
  on public.knowledge_documents
  for select
  to authenticated
  using ((select private.is_workspace_member(workspace_id)));

drop policy if exists knowledge_documents_insert_admin on public.knowledge_documents;
create policy knowledge_documents_insert_admin
  on public.knowledge_documents
  for insert
  to authenticated
  with check ((select private.is_workspace_admin(workspace_id)));

drop policy if exists knowledge_documents_update_admin on public.knowledge_documents;
create policy knowledge_documents_update_admin
  on public.knowledge_documents
  for update
  to authenticated
  using ((select private.is_workspace_admin(workspace_id)))
  with check ((select private.is_workspace_admin(workspace_id)));

drop policy if exists knowledge_documents_delete_admin on public.knowledge_documents;
create policy knowledge_documents_delete_admin
  on public.knowledge_documents
  for delete
  to authenticated
  using ((select private.is_workspace_admin(workspace_id)));

drop policy if exists policies_select_member on public.policies;
create policy policies_select_member
  on public.policies
  for select
  to authenticated
  using ((select private.is_workspace_member(workspace_id)));

drop policy if exists policies_insert_admin on public.policies;
create policy policies_insert_admin
  on public.policies
  for insert
  to authenticated
  with check ((select private.is_workspace_admin(workspace_id)));

drop policy if exists policies_update_admin on public.policies;
create policy policies_update_admin
  on public.policies
  for update
  to authenticated
  using ((select private.is_workspace_admin(workspace_id)))
  with check ((select private.is_workspace_admin(workspace_id)));

drop policy if exists policies_delete_admin on public.policies;
create policy policies_delete_admin
  on public.policies
  for delete
  to authenticated
  using ((select private.is_workspace_admin(workspace_id)));
