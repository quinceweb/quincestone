"use server";

import { revalidatePath } from "next/cache";
import { createCommerceAuthorityClient } from "@/lib/commerce";
import { projectProductToShopify } from "@/lib/shopify";
import { requirePlatformRole, recordPlatformAudit } from "@/lib/platform-authority";

export async function syncProductToShopify(productId: string): Promise<void> {
  const { user } = await requirePlatformRole("operator");
  const supabase = createCommerceAuthorityClient();
  const target = String(productId || "").trim();
  if (!target) throw new Error("Product is required.");

  const { data: ready, error: gateError } = await supabase.rpc("commerce_shopify_projection_ready", { target_product: target });
  if (gateError) throw new Error("Could not verify the Shopify projection gate.");
  if (ready !== true) {
    await supabase.from("commerce_shopify_products").upsert({
      product_id: target,
      sync_status: "blocked",
      last_attempted_at: new Date().toISOString(),
      last_error: "Quincestone launch gates are incomplete.",
    });
    await recordPlatformAudit({ action: "product.shopify.sync_blocked", resourceType: "product", resourceId: target, metadata: { reason: "launch_gate" } });
    throw new Error("Shopify projection is blocked until the Quincestone launch gates pass.");
  }

  const { data: product, error: productError } = await supabase
    .from("commerce_products")
    .select("id,name,slug,description,seo_title,seo_description,collection")
    .eq("id", target)
    .maybeSingle();
  if (productError || !product) throw new Error("Product not found.");

  const { data: content } = await supabase
    .from("commerce_product_content")
    .select("headline,short_description,seo_title,seo_description")
    .eq("product_id", target)
    .maybeSingle();

  const { data: existingMapping } = await supabase
    .from("commerce_shopify_products")
    .select("shopify_product_gid")
    .eq("product_id", target)
    .maybeSingle();

  await supabase.from("commerce_shopify_products").upsert({
    product_id: target,
    sync_status: "pending",
    last_attempted_at: new Date().toISOString(),
    last_error: null,
  });

  try {
    const remote = await projectProductToShopify({
      id: existingMapping?.shopify_product_gid || undefined,
      title: product.name,
      handle: product.slug,
      descriptionHtml: content?.short_description || product.description || undefined,
      vendor: "Quincestone",
      productType: product.collection || "General",
      tags: ["quincestone", product.collection].filter(Boolean),
      status: "DRAFT",
      seo: {
        title: content?.seo_title || product.seo_title || undefined,
        description: content?.seo_description || product.seo_description || undefined,
      },
    });

    await supabase.from("commerce_shopify_products").upsert({
      product_id: target,
      shopify_product_gid: remote.id,
      sync_status: "synced",
      remote_status: "draft",
      last_synced_at: new Date().toISOString(),
      last_attempted_at: new Date().toISOString(),
      last_error: null,
    });

    await recordPlatformAudit({
      action: "product.shopify.synced",
      resourceType: "product",
      resourceId: target,
      metadata: { shopify_product_gid: remote.id, remote_status: "draft", actor_user_id: user.id },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Shopify projection failed.";
    await supabase.from("commerce_shopify_products").upsert({
      product_id: target,
      sync_status: "failed",
      last_attempted_at: new Date().toISOString(),
      last_error: message.slice(0, 1000),
    });
    await recordPlatformAudit({ action: "product.shopify.sync_failed", resourceType: "product", resourceId: target, metadata: { reason: message.slice(0, 500) } });
    throw new Error(message);
  }

  revalidatePath(`/commerce/products/${target}`);
  revalidatePath("/commerce");
}
