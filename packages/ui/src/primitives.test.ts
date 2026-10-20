import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("Quincestone shared design foundation", () => {
  it("keeps semantic theme, focus and reduced-motion authority in brand.css", () => {
    const css = read("packages/config/src/brand.css");
    expect(css).toContain("--qs-bg-canvas: #070908");
    expect(css).toContain("--qs-light-canvas: #F4F5F1");
    expect(css).toContain("--qs-focus-color: #7DFF8A");
    expect(css).toContain('[data-qs-theme="light"]');
    expect(css).toContain("--qs-motion-flow: 0ms");
    expect(css).toContain("--qs-motion-reconcile: 0ms");
  });

  it("keeps shared controls semantic and accessible by default", () => {
    const source = read("packages/ui/src/primitives.tsx");
    const css = read("packages/ui/src/primitives.css");
    expect(source).toContain('role="alert"');
    expect(source).toContain("aria-invalid");
    expect(source).toContain("aria-describedby");
    expect(source).toContain("qs-status__marker");
    expect(source).toContain("type SurfaceLevel = 0 | 1 | 2 | 3");
    expect(css).toContain("var(--qs-focus-color)");
    expect(css).toContain("var(--qs-text-primary)");
    expect(css).not.toContain("color:#fff");
  });
});
