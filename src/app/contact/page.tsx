import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { ContactSection } from "@/components/sections/contact"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { Reveal } from "@/components/site/reveal"
import { WhatsAppIcon } from "@/components/site/social-icons"
import { contact, site } from "@/lib/site"
import { serviceCategories } from "@/lib/content/services"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a business problem that software could solve? Talk to Trevor Digital Solutions about your project, requirements or technology needs. Phone, WhatsApp, email or the enquiry form. Based in Kampala, Uganda.",
  keywords: [
    "contact Trevor Digital Solutions",
    "software developer Kampala contact",
    "hire software company Uganda",
    "custom software quote Uganda",
  ],
  openGraph: {
    title: "Contact Trevor Digital Solutions",
    description:
      "Have a business problem that software could solve? Tell us about it — written scope and price before anything starts.",
    url: "https://trevordigitalsolutions.com/contact",
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/contact" },
}

/** The three ways to reach us, surfaced above the form. */
const CHANNELS = [
  {
    label: "Call",
    value: contact.phone,
    href: contact.phoneHref,
    note: "Fastest for anything urgent",
    icon: Phone,
    external: false,
  },
  {
    label: "WhatsApp",
    value: "Message us",
    href: contact.whatsapp,
    note: "Send screenshots or voice notes",
    icon: WhatsAppIcon,
    external: true,
  },
  {
    label: "Email",
    value: contact.email,
    href: contact.emailHref,
    note: "Best for detailed requirements",
    icon: Mail,
    external: false,
  },
]

const NEXT_STEPS = [
  {
    id: "01",
    title: "We reply",
    description: "Usually within one business day, with questions or a time to talk.",
  },
  {
    id: "02",
    title: "We scope it",
    description:
      "A discovery conversation, then a written scope, timeline and fixed price.",
  },
  {
    id: "03",
    title: "You decide",
    description:
      "No obligation. If the numbers do not work, or the project should not be built, we say so early.",
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Have a business problem that software could solve?"
        lead="Tell us what is not working today and what you need it to do instead. You do not need a technical specification, or even a clear idea of the solution — describing the problem is enough to start. You will hear back from the people who would build it."
        crumbs={[{ name: "Home", href: "/" }, { name: "Contact" }]}
      >
        {/* Channels */}
        <div>
          <p className="eyebrow mb-5">Reach us directly</p>
          <ul className="grid gap-4 sm:grid-cols-3">
            {CHANNELS.map((channel, index) => (
              <Reveal as="li" key={channel.label} index={index} className="h-full">
                <a
                  href={channel.href}
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex h-full flex-col rounded-xl bg-surface-raised p-5 ring-1 ring-hairline transition-colors duration-200 hover:ring-primary/40"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                    <channel.icon className="size-[1.125rem]" aria-hidden />
                  </span>
                  <span className="mt-4 font-[family-name:var(--font-mono)] text-[0.6875rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
                    {channel.label}
                  </span>
                  <span className="mt-1.5 block text-[0.9375rem] font-medium break-all text-foreground transition-colors group-hover:text-brand-lift">
                    {channel.value}
                  </span>
                  <span className="mt-2 text-xs text-muted-foreground">
                    {channel.note}
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-brand-lift" aria-hidden />
              {site.location}
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="size-4 shrink-0 text-brand-lift" aria-hidden />
              {site.hours}
            </li>
          </ul>
        </div>
      </PageHero>

      {/* The form */}
      <ContactSection />

      {/* What happens next */}
      <Section tone="surface" space="default" divide="both">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <h2 className="eyebrow">What happens next</h2>
            <p className="mt-5 text-xl leading-snug font-semibold text-foreground sm:text-2xl">
              No pressure, and no obligation to proceed.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              You get a written scope and a price before development starts, so
              the budget conversation happens at the beginning rather than
              halfway through.
            </p>
          </div>

          <ol className="grid gap-px overflow-hidden rounded-xl bg-hairline ring-1 ring-hairline sm:grid-cols-3">
            {NEXT_STEPS.map((step) => (
              <li key={step.id} className="bg-surface-raised p-6">
                <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.12em] text-brand-lift">
                  {step.id}
                </span>
                <h3 className="mt-3 text-[0.9375rem] font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* What people usually ask about */}
      <Section space="default">
        <div className="max-w-2xl">
          <h2 className="eyebrow">Not sure where your project fits?</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            These are the areas we build in. Naming one helps, but it is not
            required — describe the problem and we will work out which it falls
            under.
          </p>
        </div>
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {serviceCategories.map((category) => (
            <li key={category.id}>
              <a
                href={`/services#${category.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-surface px-3.5 py-2.5 text-[0.8125rem] font-medium text-muted-foreground ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-primary/35"
              >
                <category.icon className="size-4 text-brand-lift" aria-hidden />
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
