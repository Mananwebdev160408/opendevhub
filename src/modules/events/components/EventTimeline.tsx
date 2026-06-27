import { Calendar, Globe } from "lucide-react"
import eventsDataFallback from "../../../../data/events.json"
import { connectToDatabase } from "@/lib/mongodb"
import { EventModel } from "@/lib/cache-service"
import { EventTimelineClient } from "./EventTimelineClient"

interface EventItem {
  name: string
  timeline: string
  description: string
  eligibility: string
  website: string
  importantDates: { event: string; date: string }[]
  category?: string
  region?: string
  source?: string
}

async function getEvents(): Promise<{ events: EventItem[]; error: string | null }> {
  try {
    await connectToDatabase()
    const dbEvents = await EventModel.find({}).lean()
    
    if (dbEvents && dbEvents.length > 0) {
      console.log(`[Events DB Hit] Loaded ${dbEvents.length} events from MongoDB.`)
      return {
        events: dbEvents.map((event: any) => ({
          name: event.name,
          timeline: event.timeline,
          description: event.description,
          eligibility: event.eligibility,
          website: event.website,
          category: event.category,
          region: event.region,
          source: event.source,
          importantDates: event.importantDates.map((d: any) => ({ event: d.event, date: d.date }))
        })),
        error: null
      }
    }
    
    console.log("[Events DB Empty] Falling back to local static events dataset.")
  } catch (err: any) {
    console.error("MongoDB Events fetch failed, falling back to local static file...", err)
  }

  // Fallback to static JSON file
  return {
    events: eventsDataFallback,
    error: "Could not retrieve live event schedule. Displaying cached timeline."
  }
}

export async function EventTimeline() {
  const { events, error } = await getEvents()

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          EVENTS SCHEDULE
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span>OPEN SOURCE PROGRAMS TIMELINE</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Track registration, proposal cycles, and hacking periods for major global open source developer events and student opportunities.
        </p>
      </div>

      <EventTimelineClient initialEvents={events} error={error} />
    </div>
  )
}
