import { describe, expect, it } from "vitest";
import { callbackErrorMessage, parseReturnDestination, parseSafeAccountPath, returnDestinationUrl } from "./return-to";

describe("Account return destinations", () => {
  it("accepts only named Quincestone destinations", () => {
    expect(parseReturnDestination("shop")).toBe("shop");
    expect(parseReturnDestination("account")).toBe("account");
    expect(parseReturnDestination("app")).toBe("app");
  });

  it("rejects arbitrary and malformed cross-domain redirect values", () => {
    expect(parseReturnDestination("https://attacker.example/path")).toBe("account");
    expect(parseReturnDestination("//attacker.example")).toBe("account");
    expect(parseReturnDestination("javascript:alert(1)")).toBe("account");
    expect(parseReturnDestination("shop?next=https://attacker.example")).toBe("account");
    expect(parseReturnDestination(null)).toBe("account");
  });

  it("maps allowed names to canonical destinations", () => {
    expect(returnDestinationUrl("shop")).toBe("https://shop.quincestone.com");
    expect(returnDestinationUrl("app")).toBe("https://app.quincestone.com");
    expect(returnDestinationUrl("account")).toBe("https://account.quincestone.com");
    expect(returnDestinationUrl("https://attacker.example")).toBe("https://account.quincestone.com");
  });

  it("keeps relative commerce intent on the allowlisted Shop origin", () => {
    expect(returnDestinationUrl("shop", "/bag?checkout=resume")).toBe("https://shop.quincestone.com/bag?checkout=resume");
    expect(returnDestinationUrl("shop", "//attacker.example/path")).toBe("https://shop.quincestone.com");
    expect(returnDestinationUrl("shop", "https://attacker.example/path")).toBe("https://shop.quincestone.com");
  });

  it("allows only same-origin relative Account continuations", () => {
    expect(parseSafeAccountPath("/orders/123?from=support")).toBe("/orders/123?from=support");
    expect(parseSafeAccountPath("https://attacker.example/orders/123")).toBeNull();
    expect(parseSafeAccountPath("//attacker.example/orders/123")).toBeNull();
    expect(parseSafeAccountPath("javascript:alert(1)")).toBeNull();
  });

  it("only exposes allowlisted callback errors", () => {
    expect(callbackErrorMessage("missing_callback_code")).toContain("incomplete");
    expect(callbackErrorMessage("callback_failed")).toContain("could not be completed");
    expect(callbackErrorMessage("<script>alert(1)</script>")).toBe("");
  });
});
