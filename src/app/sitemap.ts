import type { MetadataRoute } from "next"
import { services } from "@/lib/content/services"
import { projects } from "@/lib/content/projects"
import { site } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const pages: MetadataRoute.Sitemap = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/projects", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/technologies", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
    { path: "/founder", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/leadership", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/testimonials", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))

  // Detail pages are statically generated from the content modules, so the
  // sitemap stays in step with them automatically.
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...pages, ...servicePages, ...projectPages]
}
