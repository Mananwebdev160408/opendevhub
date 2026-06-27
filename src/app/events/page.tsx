import { EventTimeline } from "@/modules/events"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Open Source Events Schedules - OpenDev Hub",
  description: "View deadlines, registration logs, and schedules for Google Summer of Code, Hacktoberfest, and Outreachy.",
}

export default function EventsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <EventTimeline />
    </div>
  )
}
