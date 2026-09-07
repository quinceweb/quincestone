"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

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
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError("We couldn't start the password reset. Check the email and try again.");
    } else {
      setMessage("If an account exists for that email, a secure password reset link has been sent.");
    }
    setBusy(false);
  }

  return (
    <main className="auth">
      <section className="auth-frame auth-frame-compact">
        <aside className="auth-aside">
          <div className="auth-aside-top">
            <div className="brand">QUINCESTONE</div>
            <span className="auth-aside-label">Business platform</span>
          </div>
          <div className="auth-aside-copy">
            <span className="auth-index">01 / RECOVER</span>
            <h2>Back to<br />the work.</h2>
            <p>Secure account recovery keeps your workspace protected without adding friction.</p>
          </div>
          <div className="auth-aside-foot"><span>QUINCESTONE</span><span>PRIVATE WORKSPACE</span></div>
        </aside>

        <div className="auth-panel">
          <div className="auth-mobile-brand brand">QUINCESTONE</div>
          <div className="auth-heading">
            <span className="eyebrow">Account recovery</span>
            <h1>Reset your password</h1>
            <p className="lede">Enter your work email and we&apos;ll send a secure password reset link.</p>
          </div>
          <form className="auth-form" onSubmit={submit}>
            <label className="field" htmlFor="email">
              <span>Work email</span>
              <input id="email" required type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {error ? <p role="alert" className="auth-message auth-error">{error}</p> : null}
            {message ? <p role="status" className="auth-message auth-success">{message}</p> : null}
            <button className="auth-submit" disabled={busy} type="submit">{busy ? "Sending…" : "Send reset link"}<span aria-hidden="true">→</span></button>
          </form>
          <div className="auth-links auth-links-single"><Link href="/sign-in">Back to sign in</Link></div>
        </div>
      </section>
    </main>
  );
}
