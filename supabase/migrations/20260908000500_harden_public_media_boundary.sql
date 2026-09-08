-- Public clients may see only eligible media rows, never internal review metadata for
-- restricted, concept, unverified or unpublished assets.
drop policy if exists commerce_media_public_catalog on public.commerce_product_media;
create policy commerce_media_public_catalog on public.commerce_product_media
  for select to anon,authenticated
  using (
    publication_permission=true
    and rights_status='approved'
    and verification_status='verified'
    and publication_status='published'
    and exists(
      select 1 from public.commerce_products p
      where p.id=product_id
        and p.lifecycle_status='active'
        and p.merchandising_status='published'
        and p.publication_state='published'
    )
  );

drop view if exists public.commerce_catalog;
create view public.commerce_catalog with (security_invoker=true) as
select
  p.id,p.slug,p.name,p.description,p.collection,p.seo_title,p.seo_description,
  c.eyebrow as content_eyebrow,c.headline as content_headline,c.subheadline as content_subheadline,
  c.short_description as content_short_description,c.story as content_story,c.benefit_blocks,c.feature_blocks,c.specs,c.included_items,c.usage_steps,c.faq,
  c.shipping as content_shipping,c.returns_policy as content_returns_policy,
  coalesce(c.seo_title,p.seo_title) as content_seo_title,coalesce(c.seo_description,p.seo_description) as content_seo_description,
  v.id as variant_id,v.sku,v.option_values,v.price_amount,v.compare_at_amount,v.currency,v.weight_grams,v.dimensions,
  m.id as media_id,m.asset_url,m.media_type,m.alt_text,m.sort_order,m.aspect_ratio,m.width,m.height
from public.commerce_products p
join public.commerce_variants v on v.product_id=p.id and v.status='active'
left join public.commerce_product_content c on c.product_id=p.id
left join public.commerce_product_media m on m.product_id=p.id and m.publication_permission=true and m.rights_status='approved' and m.verification_status='verified' and m.publication_status='published'
where p.lifecycle_status='active' and p.merchandising_status='published' and p.publication_state='published';

grant select on public.commerce_catalog to anon,authenticated;
