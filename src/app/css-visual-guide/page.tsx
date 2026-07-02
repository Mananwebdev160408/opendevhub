import { CssVisualGuide } from "@/modules/css-visual-guide"
import { Metadata } from "next"
import { Suspense } from "react"

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
      <Suspense fallback={
        <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center font-mono text-xs text-zinc-500 uppercase font-bold">
          Initializing Visual Guides...
        </div>
      }>
        <CssVisualGuide />
      </Suspense>
    </div>
  )
}
