import { test } from "node:test";
import assert from "node:assert/strict";
import {
  c,
  href,
  validLocale,
  serviceFrom,
  publishable,
  assets,
  type Project,
} from "../lib/content";
import { validateInquiry } from "../lib/inquiry-validation";
const valid = {
  name: "اسم العميل",
  email: "person@example.com",
  phone: "+20 122 222 4695",
  serviceId: "branding",
  message: "We would like to discuss our brand identity.",
  website: "",
  locale: "en",
  sourcePath: "/en/contact",
  requestId: "67fd10df-26da-4b09-8f88-e1b3c9abde12",
};
test("locale helpers preserve parameters and anchors; Arabic stays inactive", () => {
  assert.equal(
    href("/contact?service=branding#inquiry"),
    "/en/contact?service=branding#inquiry",
  );
  assert.equal(href("/"), "/en");
  assert.equal(href("/#services"), "/en#services");
  assert.equal(validLocale("ar"), false);
  assert.throws(() => href("/contact", "ar"));
  assert.throws(() => href("//example.com"));
});
test("all six services have capabilities and valid prefill values", () => {
  assert.equal(c.services.length, 6);
  for (const s of c.services) {
    assert.ok(serviceFrom(s.id));
    assert.ok(s.groups.every((g) => g.items.length > 0));
  }
  assert.equal(serviceFrom("made-up"), undefined);
  assert.equal(serviceFrom("not-sure"), undefined);
  assert.equal(c.services[5].groups.length, 2);
});
test("publication requires approval and real approved assets", () => {
  const project: Project = {
    id: "fixture",
    slug: "fixture",
    title: "Fixture",
    summary: "Approved example",
    serviceIds: ["branding"],
    coverAssetId: "fixture-cover",
    galleryAssetIds: [],
    challenge: "A clear challenge",
    approach: "A clear approach",
    deliverables: ["Identity"],
    status: "published",
    ownerApproved: true,
  };
  assert.equal(publishable(project), false);
  assets.push({
    id: "fixture-cover",
    status: "approved",
    src: "/test.webp",
    alt: "Identity",
    permissionApproved: true,
    width: 800,
    height: 600,
  });
  assert.equal(publishable(project), true);
  assert.equal(publishable({ ...project, ownerApproved: false }), false);
  assert.equal(publishable({ ...project, status: "draft" }), false);
  assert.equal(publishable({ ...project, title: "Placeholder" }), false);
  assert.equal(publishable({ ...project, serviceIds: ["unknown"] }), false);
  assets.pop();
});
test("inquiry accepts international names and personal emails", () => {
  assert.deepEqual(validateInquiry(valid).fieldErrors, {});
});
test("inquiry rejects malformed, oversize and unsolicited fields", () => {
  for (const patch of [
    { name: "a" },
    { email: "invalid\r\nBcc:person@test.com" },
    { phone: "letters" },
    { message: "too short" },
    { message: "x".repeat(3001) },
    { website: "spam" },
    { locale: "ar" },
    { serviceId: "fake" },
    { requestId: "bad" },
    { sourcePath: "//example.com" },
    { sourcePath: "/en/contact?email=private" },
    { extra: "secret" },
    { phone: 123 },
  ])
    assert.ok(
      Object.keys(validateInquiry({ ...valid, ...patch }).fieldErrors).length,
      JSON.stringify(patch),
    );
  assert.ok(validateInquiry(null).fieldErrors.form);
});
