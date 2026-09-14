import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account-shell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  return <AccountShell email={user.email}>{children}</AccountShell>;
}
