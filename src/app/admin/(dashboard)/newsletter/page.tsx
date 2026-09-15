"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  MailCheck,
  MailX,
  Search,
  Trash2,
  UserCheck,
  UserMinus,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  StatCard,
  Toolbar,
  inputClasses,
} from "@/components/admin/ui"
import { NewsletterTabs } from "@/components/admin/newsletter-tabs"
import {
  deleteSubscriber,
  getSubscriberStats,
  listSubscribers,
  setSubscriberStatus,
} from "@/lib/newsletter/service"
import type { SubscriberRow, SubscriberStats } from "@/lib/newsletter/types"
import { cn } from "@/lib/utils"

/**
 * Subscriber management.
 *
 * Reads through the anon key like every other admin screen, which means Row
 * Level Security decides what comes back: `newsletter_subscribers_staff_read`
 * requires the admin or editor role, so a signed-in viewer — or anyone not
 * signed in at all — gets an empty result rather than a mailing list.
 */

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "unsubscribed", label: "Unsubscribed" },
] as const

type StatusFilter = (typeof STATUS_FILTERS)[number]["id"]

function formatDate(value: string | null): string {
  if (!value) return "—"
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function StatusPill({ status }: { status: SubscriberRow["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] uppercase ring-1",
        status === "active"
          ? "bg-emerald-500/12 text-emerald-300 ring-emerald-500/25"
          : "bg-muted text-muted-foreground ring-hairline"
      )}
    >
      {status === "active" ? "Active" : "Unsubscribed"}
    </span>
  )
}

export default function AdminNewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([])
  const [stats, setStats] = useState<SubscriberStats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<StatusFilter>("all")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<SubscriberRow | null>(null)

  const load = useCallback(async () => {
    try {
      const [rows, nextStats] = await Promise.all([
        listSubscribers(),
        getSubscriberStats(),
      ])
      setSubscribers(rows)
      setStats(nextStats)
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

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return subscribers.filter((row) => {
      if (filter !== "all" && row.status !== filter) return false
      if (!term) return true
      return row.email.includes(term) || row.source.toLowerCase().includes(term)
    })
  }, [subscribers, query, filter])

  async function toggleStatus(row: SubscriberRow) {
    setBusyId(row.id)
    try {
      await setSubscriberStatus(
        row.id,
        row.status === "active" ? "unsubscribed" : "active"
      )
      await load()
    } catch (caught) {
      setError((caught as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setBusyId(pendingDelete.id)
    try {
      await deleteSubscriber(pendingDelete.id)
      await load()
      setPendingDelete(null)
    } catch (caught) {
      setError((caught as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Newsletter"
        description="Everyone who has signed up for TDS Insights, and what they asked for."
        crumbs={[{ name: "Admin", href: "/admin" }, { name: "Newsletter" }]}
      />

      <NewsletterTabs />

      <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Subscribers" value={stats.total} icon={Users} hint="All time" />
        <StatCard
          label="Active"
          value={stats.active}
          icon={MailCheck}
          hint="Will receive the next issue"
        />
        <StatCard
          label="Unsubscribed"
          value={stats.unsubscribed}
          icon={MailX}
          hint="Kept on record, never mailed"
        />
      </div>

      {error ? (
        <div className="mb-6">
          <ErrorState message={error} onRetry={() => void load()} />
        </div>
      ) : null}

      <Toolbar>
        <div className="relative lg:max-w-sm lg:flex-1">
          <label htmlFor="subscriber-search" className="sr-only">
            Search subscribers
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id="subscriber-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by email"
            className={cn(inputClasses, "pr-10 pl-10")}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <div
          role="group"
          aria-label="Filter by status"
          className="flex gap-1 rounded-lg bg-surface p-1 ring-1 ring-hairline"
        >
          {STATUS_FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              aria-pressed={filter === option.id}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === option.id
                  ? "bg-primary/12 text-foreground ring-1 ring-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Toolbar>

      {loading ? (
        <LoadingState label="Loading subscribers" />
      ) : subscribers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No subscribers yet"
          description="Nobody has signed up so far. The form at the foot of every Insights page writes here the moment someone does."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nothing matches"
          description="No subscriber matches that search and filter. Try a different address, or clear the filter."
          action={
            <Button
              size="cta"
              variant="outline"
              onClick={() => {
                setQuery("")
                setFilter("all")
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl bg-surface ring-1 ring-hairline">
            {/* Horizontal scroll on narrow screens keeps the columns intact
                instead of crushing an address into three lines. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] text-sm">
                <thead>
                  <tr className="border-b border-hairline text-left">
                    <th scope="col" className="px-5 py-3.5 font-medium text-muted-foreground">
                      Email
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium text-muted-foreground">
                      Subscribed
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium text-muted-foreground">
                      Source
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-hairline last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-5 py-3.5 font-medium text-foreground">
                        {row.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {formatDate(row.subscribed_at)}
                        {row.status === "unsubscribed" && row.unsubscribed_at ? (
                          <span className="block text-xs text-muted-foreground/70">
                            Left {formatDate(row.unsubscribed_at)}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{row.source}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busyId === row.id}
                            onClick={() => void toggleStatus(row)}
                          >
                            {row.status === "active" ? (
                              <>
                                <UserMinus className="size-3.5" aria-hidden />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="size-3.5" aria-hidden />
                                Activate
                              </>
                            )}
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`Delete ${row.email}`}
                            disabled={busyId === row.id}
                            onClick={() => setPendingDelete(row)}
                          >
                            <Trash2 className="size-4 text-destructive" aria-hidden />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Showing {filtered.length} of {subscribers.length}.
            {" "}Deactivating keeps the record and stops the mail; deleting removes it
            entirely, and that person can sign up again as though they were new.
          </p>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this subscriber?"
        description={
          pendingDelete
            ? `${pendingDelete.email} will be removed from the list completely. If you only want to stop emailing them, deactivate instead — that keeps the record so they are not re-added by mistake.`
            : ""
        }
        confirmLabel="Delete"
        busy={busyId === pendingDelete?.id}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
