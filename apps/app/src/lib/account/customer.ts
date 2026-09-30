import type { User } from "@supabase/supabase-js";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { AccountDataResult, CommerceCustomer } from "./types";

function customerName(user: User) {
  const first = typeof user.user_metadata.first_name === "string" ? user.user_metadata.first_name.trim() : "";
  const last = typeof user.user_metadata.last_name === "string" ? user.user_metadata.last_name.trim() : "";
  return [first, last].filter(Boolean).join(" ") || user.email?.split("@")[0] || "Quincestone customer";
}

export const resolveCommerceCustomer = cache(async (): Promise<AccountDataResult<CommerceCustomer>> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { data: null, error: "Authentication is unavailable." };

  const existing = await supabase.from("commerce_customers").select("id,auth_user_id,email,name,phone,status").eq("auth_user_id", user.id).maybeSingle();
  if (existing.data) return { data: existing.data as CommerceCustomer, error: null };
  if (existing.error) return { data: null, error: "Your customer record could not be loaded." };

  const inserted = await supabase.from("commerce_customers").insert({
    auth_user_id: user.id,
    email: user.email ?? null,
    name: customerName(user),
  }).select("id,auth_user_id,email,name,phone,status").single();

  if (inserted.data) return { data: inserted.data as CommerceCustomer, error: null };
  if (inserted.error?.code !== "23505") return { data: null, error: "Your customer record could not be established." };

  const concurrent = await supabase.from("commerce_customers").select("id,auth_user_id,email,name,phone,status").eq("auth_user_id", user.id).single();
  return concurrent.data
    ? { data: concurrent.data as CommerceCustomer, error: null }
    : { data: null, error: "Your customer record could not be established." };
});

export async function updateCustomerProfile(values: { name: string; phone: string | null }) {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return customer;
  const supabase = await createClient();
  const result = await supabase.from("commerce_customers").update(values).eq("id", customer.data.id).select("id,auth_user_id,email,name,phone,status").single();
  return result.data
    ? { data: result.data as CommerceCustomer, error: null }
    : { data: null, error: "Your profile could not be updated." };
}
