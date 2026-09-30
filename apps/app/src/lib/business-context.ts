import { createClient } from "@/lib/supabase/server";
import { getAuthorizedBusinessBySlug } from "@/lib/account-businesses";
import { canManageBusinessContext, validateBusinessContext, type BusinessContextInput } from "@/lib/business-context-contract";

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
