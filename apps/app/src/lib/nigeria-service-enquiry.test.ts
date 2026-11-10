import { describe, expect, it } from "vitest";
import { parseServiceEnquiry } from "./nigeria-service-enquiry";

const valid = {
  customerName: "Ada Okafor",
  phone: "+2348031234567",
  serviceCategory: "ac_maintenance",
  serviceLocation: "Ikeja, Lagos",
  description: "Commercial AC unit is not cooling.",
  idempotencyKey: "service-request-0001",
};

describe("Nigeria service enquiry validation", () => {
  it("accepts valid Lagos AC enquiries", () => {
    expect(parseServiceEnquiry(valid)).toMatchObject(valid);
  });
  it("normalizes locally formatted Nigerian mobile numbers", () => {
    expect(parseServiceEnquiry({ ...valid, phone: "0803 123 4567" }).phone).toBe("08031234567");
  });
  it("rejects unsupported categories", () => {
    expect(() => parseServiceEnquiry({ ...valid, serviceCategory: "investment" })).toThrow("Unsupported service category");
  });
  it("rejects missing location and short descriptions", () => {
    expect(() => parseServiceEnquiry({ ...valid, serviceLocation: "" })).toThrow("Service location");
    expect(() => parseServiceEnquiry({ ...valid, description: "broken" })).toThrow("Problem description");
  });
  it("rejects invalid phone numbers and missing idempotency", () => {
    expect(() => parseServiceEnquiry({ ...valid, phone: "123" })).toThrow("Nigerian mobile");
    expect(() => parseServiceEnquiry({ ...valid, idempotencyKey: "" })).toThrow("idempotency");
  });
});
