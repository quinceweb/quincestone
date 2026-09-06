import { NextRequest, NextResponse } from "next/server";
import { recordPlatformAudit, requirePlatformRole } from "@/lib/platform-authority";

export async function POST(request: NextRequest) {
  try {
    await requirePlatformRole("admin");
    const body = await request.json();
    const action = typeof body.action === "string" ? body.action : "";
    const resourceType = typeof body.resourceType === "string" ? body.resourceType : "";
    const resourceId = typeof body.resourceId === "string" ? body.resourceId : null;
    const metadata = body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata) ? body.metadata : {};

    if (!action || action.length > 120 || !resourceType || resourceType.length > 80) {
      return NextResponse.json({ ok: false, error: "invalid_audit_event" }, { status: 400 });
    }

    const id = await recordPlatformAudit({ action, resourceType, resourceId, metadata });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Forbidden";
    const status = message === "Unauthenticated" ? 401 : 403;
    return NextResponse.json({ ok: false, error: status === 401 ? "unauthenticated" : "forbidden" }, { status });
  }
}
