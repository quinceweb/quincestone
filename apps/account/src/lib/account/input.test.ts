import { describe, expect, it } from "vitest";
import { countryCode, optionalText, requiredText, safeHttpsUrl } from "./input";
describe("Account server input validation", () => {
  it("normalizes valid country codes and rejects broad values", () => {
    expect(countryCode(" ca ")).toBe("CA");
    expect(countryCode("Canada")).toBeNull();
    expect(countryCode("../")).toBeNull();
  });
  it("trims bounded required and optional values", () => {
    const form = new FormData(); form.set("name", "  Quince Stone  "); form.set("phone", "  ");
    expect(requiredText(form, "name", 40)).toBe("Quince Stone");
    expect(optionalText(form, "phone", 40)).toBeNull();
  });
  it("rejects missing and oversized values", () => {
    const form = new FormData(); form.set("subject", "x".repeat(201));
    expect(() => requiredText(form, "missing", 20)).toThrow();
    expect(() => requiredText(form, "subject", 200)).toThrow();
  });
  it("allows only absolute HTTPS links from fulfillment data", () => {
    expect(safeHttpsUrl("https://carrier.example/track/1")).toBe("https://carrier.example/track/1");
    expect(safeHttpsUrl("javascript:alert(1)")).toBeNull();
    expect(safeHttpsUrl("/relative")).toBeNull();
  });
});
