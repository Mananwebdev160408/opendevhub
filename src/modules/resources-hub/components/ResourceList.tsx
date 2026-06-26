"use client"

import * as React from "react"
import { Search, Library, ExternalLink, Globe, BookOpen } from "lucide-react"
import resourcesData from "../../../../data/resources.json"

export function ResourceList() {
  const [query, setQuery] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("ALL")

  const categories = ["ALL", "React", "TypeScript", "System Design", "Next.js", "Linux"]

  const filteredResources = React.useMemo(() => {
    return resourcesData.filter(res => {
      const matchQuery = res.title.toLowerCase().includes(query.toLowerCase()) || 
                          res.description.toLowerCase().includes(query.toLowerCase())
      const matchCat = activeCategory === "ALL" || res.category.toLowerCase() === activeCategory.toLowerCase()
      return matchQuery && matchCat
    })
  }, [query, activeCategory])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          REGISTRY // RESOURCES HUB
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Library className="h-6 w-6 text-accent" />
          <span>CURATED LEARNING RESOURCES</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
           Curated learning paths, scale primers, coding specs, and documentation to build solid fundamentals.
        </p>
      </div>

      {/* Control Board */}
      <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--primary)] mb-8 space-y-4">
        <div className="relative border-2 border-foreground bg-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus-within:shadow-[2px_2px_0px_0px_var(--accent)] transition-all">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search learning resources by title or topic keywords..."
            className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 select-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 border-2 text-[10px] font-black uppercase cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
                  : "border-zinc-800 hover:border-foreground hover:bg-zinc-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredResources.map((res) => (
          <div
            key={res.title}
            className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] bg-zinc-900 border border-border px-2 py-0.5 text-accent font-black uppercase tracking-wider">
                  {res.category}
                </span>
                <span className={`text-[9px] border px-2 py-0.5 font-bold uppercase ${
                  res.difficulty.includes("Beginner") 
                    ? "border-green-800 bg-green-950/20 text-green-400" 
                    : res.difficulty.includes("Advanced") 
                    ? "border-red-800 bg-red-950/20 text-red-400" 
                    : "border-yellow-800 bg-yellow-950/20 text-yellow-400"
                }`}>
                  {res.difficulty}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight mt-4">
                {res.title}
              </h3>
              
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {res.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-border flex items-center justify-between font-bold text-xs select-none">
              <span className="text-zinc-500 text-[10px]">CURATED DIRECTORY</span>

              <a
                href={res.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#ffffff] hover:bg-zinc-900 flex items-center gap-1 hover:shadow-[2px_2px_0px_0px_var(--accent)] transition-all cursor-pointer"
              >
                STUDY GUIDE <BookOpen className="h-3.5 w-3.5 text-accent" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
