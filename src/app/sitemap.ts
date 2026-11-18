import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<[string, number]> = [
    ["", 1],
    ["/services", 0.9],
    ["/classic-cars", 0.8],
    ["/fleet-maintenance", 0.8],
    ["/contact", 0.8],
    ["/specials", 0.5],
  ];
  return routes.map(([path, priority]) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
