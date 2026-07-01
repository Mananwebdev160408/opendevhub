import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { EventModel } from "@/lib/cache-service"
import eventsDataFallback from "../../../../data/events.json"

export async function GET() {
  try {
    await connectToDatabase()
    const dbEvents = await EventModel.find({}).lean()

    if (dbEvents && dbEvents.length > 0) {
      const events = dbEvents.map((event: any) => ({
        name: event.name,
        timeline: event.timeline,
        description: event.description,
        eligibility: event.eligibility,
        website: event.website,
        category: event.category,
        region: event.region,
        source: event.source,
        importantDates: event.importantDates?.map((d: any) => ({
          event: d.event,
          date: d.date,
        })) ?? [],
      }))
      return NextResponse.json(events)
    }

    console.log("[Events API] MongoDB empty, serving static fallback.")
  } catch (err) {
    console.error("[Events API] MongoDB fetch failed, serving static fallback:", err)
  }

  return NextResponse.json(eventsDataFallback)
}
