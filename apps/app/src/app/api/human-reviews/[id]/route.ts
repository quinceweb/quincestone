import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

const DECISIONS = new Set(["approved", "rejected", "resolved"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getCurrentWorkspace();
  if (!context) return NextResponse.json({ error: { code: "unauthorized", message: "An authenticated workspace is required." } }, { status: 401 });
  if (context.role !== "owner" && context.role !== "admin") {
    return NextResponse.json({ error: { code: "forbidden", message: "Only workspace owners and admins can make human-review decisions." } }, { status: 403 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: { code: "review_required", message: "A review id is required." } }, { status: 400 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: { code: "invalid_json", message: "Request body must be valid JSON." } }, { status: 400 }); }
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const decision = typeof input.decision === "string" ? input.decision : "";
  const reason = typeof input.reason === "string" ? input.reason.trim() : "";
  if (!DECISIONS.has(decision)) return NextResponse.json({ error: { code: "invalid_decision", message: "Decision must be approved, rejected, or resolved." } }, { status: 400 });
  if (reason.length < 3 || reason.length > 2000) return NextResponse.json({ error: { code: "invalid_reason", message: "A decision reason between 3 and 2,000 characters is required." } }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("decide_human_review", {
    target_review: id,
    target_decision: decision,
    target_reason: reason,
  });

  if (error) {
    const status = error.code === "42501" ? 403 : error.code === "P0002" ? 404 : error.code === "23514" ? 409 : error.code === "22023" ? 400 : 500;
    return NextResponse.json({ error: { code: "review_decision_failed", message: error.message } }, { status });
  }

  return NextResponse.json(data);
}
