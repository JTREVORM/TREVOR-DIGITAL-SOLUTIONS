/**
 * TDS email templates.
 *
 * Email is not the web. These templates are deliberately old-fashioned —
 * tables, inline styles, no custom fonts, no media queries doing anything
 * load-bearing — because Outlook, Gmail's clipper and Apple Mail disagree
 * about everything else. The brand comes through in the palette and the
 * typography, not in layout tricks that only render in one client.
 *
 * The palette is the TDS brand blue from src/app/globals.css, on a light
 * ground. The site is dark; email is not, because a dark email renders
 * unpredictably once a client inverts it.
 */

const BRAND = "#0069e5"
const BRAND_LIFT = "#0799fc"
const INK = "#0a1220"
const BODY = "#3d4a5c"
const MUTED = "#6b7a90"
const HAIRLINE = "#e2e8f0"
const CANVAS = "#f4f6fa"

/** The five things TDS Insights actually publishes. */
export const CATEGORIES = [
  ["Technology & News", "Changes in the tools and platforms we build on."],
  ["Software Engineering", "How systems are designed, built and kept running."],
  ["Financial Markets", "Trading technology and the engineering behind it."],
  ["Artificial Intelligence", "Where AI earns its cost, and where it does not."],
  ["Business & Digital", "Operations, digitisation, and buying versus building."],
] as const

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * A readable plain-text alternative.
 *
 * Every message ships with one. Some clients prefer it, some spam filters
 * distrust an HTML-only message, and a text part costs nothing.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

/**
 * The shell every TDS email is poured into: header, body, unsubscribe footer.
 *
 * `previewText` is the line inboxes show beside the subject. It is hidden in
 * the message itself and padded, so the client does not fill the rest of the
 * preview with whatever text happens to come first.
 */
function layout(options: {
  previewText: string
  bodyHtml: string
  unsubscribeUrl: string
  siteUrl: string
  recipient: string
}): string {
  const { previewText, bodyHtml, unsubscribeUrl, siteUrl, recipient } = options

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Trevor Digital Solutions</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(previewText)}
    ${"&#847;&zwnj;&nbsp;".repeat(60)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CANVAS};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:14px;border:1px solid ${HAIRLINE};overflow:hidden;">

          <tr>
            <td style="padding:28px 32px;background:${INK};">
              <a href="${siteUrl}" style="text-decoration:none;color:#ffffff;">
                <span style="display:inline-block;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700;letter-spacing:-0.2px;color:#ffffff;">
                  Trevor Digital Solutions
                </span>
              </a>
              <div style="margin-top:6px;font-family:'SFMono-Regular',Consolas,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${BRAND_LIFT};">
                TDS Insights
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:${BODY};">
              ${bodyHtml}
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 28px;border-top:1px solid ${HAIRLINE};background:#fafbfd;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:${MUTED};">
              <div style="color:${INK};font-weight:600;font-size:13px;">Trevor Digital Solutions</div>
              <div style="margin-top:2px;">Kampala, Uganda &nbsp;&middot;&nbsp;
                <a href="${siteUrl}" style="color:${BRAND};text-decoration:none;">trevordigitalsolutions.com</a>
              </div>
              <div style="margin-top:14px;">
                This message was sent to ${escapeHtml(recipient)} because you subscribed to TDS Insights.
                <br>
                <a href="${unsubscribeUrl}" style="color:${MUTED};text-decoration:underline;">Unsubscribe</a>
                &nbsp;&middot;&nbsp;
                <a href="${siteUrl}/privacy-policy" style="color:${MUTED};text-decoration:underline;">Privacy policy</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/** Shared button markup — a table, because Outlook ignores padding on links. */
