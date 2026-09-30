import { notFound, redirect } from "next/navigation";
import { BusinessContextShell } from "@/components/business-context-shell";
import { createClient } from "@/lib/supabase/server";
import { getAuthorizedBusinessBySlug } from "@/lib/account-businesses";
export default async function BusinessLayout({children,params}:{children:React.ReactNode;params:Promise<{workspace:string}>}){
 const {workspace:slug}=await params; const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect(`/sign-in?next=${encodeURIComponent(`/business/${slug}`)}`);
 const context=await getAuthorizedBusinessBySlug(slug); if(!context)notFound();
 return <BusinessContextShell workspace={context.workspace} role={context.role} email={context.user.email}>{children}</BusinessContextShell>;
}