import type { NextConfig } from "next"

/**
 * Security headers.
 *
 * Applied to every response. These are defence-in-depth on top of the real
 * controls (Supabase Auth, RLS, storage policies) — they reduce the damage a
 * successful injection or a hostile embed could do, they do not replace
 * authorisation.
 *
 * No Content-Security-Policy is set here on purpose. Next.js injects inline
 * scripts for hydration, so a correct CSP needs per-request nonces wired
 * through the proxy; a hand-written one is more likely to break the site
 * silently than to protect it. Worth adding deliberately, not casually.
 */
const securityHeaders = [
  // Stop the browser guessing a response is a different type than declared.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Deny framing entirely: nothing here is meant to be embedded, and this
  // closes off clickjacking against the admin portal.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for none of these.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HTTPS only, including subdomains. Safe here because the production site
  // is served over TLS; it has no effect on localhost.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    // Modern formats first; Next falls back automatically.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        // Article and media images served from Supabase Storage.
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Belt and braces: the admin portal must never be indexed, whatever
        // a crawler does with robots.txt.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ]
  },
}

export default nextConfig
