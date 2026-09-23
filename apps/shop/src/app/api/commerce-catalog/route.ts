import { readCatalog } from "../../../../api/commerce-catalog";

export const runtime = "nodejs";

export async function GET() {
  const result = await readCatalog();
  return Response.json(result.body, { status: result.status });
}
