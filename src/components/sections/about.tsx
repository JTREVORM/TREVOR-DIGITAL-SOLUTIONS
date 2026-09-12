import { Section } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { LogoFull } from "@/components/site/logo"
import { site } from "@/lib/site"

/**
 * Who TDS is, plus mission and vision. Used on the About page.
 *
 * This is also the site's primary brand section: the logo is shown here at a
 * size where the full lockup, wordmark and tagline included, actually reads.
 */
export function AboutSection() {
  return (
    <Section tone="surface" space="loose" divide="both">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
        <Reveal>
          <h2 className="eyebrow">Who we are</h2>
          <p className="mt-6 text-xl leading-relaxed text-foreground sm:text-2xl">
            Trevor Digital Solutions is a software engineering company in{" "}
            {site.location}. We build the systems businesses run on, and we stay
            on to maintain them.
          </p>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Most of the work that reaches us starts the same way: a business
              has outgrown its spreadsheets. Numbers disagree between
              departments, stock cannot be trusted, reporting takes a week, and
              the workarounds have become the process. Off-the-shelf software
              would solve part of it and break another part.
            </p>
            <p>
              So we build the system around the business instead. That means
              spending real time on discovery before writing code, scoping the
              work in writing, and engineering it to be maintained for years
              rather than demoed once. It also means telling clients when a
              project is not worth building, which costs us work and saves them
              more.
            </p>
            <p>
              We work across custom software, business management systems, web
              and mobile applications, AI and automation, cloud infrastructure
              and trading technologies &mdash; for clients in Uganda and beyond.
            </p>
          </div>
        </Reveal>

        <Reveal index={1} className="space-y-6">
          {/* Brand panel: the official logo at a legible size. */}
          <div className="overflow-hidden rounded-2xl bg-background ring-1 ring-hairline">
            <LogoFull />
          </div>

          <div className="rounded-2xl bg-surface-raised p-7 ring-1 ring-hairline sm:p-8">
            <h3 className="eyebrow">Mission</h3>
            <p className="mt-4 text-base leading-relaxed text-foreground/90">
              To give growing businesses software they can actually rely on:
              built for their process, owned outright, and supported long after
              launch.
            </p>

            <h3 className="eyebrow mt-9">Vision</h3>
            <p className="mt-4 text-base leading-relaxed text-foreground/90">
              To be one of Africa&apos;s most trusted software engineering
              companies &mdash; known less for how much we build than for how
              well the things we build keep working.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
