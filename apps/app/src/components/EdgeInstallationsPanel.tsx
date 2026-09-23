"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Installation = { id:string; name:string; public_installation_key:string; channel_type:string; status:"active"|"disabled"|"revoked"; allowed_origins:string[]; created_at:string; updated_at:string; revoked_at:string|null; last_activity_at:string|null };

export function EdgeInstallationsPanel({ assetUrl, gatewayUrl }: { assetUrl: string; gatewayUrl: string }) {
  const [items, setItems] = useState<Installation[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [name, setName] = useState("");
  const [origins, setOrigins] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const ready = Boolean(assetUrl && gatewayUrl);

  useEffect(() => { void (async () => { const response = await fetch("/api/edge/installations", { cache:"no-store" }); const body = await response.json(); if(response.ok){ setItems(body.installations); setCanManage(body.canManage); } else setNotice(body?.error?.message ?? "Installations could not be loaded."); })(); }, []);
  async function create(event: FormEvent) { event.preventDefault(); setBusy(true); setNotice(""); try { const response=await fetch("/api/edge/installations",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name,channel_type:"website",allowed_origins:origins.split(/\s+/).filter(Boolean)})}); const body=await response.json(); if(!response.ok) throw new Error(body?.error?.message ?? "Creation failed."); setItems((current)=>[body.installation,...current]); setName(""); setOrigins(""); setNotice("Installation created."); } catch(error){setNotice(error instanceof Error?error.message:"Creation failed.");} finally{setBusy(false);} }
  async function status(item: Installation, next:"active"|"disabled"|"revoked") { if(next==="revoked"&&!window.confirm("Revoke this installation permanently? New public submissions will stop.")) return; setBusy(true); setNotice(""); try{const response=await fetch(`/api/edge/installations/${item.id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({status:next})}); const body=await response.json(); if(!response.ok) throw new Error(body?.error?.message??"Update failed."); setItems((current)=>current.map((value)=>value.id===item.id?body.installation:value)); setNotice(`Installation ${next}.`);}catch(error){setNotice(error instanceof Error?error.message:"Update failed.");}finally{setBusy(false);} }
  const configured = useMemo(()=>ready?"Installation code is ready to copy.":"Set NEXT_PUBLIC_EDGE_ASSET_URL and NEXT_PUBLIC_EDGE_GATEWAY_URL before publishing installation code.",[ready]);
  function snippet(item: Installation){return `<script src="${assetUrl}" data-endpoint="${gatewayUrl}" data-installation="${item.public_installation_key}" data-business-name="YOUR BUSINESS NAME" defer></script>`;}
  return <div className="edge-installations">
    <div className="panel"><div className="panel-kicker">Authority boundary</div><h2>Website installations</h2><p className="empty">An installation identifies an approved channel inside this workspace. It does not grant workspace membership, policy authority, human-review authority or action-execution authority.</p><p className="empty">{configured}</p></div>
    {canManage?<form className="panel edge-installation-form" onSubmit={create}><div className="panel-kicker">Create installation</div><label>Name<input required minLength={2} maxLength={120} value={name} onChange={(event)=>setName(event.target.value)} placeholder="Customer website" /></label><label>Allowed origins<textarea required value={origins} onChange={(event)=>setOrigins(event.target.value)} placeholder="https://www.example.com" rows={3}/><span className="empty">One exact HTTPS origin per line. Local HTTP origins are accepted only for development.</span></label><button className="button" disabled={busy}>Create installation</button></form>:null}
    {notice?<p role="status" className="panel">{notice}</p>:null}
    <div className="edge-installation-list">{items.map((item)=><article className="panel" key={item.id}><div className="record"><div><div className="panel-kicker">{item.channel_type}</div><h2>{item.name}</h2></div><div className="record-meta">{item.status}</div></div><dl className="edge-installation-meta"><div><dt>Public installation key</dt><dd><code>{item.public_installation_key}</code></dd></div><div><dt>Allowed origins</dt><dd>{item.allowed_origins.join(", ")}</dd></div><div><dt>Last activity</dt><dd>{item.last_activity_at?new Date(item.last_activity_at).toLocaleString():"No confirmed activity"}</dd></div></dl>{ready?<><label>Installation snippet<textarea readOnly rows={4} value={snippet(item)} onFocus={(event)=>event.currentTarget.select()}/></label><button className="button secondary" type="button" onClick={()=>void navigator.clipboard.writeText(snippet(item))}>Copy snippet</button></>:null}{canManage&&item.status!=="revoked"?<div className="actions"><button className="button secondary" disabled={busy} type="button" onClick={()=>void status(item,item.status==="active"?"disabled":"active")}>{item.status==="active"?"Disable":"Enable"}</button><button className="button secondary" disabled={busy} type="button" onClick={()=>void status(item,"revoked")}>Revoke</button></div>:null}</article>)}</div>
  </div>;
}
