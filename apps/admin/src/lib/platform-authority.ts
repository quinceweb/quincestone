export type PlatformRole = "admin" | "operator";

/**
 * Server-only contract for privileged admin routes.
 *
 * The caller must supply identity from the authenticated server request context;
 * client-provided user IDs are never accepted. The concrete session adapter is
 * intentionally added with the first protected route so no service-role secret
 * is accidentally imported into a browser bundle.
 */
export async function requirePlatformRole(required: PlatformRole = "admin", authenticatedUserId?: string) {
  if (!authenticatedUserId) {
    throw new Error("Platform authority requires a trusted authenticated request identity");
  }

  throw new Error(`Platform ${required} authorization adapter is not configured`);
}
