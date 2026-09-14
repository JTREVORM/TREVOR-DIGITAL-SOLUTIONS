import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LogoMark } from "@/components/site/logo"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { site } from "@/lib/site"
import { LoginForm } from "./LoginForm"

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="brand-wash pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative w-full max-w-[26rem]">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="h-11" />
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-foreground">
            {site.name}
          </h1>
          <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.16em] text-muted-foreground uppercase">
            Content administration
          </p>
        </div>

        <div className="rounded-2xl bg-surface p-6 ring-1 ring-hairline sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Sign in</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Administrator access to TDS Insights content.
          </p>

          <div className="mt-7">
            <LoginForm message={message} isConfigured={isSupabaseConfigured} />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          {!isSupabaseConfigured ? (
            <Link
              href="/admin"
              className="text-sm font-medium text-brand-lift underline-offset-4 hover:underline"
            >
              Open the interface preview
            </Link>
          ) : null}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to website
          </Link>
        </div>
      </div>
    </main>
  )
}
