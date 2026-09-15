"use client"

import { useEffect, useState } from "react"
import { NewsletterEditor } from "@/components/admin/newsletter-editor"
import { LoadingState } from "@/components/admin/ui"
import { getSubscriberStats } from "@/lib/newsletter/service"
import { createClient } from "@/lib/supabase/client"

export default function NewNewsletterPage() {
  const [activeSubscribers, setActiveSubscribers] = useState(0)
  const [testAddress, setTestAddress] = useState<string>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      const [stats, { data }] = await Promise.all([
        getSubscriberStats(),
        createClient().auth.getUser(),
      ])
      setActiveSubscribers(stats.active)
      // Pre-fill the test field with the editor's own address: it is almost
      // always where a test should go.
      setTestAddress(data.user?.email ?? undefined)
      setLoading(false)
    })()
  }, [])

  if (loading) return <LoadingState label="Preparing editor" />

  return (
    <NewsletterEditor
      activeSubscribers={activeSubscribers}
      defaultTestAddress={testAddress}
    />
  )
}
