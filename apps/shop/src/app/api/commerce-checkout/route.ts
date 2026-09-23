import { createClient } from "@supabase/supabase-js";
import { checkoutPublicOrigin, processCheckout, realDependencies } from "../../../../api/commerce-checkout";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeSecret || !supabaseUrl || !serviceKey) return Response.json({ error: "Commerce checkout is not configured." }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Checkout request could not be processed." }, { status: 400 }); }

  let publicOrigin: string;
  try { publicOrigin = checkoutPublicOrigin(); } catch { return Response.json({ error: "Commerce checkout is not configured." }, { status: 503 }); }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const result = await processCheckout(body, publicOrigin, realDependencies(supabase, stripeSecret));
  return Response.json(result.body, { status: result.status });
}
