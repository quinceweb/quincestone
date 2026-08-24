import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceMembership } from "@/lib/workspaces";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const membership = await getCurrentWorkspaceMembership();
  redirect(membership ? "/dashboard" : "/onboarding");
}
