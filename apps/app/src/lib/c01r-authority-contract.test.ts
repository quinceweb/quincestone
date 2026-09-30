import { readFileSync } from "node:fs"; import { resolve } from "node:path"; import { describe, expect, it } from "vitest";
const root=resolve(process.cwd(),"src"); const read=(p:string)=>readFileSync(resolve(root,p),"utf8");
describe("C01R authority contracts",()=>{
 it("Account requires identity without workspace resolution",()=>{const s=read("app/account/layout.tsx");expect(s).toContain("supabase.auth.getUser()");expect(s).toContain('redirect("/sign-in?next=/account")');expect(s).not.toContain("getCurrentWorkspace");expect(s).not.toContain("workspace_members");});
 it("Business resolves server-authorized membership rather than trusting the slug",()=>{const s=read("lib/account-businesses.ts");expect(s).toContain('from("workspace_members")');expect(s).toContain('.eq("workspace_id",workspace.id)');expect(s).toContain('.eq("user_id",user.id)');});
 it("personal commerce remains customer-owned, not workspace-owned",()=>{for(const p of ["lib/account/orders.ts","lib/account/addresses.ts","lib/account/saved.ts","lib/account/payments.ts"]){const s=read(p);expect(s).toContain("customer.data.id");expect(s).not.toContain("workspace_id");}});
 it("logout revokes the canonical App Supabase session",()=>{const s=read("app/account/actions.ts");expect(s).toContain("supabase.auth.signOut()");expect(s).toContain('redirect("/sign-in")');});
 it("server Supabase client does not expose service-role credentials",()=>{const s=read("lib/supabase/server.ts");expect(s).not.toContain("SERVICE_ROLE");expect(s).not.toContain("service_role");});
});