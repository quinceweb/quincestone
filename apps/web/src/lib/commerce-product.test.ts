import { describe, expect, it } from "vitest";
import { isPublicMedia, isPublicProductState, verifiedValue } from "./commerce-product";

describe("commerce publication guards", () => {
  const base = {
    rightsStatus: "AUTHORIZED" as const,
    verificationStatus: "VERIFIED" as const,
    publicationStatus: "PUBLISHED" as const,
  };

  it("rejects concept media even when published and verified", () => {
    expect(isPublicMedia({ ...base, source: "CONCEPT_MEDIA" })).toBe(false);
  });

  it("rejects restricted and unverified media", () => {
    expect(isPublicMedia({ ...base, source: "VERIFIED_PRODUCT_MEDIA", rightsStatus: "RESTRICTED" })).toBe(false);
    expect(isPublicMedia({ ...base, source: "VERIFIED_PRODUCT_MEDIA", verificationStatus: "UNVERIFIED" })).toBe(false);
  });

  it("allows verified, authorized product media", () => {
    expect(isPublicMedia({ ...base, source: "VERIFIED_PRODUCT_MEDIA" })).toBe(true);
  });

  it("requires explicit published state", () => {
    expect(isPublicProductState("INTERNAL_ONLY")).toBe(false);
    expect(isPublicProductState("COMING_SOON")).toBe(false);
    expect(isPublicProductState("PUBLISHED")).toBe(true);
  });

  it("omits unverified values instead of inventing placeholders", () => {
    expect(verifiedValue("100L", false)).toBeNull();
    expect(verifiedValue("verified value", true)).toBe("verified value");
  });
});
