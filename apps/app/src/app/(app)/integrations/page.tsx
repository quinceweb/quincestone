export default function IntegrationsPage() {
  return <section className="page-section">
    <div className="eyebrow">Platform</div>
    <h1>Integrations</h1>
    <p className="lede">Connect approved business systems to the Quincestone operating layer without exposing provider credentials to the browser.</p>
    <div className="panel panel-empty">
      <div className="panel-kicker">Connected systems</div>
      <h2>No integrations connected</h2>
      <p className="empty">Provider health and connection state will appear here when integrations are configured.</p>
    </div>
  </section>;
}
