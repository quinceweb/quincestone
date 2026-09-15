create or replace function private.is_workspace_member(target_workspace uuid)
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
      and wm.user_id = (select auth.uid())
  );
$$;

create or replace function private.is_workspace_admin(target_workspace uuid)
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
      and wm.user_id = (select auth.uid())
      and wm.role in ('owner', 'admin')
  );
$$;

grant execute on function private.is_workspace_member(uuid) to authenticated;
grant execute on function private.is_workspace_admin(uuid) to authenticated;
revoke execute on function private.is_workspace_member(uuid) from anon;
revoke execute on function private.is_workspace_admin(uuid) from anon;

alter policy customers_delete_admin on public.customers
  using ((select private.is_workspace_admin(workspace_id)));

alter policy interactions_delete_admin on public.interactions
  using ((select private.is_workspace_admin(workspace_id)));

alter policy workspace_members_insert_admin on public.workspace_members
  with check ((select private.is_workspace_admin(workspace_id)));

alter policy workspace_members_update_admin on public.workspace_members
  using ((select private.is_workspace_admin(workspace_id)))
  with check ((select private.is_workspace_admin(workspace_id)));

drop policy if exists workspace_members_delete_admin on public.workspace_members;
create policy workspace_members_delete_admin
  on public.workspace_members
  for delete
  to authenticated
  using ((select private.is_workspace_admin(workspace_id)));
