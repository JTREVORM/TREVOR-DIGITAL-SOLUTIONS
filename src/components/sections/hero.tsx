import Link from "next/link"
import { ArrowRight, FileCode2, MessageSquare, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { primaryTechnologies } from "@/lib/content/technologies"
import { site } from "@/lib/site"

/**
 * Homepage hero.
 *
 * Kept as a server component: there is nothing interactive here, and the
 * headline is the largest contentful paint, so it should not wait on
 * client-side animation to appear.
 */

const COMMITMENTS = [
  {
    icon: MessageSquare,
    title: "Direct access to your engineer",
    description: "No account manager in between.",
  },
  {
    icon: FileCode2,
    title: "You own the source code",
    description: "Full handover, no lock-in.",
  },
  {
    icon: Radio,
    title: "Built for real networks",
    description: "Works on mobile data, tolerates drops.",
  },
]

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-hairline">
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="brand-wash pointer-events-none absolute inset-0" aria-hidden />
      {/* Fade the grid out toward the bottom so it never fights the content. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent"
        aria-hidden
      />

      <div className="shell relative pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-3xl">
          <p className="eyebrow">Software engineering &middot; {site.location}</p>

          <h1 className="mt-6 text-[2.125rem] leading-[1.08] font-semibold text-foreground sm:text-[3rem] lg:text-[3.75rem]">
            We build the software behind better businesses.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            Trevor Digital Solutions designs and engineers custom software,
            business management systems, websites, mobile applications, AI
            solutions and trading technologies &mdash; built around the way your
            business actually runs, and maintained long after launch.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="cta-lg" asChild>
              <Link href="/contact">
                Start a Project
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="cta-lg" variant="outline" asChild>
              <Link href="/projects">View Our Work</Link>
            </Button>
          </div>
        </div>

        {/* How we work, in three lines. No unverifiable counters. */}
        <ul className="mt-16 grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:mt-20 sm:grid-cols-3">
          {COMMITMENTS.map((item) => (
            <li key={item.title} className="bg-surface/80 p-6 backdrop-blur-sm">
              <item.icon className="size-5 text-brand-lift" aria-hidden />
              <h2 className="mt-4 text-[0.9375rem] font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ul>

        {/* Quiet stack signal. Static: no marquee, no perpetual animation. */}
        <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="mr-1 text-xs font-medium tracking-wide text-muted-foreground/70">
            Working in
          </span>
          {primaryTechnologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground ring-1 ring-hairline"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
