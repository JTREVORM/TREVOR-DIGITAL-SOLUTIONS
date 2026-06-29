import type { Metadata } from "next"
import { ContactSection } from "@/components/sections/contact"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Trevor Digital Solutions for a free consultation. We're ready to help you build your next software project.",
  openGraph: {
    title: "Contact Trevor Digital Solutions",
    description: "Book a free consultation and let's discuss your project.",
    url: "https://trevordigitalsolutions.com/contact",
  },
}

const CONTACT_INFO = [
  { icon: Phone, label: "Phone", value: "+256 740 081 305", href: "tel:+256740081305" },
  { icon: Mail, label: "Email", value: "trevordigitalsolutions@gmail.com", href: "mailto:trevordigitalsolutions@gmail.com" },
  { icon: MapPin, label: "Location", value: "Kampala, Uganda", href: null },
  { icon: Clock, label: "Business Hours", value: "Mon – Sat: 8:00 AM – 6:00 PM EAT", href: null },
]

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[16rem] w-[16rem] sm:h-[20rem] sm:w-[20rem] md:h-[24rem] md:w-[24rem] bg-primary/10 rounded-full blur-[80px] opacity-60" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            Let&apos;s Talk
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your project? Get a free consultation and let&apos;s discuss how we can transform your business with software.
          </p>
          {/* Quick Contact Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
            {CONTACT_INFO.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border">
                <div className="p-2 bg-primary/10 rounded-full">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-xs font-semibold text-center hover:text-primary transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-xs font-semibold text-center">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <ContactSection />
    </>
  )
}
