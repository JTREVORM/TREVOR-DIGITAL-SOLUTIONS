import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { CtaBand } from "@/components/site/cta-band"
import { AboutSection } from "@/components/sections/about"
import {
  coreValues,
  problemsWeSolve,
  processSteps,
  supportCommitments,
} from "@/lib/content/company"
import { serviceCategories } from "@/lib/content/services"
import { site, defaultOgImages } from "@/lib/site"
import { BreadcrumbJsonLd } from "@/components/site/structured-data"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "A software engineering company in Kampala, Uganda. What we build, the problems we solve, and how we work — from scoping through to support after launch.",
  keywords: [
    "About Trevor Digital Solutions",
    "Trevor Digital Solutions Uganda",
    "Software Company Kampala",
    "Software Company Uganda",
    "Mwesigwa Trevor Joseph",
    "software engineering company Uganda",
  ],
  openGraph: {
    title: "About Trevor Digital Solutions",
    description:
      "A software engineering company in Kampala, Uganda. What we build, the problems we solve, and how we work.",
    url: "https://trevordigitalsolutions.com/about",
    images: defaultOgImages,
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/about" },
}

/** Pages that live under About rather than in the primary navigation. */
const ABOUT_LINKS = [
  {
    href: "/founder",
    title: "The founder",
    description: `${site.founder}, ${site.founderRole} — background, focus areas and the thinking behind TDS.`,
  },
  {
    href: "/leadership",
    title: "Leadership",
    description:
      "How the company is run, who is accountable for what, and how decisions get made.",
  },
  {
    href: "/testimonials",
    title: "Client feedback",
    description: "What the businesses we have built for have said about the work.",
  },
]

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />

      <PageHero
        eyebrow="About TDS"
        title="A software company that stays after launch."
        lead="Trevor Digital Solutions designs and builds practical technology for businesses and organisations — custom software, business systems, web and mobile applications, AI and automation, and trading technology. We are engineers first, and it shows in how we scope work, what we refuse to promise, and the fact that we are still maintaining the systems we built."
        crumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
        actions={
          <>
            <Button size="cta-lg" asChild>
              <Link href="/contact">
                Start a Project
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="cta-lg" variant="outline" asChild>
              <Link href="/founder">Meet the founder</Link>
            </Button>
          </>
        }
      />

      {/* Who we are, mission and vision, brand panel */}
      <AboutSection />

      {/* What we do */}
      <Section space="loose">
        <SectionHeading
          eyebrow="What we do"
          title="Six areas of engineering work."
          description="Most engagements start in one of these and grow into a second. Each links through to what it covers in detail."
          action={
            <Button size="cta" variant="outline" asChild>
              <Link href="/services">
                All services
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((category, index) => (
            <Reveal as="li" key={category.id} index={index} className="h-full">
              <Link
                href={`/services#${category.id}`}
                className="group flex h-full flex-col rounded-xl bg-surface p-6 ring-1 ring-hairline transition-colors duration-200 hover:bg-surface-raised hover:ring-primary/40"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                  <category.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {category.name}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {category.what}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-lift">
                  What we build
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Problems we solve */}
      <Section tone="surface" space="loose" divide="both">
        <SectionHeading
          eyebrow="Problems we solve"
          title="What usually brings a client here."
          description="Almost every project starts with one of these six situations. None of them are software problems to begin with — they are operational problems that software turns out to be the cheapest way to fix."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-2 lg:grid-cols-3">
          {problemsWeSolve.map((problem, index) => (
            <Reveal as="li" key={problem.title} index={index} className="bg-surface-raised">
              <div className="h-full p-7">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                  <problem.icon className="size-[1.125rem]" aria-hidden />
                </span>
                <h3 className="mt-5 text-[0.9375rem] leading-snug font-semibold text-foreground">
                  {problem.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {problem.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Our approach */}
      <Section space="loose">
        <SectionHeading
          eyebrow="Our approach"
          title="Scoped before it starts. Five stages, every time."
          description="Whether a project runs four weeks or six months, you always know which stage you are in, what has to happen next, and what it costs. Nothing begins on a handshake."
        />
        <ol className="mt-14 space-y-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline">
          {processSteps.map((step) => (
            <li
              key={step.id}
              className="flex flex-col gap-3 bg-surface p-6 sm:flex-row sm:gap-8 sm:p-7"
            >
              <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.12em] text-brand-lift sm:w-12 sm:shrink-0 sm:pt-1">
                {step.id}
              </span>
              <h3 className="text-base font-semibold text-foreground sm:w-48 sm:shrink-0">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-2">
          {coreValues.map((value, index) => (
            <Reveal as="div" key={value.title} index={index} className="bg-surface-raised">
              <div className="h-full p-7">
                <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.12em] text-brand-lift">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Quality and long-term support */}
      <Section tone="surface" space="loose" divide="both">
        <SectionHeading
          eyebrow="After launch"
          title="Quality is what survives the handover."
          description="A system is judged over years of use, not on demo day. Four commitments that apply to every project we take on."
        />
        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:gap-x-14">
          {supportCommitments.map((item, index) => (
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

      {/* Founder */}
      <Section space="loose">
        <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-center lg:gap-16">
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
            <h2 className="eyebrow">Founder</h2>
            <p className="mt-5 text-2xl leading-snug font-semibold text-foreground sm:text-3xl">
              {site.founder}
            </p>
            <p className="mt-2 text-brand-lift">{site.founderRole}</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Software engineer, expert advisor developer and technology
              consultant. He founded Trevor Digital Solutions to do client work
              the way he thought it should be done: understand the business
              first, scope honestly, build properly, and stay responsible for
              the result.
            </p>
            <Button size="cta" variant="outline" className="mt-8" asChild>
              <Link href="/founder">
                Read the full profile
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </Reveal>
        </div>
      </Section>

      {/* Further reading: keeps Founder, Leadership and Testimonials reachable
          now that they are out of the primary navigation. */}
      <Section tone="surface" space="default" divide="top">
        <h2 className="text-2xl font-semibold text-foreground">More about TDS</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {ABOUT_LINKS.map((link, index) => (
            <Reveal as="li" key={link.href} index={index} className="h-full">
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-xl bg-surface-raised p-6 ring-1 ring-hairline transition-colors duration-200 hover:ring-primary/40"
              >
                <h3 className="text-base font-semibold text-foreground">{link.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-lift">
                  Open
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand secondaryLabel="See our services" secondaryHref="/services" />
    </>
  )
}
