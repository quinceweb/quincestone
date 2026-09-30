export type BusinessContextInput = {
  description: string;
  offerings: string[];
  primaryCustomers: string;
  operatingRegion: string | null;
  website: string | null;
};

export function canManageBusinessContext(role: string) { return role === "owner" || role === "admin"; }

export function validateBusinessContext(input: BusinessContextInput) {
  const description = input.description.trim();
  const offerings = [...new Set(input.offerings.map((value) => value.trim()).filter(Boolean))];
  const primaryCustomers = input.primaryCustomers.trim();
  const operatingRegion = input.operatingRegion?.trim() || null;
  const website = input.website?.trim() || null;
  if (description.length < 10 || description.length > 1000) throw new Error("Business description must be between 10 and 1,000 characters.");
  if (offerings.length < 1 || offerings.length > 12 || offerings.some((value) => value.length < 2 || value.length > 120)) throw new Error("Add between 1 and 12 offerings, each between 2 and 120 characters.");
  if (primaryCustomers.length < 2 || primaryCustomers.length > 500) throw new Error("Customer context must be between 2 and 500 characters.");
  if (operatingRegion && (operatingRegion.length < 2 || operatingRegion.length > 120)) throw new Error("Operating region must be between 2 and 120 characters.");
  if (website) {
    let parsed: URL;
    try { parsed = new URL(website); } catch { throw new Error("Website must be a valid HTTPS URL."); }
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || website.length > 300) throw new Error("Website must be a valid HTTPS URL.");
  }
  return { description, offerings, primaryCustomers, operatingRegion, website };
}
