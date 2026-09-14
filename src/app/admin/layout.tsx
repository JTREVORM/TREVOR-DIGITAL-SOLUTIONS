import type { Metadata } from "next"

/**
 * Wraps every /admin route, including the sign-in screen.
 *
 * Deliberately thin: the authenticated chrome lives in the (dashboard) route
 * group so the login page is not wrapped by the sidebar it is meant to sit
 * outside. Route groups do not appear in URLs, so paths are unchanged.
 */
export const metadata: Metadata = {
  title: {
    template: "%s | TDS Admin",
    default: "TDS Admin",
  },
  // The portal must never be indexed, whatever robots.txt says.
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
