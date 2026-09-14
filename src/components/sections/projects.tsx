import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { ProjectCard } from "@/components/site/project-card"
import { featuredProjects, projectIndustries } from "@/lib/content/projects"

/**
 * Featured work on the homepage.
 *
 * The first project gets the large treatment; the rest sit in a row beneath
 * it. No `priority` on the artwork — this section is far below the fold, so
 * eager-loading it would compete with the hero for bandwidth.
 */
export function ProjectsSection() {
  const [lead, ...rest] = featuredProjects

  if (!lead) return null

  return (
    <Section id="projects" space="loose">
      <SectionHeading
        eyebrow="Selected work"
        title="Systems in daily use."
        description={`Software engineered for ${projectIndustries.length} sectors — from lending and cooperative finance to workshop and retail operations.`}
        action={
          <Button size="cta" variant="outline" asChild>
            <Link href="/projects">
              View All Projects
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <div className="mt-14 grid gap-6 lg:gap-8">
        <Reveal>
          <ProjectCard project={lead} feature />
        </Reveal>

        {rest.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {rest.map((project, index) => (
              <Reveal as="li" key={project.slug} index={index} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  )
}
