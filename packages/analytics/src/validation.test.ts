import { describe, expect, it, vi } from "vitest";
import { createQpaiAnalytics, type QpaiAnalyticsProvider } from "./index";
import { validateClientEvent } from "./validation";

const validEvent = {
  name: "corporate.page_viewed",
  schemaVersion: 1,
  product: "corporate",
  environment: "staging",
  source: "client",
  eventId: "evt_12345678",
  metadata: { route_key: "home", page_group: "marketing" },
} as const;

describe("validateClientEvent", () => {
  it("accepts a registered event with allowlisted metadata", () => {
    expect(validateClientEvent(validEvent).ok).toBe(true);
  });

  it("rejects unknown event names and product mismatches", () => {
    expect(validateClientEvent({ ...validEvent, name: "corporate.unknown" }).ok).toBe(false);
    expect(validateClientEvent({ ...validEvent, product: "shop" }).ok).toBe(false);
  });

  it("rejects direct identifiers, URLs, and arbitrary metadata", () => {
    expect(validateClientEvent({ ...validEvent, metadata: { email: "a@example.com" } }).ok).toBe(false);
    expect(validateClientEvent({ ...validEvent, metadata: { route_key: "https://example.com" } }).ok).toBe(false);
    expect(validateClientEvent({ ...validEvent, metadata: { raw_value: "anything" } }).ok).toBe(false);
  });

  it("rejects server-source events from the client adapter", () => {
    expect(validateClientEvent({ ...validEvent, source: "server" }).ok).toBe(false);
  });
});

describe("createQpaiAnalytics", () => {
  it("does not initialize or emit without consent", async () => {
    const provider: QpaiAnalyticsProvider = {
      initialize: vi.fn(), log: vi.fn(), setUser: vi.fn(), flush: vi.fn(), shutdown: vi.fn(),
    };
    const analytics = createQpaiAnalytics(provider);
    await analytics.initialize({ consentGranted: false, environment: "staging" });
    expect(analytics.track(validEvent)).toBe(false);
    expect(provider.initialize).not.toHaveBeenCalled();
    expect(provider.log).not.toHaveBeenCalled();
  });

  it("fails open for product functionality when the provider throws", async () => {
    const provider: QpaiAnalyticsProvider = {
      initialize: vi.fn().mockRejectedValue(new Error("offline")),
      log: vi.fn(), setUser: vi.fn(), flush: vi.fn(), shutdown: vi.fn(),
    };
    const analytics = createQpaiAnalytics(provider);
    await analytics.initialize({ consentGranted: true, environment: "staging" });
    expect(analytics.track(validEvent)).toBe(false);
  });
});
