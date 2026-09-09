const SHOPIFY_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || "2026-07";

export type ShopifyProductProjection = {
  id?: string;
  title: string;
  handle: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  status: "DRAFT";
  seo?: { title?: string; description?: string };
};

type ShopifyProductSetResponse = {
  data?: {
    productSet?: {
      product?: { id: string; title: string; handle: string; status: string } | null;
      userErrors?: Array<{ field?: string[]; message: string }>;
    };
  };
  errors?: Array<{ message: string }>;
};

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
  if (!domain || !token) {
    throw new Error("Shopify server integration is not configured.");
  }
  const normalizedDomain = domain.replace(/^https?:\\/\\//, "").replace(/\\/$/, "");
  return { domain: normalizedDomain, token };
}

export function isShopifyServerConfigured() {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN?.trim() && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim());
}

export async function projectProductToShopify(input: ShopifyProductProjection) {
  const { domain, token } = getShopifyConfig();
  const endpoint = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const query = `mutation ProductSet($input: ProductSetInput!, $identifier: ProductSetIdentifiers) {
    productSet(input: $input, synchronous: true, identifier: $identifier) {
      product { id title handle status }
      userErrors { field message }
    }
  }`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({
      query,
      variables: {
        input: {
          title: input.title,
          handle: input.handle,
          descriptionHtml: input.descriptionHtml,
          vendor: input.vendor,
          productType: input.productType,
          tags: input.tags,
          status: "DRAFT",
          seo: input.seo,
        },
        identifier: input.id ? { id: input.id } : { handle: input.handle },
      },
    }),
  });

  if (!response.ok) throw new Error(`Shopify API request failed (${response.status}).`);
  const payload = (await response.json()) as ShopifyProductSetResponse;
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join("; "));
  const mutation = payload.data?.productSet;
  if (!mutation?.product || mutation.userErrors?.length) {
    throw new Error(mutation?.userErrors?.map((error) => error.message).join("; ") || "Shopify product projection failed.");
  }
  if (mutation.product.status !== "DRAFT") throw new Error("Shopify projection refused the required DRAFT status.");
  return mutation.product;
}
