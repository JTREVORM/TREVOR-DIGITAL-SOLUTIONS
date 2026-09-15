import { site } from "@/lib/site"

/**
 * JSON-LD helpers.
 *
 * Emitted as a script tag rather than assembled inline in each page, so the
 * shapes stay consistent and every URL is absolute and built from the one
 * canonical origin in lib/site.ts.
 *
 * Everything here describes facts already published on the site. Nothing
 * asserts a rating, a review, an award or a figure that is not real —
 * inventing those is both dishonest and a manual-action risk with Google.
 */

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The object is built on the server from our own content, never from
      // user input, so there is nothing here for a visitor to inject into.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export type Crumb = { name: string; path: string }

/**
 * BreadcrumbList. `path` is a site-relative path; absolute URLs are built
 * here so a page can never emit a localhost or preview address.
 */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  }
}

export function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
  return <JsonLd data={breadcrumbSchema(crumbs)} />
}

/** Service offered by TDS, linked back to the organisation. */
export function serviceSchema(params: {
  name: string
  description: string
  path: string
  serviceTypes?: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    url: `${site.url}${params.path}`,
    serviceType: params.serviceTypes?.length ? params.serviceTypes : undefined,
    provider: {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
    },
    areaServed: [
      { "@type": "Country", name: "Uganda" },
      { "@type": "Place", name: "Worldwide" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${site.url}/contact`,
    },
  }
}
