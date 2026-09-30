import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthorizedBusinessBySlug } from "@/lib/account-businesses";
import { getBusinessContext } from "@/lib/business-context";
import { createClient } from "@/lib/supabase/server";

export default async function BusinessHome({params}:{params:Promise<{workspace:string}>}){
  const {workspace:slug}=await params;
  const authority=await getAuthorizedBusinessBySlug(slug);
  if(!authority)notFound();
  const context=await getBusinessContext(authority.workspace.id);
  const supabase=await createClient();
  const {count:edgeCount}=await supabase.from("edge_installations").select("id",{count:"exact",head:true}).eq("workspace_id",authority.workspace.id).eq("status","active");
  const {count:demandCount}=await supabase.from("interactions").select("id",{count:"exact",head:true}).eq("workspace_id",authority.workspace.id);
  return <section className="page-section">
    <span className="eyebrow">Business · {authority.role}</span><h1>{authority.workspace.name}</h1>
    <p className="lede">{context ? "Your business context is ready." : "Complete the minimum setup so Quincestone can understand and route incoming customer demand."}</p>
    <div className="record-list">
      <article className="record"><div><div className="panel-kicker">Business profile</div><h2>{context?"Complete":"Setup required"}</h2></div><Link className="panel-link" href={`/business/${slug}/setup`}>{context?"Review":"Set up"} →</Link></article>
      <article className="record"><div><div className="panel-kicker">Edge</div><h2>{edgeCount?"Connected":"Not connected"}</h2></div>{context&&!edgeCount?<Link className="panel-link" href="/integrations">Connect Edge →</Link>:null}</article>
      <article className="record"><div><div className="panel-kicker">First customer demand</div><h2>{demandCount?"Received":"Waiting"}</h2></div></article>
    </div>
    {!context?<Link className="button" href={`/business/${slug}/setup`}>Set up business</Link>:!edgeCount?<Link className="button" href="/integrations">Connect Edge</Link>:null}
  </section>;
}