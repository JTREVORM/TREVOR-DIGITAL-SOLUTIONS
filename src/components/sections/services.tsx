import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { services } from "@/lib/content/services"

/**
 * "What TDS builds" — the service grid on the homepage.
 */
export function ServicesSection() {
  return (
    <Section id="services" space="loose">
      <SectionHeading
        eyebrow="What we build"
        title="Eight things we do, and do properly."
        description="Most clients arrive with a process that has outgrown its spreadsheets, or a product idea that needs engineering rather than assembling. These are the disciplines we work in."
        action={
          <Button size="cta" variant="outline" asChild>
            <Link href="/services">
              All services
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <Reveal as="li" key={service.slug} index={index} className="h-full">
            <Link
              href={`/services/${service.slug}`}
              className="group flex h-full flex-col rounded-xl bg-surface p-6 ring-1 ring-hairline transition-colors duration-200 hover:bg-surface-raised hover:ring-primary/40"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                <service.icon className="size-5" aria-hidden />
              </span>

              <h3 className="mt-5 text-base leading-snug font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.summary}
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-lift">
                Learn more
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
  )
}
