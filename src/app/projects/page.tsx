import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { CtaBand } from "@/components/site/cta-band"
import { ProjectCard } from "@/components/site/project-card"
import { ProjectsClient } from "./ProjectsClient"
import {
  activeProjectCategories,
  featuredProjects,
  projectIndustries,
  projects,
} from "@/lib/content/projects"
import { site } from "@/lib/site"
import { BreadcrumbJsonLd } from "@/components/site/structured-data"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software built for microfinance providers, SACCOs, automotive services, hardware retail and electrical suppliers, plus AI products built in-house.",
  keywords: [
    "Trevor Digital Solutions projects",
    "software projects Uganda",
    "SACCO system Uganda",
    "microfinance software Uganda",
    "inventory system Uganda",
    "software portfolio Kampala",
  ],
  openGraph: {
    title: "Projects | Trevor Digital Solutions",
    description:
      "Real software for real businesses: financial technology, business systems and AI products.",
    url: "https://trevordigitalsolutions.com/projects",
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/projects" },
}

export default function ProjectsPage() {
  const [lead, ...restFeatured] = featuredProjects

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Projects | ${site.name}`,
    url: `${site.url}/projects`,
    about: projectIndustries,
    hasPart: projects.map((project) => ({
      "@type": "CreativeWork",
      name: project.name,
      url: `${site.url}/projects/${project.slug}`,
      abstract: project.summary,
    })),
  }

  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Portfolio"
        title="We build real software for real business problems."
        lead="Lending and cooperative finance, workshop and retail operations, and AI products built in-house. These are the organisations whose systems we have engineered."
        crumbs={[{ name: "Home", href: "/" }, { name: "Projects" }]}
        actions={
          <>
            <Button size="cta-lg" asChild>
              <Link href="/contact">
                Start a Project
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="cta-lg" variant="outline" asChild>
              <Link href="/services">What we build</Link>
            </Button>
          </>
        }
      >
        {/* Portfolio at a glance, derived from the data rather than claimed. */}
        <dl className="grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-3">
          <div className="bg-surface-raised p-6">
            <dt className="eyebrow">Projects</dt>
            <dd className="mt-3 text-3xl font-semibold text-foreground">
              {projects.length}
            </dd>
          </div>
          <div className="bg-surface-raised p-6">
            <dt className="eyebrow">Sectors</dt>
            <dd className="mt-3 text-3xl font-semibold text-foreground">
              {projectIndustries.length}
            </dd>
          </div>
          <div className="bg-surface-raised p-6">
            <dt className="eyebrow">Categories</dt>
            <dd className="mt-3 text-3xl font-semibold text-foreground">
              {activeProjectCategories.length}
            </dd>
          </div>
        </dl>
      </PageHero>

      {/* Featured */}
      {lead ? (
        <Section space="loose">
          <SectionHeading
            eyebrow="Featured"
            title="Selected work."
            description="Four projects that show the range: regulated financial record-keeping at one end, day-to-day trading operations at the other."
          />

          <div className="mt-14 grid gap-6 lg:gap-8">
            <Reveal>
              <ProjectCard project={lead} feature priority />
            </Reveal>

            {restFeatured.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {restFeatured.map((project, index) => (
                  <Reveal as="li" key={project.slug} index={index} className="h-full">
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
              </ul>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* All projects + filter */}
      <Section id="all-projects" tone="surface" space="loose" divide="both">
        <SectionHeading
          eyebrow="All projects"
          title="Browse by category."
          description="Filter by the kind of system rather than the sector — most of these solve the same underlying problems in different vocabularies."
        />
        <div className="mt-12">
          <ProjectsClient />
        </div>
      </Section>

      <CtaBand
        title="Have a similar project?"
        description="Tell us what the system needs to do. You get a written scope, a timeline and a price before development starts."
        primaryLabel="Start a Project"
        secondaryLabel="See our services"
        secondaryHref="/services"
      />
    </>
  )
}
