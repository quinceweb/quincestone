import { NextResponse } from "next/server";
import { createWorkspace } from "@/lib/workspaces";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: { code: "invalid_json", message: "Request body must be valid JSON." } }, { status: 400 });
  }

  const name = body && typeof body === "object" && "name" in body && typeof body.name === "string"
    ? body.name
    : "";

  try {
    const workspaceId = await createWorkspace(name);
    return NextResponse.json({ workspaceId }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The workspace could not be created.";
    const status = message === "Authentication required." ? 401 : message.includes("not authorized") ? 403 : 400;
    return NextResponse.json({ error: { code: "workspace_creation_failed", message } }, { status });
  }
}
