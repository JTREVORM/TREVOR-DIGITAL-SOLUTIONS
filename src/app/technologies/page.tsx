import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { CtaBand } from "@/components/site/cta-band"
import { techGroups } from "@/lib/content/technologies"

export const metadata: Metadata = {
  title: "Technologies",
  description:
    "The stack Trevor Digital Solutions builds on: TypeScript, React, Next.js, Node.js, Python, Flutter, PostgreSQL, MQL5, Docker, AWS and Google Cloud.",
  openGraph: {
    title: "Technologies | Trevor Digital Solutions",
    description:
      "A deliberately boring stack, chosen for long support horizons and maintainability.",
    url: "https://trevordigitalsolutions.com/technologies",
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/technologies" },
}

export default function TechnologiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Technologies"
        title="A deliberately boring stack."
        lead="We pick tools with long support horizons, good documentation and a large enough talent pool that your system can still be maintained in five years — by us, by your own team, or by whoever comes after us. Novelty is not a feature."
        crumbs={[{ name: "Home", href: "/" }, { name: "Technologies" }]}
        actions={
          <Button size="cta-lg" asChild>
            <Link href="/contact">
              Discuss your stack
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <Section space="loose">
        <div className="space-y-16 lg:space-y-20">
          {techGroups.map((group, groupIndex) => (
            <Reveal key={group.category} index={groupIndex}>
              <div className="flex flex-col gap-2 border-b border-hairline pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <h2 className="text-2xl font-semibold text-foreground">
                  {group.category}
                </h2>
                <p className="text-sm text-muted-foreground sm:max-w-md sm:text-right">
                  {group.intent}
                </p>
              </div>

              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {group.techs.map((tech) => (
                  <li
                    key={tech.name}
                    className="rounded-xl bg-surface p-5 ring-1 ring-hairline transition-colors duration-200 hover:ring-primary/30"
                  >
                    <h3 className="font-[family-name:var(--font-mono)] text-[0.8125rem] font-medium text-brand-lift">
                      {tech.name}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                      {tech.description}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="surface" space="default" divide="top">
        <div className="max-w-3xl">
          <h2 className="eyebrow">How we choose</h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/90">
            The stack follows the problem, not the other way around. If your
            team already runs Python, we will not hand you a Node codebase
            nobody can maintain. If a requirement is genuinely better served by
            a tool we do not list here, we will say so rather than bend your
            project to fit our habits.
          </p>
        </div>
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
