"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, SlidersHorizontal, Loader2, ArrowLeft, ArrowRight, X, Trash2, Filter } from "lucide-react"
import { searchRepositories, GithubRepo } from "@/core/services/github"
import { RepoCard } from "./RepoCard"

// Static filter options
const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Go", "Rust", "C++", "Java", "Ruby", "PHP", "HTML"]

const STARS_PRESETS = [
  { label: "Any Stars", value: "" },
  { label: "Mega Popular (>10k)", value: ">10000" },
  { label: "Highly Popular (1k-10k)", value: "1000..10000" },
  { label: "Growing (100-1k)", value: "100..1000" },
  { label: "Small (10-100)", value: "10..100" },
  { label: "Custom Range", value: "custom" },
]

const FORKS_PRESETS = [
  { label: "Any Forks", value: "" },
  { label: "Mega Forked (>1k)", value: ">1000" },
  { label: "Highly Forked (100-1k)", value: "100..1000" },
  { label: "Growing (10-100)", value: "10..100" },
  { label: "Custom Range", value: "custom" },
]

const PUSHED_PRESETS = [
  { label: "Any Time", value: "" },
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last Year", value: "365d" },
]

const LICENSES = [
  { label: "Any License", value: "" },
  { label: "MIT License", value: "mit" },
  { label: "Apache 2.0", value: "apache-2.0" },
  { label: "GPL v3", value: "gpl-3.0" },
  { label: "BSD 3-Clause", value: "bsd-3-clause" },
  { label: "Mozilla Public License 2.0", value: "mpl-2.0" },
]

const SIZE_PRESETS = [
  { label: "Any Size", value: "" },
  { label: "Small (< 1MB)", value: "<1000" },
  { label: "Medium (1MB - 10MB)", value: "1000..10000" },
  { label: "Large (10MB - 100MB)", value: "10000..100000" },
  { label: "Huge (> 100MB)", value: ">100000" },
]

interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-2 border-foreground bg-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center justify-between text-[11px] font-black uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 border-b-2 border-foreground select-none text-left cursor-pointer transition-colors"
      >
        <span>{title}</span>
        <span className="text-accent font-bold">
          {isOpen ? "[-]" : "[+]"}
        </span>
      </button>
      {isOpen && <div className="p-3 bg-card space-y-3">{children}</div>}
    </div>
  )
}

