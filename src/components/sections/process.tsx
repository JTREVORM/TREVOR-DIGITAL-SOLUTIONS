import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { processSteps } from "@/lib/content/company"

/**
 * "How we work" — the five stages of an engagement.
 */
export function ProcessSection() {
  return (
    <Section id="process" space="loose">
      <SectionHeading
        eyebrow="How we work"
        title="Scoped before it starts. Supported after it ships."
        description="The same five stages on every project, whether it runs four weeks or six months. You always know which stage you are in and what comes next."
      />

      <ol className="mt-14 grid gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-5 lg:gap-x-8">
        {processSteps.map((step, index) => (
          <Reveal as="li" key={step.id} index={index} className="relative">
            {/* Connector, wide screens only. */}
            <span
              className="absolute top-4 left-0 hidden h-px w-full bg-hairline lg:block"
              aria-hidden
            />
            <div className="relative">
              <span className="relative z-10 inline-flex items-center gap-3 bg-background pr-3 lg:pr-4">
                <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.12em] text-brand-lift">
                  {step.id}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
