"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle2,
  History,
  Mail,
  Pencil,
  Plus,
  Send,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
} from "@/components/admin/ui"
import { NewsletterTabs } from "@/components/admin/newsletter-tabs"
import { deleteNewsletter, listNewsletters, listSendHistory } from "@/lib/newsletter/service"
import type {
  NewsletterRow,
  NewsletterSendWithSubject,
  NewsletterStatus,
} from "@/lib/newsletter/types"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<NewsletterStatus, string> = {
  draft: "bg-muted text-muted-foreground ring-hairline",
  sending: "bg-amber-500/12 text-amber-300 ring-amber-500/25",
  sent: "bg-emerald-500/12 text-emerald-300 ring-emerald-500/25",
  failed: "bg-destructive/12 text-destructive ring-destructive/25",
}

const STATUS_LABELS: Record<NewsletterStatus, string> = {
  draft: "Draft",
  sending: "Sending",
  sent: "Sent",
  failed: "Failed",
}

function StatusPill({ status }: { status: NewsletterStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] uppercase ring-1",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

function formatDateTime(value: string | null): string {
  if (!value) return "—"
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminNewsletterIssuesPage() {
  const [newsletters, setNewsletters] = useState<NewsletterRow[]>([])
  const [history, setHistory] = useState<NewsletterSendWithSubject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<NewsletterRow | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const [rows, sends] = await Promise.all([listNewsletters(), listSendHistory()])
      setNewsletters(rows)
      setHistory(sends)
      setError(null)
    } catch (caught) {
      setError((caught as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Wrapped in an async closure so the effect body itself never calls
    // setState synchronously — every update inside load() is after an await.
    void (async () => {
      await load()
    })()
  }, [load])

  async function confirmDelete() {
    if (!pendingDelete) return
    setBusy(true)
    try {
      await deleteNewsletter(pendingDelete.id)
      await load()
      setPendingDelete(null)
    } catch (caught) {
      setError((caught as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Newsletter"
        description="Write an issue, send yourself a test, then send it to the list."
        crumbs={[
          { name: "Admin", href: "/admin" },
          { name: "Newsletter", href: "/admin/newsletter" },
          { name: "Newsletters" },
        ]}
        actions={
          <Button size="cta" asChild>
            <Link href="/admin/newsletter/issues/new">
              <Plus className="size-4" aria-hidden />
              New newsletter
            </Link>
          </Button>
        }
      />

      <NewsletterTabs />

      {error ? (
        <div className="mb-6">
          <ErrorState message={error} onRetry={() => void load()} />
        </div>
      ) : null}

      {loading ? (
        <LoadingState label="Loading newsletters" />
      ) : newsletters.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No newsletters yet"
          description="Nothing has been written so far. A new newsletter is saved as a draft — it is not sent until you explicitly send it."
          action={
            <Button size="cta" asChild>
              <Link href="/admin/newsletter/issues/new">Write the first one</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {newsletters.map((row) => (
            <article
              key={row.id}
              className="rounded-xl bg-surface p-5 ring-1 ring-hairline transition-colors hover:ring-primary/25"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <StatusPill status={row.status} />
                    {row.category ? (
                      <span className="font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.12em] text-muted-foreground/70 uppercase">
                        {row.category}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-2.5 truncate text-base font-semibold text-foreground">
                    {row.subject || "Untitled newsletter"}
                  </h2>

                  {row.preview_text ? (
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {row.preview_text}
                    </p>
                  ) : null}

                  <p className="mt-2.5 text-xs text-muted-foreground">
                    {row.status === "sent" ? (
                      <>
                        Sent {formatDateTime(row.sent_at)} to {row.recipient_count}{" "}
                        {row.recipient_count === 1 ? "subscriber" : "subscribers"}
                      </>
                    ) : (
                      <>Created {formatDateTime(row.created_at)}</>
                    )}
                  </p>

                  {row.last_error ? (
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      {row.last_error}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/newsletter/issues/${row.id}`}>
                      {row.status === "sent" ? (
                        <>
                          <Send className="size-3.5" aria-hidden />
                          View
                        </>
                      ) : (
                        <>
                          <Pencil className="size-3.5" aria-hidden />
                          Edit
                        </>
                      )}
                    </Link>
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Delete ${row.subject}`}
                    onClick={() => setPendingDelete(row)}
                  >
                    <Trash2 className="size-4 text-destructive" aria-hidden />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ------------------------------ history ----------------------------- */}

      <div className="mt-10">
        <Panel
          title="Send history"
          description="Every send attempt, written by the mail function itself and not editable here."
        >
          {loading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                <History className="size-4" aria-hidden />
              </span>
              <p className="text-sm text-muted-foreground">
                Nothing has been sent yet. Tests and full sends both appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] text-sm">
                <thead>
                  <tr className="border-b border-hairline text-left">
                    <th scope="col" className="py-3 pr-4 font-medium text-muted-foreground">
                      Newsletter
                    </th>
                    <th scope="col" className="py-3 pr-4 font-medium text-muted-foreground">
                      Type
                    </th>
                    <th scope="col" className="py-3 pr-4 font-medium text-muted-foreground">
                      Sent
                    </th>
                    <th scope="col" className="py-3 pr-4 font-medium text-muted-foreground">
                      Recipients
                    </th>
                    <th scope="col" className="py-3 font-medium text-muted-foreground">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((send) => (
                    <tr key={send.id} className="border-b border-hairline last:border-0">
                      <td className="py-3 pr-4 text-foreground">
                        {send.newsletters?.subject ?? "Unsaved draft"}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground capitalize">
                        {send.kind}
                        {send.test_recipient ? (
                          <span className="block text-xs text-muted-foreground/70">
                            {send.test_recipient}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {formatDateTime(send.created_at)}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {send.succeeded}
                        {send.failed > 0 ? (
                          <span className="text-destructive"> / {send.failed} failed</span>
                        ) : null}
                      </td>
                      <td className="py-3">
                        {send.status === "success" ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-300">
                            <CheckCircle2 className="size-3.5" aria-hidden />
                            Delivered
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 text-destructive"
                            title={send.error ?? undefined}
                          >
                            <AlertTriangle className="size-3.5" aria-hidden />
                            {send.status === "partial" ? "Partial" : "Failed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this newsletter?"
        description={
          pendingDelete?.status === "sent"
            ? `"${pendingDelete.subject}" has already been sent. Deleting it removes the record and its send history; the emails themselves are already delivered and are not affected.`
            : `"${pendingDelete?.subject ?? ""}" will be deleted. This cannot be undone.`
        }
        confirmLabel="Delete"
        busy={busy}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
