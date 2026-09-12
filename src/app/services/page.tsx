import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { CtaBand } from "@/components/site/cta-band"
import { services } from "@/lib/content/services"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software development, web applications, mobile apps, business management systems, trading technologies, AI and automation, cloud infrastructure and API integration from Trevor Digital Solutions.",
  keywords: [
    "software development services Uganda",
    "custom software Uganda",
    "ERP development Uganda",
    "mobile app development Kampala",
    "API integration Uganda",
    "Forex expert advisor developer",
  ],
  openGraph: {
    title: "Services | Trevor Digital Solutions",
    description:
      "Eight engineering disciplines: custom software, web, mobile, business systems, trading technologies, AI, cloud and APIs.",
    url: "https://trevordigitalsolutions.com/services",
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/services" },
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Engineering disciplines, not packages."
        lead="We do not sell tiers. Every engagement starts with the problem you actually have, and the work is scoped from there. These are the areas we work in."
        crumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        actions={
          <>
            <Button size="cta-lg" asChild>
              <Link href="/contact">
                Start a Project
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="cta-lg" variant="outline" asChild>
              <Link href="/projects">View Our Work</Link>
            </Button>
          </>
        }
      />

      <Section space="loose">
        <ul className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {services.map((service, index) => (
            <Reveal as="li" key={service.slug} index={index} className="h-full">
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-xl bg-surface p-7 ring-1 ring-hairline transition-colors duration-200 hover:bg-surface-raised hover:ring-primary/40 sm:p-8"
              >
                <div className="flex items-start gap-5">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                    <service.icon className="size-[1.375rem]" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl leading-snug font-semibold text-foreground">
                      {service.title}
                    </h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {service.summary}
                    </p>
                  </div>
                </div>

                <ul className="mt-7 grid flex-1 gap-2.5 border-t border-hairline pt-6 sm:grid-cols-2">
                  {service.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2.5 text-[0.8125rem] text-muted-foreground"
                    >
                      <Check
                        className="mt-0.5 size-3.5 shrink-0 text-brand-lift"
                        aria-hidden
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <span className="mt-7 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-lift">
                  Service details
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Not sure which of these you need?"
        description="Describe the problem rather than the solution. We will tell you what it would take to fix, which service that falls under, and whether it is worth building at all."
        primaryLabel="Start a Project"
        secondaryLabel="See the stack"
        secondaryHref="/technologies"
      />
    </>
  )
}
