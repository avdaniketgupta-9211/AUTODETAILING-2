import { readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { services } from "../../src/data/services";

test("desktop Services dropdown opens on hover and links every service", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop hover behaviour");

  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await nav.getByRole("link", { name: "Services" }).hover();

  const panel = page.locator("#services-dropdown");
  await expect(panel).toBeVisible();
  const links = panel.getByRole("link");
  await expect(links).toHaveCount(services.length + 1);
  await expect(links.first()).toHaveAttribute("href", "/services/engine-repair");

  // Moving the pointer from the trigger into the panel must not close it.
  await links.first().hover();
  await expect(panel).toBeVisible();
  await links.first().click();
  await expect(page).toHaveURL(/\/services\/engine-repair$/);
  await expect(page.locator("h1")).toContainText("Engine Repair");
});

test("Services dropdown supports keyboard navigation", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop keyboard behaviour");

  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Show services menu" });
  await trigger.focus();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#services-dropdown").getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#services-dropdown")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile Services accordion navigates and closes the menu", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile accordion behaviour");

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await dialog.getByRole("button", { name: "Show services" }).click();

  const list = dialog.locator("#mobile-services-list");
  await expect(list.getByRole("link")).toHaveCount(services.length);
  await list.getByRole("link", { name: "Brake Service" }).click();
  await expect(page).toHaveURL(/\/services\/brakes$/);
  await expect(dialog).toBeHidden();
});

for (const slug of ["engine-repair", "smog-check", "towing"]) {
  test(`service page /services/${slug} renders real content and CTAs`, async ({ page }) => {
    const service = services.find((item) => item.slug === slug)!;
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`/services/${slug}`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText(service.name);
    await expect(page).toHaveTitle(/Rollings Automotive/);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Why Rollings" })).toBeVisible();
    await expect(page.locator(`img[alt="${service.alt}"]`).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /view all services/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /request a consultation/i })).toBeVisible();
    await expect(page.locator('a[href="tel:+17148706900"]:visible').first()).toBeVisible();
    expect(errors.filter((e) => !/maps\.google|google\.com/.test(e))).toEqual([]);
  });
}

test("chatbot welcomes, answers with verified links and handles quick actions", async ({ page, isMobile }) => {
  test.skip(isMobile, "full chat flow verified on desktop");

  await page.goto("/");
  await page.getByRole("button", { name: "Open chat" }).click();
  const panel = page.getByRole("dialog", { name: "Chat with Rollings Automotive" });
  await expect(panel).toBeVisible();
  await expect(panel.getByText("Hi! 👋 Welcome! How can we help you today?")).toBeVisible();

  const quick = panel.locator("button");
  await expect(quick.filter({ hasText: "Explore Our Services" })).toBeVisible();
  await expect(quick.filter({ hasText: "Get a Free Estimate" })).toBeVisible();
  await expect(quick.filter({ hasText: "Contact Our Team" })).toBeVisible();
  await expect(quick.filter({ hasText: "Ask a Question" })).toBeVisible();

  await quick.filter({ hasText: "Ask a Question" }).click();
  const input = panel.getByRole("textbox", { name: "Ask a question" });
  await expect(input).toBeFocused();
  await input.fill("How much are brakes?");
  await panel.getByRole("button", { name: "Send message" }).click();
  await expect(panel.getByText(/Inspection, pads, rotors and complete brake jobs/)).toBeVisible();
  await expect(panel.getByRole("link", { name: /explore brake service/i })).toHaveAttribute("href", "/services/brakes");
});

test("chat estimate form submits only once and stores the lead", async ({ page, isMobile }) => {
  test.skip(isMobile, "full chat flow verified on desktop");

  await page.goto("/");
  await page.getByRole("button", { name: "Open chat" }).click();
  const panel = page.getByRole("dialog", { name: "Chat with Rollings Automotive" });
  await panel.getByRole("button", { name: "Get a Free Estimate" }).click();

  await panel.getByLabel("Name").fill("QA Tester");
  await panel.getByLabel("Phone Number").fill("7148706900");
  await panel.getByLabel("Email (Optional)").fill("qa@example.com");
  await panel.getByLabel("How can we help you?").fill("Please call me about brake service and an estimate.");
  // Let the spam heuristic's minimum-fill window elapse.
  await page.waitForTimeout(2700);
  const submit = panel.getByRole("button", { name: /send request/i });
  await submit.click();
  await expect(panel.getByText("Thanks — your request has been sent. We’ll be in touch.")).toBeVisible();

  const stored = await readFile(path.join(process.cwd(), ".data", "chat-leads.jsonl"), "utf8");
  expect(stored).toContain("QA Tester");
  expect(stored).toContain("brake service");
});

test("quick actions navigate and chatbot never overlaps the phone CTA", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat" }).click();
  const launcher = page.locator("[data-chat-launcher]");
  const phone = page.locator('nav[aria-label="Primary"] a[href^="tel:"]:visible');
  const a = await launcher.boundingBox();
  const b = await phone.boundingBox();
  if (a && b) {
    const overlaps = a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    expect(overlaps).toBe(false);
  }

  await page.getByRole("dialog", { name: "Chat with Rollings Automotive" })
    .getByRole("button", { name: "Explore Our Services" }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(launcher).toBeVisible();
});

test("open chat does not cause horizontal overflow on a small screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/services/brakes");
  await page.getByRole("button", { name: "Open chat" }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
