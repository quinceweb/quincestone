create or replace function private.prevent_workspace_creator_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.created_by <> old.created_by then
    raise exception 'workspace creator cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists workspaces_creator_immutable on public.workspaces;
create trigger workspaces_creator_immutable
before update on public.workspaces
for each row execute function private.prevent_workspace_creator_change();

drop policy if exists workspaces_update_admin on public.workspaces;
create policy workspaces_update_admin
  on public.workspaces
  for update
  to authenticated
  using ((select private.is_workspace_admin(id)))
  with check ((select private.is_workspace_admin(id)));
