drop index public.commerce_order_items_order_variant_uidx;

create unique index commerce_order_items_order_variant_uidx
  on public.commerce_order_items (order_id, variant_id);
