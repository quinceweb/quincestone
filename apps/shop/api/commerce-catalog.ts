import { createClient } from "@supabase/supabase-js";

export type CatalogResult = { status: number; body: Record<string, unknown> };

export async function readCatalog(environment: Record<string, string | undefined> = process.env): Promise<CatalogResult> {
  const url = environment.SUPABASE_URL ?? environment.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = environment.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { status: 503, body: { error: "Commerce API is not configured." } };
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.from("commerce_catalog").select("*").order("slug").order("sort_order");
  if (error) return { status: 500, body: { error: "Catalog unavailable." } };
  return { status: 200, body: { products: data ?? [] } };
}

export default async function handler(req: { method?: string }, res: { status(code: number): { json(body: Record<string, unknown>): unknown } }) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const result = await readCatalog();
  return res.status(result.status).json(result.body);
}
