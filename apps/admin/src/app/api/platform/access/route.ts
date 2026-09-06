import { NextResponse } from "next/server";
import { requirePlatformRole } from "@/lib/platform-authority";

export async function GET() {
  try {
    const authority = await requirePlatformRole("admin");
    return NextResponse.json({
      ok: true,
      authority: "platform-admin",
      userId: authority.user.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Forbidden";
    const status = message === "Unauthenticated" ? 401 : 403;
    return NextResponse.json({ ok: false, error: status === 401 ? "unauthenticated" : "forbidden" }, { status });
  }
}
