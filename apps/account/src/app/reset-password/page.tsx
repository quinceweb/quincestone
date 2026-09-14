"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm_password") ?? "");
    if (password !== confirm) { setError("Passwords do not match."); setBusy(false); return; }
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) setError("We couldn't update your password. Please request a new recovery link and try again.");
    else setMessage("Password updated. You can continue to your Account.");
    setBusy(false);
  }

  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>Choose a new password</h1><p>Set a new password for your Quincestone identity.</p><form onSubmit={submit}><label>New password<input required name="password" type="password" minLength={8} autoComplete="new-password" /></label><label>Confirm password<input required name="confirm_password" type="password" minLength={8} autoComplete="new-password" /></label>{error ? <p className="form-error" role="alert">{error}</p> : null}{message ? <p className="form-message" role="status">{message}</p> : null}<button className="primary-button" disabled={busy}>{busy ? "Updating…" : "Update password"}</button></form><p className="auth-foot"><Link href="/">Continue to Account</Link></p></section></main>;
}
