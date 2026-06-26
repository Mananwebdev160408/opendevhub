"use client"

import * as React from "react"
import Link from "next/link"
import { Building2, Search, ExternalLink, ArrowRight, ShieldCheck, Heart } from "lucide-react"
import organizationsData from "../../../../data/organizations.json"

export function OrgExplorer() {
  const [query, setQuery] = React.useState("")

  const filteredOrgs = React.useMemo(() => {
    return organizationsData.filter(org => 
      org.name.toLowerCase().includes(query.toLowerCase()) ||
      org.description.toLowerCase().includes(query.toLowerCase()) ||
      org.category.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Title block */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          REGISTRY // ORGANIZATIONS
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-accent" />
          <span>OPEN-SOURCE ORGANIZATIONS</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Browse prominent tech organizations, framework creators, and open-source foundations driving modern software infrastructure.
        </p>
      </div>

      {/* Search board */}
      <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--accent)] mb-8">
        <div className="relative border-2 border-foreground bg-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus-within:shadow-[3px_3px_0px_0px_var(--accent)] transition-all">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by organization name, description, or focus category..."
            className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Grid of Orgs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredOrgs.map((org) => (
          <div
            key={org.login}
            className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-[10px] bg-zinc-900 border border-border px-2 py-0.5 text-accent font-black uppercase tracking-wider">
                  {org.category}
                </span>
                <span className="text-[9px] text-zinc-500 font-bold">★ {org.stars.toLocaleString()} stars across repos</span>
              </div>

              <h3 className="text-lg font-black text-foreground uppercase tracking-tight mt-3">
                {org.name}
              </h3>
              
              <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                {org.description}
              </p>

              {/* Popular Projects */}
              <div className="mt-4">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">KEY PROJECTS:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {org.popularProjects.map(proj => (
                    <Link
                      key={proj}
                      href={`/repos/${org.login}/${proj}`}
                      className="text-[9px] border border-border bg-black text-zinc-300 px-2 py-0.5 font-bold uppercase hover:text-accent hover:border-accent"
                    >
                      {proj}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Main Languages */}
              <div className="mt-4">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">LANGUAGES USED:</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {org.languages.map(lang => (
                    <span
                      key={lang}
                      className="text-[8.5px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 font-semibold"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-border flex items-center justify-between font-bold text-xs">
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-foreground flex items-center gap-1 hover:underline"
              >
                Website <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <Link
                href={`/orgs/${org.login}`}
                className="px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#ffffff] hover:bg-zinc-900 flex items-center gap-1 hover:shadow-[2px_2px_0px_0px_var(--primary)] transition-all cursor-pointer"
              >
                ORG SPECS <ArrowRight className="h-3.5 w-3.5 text-accent animate-pulse" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
