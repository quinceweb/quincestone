create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 160),
  email text check (email is null or (char_length(email) <= 254 and email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')),
  phone text check (phone is null or char_length(phone) <= 40),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  source text not null default 'website' check (char_length(source) between 1 and 50),
  status text not null default 'received' check (status in ('received','qualifying','qualified','routed','in_progress','completed','escalated','failed')),
  intent jsonb not null default '{}'::jsonb,
  qualification jsonb not null default '{}'::jsonb,
  outcome jsonb not null default '{}'::jsonb,
  trace_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_workspace_idx on public.customers(workspace_id, created_at desc);
create index if not exists customers_workspace_email_idx on public.customers(workspace_id, email);
create index if not exists interactions_workspace_idx on public.interactions(workspace_id, created_at desc);
create index if not exists interactions_customer_idx on public.interactions(customer_id, created_at desc);
create index if not exists interactions_trace_idx on public.interactions(trace_id);

alter table public.customers enable row level security;
alter table public.interactions enable row level security;

create policy customers_select_member on public.customers
  for select to authenticated using (private.is_workspace_member(workspace_id));
create policy customers_insert_member on public.customers
  for insert to authenticated with check (private.is_workspace_member(workspace_id));
create policy customers_update_member on public.customers
  for update to authenticated using (private.is_workspace_member(workspace_id)) with check (private.is_workspace_member(workspace_id));
create policy customers_delete_admin on public.customers
  for delete to authenticated using (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  ));

create policy interactions_select_member on public.interactions
  for select to authenticated using (private.is_workspace_member(workspace_id));
create policy interactions_insert_member on public.interactions
  for insert to authenticated with check (private.is_workspace_member(workspace_id));
create policy interactions_update_member on public.interactions
  for update to authenticated using (private.is_workspace_member(workspace_id)) with check (private.is_workspace_member(workspace_id));
create policy interactions_delete_admin on public.interactions
  for delete to authenticated using (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspace_id and wm.user_id = auth.uid() and wm.role in ('owner','admin')
  ));
