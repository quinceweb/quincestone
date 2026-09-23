-- The gateway is the only service-role writer for public Edge intake.
grant select, insert, update on public.edge_installations to service_role;
grant select, insert, update on public.interactions to service_role;
grant usage on schema private to service_role;

create index edge_installations_created_by_idx
  on public.edge_installations(created_by);

comment on function public.consume_edge_intake_quota(uuid, text, integer, integer) is
  'Service-only durable public Edge intake quota. Browser roles have no execute grant.';
