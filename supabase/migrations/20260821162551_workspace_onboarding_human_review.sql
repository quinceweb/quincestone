create schema if not exists private;

create or replace function private.has_workspace_for_user(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.user_id = target_user
  );
$$;

revoke all on function private.has_workspace_for_user(uuid) from public;
grant execute on function private.has_workspace_for_user(uuid) to authenticated;

create or replace function private.create_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

revoke all on function private.create_owner_membership() from public;
grant execute on function private.create_owner_membership() to authenticated;

drop trigger if exists workspaces_create_owner_membership on public.workspaces;
create trigger workspaces_create_owner_membership
after insert on public.workspaces
for each row
execute function private.create_owner_membership();

drop policy if exists workspaces_insert_creator on public.workspaces;
create policy workspaces_insert_creator
  on public.workspaces
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and created_by = (select auth.uid())
    and not (select private.has_workspace_for_user((select auth.uid())))
  );

drop policy if exists workspace_members_insert_self_owner on public.workspace_members;
create policy workspace_members_insert_self_owner
  on public.workspace_members
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and role = 'owner'
    and workspace_id in (select w.id from public.workspaces w where w.created_by = (select auth.uid()))
  );

alter table public.interactions
  add column if not exists idempotency_key text;

alter table public.interactions
  drop constraint if exists interactions_idempotency_key_check;
alter table public.interactions
  add constraint interactions_idempotency_key_check
  check (idempotency_key is null or char_length(idempotency_key) between 16 and 200);

create unique index if not exists interactions_workspace_idempotency_key_uidx
  on public.interactions (workspace_id, idempotency_key)
  where idempotency_key is not null;

create table if not exists public.human_reviews (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  interaction_id uuid not null references public.interactions(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  trace_id uuid references public.intelligence_traces(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','in_review','approved','rejected','resolved')),
  priority text not null default 'normal' check (priority in ('low','normal','high')),
  reason text not null check (char_length(reason) between 1 and 1000),
  proposed_action jsonb not null default '{}'::jsonb,
  decision text check (decision is null or decision in ('approved','rejected','resolved')),
  decision_reason text check (decision_reason is null or char_length(decision_reason) <= 2000),
  actor_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists human_reviews_workspace_status_idx
  on public.human_reviews (workspace_id, status, priority, created_at desc);
create index if not exists human_reviews_interaction_idx on public.human_reviews (interaction_id);
create index if not exists human_reviews_trace_idx on public.human_reviews (trace_id);

alter table public.human_reviews enable row level security;

drop policy if exists human_reviews_select_member on public.human_reviews;
create policy human_reviews_select_member
  on public.human_reviews
  for select
  to authenticated
  using ((select private.is_workspace_member(workspace_id)));

drop policy if exists human_reviews_update_member on public.human_reviews;
create policy human_reviews_update_member
  on public.human_reviews
  for update
  to authenticated
  using ((select private.is_workspace_member(workspace_id)))
  with check ((select private.is_workspace_member(workspace_id)));

drop policy if exists human_reviews_insert_member on public.human_reviews;
create policy human_reviews_insert_member
  on public.human_reviews
  for insert
  to authenticated
  with check ((select private.is_workspace_member(workspace_id)));

create or replace function private.touch_human_reviews_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists human_reviews_updated_at on public.human_reviews;
create trigger human_reviews_updated_at
before update on public.human_reviews
for each row execute function private.touch_human_reviews_updated_at();
