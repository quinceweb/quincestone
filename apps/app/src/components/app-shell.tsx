import Link from "next/link";
import { CommandSearch } from "@/components/command-search";

const groups = [
  { label: "Operate", items: [["Command Center", "/dashboard"], ["Edge", "/edge"], ["Interactions", "/intelligence/interactions"], ["Traces", "/intelligence/traces"], ["Escalations", "/escalations"]] },
  { label: "Govern", items: [["Knowledge", "/knowledge"], ["Policies", "/policies"], ["Workflows", "/workflows"]] },
  { label: "Platform", items: [["Integrations", "/integrations"], ["Settings", "/settings"]] },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand">QUINCESTONE</div>
          <div className="brand-subtitle">Operating system</div>
        </div>
        <CommandSearch />
        <nav aria-label="Application navigation">
          {groups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-label">{group.label}</p>
              <div className="nav">
                {group.items.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
              </div>
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span>Authenticated workspace</span>
          <span>⌘ K to navigate</span>
        </div>
      </aside>
      <main className="main">
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
