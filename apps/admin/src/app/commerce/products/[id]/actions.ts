"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformRole } from "@/lib/platform-authority";
import { createCommerceAuthorityClient } from "@/lib/commerce";

type MediaAction = "APPROVE" | "REJECT" | "MARK_CONCEPT" | "MARK_VERIFIED" | "RESTRICT" | "UNPUBLISH";
type UploadMediaType = "product" | "detail" | "demonstration" | "lifestyle";

const MEDIA_BUCKET = "commerce-product-media";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function uploadProductMedia(formData: FormData) {
  await requirePlatformRole("operator");

  const productId = String(formData.get("productId") || "").trim();
  const mediaType = String(formData.get("mediaType") || "product") as UploadMediaType;
  const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);

  if (!productId) throw new Error("A product is required.");
  if (!Object.prototype.hasOwnProperty.call(MIME_TO_EXTENSION, files[0]?.type || "")) throw new Error("Only JPEG, PNG, WebP and AVIF images are supported.");
  if (!(["product", "detail", "demonstration", "lifestyle"] as string[]).includes(mediaType)) throw new Error("Unsupported media type.");
  if (!files.length || files.length > 20) throw new Error("Select between 1 and 20 images.");

  for (const file of files) {
    if (!Object.prototype.hasOwnProperty.call(MIME_TO_EXTENSION, file.type)) throw new Error(`Unsupported image type: ${file.type || "unknown"}.`);
    if (file.size > MAX_FILE_BYTES) throw new Error(`Image ${file.name} exceeds the 10 MB limit.`);
  }

  const supabase = createCommerceAuthorityClient();
  const { data: product, error: productError } = await supabase.from("commerce_products").select("id,name,slug").eq("id", productId).maybeSingle();
  if (productError || !product) throw new Error("Product not found.");

  const { data: currentMedia, error: mediaError } = await supabase.from("commerce_product_media").select("sort_order").eq("product_id", productId).order("sort_order", { ascending: false }).limit(1);
  if (mediaError) throw new Error("Could not determine media order.");
  let nextSortOrder = Number(currentMedia?.[0]?.sort_order ?? -1) + 1;

  let uploaded = 0;
  for (const file of files) {
    const extension = MIME_TO_EXTENSION[file.type];
    const storagePath = `products/${product.slug}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) throw new Error(`Storage upload failed for ${file.name}.`);

    const { data: publicAsset } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
    const { error: rowError } = await supabase.from("commerce_product_media").insert({
      product_id: productId,
      asset_url: publicAsset.publicUrl,
      storage_path: storagePath,
      media_type: mediaType,
      alt_text: `${product.name} — ${mediaType} image ${nextSortOrder + 1}`,
      sort_order: nextSortOrder,
      source: "PHOTOROOM",
      rights_status: "pending",
      publication_permission: false,
      verification_status: "unverified",
      publication_status: "unpublished",
      notes: "Uploaded through Quincestone commerce media pipeline; product fidelity and publication rights require operator review.",
    });
    if (rowError) {
      await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
      throw new Error(`Media record could not be created for ${file.name}.`);
    }

    await supabase.from("commerce_audit_events").insert({
      action: "product.media.upload",
      resource_type: "product_media",
      resource_id: storagePath,
      metadata: { product_id: productId, media_type: mediaType, source: "PHOTOROOM", original_filename: file.name },
    });
    uploaded += 1;
    nextSortOrder += 1;
  }

  revalidatePath(`/commerce/products/${productId}`);
  revalidatePath("/commerce/media");
  revalidatePath("/commerce");

  return { uploaded };
}

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
  revalidatePath("/commerce/media");
  revalidatePath("/commerce");
}
