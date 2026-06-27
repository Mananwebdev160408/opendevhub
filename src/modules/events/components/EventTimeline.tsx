"use client"

import * as React from "react"
import { Calendar, Globe, Loader2 } from "lucide-react"
import eventsDataFallback from "../../../../data/events.json"

interface EventItem {
  name: string
  timeline: string
  description: string
  eligibility: string
  website: string
  importantDates: { event: string; date: string }[]
}

export function EventTimeline() {
  const [events, setEvents] = React.useState<EventItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch("https://raw.githubusercontent.com/Mananwebdev160408/opendevhub/main/data/events.json")
        if (!res.ok) {
          throw new Error("Failed to fetch events from live repository.")
        }
        const data = await res.json()
        setEvents(data)
      } catch (err: any) {
        console.error(err)
        setError("Could not retrieve live event schedule. Displaying cached timeline.")
        setEvents(eventsDataFallback)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

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

      {isLoading ? (
        <div className="h-96 border-4 border-foreground bg-card flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="text-xs uppercase text-zinc-500 font-bold">Querying Live Event Registers...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {error && (
            <div className="border-2 border-yellow-500 bg-yellow-950/20 text-yellow-400 p-3 text-xs uppercase font-bold">
              ⚠️ {error}
            </div>
          )}

          {events.map((event) => (
            <div
              key={event.name}
              className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-y-[-2px] transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-4 mb-4">
                <div>
                  <span className="text-[10px] bg-accent text-accent-foreground border border-foreground px-2 py-0.5 font-bold uppercase tracking-wider">
                    {event.timeline}
                  </span>
                  <h3 className="text-lg font-black text-foreground uppercase mt-2">{event.name}</h3>
                </div>
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border-2 border-foreground bg-zinc-950 text-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#ffffff] hover:bg-zinc-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#ffffff] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  Website <Globe className="h-4 w-4 text-accent" />
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">OVERVIEW & SCOPE:</span>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{event.description}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block">ELIGIBILITY REQUIREMENTS:</span>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1 border-l-2 border-accent pl-3">{event.eligibility}</p>
                  </div>
                </div>

                <div className="lg:col-span-1 border-2 border-foreground bg-zinc-950 p-4 space-y-3 shadow-[3px_3px_0px_0px_var(--border)]">
                  <span className="text-[10px] text-primary font-bold uppercase block border-b border-zinc-900 pb-1.5 select-none">
                    CRITICAL DATE SHEET:
                  </span>
                  <div className="space-y-2.5">
                    {event.importantDates.map((dateObj) => (
                      <div key={dateObj.event} className="text-xs flex flex-col sm:flex-row sm:justify-between font-bold">
                        <span className="text-zinc-500">{dateObj.event}</span>
                        <span className="text-foreground">{dateObj.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
