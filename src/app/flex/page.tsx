"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function FlexRedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const config = searchParams.get("config")
    const query = new URLSearchParams()
    query.set("tab", "flex")
    if (config) {
      query.set("config", config)
    }
    router.replace(`/css-visual-guide?${query.toString()}`)
  }, [router, searchParams])

  return (
    <div className="w-full flex items-center justify-center min-h-[40vh] font-mono text-xs font-bold text-zinc-500 uppercase">
      Redirecting to CSS Visual Guide Workspace...
    </div>
  )
}

export default function FlexRedirectPage() {
  return (
    <Suspense fallback={null}>
      <FlexRedirectContent />
    </Suspense>
  )
}
