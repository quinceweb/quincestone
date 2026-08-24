"use client";

import { FormEvent, useState } from "react";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const response = await fetch("/api/onboarding/workspace", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
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
        <p className="lede">Your workspace is the tenant boundary for Quincestone operations, intelligence, workflows and integrations.</p>
        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
          <label>
            Workspace name
            <input name="name" required minLength={2} maxLength={120} autoFocus placeholder="Your business" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          {error ? <p role="alert" className="empty">{error}</p> : null}
          <button disabled={busy} type="submit">{busy ? "Creating workspace…" : "Create workspace"}</button>
        </form>
      </section>
    </main>
  );
}
