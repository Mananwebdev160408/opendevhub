import { PackageCompare } from "@/modules/npm-compare"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "NPM Package Comparator & Statistics Insight - OpenDev Hub",
  description: "Compare Node.js modules side-by-side. Fetch and analyze download statistics, package versions, licenses, dependencies count, and minified sizes.",
  alternates: {
    canonical: "/npm-compare",
  },
}

export default function NpmComparePage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <PackageCompare />
    </div>
  )
}
