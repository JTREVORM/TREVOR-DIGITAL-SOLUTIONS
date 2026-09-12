import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { primaryNav } from "@/lib/site"

export default function NotFound() {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden py-24 sm:py-32">
      <div className="brand-wash-soft pointer-events-none absolute inset-0" aria-hidden />
      <div className="shell relative">
        <div className="max-w-xl">
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-6 text-[2rem] leading-[1.1] font-semibold text-foreground sm:text-[2.75rem]">
            That page does not exist.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            The link may be out of date, or the address may have a typo in it.
            Everything on the site is reachable from the pages below.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="cta-lg" asChild>
              <Link href="/">
                Back to home
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button size="cta-lg" variant="outline" asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>

          <nav aria-label="Site pages" className="mt-12 border-t border-hairline pt-8">
            <p className="eyebrow mb-4">All pages</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}
