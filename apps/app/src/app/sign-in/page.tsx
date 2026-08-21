"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.assign("/dashboard");
    setBusy(false);
  }

  return <main className="auth"><section className="auth-card">
    <div className="brand">QUINCESTONE</div>
    <h1 style={{ fontSize: 30 }}>Sign in</h1>
    <p className="lede">Access the authenticated Quincestone control plane.</p>
    <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
      <label>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
      {error && <p role="alert" className="empty">{error}</p>}
      <button disabled={busy} type="submit">{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  </section></main>;
}
