import Link from "next/link";
import { SectionPage } from "@/components/account/section-page";
import { listAccountBusinesses } from "@/lib/account-businesses";
import { CreateBusinessForm } from "./create-business-form";
export default async function BusinessesPage(){
 const businesses=await listAccountBusinesses();
 return <SectionPage eyebrow="ACCOUNT" title="Businesses" intro="Businesses you are authorized to operate with this Quincestone identity.">
   {businesses.length?<div className="card-list">{businesses.map(item=><article className="panel" key={item.workspace_id}><strong>{item.workspace.name}</strong><p className="muted">Role: {item.role}</p><Link className="text-link" href={`/business/${item.workspace.slug}`}>Open business →</Link></article>)}</div>:<section className="panel"><h2>No businesses yet.</h2><p className="muted">Create a business when you are ready to operate a workspace. Your individual Account remains available without one.</p></section>}
   {businesses.length===0?<CreateBusinessForm/>:null}
 </SectionPage>;
}