import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Compass,
  Handshake,
  Mail,
  Radio,
  ShieldCheck,
  TerminalSquare,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { CtaBand } from "@/components/site/cta-band"
import { contact, site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "How Trevor Digital Solutions is run: who is accountable for what, how technical decisions are made, and the standards client work is held to.",
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
 * Responsibilities, not invented job titles.
 *
 * TDS is founder-led. Rather than publish an org chart of people who do not
 * exist, this page states which functions are owned and by whom. When the
 * company hires into these functions, each entry gets a real name — nothing
 * here needs rewriting to make that true.
 */
const FUNCTIONS = [
  {
    id: "01",
    title: "Strategy & client partnerships",
    owner: "Founder & CEO",
    icon: Compass,
    description:
      "Which work the company takes on, what it declines, and the direct relationship with every client. Scoping and commercial terms are agreed at this level, never delegated to a sales function.",
  },
  {
    id: "02",
    title: "Technical direction",
    owner: "Founder & CEO",
    icon: TerminalSquare,
    description:
      "Architecture decisions, stack selection and engineering standards. Decisions are made by someone who will also maintain the result, which keeps them conservative on purpose.",
  },
  {
    id: "03",
    title: "Delivery & quality",
    owner: "Founder & CEO",
    icon: ShieldCheck,
    description:
      "Sprint planning, code review, testing standards and release readiness. Nothing ships to a client environment without review against the agreed scope.",
  },
  {
    id: "04",
    title: "Trading systems",
    owner: "Founder & CEO",
    icon: BarChart3,
    description:
      "MetaTrader development, strategy specification, backtesting integrity and the reporting given to clients, favourable or not.",
  },
]

const GOVERNANCE = [
  {
    title: "Decisions are traceable",
    icon: BookOpen,
    description:
      "Architecture and scope decisions are written down with the reasoning behind them, so a choice can be revisited later by whoever inherits the system.",
  },
  {
    title: "Nothing is promised twice",
    icon: Handshake,
    description:
      "Commitments to clients are made once, in writing, by the person accountable for delivering them. There is no gap between what was sold and what was scoped.",
  },
  {
    title: "Bad news travels immediately",
    icon: Radio,
    description:
      "A slipping timeline or a failed assumption is raised as soon as it is known, not at the deadline. Clients get time to react while reacting is still useful.",
  },
  {
    title: "Growth follows capability",
    icon: TrendingUp,
    description:
      "The company adds people when the work genuinely requires it, not to appear larger. Overstated capacity is how firms end up subcontracting work they cannot supervise.",
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
        title="Founder-led, and straightforward about it."
        lead="Trevor Digital Solutions is led by its founder. For clients that is a genuine advantage — decisions happen in one conversation instead of three — and we would rather describe it plainly than dress it up as a department chart."
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
        <div className="grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-hairline">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/founder.png"
                  alt={site.founder}
                  fill
                  sizes="(max-width: 1024px) 100vw, 20rem"
                  className="object-cover object-top"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <div className="p-6">
                <p className="text-[0.9375rem] font-semibold text-foreground">
                  {site.founder}
                </p>
                <p className="mt-1 text-sm text-brand-lift">{site.founderRole}</p>
                <p className="mt-4 border-t border-hairline pt-4 text-xs leading-relaxed text-muted-foreground">
                  {site.location}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal index={1}>
            <h2 className="eyebrow">Who leads</h2>
            <p className="mt-5 text-2xl leading-snug font-semibold text-foreground sm:text-3xl">
              One person is accountable, and you deal with him.
            </p>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                {site.founder} holds accountability for strategy, technical
                direction, delivery quality and the trading systems work. He is
                the person a client deals with from the first conversation
                through to support after launch — there is no handover to an
                account manager once the contract is signed.
              </p>
              <p>
                The practical effect is that commitments are made by the person
                who has to keep them. Estimates come from whoever will write
                the code, and a scope change gets a straight answer in the same
                conversation rather than going away to be priced by someone
                else.
              </p>
            </div>
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
          description="As the company grows these separate into distinct roles. Until they do, this is exactly who is responsible for what — stated rather than implied."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-2">
          {FUNCTIONS.map((item, index) => (
            <Reveal as="li" key={item.id} index={index} className="bg-surface-raised">
              <div className="h-full p-7 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-muted-foreground/60">
                    {item.id}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[0.6875rem] tracking-[0.1em] text-brand-lift uppercase">
                  {item.owner}
                </p>
                <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
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
          description="Commitments about conduct rather than outcomes, because conduct is the part entirely within our control."
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {GOVERNANCE.map((item, index) => (
            <Reveal as="li" key={item.title} index={index} className="h-full">
              <div className="flex h-full gap-5 rounded-xl bg-surface p-6 ring-1 ring-hairline sm:p-7">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                  <item.icon className="size-[1.125rem]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Hiring */}
      <Section tone="surface" space="default" divide="top">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-foreground">
              Interested in joining?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We take on engineers as project volume justifies it, and we would
              rather hear from someone early than advertise a role we are not
              ready to fill. Code we can read matters more than a CV.
            </p>
          </div>
          <Button size="cta-lg" variant="outline" asChild>
            <a href={contact.emailHref}>
              <Mail aria-hidden />
              Send us your work
            </a>
          </Button>
        </div>
      </Section>

      <CtaBand secondaryLabel="Read about TDS" secondaryHref="/about" />
    </>
  )
}
