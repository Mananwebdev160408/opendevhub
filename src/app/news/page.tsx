import { ExternalLink, Rss, AlertTriangle, Heart, MessageSquare, Clock } from "lucide-react"
import newsData from "../../../data/news.json"
import { Metadata } from "next"
import { getCache, setCache, Cache as CacheModel } from "@/lib/cache-service"
import { connectToDatabase } from "@/lib/mongodb"

export const metadata: Metadata = {
  title: "Developer News Stream - OpenDev Hub",
  description: "Direct logs, engine updates, and framework notifications parsed from curated feeds, updated hourly.",
}

interface NewsItem {
  id: string | number
  title: string
  description: string
  category: string
  date: string
  source: string
  url: string
  coverImage?: string
  authorImage?: string
  readingTime?: number
  reactions?: number
  comments?: number
}

const CATEGORIES = [
  { id: "programming", name: "All Programming" },
  { id: "webdev", name: "Web Dev" },
  { id: "react", name: "React" },
  { id: "nextjs", name: "Next.js" },
  { id: "typescript", name: "TypeScript" },
  { id: "rust", name: "Rust" },
  { id: "go", name: "Go" },
  { id: "devops", name: "DevOps" },
]

async function getNews(category: string, page: number): Promise<{ news: NewsItem[]; error: string | null; hasNextPage: boolean }> {
  const perPage = 16
  const cacheKey = `news:${category}:${page}`
  const ttlSeconds = 3600 // 1 hour

  // 1. Try reading from MongoDB Cache
  try {
    const cached = await getCache(cacheKey, ttlSeconds)
    if (cached) {
      console.log(`[News Cache Hit] Serving cached news for category: ${category}, page: ${page}`)
      return {
        news: cached.news,
        error: null,
        hasNextPage: cached.hasNextPage
      }
    }
  } catch (err) {
    console.error("MongoDB News Cache check failed, proceeding live...", err)
  }

  // 2. Fetch live data from dev.to
  try {
    const res = await fetch(`https://dev.to/api/articles?tag=${category}&per_page=${perPage}&page=${page}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch news from dev.to API for tag: ${category}`)
    }
    const data = await res.json()
    if (Array.isArray(data)) {
      const mapped: NewsItem[] = data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        description: item.description,
        category: item.tag_list?.[0] || category,
        date: item.published_at ? item.published_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
        source: item.user?.name || "Dev.to",
        url: item.url,
        coverImage: item.cover_image || item.social_image || undefined,
        authorImage: item.user?.profile_image || undefined,
        readingTime: item.reading_time_minutes || undefined,
        reactions: item.public_reactions_count || undefined,
        comments: item.comments_count || undefined,
      }))

      const resultPayload = {
        news: mapped,
        hasNextPage: mapped.length === perPage
      }

      // Save to cache asynchronously
      setCache(cacheKey, resultPayload).catch(err => 
        console.error(`Failed to cache news for ${cacheKey}:`, err)
      )

      return {
        news: mapped,
        error: null,
        hasNextPage: resultPayload.hasNextPage
      }
    } else {
      throw new Error("Empty response from dev.to API")
    }
  } catch (err: any) {
    console.error("Error loading developer news feed live:", err)
    
    // 3. Fallback to expired cache from MongoDB
    try {
      await connectToDatabase()
      const expiredRecord = await CacheModel.findOne({ key: cacheKey }).lean()
      if (expiredRecord && expiredRecord.value) {
        console.log(`[Expired News Cache Fallback] Serving expired cached news for ${cacheKey}`)
        return {
          news: expiredRecord.value.news,
          error: "Could not retrieve live news stream. Displaying cached entries.",
          hasNextPage: expiredRecord.value.hasNextPage
        }
      }
    } catch (dbErr) {
      console.error("Failed to query expired news cache from MongoDB:", dbErr)
    }

    // 4. Fallback to local news.json
    console.warn("Serving local static news.json fallback.")
    const filteredFallback = newsData.filter(item => {
      if (category === "programming") return true
      return item.category.toLowerCase().includes(category.toLowerCase()) || 
             item.title.toLowerCase().includes(category.toLowerCase()) ||
             item.description.toLowerCase().includes(category.toLowerCase())
    })
    const startIndex = (page - 1) * perPage
    const slicedFallback = filteredFallback.slice(startIndex, startIndex + perPage)
    return {
      news: slicedFallback,
      error: "Could not retrieve live news stream. Displaying archived cached entries.",
      hasNextPage: startIndex + perPage < filteredFallback.length
    }
  }
}

