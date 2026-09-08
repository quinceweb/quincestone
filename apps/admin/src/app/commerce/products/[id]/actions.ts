"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformRole } from "@/lib/platform-authority";
import { createCommerceAuthorityClient } from "@/lib/commerce";

type MediaAction = "APPROVE" | "REJECT" | "MARK_CONCEPT" | "MARK_VERIFIED" | "RESTRICT" | "UNPUBLISH";

export async function reviewProductMedia(productId: string, mediaId: string, action: MediaAction) {
  await requirePlatformRole("operator");
  const supabase = createCommerceAuthorityClient();
  const { data: media, error: mediaError } = await supabase.from("commerce_product_media").select("id,product_id,rights_status,publication_permission,source,verification_status,publication_status").eq("id", mediaId).eq("product_id", productId).maybeSingle();
  if (mediaError || !media) throw new Error("Media record not found.");

  const patch = action === "APPROVE"
    ? { rights_status: "approved", verification_status: "verified", publication_status: "published", publication_permission: true }
    : action === "REJECT"
      ? { rights_status: "rejected", verification_status: "unverified", publication_status: "unpublished", publication_permission: false }
      : action === "MARK_CONCEPT"
        ? { source: "CONCEPT_MEDIA", verification_status: "unverified", publication_status: "unpublished", publication_permission: false }
        : action === "MARK_VERIFIED"
          ? media.rights_status === "approved"
            ? { verification_status: "verified" }
            : { verification_status: "unverified", publication_status: "unpublished", publication_permission: false }
          : action === "RESTRICT"
            ? { rights_status: "restricted", verification_status: "unverified", publication_status: "restricted", publication_permission: false }
            : { publication_status: "unpublished", publication_permission: false };

  const { error } = await supabase.from("commerce_product_media").update(patch).eq("id", mediaId).eq("product_id", productId);
  if (error) throw new Error("Media review update failed.");
  await supabase.from("commerce_audit_events").insert({ action: `product.media.${action.toLowerCase()}`, resource_type: "product_media", resource_id: mediaId, metadata: { product_id: productId } });
  revalidatePath(`/commerce/products/${productId}`);
  revalidatePath("/commerce");
}
