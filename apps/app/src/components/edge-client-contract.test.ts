import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "public/edge.js"), "utf8");

describe("embedded Edge client contract", () => {
  it("retains failed input and reuses its idempotency key", () => {
    expect(source).toContain("localStorage.setItem(storageKey");
    expect(source).toContain("pending && pending.message === message");
    expect(source).toContain('"x-idempotency-key": pending.idempotencyKey');
  });

  it("shows a reference only after confirmed persistence", () => {
    expect(source).toContain("!payload.received || !payload.reference");
    expect(source).toContain("Received. Reference");
  });

  it("includes keyboard semantics and reduced-motion handling", () => {
    expect(source).toContain("<form novalidate>");
    expect(source).toContain("prefers-reduced-motion:no-preference");
    expect(source).toContain('role="status"');
  });
});
