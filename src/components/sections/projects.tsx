import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeading } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { ProjectCard } from "@/components/site/project-card"
import { featuredProjects } from "@/lib/content/projects"

/**
 * Featured work on the homepage.
 */
export function ProjectsSection() {
  return (
    <Section id="projects" space="loose">
      <SectionHeading
        eyebrow="Selected work"
        title="Systems in daily use."
        description="A look at the kind of work we take on. Full case studies, with client detail and measured results, are being prepared for publication."
        action={
          <Button size="cta" variant="outline" asChild>
            <Link href="/projects">
              All projects
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* No `priority` here: this section sits far below the fold on the
            homepage, so eager-loading its artwork would compete with the hero
            for bandwidth without ever improving what the visitor sees first. */}
        {featuredProjects.map((project, index) => (
          <Reveal key={project.slug} index={index} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
