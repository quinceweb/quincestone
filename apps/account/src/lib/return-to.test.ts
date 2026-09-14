import { describe, expect, it } from "vitest";
import { parseReturnDestination, returnDestinationUrl } from "./return-to";

describe("Account return destinations", () => {
  it("accepts only named Quincestone destinations", () => {
    expect(parseReturnDestination("shop")).toBe("shop");
    expect(parseReturnDestination("account")).toBe("account");
    expect(parseReturnDestination("app")).toBe("app");
  });

  it("rejects arbitrary and malformed redirect values", () => {
    expect(parseReturnDestination("https://attacker.example/path")).toBe("account");
    expect(parseReturnDestination("//attacker.example")).toBe("account");
    expect(parseReturnDestination("shop?next=https://attacker.example")).toBe("account");
    expect(parseReturnDestination(null)).toBe("account");
  });

  it("maps allowed names to canonical destinations", () => {
    expect(returnDestinationUrl("shop")).toBe("https://shop.quincestone.com");
    expect(returnDestinationUrl("app")).toBe("https://app.quincestone.com");
    expect(returnDestinationUrl("account")).toBe("https://account.quincestone.com");
    expect(returnDestinationUrl("https://attacker.example")).toBe("https://account.quincestone.com");
  });
});
