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
      <section className="auth-frame">
        <aside className="auth-aside">
          <div className="auth-aside-top">
            <div className="brand">QUINCESTONE</div>
            <span className="auth-aside-label">Business platform</span>
          </div>
          <div className="auth-aside-copy">
            <span className="auth-index">01 / ACCESS</span>
            <h2>Build with<br />clarity.</h2>
            <p>One operating environment for turning demand into disciplined product decisions and execution.</p>
          </div>
          <div className="auth-aside-foot"><span>QUINCESTONE</span><span>PRIVATE WORKSPACE</span></div>
        </aside>

        <div className="auth-panel">
          <div className="auth-mobile-brand brand">QUINCESTONE</div>
          <div className="auth-heading">
            <span className="eyebrow">Workspace access</span>
            <h1>Welcome back</h1>
            <p className="lede">Sign in to continue to your Quincestone business workspace.</p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            <label className="field" htmlFor="email">
              <span>Work email</span>
              <input id="email" required type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="field" htmlFor="password">
              <span>Password</span>
              <input id="password" required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <p role="alert" className="auth-message auth-error">{error}</p>}
            <button className="auth-submit" disabled={busy} type="submit">{busy ? "Signing in…" : "Sign in"}<span aria-hidden="true">→</span></button>
          </form>

          <div className="auth-links">
            <Link href="/forgot-password">Forgot password?</Link>
            <span>New to Quincestone? <Link href="/sign-up">Create account</Link></span>
          </div>
        </div>
      </section>
    </main>
  );
}
