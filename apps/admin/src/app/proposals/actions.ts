"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requirePlatformRole } from "@/lib/platform-authority";

async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} },
    },
  });
}

export async function decideProposal(formData: FormData) {
  await requirePlatformRole("operator");
  const id = String(formData.get("proposal_id") || "");
  const decision = String(formData.get("decision") || "");
  const workspaceId = String(formData.get("workspace_id") || "").trim();
  const reason = String(formData.get("reason") || "");
  if (!id || !["approved", "rejected"].includes(decision)) throw new Error("Invalid proposal decision.");

  const supabase = await createClient();
  const { error } = await supabase.rpc("decide_implementation_proposal", {
    target_proposal: id,
    target_decision: decision,
    target_workspace_id: workspaceId || null,
    target_reason: reason || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/proposals");
  revalidatePath("/assessments");
}
