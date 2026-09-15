import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { CtaBand } from "@/components/site/cta-band"
import { serviceCategories, servicesInCategory } from "@/lib/content/services"
import { BreadcrumbJsonLd } from "@/components/site/structured-data"
import { defaultOgImages } from "@/lib/site"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Software development, web and mobile, business systems including SACCO and inventory platforms, AI and automation, trading technology, cloud and integration.",
  keywords: [
    "software development services Uganda",
    "custom software Uganda",
    "SACCO management system Uganda",
    "inventory management system Uganda",
    "ERP development Uganda",
    "mobile app development Kampala",
    "API integration Uganda",
    "Forex expert advisor developer",
  ],
  openGraph: {
    title: "Services | Trevor Digital Solutions",
    description:
      "Six areas of work: software development, web and mobile, business systems, AI and automation, trading technology, cloud and integration.",
    url: "https://trevordigitalsolutions.com/services",
    images: defaultOgImages,
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/services" },
}

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]} />

      <PageHero
        eyebrow="Services"
        title="Six areas of work. One way of working."
        lead="We do not sell packages or tiers. Every engagement starts with the problem you actually have, gets scoped in writing, and is priced before development begins. These are the areas we build in."
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
      >
        {/* Jump list: six areas is enough to warrant one. */}
        <nav aria-label="Service areas">
          <p className="eyebrow mb-4">Jump to</p>
          <ul className="flex flex-wrap gap-2">
            {serviceCategories.map((category) => (
              <li key={category.id}>
                <a
                  href={`#${category.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-surface-raised px-3.5 py-2 text-[0.8125rem] font-medium text-muted-foreground ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-primary/35"
                >
                  <category.icon className="size-3.5 text-brand-lift" aria-hidden />
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {/* One band per category, alternating surface so the six read as
          distinct sections rather than one long scroll. */}
      {serviceCategories.map((category, index) => {
        const pages = servicesInCategory(category)

        return (
          <Section
            key={category.id}
            id={category.id}
            tone={index % 2 === 0 ? "base" : "surface"}
            space="loose"
            divide={index % 2 === 0 ? "none" : "both"}
            className="scroll-mt-24"
          >
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
              {/* What it is, and what it fixes */}
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                    <category.icon className="size-[1.375rem]" aria-hidden />
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-muted-foreground/70 uppercase">
                    {String(index + 1).padStart(2, "0")} / Service area
                  </span>
                </div>

                <h2 className="mt-6 text-[1.75rem] leading-[1.15] font-semibold text-foreground sm:text-[2.25rem]">
                  {category.name}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
                  {category.what}
                </p>

                <div className="mt-8 border-l-2 border-brand/60 pl-5">
                  <p className="eyebrow mb-2.5">The problem</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {category.problem}
                  </p>
                </div>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button size="cta" asChild>
                    <Link href="/contact">
                      Discuss a {category.name.toLowerCase()} project
                      <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                </div>
              </Reveal>

              {/* What we can build, and the detail pages */}
              <Reveal index={1}>
                <div className="rounded-2xl bg-surface-raised p-7 ring-1 ring-hairline sm:p-8">
                  <h3 className="eyebrow">What we build</h3>
                  <ul className="mt-6 grid gap-3">
                    {category.builds.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {pages.length > 0 ? (
                    <div className="mt-8 border-t border-hairline pt-7">
                      <h3 className="eyebrow mb-4">Detail</h3>
                      <ul className="grid gap-3">
                        {pages.map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={`/services/${service.slug}`}
                              className="group flex items-start justify-between gap-4 rounded-lg bg-surface p-4 ring-1 ring-hairline transition-colors hover:ring-primary/40"
                            >
                              <span className="min-w-0">
                                <span className="block text-[0.9375rem] font-semibold text-foreground">
                                  {service.title}
                                </span>
                                <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted-foreground">
                                  {service.summary}
                                </span>
                              </span>
                              <ArrowUpRight
                                className="mt-0.5 size-4 shrink-0 text-brand-lift transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                aria-hidden
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </Section>
        )
      })}

      <CtaBand
        title="Not sure which of these you need?"
        description="Describe the problem rather than the solution. We will tell you what it would take to fix, which area it falls under, and whether it is worth building at all."
        primaryLabel="Start a Project"
        secondaryLabel="See the stack"
        secondaryHref="/technologies"
      />
    </>
  )
}
