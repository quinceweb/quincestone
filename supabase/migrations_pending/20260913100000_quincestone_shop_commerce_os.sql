-- Quincestone Shop Commerce Operating System
-- Research data is never promoted to public commerce without evidence, economics,
-- fulfillment, and explicit human authorization.

alter table public.commerce_products
  add column if not exists target_price_amount integer,
  add column if not exists reference_retail_amount integer,
  add column if not exists fulfillment_state text not null default 'unknown'
    check (fulfillment_state in ('verified','estimated','unknown','unavailable')),
  add column if not exists human_approved_by uuid references auth.users(id) on delete set null,
  add column if not exists human_approved_at timestamptz;

alter table public.commerce_inventory
  add column if not exists verification_state text not null default 'unknown'
    check (verification_state in ('verified','estimated','unknown')),
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid references auth.users(id) on delete set null;

create table if not exists public.commerce_product_evidence (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.commerce_products(id) on delete cascade,
  dimension text not null check (dimension in ('demand','quality','utility','economics','reliability','experience','specification','fulfillment')),
  claim text not null,
  source text,
  source_type text not null default 'internal' check (source_type in ('supplier','sample','test','customer','market_research','internal','provider')),
  verified boolean not null default false,
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  expires_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists commerce_product_evidence_product_idx on public.commerce_product_evidence(product_id, dimension, verified);

create table if not exists public.commerce_product_economics (
  product_id uuid primary key references public.commerce_products(id) on delete cascade,
  supplier_unit_cost_amount integer,
  china_freight_amount integer,
  international_freight_amount integer,
  insurance_amount integer,
  duties_tax_amount integer,
  payment_fee_amount integer,
  fulfillment_amount integer,
  packaging_amount integer,
  expected_returns_amount integer,
  other_variable_amount integer,
  currency text not null default 'USD' check (char_length(currency) = 3),
  approved boolean not null default false,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  notes text,
  updated_at timestamptz not null default now()
);

create or replace view public.commerce_product_economic_summary as
select
  p.id as product_id,
  p.name,
  p.reference_retail_amount,
  p.target_price_amount,
  e.currency,
  (
    coalesce(e.supplier_unit_cost_amount,0) +
    coalesce(e.china_freight_amount,0) +
    coalesce(e.international_freight_amount,0) +
    coalesce(e.insurance_amount,0) +
    coalesce(e.duties_tax_amount,0) +
    coalesce(e.payment_fee_amount,0) +
    coalesce(e.fulfillment_amount,0) +
    coalesce(e.packaging_amount,0) +
    coalesce(e.expected_returns_amount,0) +
    coalesce(e.other_variable_amount,0)
  ) as total_variable_cost_amount,
  case when p.target_price_amount is null then null
       when (
         coalesce(e.supplier_unit_cost_amount,0) + coalesce(e.china_freight_amount,0) +
         coalesce(e.international_freight_amount,0) + coalesce(e.insurance_amount,0) +
         coalesce(e.duties_tax_amount,0) + coalesce(e.payment_fee_amount,0) +
         coalesce(e.fulfillment_amount,0) + coalesce(e.packaging_amount,0) +
         coalesce(e.expected_returns_amount,0) + coalesce(e.other_variable_amount,0)
       ) <= floor(p.target_price_amount * 0.45)
       then 'pass' else 'fail' end as margin_gate,
  case when p.target_price_amount is null then null
       else round((1 - (
         coalesce(e.supplier_unit_cost_amount,0) + coalesce(e.china_freight_amount,0) +
         coalesce(e.international_freight_amount,0) + coalesce(e.insurance_amount,0) +
         coalesce(e.duties_tax_amount,0) + coalesce(e.payment_fee_amount,0) +
         coalesce(e.fulfillment_amount,0) + coalesce(e.packaging_amount,0) +
         coalesce(e.expected_returns_amount,0) + coalesce(e.other_variable_amount,0)
       )::numeric / p.target_price_amount) * 100, 2) end as pre_ad_margin_percent,
  e.approved
from public.commerce_products p
left join public.commerce_product_economics e on e.product_id = p.id;

create table if not exists public.commerce_product_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.commerce_products(id) on delete cascade,
  from_state text,
  to_state text not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists commerce_product_lifecycle_events_product_idx on public.commerce_product_lifecycle_events(product_id, created_at desc);

create or replace function private.commerce_record_lifecycle_change() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.commerce_product_lifecycle_events(product_id,to_state,actor_user_id)
    values (new.id,new.lifecycle_status,auth.uid());
  elsif new.lifecycle_status is distinct from old.lifecycle_status then
    insert into public.commerce_product_lifecycle_events(product_id,from_state,to_state,actor_user_id)
    values (new.id,old.lifecycle_status,new.lifecycle_status,auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists commerce_product_lifecycle_audit on public.commerce_products;
create trigger commerce_product_lifecycle_audit after insert or update of lifecycle_status on public.commerce_products
for each row execute function private.commerce_record_lifecycle_change();

create table if not exists public.commerce_editorial_releases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  eyebrow text not null,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_field_notes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_product_relationships (
  product_id uuid not null references public.commerce_products(id) on delete cascade,
  related_product_id uuid not null references public.commerce_products(id) on delete cascade,
  relationship_type text not null default 'complete_the_use' check (relationship_type in ('complete_the_use','alternative','collection')),
  editorial_reason text,
  sort_order integer not null default 0,
  primary key(product_id,related_product_id,relationship_type),
  check(product_id <> related_product_id)
);

create table if not exists public.commerce_product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.commerce_products(id) on delete cascade,
  order_id uuid references public.commerce_orders(id) on delete set null,
  customer_id uuid references public.commerce_customers(id) on delete set null,
  rating integer check (rating between 1 and 5),
  title text,
  body text not null,
  verified_purchase boolean not null default false,
  status text not null default 'pending' check (status in ('pending','published','rejected')),
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists commerce_product_reviews_public_idx on public.commerce_product_reviews(product_id,status,created_at desc);

create or replace function private.commerce_product_publication_ready(target_product uuid)
returns boolean language sql stable security definer set search_path='' as $$
select exists (
  select 1
  from public.commerce_products p
  join public.commerce_product_qa q on q.product_id=p.id
  join public.commerce_product_economics e on e.product_id=p.id
  where p.id=target_product
    and p.name is not null and length(trim(p.name)) > 0
    and p.slug is not null and length(trim(p.slug)) > 0
    and p.collection is not null
    and q.sourcing_status='verified'
    and q.exact_sku_verified
    and q.sample_status='approved'
    and q.quality_result='pass'
    and q.functional_result='pass'
    and q.packaging_result='pass'
    and q.media_verification='approved'
    and q.shipping_terms_approval
    and q.returns_warranty_approval
    and q.price_approval
    and q.content_approval
    and q.final_decision='ready'
    and e.approved
    and p.target_price_amount is not null
    and (
      coalesce(e.supplier_unit_cost_amount,0) + coalesce(e.china_freight_amount,0) +
      coalesce(e.international_freight_amount,0) + coalesce(e.insurance_amount,0) +
      coalesce(e.duties_tax_amount,0) + coalesce(e.payment_fee_amount,0) +
      coalesce(e.fulfillment_amount,0) + coalesce(e.packaging_amount,0) +
      coalesce(e.expected_returns_amount,0) + coalesce(e.other_variable_amount,0)
    ) <= floor(p.target_price_amount * 0.45)
    and p.fulfillment_state='verified'
    and p.human_approved_by is not null
    and p.human_approved_at is not null
    and exists(select 1 from public.commerce_variants v where v.product_id=p.id and v.status='active' and v.price_amount is not null and v.currency is not null)
    and exists(select 1 from public.commerce_inventory i join public.commerce_variants v on v.id=i.variant_id where v.product_id=p.id and i.verification_state='verified')
    and exists(select 1 from public.commerce_product_media m where m.product_id=p.id and m.rights_status='approved' and m.publication_permission=true)
    and not exists(select 1 from public.commerce_product_media m where m.product_id=p.id and (m.rights_status<>'approved' or not m.publication_permission))
    and exists(select 1 from public.commerce_product_evidence ev where ev.product_id=p.id and ev.dimension='demand' and ev.verified)
    and exists(select 1 from public.commerce_product_evidence ev where ev.product_id=p.id and ev.dimension='quality' and ev.verified)
    and exists(select 1 from public.commerce_product_evidence ev where ev.product_id=p.id and ev.dimension='utility' and ev.verified)
    and exists(select 1 from public.commerce_product_evidence ev where ev.product_id=p.id and ev.dimension='reliability' and ev.verified)
);
$$;

create or replace function private.commerce_block_unready_publish_v2() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.lifecycle_status='active' or new.merchandising_status='published' or new.publication_state='published' then
    if not private.commerce_product_publication_ready(new.id) then
      raise exception 'product publication gate is incomplete';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists commerce_product_publish_gate_v2 on public.commerce_products;
create trigger commerce_product_publish_gate_v2 before insert or update on public.commerce_products
for each row execute function private.commerce_block_unready_publish_v2();

create or replace function public.commerce_product_gate(target_product uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
  if not private.is_platform_operator(auth.uid()) then raise exception 'Forbidden'; end if;
  select jsonb_build_object(
    'ready', private.commerce_product_publication_ready(target_product),
    'economic_margin', coalesce((select row_to_json(s) from public.commerce_product_economic_summary s where s.product_id=target_product),'{}'::json),
    'evidence', coalesce((select jsonb_object_agg(dimension, verified_count) from (select dimension,count(*) filter(where verified) verified_count from public.commerce_product_evidence where product_id=target_product group by dimension) x),'{}'::jsonb),
    'inventory_verified', exists(select 1 from public.commerce_inventory i join public.commerce_variants v on v.id=i.variant_id where v.product_id=target_product and i.verification_state='verified'),
    'fulfillment_verified', exists(select 1 from public.commerce_products where id=target_product and fulfillment_state='verified'),
    'human_approved', exists(select 1 from public.commerce_products where id=target_product and human_approved_by is not null and human_approved_at is not null)
  ) into result;
  return result;
end;
$$;
revoke all on function public.commerce_product_gate(uuid) from public;
grant execute on function public.commerce_product_gate(uuid) to authenticated;

alter table public.commerce_product_evidence enable row level security;
alter table public.commerce_product_economics enable row level security;
alter table public.commerce_product_lifecycle_events enable row level security;
alter table public.commerce_editorial_releases enable row level security;
alter table public.commerce_field_notes enable row level security;
alter table public.commerce_product_relationships enable row level security;
alter table public.commerce_product_reviews enable row level security;

create policy commerce_product_evidence_operator on public.commerce_product_evidence for all to authenticated using (private.is_platform_operator(auth.uid())) with check (private.is_platform_operator(auth.uid()));
create policy commerce_product_economics_operator on public.commerce_product_economics for all to authenticated using (private.is_platform_operator(auth.uid())) with check (private.is_platform_operator(auth.uid()));
create policy commerce_product_lifecycle_operator on public.commerce_product_lifecycle_events for select to authenticated using (private.is_platform_operator(auth.uid()));
create policy commerce_editorial_operator on public.commerce_editorial_releases for all to authenticated using (private.is_platform_operator(auth.uid())) with check (private.is_platform_operator(auth.uid()));
create policy commerce_field_notes_operator on public.commerce_field_notes for all to authenticated using (private.is_platform_operator(auth.uid())) with check (private.is_platform_operator(auth.uid()));
create policy commerce_relationship_operator on public.commerce_product_relationships for all to authenticated using (private.is_platform_operator(auth.uid())) with check (private.is_platform_operator(auth.uid()));
create policy commerce_reviews_operator on public.commerce_product_reviews for all to authenticated using (private.is_platform_operator(auth.uid())) with check (private.is_platform_operator(auth.uid()));

revoke all on table public.commerce_product_evidence, public.commerce_product_economics, public.commerce_product_lifecycle_events, public.commerce_editorial_releases, public.commerce_field_notes, public.commerce_product_relationships, public.commerce_product_reviews from anon;
revoke all on table public.commerce_product_evidence, public.commerce_product_economics, public.commerce_product_lifecycle_events, public.commerce_editorial_releases, public.commerce_field_notes, public.commerce_product_relationships, public.commerce_product_reviews from authenticated;
grant select,insert,update,delete on table public.commerce_product_evidence, public.commerce_product_economics, public.commerce_editorial_releases, public.commerce_field_notes, public.commerce_product_relationships, public.commerce_product_reviews to authenticated;
grant select on table public.commerce_product_lifecycle_events to authenticated;
