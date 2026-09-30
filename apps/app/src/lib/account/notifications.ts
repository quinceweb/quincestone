import { createClient } from "@/lib/supabase/server";
import { resolveCommerceCustomer } from "./customer";
import { DEFAULT_NOTIFICATION_PREFERENCES, type AccountDataResult, type AccountNotificationPreferences } from "./types";

const COLUMNS = "order_updates,account_security,product_updates,field_notes,recommendations,marketing";

export async function getNotificationPreferences(): Promise<AccountDataResult<AccountNotificationPreferences>> {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { data: null, error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("account_notification_preferences").select(COLUMNS).eq("customer_id", customer.data.id).maybeSingle();
  if (result.error) return { data: null, error: "Notification preferences could not be loaded." };
  return { data: (result.data as AccountNotificationPreferences | null) ?? DEFAULT_NOTIFICATION_PREFERENCES, error: null };
}

export async function saveNotificationPreferences(values: AccountNotificationPreferences) {
  const customer = await resolveCommerceCustomer();
  if (!customer.data) return { error: customer.error };
  const supabase = await createClient();
  const result = await supabase.from("account_notification_preferences").upsert({ customer_id: customer.data.id, ...values }, { onConflict: "customer_id" });
  return { error: result.error ? "Notification preferences could not be saved." : null };
}
