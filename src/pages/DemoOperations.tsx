import { useMemo, useState } from "react";

type RecordItem = { id: string; name: string; intent: string; urgency: string; workflow: string; review: string; status: string };
const fixtures: RecordItem[] = [
  { id: "QN-1048", name: "Jordan Lee", intent: "Emergency repair", urgency: "Critical", workflow: "Emergency Triage", review: "Required", status: "New" },
  { id: "QN-1044", name: "Morgan Ellis", intent: "Roof replacement", urgency: "Planned", workflow: "Estimate", review: "Clear", status: "Qualified" },
  { id: "QN-1039", name: "Sam Rivera", intent: "Storm inspection", urgency: "High", workflow: "Inspection", review: "Required", status: "Scheduled" },
];

export function DemoOperations() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(fixtures[0]);
  const [records, setRecords] = useState(fixtures);
  const visible = useMemo(() => records.filter((item) => Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase())), [query, records]);
  return (
    <section className="operations">
      <div className="demo-notice">Northstone Roofing is a fictional company created to demonstrate Quincestone. All records are fixture data.</div>
      <div className="demo-head"><div><p className="eyebrow">OPERATIONAL VISIBILITY</p><h1>Interaction control desk</h1></div><button className="button secondary" onClick={() => { setRecords(fixtures); setSelected(fixtures[0]); }}>Reset fictional data</button></div>
      <div className="filters">
        <input aria-label="Search records" placeholder="Search intent, record, workflow…" value={query} onChange={(event) => setQuery(event.target.value)} />
        {["Intent", "Urgency", "Workflow", "Human review", "Status"].map((label) => <select key={label} aria-label={`${label} filter`}><option>{label}: All</option></select>)}
      </div>
      <div className="operations-grid">
        <div className="record-list">{visible.map((item) => <button key={item.id} onClick={() => setSelected(item)} className={selected.id === item.id ? "active" : ""}><span><strong>{item.name}</strong><small>{item.id} · {item.intent}</small></span><em>{item.urgency}</em></button>)}</div>
        <aside className="drawer">
          <p className="eyebrow">INTERACTION {selected.id}</p><h2>{selected.name}</h2>
          <dl><div><dt>Classification</dt><dd>{selected.intent} / {selected.urgency}</dd></div><div><dt>Workflow</dt><dd>{selected.workflow}</dd></div><div><dt>Human review</dt><dd>{selected.review}</dd></div><div><dt>Status</dt><dd>{selected.status}</dd></div></dl>
          <h3>Classification explanation</h3><p>Signals were derived from the visitor’s selected answers and the fictional policy set. Simulated AI language is advisory; policy controls routing.</p>
          <h3>Knowledge references</h3><ul><li>Emergency intake policy v2.1</li><li>Fictional service-area map</li><li>Safe-response boundary</li></ul>
          <h3>Activity timeline</h3><ol><li>Intent classified</li><li>Service area confirmed</li><li>Human review required</li><li>Workflow selected</li></ol>
          <button className="button" onClick={() => setRecords((items) => items.map((item) => item.id === selected.id ? { ...item, status: "In review" } : item))}>Advance simulated workflow</button>
        </aside>
      </div>
    </section>
  );
}
