"use client";

import Link from "next/link";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { parseReturnDestination, parseSafeAccountPath, returnDestinationUrl } from "@/lib/return-to";

function friendlyAuthError(message: string) {
  const value = message.toLowerCase();
  if (value.includes("rate limit") || value.includes("too many")) return "Too many attempts. Please wait before trying again.";
  if (value.includes("password")) return "Check your password and try again. Use at least 8 characters.";
  if (value.includes("email")) return "Check your email address and try again.";
  return "We couldn't complete this request. Please try again.";
}

function SignUpForm() {
  const params = useSearchParams();
  const returnTo = useMemo(() => parseReturnDestination(params.get("return_to")), [params]);
  const nextPath = useMemo(() => parseSafeAccountPath(params.get("continue") ?? params.get("next")), [params]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmationPending, setConfirmationPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirm_password") ?? "");
    if (password !== confirmPassword) { setMessage("Passwords do not match."); setBusy(false); return; }
    if (password.length < 8) { setMessage("Use at least 8 characters for your password."); setBusy(false); return; }
    const supabase = createClient();
    const origin = window.location.origin;
    const callback = new URL(`${origin}/callback`);
    callback.searchParams.set("return_to", returnTo);
    if (nextPath) callback.searchParams.set("continue", nextPath);
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: callback.toString(), data: { first_name: String(data.get("first_name") ?? "").trim(), last_name: String(data.get("last_name") ?? "").trim() } },
    });
    if (error) { setMessage(friendlyAuthError(error.message)); setBusy(false); return; }
    if (signUpData.session) window.location.assign(returnDestinationUrl(returnTo, nextPath)); else { setConfirmationPending(true); setMessage("Account created. Check your inbox for a verification link before signing in."); setBusy(false); }
  }

  async function resendConfirmation() {
    const email = (document.querySelector<HTMLInputElement>('input[name="email"]')?.value ?? "").trim().toLowerCase();
    if (!email) { setMessage("Enter your email address to resend confirmation."); return; }
    setBusy(true); setMessage("");
    const callback = new URL(`${window.location.origin}/callback`);
    callback.searchParams.set("return_to", returnTo);
    if (nextPath) callback.searchParams.set("continue", nextPath);
    const { error } = await createClient().auth.resend({ type: "signup", email, options: { emailRedirectTo: callback.toString() } });
    setMessage(error ? friendlyAuthError(error.message) : "If confirmation is available for this address, a new email has been requested. Check your inbox and spam folder.");
    setBusy(false);
  }

  const signInParams = new URLSearchParams({ return_to: returnTo });
  if (nextPath) signInParams.set("continue", nextPath);

  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>Create your account</h1><p>One identity for your individual Quincestone relationship.</p><form onSubmit={submit}><div className="field-row"><label>First name<input name="first_name" autoComplete="given-name" /></label><label>Last name<input name="last_name" autoComplete="family-name" /></label></div><label>Email<input required name="email" type="email" autoComplete="email" /></label><label>Password<input required name="password" type="password" minLength={8} autoComplete="new-password" /></label><label>Confirm password<input required name="confirm_password" type="password" minLength={8} autoComplete="new-password" /></label>{message ? <p className="form-message" role="status">{message}</p> : null}<button className="primary-button" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>{confirmationPending ? <button className="primary-button" type="button" disabled={busy} onClick={resendConfirmation}>Resend confirmation email</button> : null}</form><p className="auth-foot">Already have an account? <Link href={`/sign-in?${signInParams.toString()}`}>Sign in</Link></p></section></main>;
}

export default function SignUpPage() {
  return <Suspense fallback={<main className="auth-page"><section className="auth-card" aria-busy="true"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>Create your account</h1><p>Preparing secure registration…</p></section></main>}><SignUpForm /></Suspense>;
}
