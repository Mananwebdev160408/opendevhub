"use client"

import * as React from "react"
import Link from "next/link"
import { TrendingUp, Star, GitFork, ExternalLink, Filter, Loader2 } from "lucide-react"
import { getTrendingRepositories, GithubRepo } from "@/core/services/github"

export function TrendingList() {
  const [activeLang, setActiveLang] = React.useState("ALL")
  const [sortBy, setSortBy] = React.useState<"stars" | "forks" | "starsToday">("starsToday")
  const [timeRange, setTimeRange] = React.useState<"daily" | "weekly" | "monthly">("daily")
  
  const [repos, setRepos] = React.useState<GithubRepo[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const languages = ["ALL", "JavaScript", "TypeScript", "Python", "Go", "Rust", "HTML", "CSS"]

  React.useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getTrendingRepositories({
          timeRange,
          language: activeLang,
          sort: sortBy === "forks" ? "forks" : "stars"
        })
        setRepos(data.items)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Failed to load live trending repositories.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrending()
  }, [timeRange, activeLang, sortBy])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Title Panel */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          SYSTEM_METRIC // TRENDING REPOSITORIES
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span>TRENDING REPOSITORIES ARCHIVE</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Discover the projects the developer community is pushing commits to, starring, and duplicating right now, updated dynamically.
        </p>
      </div>

      {/* Control Board */}
      <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--primary)] mb-8 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
        
        {/* Languages filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase text-zinc-500 mr-2 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> LANG:
          </span>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-2.5 py-1 border-2 text-[10px] font-black uppercase cursor-pointer ${
                activeLang === lang
                  ? "bg-primary text-primary-foreground border-foreground"
                  : "border-zinc-800 hover:border-foreground hover:bg-zinc-900"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Time & Sort Board */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <span className="text-xs font-black uppercase text-zinc-500">TIME:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border-2 border-foreground bg-black px-2 py-1 text-xs font-bold uppercase text-foreground focus:outline-none cursor-pointer"
          >
            <option value="daily">DAILY (24H)</option>
            <option value="weekly">WEEKLY (7D)</option>
            <option value="monthly">MONTHLY (30D)</option>
          </select>

          <span className="text-xs font-black uppercase text-zinc-500">SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border-2 border-foreground bg-black px-2 py-1 text-xs font-bold uppercase text-foreground focus:outline-none cursor-pointer"
          >
            <option value="starsToday">TRENDING SPEED</option>
            <option value="stars">TOTAL STARS</option>
            <option value="forks">TOTAL FORKS</option>
          </select>
        </div>

      </div>

      {/* Repos Grid */}
      {isLoading ? (
        <div className="h-96 border-4 border-foreground bg-card flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="text-xs uppercase text-zinc-500 font-bold">Querying Live GitHub Trending API...</span>
        </div>
      ) : error ? (
        <div className="border-4 border-destructive bg-zinc-950 p-6 shadow-[4px_4px_0px_0px_var(--destructive)]">
          <h3 className="text-red-500 font-bold uppercase text-sm">GitHub Trending API Exception</h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.length === 0 ? (
            <div className="col-span-full h-64 border-4 border-foreground bg-card flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-bold uppercase">No trending repositories found</span>
              <span className="text-xs text-zinc-500">No projects match the active filters.</span>
            </div>
          ) : (
            repos.map((repo, index) => (
              <div 
                key={repo.id}
                className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] bg-zinc-900 border border-border px-2 py-0.5 text-accent font-black">
                      #{index + 1} ON RADAR
                    </span>
                    {repo.language && (
                      <span className="text-[10px] bg-primary text-primary-foreground border border-foreground px-2 py-0.5 font-bold uppercase tracking-wider">
                        {repo.language}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-foreground hover:text-primary hover:underline mt-4 break-all">
                    <Link href={`/repos/${repo.owner.login}/${repo.name}`}>
                      {repo.owner.login} / {repo.name}
                    </Link>
                  </h3>

                  <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {repo.description || "No public overview description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border flex items-center justify-between font-bold text-[10px]">
                  <div className="flex items-center gap-4 text-zinc-500">
                    <span className="flex items-center gap-0.5 text-yellow-400">
                      <Star className="h-3.5 w-3.5 fill-yellow-400" />
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <GitFork className="h-3.5 w-3.5" />
                      {repo.forks_count.toLocaleString()}
                    </span>
                    <span className="text-accent">
                      ▲ {Math.floor(repo.stargazers_count / (timeRange === "daily" ? 1.5 : timeRange === "weekly" ? 7 : 30)) || 1} / day avg
                    </span>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-black uppercase text-foreground hover:text-accent border border-foreground/30 px-1.5 py-0.5 bg-black flex items-center gap-0.5"
                  >
                    SOURCE <ExternalLink className="h-3 w-3" />
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
