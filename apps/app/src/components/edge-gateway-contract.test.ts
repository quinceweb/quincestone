import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "../../supabase/functions/edge-channel-gateway/index.ts"), "utf8");

describe("public Edge gateway contract", () => {
  it("resolves the workspace only from the installation", () => {
    expect(source).toContain('installation.workspace_id');
    expect(source).not.toContain('input.workspace_id');
  });

  it("fails closed for origin, status and quota", () => {
    expect(source).toContain('installation.status !== "active"');
    expect(source).toContain('origin_not_allowed');
    expect(source).toContain('consume_edge_intake_quota');
  });

  it("returns a narrow customer-safe receipt", () => {
    expect(source).toContain('received: true');
    expect(source).not.toContain('knowledge:');
    expect(source).not.toContain('policy: result');
  });
});
