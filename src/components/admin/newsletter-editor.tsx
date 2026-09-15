"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Loader2,
  Save,
  Send,
  TestTube2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ConfirmDialog,
  Field,
  PageHeader,
  Panel,
  inputClasses,
  textareaClasses,
} from "@/components/admin/ui"
import { saveNewsletter } from "@/lib/newsletter/service"
import { NEWSLETTER_CATEGORIES, type NewsletterRow } from "@/lib/newsletter/types"
import {
  sendNewsletterToSubscribers,
  sendTestNewsletter,
} from "@/app/actions/newsletter-admin"
import { cn } from "@/lib/utils"

/**
 * The newsletter editor.
 *
 * Saving and sending are deliberately separate verbs with separate buttons.
 * Saving writes a draft row and nothing else — there is no code path from the
 * save button to Resend at all. Sending is a distinct action, behind a
 * confirmation that names the number of people who will receive it, and it
 * goes through a server action that re-checks the caller's role before the
 * Edge Function checks it again.
 */

type Feedback = { kind: "success" | "error"; message: string } | null

export function NewsletterEditor({
  newsletter,
  activeSubscribers,
  defaultTestAddress,
}: {
  newsletter?: NewsletterRow
  /** Shown on the send button so the number is never a surprise. */
  activeSubscribers: number
  defaultTestAddress?: string
}) {
  const router = useRouter()

  const [id, setId] = useState<string | undefined>(newsletter?.id)
  const [status, setStatus] = useState(newsletter?.status ?? "draft")
  const [subject, setSubject] = useState(newsletter?.subject ?? "")
  const [previewText, setPreviewText] = useState(newsletter?.preview_text ?? "")
  const [category, setCategory] = useState(newsletter?.category ?? "")
  const [contentHtml, setContentHtml] = useState(newsletter?.content_html ?? "")

  const [testAddress, setTestAddress] = useState(defaultTestAddress ?? "")
  const [showPreview, setShowPreview] = useState(false)
  const [confirmSend, setConfirmSend] = useState(false)

  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  // Field-level errors stay hidden until something is actually attempted. A
  // blank new issue is incomplete, not wrong, and should not open in red.
  const [attempted, setAttempted] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [testing, startTest] = useTransition()
  const [sending, startSend] = useTransition()

  // A sent issue is a record of what went out. The database refuses to update
  // it too, so this is the interface agreeing with the policy rather than
  // being the thing that enforces it.
  const locked = status === "sent" || status === "sending"
  const busy = saving || testing || sending

  useEffect(() => {
    // Warn before losing unsaved copy — an issue can be a long piece of work.
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [dirty])

  const errors = useMemo(() => {
    const next: Record<string, string> = {}
    if (!subject.trim()) next.subject = "A subject is required."
    if (!contentHtml.trim()) next.content = "The newsletter needs some content."
    return next
  }, [subject, contentHtml])

  function track<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value)
      setDirty(true)
      setFeedback(null)
    }
  }

  async function save(): Promise<string | null> {
    if (Object.keys(errors).length > 0) {
      setAttempted(true)
      setFeedback({ kind: "error", message: Object.values(errors)[0] })
      return null
    }

    setSaving(true)
    try {
      const saved = await saveNewsletter({
        id,
        subject,
        previewText,
        contentHtml,
        category: category || null,
      })
      setId(saved.id)
      setStatus(saved.status)
      setDirty(false)
      setFeedback({ kind: "success", message: "Draft saved. Nothing has been sent." })

      // Move a brand-new issue onto its own URL so a refresh does not create
      // a second copy of it.
      if (!newsletter?.id) {
        router.replace(`/admin/newsletter/issues/${saved.id}`)
      }
      return saved.id
    } catch (caught) {
      setFeedback({ kind: "error", message: (caught as Error).message })
      return null
    } finally {
      setSaving(false)
    }
  }

  function handleTest() {
    if (!testAddress.trim()) {
      setFeedback({ kind: "error", message: "Enter an address to send the test to." })
      return
    }
    if (Object.keys(errors).length > 0) {
      setAttempted(true)
      setFeedback({ kind: "error", message: Object.values(errors)[0] })
      return
    }

    startTest(async () => {
      // Send exactly what is on screen, saved or not, so a test can be run
      // before the first save without silently testing older content.
      const result = await sendTestNewsletter({
        to: testAddress.trim(),
        newsletterId: dirty ? undefined : id,
        subject,
        previewText,
        contentHtml,
        category: category || undefined,
      })
      setFeedback({
        kind: result.ok ? "success" : "error",
        message: result.message,
      })
    })
  }

  function handleSend() {
    setConfirmSend(false)

    startSend(async () => {
      // Always save first. Sending is defined as "send the saved row", so the
      // issue that goes out is exactly the issue in the history.
      const savedId = dirty || !id ? await save() : id
      if (!savedId) return

      const result = await sendNewsletterToSubscribers(savedId)

      setFeedback({
        kind: result.ok ? "success" : "error",
        message: result.message,
      })

      if (result.ok) {
        setStatus("sent")
        router.refresh()
      }
    })
  }

  return (
    <>
      <PageHeader
        title={newsletter?.id ? "Edit newsletter" : "New newsletter"}
        description={
          locked
            ? "This issue has been sent. It is kept exactly as it went out."
            : "Saving stores a draft. Nothing is sent until you press Send newsletter."
        }
        crumbs={[
          { name: "Admin", href: "/admin" },
          { name: "Newsletter", href: "/admin/newsletter" },
          { name: "Newsletters", href: "/admin/newsletter/issues" },
          { name: newsletter?.id ? "Edit" : "New" },
        ]}
        actions={
          <>
            <Button size="cta" variant="ghost" asChild>
              <Link href="/admin/newsletter/issues">Cancel</Link>
            </Button>
            {!locked ? (
              <Button size="cta" variant="outline" disabled={busy} onClick={() => void save()}>
                {saving ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Save className="size-4" aria-hidden />
                )}
                Save draft
              </Button>
            ) : null}
          </>
        }
      />

      {feedback ? (
        <div
          role={feedback.kind === "error" ? "alert" : "status"}
          className={cn(
            "mb-6 flex items-start gap-3 rounded-xl p-4 text-sm ring-1",
            feedback.kind === "success"
              ? "bg-primary/[0.08] text-foreground ring-primary/25"
              : "bg-destructive/[0.08] text-foreground ring-destructive/25"
          )}
        >
          {feedback.kind === "success" ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
          ) : (
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          )}
          <p className="leading-relaxed">{feedback.message}</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* ------------------------------ content ---------------------------- */}
        <div className="space-y-6">
          <Panel title="Content">
            <div className="space-y-5">
              <Field
                label="Subject"
                htmlFor="newsletter-subject"
                required
                error={attempted ? errors.subject : undefined}
                hint="What the reader sees in their inbox. Keep it under about 60 characters."
              >
                <input
                  id="newsletter-subject"
                  type="text"
                  value={subject}
                  disabled={locked}
                  maxLength={300}
                  onChange={(event) => track(setSubject)(event.target.value)}
                  placeholder="What we shipped in March"
                  className={inputClasses}
                />
              </Field>

              <Field
                label="Preview text"
                htmlFor="newsletter-preview"
                hint="The grey line beside the subject in most inboxes. Left empty, clients use the opening of the email."
              >
                <input
                  id="newsletter-preview"
                  type="text"
                  value={previewText}
                  disabled={locked}
                  maxLength={300}
                  onChange={(event) => track(setPreviewText)(event.target.value)}
                  placeholder="Three notes on shipping software that stays shipped."
                  className={inputClasses}
                />
              </Field>

              <Field
                label="Category"
                htmlFor="newsletter-category"
                hint="Shown above the title in the email. Optional."
              >
                <select
                  id="newsletter-category"
                  value={category}
                  disabled={locked}
                  onChange={(event) => track(setCategory)(event.target.value)}
                  className={inputClasses}
                >
                  <option value="">No category</option>
                  {NEWSLETTER_CATEGORIES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Body"
                htmlFor="newsletter-content"
                required
                error={attempted ? errors.content : undefined}
                hint="HTML. Paragraphs and links are enough — email clients ignore most styling, and the TDS header, footer and unsubscribe link are added around this automatically."
              >
                <textarea
                  id="newsletter-content"
                  value={contentHtml}
                  disabled={locked}
                  rows={16}
                  onChange={(event) => track(setContentHtml)(event.target.value)}
                  placeholder={'<p>Hello,</p>\n<p>This month we ...</p>\n<p><a href="https://trevordigitalsolutions.com/insights">Read more</a></p>'}
                  className={cn(textareaClasses, "font-[family-name:var(--font-mono)] text-[0.8125rem]")}
                />
              </Field>

              <div>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => setShowPreview((open) => !open)}
                >
                  <Eye className="size-3.5" aria-hidden />
                  {showPreview ? "Hide preview" : "Preview body"}
                </Button>

                {showPreview ? (
                  <div className="mt-4 rounded-lg border border-hairline bg-white p-5 text-[0.9375rem] leading-relaxed text-[#3d4a5c]">
                    {/* The body is written by staff, never by a visitor, and
                        the real email is assembled server-side. This is a
                        rough look at the middle of it, on the light ground
                        the email actually uses. */}
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                  </div>
                ) : null}
              </div>
            </div>
          </Panel>
        </div>

        {/* ------------------------------- sending --------------------------- */}
        <div className="space-y-6">
          <Panel title="Send a test">
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Sends one copy, subject prefixed with [TEST], to an address you choose.
              Subscribers are not touched.
            </p>
            <Field label="Test address" htmlFor="newsletter-test-address">
              <input
                id="newsletter-test-address"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={testAddress}
                onChange={(event) => setTestAddress(event.target.value)}
                placeholder="you@trevordigitalsolutions.com"
                className={inputClasses}
              />
            </Field>
            <Button
              size="cta"
              variant="outline"
              className="mt-4 w-full"
              disabled={busy}
              onClick={handleTest}
            >
              {testing ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <TestTube2 className="size-4" aria-hidden />
              )}
              Send test email
            </Button>
          </Panel>

          <Panel title="Send to subscribers">
            {locked ? (
              <div className="text-sm leading-relaxed text-muted-foreground">
                <p className="flex items-start gap-2 text-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
                  {status === "sent"
                    ? `Sent to ${newsletter?.recipient_count ?? 0} subscribers.`
                    : "This issue is being sent right now."}
                </p>
                <p className="mt-3">
                  An issue can only go out once. To send something similar, create a
                  new newsletter.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Goes to every active subscriber. Unsaved changes are saved first, so
                  what goes out is exactly what is on screen.
                </p>
                <div className="mb-4 rounded-lg bg-muted/40 p-3.5 ring-1 ring-hairline">
                  <p className="text-2xl font-semibold text-foreground">
                    {activeSubscribers}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    active {activeSubscribers === 1 ? "subscriber" : "subscribers"}
                  </p>
                </div>
                <Button
                  size="cta"
                  className="w-full"
                  disabled={busy || activeSubscribers === 0}
                  onClick={() => setConfirmSend(true)}
                >
                  {sending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Send className="size-4" aria-hidden />
                  )}
                  Send newsletter
                </Button>
                {activeSubscribers === 0 ? (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    There are no active subscribers yet, so there is nobody to send to.
                  </p>
                ) : null}
              </>
            )}
          </Panel>
        </div>
      </div>

      <ConfirmDialog
        open={confirmSend}
        title={`Send to ${activeSubscribers} ${activeSubscribers === 1 ? "subscriber" : "subscribers"}?`}
        description={`"${subject}" will be emailed to every active subscriber immediately. This cannot be undone or recalled, and an issue can only be sent once. Send a test first if you have not already.`}
        confirmLabel="Send newsletter"
        destructive={false}
        busy={sending}
        onConfirm={handleSend}
        onCancel={() => setConfirmSend(false)}
      />
    </>
  )
}
