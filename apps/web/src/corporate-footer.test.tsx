// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { CorporateFooter, isCorporateFooterHost } from "./components/CorporateFooter";

describe("QCF 2.0 corporate footer", () => {
  it("presents Quincestone through Platform, Products, Solutions and Company", () => {
    render(<MemoryRouter><CorporateFooter /></MemoryRouter>);

    expect(screen.getByText("Turn demand into outcomes.")).toBeTruthy();
    expect(screen.getByText("Commerce + operating systems.")).toBeTruthy();

    for (const label of ["Platform", "Products", "Solutions", "Company"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }

    expect(screen.getAllByRole("link", { name: "Business" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Commerce" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Shop" })[0].getAttribute("href")).toBe("https://shop.quincestone.com");
    expect(screen.getAllByRole("link", { name: "App" })[0].getAttribute("href")).toBe("https://app.quincestone.com");
    expect(screen.getAllByRole("link", { name: "Assessment" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "About" }).length).toBeGreaterThan(0);

    expect(screen.getByRole("link", { name: "Privacy" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Terms" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Security" })).toBeTruthy();
  });

  it("does not classify the Shop host as a corporate-footer surface", () => {
    expect(isCorporateFooterHost("quincestone.com")).toBe(true);
    expect(isCorporateFooterHost("www.quincestone.com")).toBe(true);
    expect(isCorporateFooterHost("shop.quincestone.com")).toBe(false);
  });
});
