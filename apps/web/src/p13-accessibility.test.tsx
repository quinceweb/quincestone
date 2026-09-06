import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

describe("P13 accessibility foundations", () => {
  it("renders a skip link and labelled primary navigation", () => {
    const { getByRole } = render(<BrowserRouter><App /></BrowserRouter>);
    expect(getByRole("link", { name: "Skip to content" })).toBeTruthy();
    expect(getByRole("navigation", { name: "Primary navigation" })).toBeTruthy();
  });
});
