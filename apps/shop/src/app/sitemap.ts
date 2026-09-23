import type { MetadataRoute } from "next";

const routes = ["", "/products", "/travel", "/drive", "/companion", "/home-outdoor", "/search", "/standard", "/shipping", "/returns", "/support"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({ url: `https://shop.quincestone.com${path}`, changeFrequency: path ? "weekly" : "daily", priority: path ? 0.7 : 1 }));
}
