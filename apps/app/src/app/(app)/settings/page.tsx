export default function SettingsPage() {
  return <section className="page-section">
    <div className="eyebrow">Workspace</div>
    <h1>Settings</h1>
    <p className="lede">Workspace identity, access, operational preferences and provider configuration belong here.</p>
    <div className="panel panel-empty">
      <div className="panel-kicker">Workspace configuration</div>
      <h2>Workspace foundation is not configured</h2>
      <p className="empty">Tenant-aware settings will become editable after the workspace membership foundation is established.</p>
    </div>
  </section>;
}
