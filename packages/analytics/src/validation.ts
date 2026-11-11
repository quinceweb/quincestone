import { CLIENT_EVENT_REGISTRY, type QpaiClientEventName, type QpaiEnvironment, type QpaiProduct, type QpaiScalar } from "./registry";

export interface QpaiClientEvent {
  name: QpaiClientEventName;
  schemaVersion: 1;
  product: QpaiProduct;
  environment: QpaiEnvironment;
  source: "client";
  eventId: string;
  routeKey?: string;
  metadata: Record<string, QpaiScalar>;
}

const EVENT_KEYS = new Set(["name", "schemaVersion", "product", "environment", "source", "eventId", "routeKey", "metadata"]);
const FORBIDDEN_KEY = /email|phone|password|token|secret|authorization|cookie|message|comment|description|address|name|uuid|user.?id|workspace.?id|customer.?id|order.?id|deal.?id|payment|amount|price|query|url|referrer|payload|text/i;
const SAFE_CATEGORY = /^[a-z0-9][a-z0-9._-]{0,63}$/i;
const IDENTIFIER_VALUE = /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i;

export type ValidationResult =
  | { ok: true; event: QpaiClientEvent }
  | { ok: false; reason: string };

export function validateClientEvent(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, reason: "invalid_event" };
  const event = input as Record<string, unknown>;
  if (Object.keys(event).some((key) => !EVENT_KEYS.has(key))) return { ok: false, reason: "event_field_not_allowed" };
  if (typeof event.name !== "string" || !(event.name in CLIENT_EVENT_REGISTRY)) return { ok: false, reason: "unregistered_event" };

  const definition = CLIENT_EVENT_REGISTRY[event.name as QpaiClientEventName];
  if (event.product !== definition.product) return { ok: false, reason: "product_mismatch" };
  if (!["development", "staging", "production"].includes(String(event.environment))) return { ok: false, reason: "invalid_environment" };
  if (event.source !== "client" || event.schemaVersion !== 1) return { ok: false, reason: "invalid_source_or_version" };
  if (typeof event.eventId !== "string" || event.eventId.length < 8 || event.eventId.length > 128 || !SAFE_CATEGORY.test(event.eventId)) return { ok: false, reason: "invalid_event_id" };
  if (!event.metadata || typeof event.metadata !== "object" || Array.isArray(event.metadata)) return { ok: false, reason: "invalid_metadata" };

  const metadata = event.metadata as Record<string, unknown>;
  const allowed = new Set<string>(definition.keys);
  const entries = Object.entries(metadata);
  if (entries.length > 8) return { ok: false, reason: "too_many_properties" };

  for (const [key, value] of entries) {
    if (!allowed.has(key) || FORBIDDEN_KEY.test(key)) return { ok: false, reason: "metadata_key_not_allowed" };
    if (typeof value === "string") {
      if (!SAFE_CATEGORY.test(value) || IDENTIFIER_VALUE.test(value)) return { ok: false, reason: "metadata_value_not_allowed" };
    } else if (typeof value === "number") {
      if (!Number.isFinite(value) || Math.abs(value) > 1_000_000) return { ok: false, reason: "metadata_number_out_of_range" };
    } else if (typeof value !== "boolean") {
      return { ok: false, reason: "metadata_value_not_scalar" };
    }
  }

  if (event.routeKey !== undefined && (typeof event.routeKey !== "string" || !SAFE_CATEGORY.test(event.routeKey))) {
    return { ok: false, reason: "invalid_route_key" };
  }

  return { ok: true, event: input as QpaiClientEvent };
}
