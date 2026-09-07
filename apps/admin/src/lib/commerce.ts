import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createCommerceClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} },
    },
  });
}

export function createCommerceAuthorityClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Commerce server authority is not configured.");
  return createSupabaseClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const launchGateLabels = [
  ["exact_sku_verified", "Exact SKU"],
  ["sample_status", "Sample"],
  ["quality_result", "Quality"],
  ["functional_result", "Functional"],
  ["packaging_result", "Packaging"],
  ["economics_approval", "Economics"],
  ["shipping_terms_approval", "Shipping terms"],
  ["returns_warranty_approval", "Returns / warranty"],
  ["media_verification", "Media rights"],
  ["price_approval", "Price"],
  ["content_approval", "Content"],
] as const;

export function gatePassed(key: string, value: unknown) {
  if (key.endsWith("_approval") || key === "exact_sku_verified") return value === true;
  if (key === "sample_status") return value === "approved";
  if (key === "media_verification") return value === "approved";
  return value === "pass";
}
