import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/services", "/classic-cars", "/fleet-maintenance", "/specials", "/contact"];

test.describe("pages", () => {
  for (const route of ROUTES) {
    test(`${route} renders with one h1 and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Rollings Automotive/);
      expect(errors.filter((e) => !/maps\.google|google\.com/.test(e))).toEqual([]);
    });
  }
});

test("hero video and CTAs are present", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Automotive");
  await expect(page.getByRole("link", { name: /explore our services/i })).toHaveAttribute("href", "/services");
  await expect(page.getByRole("link", { name: /contact our team/i })).toHaveAttribute("href", "/contact");
  await expect(page.locator("video")).toHaveCount(1, { timeout: 10_000 });
});

test("contact links are functional", async ({ page }) => {
  await page.goto("/contact");
  const contact = page.locator("#contact");
  await expect(contact.locator('a[href="tel:+17148706900"]').first()).toBeAttached();
  await expect(contact.locator('a[href="mailto:info@rollingsautomotive.com"]')).toHaveCount(1);
  await expect(contact.locator('a[href*="google.com/maps/dir"]')).toHaveCount(1);
});

test("contact form shows validation errors", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByLabel(/^Name/)).toHaveAttribute("aria-invalid", "true");
});

test("topic is preselected from query string", async ({ page }) => {
  await page.goto("/contact?topic=fleet");
  await expect(page.getByLabel(/^Topic/)).toHaveValue("Fleet maintenance");
});

test("navigation works on desktop and mobile", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: /open menu/i }).click();
    await page.getByRole("dialog").getByRole("link", { name: /services/i }).click();
  } else {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services" }).click();
  }
  await expect(page).toHaveURL(/\/services$/);
});

test.describe("no horizontal overflow", () => {
  for (const width of [375, 390, 430, 768, 1024, 1440, 1920]) {
    test(`at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ROUTES) {
        await page.goto(route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, route).toBeLessThanOrEqual(1);
      }
    });
  }
});

test("reduced motion shows content without intro curtain", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".intro-curtain")).toBeHidden();
  await ctx.close();
});

test("images have alt attributes and buttons have names", async ({ page }) => {
  await page.goto("/");
  const missingAlt = await page.locator("img:not([alt])").count();
  expect(missingAlt).toBe(0);
  const unnamed = await page.evaluate(() =>
    Array.from(document.querySelectorAll("button, a[href]")).filter(
      (el) => !(el.textContent?.trim() || el.getAttribute("aria-label")) && !el.closest("[aria-hidden='true']"),
    ).length,
  );
  expect(unnamed).toBe(0);
});
