/**
 * Client testimonials.
 *
 * STATUS: unpublished pending verification.
 *
 * These three entries arrived in the original project scaffold, alongside the
 * four placeholder projects ("Enterprise SaaS Analytics Dashboard" and the
 * rest) that were replaced with the real TDS portfolio in Phase 3. That makes
 * it likely they are scaffold data rather than real clients, and no written
 * confirmation has been provided for any of them.
 *
 * Because the site is now going to be indexed publicly, they are set to
 * `verified: false`: the quotes are kept here verbatim, but the testimonials
 * page shows an honest "published only with permission" state instead of
 * attributing words to named people and companies that cannot be confirmed.
 * Publishing an unverified testimonial is a credibility risk and, in many
 * jurisdictions, a legal one.
 *
 * TO PUBLISH: once you hold written permission from the person quoted, set
 * that entry's `verified` back to true. Nothing else needs changing.
 */

export type Testimonial = {
  name: string
  role: string
  company: string
  quote: string
  /** Published only while true. Set false if consent is not on file. */
  verified: boolean
}

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Kyomugisha",
    role: "Operations Director",
    company: "Lakeside Logistics",
    quote:
      "Trevor Digital Solutions completely transformed our supply chain with their custom ERP system. It's fast, reliable, and the support has been outstanding.",
    verified: false,
  },
  {
    name: "David Otim",
    role: "CEO",
    company: "FinTech Africa",
    quote:
      "The API integrations and custom dashboards they built for our trading platform are world-class. Highly recommended for any complex software needs.",
    verified: false,
  },
  {
    name: "Dr. Grace N.",
    role: "Medical Director",
    company: "Kampala Medical Center",
    quote:
      "Our hospital management system was outdated and slow. Trevor and his team developed a modern, secure solution that our staff loves using every day.",
    verified: false,
  },
]

/** The only list the site should render. */
export const publishedTestimonials = testimonials.filter((item) => item.verified)
