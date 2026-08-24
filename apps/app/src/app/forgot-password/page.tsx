"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your work email address.");
      setBusy(false);
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (resetError) {
      setError("We couldn't start password recovery. Please try again.");
    } else {
      setMessage("If an account matches that email, you'll receive a secure password reset link shortly.");
    }
    setBusy(false);
  }

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="brand">QUINCESTONE</div>
        <h1 style={{ fontSize: 30 }}>Reset your password</h1>
        <p className="lede">Enter your work email and we'll send a secure password reset link.</p>
        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
          <label htmlFor="email">Work email<input id="email" required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          {error ? <p role="alert" className="empty">{error}</p> : null}
          {message ? <p role="status" className="empty">{message}</p> : null}
          <button disabled={busy} type="submit">{busy ? "Sending…" : "Send reset link"}</button>
        </form>
        <p style={{ marginTop: 18, fontSize: 14 }}><Link href="/sign-in">Back to sign in</Link></p>
      </section>
    </main>
  );
}
