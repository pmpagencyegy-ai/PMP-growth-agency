import { serviceIds } from "./content";
export type Inquiry = {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  message: string;
  website: string;
  locale: string;
  sourcePath: string;
  requestId: string;
};
export function validateInquiry(input: unknown): {
  data?: Inquiry;
  fieldErrors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { fieldErrors: { form: "Invalid request." } };
  const raw = input as Record<string, unknown>;
  const keys = [
    "name",
    "email",
    "phone",
    "serviceId",
    "message",
    "website",
    "locale",
    "sourcePath",
    "requestId",
  ];
  if (Object.keys(raw).some((k) => !keys.includes(k)))
    errors.form = "Unexpected fields.";
  if (Object.values(raw).some((v) => typeof v !== "string"))
    errors.form = "Invalid field type.";
  const d = Object.fromEntries(
    keys.map((k) => [k, typeof raw[k] === "string" ? raw[k].trim() : ""]),
  ) as Inquiry;
  if (d.name.length < 2 || d.name.length > 100)
    errors.name = "Enter a name between 2 and 100 characters.";
  if (d.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
    errors.email = "Enter a valid email address.";
  const digits = d.phone.replace(/\D/g, "");
  if (
    d.phone &&
    (d.phone.length > 32 ||
      !/^[+\d\s()-]+$/.test(d.phone) ||
      digits.length < 7 ||
      digits.length > 15)
  )
    errors.phone = "Enter a valid phone number.";
  if (![...serviceIds, "not-sure"].includes(d.serviceId))
    errors.serviceId = "Select a service.";
  if (d.message.length < 20 || d.message.length > 3000)
    errors.message = "Use 20 to 3000 characters.";
  if (d.locale !== "en") errors.locale = "Unsupported locale.";
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      d.requestId,
    )
  )
    errors.requestId = "Invalid request ID.";
  if (
    d.sourcePath &&
    (d.sourcePath.length > 256 || !/^\/(?!\/)[^?#\r\n]*$/.test(d.sourcePath))
  )
    errors.sourcePath = "Invalid source path.";
  if (d.website) errors.website = "Invalid request.";
  return {
    data: Object.keys(errors).length ? undefined : d,
    fieldErrors: errors,
  };
}
