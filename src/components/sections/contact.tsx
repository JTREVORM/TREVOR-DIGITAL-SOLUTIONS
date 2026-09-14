"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { submitContactForm } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { contact } from "@/lib/site"
import { services } from "@/lib/content/services"

/** Prompts that make a first enquiry genuinely answerable. */
const MESSAGE_PROMPTS = [
  "What is not working today, and who it affects",
  "How the process is handled now — spreadsheets, paper, an existing system",
  "Roughly how many people would use what we build",
  "Any deadline you are working towards",
  "Systems it would need to connect to, if you know",
]

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

  /**
   * Submitted through onSubmit rather than the `action` prop on purpose.
   *
   * React 19 automatically resets a form whose `action` is a function, and it
   * does so whether the action succeeded or failed. On a failed send that
   * wipes everything the visitor typed — including a long project description
   * they are unlikely to retype. Handling submit ourselves keeps their input
   * on screen, and we reset only once the enquiry is actually stored.
   *
   * Native validation still runs first: onSubmit does not fire until the
   * required fields pass.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
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
        form.reset()
      } else {
        toast.error("Could not send", {
          description: result.error || "Failed to send your message.",
          duration: 10000,
        })
      }
    } catch {
      toast.error("Could not send", {
        description: "Something went wrong. Please call or message us instead.",
        duration: 10000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
          {/* Guidance. The contact channels themselves live in the page
              masthead, so repeating them here would just be noise. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="eyebrow">What to include</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              None of this is required, and a couple of sentences is a perfectly
              good start. It just makes our first reply more useful than
              &ldquo;let&apos;s set up a call&rdquo;.
            </p>

            <ul className="mt-8 space-y-4">
              {MESSAGE_PROMPTS.map((prompt) => (
                <li key={prompt} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
                  <span className="leading-relaxed text-muted-foreground">{prompt}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl bg-surface p-5 ring-1 ring-hairline">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Prefer to talk it through? Call{" "}
                <a
                  href={contact.phoneHref}
                  className="font-medium text-brand-lift underline-offset-4 hover:underline"
                >
                  {contact.phone}
                </a>{" "}
                or message us on{" "}
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-lift underline-offset-4 hover:underline"
                >
                  WhatsApp
                </a>
                .
              </p>
            </div>
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
                onSubmit={handleSubmit}
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
