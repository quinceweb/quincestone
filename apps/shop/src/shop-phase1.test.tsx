// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ShopEliteHome, ShopEliteProduct } from "./views/ShopElite";

const repoRoot = resolve(process.cwd(), "../..");
const readRepo = (path: string) => readFileSync(resolve(repoRoot, path), "utf8");

describe("QEU Phase 1 Shop boundaries", () => {
  it("shows Phase 2 seams without claiming readiness capabilities", () => {
    render(<ShopEliteHome />);

    expect(screen.getByRole("heading", { name: "Understand the system before personalizing it." })).toBeTruthy();
    expect(screen.getByText(/Recommendations, readiness scoring and lifecycle reminders are not active yet/i)).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Standardize the requirement before ordering at scale." })).toBeTruthy();
    expect(screen.getByText(/does not imply bulk availability or fleet-ordering capability/i)).toBeTruthy();
  });

  it("fails closed when a requested product is not published", async () => {
    render(<ShopEliteProduct slug="not-published" />);
    expect(await screen.findByText(/This product is not published/i)).toBeTruthy();
  });
  it("routes durable customer identity through the canonical App Account", () => {
    const layout = readRepo("apps/shop/src/components/ShopLayout.tsx");
    const routes = readRepo("apps/shop/src/app/[[...slug]]/page.tsx");
    expect(layout).toContain('const account = "https://app.quincestone.com"');
    expect(layout).toContain('href="https://app.quincestone.com/account/businesses">Businesses</a>');
    expect(routes).toContain('href="https://app.quincestone.com/account/orders"');
    expect(`${layout}\n${routes}`).not.toContain("https://account.quincestone.com");
  });
});
