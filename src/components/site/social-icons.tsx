import type { SVGProps } from "react"

/**
 * lucide-react v1 no longer ships brand glyphs, so the two we need are
 * inlined here as plain SVG. Both inherit `currentColor` and default to the
 * same 1em box as the lucide icons they sit beside.
 */

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
}

export function LinkedInIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

export function FacebookIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  )
}

export function XIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M18.9 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.239H4.298Z" />
    </svg>
  )
}

export function WhatsAppIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.92 1.17-.15.2-.3.22-.6.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.03-1.33-1.15-1.63-.12-.3-.01-.47.13-.63.16-.18.32-.32.48-.52.16-.2.23-.33.33-.55.1-.22.05-.4-.03-.57-.08-.17-.67-1.63-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.48.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.8h-.01a9.76 9.76 0 0 1-4.96-1.36l-.36-.21-3.69.97.99-3.6-.23-.37a9.72 9.72 0 0 1-1.49-5.2c0-5.38 4.38-9.76 9.76-9.76a9.7 9.7 0 0 1 6.9 2.86 9.68 9.68 0 0 1 2.85 6.9c0 5.39-4.38 9.77-9.76 9.77ZM20.47 3.5A11.75 11.75 0 0 0 12.05 0C5.55 0 .26 5.29.26 11.79c0 2.08.54 4.11 1.57 5.9L.16 24l6.46-1.7a11.74 11.74 0 0 0 5.43 1.39h.01c6.5 0 11.79-5.29 11.79-11.79 0-3.15-1.23-6.11-3.38-8.4Z" />
    </svg>
  )
}
