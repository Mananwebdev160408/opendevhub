import { ReadmeBuilder } from "@/modules/readme-builder"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "GitHub Profile README Markdown Builder - OpenDev Hub",
  description: "Construct a customized profile README.md file for your GitHub user overview. Toggle shields.io badges, social handles, and stats card generators.",
  alternates: {
    canonical: "/readme-builder",
  },
}

export default function ReadmeBuilderPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <ReadmeBuilder />
    </div>
  )
}
