"use client";

import Link from "next/link";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { callbackErrorMessage, parseReturnDestination, parseSafeAccountPath, returnDestinationUrl } from "@/lib/return-to";

function SignInForm() {
  const params = useSearchParams();
  const returnTo = useMemo(() => parseReturnDestination(params.get("return_to")), [params]);
  const nextPath = useMemo(() => parseSafeAccountPath(params.get("next")), [params]);
  const callbackError = useMemo(() => callbackErrorMessage(params.get("error")), [params]);
  const [error, setError] = useState(callbackError);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email: String(data.get("email") ?? "").trim(), password: String(data.get("password") ?? "") });
    if (authError) { setError(authError.message); setBusy(false); return; }
    window.location.assign(nextPath ?? returnDestinationUrl(returnTo));
  }

  const signUpParams = new URLSearchParams({ return_to: returnTo });
  if (nextPath) signUpParams.set("next", nextPath);

  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>Sign in</h1><p>Access your purchases, saved products, settings, and support.</p><form onSubmit={submit}><label>Email<input required name="email" type="email" autoComplete="email" /></label><label>Password<input required name="password" type="password" autoComplete="current-password" /></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<button className="primary-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form><p className="auth-foot"><Link href="/forgot-password">Forgot password?</Link></p><p className="auth-foot">New to Quincestone? <Link href={`/sign-up?${signUpParams.toString()}`}>Create an account</Link></p><a className="text-link" href="https://shop.quincestone.com">Continue shopping ↗</a></section></main>;
}

export default function SignInPage() {
  return <Suspense fallback={<main className="auth-page"><section className="auth-card" aria-busy="true"><p className="eyebrow">QUINCESTONE ACCOUNT</p><h1>Sign in</h1><p>Preparing secure sign in…</p></section></main>}><SignInForm /></Suspense>;
}
