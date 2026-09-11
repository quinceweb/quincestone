alter table public.commerce_orders
  add column checkout_attempt_id uuid,
  add column checkout_fingerprint text,
  add constraint commerce_orders_checkout_identity_pair_check
    check ((checkout_attempt_id is null) = (checkout_fingerprint is null)),
  add constraint commerce_orders_checkout_fingerprint_check
    check (checkout_fingerprint is null or checkout_fingerprint ~ '^[0-9a-f]{64}$');

create unique index commerce_orders_checkout_attempt_uidx
  on public.commerce_orders (checkout_attempt_id)
  where checkout_attempt_id is not null;

create unique index commerce_order_items_order_variant_uidx
  on public.commerce_order_items (order_id, variant_id)
  where variant_id is not null;

create unique index commerce_payments_order_provider_uidx
  on public.commerce_payments (order_id, provider);

comment on column public.commerce_orders.checkout_attempt_id is
  'Validated client-generated logical checkout attempt UUID; unique across orders.';
comment on column public.commerce_orders.checkout_fingerprint is
  'SHA-256 of normalized trusted checkout inputs; detects attempt-key reuse with changed commerce state.';
