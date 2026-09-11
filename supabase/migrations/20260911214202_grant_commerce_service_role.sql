-- The public schema defaults intentionally opt every API role out of table
-- DML. Restore only the privileges used by the trusted checkout/webhook path.
grant select, insert, update
on table
  public.commerce_orders,
  public.commerce_order_items,
  public.commerce_payments,
  public.commerce_fulfillments,
  public.commerce_refunds,
  public.commerce_returns
to service_role;

-- Checkout derives all charged commercial state from these server-side tables.
grant select
on table
  public.commerce_products,
  public.commerce_variants,
  public.commerce_inventory
to service_role;

-- commerce_orders.order_number is GENERATED ALWAYS AS IDENTITY.
grant usage
on sequence public.commerce_orders_order_number_seq
to service_role;
