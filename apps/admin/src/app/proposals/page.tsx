import Link from "next/link";
import { requirePlatformRole } from "@/lib/platform-authority";
import { createServerSupabaseClient } from "@/lib/supabase-server";
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
  evidence: Record<string, unknown>;
  created_at: string;
};

export default async function ProposalsPage() {
  try {
    await requirePlatformRole("operator");
  } catch {
    return <main className="admin-shell"><section className="admin-card"><h1>Implementation proposals</h1><p>Operator authority is required.</p></section></main>;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("implementation_proposals")
    .select("id,assessment_request_id,workspace_id,status,policy_status,policy_version,title,summary,priority,proposed_action,evidence,created_at")
    .order("created_at", { ascending: false });

  const proposals = (data || []) as Proposal[];

  return (
    <main className="admin-shell">
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">GOVERNED IMPLEMENTATION</p>
          <h1>Implementation proposals</h1>
          <p>Approved assessments become proposed operating changes. Nothing here executes a provider side effect.</p>
        </div>
        <Link className="admin-link" href="/assessments">← Assessment review</Link>
      </header>

      {error ? <section className="admin-card"><p>Unable to load proposals.</p></section> : null}

      <section className="admin-grid">
        {proposals.map((proposal) => (
          <article className="admin-card" key={proposal.id}>
            <div className="admin-card-topline">
              <span className="admin-pill">{proposal.status.replaceAll("_", " ")}</span>
              <span className="admin-pill">{proposal.priority.toUpperCase()}</span>
              <span className="admin-pill">Policy: {proposal.policy_status}</span>
            </div>
            <h2>{proposal.title}</h2>
            <p>{proposal.summary}</p>
            <dl className="admin-details">
              <div><dt>Assessment</dt><dd>{proposal.assessment_request_id}</dd></div>
              <div><dt>Policy version</dt><dd>{proposal.policy_version}</dd></div>
              <div><dt>Workspace</dt><dd>{proposal.workspace_id || "Not bound yet"}</dd></div>
              <div><dt>Action</dt><dd>{String(proposal.proposed_action.actionType || "governed proposal")}</dd></div>
            </dl>

            {proposal.status === "proposed" ? (
              <form action={decideProposal} className="admin-review-form">
                <input type="hidden" name="proposal_id" value={proposal.id} />
                <label>Workspace ID (required before implementation authorization)<input name="workspace_id" placeholder="Optional until workspace is provisioned" /></label>
                <label>Decision note<textarea name="reason" placeholder="Why is this implementation path authorized or rejected?" /></label>
                <div className="admin-actions">
                  <button name="decision" value="rejected" type="submit" className="admin-button secondary">Reject</button>
                  <button name="decision" value="approved" type="submit" className="admin-button">Authorize proposal</button>
                </div>
              </form>
            ) : null}
          </article>
        ))}
      </section>

      {!proposals.length && !error ? <section className="admin-card"><h2>No proposals yet</h2><p>Approve an Edge assessment to create the first governed implementation proposal.</p></section> : null}
    </main>
  );
}
