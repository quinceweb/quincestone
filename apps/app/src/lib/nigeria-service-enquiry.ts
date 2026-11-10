export const SERVICE_CATEGORIES = ["cleaning", "ac_maintenance", "electrical"] as const;
export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

export type ServiceEnquiryInput = {
  customerName: string;
  phone: string;
  serviceCategory: ServiceCategory;
  serviceLocation: string;
  description: string;
  idempotencyKey: string;
};

const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";

export function parseServiceEnquiry(value: unknown): ServiceEnquiryInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid enquiry.");
  const input = value as Record<string, unknown>;
  const customerName = clean(input.customerName);
  const phone = clean(input.phone).replace(/[\s()-]/g, "");
  const serviceCategory = clean(input.serviceCategory);
  const serviceLocation = clean(input.serviceLocation);
  const description = clean(input.description);
  const idempotencyKey = clean(input.idempotencyKey);

  if (customerName.length < 2 || customerName.length > 160) throw new Error("Customer name must be 2–160 characters.");
  if (!/^(?:\+234[789][01]\d{8}|0[789][01]\d{8})$/.test(phone)) throw new Error("A valid Nigerian mobile number is required.");
  if (!SERVICE_CATEGORIES.includes(serviceCategory as ServiceCategory)) throw new Error("Unsupported service category.");
  if (serviceLocation.length < 5 || serviceLocation.length > 500) throw new Error("Service location must be 5–500 characters.");
  if (description.length < 10 || description.length > 4000) throw new Error("Problem description must be 10–4,000 characters.");
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(idempotencyKey)) throw new Error("A stable idempotency key is required.");
  return { customerName, phone, serviceCategory: serviceCategory as ServiceCategory, serviceLocation, description, idempotencyKey };
}