export default async function NewsPage(props: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const resolvedSearchParams = await props.searchParams
  const category = resolvedSearchParams?.category || "programming"
  const page = Math.max(1, parseInt(resolvedSearchParams?.page || "1", 10) || 1)
  const { news, error, hasNextPage } = await getNews(category, page)

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          DEVELOPER RELEASES
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Rss className="h-6 w-6 text-primary" />
          <span>DEVELOPER NEWS STREAM</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Direct logs, engine updates, and framework notifications parsed from curated RSS feeds and announcements, updated hourly.
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-2 pb-2">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id
          return (
            <a
              key={cat.id}
              href={`/news?category=${cat.id}&page=1`}
              className={`px-3 py-1.5 border-2 border-foreground font-black text-xs uppercase tracking-wider transition-all select-none cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  : "bg-zinc-950 text-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]"
              }`}
            >
              {cat.name}
            </a>
          )
        })}
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {news.length === 0 ? (
          <div className="col-span-full border-2 border-foreground bg-card p-12 text-center shadow-[4px_4px_0px_0px_var(--accent)]">
            <p className="text-sm font-bold uppercase text-muted-foreground">End of news stream.</p>
            {page > 1 && (
              <a
                href={`/news?category=${category}&page=1`}
                className="mt-4 inline-flex px-4 py-2 border-2 border-foreground bg-zinc-950 text-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#ffffff] hover:bg-zinc-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#ffffff] transition-all cursor-pointer"
              >
                Back to Page 1
              </a>
            )}
          </div>
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              className="border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_0px_var(--accent)] transition-all flex flex-col overflow-hidden"
            >
              {/* Cover Image Header */}
              {item.coverImage ? (
                <div className="w-full h-48 relative overflow-hidden border-b-2 border-foreground bg-zinc-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-48 border-b-2 border-foreground bg-black relative flex items-center justify-center overflow-hidden bg-dot-pattern shrink-0 select-none">
                  <span className="text-zinc-800 font-black text-4xl uppercase select-none opacity-40 tracking-wider">
                    {item.category}
                  </span>
                </div>
              )}

              {/* Card Body content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] bg-primary text-primary-foreground border border-foreground px-2 py-0.5 font-bold uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold">{item.date}</span>
                    <div className="flex items-center gap-1.5 text-[9px] text-accent font-bold uppercase ml-auto">
                      {item.authorImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.authorImage}
                          alt={item.source}
                          className="w-3.5 h-3.5 rounded-full border border-foreground object-cover"
                        />
                      )}
                      <span>{item.source}</span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight line-clamp-2 hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer Details */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-3 text-xs font-bold text-zinc-400">
                    {typeof item.reactions === "number" && (
                      <span className="flex items-center gap-1" title="Reactions">
                        <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                        {item.reactions}
                      </span>
                    )}
                    {typeof item.comments === "number" && (
                      <span className="flex items-center gap-1" title="Comments">
                        <MessageSquare className="h-3.5 w-3.5 text-blue-500 fill-blue-500/20" />
                        {item.comments}
                      </span>
                    )}
                    {typeof item.readingTime === "number" && (
                      <span className="flex items-center gap-1" title="Reading Time">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        {item.readingTime}m
                      </span>
                    )}
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-black text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_0px_#ffffff] hover:bg-zinc-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#ffffff] transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    READ ARTICLE <ExternalLink className="h-3.5 w-3.5 text-accent" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-6 border-t-2 border-foreground">
        {page > 1 ? (
          <a
            href={`/news?category=${category}&page=${page - 1}`}
            className="px-4 py-2 border-2 border-foreground bg-zinc-950 text-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center gap-1.5 cursor-pointer select-none"
          >
            &larr; Previous Page
          </a>
        ) : (
          <div className="px-4 py-2 border-2 border-zinc-800 bg-zinc-900 text-zinc-600 font-black text-xs uppercase tracking-wider cursor-not-allowed opacity-50 select-none">
            &larr; Previous Page
          </div>
        )}

        <span className="text-xs font-black uppercase text-foreground bg-card border-2 border-foreground px-3 py-1.5 shadow-[2px_2px_0px_0px_var(--accent)]">
          PAGE {page}
        </span>

        {hasNextPage ? (
          <a
            href={`/news?category=${category}&page=${page + 1}`}
            className="px-4 py-2 border-2 border-foreground bg-zinc-950 text-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center gap-1.5 cursor-pointer select-none"
          >
            Next Page &rarr;
          </a>
        ) : (
          <div className="px-4 py-2 border-2 border-zinc-800 bg-zinc-900 text-zinc-600 font-black text-xs uppercase tracking-wider cursor-not-allowed opacity-50 select-none">
            Next Page &rarr;
          </div>
        )}
      </div>
    </div>
  )
}
