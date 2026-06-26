import { OrgExplorer } from "@/modules/org-explorer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Open Source Organizations - OpenDev Hub",
  description: "Browse curated collections of prominent software foundations, framework maintainers, and tools creators.",
}

export default function OrgsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <OrgExplorer />
    </div>
  )
}
