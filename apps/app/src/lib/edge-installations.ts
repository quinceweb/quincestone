export function normalizeAllowedOrigins(input: unknown) {
  if (!Array.isArray(input) || input.length < 1 || input.length > 25) return null;
  const origins = input.map((value) => {
    if (typeof value !== "string" || value.length > 255) return null;
    try {
      const url = new URL(value.trim());
      const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
      if (url.protocol !== "https:" && !(local && url.protocol === "http:")) return null;
      if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) return null;
      return `${url.protocol}//${url.host}`;
    } catch { return null; }
  });
  if (origins.some((origin) => !origin)) return null;
  return [...new Set(origins as string[])];
}

export function canManageEdge(role: string) {
  return role === "owner" || role === "admin";
}
