import { RegexVisualizer } from "@/modules/regex-visualizer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Regex Parser Tree & Expression Flow Visualizer - OpenDev Hub",
  description: "Visualize regular expressions in client-side flow diagrams. Understand groupings, lookaheads, alternatives, escapes, and quantifiers with a clean visual node map.",
  alternates: {
    canonical: "/regex-visualizer",
  },
}

export default function RegexVisualizerPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <RegexVisualizer />
    </div>
  )
}
