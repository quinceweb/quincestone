import { useMemo, useState } from "react";

type RecordItem = { id: string; name: string; intent: string; urgency: string; workflow: string; review: string; status: string; source: string };
const fixtures: RecordItem[] = [
  { id: "QN-1048", name: "Jordan Lee", intent: "Emergency repair", urgency: "Critical", workflow: "Emergency Triage", review: "Required", status: "New", source: "Visitor experience" },
  { id: "QN-1044", name: "Morgan Ellis", intent: "Roof replacement", urgency: "Planned", workflow: "Estimate", review: "Clear", status: "Qualified", source: "Website intake" },
  { id: "QN-1039", name: "Sam Rivera", intent: "Storm inspection", urgency: "High", workflow: "Inspection", review: "Required", status: "Scheduled", source: "Website intake" },
  { id: "QN-1035", name: "Casey Brown", intent: "Maintenance", urgency: "Routine", workflow: "Service request", review: "Clear", status: "Routed", source: "AI concierge" },
];

export function DemoOperations() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(fixtures[0]);
  const [records, setRecords] = useState(fixtures);
  const visible = useMemo(() => records.filter((item) => Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase())), [query, records]);
  return (
    <section className="operations">
      <div className="demo-notice"><strong>Demonstration data only.</strong> Northstone Roofing is fictional. No real appointment, payment, subscription, customer, or production record is represented here.</div>
      <div className="demo-head"><div><p className="eyebrow">NORTHSTONE ROOFING / OPERATIONS</p><h1>A fictional control desk for every decision.</h1><p className="lede">Inspect the classification, routing logic, knowledge references, and human-review boundary behind each demonstration interaction.</p></div><button className="button secondary" onClick={() => { setRecords(fixtures); setSelected(fixtures[0]); setQuery(""); }}>Reset fictional data</button></div>
      <div className="ops-metrics"><div><span>VISIBLE RECORDS</span><strong>{visible.length}</strong></div><div><span>HUMAN REVIEW</span><strong>{records.filter((r) => r.review === "Required").length}</strong></div><div><span>ACTIVE QUEUE</span><strong>{records.filter((r) => r.status === "New" || r.status === "In review").length}</strong></div><div><span>ENVIRONMENT</span><strong>DEMO</strong></div></div>
      <div className="filters"><input aria-label="Search records" placeholder="Search intent, record, workflow…" value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Urgency filter"><option>Urgency: All</option></select><select aria-label="Workflow filter"><option>Workflow: All</option></select><select aria-label="Review filter"><option>Human review: All</option></select><select aria-label="Status filter"><option>Status: All</option></select></div>
      <div className="operations-grid">
        <div className="record-list"><div className="list-heading"><span>INTERACTION</span><span>URGENCY</span></div>{visible.map((item) => <button key={item.id} onClick={() => setSelected(item)} className={selected.id === item.id ? "active" : ""}><span><strong>{item.name}</strong><small>{item.id} · {item.intent}</small></span><em>{item.urgency}</em></button>)}{visible.length === 0 && <p className="empty-state">No fictional records match that search.</p>}</div>
        <aside className="drawer">
          <div className="drawer-head"><div><p className="eyebrow">INTERACTION {selected.id}</p><h2>{selected.name}</h2></div><span className="status-pill">{selected.status}</span></div>
          <p className="drawer-intro">Fictional operational record generated for the public demonstration.</p>
          <dl><div><dt>Classification</dt><dd>{selected.intent} / {selected.urgency}</dd></div><div><dt>Workflow</dt><dd>{selected.workflow}</dd></div><div><dt>Human review</dt><dd>{selected.review}</dd></div><div><dt>Source</dt><dd>{selected.source}</dd></div></dl>
          <div className="drawer-section"><h3>Why this route?</h3><p>Signals were derived from the visitor's selected answers and the fictional policy set. Simulated AI language is advisory; deterministic policy controls routing.</p></div>
          <div className="drawer-section"><h3>Knowledge references</h3><ul><li>Emergency intake policy v2.1</li><li>Fictional service-area map</li><li>Safe-response boundary</li><li>Human escalation policy</li></ul></div>
          <div className="drawer-section"><h3>Activity timeline</h3><ol><li>Intent classified</li><li>Context structured</li><li>Policy evaluated</li><li>Human review assessed</li><li>Workflow selected</li></ol></div>
          <div className="drawer-actions"><button className="button" onClick={() => setRecords((items) => items.map((item) => item.id === selected.id ? { ...item, status: "In review" } : item))}>Advance simulated workflow</button><span>Demo state only · resets on refresh</span></div>
        </aside>
      </div>
    </section>
  );
}
