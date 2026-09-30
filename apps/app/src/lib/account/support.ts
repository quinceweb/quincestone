import { createClient } from "@/lib/supabase/server";
import { resolveCommerceCustomer } from "./customer";
import type { AccountDataResult } from "./types";

export interface SupportRequestRow { id: string; subject: string; body: string; status: string; created_at: string; updated_at: string }

export async function listSupportRequests(): Promise<AccountDataResult<SupportRequestRow[]>> {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { data: null, error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("account_support_requests").select("id,subject,body,status,created_at,updated_at").eq("customer_id", customer.data.id).order("created_at", { ascending: false });
  return result.error ? { data: null, error: "Support requests could not be loaded." } : { data: result.data as SupportRequestRow[], error: null };
}

export async function createSupportRequest(subject: string, body: string) {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("account_support_requests").insert({ customer_id: customer.data.id, subject, body, status: "open" });
  return { error: result.error ? "The support request could not be created." : null };
}
