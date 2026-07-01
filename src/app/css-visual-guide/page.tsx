import { CssVisualGuide } from "@/modules/css-visual-guide"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "CSS Flexbox & Grid Interactive Visual Guide - OpenDev Hub",
  description: "Visually toggle Flexbox container directions and Grid sizing alignments. Test parent parameters and item overrides with code generators.",
  alternates: {
    canonical: "/css-visual-guide",
  },
}

export default function CssVisualGuidePage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <CssVisualGuide />
    </div>
  )
}
