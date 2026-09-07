export type ProductPublicationState = "DRAFT" | "INTERNAL_ONLY" | "COMING_SOON" | "WAITLIST" | "PUBLISHED";

export type ProductMediaStatus =
  | "VERIFIED_PRODUCT_MEDIA"
  | "SUPPLIER_AUTHORIZED_MEDIA"
  | "QUINCESTONE_OWNED_MEDIA"
  | "CONCEPT_MEDIA"
  | "DEVELOPMENT_PLACEHOLDER"
  | "RESTRICTED_MEDIA";

export type ProductMediaAsset = {
  productId: string;
  variantId?: string | null;
  type: string;
  source: ProductMediaStatus;
  rightsStatus: "PENDING" | "AUTHORIZED" | "OWNED" | "RESTRICTED";
  verificationStatus: "UNVERIFIED" | "VERIFIED";
  publicationStatus: "UNPUBLISHED" | "PUBLISHED" | "RESTRICTED";
  altText?: string | null;
  sortOrder?: number | null;
  aspectRatio?: number | null;
  width?: number | null;
  height?: number | null;
  skuAssociation?: string | null;
  notes?: string | null;
};

export function isPublicProductState(publicationState: string | null | undefined) {
  return publicationState === "PUBLISHED";
}

export function isPublicMedia(asset: ProductMediaAsset) {
  return (
    asset.publicationStatus === "PUBLISHED" &&
    asset.rightsStatus !== "RESTRICTED" &&
    asset.verificationStatus === "VERIFIED" &&
    asset.source !== "CONCEPT_MEDIA" &&
    asset.source !== "DEVELOPMENT_PLACEHOLDER" &&
    asset.source !== "RESTRICTED_MEDIA"
  );
}

export function renderVerified<T>(value: T | null | undefined, verified: boolean) {
  return verified ? value ?? null : null;
}
