import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";
import { canManageEdge, normalizeAllowedOrigins } from "@/lib/edge-installations";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getCurrentWorkspace();
  if (!context) return NextResponse.json({ error: { code: "unauthorized", message: "Authentication is required." } }, { status: 401 });
  if (!canManageEdge(context.role)) return NextResponse.json({ error: { code: "forbidden", message: "Only workspace owners and admins may change installations." } }, { status: 403 });
  const { id } = await params;
  const input = await request.json().catch(() => null) as Record<string, unknown> | null;
  const update: Record<string, unknown> = {};
  if (typeof input?.name === "string") update.name = input.name.trim();
  if (input?.allowed_origins !== undefined) {
    const origins = normalizeAllowedOrigins(input.allowed_origins);
    if (!origins) return NextResponse.json({ error: { code: "invalid_origins", message: "Provide one to 25 valid HTTPS origins." } }, { status: 400 });
    update.allowed_origins = origins;
  }
  if (["active", "disabled", "revoked"].includes(String(input?.status))) update.status = input?.status;
  if (!Object.keys(update).length) return NextResponse.json({ error: { code: "invalid_update", message: "No supported changes were provided." } }, { status: 400 });
  const supabase = await createClient();
  const result = await supabase.from("edge_installations").update(update).eq("id", id).eq("workspace_id", context.workspace.id)
    .select("id, name, public_installation_key, channel_type, status, allowed_origins, configuration, created_at, updated_at, revoked_at, last_activity_at").maybeSingle();
  if (result.error || !result.data) return NextResponse.json({ error: { code: "update_failed", message: "The installation could not be updated." } }, { status: result.error ? 500 : 404 });
  return NextResponse.json({ installation: result.data });
}
