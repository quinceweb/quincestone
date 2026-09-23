import { Readable } from "node:stream";
import webhookHandler from "../../../../api/commerce-webhook";

export const runtime = "nodejs";

type JsonBody = Record<string, unknown>;

export async function POST(request: Request) {
  const payload = Buffer.from(await request.arrayBuffer());
  const req = Object.assign(Readable.from([payload]), {
    method: "POST",
    headers: { "stripe-signature": request.headers.get("stripe-signature") ?? undefined },
  });
  let status = 200;
  let responseBody: JsonBody = {};
  const res = {
    status(code: number) { status = code; return this; },
    json(body: JsonBody) { responseBody = body; return body; },
  };

  await webhookHandler(req, res);
  return Response.json(responseBody, { status });
}
