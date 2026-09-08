create or replace function private.commerce_product_launch_ready(target_product uuid)
returns boolean language sql stable security definer set search_path='' as $$
select exists(
  select 1 from public.commerce_products p
  join public.commerce_product_qa q on q.product_id=p.id
  where p.id=target_product
    and q.sourcing_status='verified'
    and q.exact_sku_verified
    and q.sample_status='approved'
    and q.quality_result='pass'
    and q.functional_result='pass'
    and q.packaging_result='pass'
    and q.media_verification='approved'
    and q.economics_approval
    and q.shipping_terms_approval
    and q.returns_warranty_approval
    and q.price_approval
    and q.content_approval
    and q.final_decision='ready'
    and exists(select 1 from public.commerce_product_content c where c.product_id=p.id and nullif(trim(c.headline),'') is not null and nullif(trim(c.short_description),'') is not null)
    and exists(select 1 from public.commerce_variants v where v.product_id=p.id and v.status='active' and v.price_amount is not null)
    and exists(select 1 from public.commerce_product_media m where m.product_id=p.id and m.rights_status='approved' and m.publication_permission and m.verification_status='verified' and m.publication_status='published')
    and not exists(select 1 from public.commerce_product_media m where m.product_id=p.id and (m.rights_status<>'approved' or not m.publication_permission or m.verification_status<>'verified' or m.publication_status<>'published'))
);
$$;
