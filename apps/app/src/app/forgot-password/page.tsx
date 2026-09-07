"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("If an account exists for that email, a secure password reset link has been sent.");
    }
    setBusy(false);
  }

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="brand">QUINCESTONE</div>
        <h1 style={{ fontSize: 30 }}>Reset your password</h1>
        <p className="lede">Enter your work email and we&apos;ll send a secure password reset link.</p>
        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
          <label htmlFor="email">Work email<input id="email" required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          {error ? <p role="alert" className="empty">{error}</p> : null}
          {message ? <p role="status" className="empty">{message}</p> : null}
          <button disabled={busy} type="submit">{busy ? "Sending…" : "Send reset link"}</button>
        </form>
      </section>
    </main>
  );
}
