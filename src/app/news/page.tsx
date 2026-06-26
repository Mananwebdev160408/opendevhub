"use client"

import * as React from "react"
import { ExternalLink, Rss, AlertTriangle } from "lucide-react"
import newsData from "../../../data/news.json"

interface NewsItem {
  id: string | number
  title: string
  description: string
  category: string
  date: string
  source: string
  url: string
}

export default function NewsPage() {
  const [news, setNews] = React.useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch("https://dev.to/api/articles?tag=programming&per_page=15")
        if (!res.ok) {
          throw new Error("Failed to fetch news from dev.to API")
        }
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const mapped: NewsItem[] = data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            description: item.description,
            category: item.tag_list?.[0] || "Programming",
            date: item.published_at ? item.published_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
            source: item.user?.name || "Dev.to",
            url: item.url
          }))
          setNews(mapped)
        } else {
          throw new Error("Empty response from dev.to API")
        }
      } catch (err: any) {
        console.error("Error loading developer news feed:", err)
        setError("Could not retrieve live news stream. Displaying archived cached entries.")
        setNews(newsData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          FEED // DEVELOPER RELEASES
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Rss className="h-6 w-6 text-primary" />
          <span>DEVELOPER NEWS STREAM</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Direct logs, engine updates, and framework notifications parsed from curated RSS feeds and announcements, updated hourly.
        </p>
      </div>

      {/* Warning Banner if fetch failed */}
      {error && (
        <div className="border-4 border-foreground bg-accent text-accent-foreground p-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase">LIVE FEED OFFLINE</h4>
            <p className="text-[11px] leading-relaxed font-bold">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* List of articles */}
      <div className="space-y-6">
        {isLoading ? (
          // Skeleton Loader Cards matching neo-brutalist theme
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--accent)] animate-pulse space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-4 w-16 bg-zinc-800 border border-foreground/30 rounded-none"></div>
                <div className="h-3 w-20 bg-zinc-800"></div>
                <div className="h-3 w-28 bg-zinc-800"></div>
              </div>
              <div className="h-5 w-3/4 bg-zinc-800"></div>
              <div className="h-4 w-5/6 bg-zinc-800"></div>
              <div className="h-8 w-32 bg-zinc-800 border-2 border-foreground/30"></div>
            </div>
          ))
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] bg-primary text-primary-foreground border border-foreground px-2 py-0.5 font-bold uppercase">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-bold">{item.date}</span>
                  <span className="text-[9px] text-accent font-bold uppercase">// SOURCE: {item.source}</span>
                </div>
                <h3 className="text-base font-black text-foreground uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border-2 border-foreground bg-zinc-950 text-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#ffffff] hover:bg-zinc-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#ffffff] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 md:self-start"
              >
                READ FULL ARTICLE <ExternalLink className="h-4 w-4 text-accent" />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
