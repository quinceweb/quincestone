// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../src/App";

describe("Quincestone application", () => {
  it("renders the canonical homepage positioning", () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /Turn demand into outcomes\./i })).toBeTruthy();
    expect(screen.getByText("Quincestone discovers meaningful demand, builds the experience around it, and operates the systems that move it toward a valuable outcome.")).toBeTruthy();
  });

  it("renders a functional not-found route", () => {
    render(<MemoryRouter initialEntries={["/outside-the-map"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "This route is outside the map." })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Return home" }).getAttribute("href")).toBe("/");
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
