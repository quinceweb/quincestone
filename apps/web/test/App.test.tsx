// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../src/App";
import { vi } from "vitest";

describe("Quincestone application", () => {
  it("starts a new route at the top after footer navigation", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    try {
      render(<MemoryRouter initialEntries={["/edge"]}><App /></MemoryRouter>);
      scrollTo.mockClear();
      fireEvent.click(screen.getAllByRole("link", { name: "Platform" }).slice(-1)[0]);
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Discover. Build. Operate. Scale.");
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
    } finally {
      scrollTo.mockRestore();
    }
  });

  it("replaces Edge metadata when navigating to Business", () => {
    render(<MemoryRouter initialEntries={["/edge"]}><App /></MemoryRouter>);
    expect(document.title).toContain("Quincestone Edge");

    fireEvent.click(screen.getAllByRole("link", { name: "Business" })[0]);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Your website should do more than receive people.");
    expect(document.title).toBe("Quincestone Business — From interaction to outcome");
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://www.quincestone.com/business");
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe(document.title);

    fireEvent.click(screen.getAllByRole("link", { name: "Start with an assessment" })[0]);
    expect(document.title).toBe("Quincestone Assessment — Find where value is being lost");
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://www.quincestone.com/assessment");
  });

  it("renders the canonical homepage positioning", () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /Intent into outcomes\./i })).toBeTruthy();
    expect(screen.getByText("One connected system for turning demand into decisions, authorized action, and measurable outcomes.")).toBeTruthy();
    expect(screen.getByText("Intent. Decision.", { exact: false })).toBeTruthy();
    expect(screen.getByText("Action. Outcome.", { exact: false })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Explore the platform" }).getAttribute("href")).toBe("/platform");
    expect(screen.getAllByRole("link", { name: "See it in action" }).some((link) => link.getAttribute("href") === "#system-demonstration")).toBe(true);
  });

  it("renders a functional not-found route", () => {
    render(<MemoryRouter initialEntries={["/outside-the-map"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "This route is outside the map." })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Return home" }).getAttribute("href")).toBe("/");
  });

  it("hands individual identity to the canonical Account surface", () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    expect(screen.getAllByRole("link", { name: "Sign in" }).some((link) => link.getAttribute("href") === "https://app.quincestone.com/sign-in")).toBe(true);
  });

  it.each([
    ["/discover", "Understand what is actually happening."],
    ["/build", "Turn understanding into infrastructure."],
    ["/operate", "Make the system act."],
    ["/scale", "Learn from outcomes and expand what works."],
  ])("renders the canonical corporate pillar at %s", (route, heading) => {
    render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
    expect(screen.getByRole("tablist", { name: /capabilities/i })).toBeTruthy();
  });

  it("lets a visitor inspect the homepage authority boundary", () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    fireEvent.click(screen.getByRole("tab", { name: /03 Apply policy/i }));
    expect(screen.getByText("Human review required where authority is insufficient.")).toBeTruthy();
  });

  it.each([
    ["/edge", "Intelligence with an authority boundary."],
    ["/commerce", "Better products. Better value. Built around demand."],
    ["/about", "Built for the distance between demand and outcome."],
  ])("renders the upgraded corporate detail at %s", (route, heading) => {
    render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
  });
});
