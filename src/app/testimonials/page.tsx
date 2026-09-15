import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { CtaBand } from "@/components/site/cta-band"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { BreadcrumbJsonLd } from "@/components/site/structured-data"
import { defaultOgImages } from "@/lib/site"

export const metadata: Metadata = {
  title: "Client Feedback",
  description:
    "What businesses have said about working with Trevor Digital Solutions, published with permission from the people quoted.",
  openGraph: {
    title: "Client Feedback | Trevor Digital Solutions",
    description: "Feedback from businesses we have built software for.",
    url: "https://trevordigitalsolutions.com/testimonials",
    images: defaultOgImages,
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/testimonials" },
}

export default function TestimonialsPage() {
  return (
    <>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: "Client Feedback", path: "/testimonials" }]} />

      <PageHero
        eyebrow="Client feedback"
        title="In their words."
        lead="Feedback from businesses whose systems we built. We publish only what the named person has approved, and we will arrange a direct reference call for a serious enquiry rather than expecting you to take a quote on trust."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
          { name: "Client Feedback" },
        ]}
        actions={
          <Button size="cta-lg" variant="outline" asChild>
            <Link href="/projects">
              See the work behind it
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <TestimonialsSection />

      <CtaBand
        title="Ready to start your own project?"
        secondaryLabel="See our services"
        secondaryHref="/services"
      />
    </>
  )
}
