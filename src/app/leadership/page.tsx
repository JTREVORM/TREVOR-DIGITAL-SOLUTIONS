import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { CtaBand } from "@/components/site/cta-band"
import { contact, site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "How Trevor Digital Solutions is run: who is accountable for what, how technical decisions are made, and how client work is governed.",
  keywords: [
    "Trevor Digital Solutions leadership",
    "Mwesigwa Trevor Joseph CEO",
    "software company leadership Uganda",
    "technology leadership Kampala",
  ],
  openGraph: {
    title: "Leadership | Trevor Digital Solutions",
    description:
      "How the company is run, who is accountable for what, and how decisions are made.",
    url: "https://trevordigitalsolutions.com/leadership",
    images: [{ url: "/founder.png", alt: "Leadership at Trevor Digital Solutions" }],
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/leadership" },
}

/**
 * Functions, not invented job titles. TDS is founder-led, and the honest
 * description is which responsibilities are owned rather than an org chart
 * of people who do not exist yet.
 */
const FUNCTIONS = [
  {
    id: "01",
    title: "Strategy & client partnerships",
    owner: "Founder & CEO",
    description:
      "Which work the company takes on, what it declines, and the direct relationship with every client. Scoping and commercial terms are agreed at this level, not delegated to a sales function.",
  },
  {
    id: "02",
    title: "Technical direction",
    owner: "Founder & CEO",
    description:
      "Architecture decisions, stack selection and engineering standards. Decisions are made by someone who will also maintain the result, which keeps them conservative on purpose.",
  },
  {
    id: "03",
    title: "Delivery & quality",
    owner: "Founder & CEO",
    description:
      "Sprint planning, code review, testing standards and release readiness. Nothing ships to a client environment without review against the agreed scope.",
  },
  {
    id: "04",
    title: "Trading systems",
    owner: "Founder & CEO",
    description:
      "MetaTrader development, strategy specification, backtesting integrity and the reporting given to clients, favourable or not.",
  },
]

const GOVERNANCE = [
  {
    title: "Decisions are traceable",
    description:
      "Architecture and scope decisions are written down with the reasoning behind them, so a choice can be revisited later by whoever inherits the system.",
  },
  {
    title: "Nothing is promised twice",
    description:
      "Commitments to clients are made once, in writing, by the person accountable for delivering them. There is no gap between what was sold and what was scoped.",
  },
  {
    title: "Bad news travels immediately",
    description:
      "A slipping timeline or a failed assumption is raised as soon as it is known, not at the deadline. Clients get time to react while reacting is still useful.",
  },
  {
    title: "Growth follows capability",
    description:
      "The company adds people when the work genuinely requires it, not to appear larger. Overstated capacity is how agencies end up subcontracting work they cannot supervise.",
  },
]

export default function LeadershipPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    founder: {
      "@type": "Person",
      name: site.founder,
      jobTitle: site.founderRole,
      url: `${site.url}/founder`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kampala",
      addressCountry: "UG",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+256-740-081-305",
      contactType: "customer service",
      areaServed: "UG",
      availableLanguage: "English",
    },
    sameAs: [contact.linkedin, contact.whatsapp],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Leadership"
        title="Founder-led, and honest about it."
        lead="Trevor Digital Solutions is led by its founder. That is a genuine advantage for clients — decisions happen in one conversation — and we describe it plainly rather than dressing it up as a department chart."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
          { name: "Leadership" },
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
              <Link href="/founder">Founder profile</Link>
            </Button>
          </>
        }
      />

      {/* Who leads */}
      <Section space="loose">
        <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-16">
          <Reveal>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl bg-surface ring-1 ring-hairline lg:mx-0">
              <Image
                src="/founder.png"
                alt={site.founder}
                fill
                sizes="(max-width: 1024px) 20rem, 18rem"
                className="object-cover object-top"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </Reveal>

          <Reveal index={1}>
            <h2 className="eyebrow">Who leads</h2>
            <p className="mt-5 text-2xl leading-snug font-semibold text-foreground sm:text-3xl">
              {site.founder}
            </p>
            <p className="mt-2 text-brand-lift">{site.founderRole}</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Software engineer, MetaTrader expert advisor developer and
              technology consultant. He holds accountability for strategy,
              technical direction, delivery quality and the trading systems
              work, and is the person a client deals with from first
              conversation through to support after launch.
            </p>
            <Button size="cta" variant="outline" className="mt-8" asChild>
              <Link href="/founder">
                Full profile
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </Reveal>
        </div>
      </Section>

      {/* Accountability */}
      <Section tone="surface" space="loose" divide="both">
        <SectionHeading
          eyebrow="Accountability"
          title="Four functions, each with a named owner."
          description="As the company grows these functions separate into distinct roles. Until they do, this is who is responsible for what."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-2">
          {FUNCTIONS.map((item, index) => (
            <Reveal as="li" key={item.id} index={index} className="bg-surface-raised">
              <div className="h-full p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.12em] text-brand-lift">
                    {item.id}
                  </span>
                  <span className="text-[0.6875rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
                    {item.owner}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Governance */}
      <Section space="loose">
        <SectionHeading
          eyebrow="How we run projects"
          title="The rules we hold ourselves to."
          description="Commitments about conduct rather than outcomes, because conduct is the part we fully control."
        />
        <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:gap-x-16">
          {GOVERNANCE.map((item, index) => (
            <Reveal as="li" key={item.title} index={index}>
              <h3 className="border-l-2 border-brand pl-5 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 pl-5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Hiring note */}
      <Section tone="surface" space="default" divide="top">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-foreground">
            Interested in joining?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We take on engineers as project volume justifies it, and we would
            rather hear from someone early than advertise a role we are not
            ready to fill. Send your work to{" "}
            <a
              href={contact.emailHref}
              className="text-brand-lift underline-offset-4 hover:underline"
            >
              {contact.email}
            </a>{" "}
            &mdash; code we can read matters more than a CV.
          </p>
        </div>
      </Section>

      <CtaBand secondaryLabel="Read about TDS" secondaryHref="/about" />
    </>
  )
}
