export const QPAI_PRODUCTS = [
  "corporate",
  "business_os",
  "shop",
  "deals",
  "account",
  "admin",
] as const;

export type QpaiProduct = (typeof QPAI_PRODUCTS)[number];
export type QpaiEnvironment = "development" | "staging" | "production";
export type QpaiScalar = string | number | boolean;

export const CLIENT_EVENT_REGISTRY = {
  "corporate.page_viewed": { product: "corporate", keys: ["route_key", "page_group"] },
  "corporate.product_viewed": { product: "corporate", keys: ["product_key", "route_key"] },
  "corporate.assessment_started": { product: "corporate", keys: ["assessment_type"] },
  "corporate.demo_started": { product: "corporate", keys: ["demo_key", "demo_mode"] },
  "business_os.onboarding_started": { product: "business_os", keys: ["journey_key"] },
  "shop.product_viewed": { product: "shop", keys: ["product_key", "category_key"] },
  "shop.collection_viewed": { product: "shop", keys: ["collection_key"] },
  "shop.add_to_cart": { product: "shop", keys: ["product_key", "quantity_band"] },
  "shop.checkout_started": { product: "shop", keys: ["cart_size_band", "currency"] },
  "deals.deal_list_viewed": { product: "deals", keys: ["view_key"] },
  "account.onboarding_started": { product: "account", keys: ["journey_key"] },
} as const satisfies Record<string, { product: QpaiProduct; keys: readonly string[] }>;

export type QpaiClientEventName = keyof typeof CLIENT_EVENT_REGISTRY;
