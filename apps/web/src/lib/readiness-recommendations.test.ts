import { describe, expect, it } from "vitest";
import type { Product } from "../pages/ShopElite";
import { recommendPublishedProducts, type ReadinessAnswers } from "./readiness-recommendations";

function product(collection: string, price: number | null): Product {
  return { id: collection, slug: collection, name: collection, description: null, collection, content_eyebrow: null, content_headline: null, content_subheadline: null, content_short_description: null, content_story: null, benefit_blocks: null, feature_blocks: null, specs: null, included_items: null, usage_steps: null, faq: null, content_shipping: null, content_returns_policy: null, media: [], variants: [{ id: collection, slug: collection, name: collection, description: null, collection, content_eyebrow: null, content_headline: null, content_subheadline: null, content_short_description: null, content_story: null, benefit_blocks: null, feature_blocks: null, specs: null, included_items: null, usage_steps: null, faq: null, content_shipping: null, content_returns_policy: null, variant_id: `${collection}-variant`, sku: collection, option_values: {}, price_amount: price, currency: "USD", media_id: null, asset_url: null, media_type: null, alt_text: null, sort_order: null }] };
}

const answers: ReadinessAnswers = { use: "vehicle", people: 2, children: true, pets: false, climate: "cold", concerns: ["roadside"], budgetCents: 30000 };

describe("readiness recommendations", () => {
  it("matches only products in the supported world and budget", () => {
    const matches = recommendPublishedProducts([product("drive", 25000), product("travel", 20000), product("drive", 50000)], answers);
    expect(matches).toHaveLength(1);
    expect(matches[0].product.collection).toBe("drive");
    expect(matches[0].reasons.join(" ")).toMatch(/within your selected ceiling/i);
  });
  it("does not infer work eligibility without published metadata", () => { expect(recommendPublishedProducts([product("drive", 25000)], { ...answers, use: "work" })).toEqual([]); });
  it("excludes products without a disclosed price", () => { expect(recommendPublishedProducts([product("drive", null)], answers)).toEqual([]); });
});
