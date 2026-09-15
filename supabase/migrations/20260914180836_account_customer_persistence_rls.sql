-- Quincestone Account persistence foundation.
-- Reuse canonical commerce identity/order/address/payment/return models.

-- Customer self-bootstrap and profile updates.
drop policy if exists commerce_customer_self_insert on public.commerce_customers;
create policy commerce_customer_self_insert
on public.commerce_customers
for insert
to authenticated
with check ((select auth.uid()) = auth_user_id);

drop policy if exists commerce_customer_self_update on public.commerce_customers;
create policy commerce_customer_self_update
on public.commerce_customers
for update
to authenticated
using ((select auth.uid()) = auth_user_id)
with check ((select auth.uid()) = auth_user_id);

-- Customer-safe payment history, scoped through owned orders.
drop policy if exists commerce_payment_self on public.commerce_payments;
create policy commerce_payment_self
on public.commerce_payments
for select
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

-- Saved products: relationship only; product truth stays canonical in commerce_products.
create table if not exists public.account_saved_products (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.commerce_customers(id) on delete cascade,
  product_id uuid not null references public.commerce_products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

create index if not exists account_saved_products_customer_idx
  on public.account_saved_products(customer_id, created_at desc);
create index if not exists account_saved_products_product_idx
  on public.account_saved_products(product_id);

alter table public.account_saved_products enable row level security;

drop policy if exists account_saved_products_self_select on public.account_saved_products;
create policy account_saved_products_self_select
on public.account_saved_products
for select
to authenticated
using (
  exists (
    select 1 from public.commerce_customers c
    where c.id = account_saved_products.customer_id
      and c.auth_user_id = (select auth.uid())
  )
);

drop policy if exists account_saved_products_self_insert on public.account_saved_products;
create policy account_saved_products_self_insert
on public.account_saved_products
for insert
to authenticated
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

drop policy if exists account_saved_products_self_delete on public.account_saved_products;
create policy account_saved_products_self_delete
on public.account_saved_products
for delete
to authenticated
using (
  exists (
    select 1 from public.commerce_customers c
    where c.id = account_saved_products.customer_id
      and c.auth_user_id = (select auth.uid())
  )
);

-- Customer support requests. Customer can create/read; operators manage workflow state.
create table if not exists public.account_support_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.commerce_customers(id) on delete cascade,
  subject text not null check (char_length(btrim(subject)) between 1 and 200),
  body text not null check (char_length(btrim(body)) between 1 and 5000),
  status text not null default 'open' check (status in ('open','in_progress','resolved','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists account_support_requests_customer_idx
  on public.account_support_requests(customer_id, created_at desc);
create index if not exists account_support_requests_status_idx
  on public.account_support_requests(status, created_at desc);

alter table public.account_support_requests enable row level security;

drop policy if exists account_support_requests_self_select on public.account_support_requests;
create policy account_support_requests_self_select
on public.account_support_requests
for select
to authenticated
using (
  exists (
    select 1 from public.commerce_customers c
    where c.id = account_support_requests.customer_id
      and c.auth_user_id = (select auth.uid())
  )
);

drop policy if exists account_support_requests_self_insert on public.account_support_requests;
create policy account_support_requests_self_insert
on public.account_support_requests
for insert
to authenticated
with check (
  status = 'open'
  and exists (
    select 1 from public.commerce_customers c
    where c.id = account_support_requests.customer_id
      and c.auth_user_id = (select auth.uid())
  )
);

drop policy if exists account_support_requests_ops on public.account_support_requests;
create policy account_support_requests_ops
on public.account_support_requests
for all
to authenticated
using (private.is_platform_operator((select auth.uid())))
with check (private.is_platform_operator((select auth.uid())));

-- Notification preferences: one row per customer, conservative defaults.
create table if not exists public.account_notification_preferences (
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

alter table public.account_notification_preferences enable row level security;

drop policy if exists account_notification_preferences_self_select on public.account_notification_preferences;
create policy account_notification_preferences_self_select
on public.account_notification_preferences
for select
to authenticated
using (
  exists (
    select 1 from public.commerce_customers c
    where c.id = account_notification_preferences.customer_id
      and c.auth_user_id = (select auth.uid())
  )
);

drop policy if exists account_notification_preferences_self_insert on public.account_notification_preferences;
create policy account_notification_preferences_self_insert
on public.account_notification_preferences
for insert
to authenticated
with check (
  exists (
    select 1 from public.commerce_customers c
    where c.id = account_notification_preferences.customer_id
      and c.auth_user_id = (select auth.uid())
  )
);

drop policy if exists account_notification_preferences_self_update on public.account_notification_preferences;
create policy account_notification_preferences_self_update
on public.account_notification_preferences
for update
to authenticated
using (
  exists (
    select 1 from public.commerce_customers c
    where c.id = account_notification_preferences.customer_id
      and c.auth_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.commerce_customers c
    where c.id = account_notification_preferences.customer_id
      and c.auth_user_id = (select auth.uid())
  )
);

-- Reuse canonical updated-at trigger function.
drop trigger if exists account_support_requests_touch_updated_at on public.account_support_requests;
create trigger account_support_requests_touch_updated_at
before update on public.account_support_requests
for each row execute function private.commerce_touch_updated_at();

drop trigger if exists account_notification_preferences_touch_updated_at on public.account_notification_preferences;
create trigger account_notification_preferences_touch_updated_at
before update on public.account_notification_preferences
for each row execute function private.commerce_touch_updated_at();

-- Explicit Data API privileges. No anonymous access to Account-owned data.
revoke all on table public.account_saved_products from anon;
revoke all on table public.account_support_requests from anon;
revoke all on table public.account_notification_preferences from anon;

grant select, insert, delete on table public.account_saved_products to authenticated;
grant select, insert on table public.account_support_requests to authenticated;
grant select, insert, update on table public.account_notification_preferences to authenticated;

-- Allow profile bootstrap/update and customer-safe payment reads only.
grant select, insert, update on table public.commerce_customers to authenticated;
grant select on table public.commerce_payments to authenticated;

-- Remove dangerous structural privileges from public client roles on customer-owned commerce data.
revoke truncate, references, trigger on table public.commerce_customers from anon, authenticated;
revoke truncate, references, trigger on table public.commerce_addresses from anon, authenticated;
revoke truncate, references, trigger on table public.commerce_orders from anon, authenticated;
revoke truncate, references, trigger on table public.commerce_order_items from anon, authenticated;
revoke truncate, references, trigger on table public.commerce_payments from anon, authenticated;
revoke truncate, references, trigger on table public.commerce_fulfillments from anon, authenticated;
revoke truncate, references, trigger on table public.commerce_returns from anon, authenticated;
revoke truncate, references, trigger on table public.commerce_return_items from anon, authenticated;
