import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeAuthenticatedNext } from "@/lib/auth-return";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeAuthenticatedNext(url.searchParams.get("next"));
  if (!code) return NextResponse.redirect(new URL(`/sign-in?error=missing_callback_code&next=${encodeURIComponent(next)}`, request.url));
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL(`/sign-in?error=callback_failed&next=${encodeURIComponent(next)}`, request.url));
  return NextResponse.redirect(new URL(next, request.url));
}