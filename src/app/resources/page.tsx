import { ResourceList } from "@/modules/resources-hub"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learning Resources Directory - OpenDev Hub",
  description: "Study structured tutorials, scalability books, and typescript guides from curated sources.",
  alternates: {
    canonical: "/resources",
  },
}

export default function ResourcesPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <ResourceList />
    </div>
  )
}
