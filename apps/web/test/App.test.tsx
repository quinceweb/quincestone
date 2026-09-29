// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../src/App";

describe("Quincestone application", () => {
  it("renders the canonical homepage positioning", async () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /Turn demand into outcomes\./i })).toBeTruthy();
    expect(screen.getByText("Understand what people need. Qualify what matters. Move the right work forward—with intelligence, policy and human authority built into the path.")).toBeTruthy();
  });

  it("renders a functional not-found route", () => {
    render(<MemoryRouter initialEntries={["/outside-the-map"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "This route is outside the map." })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Return home" }).getAttribute("href")).toBe("/");
  });

  it("hands individual identity to the canonical Account surface", () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    expect(screen.getAllByRole("link", { name: "Sign in" }).some((link) => link.getAttribute("href") === "https://account.quincestone.com/sign-in")).toBe(true);
  });

  it.each([
    ["/discover", "Understand what is actually happening."],
    ["/build", "Turn understanding into infrastructure."],
    ["/operate", "Make the system act."],
    ["/scale", "Learn from outcomes and expand what works."],
  ])("renders the canonical corporate pillar at %s", async (route, heading) => {
    render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
    expect(await screen.findByRole("heading", { name: heading })).toBeTruthy();
    expect(await screen.findByRole("tablist", { name: /capabilities/i })).toBeTruthy();
  });

  it("lets a visitor inspect the homepage authority boundary", () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /03 Governance/i }));
    expect(screen.getByText("Knowledge and policy determine what can happen automatically and where authority must stop.")).toBeTruthy();
  });

  it.each([
    ["/edge", "Intelligence with an authority boundary."],
    ["/commerce", "Better products. Better value. Built around demand."],
    ["/about", "Built for the distance between demand and outcome."],
  ])("renders the upgraded corporate detail at %s", async (route, heading) => {
    render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
    expect(await screen.findByRole("heading", { name: heading })).toBeTruthy();
  });
});
