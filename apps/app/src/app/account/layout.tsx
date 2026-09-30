import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/account-shell";
import { createClient } from "@/lib/supabase/server";
import "./account.css";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/account");
  return <AccountShell email={user.email}>{children}</AccountShell>;
}