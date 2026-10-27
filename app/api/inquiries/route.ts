import { createHash } from "node:crypto";
import { deliver, inquiryReady, redis } from "@/lib/inquiries";
import { validateInquiry } from "@/lib/inquiry-validation";
import { processInquiry } from "@/lib/inquiry-processor";
export const runtime = "nodejs";
function response(status: number, code: string, extra: object = {}) {
  return Response.json(
    { ok: false, code, ...extra },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(status === 429 ? { "Retry-After": "600" } : {}),
      },
    },
  );
}
export async function POST(req: Request) {
  const expected = process.env.SITE_URL
    ? new URL(process.env.SITE_URL).origin
    : `${new URL(req.url).protocol}//${req.headers.get("host") || new URL(req.url).host}`;
  if (req.headers.get("origin") !== expected) return response(403, "FORBIDDEN");
  if (req.headers.get("content-type")?.split(";")[0] !== "application/json")
    return response(415, "UNSUPPORTED_TYPE");
  if (Number(req.headers.get("content-length")) > 16384)
    return response(413, "TOO_LARGE");
  let raw: unknown;
  try {
    const reader = req.body?.getReader();
    if (!reader) return response(400, "INVALID_INPUT");
    let size = 0;
    const chunks = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        return response(413, "TOO_LARGE");
      }
      chunks.push(value);
    }
    raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return response(400, "INVALID_INPUT");
  }
  const { data, fieldErrors } = validateInquiry(raw);
  if (!data) return response(400, "INVALID_INPUT", { fieldErrors });
  if (!inquiryReady()) return response(503, "UNAVAILABLE");
  const ip = req.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim();
  if (!ip) return response(503, "UNAVAILABLE");
  const client = createHash("sha256").update(ip).digest("hex");
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
  const script =
    "local a=redis.call('INCR',KEYS[1]);if a==1 then redis.call('EXPIRE',KEYS[1],600) end;local b=redis.call('INCR',KEYS[2]);if b==1 then redis.call('EXPIRE',KEYS[2],600) end;return (a<=5 and b<=1000) and 1 or 0";
  const result = await processInquiry(
    data,
    fingerprint,
    {
      get: async (key) => await redis(["GET", key]),
      allow: async () =>
        !!(await redis([
          "EVAL",
          script,
          2,
          `pmp:rate:${client}`,
          "pmp:global",
        ])),
      claim: async (key, value) =>
        !!(await redis(["SET", key, value, "NX", "EX", 86400])),
      complete: async (key, value) => {
        await redis(["SET", key, value, "EX", 86400]);
      },
      release: async (key) => {
        await redis(["DEL", key]);
      },
    },
    deliver,
  );
  return Response.json(result.body, {
    status: result.status,
    headers: {
      "Cache-Control": "no-store",
      ...(result.status === 429 ? { "Retry-After": "600" } : {}),
    },
  });
}
