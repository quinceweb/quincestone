import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

const MAX_MESSAGE = 2_000;

export async function POST(request: Request) {
  const context = await getCurrentWorkspace();
  if (!context) {
    return NextResponse.json({ error: { code: "unauthorized", message: "An authenticated workspace is required." } }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: { code: "invalid_json", message: "Request body must be valid JSON." } }, { status: 400 });
  }

  const message = body && typeof body === "object" && "message" in body && typeof body.message === "string"
    ? body.message.trim()
    : "";

  if (message.length < 3 || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: { code: "invalid_message", message: "Message must be between 3 and 2,000 characters." } }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    return NextResponse.json({ error: { code: "unauthorized", message: "Your session is no longer valid." } }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey) {
    return NextResponse.json({ error: { code: "configuration_error", message: "The intelligence runtime is not configured." } }, { status: 500 });
  }

  const response = await fetch(`${baseUrl}/functions/v1/edge-workspace`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: anonKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      workspace_id: context.workspace.id,
      message,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({
    error: { code: "invalid_runtime_response", message: "The intelligence runtime returned an invalid response." },
  }));

  return NextResponse.json(payload, { status: response.status });
}
