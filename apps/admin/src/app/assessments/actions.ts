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

export async function decideAssessment(formData: FormData) {
  await requirePlatformRole("operator");
  const id = String(formData.get("assessment_id") || "");
  const decision = String(formData.get("decision") || "");
  const notes = String(formData.get("notes") || "");
  if (!id || !["approved", "changes_requested", "rejected"].includes(decision)) throw new Error("Invalid assessment decision.");

  const supabase = await createClient();
  const { error } = await supabase.rpc("decide_assessment_review", {
    target_assessment: id,
    target_decision: decision,
    target_notes: notes || null,
    target_report: null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/assessments");
}
