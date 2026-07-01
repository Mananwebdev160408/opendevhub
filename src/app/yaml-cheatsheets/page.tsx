import { YamlCheats } from "@/modules/yaml-cheatsheets"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "YAML Cheatsheet & Syntax Reference - OpenDev Hub",
  description: "Learn YAML structures, data types, scalars, multi-line string folding, literal blocks, and advanced anchors with clean copy-paste examples.",
  alternates: {
    canonical: "/yaml-cheatsheets",
  },
}

export default function YamlCheatsheetsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <YamlCheats />
    </div>
  )
}
