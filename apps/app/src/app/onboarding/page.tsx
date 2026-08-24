"use client";

import { FormEvent, useEffect, useState } from "react";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    void fetch("/api/onboarding/status", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const payload = await response.json();
        if (active && payload.workspaceId) window.location.assign("/dashboard");
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setError("Workspace name must be at least 2 characters.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/onboarding/workspace", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error?.message ?? "The workspace could not be created.");
      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The workspace could not be created.");
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="brand">QUINCESTONE</div>
        <div className="eyebrow" style={{ marginTop: 18 }}>Workspace setup</div>
        <h1 style={{ fontSize: 30 }}>Create your workspace</h1>
        <p className="lede">Your workspace is where Quincestone organizes customer interactions, knowledge, policies, reviews and operational outcomes.</p>
        {checking ? (
          <p role="status" className="empty" style={{ marginTop: 24 }}>Checking your workspace…</p>
        ) : (
          <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
            <label htmlFor="workspace-name">
              Workspace name
              <input id="workspace-name" name="name" required minLength={2} maxLength={120} autoComplete="organization" autoFocus placeholder="Your business" value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            {error ? <p role="alert" className="empty">{error}</p> : null}
            <button disabled={busy} type="submit">{busy ? "Creating workspace…" : "Create workspace"}</button>
          </form>
        )}
      </section>
    </main>
  );
}
