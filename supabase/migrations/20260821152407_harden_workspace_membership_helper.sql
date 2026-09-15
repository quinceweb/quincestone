create schema if not exists private;

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
      and wm.user_id = auth.uid()
  );
$$;

revoke all on function private.is_workspace_member(uuid) from public;
grant execute on function private.is_workspace_member(uuid) to authenticated;

 drop policy if exists workspaces_select_member on public.workspaces;
 drop policy if exists workspace_members_select_member on public.workspace_members;
 drop policy if exists appointment_requests_select_member on public.appointment_requests;
 drop policy if exists appointment_requests_insert_member on public.appointment_requests;
 drop policy if exists appointment_requests_update_member on public.appointment_requests;
 drop policy if exists calendar_integrations_select_member on public.calendar_integrations;
 drop policy if exists integration_events_select_member on public.integration_events;
 drop policy if exists intelligence_traces_select_member on public.intelligence_traces;

 drop function if exists public.is_workspace_member(uuid);

create policy workspaces_select_member on public.workspaces
  for select to authenticated using (private.is_workspace_member(id));

create policy workspace_members_select_member on public.workspace_members
  for select to authenticated using (user_id = auth.uid() or private.is_workspace_member(workspace_id));

create policy appointment_requests_select_member on public.appointment_requests
  for select to authenticated using (private.is_workspace_member(workspace_id));
create policy appointment_requests_insert_member on public.appointment_requests
  for insert to authenticated with check (private.is_workspace_member(workspace_id));
create policy appointment_requests_update_member on public.appointment_requests
  for update to authenticated using (private.is_workspace_member(workspace_id)) with check (private.is_workspace_member(workspace_id));

create policy calendar_integrations_select_member on public.calendar_integrations
  for select to authenticated using (private.is_workspace_member(workspace_id));

create policy integration_events_select_member on public.integration_events
  for select to authenticated using (private.is_workspace_member(workspace_id));

create policy intelligence_traces_select_member on public.intelligence_traces
  for select to authenticated using (private.is_workspace_member(workspace_id));
