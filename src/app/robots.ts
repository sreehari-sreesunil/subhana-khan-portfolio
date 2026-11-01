import type { MetadataRoute } from "next";

// Private preview: delete this file before launch, and the robots line in layout.tsx.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
