"use client"

import Link from "next/link"
import { Globe, Mail, Phone, MapPin, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-primary">Trevor Digital Solutions</h3>
            <p className="text-muted-foreground max-w-xs">
              Transforming Ideas Into Powerful Digital Solutions
            </p>
            <p className="text-sm text-muted-foreground">
              Founded by Mwesigwa Trevor Joseph<br />
              Kampala, Uganda
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/256740081305"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a
                href="mailto:trevordigitalsolutions@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/mwesigwa-trevor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+256740081305" className="hover:text-primary transition-colors">
                  +256 740 081 305
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:trevordigitalsolutions@gmail.com" className="hover:text-primary transition-colors break-all">
                  trevordigitalsolutions@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Kampala, Uganda</span>
              </li>
            </ul>
            <div className="pt-2">
              <Button size="sm" className="w-full" asChild>
                <a href="https://wa.me/256740081305" target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/founder" className="hover:text-primary transition-colors">Founder</Link></li>
              <li><Link href="/leadership" className="hover:text-primary transition-colors">Leadership</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/technologies" className="hover:text-primary transition-colors">Technologies</Link></li>
              <li><Link href="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>

            <div className="pt-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/services/custom-software-development" className="hover:text-primary transition-colors">Custom Software</Link></li>
                <li><Link href="/services/web-development" className="hover:text-primary transition-colors">Web Applications</Link></li>
                <li><Link href="/services/mobile-app-development" className="hover:text-primary transition-colors">Mobile Apps</Link></li>
                <li><Link href="/services/forex-expert-advisors" className="hover:text-primary transition-colors">Forex EAs</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Trevor Digital Solutions. All Rights Reserved.</p>
          <p className="text-xs">Built with ❤️ in Kampala, Uganda</p>
          <BackToTop />
        </div>
      </div>
    </footer>
  )
}
