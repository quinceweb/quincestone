import { describe, expect, it } from "vitest";
import { canManageEdge, normalizeAllowedOrigins } from "./edge-installations";

describe("Edge installation authorization", () => {
  it("limits mutation authority to owners and admins", () => {
    expect(canManageEdge("owner")).toBe(true);
    expect(canManageEdge("admin")).toBe(true);
    expect(canManageEdge("member")).toBe(false);
  });

  it("normalizes exact HTTPS origins and rejects paths or insecure remote origins", () => {
    expect(normalizeAllowedOrigins(["https://example.com", "https://example.com/"])).toEqual(["https://example.com"]);
    expect(normalizeAllowedOrigins(["https://example.com/path"])).toBeNull();
    expect(normalizeAllowedOrigins(["http://example.com"])).toBeNull();
    expect(normalizeAllowedOrigins(["http://localhost:3000"])).toEqual(["http://localhost:3000"]);
  });
});
