import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace-context";

const MAX_MESSAGE = 2_000;
const MAX_NAME = 160;
const MAX_EMAIL = 254;

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

  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const fullName = typeof input.full_name === "string" ? input.full_name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const idempotencyKey = typeof input.idempotency_key === "string" ? input.idempotency_key.trim() : crypto.randomUUID();

  if (fullName.length < 2 || fullName.length > MAX_NAME) {
    return NextResponse.json({ error: { code: "invalid_name", message: "Customer name must be between 2 and 160 characters." } }, { status: 400 });
  }
  if (email.length > MAX_EMAIL || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: { code: "invalid_email", message: "A valid customer email is required." } }, { status: 400 });
  }
  if (message.length < 3 || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: { code: "invalid_message", message: "Customer request must be between 3 and 2,000 characters." } }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    return NextResponse.json({ error: { code: "unauthorized", message: "Your session is no longer valid." } }, { status: 401 });
  }

  let customerId: string;
  const existingCustomer = await supabase
    .from("customers")
    .select("id")
    .eq("workspace_id", context.workspace.id)
    .eq("email", email)
    .maybeSingle();

  if (existingCustomer.data?.id) {
    customerId = existingCustomer.data.id as string;
    const { error: updateError } = await supabase
      .from("customers")
      .update({ full_name: fullName })
      .eq("id", customerId)
      .eq("workspace_id", context.workspace.id);
    if (updateError) {
      return NextResponse.json({ error: { code: "customer_update_failed", message: "The customer record could not be updated." } }, { status: 500 });
    }
  } else {
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({ workspace_id: context.workspace.id, full_name: fullName, email })
      .select("id")
      .single();

    if (customerError || !customer) {
      if (customerError?.code === "23505") {
        const retry = await supabase
          .from("customers")
          .select("id")
          .eq("workspace_id", context.workspace.id)
          .eq("email", email)
          .maybeSingle();
        if (retry.data?.id) customerId = retry.data.id as string;
        else return NextResponse.json({ error: { code: "customer_create_failed", message: "The customer could not be created." } }, { status: 500 });
      } else {
        return NextResponse.json({ error: { code: "customer_create_failed", message: customerError?.message ?? "The customer could not be created." } }, { status: 500 });
      }
    } else {
      customerId = customer.id as string;
    }
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
      customer_id: customerId,
      idempotency_key: idempotencyKey,
      message,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({ error: { code: "invalid_runtime_response", message: "The intelligence runtime returned an invalid response." } }));
  return NextResponse.json(payload, { status: response.status });
}
