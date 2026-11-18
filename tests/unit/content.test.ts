import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { business, brands } from "@/data/business";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { mainNav, classicGallery } from "@/data/navigation";

const pub = (p: string) => path.join(process.cwd(), "public", p);

describe("business facts", () => {
  it("matches the verified contact details", () => {
    expect(business.phoneDisplay).toBe("(714) 870-6900");
    expect(business.phoneHref).toBe("tel:+17148706900");
    expect(business.email).toBe("info@rollingsautomotive.com");
    expect(business.address.street).toBe("242 W Commonwealth Ave");
    expect(business.founded).toBe(1974);
  });
});

describe("services", () => {
  it("includes all 13 verified services with unique slugs", () => {
    expect(services).toHaveLength(13);
    expect(new Set(services.map((s) => s.slug)).size).toBe(13);
  });
  it("references images that exist and have alt text", () => {
    for (const s of services) {
      expect(existsSync(pub(s.image)), s.image).toBe(true);
      expect(s.alt.length).toBeGreaterThan(10);
    }
  });
});

describe("authentic content only", () => {
  it("uses only the three published testimonials", () => {
    expect(testimonials.map((t) => t.name)).toEqual(["Ken S.", "Tom C.", "Angela B."]);
  });
  it("lists only brands from the source site", () => {
    expect(brands).toContain("BMW");
    expect(brands).not.toContain("Ferrari");
  });
  it("gallery files exist locally", () => {
    for (const g of classicGallery) expect(existsSync(pub(g.src)), g.src).toBe(true);
  });
});

describe("navigation", () => {
  it("contains the required items in order", () => {
    expect(mainNav.map((n) => n.label)).toEqual(["Home", "Services", "Classic Cars", "Fleet", "About", "Contact"]);
  });
});
