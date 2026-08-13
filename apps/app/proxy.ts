import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const protectedPath = /^(\/(dashboard|intelligence|knowledge|policies|workflows|escalations|integrations|settings))(\/|$)/.test(pathname);

  // Refresh the Supabase SSR session on every request so cookie-backed auth
  // remains valid across server-rendered routes.
  const response = await updateSession(request);
  if (!protectedPath) return response;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.redirect(new URL("/sign-in", request.url));
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
