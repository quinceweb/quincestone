-- Restore the authenticated Data API privileges required by the Business OS.
-- Row-level security remains the authorization boundary for every operation.
-- Recovery: revoke these grants only after replacing the browser/server SSR
-- workspace flow with an equivalent authorized server boundary.

revoke all on table public.workspaces from anon;
revoke all on table public.workspace_members from anon;

grant select, insert, update on table public.workspaces to authenticated;
grant select, insert, update, delete on table public.workspace_members to authenticated;

comment on table public.workspaces is
  'Canonical Business OS workspaces. Authenticated access remains constrained by row-level security.';

comment on table public.workspace_members is
  'Workspace authority assignments. Authentication alone does not create membership or authority.';
