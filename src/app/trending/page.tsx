import { TrendingList } from "@/modules/trending"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Trending Repositories - OpenDev Hub",
  description: "See the fastest-growing open source projects in developer ecosystems right now.",
}

export default function TrendingPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <TrendingList />
    </div>
  )
}