export function RepoExplorer() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Base parameters
  const qParam = searchParams.get("q") || ""
  const langParam = searchParams.get("lang") || ""
  const sortParam = (searchParams.get("sort") || "stars") as "stars" | "forks" | "updated"
  const pageParam = parseInt(searchParams.get("page") || "1", 10)

  // Filters parameters
  const starsParam = searchParams.get("stars") || ""
  const starsMinParam = searchParams.get("starsMin") || ""
  const starsMaxParam = searchParams.get("starsMax") || ""
  const forksParam = searchParams.get("forks") || ""
  const forksMinParam = searchParams.get("forksMin") || ""
  const forksMaxParam = searchParams.get("forksMax") || ""
  const pushedParam = searchParams.get("pushed") || ""
  const licenseParam = searchParams.get("license") || ""
  const sizeParam = searchParams.get("size") || ""
  const ownerTypeParam = searchParams.get("ownerType") || ""
  const forksIncludeParam = searchParams.get("forksInclude") || ""
  const templateParam = searchParams.get("template") || ""
  const goodFirstParam = searchParams.get("goodFirst") === "true"
  const helpWantedParam = searchParams.get("helpWanted") === "true"
  const archivedParam = searchParams.get("archived") === "true"

  // Local inputs
  const [searchInput, setSearchInput] = React.useState(qParam)
  const [customLangInput, setCustomLangInput] = React.useState("")
  const [localStarsMin, setLocalStarsMin] = React.useState(starsMinParam)
  const [localStarsMax, setLocalStarsMax] = React.useState(starsMaxParam)
  const [localForksMin, setLocalForksMin] = React.useState(forksMinParam)
  const [localForksMax, setLocalForksMax] = React.useState(forksMaxParam)

  // Data state
  const [repos, setRepos] = React.useState<GithubRepo[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Accordion state
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    language: true,
    stars: false,
    forks: false,
    pushed: false,
    license: false,
    size: false,
    scope: false,
    community: false,
  })

  // Sync inputs with URL changes
  React.useEffect(() => {
    setSearchInput(qParam)
  }, [qParam])

  React.useEffect(() => {
    setLocalStarsMin(starsMinParam)
    setLocalStarsMax(starsMaxParam)
    setLocalForksMin(forksMinParam)
    setLocalForksMax(forksMaxParam)
  }, [starsMinParam, starsMaxParam, forksMinParam, forksMaxParam])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const updateUrlParams = React.useCallback(
    (newParams: {
      q?: string
      lang?: string
      sort?: string
      page?: number
      stars?: string
      starsMin?: string
      starsMax?: string
      forks?: string
      forksMin?: string
      forksMax?: string
      pushed?: string
      license?: string
      size?: string
      ownerType?: string
      forksInclude?: string
      template?: string
      goodFirst?: boolean
      helpWanted?: boolean
      archived?: boolean
    }) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      const setOrDelete = (key: string, value: any) => {
        if (value !== undefined) {
          if (value === true) {
            current.set(key, "true")
          } else if (value === false || value === "" || value === null) {
            current.delete(key)
          } else {
            current.set(key, String(value))
          }
        }
      }

      setOrDelete("q", newParams.q)
      setOrDelete("lang", newParams.lang)
      setOrDelete("sort", newParams.sort)
      setOrDelete("stars", newParams.stars)
      setOrDelete("starsMin", newParams.starsMin)
      setOrDelete("starsMax", newParams.starsMax)
      setOrDelete("forks", newParams.forks)
      setOrDelete("forksMin", newParams.forksMin)
      setOrDelete("forksMax", newParams.forksMax)
      setOrDelete("pushed", newParams.pushed)
      setOrDelete("license", newParams.license)
      setOrDelete("size", newParams.size)
      setOrDelete("ownerType", newParams.ownerType)
      setOrDelete("forksInclude", newParams.forksInclude)
      setOrDelete("template", newParams.template)
      setOrDelete("goodFirst", newParams.goodFirst)
      setOrDelete("helpWanted", newParams.helpWanted)
      setOrDelete("archived", newParams.archived)

      if (newParams.page !== undefined) {
        current.set("page", String(newParams.page))
      } else {
        current.set("page", "1") // reset to page 1 on filter changes
      }

      router.push(`/repos?${current.toString()}`)
    },
    [searchParams, router]
  )

  React.useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const queryParts: string[] = []

        // Search text
        if (qParam.trim()) {
          queryParts.push(qParam.trim())
        }

        // Language
        if (langParam) {
          queryParts.push(`language:"${langParam}"`)
        }

        // Stars
        if (starsParam === "custom") {
          if (starsMinParam && starsMaxParam) {
            queryParts.push(`stars:${starsMinParam}..${starsMaxParam}`)
          } else if (starsMinParam) {
            queryParts.push(`stars:>=${starsMinParam}`)
          } else if (starsMaxParam) {
            queryParts.push(`stars:<=${starsMaxParam}`)
          }
        } else if (starsParam) {
          queryParts.push(`stars:${starsParam}`)
        }

        // Forks
        if (forksParam === "custom") {
          if (forksMinParam && forksMaxParam) {
            queryParts.push(`forks:${forksMinParam}..${forksMaxParam}`)
          } else if (forksMinParam) {
            queryParts.push(`forks:>=${forksMinParam}`)
          } else if (forksMaxParam) {
            queryParts.push(`forks:<=${forksMaxParam}`)
          }
        } else if (forksParam) {
          queryParts.push(`forks:${forksParam}`)
        }

        // Recent Activity (Pushed)
        if (pushedParam) {
          const date = new Date()
          if (pushedParam === "24h") {
            date.setDate(date.getDate() - 1)
          } else if (pushedParam === "7d") {
            date.setDate(date.getDate() - 7)
          } else if (pushedParam === "30d") {
            date.setDate(date.getDate() - 30)
          } else if (pushedParam === "365d") {
            date.setDate(date.getDate() - 365)
          }
          const dateStr = date.toISOString().split("T")[0]
          queryParts.push(`pushed:>=${dateStr}`)
        }

        // License
        if (licenseParam) {
          queryParts.push(`license:${licenseParam}`)
        }

        // Size
        if (sizeParam) {
          queryParts.push(`size:${sizeParam}`)
        }

        // Owner type
        if (ownerTypeParam) {
          queryParts.push(`type:${ownerTypeParam}`)
        }

        // Forks inclusion
        if (forksIncludeParam) {
          queryParts.push(`fork:${forksIncludeParam}`)
        }

        // Templates
        if (templateParam) {
          queryParts.push(`template:${templateParam}`)
        }

        // Help Issues
        if (goodFirstParam) {
          queryParts.push("good-first-issues:>0")
        }
        if (helpWantedParam) {
          queryParts.push("help-wanted-issues:>0")
        }

        // Archived
        if (archivedParam) {
          queryParts.push("archived:false")
        }

        let queryStr = queryParts.join(" ")
        if (!queryStr) {
          queryStr = "stars:>500" // default trending repositories query
        }

        const data = await searchRepositories({
          q: queryStr,
          sort: sortParam,
          page: pageParam,
          perPage: 12,
        })

        setRepos(data.items)
        setTotalCount(data.total_count)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "An error occurred while loading repositories.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepos()
  }, [
    qParam,
    langParam,
    sortParam,
    pageParam,
    starsParam,
    starsMinParam,
    starsMaxParam,
    forksParam,
    forksMinParam,
    forksMaxParam,
    pushedParam,
    licenseParam,
    sizeParam,
    ownerTypeParam,
    forksIncludeParam,
    templateParam,
    goodFirstParam,
    helpWantedParam,
    archivedParam,
  ])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrlParams({ q: searchInput })
  }

  const handleLangSelect = (lang: string) => {
    const nextLang = langParam.toLowerCase() === lang.toLowerCase() ? "" : lang
    updateUrlParams({ lang: nextLang })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrlParams({ sort: e.target.value })
  }

  const handleClearAllFilters = () => {
    setCustomLangInput("")
    updateUrlParams({
      lang: "",
      stars: "",
      starsMin: "",
      starsMax: "",
      forks: "",
      forksMin: "",
      forksMax: "",
      pushed: "",
      license: "",
      size: "",
      ownerType: "",
      forksInclude: "",
      template: "",
      goodFirst: false,
      helpWanted: false,
      archived: false,
    })
  }

  const handleRemoveBadge = (badge: { clearKey: string; clearValue: any }) => {
    const paramsToUpdate: any = { [badge.clearKey]: badge.clearValue }
    if (badge.clearKey === "stars") {
      paramsToUpdate.starsMin = ""
      paramsToUpdate.starsMax = ""
    }
    if (badge.clearKey === "forks") {
      paramsToUpdate.forksMin = ""
      paramsToUpdate.forksMax = ""
    }
    updateUrlParams(paramsToUpdate)
  }

  // Generate badges of active filters for quick dismissals
  const getActiveFilterBadges = () => {
    const badges: { label: string; clearKey: string; clearValue: any }[] = []

    if (langParam) {
      badges.push({ label: `Lang: ${langParam}`, clearKey: "lang", clearValue: "" })
    }

    if (starsParam) {
      if (starsParam === "custom") {
        const range = `${starsMinParam || "0"} - ${starsMaxParam || "∞"}`
        badges.push({ label: `Stars: ${range}`, clearKey: "stars", clearValue: "" })
      } else {
        badges.push({ label: `Stars: ${starsParam}`, clearKey: "stars", clearValue: "" })
      }
    }

    if (forksParam) {
      if (forksParam === "custom") {
        const range = `${forksMinParam || "0"} - ${forksMaxParam || "∞"}`
        badges.push({ label: `Forks: ${range}`, clearKey: "forks", clearValue: "" })
      } else {
        badges.push({ label: `Forks: ${forksParam}`, clearKey: "forks", clearValue: "" })
      }
    }

    if (pushedParam) {
      const labels: Record<string, string> = { "24h": "Last 24h", "7d": "Last 7d", "30d": "Last 30d", "365d": "Last year" }
      badges.push({ label: `Pushed: ${labels[pushedParam] || pushedParam}`, clearKey: "pushed", clearValue: "" })
    }

    if (licenseParam) {
      badges.push({ label: `License: ${licenseParam.toUpperCase()}`, clearKey: "license", clearValue: "" })
    }

    if (sizeParam) {
      const labels: Record<string, string> = {
        "<1000": "< 1MB",
        "1000..10000": "1MB - 10MB",
        "10000..100000": "10MB - 100MB",
        ">100000": "> 100MB",
      }
      badges.push({ label: `Size: ${labels[sizeParam] || sizeParam}`, clearKey: "size", clearValue: "" })
    }

    if (ownerTypeParam) {
      badges.push({ label: `Owner: ${ownerTypeParam === "org" ? "Org" : "User"}`, clearKey: "ownerType", clearValue: "" })
    }

    if (forksIncludeParam) {
      badges.push({
        label: forksIncludeParam === "only" ? "Only Forks" : "Inc. Forks",
        clearKey: "forksInclude",
        clearValue: "",
      })
    }

    if (templateParam) {
      badges.push({
        label: templateParam === "true" ? "Templates Only" : "Non-Templates",
        clearKey: "template",
        clearValue: "",
      })
    }

    if (goodFirstParam) {
      badges.push({ label: "Good First", clearKey: "goodFirst", clearValue: false })
    }

    if (helpWantedParam) {
      badges.push({ label: "Help Wanted", clearKey: "helpWanted", clearValue: false })
    }

    if (archivedParam) {
      badges.push({ label: "Exclude Archived", clearKey: "archived", clearValue: false })
    }

    return badges
  }

  const activeBadges = getActiveFilterBadges()
  const isAnyFilterActive = activeBadges.length > 0 || qParam !== ""

  const totalPages = Math.min(Math.ceil(totalCount / 12), 80) // GitHub search API limits results to 1000 (80 pages of 12)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Search Header Banner */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          SEARCH_CONDUIT // REPOSITORY EXPLORER
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
          EXPLORE OPEN-SOURCE ECOSYSTEM
        </h2>

        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow border-2 border-foreground bg-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus-within:shadow-[3px_3px_0px_0px_var(--accent)] transition-all">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Query repository name, description, topic (e.g. state-management)..."
              className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-zinc-600"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={sortParam}
              onChange={handleSortChange}
              className="h-11 border-2 border-foreground bg-black px-4 py-2 text-xs font-bold uppercase text-foreground shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus:outline-none cursor-pointer"
            >
              <option value="stars">SORT BY STARS</option>
              <option value="forks">SORT BY FORKS</option>
              <option value="updated">SORT BY UPDATED</option>
            </select>
            <button
              type="submit"
              className="h-11 px-6 border-2 border-foreground bg-accent text-accent-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-teal-400 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            >
              QUERY
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--primary)] space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between text-xs font-black uppercase text-foreground select-none">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              <span>SEARCH FILTERS</span>
            </div>
            {isAnyFilterActive && (
              <button
                onClick={handleClearAllFilters}
                className="text-[9px] text-red-400 hover:text-red-300 font-bold border border-red-500/30 px-1.5 py-0.5 bg-black/40 hover:bg-black transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-2.5 w-2.5" />
                RESET
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* 1. Language Filter */}
            <FilterSection
              title="Filter by Language"
              isOpen={expandedSections.language}
              onToggle={() => toggleSection("language")}
            >
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLangSelect(lang)}
                    className={`px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer ${
                      langParam.toLowerCase() === lang.toLowerCase()
                        ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Custom Language Input */}
              <div className="flex gap-2 pt-2 border-t border-zinc-950">
                <input
                  type="text"
                  placeholder="Other language..."
                  value={customLangInput}
                  onChange={(e) => setCustomLangInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (customLangInput.trim()) {
                        updateUrlParams({ lang: customLangInput.trim() })
                        setCustomLangInput("")
                      }
                    }
                  }}
                  className="flex-grow min-w-0 h-8 px-2 border-2 border-foreground bg-black text-xs font-mono focus:outline-none placeholder:text-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customLangInput.trim()) {
                      updateUrlParams({ lang: customLangInput.trim() })
                      setCustomLangInput("")
                    }
                  }}
                  className="px-2.5 py-1 border-2 border-foreground bg-accent text-accent-foreground font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-teal-400 cursor-pointer shrink-0"
                >
                  Set
                </button>
              </div>
            </FilterSection>

            {/* 2. Stars Filter */}
            <FilterSection
              title="Filter by Stars"
              isOpen={expandedSections.stars}
              onToggle={() => toggleSection("stars")}
            >
              <div className="space-y-1.5">
                {STARS_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      if (preset.value === "custom") {
                        updateUrlParams({ stars: "custom" })
                      } else {
                        updateUrlParams({ stars: preset.value, starsMin: "", starsMax: "" })
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      starsParam === preset.value
                        ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {starsParam === "custom" && (
                <div className="space-y-2 pt-2 border-t border-zinc-950">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="MIN STARS"
                      value={localStarsMin}
                      onChange={(e) => setLocalStarsMin(e.target.value)}
                      className="flex-1 min-w-0 h-8 px-2 border-2 border-foreground bg-black text-xs font-mono focus:outline-none placeholder:text-zinc-700"
                    />
                    <input
                      type="number"
                      placeholder="MAX STARS"
                      value={localStarsMax}
                      onChange={(e) => setLocalStarsMax(e.target.value)}
                      className="flex-1 min-w-0 h-8 px-2 border-2 border-foreground bg-black text-xs font-mono focus:outline-none placeholder:text-zinc-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateUrlParams({
                        stars: "custom",
                        starsMin: localStarsMin,
                        starsMax: localStarsMax,
                      })
                    }
                    className="w-full py-1.5 border-2 border-foreground bg-accent text-accent-foreground font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-teal-400 cursor-pointer"
                  >
                    Apply Range
                  </button>
                </div>
              )}
            </FilterSection>

            {/* 3. Forks Filter */}
            <FilterSection
              title="Filter by Forks"
              isOpen={expandedSections.forks}
              onToggle={() => toggleSection("forks")}
            >
              <div className="space-y-1.5">
                {FORKS_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      if (preset.value === "custom") {
                        updateUrlParams({ forks: "custom" })
                      } else {
                        updateUrlParams({ forks: preset.value, forksMin: "", forksMax: "" })
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      forksParam === preset.value
                        ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {forksParam === "custom" && (
                <div className="space-y-2 pt-2 border-t border-zinc-950">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="MIN FORKS"
                      value={localForksMin}
                      onChange={(e) => setLocalForksMin(e.target.value)}
                      className="flex-1 min-w-0 h-8 px-2 border-2 border-foreground bg-black text-xs font-mono focus:outline-none placeholder:text-zinc-700"
                    />
                    <input
                      type="number"
                      placeholder="MAX FORKS"
                      value={localForksMax}
                      onChange={(e) => setLocalForksMax(e.target.value)}
                      className="flex-1 min-w-0 h-8 px-2 border-2 border-foreground bg-black text-xs font-mono focus:outline-none placeholder:text-zinc-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateUrlParams({
                        forks: "custom",
                        forksMin: localForksMin,
                        forksMax: localForksMax,
                      })
                    }
                    className="w-full py-1.5 border-2 border-foreground bg-accent text-accent-foreground font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-teal-400 cursor-pointer"
                  >
                    Apply Range
                  </button>
                </div>
              )}
            </FilterSection>

            {/* 4. Recent Activity */}
            <FilterSection
              title="Recent Activity"
              isOpen={expandedSections.pushed}
              onToggle={() => toggleSection("pushed")}
            >
              <div className="space-y-1.5">
                {PUSHED_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateUrlParams({ pushed: preset.value })}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      pushedParam === preset.value
                        ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* 5. Licenses */}
            <FilterSection
              title="Filter by License"
              isOpen={expandedSections.license}
              onToggle={() => toggleSection("license")}
            >
              <div className="space-y-1.5">
                {LICENSES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateUrlParams({ license: preset.value })}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      licenseParam === preset.value
                        ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* 6. Repository Size */}
            <FilterSection
              title="Repository Size"
              isOpen={expandedSections.size}
              onToggle={() => toggleSection("size")}
            >
              <div className="space-y-1.5">
                {SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateUrlParams({ size: preset.value })}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      sizeParam === preset.value
                        ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* 7. Scope & Inclusions */}
            <FilterSection
              title="Ownership & Scope"
              isOpen={expandedSections.scope}
              onToggle={() => toggleSection("scope")}
            >
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Owner Type
                  </label>
                  <select
                    value={ownerTypeParam}
                    onChange={(e) => updateUrlParams({ ownerType: e.target.value })}
                    className="w-full h-8 border-2 border-zinc-800 bg-black px-2 text-[10px] font-bold uppercase text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    <option value="">Any Owner</option>
                    <option value="org">Organizations Only</option>
                    <option value="user">Personal Accounts Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Fork Repositories
                  </label>
                  <select
                    value={forksIncludeParam}
                    onChange={(e) => updateUrlParams({ forksInclude: e.target.value })}
                    className="w-full h-8 border-2 border-zinc-800 bg-black px-2 text-[10px] font-bold uppercase text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    <option value="">Exclude Forks (Default)</option>
                    <option value="true">Include Forks</option>
                    <option value="only">Only Forked Repos</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Templates
                  </label>
                  <select
                    value={templateParam}
                    onChange={(e) => updateUrlParams({ template: e.target.value })}
                    className="w-full h-8 border-2 border-zinc-800 bg-black px-2 text-[10px] font-bold uppercase text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    <option value="">Any</option>
                    <option value="true">Templates Only</option>
                    <option value="false">Exclude Templates</option>
                  </select>
                </div>
              </div>
            </FilterSection>

            {/* 8. Community & Help */}
            <FilterSection
              title="Community & Help"
              isOpen={expandedSections.community}
              onToggle={() => toggleSection("community")}
            >
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 select-none cursor-pointer hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={goodFirstParam}
                    onChange={(e) => updateUrlParams({ goodFirst: e.target.checked })}
                    className="h-3.5 w-3.5 border-2 border-foreground bg-black checked:bg-primary accent-primary cursor-pointer rounded-none"
                  />
                  <span>GOOD FIRST ISSUES</span>
                </label>

                <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 select-none cursor-pointer hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={helpWantedParam}
                    onChange={(e) => updateUrlParams({ helpWanted: e.target.checked })}
                    className="h-3.5 w-3.5 border-2 border-foreground bg-black checked:bg-primary accent-primary cursor-pointer rounded-none"
                  />
                  <span>HELP WANTED ISSUES</span>
                </label>

                <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 select-none cursor-pointer hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={archivedParam}
                    onChange={(e) => updateUrlParams({ archived: e.target.checked })}
                    className="h-3.5 w-3.5 border-2 border-foreground bg-black checked:bg-primary accent-primary cursor-pointer rounded-none"
                  />
                  <span>EXCLUDE ARCHIVED</span>
                </label>
              </div>
            </FilterSection>
          </div>
        </div>

        {/* Results Workspace */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filters Tag Strip */}
          {isAnyFilterActive && (
            <div className="border-2 border-foreground bg-zinc-950 p-3.5 flex flex-wrap items-center gap-2 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1 mr-2 select-none">
                <Filter className="h-3 w-3 text-accent" />
                <span>Active Filters ({activeBadges.length + (qParam ? 1 : 0)}):</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 items-center">
                {qParam && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-zinc-700 bg-black text-[9px] font-bold text-zinc-300">
                    Query: "{qParam}"
                    <button
                      onClick={() => updateUrlParams({ q: "" })}
                      className="text-red-500 hover:text-red-400 font-bold ml-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {activeBadges.map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-1 px-2 py-0.5 border border-zinc-700 bg-black text-[9px] font-bold text-accent"
                  >
                    {badge.label}
                    <button
                      onClick={() => handleRemoveBadge(badge)}
                      className="text-red-500 hover:text-red-400 font-bold ml-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                <button
                  onClick={handleClearAllFilters}
                  className="text-[9px] font-black uppercase text-red-500 hover:underline px-2 py-0.5 cursor-pointer ml-auto"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="h-96 border-4 border-foreground bg-card flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-xs uppercase text-zinc-500 font-bold">Querying GitHub API...</span>
            </div>
          ) : error ? (
            <div className="border-4 border-destructive bg-zinc-950 p-6 shadow-[4px_4px_0px_0px_var(--destructive)]">
              <h3 className="text-red-500 font-bold uppercase text-sm">GitHub Conduit Exception</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{error}</p>
              <button
                onClick={handleClearAllFilters}
                className="mt-4 px-3 py-1.5 border-2 border-foreground bg-foreground text-background font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:bg-zinc-200 cursor-pointer"
              >
                Reset Search & Filters
              </button>
            </div>
          ) : repos.length === 0 ? (
            <div className="h-96 border-4 border-foreground bg-card flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-bold uppercase">No repositories found</span>
              <span className="text-xs text-zinc-500 text-center max-w-sm px-4">
                Try widening your search terms, reducing filters, or selecting a different language.
              </span>
            </div>
          ) : (
            <>
              {/* Repo grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {repos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-2 border-foreground bg-black p-4 flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] select-none">
                  <button
                    disabled={pageParam <= 1}
                    onClick={() => updateUrlParams({ page: pageParam - 1 })}
                    className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-bold text-xs uppercase disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-900 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>PREV</span>
                  </button>

                  <span className="text-xs font-bold text-zinc-400">
                    PAGE {pageParam} OF {totalPages}
                  </span>

                  <button
                    disabled={pageParam >= totalPages}
                    onClick={() => updateUrlParams({ page: pageParam + 1 })}
                    className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-bold text-xs uppercase disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-900 cursor-pointer"
                  >
                    <span>NEXT</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

