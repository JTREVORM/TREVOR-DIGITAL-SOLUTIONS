import type { Metadata } from "next"
import { ContactSection } from "@/components/sections/contact"
import { PageHero } from "@/components/site/page-hero"
import { processSteps } from "@/lib/content/company"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Trevor Digital Solutions about your project. Based in Kampala, Uganda. Phone, WhatsApp, email or the enquiry form.",
  openGraph: {
    title: "Contact Trevor Digital Solutions",
    description: "Tell us what you need built. Written scope and price before anything starts.",
    url: "https://trevordigitalsolutions.com/contact",
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/contact" },
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Start a project."
        lead="Tell us what the software needs to do and what is not working today. You will get a reply from the people who would build it, and a straight answer if we are not the right fit."
        crumbs={[{ name: "Home", href: "/" }, { name: "Contact" }]}
      >
        <div>
          <p className="eyebrow mb-5">What happens next</p>
          <ol className="grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-3">
            {[
              {
                id: "01",
                title: "We reply",
                description:
                  "Usually within one business day, with questions or a call time.",
              },
              {
                id: "02",
                title: "We scope it",
                description:
                  "A discovery conversation, then a written scope, timeline and price.",
              },
              {
                id: "03",
                title: "You decide",
                description:
                  "No obligation. If the numbers do not work, we will say so early.",
              },
            ].map((step) => (
              <li key={step.id} className="bg-surface-raised p-6">
                <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.12em] text-brand-lift">
                  {step.id}
                </span>
                <h2 className="mt-3 text-[0.9375rem] font-semibold text-foreground">
                  {step.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-muted-foreground">
            Every project then follows the same {processSteps.length} stages, from
            discovery through to support after launch.
          </p>
        </div>
      </PageHero>

      <ContactSection />
    </>
  )
}
