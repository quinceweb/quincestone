import { isContactSchedulingEligible } from "../src/lib/scheduling";
describe("contact scheduling eligibility", () => {
  it("offers scheduling only for operational sales reasons", () => {
    expect(isContactSchedulingEligible("request-assessment")).toBe(true);
    expect(isContactSchedulingEligible("discuss-implementation")).toBe(true);
    expect(isContactSchedulingEligible("platform-integration")).toBe(true);
    expect(isContactSchedulingEligible("media")).toBe(false);
    expect(isContactSchedulingEligible("technical")).toBe(false);
    expect(isContactSchedulingEligible("legal-privacy")).toBe(false);
  });
});
