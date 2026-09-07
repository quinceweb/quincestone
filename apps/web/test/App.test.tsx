// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
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
});
