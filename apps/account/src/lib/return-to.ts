export type ReturnDestination = "shop" | "account" | "app";
export type CallbackErrorCode = "missing_callback_code" | "callback_failed";

const RETURN_DESTINATIONS: Record<ReturnDestination, string> = {
  shop: "https://shop.quincestone.com",
  account: "https://account.quincestone.com",
  app: "https://app.quincestone.com",
};

const CALLBACK_ERROR_MESSAGES: Record<CallbackErrorCode, string> = {
  missing_callback_code: "This sign-in or verification link is incomplete. Please request a new link and try again.",
  callback_failed: "This sign-in or verification link could not be completed. It may have expired; please try again.",
};

export function parseReturnDestination(value: string | null | undefined): ReturnDestination {
  if (value === "shop" || value === "app" || value === "account") return value;
  return "account";
}

export function returnDestinationUrl(value: string | null | undefined, continuation?: string | null) {
  const base = RETURN_DESTINATIONS[parseReturnDestination(value)];
  if (!continuation || !continuation.startsWith("/") || continuation.startsWith("//")) return base;
  try {
    const parsed = new URL(continuation, base);
    return parsed.origin === new URL(base).origin ? parsed.toString() : base;
  } catch { return base; }
}

export function parseSafeAccountPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  try {
    const parsed = new URL(value, "https://account.quincestone.com");
    if (parsed.origin !== "https://account.quincestone.com") return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

export function callbackErrorMessage(value: string | null | undefined): string {
  if (value === "missing_callback_code" || value === "callback_failed") return CALLBACK_ERROR_MESSAGES[value];
  return "";
}
