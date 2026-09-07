create or replace view public.commerce_catalog with (security_invoker=true) as
select p.id,p.slug,p.name,p.description,p.collection,p.seo_title,p.seo_description,
       v.id as variant_id,v.sku,v.option_values,v.price_amount,v.compare_at_amount,v.currency,v.weight_grams,v.dimensions,
       m.id as media_id,m.asset_url,m.media_type,m.alt_text,m.sort_order
from public.commerce_products p
join public.commerce_variants v on v.product_id=p.id and v.status='active'
left join public.commerce_product_media m on m.product_id=p.id and m.publication_permission=true and m.rights_status='approved'
where p.lifecycle_status='active' and p.merchandising_status='published' and p.publication_state='published';

grant select on public.commerce_products,public.commerce_variants,public.commerce_product_media to anon,authenticated;

drop policy if exists commerce_products_public_catalog on public.commerce_products;
create policy commerce_products_public_catalog on public.commerce_products for select to anon,authenticated using (lifecycle_status='active' and merchandising_status='published' and publication_state='published');
drop policy if exists commerce_variants_public_catalog on public.commerce_variants;
create policy commerce_variants_public_catalog on public.commerce_variants for select to anon,authenticated using (status='active' and exists(select 1 from public.commerce_products p where p.id=product_id and p.lifecycle_status='active' and p.merchandising_status='published' and p.publication_state='published'));
drop policy if exists commerce_media_public_catalog on public.commerce_product_media;
create policy commerce_media_public_catalog on public.commerce_product_media for select to anon,authenticated using (publication_permission=true and rights_status='approved' and exists(select 1 from public.commerce_products p where p.id=product_id and p.lifecycle_status='active' and p.merchandising_status='published' and p.publication_state='published'));

create or replace function public.commerce_publish_product(target_product uuid) returns boolean language plpgsql security invoker set search_path='' as $$
begin
  if not private.is_platform_admin((select auth.uid())) then raise exception 'platform administrator authority required'; end if;
  if not private.commerce_product_launch_ready(target_product) then raise exception 'product launch gates are incomplete'; end if;
  update public.commerce_products set lifecycle_status='active',merchandising_status='published',publication_state='published' where id=target_product;
  insert into public.commerce_audit_events(actor_user_id,action,resource_type,resource_id,metadata) values((select auth.uid()),'product.published','product',target_product::text,jsonb_build_object('launch_gate','passed'));
  return true;
end; $$;
revoke all on function public.commerce_publish_product(uuid) from public;
grant execute on function public.commerce_publish_product(uuid) to authenticated;
