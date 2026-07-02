import { FontExplorer } from "@/modules/fonts"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fonts & Typography Explorer - OpenDev Hub",
  description: "Test and compare popular web fonts, customize test strings, adjust sizes, and export link tag and import CSS codes for integration.",
  alternates: {
    canonical: "/fonts",
  },
}

export default function FontsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <FontExplorer />
    </div>
  )
}
