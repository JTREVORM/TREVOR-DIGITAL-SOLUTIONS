import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { ProjectsClient } from "./ProjectsClient"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software built by Trevor Digital Solutions: analytics platforms, ERP and inventory systems, hospital management software and trading dashboards.",
  keywords: [
    "Trevor Digital Solutions projects",
    "software projects Uganda",
    "ERP projects Uganda",
    "hospital management system Uganda",
    "Forex trading dashboard Uganda",
    "enterprise software portfolio",
  ],
  openGraph: {
    title: "Projects | Trevor Digital Solutions",
    description:
      "Analytics platforms, ERP and inventory systems, hospital management software and trading dashboards.",
    url: "https://trevordigitalsolutions.com/projects",
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/projects" },
}

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Software in daily use."
        lead="Systems built to replace spreadsheets, paper files and manual reconciliation. Detailed case studies with named clients and measured results are in preparation; what follows is the scope and the engineering behind each one."
        crumbs={[{ name: "Home", href: "/" }, { name: "Projects" }]}
        actions={
          <Button size="cta-lg" asChild>
            <Link href="/contact">
              Start a Project
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <Section space="loose">
        <ProjectsClient />
      </Section>

      <CtaBand
        title="Your project could be the next one here."
        description="Tell us what the system needs to do. You get a written scope, a timeline and a price before development starts."
        secondaryLabel="See our services"
        secondaryHref="/services"
      />
    </>
  )
}
