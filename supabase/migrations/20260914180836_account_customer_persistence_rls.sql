-- Source reconciliation for the migration already applied to production.
-- Production version: 20260914180836 account_customer_persistence_rls

create policy commerce_customer_self_insert
on public.commerce_customers for insert
to authenticated
with check ((select auth.uid()) = auth_user_id);

create policy commerce_customer_self_update
on public.commerce_customers for update
to authenticated
using ((select auth.uid()) = auth_user_id)
with check ((select auth.uid()) = auth_user_id);

create policy commerce_payment_self
on public.commerce_payments for select
to authenticated
using (
  exists (
    select 1
    from public.commerce_orders o
    join public.commerce_customers c on c.id = o.customer_id
    where o.id = commerce_payments.order_id
      and c.auth_user_id = (select auth.uid())
  )
);

grant insert, update on public.commerce_customers to authenticated;
grant select on public.commerce_payments to authenticated;

create table public.account_saved_products (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.commerce_customers(id) on delete cascade,
  product_id uuid not null references public.commerce_products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

create index account_saved_products_customer_idx
  on public.account_saved_products (customer_id, created_at desc);
create index account_saved_products_product_idx
  on public.account_saved_products (product_id);

create table public.account_support_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.commerce_customers(id) on delete cascade,
  subject text not null check (char_length(btrim(subject)) between 1 and 200),
  body text not null check (char_length(btrim(body)) between 1 and 5000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index account_support_requests_customer_idx
  on public.account_support_requests (customer_id, created_at desc);
create index account_support_requests_status_idx
  on public.account_support_requests (status, created_at desc);

create trigger account_support_requests_touch_updated_at
before update on public.account_support_requests
for each row execute function private.commerce_touch_updated_at();

create table public.account_notification_preferences (
  customer_id uuid primary key references public.commerce_customers(id) on delete cascade,
  order_updates boolean not null default true,
  account_security boolean not null default true,
  product_updates boolean not null default false,
  field_notes boolean not null default false,
  recommendations boolean not null default false,
  marketing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger account_notification_preferences_touch_updated_at
before update on public.account_notification_preferences
for each row execute function private.commerce_touch_updated_at();

alter table public.account_saved_products enable row level security;
alter table public.account_support_requests enable row level security;
alter table public.account_notification_preferences enable row level security;

create policy account_saved_products_self_select
on public.account_saved_products for select to authenticated
using (exists (
  select 1 from public.commerce_customers c
  where c.id = account_saved_products.customer_id
    and c.auth_user_id = (select auth.uid())
));

create policy account_saved_products_self_insert
on public.account_saved_products for insert to authenticated
with check (
  exists (
    select 1 from public.commerce_customers c
    where c.id = account_saved_products.customer_id
      and c.auth_user_id = (select auth.uid())
  )
  and exists (
    select 1 from public.commerce_products p
    where p.id = account_saved_products.product_id
      and p.lifecycle_status = 'active'
      and p.merchandising_status = 'published'
      and p.publication_state = 'published'
  )
);

create policy account_saved_products_self_delete
on public.account_saved_products for delete to authenticated
using (exists (
  select 1 from public.commerce_customers c
  where c.id = account_saved_products.customer_id
    and c.auth_user_id = (select auth.uid())
));

create policy account_support_requests_self_select
on public.account_support_requests for select to authenticated
using (exists (
  select 1 from public.commerce_customers c
  where c.id = account_support_requests.customer_id
    and c.auth_user_id = (select auth.uid())
));

create policy account_support_requests_self_insert
on public.account_support_requests for insert to authenticated
with check (
  status = 'open'
  and exists (
    select 1 from public.commerce_customers c
    where c.id = account_support_requests.customer_id
      and c.auth_user_id = (select auth.uid())
  )
);

create policy account_support_requests_ops
on public.account_support_requests for all to authenticated
using (private.is_platform_operator((select auth.uid())))
with check (private.is_platform_operator((select auth.uid())));

create policy account_notification_preferences_self_select
on public.account_notification_preferences for select to authenticated
using (exists (
  select 1 from public.commerce_customers c
  where c.id = account_notification_preferences.customer_id
    and c.auth_user_id = (select auth.uid())
));

create policy account_notification_preferences_self_insert
on public.account_notification_preferences for insert to authenticated
with check (exists (
  select 1 from public.commerce_customers c
  where c.id = account_notification_preferences.customer_id
    and c.auth_user_id = (select auth.uid())
));

create policy account_notification_preferences_self_update
on public.account_notification_preferences for update to authenticated
using (exists (
  select 1 from public.commerce_customers c
  where c.id = account_notification_preferences.customer_id
    and c.auth_user_id = (select auth.uid())
))
with check (exists (
  select 1 from public.commerce_customers c
  where c.id = account_notification_preferences.customer_id
    and c.auth_user_id = (select auth.uid())
));

revoke all on public.account_saved_products from anon, authenticated, service_role;
revoke all on public.account_support_requests from anon, authenticated, service_role;
revoke all on public.account_notification_preferences from anon, authenticated, service_role;

grant truncate, references, trigger, maintain on public.account_saved_products to authenticated, service_role;
grant truncate, references, trigger, maintain on public.account_support_requests to authenticated, service_role;
grant truncate, references, trigger, maintain on public.account_notification_preferences to authenticated, service_role;
grant select, insert, delete on public.account_saved_products to authenticated;
grant select, insert on public.account_support_requests to authenticated;
grant select, insert, update on public.account_notification_preferences to authenticated;
