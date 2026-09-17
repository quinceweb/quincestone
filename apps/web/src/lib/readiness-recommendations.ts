import type { Product } from "../pages/ShopElite";

export type ReadinessUse = "vehicle" | "home" | "travel" | "work";
export type ReadinessConcern = "roadside" | "blackout" | "storm" | "medical" | "evacuation";
export type ReadinessAnswers = { use: ReadinessUse; people: number; children: boolean; pets: boolean; climate: "temperate" | "cold" | "hot" | "wet"; concerns: ReadinessConcern[]; budgetCents: number | null };
export type ReadinessRecommendation = { product: Product; variantId: string; reasons: string[]; limitations: string[] };

const collectionForUse: Record<ReadinessUse, string | null> = { vehicle: "drive", home: "home-outdoor", travel: "travel", work: null };

export function recommendPublishedProducts(products: Product[], answers: ReadinessAnswers): ReadinessRecommendation[] {
  const targetCollection = collectionForUse[answers.use];
  if (!targetCollection) return [];
  return products.flatMap((product) => {
    if (product.collection !== targetCollection) return [];
    const variant = product.variants.filter((item) => item.price_amount != null).sort((a, b) => (a.price_amount ?? 0) - (b.price_amount ?? 0))[0];
    if (!variant || variant.price_amount == null || (answers.budgetCents != null && variant.price_amount > answers.budgetCents)) return [];
    const reasons = [`Published in the ${targetCollection.replace("-", " + ")} collection for the selected ${answers.use} context.`];
    if (answers.budgetCents != null) reasons.push("Its lowest disclosed variant price is within your selected ceiling.");
    const limitations = ["Household size, climate and concern matching require published recommendation metadata before they can affect eligibility."];
    if (answers.children) limitations.push("No child-specific suitability is inferred from the current public record.");
    if (answers.pets) limitations.push("No pet-specific suitability is inferred unless the published product record states it.");
    return [{ product, variantId: variant.variant_id, reasons, limitations }];
  });
}
