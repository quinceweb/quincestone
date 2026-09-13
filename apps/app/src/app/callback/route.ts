import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceMembership } from "@/lib/workspaces";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (!code) return NextResponse.redirect(new URL("/sign-in?error=missing_callback_code", request.url));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/sign-in?error=callback_failed", request.url));

  const membership = await getCurrentWorkspaceMembership();
  const destination = membership ? next : "/onboarding";
  return NextResponse.redirect(new URL(destination, request.url));
}
