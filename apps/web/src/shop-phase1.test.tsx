// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ShopEliteHome, ShopEliteProduct } from "./pages/ShopElite";

describe("QEU Phase 1 Shop boundaries", () => {
  it("shows the Phase 2 guided brief without claiming deferred capabilities", () => {
    render(<MemoryRouter><ShopEliteHome /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Understand the system before personalizing it." })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Build my readiness brief/i }).getAttribute("href")).toBe("/build-your-kit");
    expect(screen.getByText(/Account persistence, readiness scoring, replenishment and lifecycle reminders/i)).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Standardize the requirement before ordering at scale." })).toBeTruthy();
    expect(screen.getByText(/does not imply bulk availability or fleet-ordering capability/i)).toBeTruthy();
  });

  it("fails closed when a requested product is not published", async () => {
    render(<MemoryRouter initialEntries={["/product/not-published"]}><ShopEliteProduct /></MemoryRouter>);
    expect(await screen.findByText(/This product is not published/i)).toBeTruthy();
  });
});
