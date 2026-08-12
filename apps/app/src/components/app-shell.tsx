import Link from "next/link";

const sections = [
  ["Command Center", "/dashboard"],
  ["Intelligence", "/intelligence/interactions"],
  ["Traces", "/intelligence/traces"],
  ["Knowledge", "/knowledge"],
  ["Policies", "/policies"],
  ["Workflows", "/workflows"],
  ["Escalations", "/escalations"],
  ["Integrations", "/integrations"],
  ["Settings", "/settings"],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand">QUINCESTONE</div>
      <nav className="nav">
        {sections.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
    </aside>
    <main className="main"><div className="content">{children}</div></main>
  </div>;
}
