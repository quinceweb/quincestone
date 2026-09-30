import { createClient } from "@/lib/supabase/server";
import { resolveCommerceCustomer } from "./customer";
import type { AccountDataResult } from "./types";

export interface AccountOrderRow {
  id: string;
  order_number: number;
  status: string;
  currency: string;
  total_amount: number;
  created_at: string;
  paid_at: string | null;
  fulfilled_at: string | null;
  delivered_at: string | null;
  commerce_order_items?: Array<{ id: string; product_name: string; sku: string; quantity: number; unit_price_amount: number; line_total_amount: number; currency: string }>;
  commerce_fulfillments?: Array<{ id: string; status: string; carrier: string | null; tracking_url: string | null; shipped_at: string | null; delivered_at: string | null }>;
}

const ORDER_COLUMNS = "id,order_number,status,currency,total_amount,created_at,paid_at,fulfilled_at,delivered_at";

export async function listOrders(): Promise<AccountDataResult<AccountOrderRow[]>> {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { data: null, error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("commerce_orders").select(ORDER_COLUMNS).eq("customer_id", customer.data.id).order("created_at", { ascending: false });
  return result.error ? { data: null, error: "Orders could not be loaded." } : { data: result.data as AccountOrderRow[], error: null };
}

export async function getOrder(id: string): Promise<AccountDataResult<AccountOrderRow>> {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { data: null, error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("commerce_orders").select(`${ORDER_COLUMNS},commerce_order_items(id,product_name,sku,quantity,unit_price_amount,line_total_amount,currency),commerce_fulfillments(id,status,carrier,tracking_url,shipped_at,delivered_at)`).eq("customer_id", customer.data.id).eq("id", id).maybeSingle();
  return result.error ? { data: null, error: "Order details could not be loaded." } : { data: result.data as AccountOrderRow | null, error: null };
}
