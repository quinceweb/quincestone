"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

function friendlyAuthError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("password") && normalized.includes("weak")) return "Choose a stronger password and try again.";
  if (normalized.includes("invalid") && normalized.includes("email")) return "Enter a valid work email address.";
  return "We couldn't create your account. Please try again.";
}

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) window.location.assign("/");
    });
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your work email address.");
      return;
    }
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
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });

    if (signUpError) {
      setError(friendlyAuthError(signUpError.message));
      setBusy(false);
      return;
    }

    if (data.session) {
      window.location.assign("/");
      return;
    }

    setMessage("Account created. Check your email to confirm your account, then sign in to continue workspace setup.");
    setBusy(false);
  }

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="brand">QUINCESTONE</div>
        <h1 style={{ fontSize: 30 }}>Create your account</h1>
        <p className="lede">Start your Quincestone business workspace and turn customer demand into structured operations.</p>
        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
          <label htmlFor="email">Work email<input id="email" required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label htmlFor="password">Password<input id="password" required type="password" minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <label htmlFor="confirm-password">Confirm password<input id="confirm-password" required type="password" minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>
          {error ? <p role="alert" className="empty">{error}</p> : null}
          {message ? <p role="status" className="empty">{message}</p> : null}
          <button disabled={busy} type="submit">{busy ? "Creating account…" : "Create account"}</button>
        </form>
        <p style={{ marginTop: 18, fontSize: 14 }}>Already have an account? <Link href="/sign-in">Sign in</Link></p>
      </section>
    </main>
  );
}
