/**
 * Client testimonials.
 *
 * IMPORTANT — these three entries are the ones that already existed in the
 * project. They are carried over unchanged rather than rewritten, because
 * editing a client's words is not ours to do, and no new ones have been
 * invented.
 *
 * They render as they did before, so nothing has been taken off the live site.
 * The `verified` flag is the control: set an entry to false and it stops being
 * published immediately, with no other code change.
 *
 * ACTION NEEDED: confirm that written permission from each person quoted is on
 * file. Publishing a testimonial the named person has not approved is a
 * credibility risk and, in many jurisdictions, a legal one. Flip any entry you
 * cannot confirm to `verified: false`.
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
    verified: true,
  },
  {
    name: "David Otim",
    role: "CEO",
    company: "FinTech Africa",
    quote:
      "The API integrations and custom dashboards they built for our trading platform are world-class. Highly recommended for any complex software needs.",
    verified: true,
  },
  {
    name: "Dr. Grace N.",
    role: "Medical Director",
    company: "Kampala Medical Center",
    quote:
      "Our hospital management system was outdated and slow. Trevor and his team developed a modern, secure solution that our staff loves using every day.",
    verified: true,
  },
]

/** The only list the site should render. */
export const publishedTestimonials = testimonials.filter((item) => item.verified)
