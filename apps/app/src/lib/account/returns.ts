import { createClient } from "@/lib/supabase/server";
import { resolveCommerceCustomer } from "./customer";
import type { AccountDataResult } from "./types";

export interface AccountReturnRow { id: string; order_id: string; status: string; reason: string; created_at: string; updated_at: string }

export async function listReturns(): Promise<AccountDataResult<AccountReturnRow[]>> {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { data: null, error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("commerce_returns").select("id,order_id,status,reason,created_at,updated_at").eq("customer_id", customer.data.id).order("created_at", { ascending: false });
  return result.error ? { data: null, error: "Returns could not be loaded." } : { data: result.data as AccountReturnRow[], error: null };
}
