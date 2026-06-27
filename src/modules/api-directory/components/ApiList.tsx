"use client"

import * as React from "react"
import { Search, Code, Globe, ExternalLink, Loader2 } from "lucide-react"
import apisDataFallback from "../../../../data/apis.json"

interface PublicApi {
  name: string
  category: string
  description: string
  rateLimit: string
  authentication: string
  freeTier: string
  website: string
  documentation: string
}

export function ApiList() {
  const [query, setQuery] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("ALL")
  const [apis, setApis] = React.useState<PublicApi[]>([])
  const [categories, setCategories] = React.useState<string[]>(["ALL"])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchApis = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch("https://public-api-lists.github.io/public-api-lists/api/all.json")
        if (!res.ok) {
          throw new Error("Failed to fetch public APIs database.")
        }
        const data = await res.json()
        const rawEntries = data.entries || []
        
        const mapped: PublicApi[] = rawEntries.map((api: any) => ({
          name: api.name || api.API || "Unknown API",
          category: api.category || api.Category || "Other",
          description: api.description || api.Description || "No description available.",
          rateLimit: api.cors ? `CORS: ${api.cors.toUpperCase()}` : (api.Cors ? `CORS: ${api.Cors.toUpperCase()}` : "CORS: UNKNOWN"),
          authentication: api.auth || api.Auth || "NONE",
          freeTier: "YES",
          website: api.url || api.Link || "https://github.com",
          documentation: api.url || api.Link || "https://github.com"
        }))
        
        setApis(mapped)

        const counts: Record<string, number> = {}
        mapped.forEach(a => {
          counts[a.category] = (counts[a.category] || 0) + 1
        })
        const sortedCats = Object.keys(counts).sort((a, b) => counts[b] - counts[a])
        setCategories(["ALL", ...sortedCats.slice(0, 7)])
      } catch (err: any) {
        console.error(err)
        setError("Could not load dynamic public APIs database. Falling back to local data.")
        const mappedFallback: PublicApi[] = apisDataFallback.map(a => ({
          name: a.name,
          category: a.category,
          description: a.description,
          rateLimit: a.rateLimit,
          authentication: a.authentication,
          freeTier: a.freeTier,
          website: a.website,
          documentation: a.documentation
        }))
        setApis(mappedFallback)
        setCategories(["ALL", "Weather", "Movies & TV", "Finance", "Developer Tools", "Games & Entertainment"])
      } finally {
        setIsLoading(false)
      }
    }
    fetchApis()
  }, [])

  const filteredApis = React.useMemo(() => {
    return apis.filter(api => {
      const matchQuery = api.name.toLowerCase().includes(query.toLowerCase()) || 
                          api.description.toLowerCase().includes(query.toLowerCase())
      const matchCat = activeCategory === "ALL" || api.category.toLowerCase() === activeCategory.toLowerCase()
      return matchQuery && matchCat
    })
  }, [query, activeCategory, apis])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          APIs DIRECTORY
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <span>PUBLIC APIs DIRECTORY</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          A curated registry of developer-friendly public APIs with direct links to docs, auth models, and CORS compatibility.
        </p>
      </div>

      <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--primary)] mb-8 space-y-4">
        <div className="relative border-2 border-foreground bg-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus-within:shadow-[2px_2px_0px_0px_var(--accent)] transition-all">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter public APIs instantly by name or keyword..."
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

      {isLoading ? (
        <div className="h-96 border-4 border-foreground bg-card flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="text-xs uppercase text-zinc-500 font-bold">Parsing 1400+ Public APIs Registry...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {error && (
            <div className="col-span-full mb-4 border-2 border-yellow-500 bg-yellow-950/20 text-yellow-400 p-3 text-xs uppercase font-bold">
              ⚠️ {error}
            </div>
          )}

          {filteredApis.length === 0 ? (
            <div className="col-span-full h-64 border-4 border-foreground bg-card flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-bold uppercase">No APIs found</span>
              <span className="text-xs text-zinc-500">Modify your keyword query or select another category filter.</span>
            </div>
          ) : (
            filteredApis.slice(0, 150).map((api) => (
              <div
                key={`${api.category}-${api.name}`}
                className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] bg-zinc-900 border border-border px-2 py-0.5 text-accent font-black uppercase tracking-wider truncate max-w-[120px]">
                      {api.category}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">{api.rateLimit}</span>
                  </div>

                  <h3 className="text-sm font-black text-foreground uppercase tracking-tight mt-4 truncate">
                    {api.name}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3 h-14 overflow-hidden">
                    {api.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-border/40 pt-3 text-[11px] font-bold text-zinc-500">
                    <div className="flex justify-between">
                      <span>AUTH TYPE:</span>
                      <span className="text-foreground uppercase">{api.authentication}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FREE TIER:</span>
                      <span className="text-accent">{api.freeTier}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-border flex items-center justify-between font-bold text-xs select-none">
                  <a
                    href={api.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-foreground flex items-center gap-1 hover:underline"
                  >
                    Homepage <Globe className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href={api.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#ffffff] hover:bg-zinc-900 flex items-center gap-1 hover:shadow-[2px_2px_0px_0px_var(--accent)] transition-all cursor-pointer"
                  >
                    DOCS <ExternalLink className="h-3.5 w-3.5 text-accent" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
