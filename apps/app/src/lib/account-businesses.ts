import { createClient } from "@/lib/supabase/server";
export type AccountBusiness={workspace_id:string;role:string;workspace:{id:string;name:string;slug:string}};
export async function listAccountBusinesses():Promise<AccountBusiness[]>{
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)return [];
 const {data:memberships,error}=await supabase.from("workspace_members").select("workspace_id, role").eq("user_id",user.id).order("created_at",{ascending:true});
 if(error)throw new Error("We couldn't load your businesses."); if(!memberships?.length)return [];
 const ids=memberships.map(m=>m.workspace_id); const {data:workspaces,error:workspaceError}=await supabase.from("workspaces").select("id, name, slug").in("id",ids);
 if(workspaceError)throw new Error("We couldn't load your businesses."); const byId=new Map((workspaces??[]).map(w=>[w.id,w]));
 return memberships.flatMap(m=>{const w=byId.get(m.workspace_id);return w?[{workspace_id:m.workspace_id,role:m.role,workspace:w}]:[];});
}
export async function getAuthorizedBusinessBySlug(slug:string){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)return null;
 const {data:workspace,error}=await supabase.from("workspaces").select("id, name, slug").eq("slug",slug).maybeSingle(); if(error||!workspace)return null;
 const {data:membership,error:membershipError}=await supabase.from("workspace_members").select("role").eq("workspace_id",workspace.id).eq("user_id",user.id).maybeSingle();
 if(membershipError||!membership)return null; return {user,workspace,role:membership.role};
}