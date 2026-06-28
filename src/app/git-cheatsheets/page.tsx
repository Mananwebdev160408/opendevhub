import { GitCheats } from "@/modules/git-cheatsheets"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Git Cheatsheets - OpenDev Hub",
  description: "Read commands syntax, usage examples, and mistakes to avoid for branching, rebasing, and file resets.",
  alternates: {
    canonical: "/git-cheatsheets",
  },
}

export default function GitCheatsheetsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <GitCheats />
    </div>
  )
}
