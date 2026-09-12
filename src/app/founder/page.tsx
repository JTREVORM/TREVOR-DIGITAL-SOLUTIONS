import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Mail, Phone } from "lucide-react"
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
    "Mwesigwa Trevor Joseph is a software engineer, MetaTrader expert advisor developer and technology consultant in Kampala, Uganda, and the founder of Trevor Digital Solutions.",
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
      "Software engineer, MetaTrader expert advisor developer and technology consultant in Kampala, Uganda.",
    url: "https://trevordigitalsolutions.com/founder",
    images: [{ url: "/founder.png", alt: "Mwesigwa Trevor Joseph" }],
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/founder" },
}

/** Areas of hands-on engineering work. */
const PRACTICE_AREAS = [
  {
    title: "Software engineering",
    description:
      "Full-stack delivery across the lifecycle: data modelling, backend services, interfaces and deployment. Primarily TypeScript, React, Next.js, Node.js and Python on PostgreSQL.",
    stack: ["TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL"],
  },
  {
    title: "Trading technologies",
    description:
      "Automated trading systems for MetaTrader 4 and 5: expert advisors coded to a documented strategy, custom indicators, backtesting and risk management modules.",
    stack: ["MQL4", "MQL5", "MetaTrader 4", "MetaTrader 5", "Python"],
  },
  {
    title: "Business systems",
    description:
      "ERP, inventory, CRM and sector-specific management systems, including the process mapping and data migration that decide whether they get adopted.",
    stack: ["ERP", "Inventory", "CRM", "Reporting", "Data migration"],
  },
  {
    title: "Cloud & consulting",
    description:
      "Deployment pipelines, infrastructure and architecture review, plus advisory work for organisations deciding what to build, buy or retire.",
    stack: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Terraform"],
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
      "MetaTrader expert advisor development",
      "Algorithmic trading",
      "Cloud infrastructure",
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
        lead="Software engineer, MetaTrader expert advisor developer and technology consultant, working from Kampala, Uganda. He founded Trevor Digital Solutions to do client software the way he thought it should be done."
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

      {/* Portrait + profile */}
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

              <div className="mx-auto mt-6 max-w-sm rounded-xl bg-surface p-5 ring-1 ring-hairline lg:mx-0">
                <p className="eyebrow">Get in touch</p>
                <ul className="mt-4 space-y-3 text-sm">
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
            <h2 className="eyebrow">Profile</h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="text-lg text-foreground/90">
                Trevor works across the whole software lifecycle rather than one
                layer of it: the conversation that establishes what a business
                needs, the data model underneath, the interface on top, and the
                infrastructure it runs on.
              </p>
              <p>
                That range came from the kind of work available in Kampala, where
                a client rarely wants a specialist for one slice of a system.
                They want the system. It means the architecture decisions get
                made by someone who will also have to maintain the result, which
                tends to produce more conservative and more durable choices.
              </p>
              <p>
                In trading technology he specialises in MetaTrader 4 and 5
                development: expert advisors written to a documented strategy in
                MQL4 and MQL5, custom indicators, backtesting and risk
                management. The discipline there is unforgiving, because an
                ambiguous rule becomes a losing trade rather than a support
                ticket, and it shaped how he specifies requirements everywhere
                else.
              </p>
              <p>
                He founded {site.name} to take on client work with that
                approach: understand the business before proposing software,
                scope it in writing, build it to be maintained, and remain
                responsible for it afterwards. As a consultant he also advises
                organisations on architecture, cloud migration and where
                automation or AI genuinely earns its cost &mdash; including when
                the honest answer is that a project should not be built.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Practice areas */}
      <Section tone="surface" space="loose" divide="both">
        <SectionHeading
          eyebrow="Practice areas"
          title="Where the hands-on work happens."
          description="Four areas of direct engineering work, each with the tools used day to day."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-2">
          {PRACTICE_AREAS.map((area, index) => (
            <Reveal as="li" key={area.title} index={index} className="bg-surface-raised">
              <div className="h-full p-7 sm:p-8">
                <h3 className="text-lg font-semibold text-foreground">{area.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {area.stack.map((item) => (
                    <li
                      key={item}
                      className="rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground ring-1 ring-hairline"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
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
            That is why discovery is treated as engineering work here rather than
            a sales formality, why scope is written down before development
            starts, and why a client occasionally gets told their project is not
            worth building. It is a slower way to win work and a considerably
            cheaper way to deliver it.
          </p>
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
