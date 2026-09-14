"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    const supabase = createClient();
    const callback = new URL("/callback", window.location.origin);
    callback.searchParams.set("next", "/reset-password");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: callback.toString() });
    if (resetError) setError("We couldn't start password recovery. Please check the email and try again.");
    else setMessage("If an account exists for that email, a secure password reset link has been sent.");
    setBusy(false);
  }

  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>Reset your password</h1><p>Enter your account email and we’ll send a secure recovery link.</p><form onSubmit={submit}><label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>{error ? <p className="form-error" role="alert">{error}</p> : null}{message ? <p className="form-message" role="status">{message}</p> : null}<button className="primary-button" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button></form><p className="auth-foot"><Link href="/sign-in">Back to sign in</Link></p></section></main>;
}
