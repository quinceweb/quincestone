-- First controlled Quincestone Shop testing portfolio.
-- These records remain unpublished until the full evidence/publication gate passes.

update public.commerce_products
set target_price_amount = 9900,
    lifecycle_status = 'sourcing'
where slug = 'vacuum-compression-travel-backpack';

update public.commerce_products
set target_price_amount = 9900,
    lifecycle_status = 'sourcing'
where slug = 'cordless-premium-pressure-washer-power-cleaner';

update public.commerce_products
set target_price_amount = 5900,
    lifecycle_status = 'sourcing'
where slug = 'obd2-automotive-diagnostic-scanner';

update public.commerce_products
set target_price_amount = 7900,
    lifecycle_status = 'sourcing'
where slug = 'hard-bottom-dog-backseat-travel-platform';

update public.commerce_products
set target_price_amount = 12900,
    lifecycle_status = 'sourcing'
where slug = 'smart-bird-feeder-camera';

-- Economics are unknown until actual supplier quotes and landed-cost evidence exist.
insert into public.commerce_product_economics(product_id,currency)
select id,'USD' from public.commerce_products
where slug in (
  'vacuum-compression-travel-backpack',
  'cordless-premium-pressure-washer-power-cleaner',
  'obd2-automotive-diagnostic-scanner',
  'hard-bottom-dog-backseat-travel-platform',
  'smart-bird-feeder-camera'
)
on conflict (product_id) do nothing;

revoke all on table public.commerce_product_economic_summary from public, anon, authenticated;
grant select on table public.commerce_product_economic_summary to service_role;

revoke all on function private.commerce_product_publication_ready(uuid) from public, anon, authenticated;
grant execute on function private.commerce_product_publication_ready(uuid) to service_role;
