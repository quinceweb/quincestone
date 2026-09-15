import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedPath = /^\/(deals|inbox)(\/|$)/;
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  if (protectedPath.test(request.nextUrl.pathname) && !user) {
    const account = new URL("https://account.quincestone.com/sign-in");
    account.searchParams.set("next", request.url);
    return NextResponse.redirect(account);
  }
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
