import type { MetadataRoute } from "next";
import { artworks, artists } from "@/lib/artworks";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    ...["explore", "artists", "collections", "about", "privacy", "terms"].map((route) => ({
      url: `${baseUrl}/${route}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...artworks.map((artwork) => ({ url: `${baseUrl}/artwork/${artwork.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...artists.map((artist) => ({ url: `${baseUrl}/artists/${artist.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
