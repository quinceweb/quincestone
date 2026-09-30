import { createClient } from "@/lib/supabase/server";
import { resolveCommerceCustomer } from "./customer";
import type { AccountAddress, AccountDataResult } from "./types";

const ADDRESS_COLUMNS = "id,label,recipient_name,line1,line2,city,state_region,postal_code,country_code,phone,is_default";

export async function listAddresses(): Promise<AccountDataResult<AccountAddress[]>> {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { data: null, error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("commerce_addresses").select(ADDRESS_COLUMNS).eq("customer_id", customer.data.id).order("is_default", { ascending: false }).order("created_at");
  return result.error ? { data: null, error: "Addresses could not be loaded." } : { data: result.data as AccountAddress[], error: null };
}

export interface AddressInput {
  label: string | null;
  recipient_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state_region: string | null;
  postal_code: string | null;
  country_code: string;
  phone: string | null;
  is_default: boolean;
}

export async function saveAddress(id: string | null, input: AddressInput) {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { error: customer.error };
  const supabase = await createClient();
  if (input.is_default) await supabase.from("commerce_addresses").update({ is_default: false }).eq("customer_id", customer.data.id);
  const query = id
    ? supabase.from("commerce_addresses").update(input).eq("id", id).eq("customer_id", customer.data.id)
    : supabase.from("commerce_addresses").insert({ ...input, customer_id: customer.data.id });
  const result = await query.select("id").single();
  return { error: result.error ? "The address could not be saved." : null };
}

export async function removeAddress(id: string) {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("commerce_addresses").delete().eq("id", id).eq("customer_id", customer.data.id);
  return { error: result.error ? "The address could not be removed." : null };
}
