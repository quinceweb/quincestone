import { createClient } from "@/lib/supabase/server";
import { getAuthorizedBusinessBySlug } from "@/lib/account-businesses";

export function canManageBusinessContext(role: string) { return role === "owner" || role === "admin"; }\n\nexport type BusinessContextInput = {
  description: string;
  offerings: string[];
  primaryCustomers: string;
  operatingRegion: string | null;
  website: string | null;
};

export function validateBusinessContext(input: BusinessContextInput) {
  const description = input.description.trim();
  const offerings = [...new Set(input.offerings.map((value) => value.trim()).filter(Boolean))];
  const primaryCustomers = input.primaryCustomers.trim();
  const operatingRegion = input.operatingRegion?.trim() || null;
  const website = input.website?.trim() || null;
  if (description.length < 10 || description.length > 1000) throw new Error("Business description must be between 10 and 1,000 characters.");
  if (offerings.length < 1 || offerings.length > 12 || offerings.some((value) => value.length < 2 || value.length > 120)) throw new Error("Add between 1 and 12 offerings, each between 2 and 120 characters.");
  if (primaryCustomers.length < 2 || primaryCustomers.length > 500) throw new Error("Customer context must be between 2 and 500 characters.");
  if (operatingRegion && (operatingRegion.length < 2 || operatingRegion.length > 120)) throw new Error("Operating region must be between 2 and 120 characters.");
  if (website) {
    let parsed: URL;
    try { parsed = new URL(website); } catch { throw new Error("Website must be a valid HTTPS URL."); }
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || website.length > 300) throw new Error("Website must be a valid HTTPS URL.");
  }
  return { description, offerings, primaryCustomers, operatingRegion, website };
}

export async function getBusinessContext(workspaceId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("workspace_business_context")
    .select("workspace_id, description, offerings, primary_customers, operating_region, website, updated_at")
    .eq("workspace_id", workspaceId).maybeSingle();
  if (error) throw new Error("Business context could not be loaded.");
  return data;
}

export async function saveBusinessContext(slug: string, input: BusinessContextInput) {
  const authority = await getAuthorizedBusinessBySlug(slug);
  if (!authority || !canManageBusinessContext(authority.role)) throw new Error("You are not authorized to update this business.");
  const value = validateBusinessContext(input);
  const supabase = await createClient();
  const row = { workspace_id: authority.workspace.id, description: value.description, offerings: value.offerings, primary_customers: value.primaryCustomers, operating_region: value.operatingRegion, website: value.website };
  const { data: existing, error: readError } = await supabase.from("workspace_business_context").select("workspace_id").eq("workspace_id", authority.workspace.id).maybeSingle();
  if (readError) throw new Error("Business context could not be loaded.");
  const result = existing
    ? await supabase.from("workspace_business_context").update(row).eq("workspace_id", authority.workspace.id)
    : await supabase.from("workspace_business_context").insert(row);
  if (result.error) throw new Error("Business context could not be saved.");
  return authority.workspace;
}
