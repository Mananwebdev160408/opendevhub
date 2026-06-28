import { IssueExplorer } from "@/modules/issue-explorer"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Good First Issues Finder - OpenDev Hub",
  description: "Find open-source issues tagged as 'good first issue' across hundreds of repositories on GitHub.",
  alternates: {
    canonical: "/issues",
  },
}

export default function IssuesPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <Suspense fallback={
        <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center font-mono text-xs text-zinc-500 uppercase font-bold">
          Querying GitHub Issue Indexes...
        </div>
      }>
        <IssueExplorer />
      </Suspense>
    </div>
  )
}
