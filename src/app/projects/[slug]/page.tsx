import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, ChevronRight, ExternalLink, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { ProjectMedia } from "@/components/site/project-media"
import { ProjectGallery } from "@/components/site/project-gallery"
import { ProjectCard } from "@/components/site/project-card"
import { Reveal } from "@/components/site/reveal"
import {
  categoryOf,
  isCaseStudyReady,
  projectBySlug,
  projects,
} from "@/lib/content/projects"
import { contact, site } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projectBySlug.get(slug)
  if (!project) return { title: "Project not found" }

  const category = categoryOf(project)
  const description = `${project.summary} ${category.name} project by ${site.name} in ${project.industry}.`

  return {
    title: project.name,
    description,
    openGraph: {
      title: `${project.name} | ${site.name}`,
      description,
      url: `${site.url}/projects/${project.slug}`,
      type: "article",
      images: [
        {
          url: project.image ?? "/logo.png",
          width: project.image ? undefined : 1536,
          height: project.image ? undefined : 1024,
          alt: `${project.name} — ${site.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | ${site.name}`,
      description,
      images: [project.image ?? "/logo.png"],
    },
    alternates: { canonical: `${site.url}/projects/${project.slug}` },
  }
}

/** A heading plus body, used for each narrative section of the case study. */
function CaseStudySection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-hairline pt-10">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-2xl font-semibold text-foreground sm:text-[1.75rem]">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

/** Shown in place of narrative that has not been confirmed yet. */
function AwaitingDetail({ what }: { what: string }) {
  return (
    <p className="rounded-lg bg-surface-raised p-5 text-sm leading-relaxed text-muted-foreground ring-1 ring-hairline">
      {what} is being written up with the client and will be published here.
      In the meantime we are happy to walk through this work directly —{" "}
      <Link
        href="/contact"
        className="font-medium text-brand-lift underline-offset-4 hover:underline"
      >
        get in touch
      </Link>{" "}
      and we will talk you through it.
    </p>
  )
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = projectBySlug.get(slug)
  if (!project) notFound()

  const category = categoryOf(project)
  const ready = isCaseStudyReady(project)
  const screenshots = project.screenshots ?? []
  const technologies = project.technologies ?? []
  const others = projects.filter((item) => item.slug !== project.slug).slice(0, 3)

  /** Only facts we actually hold. */
  const details: Array<{ label: string; value: string }> = [
    { label: "Industry", value: project.industry },
    { label: "Category", value: category.name },
    ...(project.solutionType
      ? [{ label: "Solution type", value: project.solutionType }]
      : []),
    ...(project.platforms?.length
      ? [{ label: "Platform", value: project.platforms.join(", ") }]
      : []),
    ...(project.client ? [{ label: "Client", value: project.client }] : []),
    ...(project.year ? [{ label: "Delivered", value: project.year }] : []),
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    url: `${site.url}/projects/${project.slug}`,
    abstract: project.summary,
    about: project.industry,
    genre: category.name,
    creator: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    ...(project.image ? { image: `${site.url}${project.image}` } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Project hero */}
      <section className="relative overflow-hidden border-b border-hairline bg-surface pt-14 pb-16 sm:pt-16 sm:pb-20">
        <div className="brand-wash-soft pointer-events-none absolute inset-0" aria-hidden />
        <div className="shell relative">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5 text-muted-foreground/60" />
              </li>
              <li>
                <Link href="/projects" className="transition-colors hover:text-foreground">
                  Projects
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5 text-muted-foreground/60" />
              </li>
              <li className="text-foreground">{project.name}</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-brand-lift uppercase ring-1 ring-primary/20">
                  <category.icon className="size-3" aria-hidden />
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground">{project.industry}</span>
              </div>

              <h1 className="mt-5 text-[2rem] leading-[1.1] font-semibold text-foreground sm:text-[2.5rem] lg:text-[2.75rem]">
                {project.name}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.summary}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="cta-lg" asChild>
                  <Link href="/contact">
                    Start a similar project
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                {project.projectUrl ? (
                  <Button size="cta-lg" variant="outline" asChild>
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      Visit live site
                      <ExternalLink aria-hidden />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl ring-1 ring-hairline">
              <ProjectMedia
                project={project}
                ratio="4/3"
                sizes="(max-width: 1024px) 100vw, 620px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Case study body */}
      <Section space="loose">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div className="min-w-0 space-y-12">
            {/* 2. Overview */}
            <div>
              <p className="eyebrow">Project overview</p>
              <div className="mt-5">
                {project.overview ? (
                  <p className="text-lg leading-relaxed text-foreground/90">
                    {project.overview}
                  </p>
                ) : (
                  <AwaitingDetail what="A full description of this system" />
                )}
              </div>
            </div>

            {/* 3. The challenge */}
            <CaseStudySection eyebrow="The challenge" title="What needed solving">
              {project.challenge ? (
                <p className="text-base leading-relaxed text-muted-foreground">
                  {project.challenge}
                </p>
              ) : (
                <AwaitingDetail what="The problem this project set out to solve" />
              )}
            </CaseStudySection>

            {/* 4. The solution */}
            <CaseStudySection eyebrow="The solution" title="What we built">
              {project.solution ? (
                <p className="text-base leading-relaxed text-muted-foreground">
                  {project.solution}
                </p>
              ) : (
                <AwaitingDetail what="A breakdown of what we delivered" />
              )}
            </CaseStudySection>

            {/* 5. Key features */}
            <CaseStudySection eyebrow="Key features" title="What the system does">
              {project.features?.length ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 rounded-lg bg-surface p-4 text-sm leading-relaxed text-foreground/90 ring-1 ring-hairline"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <AwaitingDetail what="The feature list for this system" />
              )}
            </CaseStudySection>

            {/* 6. Technology stack */}
            <CaseStudySection eyebrow="Technology stack" title="What it is built with">
              {technologies.length > 0 ? (
                <ul className="flex flex-wrap gap-2.5">
                  {technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md bg-primary/10 px-3 py-1.5 font-[family-name:var(--font-mono)] text-[0.75rem] text-brand-lift ring-1 ring-primary/20"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              ) : (
                <AwaitingDetail what="The stack used on this project" />
              )}
            </CaseStudySection>

            {/* 7. Screenshots */}
            <CaseStudySection eyebrow="Screenshots" title="The interface">
              {screenshots.length > 0 ? (
                <ProjectGallery screenshots={screenshots} projectName={project.name} />
              ) : (
                <p className="rounded-lg bg-surface-raised p-5 text-sm leading-relaxed text-muted-foreground ring-1 ring-hairline">
                  Screenshots of this system are being prepared for publication
                  with the client&apos;s approval. We do not publish
                  representative or stock imagery in their place.
                </p>
              )}
            </CaseStudySection>
          </div>

          {/* 8. Project details */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl bg-surface p-6 ring-1 ring-hairline">
              <h2 className="eyebrow">Project details</h2>
              <dl className="mt-5 space-y-4">
                {details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-[0.6875rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
                      {detail.label}
                    </dt>
                    <dd className="mt-1 text-sm text-foreground">{detail.value}</dd>
                  </div>
                ))}
              </dl>

              {!ready ? (
                <p className="mt-6 border-t border-hairline pt-5 font-[family-name:var(--font-mono)] text-[0.625rem] leading-relaxed tracking-[0.08em] text-muted-foreground/70 uppercase">
                  Case study in preparation
                </p>
              ) : null}
            </div>

            {technologies.length > 0 ? (
              <div className="rounded-xl bg-surface p-6 ring-1 ring-hairline">
                <h2 className="eyebrow">Built with</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground ring-1 ring-hairline"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="edge-light rounded-xl bg-surface-raised p-6 ring-1 ring-primary/20">
              <h2 className="text-base font-semibold text-foreground">
                Have a similar project?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We can scope an equivalent system for your organisation.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <Button size="cta" className="w-full" asChild>
                  <Link href="/contact">
                    Start a Project
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button size="cta" variant="outline" className="w-full" asChild>
                  <a href={contact.phoneHref}>
                    <Phone aria-hidden />
                    Call us
                  </a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Other projects */}
      <Section tone="surface" space="default" divide="top">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-2xl font-semibold text-foreground">Other projects</h2>
          <Button size="cta" variant="outline" asChild>
            <Link href="/projects">
              All projects
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((item, index) => (
            <Reveal as="li" key={item.slug} index={index} className="h-full">
              <ProjectCard project={item} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 9. Final CTA */}
      <CtaBand
        title="Have a similar project? Let's build your solution."
        description="Describe what the system needs to do. You get a written scope, a timeline and a price before development begins."
        primaryLabel="Start a Project"
        secondaryLabel="See our services"
        secondaryHref="/services"
      />
    </>
  )
}