function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 6px;">
    <tr>
      <td style="border-radius:8px;background:${BRAND};">
        <a href="${href}" style="display:inline-block;padding:13px 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
          ${escapeHtml(label)}
        </a>
      </td>
    </tr>
  </table>`
}

/* -------------------------------------------------------------------------- */
/*                                 Welcome                                    */
/* -------------------------------------------------------------------------- */

export function welcomeEmail(options: {
  recipient: string
  unsubscribeUrl: string
  siteUrl: string
}): { subject: string; html: string; text: string } {
  const { recipient, unsubscribeUrl, siteUrl } = options

  const categories = CATEGORIES.map(
    ([name, blurb]) => `
      <tr>
        <td style="padding:11px 0;border-bottom:1px solid ${HAIRLINE};">
          <div style="font-size:14px;font-weight:600;color:${INK};">${escapeHtml(name)}</div>
          <div style="font-size:13px;color:${MUTED};margin-top:2px;">${escapeHtml(blurb)}</div>
        </td>
      </tr>`
  ).join("")

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:25px;line-height:1.3;font-weight:700;color:${INK};">
      Welcome to TDS Insights.
    </h1>

    <p style="margin:0 0 16px;">
      Thank you for subscribing. You will get an email when we publish something
      worth your time &mdash; notes on software engineering, business systems and
      market technology, written from work we actually do.
    </p>

    <p style="margin:0 0 8px;">
      There is no schedule to pad out and no marketing sequence behind this. If a
      month is quiet, you will not hear from us.
    </p>

    <div style="margin:26px 0 10px;font-family:'SFMono-Regular',Consolas,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">
      What we write about
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${categories}
    </table>

    ${button(`${siteUrl}/insights`, "Read the latest insights")}

    <p style="margin:22px 0 0;font-size:13px;color:${MUTED};">
      Have a question, or a project in mind?
      <a href="${siteUrl}/contact" style="color:${BRAND};text-decoration:none;">Get in touch</a>.
    </p>`

  const text = [
    "Welcome to TDS Insights.",
    "",
    "Thank you for subscribing. You will get an email when we publish something worth your time - notes on software engineering, business systems and market technology, written from work we actually do.",
    "",
    "There is no schedule to pad out and no marketing sequence behind this. If a month is quiet, you will not hear from us.",
    "",
    "What we write about:",
    ...CATEGORIES.map(([name, blurb]) => `- ${name}: ${blurb}`),
    "",
    `Read the latest insights: ${siteUrl}/insights`,
    "",
    "--",
    "Trevor Digital Solutions, Kampala, Uganda",
    `This message was sent to ${recipient} because you subscribed to TDS Insights.`,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n")

  return {
    subject: "Welcome to Trevor Digital Solutions Insights",
    html: layout({
      previewText:
        "Notes on software engineering, business systems and market technology.",
      bodyHtml,
      unsubscribeUrl,
      siteUrl,
      recipient,
    }),
    text,
  }
}

/* -------------------------------------------------------------------------- */
/*                               Newsletter issue                             */
/* -------------------------------------------------------------------------- */

/**
 * Wraps an issue's authored HTML in the TDS shell.
 *
 * The content comes from the admin editor and is written by staff, so it is
 * inserted as HTML on purpose. It is never visitor input.
 */
export function newsletterEmail(options: {
  subject: string
  previewText: string
  contentHtml: string
  category?: string | null
  recipient: string
  unsubscribeUrl: string
  siteUrl: string
}): { html: string; text: string } {
  const {
    subject,
    previewText,
    contentHtml,
    category,
    recipient,
    unsubscribeUrl,
    siteUrl,
  } = options

  const eyebrow = category
    ? `<div style="margin:0 0 12px;font-family:'SFMono-Regular',Consolas,monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${BRAND};">${escapeHtml(
        category
      )}</div>`
    : ""

  const bodyHtml = `
    ${eyebrow}
    <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:25px;line-height:1.3;font-weight:700;color:${INK};">
      ${escapeHtml(subject)}
    </h1>
    <div style="font-size:15px;line-height:1.7;color:${BODY};">
      ${contentHtml}
    </div>
    <div style="margin-top:28px;padding-top:20px;border-top:1px solid ${HAIRLINE};font-size:13px;color:${MUTED};">
      More at <a href="${siteUrl}/insights" style="color:${BRAND};text-decoration:none;">trevordigitalsolutions.com/insights</a>
    </div>`

  const text = [
    subject,
    "",
    htmlToText(contentHtml),
    "",
    `More at ${siteUrl}/insights`,
    "",
    "--",
    "Trevor Digital Solutions, Kampala, Uganda",
    `This message was sent to ${recipient} because you subscribed to TDS Insights.`,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n")

  return {
    html: layout({
      previewText: previewText || htmlToText(contentHtml).slice(0, 140),
      bodyHtml,
      unsubscribeUrl,
      siteUrl,
      recipient,
    }),
    text,
  }
}
