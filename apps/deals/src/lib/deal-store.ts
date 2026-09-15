import { createClient } from "@/lib/supabase/server";

export type DealRow = { id:string; deal_number:number; title:string; status:string; counterparty_name:string|null; currency:string; value_minor:number|null; next_action:string|null; expires_at:string|null; updated_at:string };

export async function listDeals(): Promise<{data: DealRow[]; error?: string}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: "Authentication required." };
    const { data, error } = await supabase.from("deals").select("id,deal_number,title,status,counterparty_name,currency,value_minor,next_action,expires_at,updated_at").order("updated_at", { ascending:false });
    return error ? { data:[], error:error.message } : { data:(data ?? []) as DealRow[] };
  } catch (error) { return { data:[], error:error instanceof Error ? error.message : "Deals unavailable." }; }
}

export async function getDeal(id:string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data:null, error:"Authentication required." };
  const { data, error } = await supabase.from("deals").select("*, deal_offers(*), deal_terms(*), deal_decisions(*), deal_events(*)").eq("id", id).single();
  return { data, error:error?.message };
}
