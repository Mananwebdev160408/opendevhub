import { CronBuilder } from "@/modules/cron-builder"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Interactive CRON Schedule Builder & Visualizer - OpenDev Hub",
  description: "Construct CRON schedules visually using interactive selectors. Calculates and displays the next 10 triggering calendar dates client-side.",
  alternates: {
    canonical: "/cron-builder",
  },
}

export default function CronBuilderPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <CronBuilder />
    </div>
  )
}
