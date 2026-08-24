"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

function friendlyAuthError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "The email or password is incorrect.";
  if (normalized.includes("email not confirmed")) return "Confirm your email address before signing in.";
  return "We couldn't sign you in. Check your details and try again.";
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) window.location.assign("/");
    });
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(friendlyAuthError(signInError.message));
      setBusy(false);
      return;
    }

    window.location.assign("/");
  }

  return (
    <main className="auth">
      <section className="auth-card">
        <div className="brand">QUINCESTONE</div>
        <h1 style={{ fontSize: 30 }}>Welcome back</h1>
        <p className="lede">Sign in to your Quincestone business workspace.</p>
        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
          <label htmlFor="email">Work email<input id="email" required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label htmlFor="password">Password<input id="password" required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error && <p role="alert" className="empty">{error}</p>}
          <button disabled={busy} type="submit">{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 18, fontSize: 14 }}>
          <Link href="/forgot-password">Forgot password?</Link>
          <span>New to Quincestone? <Link href="/sign-up">Create account</Link></span>
        </div>
      </section>
    </main>
  );
}
