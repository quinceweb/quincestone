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
    expect(document.title).toBe("Quincestone Business â€” From interaction to outcome");
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://www.quincestone.com/business");
    expect(docu¶»§q«^