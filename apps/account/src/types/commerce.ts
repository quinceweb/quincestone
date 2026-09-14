export type OrderStatus = "pending" | "confirmed" | "processing" | "fulfilled" | "cancelled" | "refunded";
export type ReturnStatus = "eligible" | "requested" | "approved" | "in_transit" | "received" | "refunded" | "closed";

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  quantity: number;
  canonicalShopUrl: string;
  imageUrl?: string | null;
}

export interface AccountOrder {
  id: string;
  displayId: string;
  createdAt: string;
  status: OrderStatus;
  currency: string;
  totalMinor: number;
  fulfillmentStatus?: string | null;
  items: OrderItem[];
}

export interface SavedProductReference {
  productId: string;
  title: string;
  canonicalShopUrl: string;
  imageUrl?: string | null;
  publicationState: "published" | "unpublished" | "unknown";
  verifiedPriceMinor?: number | null;
  currency?: string | null;
}
