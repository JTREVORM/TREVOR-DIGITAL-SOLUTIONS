import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/site/social-icons"
import { contact } from "@/lib/site"

/**
 * The closing call to action. Used at the foot of every marketing page so the
 * next step is always in the same place with the same wording.
 */

type CtaBandProps = {
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function CtaBand({
  title = "Tell us what you need built.",
  description = "Describe the problem in your own words. You get a written scope, a timeline and a price before anything starts, and a straight answer if we are not the right people for it.",
  primaryLabel = "Start a Project",
  primaryHref = "/contact",
  secondaryLabel = "View Our Work",
  secondaryHref = "/projects",
}: CtaBandProps) {
  return (
    <section className="border-t border-hairline bg-surface py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <div className="edge-light relative overflow-hidden rounded-2xl bg-surface-raised px-6 py-12 ring-1 ring-hairline sm:px-10 sm:py-14 lg:px-14">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(36rem_18rem_at_15%_0%,oklch(0.6676_0.1797_248.36/12%),transparent_70%)]"
            aria-hidden
          />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
            <div className="max-w-2xl">
              <h2 className="text-[1.625rem] leading-[1.15] font-semibold text-foreground sm:text-4xl">
                {title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Button size="cta-lg" asChild>
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button size="cta-lg" variant="outline" asChild>
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>
          </div>

          <div className="relative mt-10 flex flex-col gap-4 border-t border-hairline pt-8 text-sm sm:flex-row sm:items-center sm:gap-8">
            <a
              href={contact.phoneHref}
              className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="size-4 shrink-0 text-brand-lift" aria-hidden />
              {contact.phone}
            </a>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <WhatsAppIcon className="size-4 shrink-0 text-brand-lift" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
