// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EdgeAssessment } from "./pages/EdgeAssessment";

describe("Phase 1 corporate reconciliation", () => {
  it("positions the assessment before collecting business information", () => {
    render(<EdgeAssessment />);
    expect(screen.getByRole("heading", { name: "Find where value is being lost." })).toBeTruthy();
    expect(screen.getByText(/No automated verdict/i)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Begin assessment" }));
    expect(screen.getByRole("heading", { name: "First, who are we understanding?" })).toBeTruthy();
  });
});
