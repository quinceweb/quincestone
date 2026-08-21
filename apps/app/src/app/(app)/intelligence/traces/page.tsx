export default function TracesPage() {
  return <section className="page-section">
    <div className="eyebrow">Intelligence</div>
    <h1>Traces</h1>
    <p className="lede">Governed execution traces provide the audit trail for how Edge understood, qualified, routed and acted on an interaction.</p>
    <div className="panel panel-empty">
      <div className="panel-kicker">Audit trail</div>
      <h2>No traces yet</h2>
      <p className="empty">No production execution traces are available for this workspace.</p>
    </div>
  </section>;
}
