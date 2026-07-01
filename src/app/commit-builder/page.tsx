import { CommitBuilder } from "@/modules/commit-builder"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conventional Commit Message Helper & Linter - OpenDev Hub",
  description: "Standardize your repository commit logs with the Conventional Commit builder. Validate character constraints, trigger breaking flags, and copy output.",
  alternates: {
    canonical: "/commit-builder",
  },
}

export default function CommitBuilderPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <CommitBuilder />
    </div>
  )
}
