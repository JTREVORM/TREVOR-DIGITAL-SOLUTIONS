import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { techGroups } from "@/lib/content/technologies"

/**
 * The stack, grouped by discipline.
 *
 * This replaces the previous infinite-scroll marquee: a perpetual animation
 * that ran on every page, cost battery, and rendered the names at 20% opacity
 * where nobody could read them. A static grid says more and costs nothing.
 */
export function TechnologiesSection() {
  return (
    <Section id="technologies" tone="surface" space="loose" divide="both">
      <SectionHeading
        eyebrow="Technologies"
        title="A deliberately boring stack."
        description="We choose tools with long support horizons and large talent pools, so your system can still be maintained in five years — by us or by whoever comes next."
        action={
          <Button size="cta" variant="outline" asChild>
            <Link href="/technologies">
              Full stack
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-2 lg:grid-cols-3">
        {techGroups.map((group, index) => (
          <Reveal key={group.category} index={index} className="bg-surface-raised">
            <div className="h-full p-6 lg:p-7">
              <h3 className="text-[0.9375rem] font-semibold text-foreground">
                {group.category}
              </h3>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {group.intent}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.techs.map((tech) => (
                  <li
                    key={tech.name}
                    className="rounded-md bg-background/60 px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground ring-1 ring-hairline"
                  >
                    {tech.name}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
