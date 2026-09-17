// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ReadinessBuilder } from "./pages/ReadinessBuilder";

describe("Build My Readiness System", () => {
  it("states its authority and persistence boundaries", () => {
    render(<MemoryRouter><ReadinessBuilder /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /Build a readiness brief/i })).toBeTruthy();
    expect(screen.getByText(/does not calculate safety/i)).toBeTruthy();
    expect(screen.getByText(/does not create an Account record or readiness score/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Build my brief/i })).toBeTruthy();
  });
});
