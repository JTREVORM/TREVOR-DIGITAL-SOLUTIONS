import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { industries } from "@/lib/content/company"

/**
 * "Industries served".
 */
export function IndustriesSection() {
  return (
    <Section id="industries" tone="surface" space="loose" divide="top">
      <SectionHeading
        eyebrow="Industries"
        title="Where we have built before."
        description="The building blocks — stock, orders, customers, records, roles, reporting — are common across sectors. What changes is the vocabulary and the rules, and that is what discovery is for."
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry, index) => (
          <Reveal as="li" key={industry.name} index={index} className="h-full">
            <div className="flex h-full items-start gap-4 rounded-xl bg-surface-raised p-6 ring-1 ring-hairline">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                <industry.icon className="size-[1.125rem]" aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 className="text-[0.9375rem] font-semibold text-foreground">
                  {industry.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {industry.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
