"use client"

import * as React from "react"
import { Calendar, Globe, Search, Filter, X, MapPin, Link } from "lucide-react"

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

interface EventTimelineClientProps {
  initialEvents: EventItem[]
  error: string | null
}

export function EventTimelineClient({ initialEvents, error }: EventTimelineClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("ALL")
  const [activeRegion, setActiveRegion] = React.useState("ALL")

  // Classify categories dynamically if not present in the DB document
  const getEventCategory = (event: EventItem): string => {
    if (event.category) return event.category
    
    const nameLower = event.name.toLowerCase()
    if (nameLower.includes("(hackathon)")) {
      return "Hackathon"
    }
    const baselineNames = ["hacktoberfest", "google summer of code", "gsoc", "outreachy", "lfx mentorship"]
    if (baselineNames.some(base => nameLower.includes(base))) {
      return "Open Source"
    }
    return "Conference"
  }

  // Parse location metadata to identify regions dynamically
  const getEventRegion = (event: EventItem): string => {
    if (event.region) return event.region
    const text = (event.eligibility + " " + event.description + " " + event.name).toLowerCase()
    
    if (text.includes("india") || text.includes("mumbai") || text.includes("ghaziabad") || text.includes("delhi") || text.includes("bengaluru")) {
      return "India"
    }
    if (text.includes("usa") || text.includes("san francisco") || text.includes("austin") || text.includes("united states") || text.includes("america")) {
      return "USA"
    }
    if (text.includes("germany") || text.includes("hungary") || text.includes("zurich") || text.includes("switzerland") || text.includes("europe") || text.includes("munich") || text.includes("mannheim") || text.includes("budapest")) {
      return "Europe"
    }
    return "Online"
  }

  // Filter events
  const filteredEvents = initialEvents.filter((event) => {
    const category = getEventCategory(event)
    const region = getEventRegion(event)
    
    // Category filter
    if (activeCategory !== "ALL" && category !== activeCategory) {
      return false
    }

    // Region filter
    if (activeRegion !== "ALL" && region !== activeRegion) {
      return false
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const matchesName = event.name.toLowerCase().includes(query)
      const matchesDesc = event.description.toLowerCase().includes(query)
      const matchesElig = event.eligibility.toLowerCase().includes(query)
      const matchesTimeline = event.timeline.toLowerCase().includes(query)
      
      return matchesName || matchesDesc || matchesElig || matchesTimeline
    }

    return true
  })

  // Get category counts
  const getCategoryCount = (category: string) => {
    if (category === "ALL") return initialEvents.length
    return initialEvents.filter(e => getEventCategory(e) === category).length
  }

  // Get region counts
  const getRegionCount = (region: string) => {
    if (region === "ALL") return initialEvents.length
    return initialEvents.filter(e => getEventRegion(e) === region).length
  }

  const categories = [
    { id: "ALL", name: "All Events" },
    { id: "Open Source", name: "Open Source" },
    { id: "Hackathon", name: "Hackathons" },
    { id: "Conference", name: "Conferences" }
  ]

  const regions = [
    { id: "ALL", name: "All Regions" },
    { id: "Online", name: "Online / Global" },
    { id: "India", name: "India" },
    { id: "USA", name: "USA" },
    { id: "Europe", name: "Europe" }
  ]

  return (
    <div className="space-y-8">
      {error && (
        <div className="border-2 border-yellow-500 bg-yellow-950/20 text-yellow-400 p-3 text-xs uppercase font-bold">
          {error}
        </div>
      )}

      {/* Filter Control Box */}
      <div className="border-4 border-foreground bg-zinc-950 p-6 shadow-[6px_6px_0px_0px_var(--primary)] space-y-5">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="w-full md:flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by name, description, or location..."
              className="w-full bg-black text-foreground border-2 border-foreground px-4 py-2.5 pl-10 font-bold text-xs uppercase tracking-wide placeholder-zinc-600 focus:outline-none focus:border-primary shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus:shadow-[2px_2px_0px_0px_var(--primary)] transition-all"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Category Tabs */}
          <div className="w-full md:w-auto flex flex-wrap gap-2 justify-start md:justify-end select-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id
              const count = getCategoryCount(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-2 border-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      : "bg-black border-zinc-800 text-zinc-400 hover:text-foreground hover:border-foreground active:translate-x-[1px] active:translate-y-[1px]"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Region Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 border-t border-zinc-900 pt-4">
          <div className="w-full md:w-auto text-[10px] font-black uppercase text-zinc-500 mr-2 flex items-center gap-1 select-none">
            <Globe className="h-3.5 w-3.5" /> REGIONS:
          </div>
          <div className="w-full md:flex-1 flex flex-wrap gap-2 justify-start select-none">
            {regions.map((reg) => {
              const isActive = activeRegion === reg.id
              const count = getRegionCount(reg.id)
              return (
                <button
                  key={reg.id}
                  onClick={() => setActiveRegion(reg.id)}
                  className={`px-2.5 py-1.5 border-2 text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      : "bg-black border-zinc-800 text-zinc-400 hover:text-foreground hover:border-foreground active:translate-x-[1px] active:translate-y-[1px]"
                  }`}
                >
                  {reg.name} ({count})
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Events Stream */}
      <div className="space-y-8">
        {filteredEvents.length === 0 ? (
          <div className="border-4 border-foreground bg-zinc-950 p-12 text-center shadow-[4px_4px_0px_0px_var(--border)]">
            <p className="text-sm font-black uppercase text-zinc-500">No events match your active filters.</p>
            {(searchQuery || activeCategory !== "ALL" || activeRegion !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("ALL")
                  setActiveRegion("ALL")
                }}
                className="mt-4 inline-flex px-4 py-2 border-2 border-foreground bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#ffffff] hover:bg-purple-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#ffffff] transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          filteredEvents.map((event) => {
            const category = getEventCategory(event)
            const region = getEventRegion(event)
            const badgeColor = 
              category === "Open Source" ? "bg-purple-500 text-purple-950" : 
              category === "Hackathon" ? "bg-teal-400 text-teal-950" : 
              "bg-blue-500 text-blue-950"

            return (
              <div
                key={event.name}
                className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-y-[-2px] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] border border-foreground px-2 py-0.5 font-bold uppercase tracking-wider ${badgeColor}`}>
                        {category}
                      </span>
                      <span className="text-[9px] border border-foreground px-2 py-0.5 font-bold bg-zinc-900 text-zinc-300 uppercase tracking-wider flex items-center gap-1 select-none">
                        <MapPin className="h-3 w-3" /> {region}
                      </span>
                      {event.source && (
                        <span className="text-[9px] border border-foreground px-2 py-0.5 font-bold bg-zinc-950 text-zinc-400 uppercase tracking-wider flex items-center gap-1 select-none">
                          <Link className="h-3 w-3" /> {event.source}
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-500 font-bold uppercase select-none flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {event.timeline}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-foreground uppercase mt-2">{event.name}</h3>
                  </div>
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border-2 border-foreground bg-zinc-950 text-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#ffffff] hover:bg-zinc-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#ffffff] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 md:self-start"
                  >
                    Website <Globe className="h-4 w-4 text-accent" />
                  </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase block select-none">OVERVIEW & SCOPE:</span>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">{event.description}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase block select-none">ELIGIBILITY REQUIREMENTS:</span>
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
            )
          })
        )}
      </div>
    </div>
  )
}
