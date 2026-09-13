"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

function friendlyAuthError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("password") && normalized.includes("weak")) return "Choose a stronger password and try again.";
  if (normalized.includes("invalid") && normalized.includes("email")) return "Enter a valid work email address.";
  if (normalized.includes("redirect")) return "Sign-up email delivery is not fully configured yet. The confirmation redirect must be allowed in Supabase Auth settings.";
  if (normalized.includes("rate limit") || normalized.includes("too many")) return "Too many sign-up attempts. Wait a moment and try again.";
  return "We couldn't create your account. Please try again.";
}

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmationPending, setConfirmationPending] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => { if (data.user) window.location.replace("/dashboard"); });
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(null); setMessage(null);
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return setError("Enter your work email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setBusy(true);
    const supabase = createClient();
    const emailRedirectTo = `${window.location.origin}/callback?next=${encodeURIComponent("/dashboard")}`;
    const { data, error: signUpError } = await supabase.auth.signUp({ email: normalizedEmail, password, options: { emailRedirectTo } });
    if (signUpError) { setError(friendlyAuthError(signUpError.message)); setBusy(false); return; }
    if (data.session) { window.location.replace("/dashboard"); return; }
    setConfirmationPending(true);
    setMessage("Account created. Check your email to confirm your address. Once confirmed, you'll enter your Quincestone workspace.");
    setBusy(false);
  }

  async function resendConfirmation() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return setError("Enter your work email address first.");
    setBusy(true); setError(null);
    const supabase = createClient();
    const emailRedirectTo = `${window.location.origin}/callback?next=${encodeURIComponent("/dashboard")}`;
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email: normalizedEmail, options: { emailRedirectTo } });
    if (resendError) setError(friendlyAuthError(resendError.message));
    else setMessage("A new confirmation email has been sent. Check your inbox and spam folder.");
    setBusy(false);
  }

  return (
    <main className="auth">
      <section className="auth-frame">
        <aside className="auth-aside auth-aside-signup"><div className="auth-aside-top"><div className="brand">QUINCESTONE</div><span className="auth-aside-label">Business platform</span></div><div className="auth-aside-copy"><span className="auth-index">01 / BEGIN</span><h2>Turn intent<br />into action.</h2><p>Establish your workspace, structure the work and keep every decision connected to the outcome.</p></div><div className="auth-aside-foot"><span>QUINCESTONE</span><span>PRIVATE WORKSPACE</span></div></aside>
        <div className="auth-panel">
          <div className="auth-mobile-brand brand">QUINCESTONE</div>
          <div className="auth-heading"><span className="eyebrow">Create workspace access</span><h1>Start with Quincestone</h1><p className="lede">Create your business workspace and bring demand, product and operations into one system.</p></div>
          <form className="auth-form" onSubmit={submit}>
            <label className="field" htmlFor="email"><span>Work email</span><input id="email" required type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className="field" htmlFor="password"><span>Password</span><input id="password" required type="password" minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            <label className="field" htmlFor="confirm-password"><span>Confirm password</span><input id="confirm-password" required type="password" minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>
            {error ? <p role="alert" className="auth-message auth-error">{error}</p> : null}
            {message ? <p role="status" className="auth-message auth-success">{message}</p> : null}
            <button className="auth-submit" disabled={busy} type="submit">{busy ? "Creating account…" : "Create account"}<span aria-hidden="true">→</span></button>
            {confirmationPending ? <button className="auth-secondary" disabled={busy} type="button" onClick={resendConfirmation}>Resend confirmation email</button> : null}
          </form>
          <div className="auth-links auth-links-single"><span>Already have an account? <Link href="/sign-in">Sign in</Link></span></div>
        </div>
      </section>
    </main>
  );
}
