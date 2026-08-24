import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceMembership } from "@/lib/workspaces";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const membership = await getCurrentWorkspaceMembership();
  if (membership) redirect("/dashboard");

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="brand">QUINCESTONE</div>
        <div className="eyebrow" style={{ marginTop: 18 }}>Workspace setup</div>
        <h1 style={{ fontSize: 30 }}>Create your workspace</h1>
        <p className="lede">Your workspace is where Quincestone organizes customer interactions, knowledge, policies, reviews and operational outcomes.</p>
        <OnboardingForm />
      </section>
    </main>
  );
}
