export type ReturnDestination = "shop" | "account" | "app";

const RETURN_DESTINATIONS: Record<ReturnDestination, string> = {
  shop: "https://shop.quincestone.com",
  account: "https://account.quincestone.com",
  app: "https://app.quincestone.com",
};

export function parseReturnDestination(value: string | null | undefined): ReturnDestination {
  if (value === "shop" || value === "app" || value === "account") return value;
  return "account";
}

export function returnDestinationUrl(value: string | null | undefined) {
  return RETURN_DESTINATIONS[parseReturnDestination(value)];
}
