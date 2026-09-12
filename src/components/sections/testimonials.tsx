import Link from "next/link"
import { ArrowRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { publishedTestimonials } from "@/lib/content/testimonials"

/**
 * Client feedback.
 *
 * Renders only testimonials marked verified in the content module. Until
 * consent is on file that list is empty, so the section shows an honest
 * placeholder pointing at the work itself instead of quotes we cannot stand
 * behind.
 */
export function TestimonialsSection() {
  if (publishedTestimonials.length === 0) {
    return (
      <Section space="loose">
        <div className="max-w-2xl">
          <h2 className="eyebrow">Client feedback</h2>
          <p className="mt-6 text-xl leading-relaxed text-foreground sm:text-2xl">
            We publish client feedback only with written permission from the
            person quoted.
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Several clients have agreed in principle and we are collecting those
            approvals now. Until they are confirmed, this page stays empty
            rather than filled with quotes you have no way to check. In the
            meantime, the projects themselves are the more useful evidence
            &mdash; and we are happy to arrange a direct reference call for a
            serious enquiry.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="cta-lg" asChild>
              <Link href="/projects">
                See the work
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="cta-lg" variant="outline" asChild>
              <Link href="/contact">Request a reference</Link>
            </Button>
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section space="loose">
      <SectionHeading
        eyebrow="Client feedback"
        title="What clients have said."
        description="Published with permission from the people quoted."
      />
      <ul className="mt-14 grid gap-6 lg:grid-cols-3">
        {publishedTestimonials.map((testimonial, index) => (
          <Reveal as="li" key={testimonial.name} index={index} className="h-full">
            <figure className="flex h-full flex-col rounded-xl bg-surface p-7 ring-1 ring-hairline">
              <Quote className="size-6 shrink-0 text-brand-lift/50" aria-hidden />
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-foreground/90">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-7 border-t border-hairline pt-5">
                <span className="block text-[0.9375rem] font-semibold text-foreground">
                  {testimonial.name}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
