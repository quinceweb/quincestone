"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { removeAddress, saveAddress } from "@/lib/account/addresses";
import { updateCustomerProfile } from "@/lib/account/customer";
import { saveNotificationPreferences } from "@/lib/account/notifications";
import { removeSavedProduct } from "@/lib/account/saved";
import { createSupportRequest } from "@/lib/account/support";
import { countryCode, optionalText, requiredText } from "@/lib/account/input";
export async function updateProfileAction(form: FormData) {
  const result = await updateCustomerProfile({ name: requiredText(form, "name", 200), phone: optionalText(form, "phone", 50) });
  revalidatePath("/profile"); redirect(result.error ? `/profile?error=${encodeURIComponent(result.error)}` : "/profile?saved=1");
}
export async function saveAddressAction(form: FormData) {
  const country = countryCode(String(form.get("country_code") ?? ""));
  if (!country) redirect("/addresses?error=Country%20must%20be%20a%20two-letter%20code.");
  const result = await saveAddress(optionalText(form, "id", 36), {
    label: optionalText(form, "label", 100), recipient_name: requiredText(form, "recipient_name", 200), line1: requiredText(form, "line1", 300),
    line2: optionalText(form, "line2", 300), city: requiredText(form, "city", 150), state_region: optionalText(form, "state_region", 150),
    postal_code: optionalText(form, "postal_code", 30), country_code: country, phone: optionalText(form, "phone", 50), is_default: form.get("is_default") === "on",
  });
  revalidatePath("/addresses"); redirect(result.error ? `/addresses?error=${encodeURIComponent(result.error)}` : "/addresses?saved=1");
}
export async function removeAddressAction(form: FormData) { await removeAddress(requiredText(form, "id", 36)); revalidatePath("/addresses"); }
export async function saveNotificationsAction(form: FormData) {
  const checked = (name: string) => form.get(name) === "on";
  const result = await saveNotificationPreferences({ order_updates: checked("order_updates"), account_security: checked("account_security"), product_updates: checked("product_updates"), field_notes: checked("field_notes"), recommendations: checked("recommendations"), marketing: checked("marketing") });
  revalidatePath("/notifications"); redirect(result.error ? `/notifications?error=${encodeURIComponent(result.error)}` : "/notifications?saved=1");
}
export async function removeSavedAction(form: FormData) { await removeSavedProduct(requiredText(form, "id", 36)); revalidatePath("/saved"); }
export async function createSupportAction(form: FormData) {
  const result = await createSupportRequest(requiredText(form, "subject", 200), requiredText(form, "body", 5000));
  revalidatePath("/support"); redirect(result.error ? `/support?error=${encodeURIComponent(result.error)}` : "/support?created=1");
}
