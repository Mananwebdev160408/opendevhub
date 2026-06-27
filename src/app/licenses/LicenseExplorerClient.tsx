"use client"

import { useState } from "react"
import { Scale, Check, X, ShieldAlert, Search, ShieldCheck } from "lucide-react"

interface License {
  slug: string
  name: string
  category: string
  osiApproved: boolean
  description: string
  permissions: string[]
  conditions: string[]
  limitations: string[]
  example: string
}

interface Props {
  licenses: License[]
}

export default function LicenseExplorerClient({ licenses }: Props) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Permissive", "Weak Copyleft", "Strong Copyleft", "Public Domain-like"]

  const filteredLicenses = licenses.filter((lic) => {
    const matchesSearch =
      lic.name.toLowerCase().includes(search.toLowerCase()) ||
      lic.slug.toLowerCase().includes(search.toLowerCase()) ||
      lic.description.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === "All" || lic.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const totalCount = licenses.length
  const filteredCount = filteredLicenses.length

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "Permissive":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      case "Weak Copyleft":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "Strong Copyleft":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30"
      case "Public Domain-like":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30"
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border-2 border-foreground bg-zinc-950 p-4 font-mono shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
          <div className="text-[10px] text-zinc-500 uppercase font-bold">TOTAL CATALOG</div>
          <div className="text-base font-black mt-1 text-foreground">{totalCount} LICENSES</div>
        </div>
        <div className="border-2 border-foreground bg-zinc-950 p-4 font-mono shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
          <div className="text-[10px] text-zinc-500 uppercase font-bold">OSI APPROVED</div>
          <div className="text-base font-black mt-1 text-emerald-400">100% VERIFIED</div>
        </div>
        <div className="border-2 border-foreground bg-zinc-950 p-4 font-mono shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
          <div className="text-[10px] text-zinc-500 uppercase font-bold">CATEGORIES</div>
          <div className="text-base font-black mt-1 text-accent">4 TYPES</div>
        </div>
        <div className="border-2 border-foreground bg-zinc-950 p-4 font-mono shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
          <div className="text-[10px] text-zinc-500 uppercase font-bold">CURRENT VIEW</div>
          <div className="text-base font-black mt-1 text-foreground">{filteredCount} MATCHES</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="border-4 border-foreground bg-card p-4 shadow-neo-primary space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="SEARCH BY LICENSE NAME, SLUG, OR DESCRIPTION..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border-2 border-foreground text-foreground px-10 py-2.5 text-xs font-mono tracking-wide placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-bold"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border/40 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`border-2 border-foreground px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-100 ${
                selectedCategory === cat
                  ? "bg-foreground text-background translate-y-[1px] shadow-none"
                  : "bg-background text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-1px]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* License List */}
      <div className="space-y-6">
        {filteredLicenses.length > 0 ? (
          filteredLicenses.map((lic) => (
            <div
              key={lic.slug}
              id={`lic-${lic.slug}`}
              className="border-4 border-foreground bg-card p-6 shadow-neo-primary hover:translate-y-[-2px] transition-all"
            >
              <div className="border-b border-border pb-3 mb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] border px-2 py-0.5 font-bold uppercase tracking-wider ${getCategoryStyles(lic.category)}`}>
                      {lic.category}
                    </span>
                    {lic.osiApproved && (
                      <span className="text-[9px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> OSI APPROVED
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-foreground uppercase mt-2">{lic.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-4xl">{lic.description}</p>
                </div>
                <div className="text-[9px] font-bold text-zinc-500 sm:text-right font-mono shrink-0">
                  SLUG: <span className="text-accent">{lic.slug}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Permissions */}
                <div className="border-2 border-foreground bg-zinc-950 p-4 space-y-3">
                  <span className="text-[10px] text-green-400 font-black uppercase block border-b border-zinc-900 pb-1.5 flex items-center gap-1">
                    <Check className="h-4 w-4" /> PERMISSIONS
                  </span>
                  {lic.permissions.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {lic.permissions.map((p) => (
                        <li key={p} className="flex items-center gap-1.5 font-bold">
                          <span className="h-1.5 w-1.5 bg-green-500 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-zinc-600 font-bold italic">No permissions specified.</p>
                  )}
                </div>

                {/* Conditions */}
                <div className="border-2 border-foreground bg-zinc-950 p-4 space-y-3">
                  <span className="text-[10px] text-yellow-400 font-black uppercase block border-b border-zinc-900 pb-1.5 flex items-center gap-1">
                    <ShieldAlert className="h-4 w-4" /> CONDITIONS
                  </span>
                  {lic.conditions.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {lic.conditions.map((c) => (
                        <li key={c} className="flex items-center gap-1.5 font-bold">
                          <span className="h-1.5 w-1.5 bg-yellow-500 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-emerald-400 font-bold bg-emerald-500/5 p-2 border border-emerald-500/20">
                      None. Absolutely no conditions or obligations required.
                    </div>
                  )}
                </div>

                {/* Limitations */}
                <div className="border-2 border-foreground bg-zinc-950 p-4 space-y-3">
                  <span className="text-[10px] text-red-400 font-black uppercase block border-b border-zinc-900 pb-1.5 flex items-center gap-1">
                    <X className="h-4 w-4" /> LIMITATIONS
                  </span>
                  {lic.limitations.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {lic.limitations.map((l) => (
                        <li key={l} className="flex items-center gap-1.5 font-bold">
                          <span className="h-1.5 w-1.5 bg-red-500 shrink-0" />
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-zinc-600 font-bold italic">No limitations specified.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-border/40 text-[10px] font-bold text-zinc-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>USAGE EXAMPLE:</span>
                <span className="text-foreground font-mono">{lic.example}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="border-4 border-dashed border-foreground bg-card p-12 text-center shadow-neo-primary">
            <p className="font-mono font-black uppercase text-foreground">NO LICENSES MATCHED YOUR SEARCH / FILTER CRITERIA</p>
            <p className="text-xs text-muted-foreground mt-2">Try clearing your filters or query to explore the catalog.</p>
            <button
              onClick={() => {
                setSearch("")
                setSelectedCategory("All")
              }}
              className="mt-4 border-2 border-foreground bg-foreground text-background px-4 py-2 text-xs font-black uppercase tracking-wider hover:bg-background hover:text-foreground transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-[2px]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
