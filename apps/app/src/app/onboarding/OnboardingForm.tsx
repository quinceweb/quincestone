"use client";

import { FormEvent, useState } from "react";

export default function OnboardingForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
    <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
      <label htmlFor="workspace-name">
        Workspace name
        <input id="workspace-name" name="name" required minLength={2} maxLength={120} autoComplete="organization" autoFocus placeholder="Your business" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      {error ? <p role="alert" className="empty">{error}</p> : null}
      <button disabled={busy} type="submit">{busy ? "Creating workspace…" : "Create workspace"}</button>
    </form>
  );
}
