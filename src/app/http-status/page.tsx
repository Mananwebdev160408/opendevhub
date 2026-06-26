import { HttpStatuses } from "@/modules/http-status"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "HTTP Status Codes Finder - OpenDev Hub",
  description: "Browse success, redirect, client error, and server error HTTP status codes, their syntax specifications, and details.",
}

export default function HttpStatusPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <HttpStatuses />
    </div>
  )
}
