import { test } from "node:test";
import assert from "node:assert/strict";
import { processInquiry, type InquiryStore } from "../lib/inquiry-processor";
import type { Inquiry } from "../lib/inquiry-validation";
const data: Inquiry = {
  name: "Test Name",
  email: "test@example.com",
  phone: "",
  serviceId: "branding",
  message: "A valid test project message.",
  website: "",
  locale: "en",
  sourcePath: "/en/contact",
  requestId: "67fd10df-26da-4b09-8f88-e1b3c9abde12",
};
function store() {
  const map = new Map<string, string>();
  const adapter: InquiryStore = {
    get: async (k) => map.get(k) || null,
    claim: async (k, v) => {
      if (map.has(k)) return false;
      map.set(k, v);
      return true;
    },
    complete: async (k, v) => {
      map.set(k, v);
    },
    release: async (k) => {
      map.delete(k);
    },
    allow: async () => true,
  };
  return adapter;
}
test("provider acceptance succeeds and completed retry never sends twice", async () => {
  const db = store();
  let sends = 0;
  const transport = async () => {
    sends++;
    return true;
  };
  assert.equal((await processInquiry(data, "hash", db, transport)).status, 200);
  assert.equal((await processInquiry(data, "hash", db, transport)).status, 200);
  assert.equal(sends, 1);
  assert.equal(
    (await processInquiry(data, "different", db, transport)).status,
    503,
  );
  assert.equal(sends, 1);
});
test("provider rejection fails honestly and allows a deliberate retry", async () => {
  const db = store();
  assert.equal(
    (await processInquiry(data, "hash", db, async () => false)).status,
    502,
  );
  assert.equal(
    (await processInquiry(data, "hash", db, async () => true)).status,
    200,
  );
});
test("parallel retries never deliver twice", async () => {
  const db = store();
  let sends = 0;
  const transport = async () => {
    sends++;
    return true;
  };
  const results = await Promise.all([
    processInquiry(data, "hash", db, transport),
    processInquiry(data, "hash", db, transport),
  ]);
  assert.equal(sends, 1);
  assert.ok(results.some((r) => r.status === 200));
});
test("throttling and failed storage prevent delivery", async () => {
  const db = store();
  let sends = 0;
  const transport = async () => {
    sends++;
    return true;
  };
  db.allow = async () => false;
  assert.equal((await processInquiry(data, "hash", db, transport)).status, 429);
  db.get = async () => {
    throw new Error("offline");
  };
  assert.equal((await processInquiry(data, "hash", db, transport)).status, 503);
  assert.equal(sends, 0);
});
test("ambiguous network error retains pending state and blocks retry", async () => {
  const db = store();
  let sends = 0;
  const transport = async () => {
    sends++;
    throw new Error("timeout");
  };
  assert.equal((await processInquiry(data, "hash", db, transport)).status, 503);
  assert.equal((await processInquiry(data, "hash", db, transport)).status, 503);
  assert.equal(sends, 1);
});
