-- Remove legacy authenticated privileges that are not required by the
-- Business OS Data API flow, then restore the minimum RLS-governed set.
-- This is forward-only because the preceding migration is already deployed.

revoke all on table public.workspaces from authenticated;
revoke all on table public.workspace_members from authenticated;

grant select, insert, update on table public.workspaces to authenticated;
grant select, insert, update, delete on table public.workspace_members to authenticated;
