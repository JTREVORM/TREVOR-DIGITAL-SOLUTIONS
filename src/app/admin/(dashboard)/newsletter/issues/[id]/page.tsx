"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsletterEditor } from "@/components/admin/newsletter-editor"
import { EmptyState, LoadingState } from "@/components/admin/ui"
import { getNewsletter, getSubscriberStats } from "@/lib/newsletter/service"
import { createClient } from "@/lib/supabase/client"
import type { NewsletterRow } from "@/lib/newsletter/types"

export default function EditNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [newsletter, setNewsletter] = useState<NewsletterRow | null>(null)
  const [activeSubscribers, setActiveSubscribers] = useState(0)
  const [testAddress, setTestAddress] = useState<string>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      const [found, stats, { data }] = await Promise.all([
        getNewsletter(id),
        getSubscriberStats(),
        createClient().auth.getUser(),
      ])
      setNewsletter(found)
      setActiveSubscribers(stats.active)
      setTestAddress(data.user?.email ?? undefined)
      setLoading(false)
    })()
  }, [id])

  if (loading) return <LoadingState label="Loading newsletter" />

  if (!newsletter) {
    return (
      <EmptyState
        icon={Mail}
        title="Newsletter not found"
        description="This newsletter does not exist, or it was deleted."
        action={
          <Button size="cta" asChild>
            <Link href="/admin/newsletter/issues">Back to newsletters</Link>
          </Button>
        }
      />
    )
  }

  return (
    <NewsletterEditor
      newsletter={newsletter}
      activeSubscribers={activeSubscribers}
      defaultTestAddress={testAddress}
    />
  )
}
