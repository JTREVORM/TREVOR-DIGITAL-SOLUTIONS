import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { site } from "@/lib/site"

/**
 * The official TDS logo. The artwork itself is never altered: no redrawing,
 * no recolouring, no stretching. Both components below scale it uniformly.
 *
 * public/logo.png is a 1536x1024 presentation render of the full lockup -
 * the TDS monogram, the "TREVOR DIGITAL SOLUTIONS" wordmark and the tagline -
 * on the brand's own deep navy field. The site background is set to the same
 * navy family, so the artwork sits flush with no visible plate.
 *
 * That full lockup cannot be used at navbar size: at a 40px height the
 * wordmark inside the image renders about 4px tall and the tagline about 1px,
 * which reads as noise rather than a brand. So there are two placements:
 *
 *   LogoMark  - the TDS monogram on its own, for small placements. This is a
 *               window onto the existing artwork at uniform scale (measured
 *               source region x 390-1170, y 204-604), the standard "mark vs
 *               lockup" distinction. Nothing is redrawn or squashed.
 *   LogoFull  - the complete lockup, used where it has room to be read: the
 *               brand panel on the About page.
 *
 * If a purpose-made square mark asset becomes available, drop it in and point
 * LogoMark at it directly - the crop maths here exists only because the
 * supplied file is a wide presentation render.
 */

const LOGO_WIDTH = 1536
const LOGO_HEIGHT = 1024

/** Geometry of the monogram window, derived from the artwork. */
const MARK_ASPECT = "1.95 / 1"
const MARK_IMAGE_CLASSES = "absolute top-[-51%] left-[-50%] h-auto w-[196.9%] max-w-none"

type LogoMarkProps = {
  className?: string
  /** Preload in the document head. Navbar only. */
  preload?: boolean
}

/** The TDS monogram, for navbar and footer scale. */
export function LogoMark({ className, preload = false }: LogoMarkProps) {
  return (
    <span
      className={cn("relative block shrink-0 overflow-hidden rounded-[3px]", className)}
      style={{ aspectRatio: MARK_ASPECT }}
    >
      <Image
        src="/logo.png"
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        preload={preload}
        sizes="160px"
        aria-hidden
        className={MARK_IMAGE_CLASSES}
      />
    </span>
  )
}

/** The complete lockup, unmodified, for brand sections with room to read it. */
export function LogoFull({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt={`${site.name} logo`}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      sizes="(max-width: 1024px) 100vw, 620px"
      className={cn("h-auto w-full object-contain", className)}
    />
  )
}

type BrandLockupProps = {
  /** Render as a link to the homepage. Pass an empty string for static use. */
  href?: string
  /** `compact` for the navbar, `stacked` for the footer. */
  variant?: "compact" | "stacked"
  className?: string
  preload?: boolean
}

/**
 * Monogram plus the company name set in type. The typographic wordmark is what
 * carries legibility at these sizes; the monogram carries the identity.
 */
export function BrandLockup({
  href = "/",
  variant = "compact",
  className,
  preload = false,
}: BrandLockupProps) {
  const compact = variant === "compact"

  const content = (
    <>
      <LogoMark preload={preload} className={compact ? "h-9 sm:h-10" : "h-11"} />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "truncate font-[family-name:var(--font-display)] font-semibold tracking-tight text-foreground",
            compact ? "text-[0.9375rem] sm:text-base" : "text-lg"
          )}
        >
          Trevor Digital Solutions
        </span>
        <span
          className={cn(
            "mt-1.5 text-[0.6875rem] font-medium tracking-[0.14em] text-muted-foreground uppercase",
            compact && "hidden sm:block"
          )}
        >
          Software Engineering
        </span>
      </span>
    </>
  )

  const classes = cn(
    "flex items-center gap-3 transition-opacity hover:opacity-90",
    className
  )

  if (!href) {
    return <div className={classes}>{content}</div>
  }

  return (
    <Link href={href} className={classes} aria-label={`${site.name} home`}>
      {content}
    </Link>
  )
}
