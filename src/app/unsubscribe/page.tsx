import type { Metadata } from "next"
import { UnsubscribeForm } from "./UnsubscribeForm"

/**
 * /unsubscribe?token=…&email=…
 *
 * Linked from the footer of every newsletter. Both parameters are optional:
 * without either, the page asks for an address, so a link that was mangled in
 * transit still gets the reader where they were going.
 *
 * Never indexed. It is a transactional page for people holding a link, not
 * something a search result should ever lead to.
 */
export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from the Trevor Digital Solutions Insights newsletter.",
  robots: { index: false, follow: false },
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // searchParams is a Promise in Next 16 — awaiting it is what opts this
  // route into dynamic rendering, which is correct here.
  const params = await searchParams

  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value

  const token = first(params.token)?.trim() || null
  const email = first(params.email)?.trim() || ""

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="shell max-w-xl">
        <p className="eyebrow">TDS Insights</p>
        <h1 className="mt-4 text-[2rem] leading-[1.1] font-semibold text-foreground sm:text-[2.5rem]">
          Mailing list
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
          Sorry to see you go. This takes effect immediately.
        </p>

        <div className="mt-9">
          <UnsubscribeForm token={token} initialEmail={email} />
        </div>
      </div>
    </section>
  )
}
