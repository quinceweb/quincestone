-- Shopify is a downstream commerce channel. Quincestone remains the product/catalog authority.
-- This migration creates an explicit, operator-visible projection boundary without publishing anything.

create table if not exists public.commerce_shopify_products (
  product_id uuid primary key references public.commerce_products(id) on delete cascade,
  shopify_product_gid text unique,
  sync_status text not null default 'not_synced' check (sync_status in ('not_synced','pending','synced','failed','blocked')),
  remote_status text check (remote_status is null or remote_status in ('draft','active','archived')),
  last_synced_at timestamptz,
  last_attempted_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_shopify_variants (
  variant_id uuid primary key references public.commerce_variants(id) on delete cascade,
  shopify_variant_gid text unique,
  sync_status text not null default 'not_synced' check (sync_status in ('not_synced','pending','synced','failed','blocked')),
  last_synced_at timestamptz,
  last_attempted_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists commerce_shopify_products_sync_idx
  on public.commerce_shopify_products(sync_status, updated_at desc);
create index if not exists commerce_shopify_variants_sync_idx
  on public.commerce_shopify_variants(sync_status, updated_at desc);

create or replace function private.commerce_shopify_projection_ready(target_product uuid)
returns boolean
language sql
stable
security definer
set search_path=''
as $$
  select private.commerce_product_launch_ready(target_product)
    and exists (
      select 1
      from public.commerce_products p
      where p.id = target_product
        and p.lifecycle_status = 'active'
        and p.merchandising_status = 'published'
        and p.publication_state = 'published'
    );
$$;

revoke all on function private.commerce_shopify_projection_ready(uuid) from public;
grant execute on function private.commerce_shopify_projection_ready(uuid) to authenticated;

do $$
declare
  t text;
begin
  foreach t in array array['commerce_shopify_products','commerce_shopify_variants'] loop
    execute format('drop trigger if exists %I_updated_at on public.%I', t, t);
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function private.commerce_touch_updated_at()', t, t);
  end loop;
end $$;

grant select, insert, update on public.commerce_shopify_products, public.commerce_shopify_variants to authenticated;

drop policy if exists commerce_shopify_products_operator on public.commerce_shopify_products;
create policy commerce_shopify_products_operator on public.commerce_shopify_products
  for all to authenticated
  using (private.is_platform_admin((select auth.uid())))
  with check (private.is_platform_admin((select auth.uid())));

drop policy if exists commerce_shopify_variants_operator on public.commerce_shopify_variants;
create policy commerce_shopify_variants_operator on public.commerce_shopify_variants
  for all to authenticated
  using (private.is_platform_admin((select auth.uid())))
  with check (private.is_platform_admin((select auth.uid())));

comment on table public.commerce_shopify_products is 'Downstream Shopify product projection state. Quincestone remains the source of truth.';
comment on table public.commerce_shopify_variants is 'Downstream Shopify variant projection state. Quincestone remains the source of truth.';
comment on function private.commerce_shopify_projection_ready(uuid) is 'Returns true only when the Quincestone product has passed all launch gates and is active/published.';
