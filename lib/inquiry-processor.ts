import type { Inquiry } from "./inquiry-validation";
export type InquiryStore = {
  get: (key: string) => Promise<string | null>;
  claim: (key: string, value: string) => Promise<boolean>;
  complete: (key: string, value: string) => Promise<void>;
  release: (key: string) => Promise<void>;
  allow: () => Promise<boolean>;
};
export async function processInquiry(
  data: Inquiry,
  fingerprint: string,
  store: InquiryStore,
  send: (d: Inquiry) => Promise<boolean>,
) {
  const key = `pmp:request:${data.requestId}`;
  const error = (status: number, code: string) => ({
    status,
    body: { ok: false, code },
  });
  try {
    const previous = await store.get(key);
    if (previous === `done:${fingerprint}`)
      return { status: 200, body: { ok: true, requestId: data.requestId } };
    if (previous) return error(503, "UNAVAILABLE");
    if (!(await store.allow())) return error(429, "RATE_LIMITED");
    if (!(await store.claim(key, `pending:${fingerprint}`)))
      return error(503, "UNAVAILABLE");
    // Unknown transport outcomes keep the pending key, avoiding an accidental resend.
    if (!(await send(data))) {
      await store.release(key);
      return error(502, "DELIVERY_FAILED");
    }
    await store.complete(key, `done:${fingerprint}`);
    return { status: 200, body: { ok: true, requestId: data.requestId } };
  } catch {
    return error(503, "UNAVAILABLE");
  }
}
