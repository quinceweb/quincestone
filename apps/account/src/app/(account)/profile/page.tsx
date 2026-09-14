import { SectionPage } from "@/components/section-page";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  const firstName = typeof user?.user_metadata?.first_name === "string" ? user.user_metadata.first_name : "";
  const lastName = typeof user?.user_metadata?.last_name === "string" ? user.user_metadata.last_name : "";
  return <SectionPage eyebrow="ACCOUNT" title="Profile" intro="Your core identity details. Only the information needed for your Quincestone relationship belongs here."><section className="panel definition-list"><div><span>Name</span><strong>{[firstName, lastName].filter(Boolean).join(" ") || "Not provided"}</strong></div><div><span>Email</span><strong>{user?.email ?? "Unavailable"}</strong></div><div><span>Phone</span><strong>Not collected</strong></div><p className="muted">Profile editing will be enabled when the canonical profile record is wired. No unsupported changes are simulated here.</p></section></SectionPage>;
}
