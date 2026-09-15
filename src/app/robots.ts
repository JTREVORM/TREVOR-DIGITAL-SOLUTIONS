import type { MetadataRoute } from "next"
import { site } from "@/lib/site"

/**
 * robots.txt
 *
 * The admin portal is excluded here for tidiness, but that is not what keeps
 * it private — robots.txt is a request, not a control. Access is enforced by
 * src/proxy.ts, the role check in the dashboard layout, and RLS. The portal
 * also sends `noindex` in its own metadata.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          // Transactional, for people holding a link from an email. There is
          // nothing here for a search result to lead to.
          "/unsubscribe",
          // Query-string variants of listing pages would otherwise be indexed
          // as separate URLs with duplicate content.
          "/*?*",
        ],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
