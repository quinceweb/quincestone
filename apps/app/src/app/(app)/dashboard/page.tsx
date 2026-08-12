export default function DashboardPage() {
  return <>
    <div className="eyebrow">Command Center</div>
    <h1>Operational intelligence</h1>
    <p className="lede">Operate Quincestone from one governed control plane. Production state appears here only when real workspace data exists.</p>
    <div className="grid">
      <section className="panel"><h2>Intelligence</h2><p className="empty">No production activity yet.</p></section>
      <section className="panel"><h2>Escalations</h2><p className="empty">No escalation cases.</p></section>
      <section className="panel"><h2>Workflows</h2><p className="empty">No workflows configured.</p></section>
      <section className="panel"><h2>Integrations</h2><p className="empty">Integration health will appear when providers are connected.</p></section>
    </div>
  </>;
}
