"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const commands = [
  ["Command Center", "/dashboard", "Operate"],
  ["Interactions", "/intelligence/interactions", "Operate"],
  ["Traces", "/intelligence/traces", "Operate"],
  ["Escalations", "/escalations", "Operate"],
  ["Knowledge", "/knowledge", "Govern"],
  ["Policies", "/policies", "Govern"],
  ["Workflows", "/workflows", "Govern"],
  ["Integrations", "/integrations", "Platform"],
  ["Settings", "/settings", "Platform"],
] as const;

export function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter(([label, href, group]) =>
      `${label} ${href} ${group}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <button className="command-trigger" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <span>Search the operating system</span>
        <kbd>⌘ K</kbd>
      </button>
      {open ? (
        <div className="command-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section className="command-dialog" role="dialog" aria-modal="true" aria-label="Universal command search" onMouseDown={(event) => event.stopPropagation()}>
            <div className="command-input-wrap">
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Go to a surface…" aria-label="Search application surfaces" />
              <kbd>ESC</kbd>
            </div>
            <div className="command-results" role="listbox" aria-label="Application surfaces">
              {filtered.length ? filtered.map(([label, href, group]) => (
                <button key={href} type="button" className="command-result" onClick={() => go(href)}>
                  <span><strong>{label}</strong><small>{group}</small></span>
                  <span aria-hidden="true">→</span>
                </button>
              )) : <p className="command-empty">No matching surface.</p>}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
