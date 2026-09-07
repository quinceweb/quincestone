-- Quincestone commerce platform foundation.
-- All commercially sensitive state is server/database authoritative.
-- Candidate products are seeded below as RESEARCH records only; none are publishable.

create extension if not exists pgcrypto;

create table if not exists public.commerce_customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  email text,
  phone text,
  status text not null default 'active' check (status in ('active','blocked','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.commerce_customers(id) on delete cascade,
  label text,
  recipient_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state_region text,
  postal_code text,
  country_code text not null check (char_length(country_code) = 2),
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  collection text not null check (collection in ('travel','drive','companion','home-outdoor')),
  lifecycle_status text not null default 'research' check (lifecycle_status in ('research','sourcing','supplier_selected','sample_ordered','sample_received','qa','economics_review','approved','ready','active','revise','paused','rejected','archived')),
  merchandising_status text not null default 'draft' check (merchandising_status in ('draft','ready','published','hidden')),
  seo_title text,
  seo_description text,
  publication_state text not null default 'private' check (publication_state in ('private','review','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.commerce_products(id) on delete cascade,
  sku text not null unique,
  option_values jsonb not null default '{}'::jsonb,
  price_amount integer,
  compare_at_amount integer,
  currency text not null default 'USD' check (char_length(currency) = 3),
  status text not null default 'draft' check (status in ('draft','active','archived')),
  weight_grams integer,
  dimensions jsonb,
  inventory_policy text not null default 'manual' check (inventory_policy in ('manual','supplier','deny')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (price_amount is null or price_amount > 0),
  check (compare_at_amount is null or compare_at_amount >= price_amount)
);

create table if not exists public.commerce_product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.commerce_products(id) on delete cascade,
  variant_id uuid references public.commerce_variants(id) on delete set null,
  asset_url text not null,
  media_type text not null check (media_type in ('product','detail','demonstration','lifestyle','video')),
  alt_text text,
  sort_order integer not null default 0,
  rights_status text not null default 'pending' check (rights_status in ('pending','restricted','approved','rejected')),
  source text,
  publication_permission boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  platform text,
  contact jsonb not null default '{}'::jsonb,
  status text not null default 'research' check (status in ('research','review','approved','blocked','archived')),
  risk_notes text,
  fulfillment_capability text,
  commercial_terms jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_supplier_products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.commerce_suppliers(id) on delete cascade,
  variant_id uuid not null references public.commerce_variants(id) on delete cascade,
  supplier_product_id text,
  supplier_sku text,
  quoted_unit_cost integer,
  currency text not null default 'USD' check (char_length(currency) = 3),
  moq integer,
  quote_date date,
  processing_time_days integer,
  packaging_dimensions jsonb,
  shipping_information jsonb,
  media_rights_state text not null default 'unknown' check (media_rights_state in ('unknown','pending','restricted','approved','rejected')),
  is_selected boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supplier_id, variant_id)
);

create table if not exists public.commerce_product_qa (
  product_id uuid primary key references public.commerce_products(id) on delete cascade,
  sourcing_status text not null default 'pending' check (sourcing_status in ('pending','verified','blocked')),
  exact_sku_verified boolean not null default false,
  sample_status text not null default 'not_ordered' check (sample_status in ('not_ordered','ordered','received','approved','rejected')),
  quality_result text not null default 'pending' check (quality_result in ('pending','pass','fail')),
  functional_result text not null default 'pending' check (functional_result in ('pending','pass','fail')),
  packaging_result text not null default 'pending' check (packaging_result in ('pending','pass','fail')),
  media_verification text not null default 'pending' check (media_verification in ('pending','approved','blocked')),
  economics_approval boolean not null default false,
  shipping_terms_approval boolean not null default false,
  returns_warranty_approval boolean not null default false,
  price_approval boolean not null default false,
  content_approval boolean not null default false,
  final_decision text not null default 'blocked' check (final_decision in ('blocked','ready','rejected')),
  notes text,
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.commerce_customers(id) on delete set null,
  session_id uuid,
  status text not null default 'open' check (status in ('open','converted','abandoned','expired')),
  currency text not null default 'USD' check (char_length(currency) = 3),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (customer_id is not null or session_id is not null)
);

create unique index if not exists commerce_carts_open_customer_idx on public.commerce_carts(customer_id) where status = 'open' and customer_id is not null;
create unique index if not exists commerce_carts_open_session_idx on public.commerce_carts(session_id) where status = 'open' and session_id is not null;

create table if not exists public.commerce_cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.commerce_carts(id) on delete cascade,
  variant_id uuid not null references public.commerce_variants(id),
  quantity integer not null check (quantity > 0),
  unit_price_amount integer not null check (unit_price_amount > 0),
  currency text not null check (char_length(currency) = 3),
  price_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

create table if not exists public.commerce_discounts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent','fixed','free_shipping')),
  value integer not null check (value > 0),
  currency text,
  starts_at timestamptz,
  ends_at timestamptz,
  usage_limit integer,
  usage_count integer not null default 0 check (usage_count >= 0),
  constraints_json jsonb not null default '{}'::jsonb,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_bundles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price_amount integer,
  currency text not null default 'USD',
  status text not null default 'draft' check (status in ('draft','ready','active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_bundle_items (
  bundle_id uuid not null references public.commerce_bundles(id) on delete cascade,
  variant_id uuid not null references public.commerce_variants(id),
  quantity integer not null check (quantity > 0),
  primary key (bundle_id, variant_id)
);

create table if not exists public.commerce_orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_id uuid references public.commerce_customers(id) on delete set null,
  email text not null,
  billing_address jsonb not null default '{}'::jsonb,
  shipping_address jsonb not null default '{}'::jsonb,
  subtotal_amount integer not null check (subtotal_amount >= 0),
  discount_amount integer not null default 0 check (discount_amount >= 0),
  shipping_amount integer not null default 0 check (shipping_amount >= 0),
  tax_amount integer not null default 0 check (tax_amount >= 0),
  total_amount integer not null check (total_amount >= 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  status text not null default 'pending_payment' check (status in ('pending_payment','paid','fulfillment_required','fulfilled','delivered','cancelled','returned','refunded')),
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  fulfilled_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete restrict,
  variant_id uuid references public.commerce_variants(id) on delete set null,
  sku text not null,
  product_name text not null,
  option_values jsonb not null default '{}'::jsonb,
  quantity integer not null check (quantity > 0),
  unit_price_amount integer not null check (unit_price_amount > 0),
  line_total_amount integer not null check (line_total_amount >= 0),
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table if not exists public.commerce_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete restrict,
  provider text not null default 'stripe',
  provider_payment_intent_id text,
  provider_checkout_session_id text,
  amount integer not null check (amount >= 0),
  currency text not null default 'USD',
  verified boolean not null default false,
  status text not null default 'pending' check (status in ('pending','processing','succeeded','failed','cancelled','refunded','partially_refunded')),
  provider_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create table if not exists public.commerce_fulfillments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete restrict,
  source text not null default 'supplier' check (source in ('supplier','quincestone','third_party')),
  status text not null default 'required' check (status in ('required','reviewing','approved','ordered','processing','shipped','delivered','cancelled')),
  carrier text,
  tracking_number text,
  tracking_url text,
  human_approved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  shipped_at timestamptz,
  delivered_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_returns (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete restrict,
  customer_id uuid references public.commerce_customers(id) on delete set null,
  status text not null default 'requested' check (status in ('requested','reviewing','approved','rejected','in_transit','received','refund_pending','refunded','closed')),
  reason text not null,
  disposition text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_return_items (
  return_id uuid not null references public.commerce_returns(id) on delete cascade,
  order_item_id uuid not null references public.commerce_order_items(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  primary key (return_id, order_item_id)
);

create table if not exists public.commerce_refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete restrict,
  payment_id uuid references public.commerce_payments(id) on delete restrict,
  provider text not null default 'stripe',
  provider_refund_id text,
  amount integer not null check (amount > 0),
  currency text not null default 'USD',
  reason text,
  status text not null default 'pending' check (status in ('pending','succeeded','failed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 1 and 120),
  resource_type text not null check (char_length(resource_type) between 1 and 80),
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists commerce_payments_provider_payment_idx on public.commerce_payments(provider, provider_payment_intent_id) where provider_payment_intent_id is not null;
create unique index if not exists commerce_payments_provider_checkout_idx on public.commerce_payments(provider, provider_checkout_session_id) where provider_checkout_session_id is not null;
create unique index if not exists commerce_refunds_provider_refund_idx on public.commerce_refunds(provider, provider_refund_id) where provider_refund_id is not null;
create index if not exists commerce_variants_product_idx on public.commerce_variants(product_id);
create index if not exists commerce_media_product_idx on public.commerce_product_media(product_id, sort_order);
create index if not exists commerce_supplier_products_variant_idx on public.commerce_supplier_products(variant_id);
create index if not exists commerce_orders_customer_idx on public.commerce_orders(customer_id, created_at desc);
create index if not exists commerce_orders_status_idx on public.commerce_orders(status, created_at desc);
create index if not exists commerce_fulfillments_status_idx on public.commerce_fulfillments(status, created_at desc);
create index if not exists commerce_returns_status_idx on public.commerce_returns(status, created_at desc);
create index if not exists commerce_audit_created_idx on public.commerce_audit_events(created_at desc);

create or replace function private.commerce_touch_updated_at() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at = now(); return new; end; $$;

for table_name in commerce_customers commerce_addresses commerce_products commerce_variants commerce_product_media commerce_suppliers commerce_supplier_products commerce_product_qa commerce_carts commerce_cart_items commerce_discounts commerce_bundles commerce_orders commerce_payments commerce_fulfillments commerce_returns commerce_refunds loop
  execute format('drop trigger if exists %I_updated_at on public.%I', table_name, table_name);
  execute format('create trigger %I_updated_at before update on public.%I for each row execute function private.commerce_touch_updated_at()', table_name, table_name);
end loop;

-- A public catalog view exposes only sellable state and never supplier/internal fields.
create or replace view public.commerce_catalog with (security_invoker = true) as
select
  p.id,
  p.slug,
  p.name,
  p.description,
  p.collection,
  p.seo_title,
  p.seo_description,
  v.id as variant_id,
  v.sku,
  v.option_values,
  v.price_amount,
  v.compare_at_amount,
  v.currency,
  v.weight_grams,
  v.dimensions,
  m.id as media_id,
  m.asset_url,
  m.media_type,
  m.alt_text,
  m.sort_order
from public.commerce_products p
join public.commerce_variants v on v.product_id = p.id and v.status = 'active'
left join public.commerce_product_media m on m.product_id = p.id and m.publication_permission = true and m.rights_status = 'approved'
where p.lifecycle_status = 'active'
  and p.merchandising_status = 'published'
  and p.publication_state = 'published';

alter table public.commerce_customers enable row level security;
alter table public.commerce_addresses enable row level security;
alter table public.commerce_products enable row level security;
alter table public.commerce_variants enable row level security;
alter table public.commerce_product_media enable row level security;
alter table public.commerce_suppliers enable row level security;
alter table public.commerce_supplier_products enable row level security;
alter table public.commerce_product_qa enable row level security;
alter table public.commerce_carts enable row level security;
alter table public.commerce_cart_items enable row level security;
alter table public.commerce_discounts enable row level security;
alter table public.commerce_bundles enable row level security;
alter table public.commerce_bundle_items enable row level security;
alter table public.commerce_orders enable row level security;
alter table public.commerce_order_items enable row level security;
alter table public.commerce_payments enable row level security;
alter table public.commerce_fulfillments enable row level security;
alter table public.commerce_returns enable row level security;
alter table public.commerce_return_items enable row level security;
alter table public.commerce_refunds enable row level security;
alter table public.commerce_audit_events enable row level security;

-- Public catalog is intentionally the only anonymous read surface.
revoke all on table public.commerce_products from anon, authenticated;
revoke all on table public.commerce_variants from anon, authenticated;
revoke all on table public.commerce_product_media from anon, authenticated;
revoke all on table public.commerce_suppliers from anon, authenticated;
revoke all on table public.commerce_supplier_products from anon, authenticated;
revoke all on table public.commerce_product_qa from anon, authenticated;
revoke all on table public.commerce_payments from anon, authenticated;
revoke all on table public.commerce_refunds from anon, authenticated;
revoke all on table public.commerce_audit_events from anon, authenticated;

-- Customer policies are scoped to the authenticated identity; operational access is separate.
create policy commerce_customer_self on public.commerce_customers for select to authenticated using ((select auth.uid()) = auth_user_id);
create policy commerce_address_self on public.commerce_addresses for all to authenticated using (exists (select 1 from public.commerce_customers c where c.id = customer_id and c.auth_user_id = (select auth.uid()))) with check (exists (select 1 from public.commerce_customers c where c.id = customer_id and c.auth_user_id = (select auth.uid())));
create policy commerce_cart_self on public.commerce_carts for all to authenticated using (customer_id in (select id from public.commerce_customers where auth_user_id = (select auth.uid()))) with check (customer_id in (select id from public.commerce_customers where auth_user_id = (select auth.uid())));
create policy commerce_cart_session on public.commerce_carts for all to anon using (session_id is not null) with check (session_id is not null);
create policy commerce_cart_items_customer on public.commerce_cart_items for all to authenticated using (exists (select 1 from public.commerce_carts ca join public.commerce_customers c on c.id = ca.customer_id where ca.id = cart_id and c.auth_user_id = (select auth.uid()))) with check (exists (select 1 from public.commerce_carts ca join public.commerce_customers c on c.id = ca.customer_id where ca.id = cart_id and c.auth_user_id = (select auth.uid())));
create policy commerce_cart_items_session on public.commerce_cart_items for all to anon using (exists (select 1 from public.commerce_carts ca where ca.id = cart_id and ca.session_id is not null)) with check (exists (select 1 from public.commerce_carts ca where ca.id = cart_id and ca.session_id is not null));
create policy commerce_order_self on public.commerce_orders for select to authenticated using (customer_id in (select id from public.commerce_customers where auth_user_id = (select auth.uid())));
create policy commerce_order_items_self on public.commerce_order_items for select to authenticated using (exists (select 1 from public.commerce_orders o where o.id = order_id and o.customer_id in (select id from public.commerce_customers where auth_user_id = (select auth.uid()))));
create policy commerce_payment_self on public.commerce_payments for select to authenticated using (exists (select 1 from public.commerce_orders o where o.id = order_id and o.customer_id in (select id from public.commerce_customers where auth_user_id = (select auth.uid()))));
create policy commerce_fulfillment_self on public.commerce_fulfillments for select to authenticated using (exists (select 1 from public.commerce_orders o where o.id = order_id and o.customer_id in (select id from public.commerce_customers where auth_user_id = (select auth.uid()))));
create policy commerce_return_self on public.commerce_returns for all to authenticated using (customer_id in (select id from public.commerce_customers where auth_user_id = (select auth.uid()))) with check (customer_id in (select id from public.commerce_customers where auth_user_id = (select auth.uid())));
create policy commerce_return_items_self on public.commerce_return_items for select to authenticated using (exists (select 1 from public.commerce_returns r where r.id = return_id and r.customer_id in (select id from public.commerce_customers where auth_user_id = (select auth.uid()))));

-- Platform operations are permitted only to platform admins/operators. Supplier data is never customer-readable.
create policy commerce_products_ops on public.commerce_products for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_variants_ops on public.commerce_variants for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_media_ops on public.commerce_product_media for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_suppliers_ops on public.commerce_suppliers for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_supplier_products_ops on public.commerce_supplier_products for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_qa_ops on public.commerce_product_qa for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_discounts_ops on public.commerce_discounts for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_bundles_ops on public.commerce_bundles for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_bundle_items_ops on public.commerce_bundle_items for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_orders_ops on public.commerce_orders for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_order_items_ops on public.commerce_order_items for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_payments_ops on public.commerce_payments for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_fulfillments_ops on public.commerce_fulfillments for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_returns_ops on public.commerce_returns for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_return_items_ops on public.commerce_return_items for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_refunds_ops on public.commerce_refunds for all to authenticated using (private.is_platform_operator((select auth.uid()))) with check (private.is_platform_operator((select auth.uid())));
create policy commerce_audit_ops on public.commerce_audit_events for select to authenticated using (private.is_platform_operator((select auth.uid())));

-- Atomic product launch gate. This is the authority behind ACTIVE/PUBLISHED state.
create or replace function private.commerce_product_launch_ready(target_product uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.commerce_products p
    join public.commerce_product_qa q on q.product_id = p.id
    where p.id = target_product
      and q.exact_sku_verified
      and q.sample_status = 'approved'
      and q.quality_result = 'pass'
      and q.functional_result = 'pass'
      and q.packaging_result = 'pass'
      and q.media_verification = 'approved'
      and q.economics_approval
      and q.shipping_terms_approval
      and q.returns_warranty_approval
      and q.price_approval
      and q.content_approval
      and q.final_decision = 'ready'
      and exists (select 1 from public.commerce_variants v where v.product_id = p.id and v.status = 'active' and v.price_amount is not null)
      and not exists (select 1 from public.commerce_product_media m where m.product_id = p.id and m.publication_permission = false and m.rights_status <> 'approved')
  );
$$;
revoke all on function private.commerce_product_launch_ready(uuid) from public;
grant execute on function private.commerce_product_launch_ready(uuid) to authenticated;

create or replace function public.commerce_publish_product(target_product uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_platform_admin((select auth.uid())) then raise exception 'platform administrator authority required'; end if;
  if not private.commerce_product_launch_ready(target_product) then raise exception 'product launch gates are incomplete'; end if;
  update public.commerce_products set lifecycle_status = 'active', merchandising_status = 'published', publication_state = 'published' where id = target_product;
  insert into public.commerce_audit_events(actor_user_id, action, resource_type, resource_id, metadata) values ((select auth.uid()), 'product.published', 'product', target_product::text, jsonb_build_object('launch_gate','passed'));
  return true;
end;
$$;
revoke all on function public.commerce_publish_product(uuid) from public;
grant execute on function public.commerce_publish_product(uuid) to authenticated;

-- Seed only the ten requested sourcing candidates. No prices, stock, ratings, media, supplier claims, or availability are invented.
insert into public.commerce_products (slug, name, collection, lifecycle_status, merchandising_status, publication_state, description)
values
('vacuum-compression-travel-backpack','Vacuum Compression Travel Backpack','travel','research','draft','private','Sourcing candidate. Product content is pending verification.'),
('cordless-premium-pressure-washer-power-cleaner','Cordless Premium Pressure Washer / Power Cleaner','drive','research','draft','private','Sourcing candidate. Product content is pending verification.'),
('hard-bottom-dog-backseat-travel-platform','Hard-Bottom Dog Backseat Travel Platform','companion','research','draft','private','Sourcing candidate. Product content is pending verification.'),
('obd2-automotive-diagnostic-scanner','OBD2 Automotive Diagnostic Scanner','drive','research','draft','private','Sourcing candidate. Product content is pending verification.'),
('smart-bird-feeder-camera','Smart Bird Feeder Camera','home-outdoor','research','draft','private','Sourcing candidate. Product content is pending verification.'),
('portable-premium-carplay-display','Portable Premium CarPlay Display','drive','research','draft','private','Sourcing candidate. Product content is pending verification.'),
('premium-electric-spin-scrubber','Premium Electric Spin Scrubber','home-outdoor','research','draft','private','Sourcing candidate. Product content is pending verification.'),
('travel-vacuum-storage-bags-rechargeable-pump','Travel Vacuum Storage Bags + Rechargeable Pump','travel','research','draft','private','Sourcing candidate. Product content is pending verification.'),
('premium-neck-shoulder-massager','Premium Neck & Shoulder Massager','home-outdoor','research','draft','private','Sourcing candidate. Product content is pending verification.'),
('pet-grooming-vacuum-system','Pet Grooming Vacuum System','companion','research','draft','private','Sourcing candidate. Product content is pending verification.')
on conflict (slug) do nothing;

insert into public.commerce_product_qa (product_id)
select id from public.commerce_products where lifecycle_status = 'research'
on conflict (product_id) do nothing;

-- No customer-facing Data API access to internal tables; catalog view is explicitly granted read access.
grant select on public.commerce_catalog to anon, authenticated;

comment on table public.commerce_products is 'Internal product authority. ACTIVE/PUBLISHED requires the atomic launch gate.';
comment on table public.commerce_product_qa is 'Launch evidence; candidates remain blocked until all required gates pass.';
comment on table public.commerce_supplier_products is 'Internal supplier mapping and cost data. Never expose publicly.';
comment on table public.commerce_payments is 'Provider-reconciled payment state. Redirects are never payment proof.';
comment on table public.commerce_fulfillments is 'Human-approved fulfillment workflow; supplier orders are not automatic in V1.';
