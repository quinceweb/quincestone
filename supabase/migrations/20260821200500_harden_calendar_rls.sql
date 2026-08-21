-- Harden legacy calendar RLS predicates and align them with workspace ownership.
-- Calendar records are workspace-scoped; browser clients must never gain cross-workspace access.

alter table public.calendar_integrations enable row level security;
alter table public.appointment_requests enable row level security;
alter table public.integration_events enable row level security;

drop policy if exists calendar_integrations_insert_admin on public.calendar_integrations;
drop policy if exists calendar_integrations_update_admin on public.calendar_integrations;
drop policy if exists calendar_integrations_delete_admin on public.calendar_integrations;
drop policy if exists appointment_requests_insert_member on public.appointment_requests;
drop policy if exists appointment_requests_select_member on public.appointment_requests;
drop policy if exists appointment_requests_update_member on public.appointment_requests;
drop policy if exists appointment_requests_delete_admin on public.appointment_requests;

-- These operational records are accessed through trusted server-side functions.
-- No direct browser CRUD policy is required at this boundary.
revoke all on public.calendar_integrations, public.appointment_requests, public.integration_events from anon, authenticated;

create index if not exists calendar_integrations_workspace_idx on public.calendar_integrations(workspace_id);
create index if not exists appointment_requests_workspace_idx on public.appointment_requests(workspace_id);
create index if not exists integration_events_workspace_idx on public.integration_events(workspace_id);
