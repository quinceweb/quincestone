import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { returnDestinationUrl } from "@/lib/return-to";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const returnTo = request.nextUrl.searchParams.get("return_to");
  if (!code) return NextResponse.redirect(new URL("/sign-in?error=missing_callback_code", request.url));
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/sign-in?error=callback_failed", request.url));
  return NextResponse.redirect(returnDestinationUrl(returnTo));
}
