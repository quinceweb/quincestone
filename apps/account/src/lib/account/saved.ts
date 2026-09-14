import { createClient } from "@/lib/supabase/server";
import { resolveCommerceCustomer } from "./customer";
import type { AccountDataResult } from "./types";

export interface SavedProductRow {
  id: string;
  product_id: string;
  created_at: string;
  commerce_products: { name: string; slug: string; lifecycle_status: string; merchandising_status: string; publication_state: string } | null;
}

export async function listSavedProducts(): Promise<AccountDataResult<SavedProductRow[]>> {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { data: null, error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("account_saved_products").select("id,product_id,created_at,commerce_products(name,slug,lifecycle_status,merchandising_status,publication_state)").eq("customer_id", customer.data.id).order("created_at", { ascending: false });
  return result.error ? { data: null, error: "Saved products could not be loaded." } : { data: result.data as unknown as SavedProductRow[], error: null };
}

export async function removeSavedProduct(id: string) {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("account_saved_products").delete().eq("id", id).eq("customer_id", customer.data.id);
  return { error: result.error ? "The saved product could not be removed." : null };
}
