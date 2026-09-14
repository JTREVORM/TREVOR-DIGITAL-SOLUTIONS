import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { CtaBand } from "@/components/site/cta-band"
import { techGroups } from "@/lib/content/technologies"

export const metadata: Metadata = {
  title: "Technologies",
  description:
    "The stack Trevor Digital Solutions builds on: React, Next.js and TypeScript on the frontend; Node.js, Python and Django on the backend; PostgreSQL, Supabase and MongoDB for data; Flutter for mobile; AWS, Google Cloud and Docker for deployment; MQL4 and MQL5 for MetaTrader.",
  keywords: [
    "Next.js developer Uganda",
    "React developer Kampala",
    "Python Django developer Uganda",
    "Flutter developer Uganda",
    "PostgreSQL Supabase Uganda",
    "MQL5 MT5 developer",
  ],
  openGraph: {
    title: "Technologies | Trevor Digital Solutions",
    description:
      "Frontend, backend, database, mobile, cloud and trading technology — the tools we actually build with.",
    url: "https://trevordigitalsolutions.com/technologies",
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/technologies" },
}

/** How we decide, stated plainly rather than as a list of adjectives. */
const SELECTION_CRITERIA = [
  {
    title: "Long support horizons",
    description:
      "A system built this year has to be maintainable in five. We pick tools with active maintainers and a track record, not whatever launched last quarter.",
  },
  {
    title: "Hireable skills",
    description:
      "You should be able to find another developer who knows the stack. A codebase only we can maintain is a liability we have handed you.",
  },
  {
    title: "Fits your team",
    description:
      "If your people already run Python, we will not leave you a Node codebase nobody can support. The stack follows your situation, not our habits.",
  },
]

export default function TechnologiesPage() {
  const techCount = techGroups.reduce((total, group) => total + group.techs.length, 0)

  return (
    <>
      <PageHero
        eyebrow="Technologies"
        title="A deliberately boring stack."
        lead="Novelty is not a feature. We build with tools that have long support horizons, good documentation and a large enough talent pool that your system can still be maintained years from now — by us, by your own team, or by whoever comes next."
        crumbs={[{ name: "Home", href: "/" }, { name: "Technologies" }]}
        actions={
          <Button size="cta-lg" asChild>
            <Link href="/contact">
              Discuss your stack
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      >
        <nav aria-label="Technology groups">
          <p className="eyebrow mb-4">
            {techCount} technologies across {techGroups.length} areas
          </p>
          <ul className="flex flex-wrap gap-2">
            {techGroups.map((group) => (
              <li key={group.category}>
                <a
                  href={`#${group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-surface-raised px-3.5 py-2 text-[0.8125rem] font-medium text-muted-foreground ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-primary/35"
                >
                  <group.icon className="size-3.5 text-brand-lift" aria-hidden />
                  {group.category}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {/* Groups */}
      <Section space="loose">
        <div className="space-y-16 lg:space-y-20">
          {techGroups.map((group, groupIndex) => {
            const anchor = group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")

            return (
              <Reveal key={group.category} index={groupIndex} className="scroll-mt-24">
                <div id={anchor}>
                  <div className="flex flex-col gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                        <group.icon className="size-5" aria-hidden />
                      </span>
                      <div>
                        <h2 className="text-2xl font-semibold text-foreground">
                          {group.category}
                        </h2>
                        <p className="mt-1 font-[family-name:var(--font-mono)] text-[0.6875rem] tracking-[0.12em] text-muted-foreground/70 uppercase">
                          {group.techs.length} technologies
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:max-w-sm sm:text-right">
                      {group.intent}
                    </p>
                  </div>

                  <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {group.techs.map((tech) => (
                      <li
                        key={tech.name}
                        className="group/tech rounded-xl bg-surface p-5 ring-1 ring-hairline transition-colors duration-200 hover:ring-primary/35"
                      >
                        <h3 className="inline-flex rounded-md bg-primary/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.75rem] font-medium text-brand-lift ring-1 ring-primary/20">
                          {tech.name}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {tech.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* How we choose */}
      <Section tone="surface" space="loose" divide="both">
        <SectionHeading
          eyebrow="How we choose"
          title="The stack follows the problem."
          description="Three tests every technology on this page has to pass before it goes anywhere near a client system."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-3">
          {SELECTION_CRITERIA.map((criterion, index) => (
            <Reveal as="li" key={criterion.title} index={index} className="bg-surface-raised">
              <div className="h-full p-7">
                <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.12em] text-brand-lift">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {criterion.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {criterion.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          If a requirement is genuinely better served by something not listed
          here, we will say so rather than bend the project to fit what we
          already know.
        </p>
      </Section>

      <CtaBand
        title="Unsure what your project should be built on?"
        description="Bring us the requirements and the constraints, including the skills your team already has. We will recommend a stack and explain the trade-offs behind it."
        secondaryLabel="See our services"
        secondaryHref="/services"
      />
    </>
  )
}
