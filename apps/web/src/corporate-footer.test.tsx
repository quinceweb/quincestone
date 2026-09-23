// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { CorporateFooter } from "./components/CorporateFooter";

describe("QCF 2.0 corporate footer", () => {
  it("maps the One Quincestone ecosystem by customer purpose", () => {
    render(<MemoryRouter><CorporateFooter /></MemoryRouter>);

    expect(screen.getByText("Turn demand into outcomes.")).toBeTruthy();
    expect(screen.getByText("Commerce + operating systems.")).toBeTruthy();

    for (const label of ["Platform", "Products", "Account", "Company"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }

    expect(screen.getAllByRole("link", { name: "Business" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Shop" }).some((link) => link.getAttribute("href") === "https://shop.quincestone.com")).toBe(true);
    expect(screen.getAllByRole("link", { name: "Sign in" })[0].getAttribute("href")).toBe("https://account.quincestone.com/sign-in");
    expect(screen.getAllByRole("link", { name: "Create account" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "About" }).length).toBeGreaterThan(0);

    expect(screen.getByRole("link", { name: "Privacy" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Terms" })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: "Security" }).length).toBeGreaterThan(0);
  });

  it("links Business separately from individual Account", () => {
    render(<MemoryRouter><CorporateFooter /></MemoryRouter>);
    expect(screen.getAllByRole("link", { name: "Business" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Sign in" })[0].getAttribute("href")).toContain("account.quincestone.com");
  });
});
