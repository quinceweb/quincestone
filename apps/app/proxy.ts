import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedPath = /^\/(dashboard|intelligence|knowledge|policies|workflows|escalations|integrations|settings)(\/|$)/;

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  if (protectedPath.test(request.nextUrl.pathname) && !user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
