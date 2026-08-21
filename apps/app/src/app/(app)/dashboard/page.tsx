const operatingStages = [
  ["Demand", "Incoming customer intent"],
  ["Intelligence", "Understand, qualify and govern"],
  ["Operations", "Route authorized next steps"],
  ["Outcome", "Record what actually happened"],
] as const;

export default function DashboardPage() {
  return (
    <section className="page-section">
      <div className="eyebrow">Command Center</div>
      <h1>Operate the front door.</h1>
      <p className="lede">Quincestone turns customer interactions into governed business outcomes. This console will become the operating view for demand, intelligence, workflows and human decisions.</p>

      <div className="grid">
        {operatingStages.map(([title, description]) => (
          <section className="panel" key={title}>
            <div className="panel-kicker">{title}</div>
            <h2>{description}</h2>
            <p className="empty">No production activity is available for this workspace yet.</p>
          </section>
        ))}
      </div>

      <section className="panel panel-empty">
        <div className="panel-kicker">System boundary</div>
        <h2>Truthful by default</h2>
        <p className="empty">Operational metrics, provider health and execution history will only appear when real workspace data exists and the current user is authorized to see it.</p>
      </section>
    </section>
  );
}
