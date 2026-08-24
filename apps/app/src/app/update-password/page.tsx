"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session));
      if (!data.session) setError("This password reset link is invalid or has expired.");
    });
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("We couldn't update your password. Request a new reset link and try again.");
      setBusy(false);
      return;
    }

    await supabase.auth.signOut();
    setMessage("Your password has been updated. Sign in with your new password to continue.");
    setPassword("");
    setConfirmPassword("");
    setBusy(false);
  }

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="brand">QUINCESTONE</div>
        <h1 style={{ fontSize: 30 }}>Choose a new password</h1>
        <p className="lede">Set a new password for your Quincestone business account.</p>
        {ready ? (
          <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
            <label htmlFor="password">New password<input id="password" required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            <label htmlFor="confirm-password">Confirm password<input id="confirm-password" required minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>
            {error ? <p role="alert" className="empty">{error}</p> : null}
            {message ? <p role="status" className="empty">{message}</p> : null}
            <button disabled={busy} type="submit">{busy ? "Updating…" : "Update password"}</button>
          </form>
        ) : (
          <p role="alert" className="empty" style={{ marginTop: 24 }}>{error ?? "Checking your reset link…"}</p>
        )}
        {message ? <p style={{ marginTop: 18, fontSize: 14 }}><Link href="/sign-in">Return to sign in</Link></p> : null}
      </section>
    </main>
  );
}
