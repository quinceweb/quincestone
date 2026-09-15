// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { BusinessPage } from "./pages/BusinessPage";
import { EdgeAssessment } from "./pages/EdgeAssessment";
import { submitAssessment } from "./lib/submissions";

vi.mock("./lib/submissions", async (load) => ({
  ...(await load<typeof import("./lib/submissions")>()),
  submitAssessment: vi.fn(),
}));
const mockedSubmit = vi.mocked(submitAssessment);

function begin() {
  fireEvent.click(screen.getByRole("button", { name: /Enter assessment/ }));
}
function answerText(value: string) {
  fireEvent.change(screen.getByRole("textbox"), { target: { value } });
  fireEvent.click(screen.getByRole("button", { name: /Resolve and continue/ }));
}
function select(value: string) {
  fireEvent.click(screen.getByRole("button", { name: new RegExp(value, "i") }));
  fireEvent.click(screen.getByRole("button", { name: /Resolve and continue/ }));
}
function reachFinalStep() {
  begin();
  answerText("Ada Okafor");
  answerText("ada@example.com");
  answerText("Example Company");
  fireEvent.click(screen.getByRole("button", { name: /Resolve and continue/ }));
  select("poorly qualified");
  select("referrals");
  select("without enough context");
  answerText("Budget, location, urgency and authority");
  answerText("Services, policies and pricing rules");
  answerText("Pricing exceptions require a person");
}

describe("Phase 1 corporate reconciliation", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockedSubmit.mockReset();
  });
  it("makes the authority boundary visible in the Business demonstration", () => {
    render(
      <MemoryRouter>
        <BusinessPage />
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "High-value exception" }),
    );
    fireEvent.click(screen.getByRole("tab", { name: /Authority/ }));
    expect(screen.getByText("Human review required")).toBeTruthy();
    expect(screen.getByText(/no live customer activity/i)).toBeTruthy();
    expect(screen.getByText(/does not execute the exception/i)).toBeTruthy();
  });

  it("positions the assessment before collecting business information", () => {
    render(<EdgeAssessment />);
    expect(
      screen.getByRole("heading", { name: "Find where value is being lost." }),
    ).toBeTruthy();
    expect(screen.getByText(/No automated verdict/i)).toBeTruthy();
    begin();
    expect(
      screen.getByRole("heading", { name: "Who are we understanding?" }),
    ).toBeTruthy();
  });

  it("uses the assessment shell without the corporate footer", () => {
    render(
      <MemoryRouter initialEntries={["/assessment"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("ASSESSMENT ENVIRONMENT")).toBeTruthy();
    expect(screen.queryByText("Turn demand into outcomes.")).toBeNull();
  });

  it("keeps normal corporate pages in the corporate shell", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("Turn demand into outcomes.")).toBeTruthy();
  });

  it("validates required fields and email, and preserves answers when moving back", () => {
    render(<EdgeAssessment />);
    begin();
    fireEvent.click(
      screen.getByRole("button", { name: /Resolve and continue/ }),
    );
    expect(screen.getByText("Your name is required.")).toBeTruthy();
    answerText("Ada Okafor");
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "invalid" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Resolve and continue/ }),
    );
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Resolve and continue/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Back/ }));
    expect(Reflect.get(screen.getByRole("textbox"), "value")).toBe(
      "ada@example.com",
    );
  });

  it("waits for confirmed persistence and prevents duplicate submission", async () => {
    let resolve!: (value: { ok: true; reference: string }) => void;
    mockedSubmit.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    render(<EdgeAssessment />);
    reachFinalStep();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Faster qualified response" },
    });
    const submitButton = screen.getByRole("button", {
      name: /Submit for human review/,
    });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    expect(mockedSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Assessment received.")).toBeNull();
    resolve({ ok: true, reference: "QS-A-ABC12345" });
    await waitFor(() => expect(screen.getByText("QS-A-ABC12345")).toBeTruthy());
    expect(screen.getByText(/server confirmed persistence/i)).toBeTruthy();
  });

  it("retains the completed answer set after a server failure", async () => {
    mockedSubmit.mockResolvedValue({
      ok: false,
      reason: "failed",
      message: "Persistence failed. Retry.",
    });
    render(<EdgeAssessment />);
    reachFinalStep();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Faster qualified response" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Submit for human review/ }),
    );
    await waitFor(() =>
      expect(screen.getByText("Persistence failed. Retry.")).toBeTruthy(),
    );
    expect(Reflect.get(screen.getByRole("textbox"), "value")).toBe(
      "Faster qualified response",
    );
  });
});
