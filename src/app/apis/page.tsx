import { ApiList } from "@/modules/api-directory"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Public APIs Directory - OpenDev Hub",
  description: "Browse curated developer-friendly APIs with authorization schemes, limits, and docs.",
}

export default function ApisPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <ApiList />
    </div>
  )
}
