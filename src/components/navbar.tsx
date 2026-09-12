"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Menu, Phone, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BrandLockup } from "@/components/site/logo"
import { companyNav, contact, primaryNav } from "@/lib/site"

/**
 * Site header.
 *
 * One row at every breakpoint: brand on the left, primary navigation on the
 * right, and a single call to action. The mobile menu is a full panel that
 * locks body scroll and closes on route change or Escape.
 *
 * Note: the company name here is a <span>, not a heading. Each page owns its
 * own <h1>, and a heading in the chrome of every page competes with it.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the panel whenever the route changes. Adjusted during render rather
  // than in an effect, so the panel is already closed on the first frame of
  // the new route and no cascading render is triggered.
  const [renderedPath, setRenderedPath] = React.useState(pathname)
  if (pathname !== renderedPath) {
    setRenderedPath(pathname)
    if (isOpen) setIsOpen(false)
  }

  // Lock scrolling behind the open panel, and allow Escape to dismiss it.
  React.useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <>
      {/* Scrim behind the mobile panel, so the page below reads as inactive
          and a tap outside dismisses the menu.

          It sits outside <header> on purpose: the header carries
          `backdrop-blur`, and a backdrop-filter makes an element the
          containing block for its fixed-position descendants, which would
          trap this overlay inside the 64px bar instead of covering the page. */}
      {isOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={() => setIsOpen(false)}
          className="fixed inset-x-0 top-16 bottom-0 z-40 cursor-default bg-background/85 lg:hidden"
        />
      ) : null}

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isScrolled || isOpen
          ? "border-b border-hairline bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="shell">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <BrandLockup preload className="min-w-0" />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "relative block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.name}
                    {isActive(link.href) ? (
                      <span
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-brand"
                        aria-hidden
                      />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button size="cta" className="hidden lg:inline-flex" asChild>
              <Link href="/contact">
                Start a Project
                <ArrowRight aria-hidden />
              </Link>
            </Button>

            <button
              type="button"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted lg:hidden"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        hidden={!isOpen}
        className="relative z-10 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-hairline bg-background lg:hidden"
      >
        <div className="shell py-6">
          <nav aria-label="Main">
            <ul className="flex flex-col gap-1">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.name}
                    {isActive(link.href) ? (
                      <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 border-t border-hairline pt-6">
            <p className="eyebrow mb-4">Company</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {companyNav
                .filter((link) => link.href !== "/about" && link.href !== "/contact")
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded px-1 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-hairline pt-6">
            <Button size="cta-lg" asChild>
              <Link href="/contact">
                Start a Project
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="cta-lg" variant="outline" asChild>
              <a href={contact.phoneHref}>
                <Phone aria-hidden />
                {contact.phone}
              </a>
            </Button>
          </div>
          </div>
        </div>
      </header>
    </>
  )
}
