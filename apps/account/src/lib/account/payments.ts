import { createClient } from "@/lib/supabase/server";
import { resolveCommerceCustomer } from "./customer";
import type { AccountDataResult } from "./types";

export interface PaymentRow { id: string; order_id: string; amount: number; currency: string; status: string; verified: boolean; created_at: string }

export async function listPayments(): Promise<AccountDataResult<PaymentRow[]>> {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { data: null, error: customer.error };
  const supabase = await createClient();
  const orders = await supabase.from("commerce_orders").select("id").eq("customer_id", customer.data.id);
  if (orders.error) return { data: null, error: "Payment history could not be loaded." };
  const ids = orders.data.map((order) => order.id);
  if (!ids.length) return { data: [], error: null };
  const result = await supabase.from("commerce_payments").select("id,order_id,amount,currency,status,verified,created_at").in("order_id", ids).order("created_at", { ascending: false });
  return result.error ? { data: null, error: "Payment history could not be loaded." } : { data: result.data as PaymentRow[], error: null };
}
