import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { BrandLockup } from "@/components/site/logo"
import { LinkedInIcon, WhatsAppIcon } from "@/components/site/social-icons"
import { BackToTop } from "@/components/site/back-to-top"
import { companyNav, contact, legalNav, site } from "@/lib/site"
import { services } from "@/lib/content/services"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-hairline bg-surface">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
          <div className="max-w-sm">
            <BrandLockup variant="stacked" />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {site.tagline} We build custom software, business management
              systems, websites, mobile applications, AI solutions and trading
              technologies from {site.location}.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground ring-1 ring-hairline transition-colors hover:bg-primary/10 hover:text-brand-lift"
                aria-label="Chat with us on WhatsApp"
              >
                <WhatsAppIcon className="size-4" />
              </a>
              <a
                href={contact.emailHref}
                className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground ring-1 ring-hairline transition-colors hover:bg-primary/10 hover:text-brand-lift"
                aria-label="Email us"
              >
                <Mail className="size-4" aria-hidden />
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground ring-1 ring-hairline transition-colors hover:bg-primary/10 hover:text-brand-lift"
                aria-label="LinkedIn profile"
              >
                <LinkedInIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className="eyebrow mb-5">
              Services
            </h2>
            <ul className="space-y-3 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-labelledby="footer-company">
            <h2 id="footer-company" className="eyebrow mb-5">
              Company
            </h2>
            <ul className="space-y-3 text-sm">
              {companyNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/technologies"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Technologies
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="eyebrow mb-5">Contact</h2>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={contact.phoneHref}
                  className="flex items-start gap-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.emailHref}
                  className="flex items-start gap-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
                  <span className="break-all">{contact.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
                {site.location}
              </li>
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              {site.hours}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-hairline">
        <div className="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  )
}
