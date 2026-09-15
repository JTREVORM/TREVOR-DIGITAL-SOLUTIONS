import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { serviceBySlug, services } from "@/lib/content/services"
import { contact, defaultOgImages, site } from "@/lib/site"
import { JsonLd, breadcrumbSchema, serviceSchema } from "@/components/site/structured-data"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = serviceBySlug.get(slug)
  if (!service) return { title: "Service not found" }

  return {
    title: service.title,
    description: service.summary,
    openGraph: {
      title: `${service.title} | ${site.name}`,
      description: service.summary,
      url: `${site.url}/services/${service.slug}`,
      type: "article",
      images: defaultOgImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | ${site.name}`,
      description: service.summary,
      images: [site.ogImage],
    },
    alternates: { canonical: `${site.url}/services/${service.slug}` },
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = serviceBySlug.get(slug)
  if (!service) notFound()

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3)

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />
      <JsonLd
        data={serviceSchema({
          name: service.title,
          description: service.summary,
          path: `/services/${service.slug}`,
          serviceTypes: service.highlights,
        })}
      />

      <PageHero
        eyebrow="Service"
        title={service.title}
        lead={service.summary}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.title },
        ]}
        actions={
          <>
            <Button size="cta-lg" asChild>
              <Link href="/contact">
                Start a Project
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="cta-lg" variant="outline" asChild>
              <a href={contact.phoneHref}>
                <Phone aria-hidden />
                {contact.phone}
              </a>
            </Button>
          </>
        }
      />

      <Section space="loose">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          {/* Main column */}
          <div className="min-w-0">
            <h2 className="eyebrow">Overview</h2>
            <p className="mt-5 text-lg leading-relaxed text-foreground/90">
              {service.overview}
            </p>

            {/* What's included */}
            <h2 className="mt-16 text-2xl font-semibold text-foreground">
              What is included
            </h2>
            <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Process */}
            <h2 className="mt-16 text-2xl font-semibold text-foreground">
              How the work runs
            </h2>
            <ol className="mt-8 space-y-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline">
              {service.process.map((step, index) => (
                <li key={step.title} className="flex gap-5 bg-surface p-6">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-brand-lift">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[0.9375rem] font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* FAQ */}
            <h2 className="mt-16 text-2xl font-semibold text-foreground">
              Common questions
            </h2>
            <div className="mt-8 divide-y divide-hairline border-y border-hairline">
              {service.faq.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[0.9375rem] font-medium text-foreground marker:content-none">
                    {item.question}
                    <span
                      className="relative size-4 shrink-0 text-brand-lift before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:-translate-y-1/2 before:bg-current after:absolute after:top-1/2 after:left-0 after:h-px after:w-4 after:-translate-y-1/2 after:rotate-90 after:bg-current after:transition-transform group-open:after:rotate-0"
                      aria-hidden
                    />
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl bg-surface p-6 ring-1 ring-hairline">
              <h2 className="eyebrow">What you get</h2>
              <ul className="mt-5 space-y-3">
                {service.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-3.5 shrink-0 text-brand-lift" aria-hidden />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-surface p-6 ring-1 ring-hairline">
              <h2 className="eyebrow">Typical stack</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {service.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground ring-1 ring-hairline"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-surface p-6 ring-1 ring-hairline">
              <h2 className="eyebrow">Other services</h2>
              <ul className="mt-5 space-y-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/services/${item.slug}`}
                      className="flex items-center justify-between gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.title}
                      <ArrowRight className="size-3.5 shrink-0 text-brand-lift" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <CtaBand
        title={`Need ${service.title.toLowerCase()}?`}
        secondaryLabel="All services"
        secondaryHref="/services"
      />
    </>
  )
}
