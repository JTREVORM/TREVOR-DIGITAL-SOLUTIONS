import type { Metadata } from "next"
import { TestimonialsSection } from "@/components/sections/testimonials"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Read what our clients say about Trevor Digital Solutions — real results from real businesses transformed by our software.",
  openGraph: {
    title: "Client Testimonials | Trevor Digital Solutions",
    description: "Hear from businesses we've helped through custom software and digital solutions.",
    url: "https://trevordigitalsolutions.com/testimonials",
  },
}

export default function TestimonialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[30rem] w-[30rem] bg-primary/10 rounded-full blur-[80px] opacity-60" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            Client Stories
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">What Our Clients Say</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Don&apos;t take our word for it — hear directly from the businesses we&apos;ve transformed through custom software solutions.
          </p>
          {/* Rating Summary */}
          <div className="inline-flex items-center gap-2 bg-card border border-border px-6 py-3 rounded-full">
            <div className="flex">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <span className="font-bold text-lg">5.0</span>
            <span className="text-muted-foreground">— Average Client Rating</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join our happy clients</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            Let&apos;s create a success story for your business too.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects">View Our Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
