import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/intelligence") || pathname.startsWith("/knowledge") || pathname.startsWith("/policies") || pathname.startsWith("/workflows") || pathname.startsWith("/escalations") || pathname.startsWith("/integrations") || pathname.startsWith("/settings")) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
