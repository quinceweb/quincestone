import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";
import { canManageEdge, normalizeAllowedOrigins } from "@/lib/edge-installations";

export async function GET() {
  const context = await getCurrentWorkspace();
  if (!context) return NextResponse.json({ error: { code: "unauthorized", message: "Authentication is required." } }, { status: 401 });
  const supabase = await createClient();
  const result = await supabase.from("edge_installations")
    .select("id, name, public_installation_key, channel_type, status, allowed_origins, configuration, created_at, updated_at, revoked_at, last_activity_at")
    .eq("workspace_id", context.workspace.id).order("created_at", { ascending: false });
  if (result.error) return NextResponse.json({ error: { code: "read_failed", message: "Installations could not be loaded." } }, { status: 500 });
  return NextResponse.json({ installations: result.data, canManage: canManageEdge(context.role) });
}

export async function POST(request: Request) {
  const context = await getCurrentWorkspace();
  if (!context) return NextResponse.json({ error: { code: "unauthorized", message: "Authentication is required." } }, { status: 401 });
  if (!canManageEdge(context.role)) return NextResponse.json({ error: { code: "forbidden", message: "Only workspace owners and admins may create installations." } }, { status: 403 });
  const input = await request.json().catch(() => null) as Record<string, unknown> | null;
  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const channelType = input?.channel_type === "platform" ? "platform" : "website";
  const origins = normalizeAllowedOrigins(input?.allowed_origins);
  if (name.length < 2 || name.length > 120 || !origins) return NextResponse.json({ error: { code: "invalid_installation", message: "Provide a name and one to 25 valid HTTPS origins." } }, { status: 400 });
  const supabase = await createClient();
  const result = await supabase.from("edge_installations").insert({ workspace_id: context.workspace.id, name, channel_type: channelType, allowed_origins: origins, created_by: context.user.id })
    .select("id, name, public_installation_key, channel_type, status, allowed_origins, configuration, created_at, updated_at, revoked_at, last_activity_at").single();
  if (result.error) return NextResponse.json({ error: { code: "create_failed", message: "The installation could not be created." } }, { status: 500 });
  return NextResponse.json({ installation: result.data }, { status: 201 });
}
