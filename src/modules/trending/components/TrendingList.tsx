"use client"

import * as React from "react"
import Link from "next/link"
import { TrendingUp, Star, GitFork, ExternalLink, Calendar, Filter } from "lucide-react"
import trendingData from "../../../../data/trending-repositories.json"

export function TrendingList() {
  const [activeLang, setActiveLang] = React.useState("ALL")
  const [sortBy, setSortBy] = React.useState<"stars" | "forks" | "starsToday">("starsToday")
  const [timeRange, setTimeRange] = React.useState<"daily" | "weekly" | "monthly">("daily")

  const languages = ["ALL", "JavaScript", "TypeScript", "Python", "Go", "Rust", "Markdown"]

  // Filter & sort data locally (Pattern C: zero compute)
  const filteredRepos = React.useMemo(() => {
    let result = [...trendingData]

    if (activeLang !== "ALL") {
      result = result.filter(repo => repo.language.toLowerCase() === activeLang.toLowerCase())
    }

    result.sort((a, b) => {
      if (sortBy === "starsToday") return b.starsToday - a.starsToday
      if (sortBy === "stars") return b.stars - a.stars
      return b.forks - a.forks
    })

    return result
  }, [activeLang, sortBy])

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
          Discover the projects the developer community is pushing commits to, starring, and duplicating right now, updated every six hours.
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

        {/* Sort Board */}
        <div className="flex items-center gap-3 shrink-0">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRepos.length === 0 ? (
          <div className="col-span-full h-64 border-4 border-foreground bg-card flex flex-col items-center justify-center gap-2">
            <span className="text-sm font-bold uppercase">No trending repositories found</span>
            <span className="text-xs text-zinc-500">No projects match the active filters.</span>
          </div>
        ) : (
          filteredRepos.map((repo, index) => (
            <div 
              key={`${repo.owner}-${repo.name}`}
              className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9px] bg-zinc-900 border border-border px-2 py-0.5 text-accent font-black">
                    #{index + 1} ON RADAR
                  </span>
                  <span className="text-[10px] bg-primary text-primary-foreground border border-foreground px-2 py-0.5 font-bold uppercase tracking-wider">
                    {repo.language}
                  </span>
                </div>

                <h3 className="text-sm font-black text-foreground hover:text-primary hover:underline mt-4 break-all">
                  <Link href={`/repos/${repo.owner}/${repo.name}`}>
                    {repo.owner} / {repo.name}
                  </Link>
                </h3>

                <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {repo.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-border flex items-center justify-between font-bold text-[10px]">
                <div className="flex items-center gap-4 text-zinc-500">
                  <span className="flex items-center gap-0.5 text-yellow-400">
                    <Star className="h-3.5 w-3.5 fill-yellow-400" />
                    {repo.stars.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <GitFork className="h-3.5 w-3.5" />
                    {repo.forks.toLocaleString()}
                  </span>
                  <span className="text-accent">
                    ▲ {repo.starsToday} stars today
                  </span>
                </div>

                <a
                  href={`https://github.com/${repo.owner}/${repo.name}`}
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
    </div>
  )
}
