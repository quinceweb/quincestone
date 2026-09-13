import Link from "next/link";
import { requirePlatformRole } from "@/lib/platform-authority";
import { createClient } from "@/lib/assessment";
import { decideProposal } from "./actions";

export const dynamic = "force-dynamic";

type Proposal = {
  id: string;
  assessment_request_id: string;
  workspace_id: string | null;
  status: string;
  policy_status: string;
  policy_version: string;
  title: string;
  summary: string;
  priority: string;
  proposed_action: Record<string, unknown>;
  created_at: string;
};

export default async function ProposalsPage() {
  try { await requirePlatformRole("operator"); }
  catch { return <main className="main"><div className="content"><div className="eyebrow">GOVERNED IMPLEMENTATION</div><h1>Implementation proposals.</h1><p className="lede">Operator authority is required.</p></div></main>; }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("implementation_proposals")
    .select("id,assessment_request_id,workspace_id,status,policy_status,policy_version,title,summary,priority,proposed_action,created_at")
    .order("created_at", { ascending: false });
  const proposals = (data || []) as Proposal[];

  return <main className="main"><div className="content">
    <div className="header"><div><div className="eyebrow">GOVERNED IMPLEMENTATION</div><h1>Implementation proposals.</h1><p className="lede">An approved Edge assessment becomes a proposed operating change. Policy constrains it; a second human decision authorizes it. Nothing here executes a provider side effect.</p></div><Link className="text-link" href="/assessments">← Assessment review</Link></div>
    {error ? <section className="section"><h2>Proposal queue unavailable</h2><p className="lede">{error.message}</p></section> : <section className="section">
      <div className="section-heading"><div><div className="eyebrow">PROPOSAL QUEUE</div><h2>{proposals.length} governed proposals</h2></div></div>
      {proposals.length === 0 ? <p className="lede">Approve an Edge assessment to create the first proposal.</p> : <div className="commerce-product-list">{proposals.map((proposal) => <article className="commerce-product-row" key={proposal.id}><div><span className="product-collection">{proposal.priority.toUpperCase()} · {proposal.status} · Policy: {proposal.policy_status}</span><h3>{proposal.title}</h3><p>{proposal.summary}</p><p><strong>Action:</strong> {String(proposal.proposed_action.actionType || "governed proposal")} · <strong>Policy:</strong> {proposal.policy_version}</p><p><strong>Workspace:</strong> {proposal.workspace_id || "Not bound yet"}</p></div><div className="product-lifecycle">{proposal.status === "proposed" ? <form action={decideProposal}><input type="hidden" name="proposal_id" value={proposal.id} /><input name="workspace_id" placeholder="Workspace ID (optional)" /><textarea name="reason" placeholder="Decision note" rows={3} /><div className="assessment-actions"><button className="text-button" name="decision" value="rejected" type="submit">Reject</button><button className="button" name="decision" value="approved" type="submit">Authorize →</button></div></form> : <small>Decision recorded</small>}</div></article>)}</div>}
    </section>}
  </div></main>;
}
