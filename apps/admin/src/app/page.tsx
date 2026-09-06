export default function AdminHome() {
  const configured = process.env.QUINCESTONE_PLATFORM_ADMIN_AUTHORITY === "enabled";

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <div className="brand">QUINCESTONE</div>
          <div className="brand-subtitle">Control plane</div>
        </div>
        <nav className="nav" aria-label="Control plane navigation">
          <p className="nav-label">Platform</p>
          <a href="#overview">Overview</a>
          <a href="#tenancy">Organizations</a>
          <a href="#access">Access</a>
          <a href="#operations">Operations</a>
          <a href="#audit">Audit</a>
        </nav>
        <div className="sidebar-foot">
          <span>Internal surface</span>
          <span>Authority {configured ? "configured" : "required"}</span>
        </div>
      </aside>
      <main className="main">
        <div className="content" id="overview">
          <div className="header">
            <div>
              <div className="eyebrow">P18 · Platform administration</div>
              <h1>Control plane boundary</h1>
              <p className="lede">
                The Quincestone admin application is established as a separate platform surface.
                Privileged data and actions remain unavailable until an independent administrator
                authority is configured and verified server-side.
              </p>
            </div>
            <div className="status" aria-label="Authority status">
              <div className="status-label">Authority</div>
              <div className="status-value">{configured ? "Configured · verification required" : "Not configured"}</div>
            </div>
          </div>
          <div className="notice">
            <strong>Safe by default</strong>
            Workspace membership is not treated as platform administration. This app contains no
            client-side bypass, seeded administrator, or service-role credential.
          </div>
          <div className="grid">
            <section className="section" id="tenancy"><h2>Organizations & tenants</h2><p>Platform-level visibility and lifecycle management for customer organizations.</p><ul><li>Organization inventory</li><li>Workspace lifecycle</li><li>Tenant state</li></ul></section>
            <section className="section" id="access"><h2>Users & access</h2><p>Independent platform access governance, separate from workspace roles.</p><ul><li>Administrator identities</li><li>Access review</li><li>Suspension boundaries</li></ul></section>
            <section className="section" id="operations"><h2>System operations</h2><p>Operational health and provider state without exposing customer secrets.</p><ul><li>Runtime health</li><li>Provider status</li><li>Incident handoff</li></ul></section>
            <section className="section" id="audit"><h2>Audit & governance</h2><p>Durable records for privileged actions and platform-level decisions.</p><ul><li>Administrative audit trail</li><li>Approval boundaries</li><li>Security events</li></ul></section>
          </div>
        </div>
      </main>
    </div>
  );
}
