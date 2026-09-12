"use client"

import { useState } from "react"
import { ArrowRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react"
import { submitContactForm } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { WhatsAppIcon } from "@/components/site/social-icons"
import { toast } from "sonner"
import { contact, site } from "@/lib/site"
import { services } from "@/lib/content/services"

const BUDGET_BANDS = [
  "Under $1,000",
  "$1,000 - $3,000",
  "$3,000 - $7,500",
  "$7,500 - $15,000",
  "Over $15,000",
  "Not sure yet",
]

const selectClasses =
  "h-11 w-full rounded-lg border border-input bg-input/30 px-3.5 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

/**
 * The shared Input is sized for dense admin screens (h-8). A public enquiry
 * form needs comfortable touch targets, so the controls are enlarged here on
 * the form itself rather than by changing the component the admin depends on.
 */
const formControlSizing =
  "[&_input]:h-11 [&_input]:px-3.5 [&_textarea]:px-3.5 [&_textarea]:py-3"

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reference, setReference] = useState<string | null>(null)

  async function clientAction(formData: FormData) {
    setIsSubmitting(true)

    const data = {
      fullName: formData.get("fullName") as string,
      companyName: formData.get("companyName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      serviceRequired: formData.get("serviceRequired") as string,
      budget: formData.get("budget") as string,
      projectDescription: formData.get("projectDescription") as string,
    }

    try {
      const result = await submitContactForm(data)
      if (result.success) {
        setReference(result.reference ?? null)
        toast.success("Message sent", {
          description: `We have your enquiry. Reference: ${result.reference}`,
        })
        const form = document.getElementById("contactForm") as HTMLFormElement | null
        form?.reset()
      } else {
        toast.error("Could not send", {
          description: result.error || "Failed to send your message.",
        })
      }
    } catch {
      toast.error("Could not send", {
        description: "Something went wrong. Please call or message us instead.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
          {/* Contact details */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="eyebrow">Reach us directly</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              If you would rather talk than type, call or message. You will
              reach the people who would be building your software, not a call
              centre.
            </p>

            <ul className="mt-8 space-y-5">
              <li>
                <a
                  href={contact.phoneHref}
                  className="group flex items-start gap-4 text-sm"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.6875rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
                      Phone
                    </span>
                    <span className="mt-1 block text-foreground transition-colors group-hover:text-brand-lift">
                      {contact.phone}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={contact.emailHref}
                  className="group flex items-start gap-4 text-sm"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.6875rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
                      Email
                    </span>
                    <span className="mt-1 block break-all text-foreground transition-colors group-hover:text-brand-lift">
                      {contact.email}
                    </span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-4 text-sm">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-[0.6875rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
                    Location
                  </span>
                  <span className="mt-1 block text-foreground">{site.location}</span>
                </span>
              </li>
              <li className="flex items-start gap-4 text-sm">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                  <Clock className="size-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-[0.6875rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
                    Hours
                  </span>
                  <span className="mt-1 block text-foreground">{site.hours}</span>
                </span>
              </li>
            </ul>

            <Button size="cta-lg" variant="outline" className="mt-8 w-full" asChild>
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="size-[1.125rem]" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>

          {/* Form */}
          <div className="min-w-0">
            <div className="rounded-2xl bg-surface p-6 ring-1 ring-hairline sm:p-9">
              <h2 className="text-2xl font-semibold text-foreground">
                Tell us about your project
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The more you can describe the problem, the more useful our first
                reply will be. Fields marked with an asterisk are required.
              </p>

              {reference ? (
                <div className="mt-6 flex items-start gap-3 rounded-lg bg-primary/10 p-4 ring-1 ring-primary/25">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
                  <p className="text-sm text-foreground">
                    Enquiry received. Your reference is{" "}
                    <span className="font-[family-name:var(--font-mono)] text-brand-lift">
                      {reference}
                    </span>
                    . Quote it if you follow up by phone.
                  </p>
                </div>
              ) : null}

              <form
                id="contactForm"
                action={clientAction}
                className={`mt-8 space-y-6 ${formControlSizing}`}
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      autoComplete="name"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      autoComplete="organization"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone or WhatsApp</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+256 ..."
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="serviceRequired">What do you need?</Label>
                    <select
                      id="serviceRequired"
                      name="serviceRequired"
                      defaultValue=""
                      className={selectClasses}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.slug} value={service.title}>
                          {service.title}
                        </option>
                      ))}
                      <option value="Something else">Something else</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget range</Label>
                    <select
                      id="budget"
                      name="budget"
                      defaultValue=""
                      className={selectClasses}
                    >
                      <option value="">Select a range</option>
                      {BUDGET_BANDS.map((band) => (
                        <option key={band} value={band}>
                          {band}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project description *</Label>
                  <Textarea
                    id="projectDescription"
                    name="projectDescription"
                    placeholder="What should the system do? What is not working today? Who will use it?"
                    className="min-h-40 resize-y"
                    required
                    minLength={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    At least a couple of sentences, please. Ten characters
                    minimum.
                  </p>
                </div>

                <div className="flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-relaxed text-muted-foreground sm:max-w-xs">
                    We use your details to reply to this enquiry only. See our{" "}
                    <a href="/privacy-policy" className="text-brand-lift hover:underline">
                      privacy policy
                    </a>
                    .
                  </p>
                  <Button
                    type="submit"
                    size="cta-lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Sending..." : "Send enquiry"}
                    {!isSubmitting ? <ArrowRight aria-hidden /> : null}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
