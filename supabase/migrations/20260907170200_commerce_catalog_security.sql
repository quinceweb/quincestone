create or replace view public.commerce_catalog as
select p.id,p.slug,p.name,p.description,p.collection,p.seo_title,p.seo_description,
       v.id as variant_id,v.sku,v.option_values,v.price_amount,v.compare_at_amount,v.currency,v.weight_grams,v.dimensions,
       m.id as media_id,m.asset_url,m.media_type,m.alt_text,m.sort_order
from public.commerce_products p
join public.commerce_variants v on v.product_id=p.id and v.status='active'
left join public.commerce_product_media m on m.product_id=p.id and m.publication_permission=true and m.rights_status='approved'
where p.lifecycle_status='active' and p.merchandising_status='published' and p.publication_state='published';
grant select on public.commerce_catalog to anon,authenticated;
create unique index if not exists commerce_fulfillments_order_unique_idx on public.commerce_fulfillments(order_id);
