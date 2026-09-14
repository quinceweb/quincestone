"use client";

import Link from "next/link";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { parseReturnDestination, returnDestinationUrl } from "@/lib/return-to";

function SignUpForm() {
  const params = useSearchParams();
  const returnTo = useMemo(() => parseReturnDestination(params.get("return_to")), [params]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const data = new FormData(event.currentTarget);
    const supabase = createClient();
    const origin = window.location.origin;
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
      options: { emailRedirectTo: `${origin}/callback?return_to=${returnTo}`, data: { first_name: String(data.get("first_name") ?? "").trim(), last_name: String(data.get("last_name") ?? "").trim() } },
    });
    if (error) { setMessage(error.message); setBusy(false); return; }
    if (signUpData.session) window.location.assign(returnDestinationUrl(returnTo)); else { setMessage("Check your email to verify your account."); setBusy(false); }
  }

  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>Create your account</h1><p>One identity for your individual Quincestone relationship.</p><form onSubmit={submit}><div className="field-row"><label>First name<input name="first_name" autoComplete="given-name" /></label><label>Last name<input name="last_name" autoComplete="family-name" /></label></div><label>Email<input required name="email" type="email" autoComplete="email" /></label><label>Password<input required name="password" type="password" minLength={8} autoComplete="new-password" /></label>{message ? <p className="form-message" role="status">{message}</p> : null}<button className="primary-button" disabled={busy}>{busy ? "Creating…" : "Create account"}</button></form><p className="auth-foot">Already have an account? <Link href={`/sign-in?return_to=${returnTo}`}>Sign in</Link></p></section></main>;
}

export default function SignUpPage() {
  return <Suspense fallback={<main className="auth-page"><section className="auth-card" aria-busy="true"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>Create your account</h1><p>Preparing secure registration…</p></section></main>}><SignUpForm /></Suspense>;
}
