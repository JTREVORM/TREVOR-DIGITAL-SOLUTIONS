/**
 * Company-wide constants: brand strings, navigation and contact details.
 * Anything that appears in more than one place lives here so the navbar,
 * footer, metadata and contact pages can never drift apart.
 */

export const site = {
  name: "Trevor Digital Solutions",
  shortName: "TDS",
  tagline: "Transforming ideas into powerful digital solutions.",
  url: "https://trevordigitalsolutions.com",
  founder: "Mwesigwa Trevor Joseph",
  founderRole: "Founder & CEO",
  location: "Kampala, Uganda",
  hours: "Mon - Sat, 8:00 AM - 6:00 PM EAT",
} as const

export const contact = {
  phone: "+256 740 081 305",
  phoneHref: "tel:+256740081305",
  whatsapp: "https://wa.me/256740081305",
  email: "trevordigitalsolutions@gmail.com",
  emailHref: "mailto:trevordigitalsolutions@gmail.com",
  linkedin: "https://linkedin.com/in/mwesigwa-trevor",
} as const

/** Primary navigation. Founder and Leadership stay reachable from About. */
export const primaryNav = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Technologies", href: "/technologies" },
  { name: "Insights", href: "/insights" },
  { name: "Contact", href: "/contact" },
] as const

/** Secondary pages surfaced through the About page and the footer. */
export const companyNav = [
  { name: "About TDS", href: "/about" },
  { name: "Founder", href: "/founder" },
  { name: "Leadership", href: "/leadership" },
  { name: "Client Feedback", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
] as const

export const legalNav = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
] as const
