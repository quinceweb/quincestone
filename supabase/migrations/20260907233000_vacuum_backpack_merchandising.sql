-- Product content is structured and server-authoritative. Supplier-dependent values are
-- stored as approved content only; missing values remain NULL/empty rather than invented.
create table if not exists public.commerce_product_content (
  product_id uuid primary key references public.commerce_products(id) on delete cascade,
  eyebrow text,
  headline text,
  subheadline text,
  short_description text,
  story text,
  benefit_blocks jsonb not null default '[]'::jsonb,
  feature_blocks jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  included_items jsonb not null default '[]'::jsonb,
  usage_steps jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  shipping jsonb not null default '{}'::jsonb,
  returns_policy jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);

alter table public.commerce_product_media
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','verified'));
alter table public.commerce_product_media
  add column if not exists publication_status text not null default 'unpublished'
    check (publication_status in ('unpublished','published','restricted'));
alter table public.commerce_product_media
  add column if not exists sku_association text;
alter table public.commerce_product_media
  add column if not exists aspect_ratio numeric;
alter table public.commerce_product_media
  add column if not exists width integer;
alter table public.commerce_product_media
  add column if not exists height integer;
alter table public.commerce_product_media
  add column if not exists storage_path text;
alter table public.commerce_product_media
  add column if not exists notes text;

update public.commerce_product_media
set publication_status = case when publication_permission and rights_status = 'approved' then 'published' else 'unpublished' end,
    verification_status = case when rights_status = 'approved' and publication_permission then 'verified' else 'unverified' end
where publication_status = 'unpublished';

create index if not exists commerce_media_publication_idx
  on public.commerce_product_media(product_id, publication_status, verification_status, sort_order);

create index if not exists commerce_product_content_updated_idx
  on public.commerce_product_content(updated_at desc);

alter table public.commerce_product_content enable row level security;

revoke all on public.commerce_product_content from anon, authenticated;
grant select on public.commerce_product_content to anon, authenticated;

drop policy if exists commerce_product_content_public on public.commerce_product_content;
create policy commerce_product_content_public on public.commerce_product_content
  for select to anon, authenticated
  using (exists (
    select 1 from public.commerce_products p
    where p.id = product_id
      and p.lifecycle_status = 'active'
      and p.merchandising_status = 'published'
      and p.publication_state = 'published'
  ));

-- Public catalog remains the single storefront authority. Content and media are
-- included only for genuinely published products and eligible media.
create or replace view public.commerce_catalog with (security_invoker=true) as
select
  p.id,p.slug,p.name,p.description,p.collection,p.seo_title,p.seo_description,
  c.eyebrow as content_eyebrow,c.headline as content_headline,c.subheadline as content_subheadline,
  c.short_description as content_short_description,c.story as content_story,
  c.benefit_blocks,c.feature_blocks,c.specs,c.included_items,c.usage_steps,c.faq,
  c.shipping as content_shipping,c.returns_policy as content_returns_policy,
  coalesce(c.seo_title,p.seo_title) as content_seo_title,
  coalesce(c.seo_description,p.seo_description) as content_seo_description,
  v.id as variant_id,v.sku,v.option_values,v.price_amount,v.compare_at_amount,v.currency,v.weight_grams,v.dimensions,
  m.id as media_id,m.asset_url,m.media_type,m.alt_text,m.sort_order,m.source,m.verification_status,m.publication_status,
  m.aspect_ratio,m.width,m.height
from public.commerce_products p
join public.commerce_variants v on v.product_id=p.id and v.status='active'
left join public.commerce_product_content c on c.product_id=p.id
left join public.commerce_product_media m on m.product_id=p.id
  and m.publication_permission=true
  and m.rights_status='approved'
  and m.verification_status='verified'
  and m.publication_status='published'
where p.lifecycle_status='active'
  and p.merchandising_status='published'
  and p.publication_state='published';

grant select on public.commerce_catalog to anon, authenticated;

-- Launch eligibility is stricter than a media flag: every public media asset must
-- have explicit rights, verification and publication state.
create or replace function private.commerce_product_launch_ready(target_product uuid)
returns boolean language sql stable security definer set search_path='' as $$
  select exists(
    select 1
    from public.commerce_products p
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
      and exists(select 1 from public.commerce_variants v where v.product_id=p.id and v.status='active' and v.price_amount is not null)
      and not exists(select 1 from public.commerce_product_media m where m.product_id=p.id and (
        m.rights_status<>'approved' or not m.publication_permission or m.verification_status<>'verified' or m.publication_status<>'published'
      ))
  );
$$;

comment on table public.commerce_product_content is 'Approved product storytelling and merchandising content; internal authoring remains server/admin controlled.';
comment on table public.commerce_product_media is 'Product media with explicit rights, verification and publication state; concept media is never public.';
