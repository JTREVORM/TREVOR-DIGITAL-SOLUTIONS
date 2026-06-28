"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Founder", href: "/founder" },
  { name: "Leadership", href: "/leadership" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Technologies", href: "/technologies" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <Image
            src="/logo.png"
            alt="Trevor Digital Solutions Logo"
            width={120}
            height={40}
            className="h-8 sm:h-10 w-auto object-contain shrink-0"
            priority
          />
          <span className="min-w-0 max-w-[7rem] sm:max-w-[8.5rem] md:max-w-[11rem] lg:max-w-[14rem] text-[10px] sm:text-[11px] md:text-sm lg:text-xl font-bold tracking-[0.18em] text-foreground whitespace-nowrap overflow-hidden text-ellipsis shrink">
            TREVOR DIGITAL SOLUTIONS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/contact")}>
            Get Free Consultation
          </Button>
          <Button onClick={() => router.push("/contact")}>
            Request Quote
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 flex flex-col gap-4 shadow-lg">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "p-2 text-base font-medium rounded-md transition-colors hover:bg-muted",
                  pathname === link.href ? "text-primary bg-primary/10" : "text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
            <Button variant="outline" className="w-full justify-center" onClick={() => { router.push("/contact"); setIsOpen(false); }}>
              Get Free Consultation
            </Button>
            <Button className="w-full justify-center" onClick={() => { router.push("/contact"); setIsOpen(false); }}>
              Request Quote
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
