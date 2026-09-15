create unique index if not exists customers_workspace_email_uidx
  on public.customers (workspace_id, lower(email))
  where email is not null;

create index if not exists customers_workspace_created_at_idx
  on public.customers (workspace_id, created_at desc);
