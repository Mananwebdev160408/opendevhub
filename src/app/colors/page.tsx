import { ColorPalette } from "@/modules/colors"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Neo-Brutalist Color Palette Generator - OpenDev Hub",
  description: "Generate matching color groups, analyze relative luminance and WCAG contrast ratio compliance, preview palettes in a mock interface, and export as CSS variables, SCSS variables, JSON, or Tailwind config format.",
  alternates: {
    canonical: "/colors",
  },
}

export default function ColorsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <ColorPalette />
    </div>
  )
}
