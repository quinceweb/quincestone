// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { BusinessPage } from "./pages/BusinessPage";
import { EdgeAssessment } from "./pages/EdgeAssessment";

describe("Phase 1 corporate experience", () => {
  it("makes the authority boundary visible in the Business demonstration", () => {
    render(<MemoryRouter><BusinessPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "High-value exception" }));
    fireEvent.click(screen.getByRole("tab", { name: /Authority/ }));
    expect(screen.getByText("Human review required")).toBeTruthy();
    expect(screen.getByText(/no live customer activity/i)).toBeTruthy();
  });

  it("positions the assessment before collecting business information", () => {
    render(<EdgeAssessment />);
    expect(screen.getByRole("heading", { name: "Find where value is being lost." })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Begin assessment" }));
    expect(screen.getByRole("heading", { name: "First, who are we understanding?" })).toBeTruthy();
  });
});
