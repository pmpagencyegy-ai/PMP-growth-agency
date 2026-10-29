import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("homepage, services, contact prefill and safe inquiry fallback", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Make your",
  );
  await page.getByRole("link", { name: /DESIGNS/ }).click();
  await expect(page).toHaveURL(/services\/branding/);
  await page.getByRole("link", { name: "Build Your Brand" }).first().click();
  await expect(page).toHaveURL(/contact\?service=branding#inquiry/);
  await expect(page.getByLabel("What would you like to work on?")).toHaveValue(
    "branding",
  );
  await expect(
    page.getByRole("button", { name: "Send Inquiry" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("link", { name: "Chat on WhatsApp" }),
  ).toHaveAttribute("href", "https://wa.me/201222224695");
});
test("work filters survive navigation, refresh and back", async ({ page }) => {
  await page.goto("/en/work");
  await page.getByRole("button", { name: "Branding", exact: true }).click();
  await expect(page).toHaveURL(/service=branding/);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Branding", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Social Media", exact: true }).click();
  await expect(page).toHaveURL(/service=social-media/);
  await page.goBack();
  await expect(
    page.getByRole("button", { name: "Branding", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Reset to All Work" }).click();
  await expect(page).toHaveURL(/\/en\/work$/);
});
test("all templates and invalid routes return correct statuses", async ({
  request,
}) => {
  for (const path of [
    "/en",
    "/en/work",
    "/en/services",
    "/en/about",
    "/en/contact",
    "/en/privacy",
    "/en/services/production",
    "/en/services/branding",
    "/en/services/media-coverage",
    "/en/services/social-media",
    "/en/services/media-buying",
    "/en/services/seo-web-development",
  ])
    expect((await request.get(path)).status(), path).toBe(200);
  for (const path of [
    "/ar",
    "/fr",
    "/en/services/fake",
    "/en/work/kavra-brand-identity",
    "/en/missing",
  ])
    expect((await request.get(path)).status(), path).toBe(404);
  expect((await request.get("/en/home", { maxRedirects: 0 })).status()).toBe(
    308,
  );
});
test("mobile menu handles Escape and focus return", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const menu = page.locator(".pmp-menu-toggle");
  await menu.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Services" })
    .click();
  await expect(page).toHaveURL(/\/en#services$/);
  await expect(page.locator("#services")).toBeInViewport();
});
test("responsive layouts have no horizontal overflow", async ({ page }) => {
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/en", "/en/services", "/en/contact"]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} at ${width}`,
      ).toBe(true);
    }
  }
});
test("automated accessibility scans for representative templates", async ({
  page,
}) => {
  for (const path of [
    "/en",
    "/en/services/branding",
    "/en/work",
    "/en/about",
    "/en/contact",
  ]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations,
      `${path}: ${result.violations.map((v) => v.id).join(",")}`,
    ).toEqual([]);
  }
});
test("API rejects invalid content and never simulates successful delivery", async ({
  request,
}) => {
  const headers = {
    origin: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000",
  };
  expect(
    (
      await request.post("/api/inquiries", {
        headers: { ...headers, "content-type": "text/plain" },
        data: "hello",
      })
    ).status(),
  ).toBe(415);
  expect(
    (await request.post("/api/inquiries", { headers, data: {} })).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/inquiries", {
        headers,
        data: {
          name: "Test Name",
          email: "test@example.com",
          phone: "",
          serviceId: "branding",
          message: "A valid inquiry for local validation only.",
          website: "",
          locale: "en",
          sourcePath: "/en/contact",
          requestId: "67fd10df-26da-4b09-8f88-e1b3c9abde12",
        },
      })
    ).status(),
  ).toBe(503);
  expect(
    (
      await request.post("/api/inquiries", {
        headers: { origin: "https://evil.example" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/inquiries", {
        headers,
        data: { message: "x".repeat(17000) },
      })
    ).status(),
  ).toBe(413);
});
