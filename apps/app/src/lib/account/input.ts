export function requiredText(form: FormData, name: string, max: number) {
  const value = String(form.get(name) ?? "").trim();
  if (!value || value.length > max) throw new Error(`Invalid ${name}.`);
  return value;
}
export function optionalText(form: FormData, name: string, max: number) {
  const value = String(form.get(name) ?? "").trim();
  if (value.length > max) throw new Error(`Invalid ${name}.`);
  return value || null;
}
export function countryCode(value: string) {
  const normalized = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(normalized) ? normalized : null;
}
export function safeHttpsUrl(value: string | null | undefined) {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" ? url.toString() : null; }
  catch { return null; }
}
