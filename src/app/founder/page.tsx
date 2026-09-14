import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Code2,
  Database,
  Mail,
  Phone,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { CtaBand } from "@/components/site/cta-band"
import { LinkedInIcon, WhatsAppIcon } from "@/components/site/social-icons"
import { contact, site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Founder",
  description:
    "Mwesigwa Trevor Joseph is a software engineer, MetaTrader expert advisor developer and technology entrepreneur in Kampala, Uganda, and the founder of Trevor Digital Solutions.",
  keywords: [
    "Mwesigwa Trevor Joseph",
    "Trevor Joseph founder",
    "software engineer Uganda",
    "Forex Expert Advisor Developer Uganda",
    "MT4 developer Uganda",
    "MT5 developer Uganda",
    "technology consultant Kampala",
  ],
  openGraph: {
    title: "Mwesigwa Trevor Joseph | Founder, Trevor Digital Solutions",
    description:
      "Software engineer, MetaTrader expert advisor developer and technology entrepreneur in Kampala, Uganda.",
    url: "https://trevordigitalsolutions.com/founder",
    images: [{ url: "/founder.png", alt: "Mwesigwa Trevor Joseph" }],
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/founder" },
}

/**
 * The five areas of hands-on work. Descriptions cover what he does and the
 * tools he does it with — no qualifications, awards or affiliations, because
 * none are documented in this project and inventing them would be worse than
 * saying less.
 */
const FOCUS_AREAS = [
  {
    title: "Software engineering",
    icon: Code2,
    description:
      "Full-stack delivery across the whole lifecycle rather than one layer of it: the conversation that establishes what a business needs, the data model underneath, the interface on top and the infrastructure it runs on.",
    detail:
      "Architecture decisions get made by the person who will also maintain the result, which tends to produce more conservative and more durable choices.",
    stack: ["TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL"],
  },
  {
    title: "Business systems",
    icon: Database,
    description:
      "SACCO and financial platforms, inventory and stock control, CRM and sector-specific management systems — including the process mapping and data migration that decide whether a system is adopted or quietly abandoned.",
    detail:
      "The hard part is rarely the code. It is documenting how the work is actually done, workarounds included, before any of it is automated.",
    stack: ["PostgreSQL", "Supabase", "Node.js", "Redis", "Docker"],
  },
  {
    title: "Web and mobile development",
    icon: Smartphone,
    description:
      "Company websites and web applications built to be fast on mobile data and legible to search engines, plus Android and iOS applications from a single Flutter codebase.",
    detail:
      "Built for the networks users actually have: offline-tolerant where staff work in the field, and light enough to load on a low-end phone.",
    stack: ["Next.js", "React", "Flutter", "Dart", "Tailwind CSS", "Vercel"],
  },
  {
    title: "AI and automation",
    icon: BrainCircuit,
    description:
      "Narrow, measurable automation of repetitive work: document and invoice processing, support assistants, classification and routing, and workflows that move data between systems without anyone re-typing it.",
    detail:
      "Scoped to the tasks that genuinely consume staff time, and evaluated against a measured accuracy figure rather than an impression.",
    stack: ["Python", "FastAPI", "Claude API", "OpenAI API", "PostgreSQL"],
  },
  {
    title: "Trading technology and Expert Advisor development",
    icon: BarChart3,
    description:
      "Automated trading systems for MetaTrader 4 and MetaTrader 5: expert advisors coded to a documented strategy, custom indicators, backtesting and optimisation, risk management modules and multi-account dashboards.",
    detail:
      "An unforgiving discipline — an ambiguous rule becomes a losing trade rather than a support ticket — and it shaped how requirements get specified everywhere else.",
    stack: ["MQL4", "MQL5", "MetaTrader 4", "MetaTrader 5", "Python", "C++"],
  },
]

export default function FounderPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.founder,
    jobTitle: site.founderRole,
    url: `${site.url}/founder`,
    image: `${site.url}/founder.png`,
    worksFor: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kampala",
      addressCountry: "UG",
    },
    knowsAbout: [
      "Software engineering",
      "Custom software development",
      "Business management systems",
      "Web and mobile application development",
      "AI and automation",
      "MetaTrader expert advisor development",
    ],
    sameAs: [contact.linkedin, contact.whatsapp],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <PageHero
        eyebrow="Founder"
        title="Mwesigwa Trevor Joseph"
        lead="Software engineer and technology entrepreneur, working from Kampala, Uganda. He founded Trevor Digital Solutions to take on client software the way he thought it should be done — understand the business first, scope honestly, build properly, and stay responsible for the result."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
          { name: "Founder" },
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
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="size-[1.125rem]" />
                WhatsApp
              </a>
            </Button>
          </>
        }
      />

      {/* Professional introduction */}
      <Section space="loose">
        <div className="grid gap-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-surface ring-1 ring-hairline lg:mx-0">
                <Image
                  src="/founder.png"
                  alt={site.founder}
                  fill
                  sizes="(max-width: 1024px) 24rem, 20rem"
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover object-top"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
                  aria-hidden
                />
              </div>

              <div className="mx-auto mt-5 max-w-sm rounded-xl bg-surface p-5 ring-1 ring-hairline lg:mx-0">
                <p className="text-[0.9375rem] font-semibold text-foreground">
                  {site.founder}
                </p>
                <p className="mt-1 text-sm text-brand-lift">{site.founderRole}</p>
                <p className="mt-1 text-xs text-muted-foreground">{site.location}</p>

                <ul className="mt-5 space-y-3 border-t border-hairline pt-5 text-sm">
                  <li>
                    <a
                      href={contact.phoneHref}
                      className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Phone className="size-4 shrink-0 text-brand-lift" aria-hidden />
                      {contact.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={contact.emailHref}
                      className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Mail className="size-4 shrink-0 text-brand-lift" aria-hidden />
                      <span className="break-all">{contact.email}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <LinkedInIcon className="size-4 shrink-0 text-brand-lift" />
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal index={1} className="min-w-0">
            <h2 className="eyebrow">Professional introduction</h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="text-lg text-foreground/90">
                Trevor works across the whole software lifecycle rather than one
                layer of it — the conversation that establishes what a business
                needs, the data model underneath, the interface on top, and the
                infrastructure it runs on.
              </p>
              <p>
                That range came from the kind of work available in Kampala,
                where a client rarely wants a specialist for one slice of a
                system. They want the system: the stock control and the
                reporting and the phone app the branch staff use, delivered by
                someone who will still be there when it needs changing.
              </p>
              <p>
                Alongside business software he specialises in trading
                technology, building expert advisors and indicators for
                MetaTrader 4 and 5. The discipline there is unforgiving —
                an ambiguous rule becomes a losing trade rather than a support
                ticket — and it shaped how he writes requirements everywhere
                else.
              </p>
              <p>
                As a technology consultant he also advises organisations on
                architecture, cloud migration and where automation or AI
                genuinely earns its cost, including when the honest answer is
                that a project should not be built at all.
              </p>
            </div>

            <div className="mt-10 rounded-xl bg-surface p-6 ring-1 ring-hairline">
              <h3 className="eyebrow">Working with him directly</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Discovery conversations, architecture reviews and project
                scoping happen with Trevor himself rather than a sales team.
                For most clients that means the person estimating the work is
                the person who will do it.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Focus areas */}
      <Section tone="surface" space="loose" divide="both">
        <SectionHeading
          eyebrow="What he focuses on"
          title="Five areas of hands-on work."
          description="Not a list of everything touched once. These are the areas he builds in regularly, with the tools used day to day."
        />

        <ul className="mt-14 space-y-5">
          {FOCUS_AREAS.map((area, index) => (
            <Reveal as="li" key={area.title} index={index}>
              <div className="rounded-2xl bg-surface-raised p-7 ring-1 ring-hairline sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
                  <div className="min-w-0">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                        <area.icon className="size-5" aria-hidden />
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-muted-foreground/70 uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl leading-snug font-semibold text-foreground">
                      {area.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {area.description}
                    </p>
                  </div>

                  <div className="flex flex-col justify-between gap-6">
                    <p className="border-l-2 border-brand/60 pl-5 text-sm leading-relaxed text-foreground/90">
                      {area.detail}
                    </p>
                    <div>
                      <p className="eyebrow mb-3">Works with</p>
                      <ul className="flex flex-wrap gap-2">
                        {area.stack.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-md bg-background/60 px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground ring-1 ring-hairline"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Approach */}
      <Section space="loose">
        <div className="max-w-3xl">
          <h2 className="eyebrow">Approach</h2>
          <p className="mt-6 text-xl leading-relaxed text-foreground sm:text-2xl">
            Software rarely fails for purely technical reasons. It usually fails
            because the wrong thing was agreed to build.
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            That is why discovery is treated as engineering work here rather
            than a sales formality, why scope is written down before
            development starts, and why a client occasionally gets told their
            project is not worth building. It is a slower way to win work and a
            considerably cheaper way to deliver it.
          </p>
          <Button size="cta" variant="outline" className="mt-9" asChild>
            <Link href="/about">
              How TDS works
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </Section>

      <CtaBand
        title="Work directly with the founder."
        description="Early-stage conversations, architecture reviews and project scoping happen with Trevor himself, not a sales team."
        secondaryLabel="Read about TDS"
        secondaryHref="/about"
      />
    </>
  )
}
