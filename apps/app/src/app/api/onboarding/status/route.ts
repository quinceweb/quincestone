import { NextResponse } from "next/server";
import { getCurrentWorkspaceMembership } from "@/lib/workspaces";

export async function GET() {
  const membership = await getCurrentWorkspaceMembership();
  return NextResponse.json({ workspaceId: membership?.workspace_id ?? null });
}
