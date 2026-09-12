import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { differentiators } from "@/lib/content/company"

/**
 * "Why choose TDS" — the reasons stated as commitments a client can hold us
 * to, rather than adjectives.
 */
export function WhyTdsSection() {
  return (
    <Section tone="surface" space="loose" divide="both">
      <SectionHeading
        eyebrow="Why TDS"
        title="Six commitments, not six adjectives."
        description="Every software company claims quality and reliability. These are the specific things we do differently, each one something you can hold us to in writing."
      />

      <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-14">
        {differentiators.map((item, index) => (
          <Reveal as="li" key={item.title} index={index}>
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
              <item.icon className="size-5" aria-hidden />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
