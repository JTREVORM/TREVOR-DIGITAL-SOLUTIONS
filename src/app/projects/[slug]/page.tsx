import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, ExternalLink, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { projectBySlug, projects } from "@/lib/content/projects"
import { contact, site } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projectBySlug.get(slug)
  if (!project) return { title: "Project not found" }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} | ${site.name}`,
      description: project.summary,
      url: `${site.url}/projects/${project.slug}`,
      images: [{ url: project.image }],
    },
    alternates: { canonical: `${site.url}/projects/${project.slug}` },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = projectBySlug.get(slug)
  if (!project) notFound()

  const others = projects.filter((item) => item.slug !== project.slug).slice(0, 3)

  /** Facts we can state without inventing anything. */
  const facts = [
    { label: "Category", value: project.category },
    { label: "Industry", value: project.industry },
    ...(project.client ? [{ label: "Client", value: project.client }] : []),
    ...(project.year ? [{ label: "Delivered", value: project.year }] : []),
  ]

  return (
    <>
      {/* Masthead */}
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
              <li aria-hidden>/</li>
              <li>
                <Link href="/projects" className="transition-colors hover:text-foreground">
                  Projects
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground">{project.title}</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="min-w-0">
              <span className="inline-flex rounded-md bg-primary/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.12em] text-brand-lift uppercase ring-1 ring-primary/20">
                {project.category}
              </span>
              <h1 className="mt-5 text-[2rem] leading-[1.1] font-semibold text-foreground sm:text-[2.5rem] lg:text-[2.75rem]">
                {project.title}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.summary}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="cta-lg" asChild>
                  <Link href="/contact">
                    Request something similar
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                {project.projectUrl ? (
                  <Button size="cta-lg" variant="outline" asChild>
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      View live
                      <ExternalLink aria-hidden />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-background ring-1 ring-hairline">
              <Image
                src={project.image}
                alt={`${project.title} interface`}
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
                loading="eager"
                fetchPriority="high"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <Section space="loose">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          {/* Main column */}
          <div className="min-w-0">
            <h2 className="eyebrow">The project</h2>
            <p className="mt-5 text-lg leading-relaxed text-foreground/90">
              {project.overview}
            </p>

            <h2 className="mt-16 text-2xl font-semibold text-foreground">
              What the system does
            </h2>
            <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {project.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
                  {capability}
                </li>
              ))}
            </ul>

            {project.gallery.length > 0 ? (
              <>
                <h2 className="mt-16 text-2xl font-semibold text-foreground">Interface</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Representative screens. Full walkthroughs are published with the
                  case study.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((image, i) => (
                    <div
                      key={`${image}-${i}`}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl bg-background ring-1 ring-hairline"
                    >
                      <Image
                        src={image}
                        alt={`${project.title} screen ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 420px"
                        className="object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl bg-surface p-6 ring-1 ring-hairline">
              <h2 className="eyebrow">Project detail</h2>
              <dl className="mt-5 space-y-4">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-[0.6875rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm text-foreground">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl bg-surface p-6 ring-1 ring-hairline">
              <h2 className="eyebrow">Built with</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
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
              <h2 className="eyebrow">What it changed</h2>
              <ul className="mt-5 space-y-3">
                {project.outcomes.map((outcome) => (
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

            <div className="edge-light rounded-xl bg-surface-raised p-6 ring-1 ring-primary/20">
              <h2 className="text-base font-semibold text-foreground">
                Want something like this?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We can scope an equivalent system for your business.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <Button size="cta" className="w-full" asChild>
                  <Link href="/contact">
                    Request a quote
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

      {/* Other work */}
      <Section tone="surface" space="default" divide="top">
        <h2 className="text-2xl font-semibold text-foreground">Other projects</h2>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-3">
          {others.map((item) => (
            <li key={item.slug} className="bg-surface-raised">
              <Link
                href={`/projects/${item.slug}`}
                className="group flex h-full flex-col p-6 transition-colors hover:bg-surface"
              >
                <span className="font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.12em] text-brand-lift uppercase">
                  {item.industry}
                </span>
                <h3 className="mt-3 flex-1 text-[0.9375rem] leading-snug font-semibold text-foreground">
                  {item.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] text-brand-lift">
                  View
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand secondaryLabel="All projects" secondaryHref="/projects" />
    </>
  )
}
