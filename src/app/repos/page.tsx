import { RepoExplorer } from "@/modules/repo-explorer"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Repository Explorer - OpenDev Hub",
  description: "Explore and search open-source repositories by language, topic, and stats directly linking to GitHub.",
  alternates: {
    canonical: "/repos",
  },
}

export default function ReposPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <Suspense fallback={
        <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center font-mono text-xs text-zinc-500 uppercase font-bold">
          Connecting to GitHub Search API...
        </div>
      }>
        <RepoExplorer />
      </Suspense>
    </div>
  )
}
