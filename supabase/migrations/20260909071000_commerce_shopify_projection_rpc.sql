-- Expose a read-only, authenticated readiness check for the server-side Shopify adapter.
-- The underlying launch gate remains private and authoritative.

create or replace function public.commerce_shopify_projection_ready(target_product uuid)
returns boolean
language sql
stable
security invoker
set search_path=''
as $$
  select private.commerce_shopify_projection_ready(target_product);
$$;

revoke all on function public.commerce_shopify_projection_ready(uuid) from public;
grant execute on function public.commerce_shopify_projection_ready(uuid) to authenticated;
