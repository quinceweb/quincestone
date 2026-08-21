export function EmptySection({ title, description }: { title: string; description: string }) {
  return <>
    <div className="eyebrow">Quincestone</div>
    <h1>{title}</h1>
    <p className="lede">{description}</p>
    <section className="panel" style={{ marginTop: 28 }}>
      <p className="empty">No production data yet. This foundation intentionally shows truthful empty state rather than fabricated activity.</p>
    </section>
  </>;
}
