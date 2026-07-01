import { CssBezier } from "@/modules/css-bezier"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cubic Bezier Curve Playground & Timing Simulator - OpenDev Hub",
  description: "Create and simulate custom CSS timing functions with a drag-and-drop coordinate grid. Compare curves live and export cubic-bezier transitions.",
  alternates: {
    canonical: "/css-bezier",
  },
}

export default function CssBezierPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <CssBezier />
    </div>
  )
}
