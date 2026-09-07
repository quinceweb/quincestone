import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: "Commerce API is not configured." });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.from("commerce_catalog").select("*").order("slug").order("sort_order");
  if (error) return res.status(500).json({ error: "Catalog unavailable." });
  return res.status(200).json({ products: data ?? [] });
}
