-- Historical checkout accepted duplicate variant lines. Reconcile them before
-- the Step 3 uniqueness migration so an existing cart cannot block deployment.
with duplicate_totals as (
  select
    min(id) as keeper_id,
    sum(quantity)::integer as quantity,
    sum(line_total_amount)::integer as line_total_amount
  from public.commerce_order_items
  where variant_id is not null
  group by order_id, variant_id
  having count(*) > 1
)
update public.commerce_order_items as item
set
  quantity = duplicate_totals.quantity,
  line_total_amount = duplicate_totals.line_total_amount
from duplicate_totals
where item.id = duplicate_totals.keeper_id;

delete from public.commerce_order_items as item
where item.variant_id is not null
  and item.id <> (
    select min(candidate.id)
    from public.commerce_order_items as candidate
    where candidate.order_id = item.order_id
      and candidate.variant_id = item.variant_id
  );
