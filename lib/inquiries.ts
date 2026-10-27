import "server-only";
import type { Inquiry } from "./inquiry-validation";
export function inquiryReady() {
  return (
    process.env.INQUIRY_ENABLED === "true" &&
    !!process.env.PRIVACY_REVISION &&
    !!process.env.PRIVACY_NOTICE &&
    [
      "SITE_URL",
      "EMAIL_API_KEY",
      "INQUIRY_FROM",
      "INQUIRY_TO",
      "RATE_LIMIT_REDIS_URL",
      "RATE_LIMIT_REDIS_TOKEN",
    ].every((k) => !!process.env[k]) &&
    process.env.TRUSTED_CLIENT_IP_HEADER === "x-vercel-forwarded-for"
  );
}
export type Delivery = (data: Inquiry) => Promise<boolean>;
export async function deliver(data: Inquiry): Promise<boolean> {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: AbortSignal.timeout(15000),
    headers: {
      Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `pmp-${data.requestId}`,
    },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM,
      to: [process.env.INQUIRY_TO],
      reply_to: data.email,
      subject: `PMP project inquiry: ${data.serviceId}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "Not supplied"}\nService: ${data.serviceId}\n\n${data.message}`,
    }),
  });
  if (!r.ok) return false;
  const result = await r.json();
  return typeof result.id === "string" && result.id.length > 0;
}
// Redis atomic limits and retry state work across server instances. No inquiry bodies are stored.
export async function redis(command: (string | number)[]) {
  const r = await fetch(process.env.RATE_LIMIT_REDIS_URL!, {
    method: "POST",
    signal: AbortSignal.timeout(5000),
    headers: {
      Authorization: `Bearer ${process.env.RATE_LIMIT_REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!r.ok) throw new Error("Storage unavailable");
  const d = await r.json();
  if (d.error) throw new Error("Storage unavailable");
  return d.result;
}
