-- Internal research record only. No sellable variant, price, inventory, or supplier SKU is seeded.
with product as (
  insert into public.commerce_products (slug,name,description,collection,lifecycle_status,merchandising_status,publication_state,seo_title,seo_description)
  values (
    'vacuum-compression-travel-backpack',
    'Vacuum Compression Travel Backpack',
    'A premium travel-system concept centered on organized packing, controlled volume, and mobility. Supplier-dependent product facts remain pending verification.',
    'travel','sourcing','draft','private',
    'Vacuum Compression Travel Backpack — Quincestone',
    'A Quincestone Travel product candidate. Specifications and purchase availability remain pending verification.'
  )
  on conflict (slug) do update set
    name=excluded.name,
    description=excluded.description,
    collection=excluded.collection,
    lifecycle_status='sourcing',
    merchandising_status='draft',
    publication_state='private'
  returning id
)
insert into public.commerce_product_qa (product_id,sourcing_status,exact_sku_verified,sample_status,quality_result,functional_result,packaging_result,media_verification,economics_approval,shipping_terms_approval,returns_warranty_approval,price_approval,content_approval,final_decision,notes)
select id,'pending',false,'not_ordered','pending','pending','pending','pending',false,false,false,false,false,'blocked','Supplier candidate and product concept are intentionally unverified.' from product
on conflict (product_id) do update set
  sourcing_status='pending',exact_sku_verified=false,sample_status='not_ordered',quality_result='pending',functional_result='pending',packaging_result='pending',media_verification='pending',economics_approval=false,shipping_terms_approval=false,returns_warranty_approval=false,price_approval=false,content_approval=false,final_decision='blocked',notes='Supplier candidate and product concept are intentionally unverified.';

insert into public.commerce_product_content (product_id,eyebrow,headline,subheadline,short_description,story,benefit_blocks,feature_blocks,specs,included_items,usage_steps,faq,shipping,returns_policy,seo_title,seo_description)
select id,
  'QUINCESTONE / TRAVEL',
  'More room. Less volume.',
  'A considered travel system for packing with more control.',
  'A vacuum-compression travel backpack concept built around organized packing and efficient movement. Exact product features remain subject to sample and SKU verification.',
  'The experience is designed around a simple sequence: pack, seal, compress, travel. The final product story will be completed only after the physical sample, exact SKU, performance, materials, included components, economics, and commercial terms are verified.',
  '[{"title":"Order","text":"A clearer packing workflow, subject to final product verification."},{"title":"Control","text":"A structured compression workflow, described qualitatively until tested."},{"title":"Mobility","text":"A travel-first system designed to reduce friction, not to promise unverified capacity or airline compliance."}]'::jsonb,
  '[]'::jsonb,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,
  '{"status":"PENDING_VERIFICATION"}'::jsonb,'{"status":"PENDING_VERIFICATION"}'::jsonb,
  'Vacuum Compression Travel Backpack — Quincestone',
  'Quincestone Travel product candidate with publication and specifications gated pending supplier, sample, QA, economics, rights, and content verification.'
from public.commerce_products where slug='vacuum-compression-travel-backpack'
on conflict (product_id) do update set eyebrow=excluded.eyebrow,headline=excluded.headline,subheadline=excluded.subheadline,short_description=excluded.short_description,story=excluded.story,benefit_blocks=excluded.benefit_blocks,feature_blocks=excluded.feature_blocks,specs=excluded.specs,included_items=excluded.included_items,usage_steps=excluded.usage_steps,faq=excluded.faq,shipping=excluded.shipping,returns_policy=excluded.returns_policy,seo_title=excluded.seo_title,seo_description=excluded.seo_description;

insert into public.commerce_suppliers (name,status,risk_notes)
values ('Anhui Three Six Seven Travel Products Co., Ltd.','research','Candidate supplier supplied as sourcing direction only. Exact SKU, sample, commercial terms, rights, and quality remain unverified.')
on conflict do nothing;
