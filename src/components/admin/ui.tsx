"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle, ChevronRight, Loader2, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { ArticleStatus } from "@/lib/admin/types"

/* ==========================================================================
   Shared admin primitives. Every admin screen builds from these so forms,
   tables, dialogs and empty states stay consistent.
   ========================================================================== */

/* ------------------------------ page header ----------------------------- */

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
}: {
  title: string
  description?: string
  crumbs?: Array<{ name: string; href?: string }>
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-8">
      {crumbs?.length ? (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
            {crumbs.map((crumb, index) => (
              <li key={crumb.name} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight className="size-3.5 text-muted-foreground/50" aria-hidden />
                ) : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-foreground">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-foreground sm:text-[1.75rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}

/* --------------------------------- panel -------------------------------- */

export function Panel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-xl bg-surface ring-1 ring-hairline", className)}>
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-[0.9375rem] font-semibold text-foreground">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  )
}

/* ------------------------------- stat card ------------------------------ */

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  href,
}: {
  label: string
  value: number | string
  icon: LucideIcon
  hint?: string
  href?: string
}) {
  const body = (
    <div className="flex h-full flex-col rounded-xl bg-surface p-5 ring-1 ring-hairline transition-colors group-hover:ring-primary/35">
      <div className="flex items-start justify-between gap-3">
        <p className="font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.12em] text-muted-foreground/70 uppercase">
          {label}
        </p>
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-foreground">{value}</p>
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )

  return href ? (
    <Link href={href} className="group block h-full">
      {body}
    </Link>
  ) : (
    <div className="group h-full">{body}</div>
  )
}

/* ----------------------------- status badge ----------------------------- */

const STATUS_STYLES: Record<ArticleStatus, string> = {
  published: "bg-emerald-500/12 text-emerald-300 ring-emerald-500/25",
  draft: "bg-muted text-muted-foreground ring-hairline",
  scheduled: "bg-amber-500/12 text-amber-300 ring-amber-500/25",
}

const STATUS_LABELS: Record<ArticleStatus, string> = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
}

export function StatusBadge({ status }: { status: ArticleStatus }) {
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

/* ------------------------------ empty state ----------------------------- */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-xl bg-surface px-6 py-14 text-center ring-1 ring-hairline">
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-brand-lift ring-1 ring-primary/20">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  )
}

/* -------------------------------- loading ------------------------------- */

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 rounded-xl bg-surface px-6 py-16 ring-1 ring-hairline"
    >
      <Loader2 className="size-4 animate-spin text-brand-lift" aria-hidden />
      <span className="text-sm text-muted-foreground">{label}…</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-xl bg-destructive/[0.08] px-6 py-10 text-center ring-1 ring-destructive/25"
    >
      <span className="mx-auto inline-flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/25">
        <AlertTriangle className="size-5" aria-hidden />
      </span>
      <p className="mt-4 text-sm text-foreground">{message}</p>
      {onRetry ? (
        <Button size="cta" variant="outline" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}

/* ---------------------------- confirm dialog ---------------------------- */

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  destructive = true,
  onConfirm,
  onCancel,
  busy = false,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
  busy?: boolean
}) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cancel"
        tabIndex={-1}
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-background/80 backdrop-blur-sm"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="relative w-full max-w-md rounded-2xl bg-surface-raised p-6 shadow-2xl ring-1 ring-hairline"
      >
        <h2 id="confirm-title" className="text-lg font-semibold text-foreground">
          {title}
        </h2>
        <p
          id="confirm-description"
          className="mt-2.5 text-sm leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
        <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <Button size="cta" variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button
            size="cta"
            variant={destructive ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={busy}
            autoFocus
          >
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- forms -------------------------------- */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required ? <span className="ml-1 text-brand-lift">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export const inputClasses =
  "h-11 w-full rounded-lg border border-input bg-input/30 px-3.5 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export const textareaClasses =
  "w-full rounded-lg border border-input bg-input/30 px-3.5 py-3 text-sm leading-relaxed text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

/* ------------------------------ toolbar row ----------------------------- */

export function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {children}
    </div>
  )
}
