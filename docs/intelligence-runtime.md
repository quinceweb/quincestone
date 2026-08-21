# Quincestone Edge Intelligence Runtime

## Public demo boundary

The public Northstone Roofing demonstration runs only with `mode=demo` and tenant `northstone-roofing-demo`.

The server runtime is governed in this order:

1. interaction ingestion
2. intent interpretation
3. context normalization
4. qualification
5. fictional business knowledge lookup
6. policy evaluation
7. deterministic workflow routing
8. human escalation evaluation
9. operational outcome and trace

The current demo runtime uses a deterministic interpretation engine. It is intentionally not described as a live external AI provider. A future model provider may assist with bounded interpretation, but model output must remain advisory and cannot authorize policy or side effects.

## Side-effect firewall

Demo mode cannot:

- create Google Calendar events;
- create Stripe checkout sessions or payments;
- send email, SMS, WhatsApp, or webhooks;
- write production customer records;
- dispatch production workflows.

The boundary is enforced server-side by the `edge-intelligence` Supabase Edge Function.

## Trace

Each successful run receives a `qn_demo_*` trace ID and returns safe operational fields only. The persistence table stores the operational trace without the raw visitor message. The browser keeps the full returned trace in session storage so the demo operations desk can inspect it during the current session.

## Rate and request limits

- POST only
- 2,000-character message limit
- 8 KiB request body limit
- 20 requests per minute per observed client address per function instance

Cloudflare rate limiting should be layered in front of the public endpoint when the Cloudflare connector is available.
