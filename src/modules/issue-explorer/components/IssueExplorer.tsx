"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, SlidersHorizontal, Loader2, ArrowLeft, ArrowRight, X, Trash2 } from "lucide-react"
import { searchIssues, searchRepositories, GithubIssue } from "@/core/services/github"
import { IssueCard } from "./IssueCard"

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Go", "Rust", "C++", "Java", "Ruby", "PHP", "HTML"]

const REPO_STARS_PRESETS = [
  { label: "Any Stars", value: "any" },
  { label: "Popular (>100)", value: ">100" },
  { label: "Highly Popular (>500)", value: ">500" },
  { label: "Mega Popular (>1k)", value: ">1000" },
  { label: "Custom Range", value: "custom" },
]

const LABEL_PRESETS = [
  { label: "Any Label", value: "" },
  { label: "Good First Issue", value: "good first issue" },
  { label: "Help Wanted", value: "help wanted" },
  { label: "Lvl 2 Issue", value: "lvl 2 issue" },
  { label: "Bug", value: "bug" },
  { label: "Documentation", value: "documentation" },
  { label: "Enhancement", value: "enhancement" },
  { label: "Hacktoberfest", value: "hacktoberfest" },
]

const STATE_PRESETS = [
  { label: "Open Issues Only", value: "open" },
  { label: "Closed Issues Only", value: "closed" },
  { label: "Any State", value: "any" },
]

const TYPE_PRESETS = [
  { label: "Issues Only", value: "issue" },
  { label: "PRs Only", value: "pr" },
  { label: "Issues & PRs", value: "any" },
]

const ASSIGNEE_PRESETS = [
  { label: "Any Assignee", value: "" },
  { label: "Unassigned Only", value: "unassigned" },
  { label: "Specific User", value: "custom" },
]

const COMMENTS_PRESETS = [
  { label: "Any Comments", value: "" },
  { label: "No Comments", value: "0" },
  { label: "Has Comments (>0)", value: ">0" },
  { label: "Highly Commented (10+)", value: "10+" },
]

const DATE_PRESETS = [
  { label: "Any Time", value: "" },
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last Year", value: "365d" },
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
        <span className="text-primary font-bold">
          {isOpen ? "[-]" : "[+]"}
        </span>
      </button>
      {isOpen && <div className="p-3 bg-card space-y-3">{children}</div>}
    </div>
  )
}

export function IssueExplorer() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const qParam = searchParams.get("q") || ""
  const orgParam = searchParams.get("org") || ""
  const repoParam = searchParams.get("repo") || ""
  const langParam = searchParams.get("lang") || ""
  const stateParam = searchParams.get("state") || "open"
  const typeParam = searchParams.get("type") || "issue"
  const labelParam = searchParams.get("label") || ""
  const repoStarsParam = searchParams.get("repoStars") || "any"
  const repoStarsMinParam = searchParams.get("repoStarsMin") || ""
  const repoStarsMaxParam = searchParams.get("repoStarsMax") || ""
  const assigneeParam = searchParams.get("assignee") || ""
  const assigneeValParam = searchParams.get("assigneeVal") || ""
  const commentsParam = searchParams.get("comments") || ""
  const createdParam = searchParams.get("created") || ""
  const updatedParam = searchParams.get("updated") || ""
  const sortParam = searchParams.get("sort") || "best_match"
  const pageParam = parseInt(searchParams.get("page") || "1", 10)

  const [searchInput, setSearchInput] = React.useState(qParam)
  const [orgInput, setOrgInput] = React.useState(orgParam)
  const [repoInput, setRepoInput] = React.useState(repoParam)
  const [customLangInput, setCustomLangInput] = React.useState("")
  const [customLabelInput, setCustomLabelInput] = React.useState("")
  const [customAssigneeInput, setCustomAssigneeInput] = React.useState(assigneeValParam)
  const [localRepoStarsMin, setLocalRepoStarsMin] = React.useState(repoStarsMinParam)
  const [localRepoStarsMax, setLocalRepoStarsMax] = React.useState(repoStarsMaxParam)

  const [issues, setIssues] = React.useState<GithubIssue[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [famousOrgs, setFamousOrgs] = React.useState<string[]>([])

  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    language: true,
    repoStars: false,
    labels: false,
    state: false,
    type: false,
    assignee: false,
    comments: false,
    dates: false,
  })

  // Dynamic load of high level orgs based on top starred repos on GitHub
  React.useEffect(() => {
    const fetchFamousOrgs = async () => {
      try {
        const reposData = await searchRepositories({
          q: "stars:>40000",
          sort: "stars",
          order: "desc",
          page: 1,
          perPage: 50,
        })
        const owners = reposData.items.map(r => r.owner.login.toLowerCase())
        const uniqueOwners = Array.from(new Set(owners))
        setFamousOrgs(uniqueOwners)
      } catch (e) {
        console.error("Failed to dynamically load famous orgs:", e)
      }
    }
    fetchFamousOrgs()
  }, [])

  React.useEffect(() => {
    setSearchInput(qParam)
    setOrgInput(orgParam)
    setRepoInput(repoParam)
  }, [qParam, orgParam, repoParam])

  React.useEffect(() => {
    setLocalRepoStarsMin(repoStarsMinParam)
    setLocalRepoStarsMax(repoStarsMaxParam)
    setCustomAssigneeInput(assigneeValParam)
    if (labelParam && !LABEL_PRESETS.some(p => p.value === labelParam)) {
      setCustomLabelInput(labelParam)
    } else if (!labelParam) {
      setCustomLabelInput("")
    }
  }, [repoStarsMinParam, repoStarsMaxParam, assigneeValParam, labelParam])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const updateUrlParams = React.useCallback(
    (newParams: {
      q?: string
      org?: string
      repo?: string
      lang?: string
      state?: string
      type?: string
      label?: string
      repoStars?: string
      repoStarsMin?: string
      repoStarsMax?: string
      assignee?: string
      assigneeVal?: string
      comments?: string
      created?: string
      updated?: string
      sort?: string
      page?: number
    }) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      const setOrDelete = (key: string, value: any) => {
        if (value !== undefined) {
          if (value === "" || value === null) {
            current.delete(key)
          } else {
            current.set(key, String(value))
          }
        }
      }

      setOrDelete("q", newParams.q)
      setOrDelete("org", newParams.org)
      setOrDelete("repo", newParams.repo)
      setOrDelete("lang", newParams.lang)
      setOrDelete("state", newParams.state)
      setOrDelete("type", newParams.type)
      setOrDelete("label", newParams.label)
      setOrDelete("repoStars", newParams.repoStars)
      setOrDelete("repoStarsMin", newParams.repoStarsMin)
      setOrDelete("repoStarsMax", newParams.repoStarsMax)
      setOrDelete("assignee", newParams.assignee)
      setOrDelete("assigneeVal", newParams.assigneeVal)
      setOrDelete("comments", newParams.comments)
      setOrDelete("created", newParams.created)
      setOrDelete("updated", newParams.updated)
      setOrDelete("sort", newParams.sort)

      if (newParams.page !== undefined) {
        current.set("page", String(newParams.page))
      } else {
        current.set("page", "1")
      }

      router.push(`/issues?${current.toString()}`)
    },
    [searchParams, router]
  )

  React.useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const queryParts: string[] = []

        // Type: issue, pr, or any
        if (typeParam === "issue") {
          queryParts.push("is:issue")
        } else if (typeParam === "pr") {
          queryParts.push("is:pr")
        }

        // State: open, closed, or any
        if (stateParam === "open") {
          queryParts.push("state:open")
        } else if (stateParam === "closed") {
          queryParts.push("state:closed")
        }

        // Label Constraint
        if (labelParam) {
          queryParts.push(`label:"${labelParam}"`)
        }

        // Language
        if (langParam) {
          queryParts.push(`language:"${langParam}"`)
        }

        // Specific Org Constraint
        if (orgParam.trim()) {
          queryParts.push(`org:${orgParam.trim()}`)
        }

        // Specific Repo Constraint
        if (repoParam.trim()) {
          queryParts.push(`repo:${repoParam.trim()}`)
        }

        // Parent repo stars
        if (repoStarsParam === "custom") {
          if (repoStarsMinParam && repoStarsMaxParam) {
            queryParts.push(`stars:${repoStarsMinParam}..${repoStarsMaxParam}`)
          } else if (repoStarsMinParam) {
            queryParts.push(`stars:>=${repoStarsMinParam}`)
          } else if (repoStarsMaxParam) {
            queryParts.push(`stars:<=${repoStarsMaxParam}`)
          }
        } else if (repoStarsParam && repoStarsParam !== "any") {
          queryParts.push(`stars:${repoStarsParam}`)
        }

        // Assignee
        if (assigneeParam === "unassigned") {
          queryParts.push("no:assignee")
        } else if (assigneeParam === "custom" && assigneeValParam) {
          queryParts.push(`assignee:${assigneeValParam}`)
        }

        // Comments
        if (commentsParam === "0") {
          queryParts.push("comments:0")
        } else if (commentsParam === ">0") {
          queryParts.push("comments:>0")
        } else if (commentsParam === "10+") {
          queryParts.push("comments:>=10")
        }

        // Created Date
        if (createdParam) {
          const date = new Date()
          if (createdParam === "24h") {
            date.setDate(date.getDate() - 1)
          } else if (createdParam === "7d") {
            date.setDate(date.getDate() - 7)
          } else if (createdParam === "30d") {
            date.setDate(date.getDate() - 30)
          } else if (createdParam === "365d") {
            date.setDate(date.getDate() - 365)
          }
          const dateStr = date.toISOString().split("T")[0]
          queryParts.push(`created:>=${dateStr}`)
        }

        // Updated Date
        if (updatedParam) {
          const date = new Date()
          if (updatedParam === "24h") {
            date.setDate(date.getDate() - 1)
          } else if (updatedParam === "7d") {
            date.setDate(date.getDate() - 7)
          } else if (updatedParam === "30d") {
            date.setDate(date.getDate() - 30)
          } else if (updatedParam === "365d") {
            date.setDate(date.getDate() - 365)
          }
          const dateStr = date.toISOString().split("T")[0]
          queryParts.push(`updated:>=${dateStr}`)
        }

        // Keywords search
        if (qParam.trim()) {
          queryParts.push(qParam.trim())
        }

        let queryStr = queryParts.join(" ")
        if (!queryStr) {
          queryStr = "is:issue state:open"
        }

        let apiSort: string | undefined = undefined
        let apiOrder: "asc" | "desc" = "desc"

        if (sortParam && sortParam !== "best_match") {
          const parts = sortParam.split("-")
          apiSort = parts[0]
          apiOrder = (parts[1] || "desc") as "asc" | "desc"
        }

        const data = await searchIssues({
          q: queryStr,
          page: pageParam,
          perPage: 12,
          sort: apiSort,
          order: apiOrder,
        })

        let fetchedItems = data.items

        // Prioritize issues belonging to famousOrgs by client-side sorting only on best_match (default) sort
        if (famousOrgs.length > 0 && (!sortParam || sortParam === "best_match")) {
          fetchedItems = [...fetchedItems].sort((a, b) => {
            const ownerA = a.repo_owner?.toLowerCase() || ""
            const ownerB = b.repo_owner?.toLowerCase() || ""
            const isFamousA = famousOrgs.includes(ownerA)
            const isFamousB = famousOrgs.includes(ownerB)

            if (isFamousA && !isFamousB) return -1
            if (!isFamousA && isFamousB) return 1
            return 0
          })
        }

        setIssues(fetchedItems)
        setTotalCount(data.total_count)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "An error occurred while loading issues.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchIssues()
  }, [
    qParam,
    orgParam,
    repoParam,
    langParam,
    stateParam,
    typeParam,
    labelParam,
    repoStarsParam,
    repoStarsMinParam,
    repoStarsMaxParam,
    assigneeParam,
    assigneeValParam,
    commentsParam,
    createdParam,
    updatedParam,
    sortParam,
    pageParam,
    famousOrgs,
  ])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrlParams({
      q: searchInput,
      org: orgInput,
      repo: repoInput,
    })
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
    setCustomLabelInput("")
    setCustomAssigneeInput("")
    setOrgInput("")
    setRepoInput("")
    updateUrlParams({
      q: "",
      org: "",
      repo: "",
      lang: "",
      state: "open",
      type: "issue",
      label: "",
      repoStars: "any",
      repoStarsMin: "",
      repoStarsMax: "",
      assignee: "",
      assigneeVal: "",
      comments: "",
      created: "",
      updated: "",
      sort: "best_match",
    })
  }

  const handleRemoveBadge = (badge: { clearKey: string; clearValue: any }) => {
    const paramsToUpdate: any = { [badge.clearKey]: badge.clearValue }
    if (badge.clearKey === "repoStars") {
      paramsToUpdate.repoStarsMin = ""
      paramsToUpdate.repoStarsMax = ""
    }
    if (badge.clearKey === "assignee") {
      paramsToUpdate.assigneeVal = ""
    }
    updateUrlParams(paramsToUpdate)
  }

  const getActiveFilterBadges = () => {
    const badges: { label: string; clearKey: string; clearValue: any }[] = []

    if (langParam) {
      badges.push({ label: `Lang: ${langParam}`, clearKey: "lang", clearValue: "" })
    }

    if (orgParam) {
      badges.push({ label: `Org: ${orgParam}`, clearKey: "org", clearValue: "" })
    }

    if (repoParam) {
      badges.push({ label: `Repo: ${repoParam}`, clearKey: "repo", clearValue: "" })
    }

    if (stateParam !== "open") {
      const labels: Record<string, string> = { closed: "Closed Only", any: "Any State" }
      badges.push({ label: `State: ${labels[stateParam] || stateParam}`, clearKey: "state", clearValue: "open" })
    }

    if (typeParam !== "issue") {
      const labels: Record<string, string> = { pr: "PRs Only", any: "Issues & PRs" }
      badges.push({ label: `Type: ${labels[typeParam] || typeParam}`, clearKey: "type", clearValue: "issue" })
    }

    if (labelParam) {
      badges.push({ label: `Label: ${labelParam}`, clearKey: "label", clearValue: "" })
    }

    if (repoStarsParam !== "any") {
      if (repoStarsParam === "custom") {
        const range = `${repoStarsMinParam || "0"} - ${repoStarsMaxParam || "∞"}`
        badges.push({ label: `Repo Stars: ${range}`, clearKey: "repoStars", clearValue: "any" })
      } else {
        badges.push({ label: `Repo Stars: ${repoStarsParam}`, clearKey: "repoStars", clearValue: "any" })
      }
    }

    if (assigneeParam) {
      if (assigneeParam === "unassigned") {
        badges.push({ label: "Unassigned", clearKey: "assignee", clearValue: "" })
      } else if (assigneeParam === "custom" && assigneeValParam) {
        badges.push({ label: `Assignee: ${assigneeValParam}`, clearKey: "assignee", clearValue: "" })
      }
    }

    if (commentsParam) {
      const labels: Record<string, string> = { "0": "No Comments", ">0": "Has Comments", "10+": "10+ Comments" }
      badges.push({ label: `Comments: ${labels[commentsParam] || commentsParam}`, clearKey: "comments", clearValue: "" })
    }

    if (createdParam) {
      const labels: Record<string, string> = { "24h": "Created: 24h", "7d": "Created: 7d", "30d": "Created: 30d", "365d": "Created: year" }
      badges.push({ label: labels[createdParam] || `Created: ${createdParam}`, clearKey: "created", clearValue: "" })
    }

    if (updatedParam) {
      const labels: Record<string, string> = { "24h": "Updated: 24h", "7d": "Updated: 7d", "30d": "Updated: 30d", "365d": "Updated: year" }
      badges.push({ label: labels[updatedParam] || `Updated: ${updatedParam}`, clearKey: "updated", clearValue: "" })
    }

    return badges
  }

  const activeBadges = getActiveFilterBadges()
  const isAnyFilterActive = activeBadges.length > 0 || qParam !== "" || orgParam !== "" || repoParam !== ""

  const totalPages = Math.min(Math.ceil(totalCount / 12), 80)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          ISSUES EXPLORER
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4">
          EXPLORE OPEN-SOURCE ISSUES
        </h2>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative border-2 border-foreground bg-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus-within:shadow-[3px_3px_0px_0px_var(--primary)] transition-all">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Keywords (e.g. docker, auth, fix)..."
                className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-zinc-600"
              />
            </div>
            
            <div className="relative border-2 border-foreground bg-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus-within:shadow-[3px_3px_0px_0px_var(--primary)] transition-all">
              <input
                type="text"
                value={orgInput}
                onChange={(e) => setOrgInput(e.target.value)}
                placeholder="Specific Org (e.g. mozilla, facebook)..."
                className="w-full h-11 px-4 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-zinc-600"
              />
            </div>

            <div className="relative border-2 border-foreground bg-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus-within:shadow-[3px_3px_0px_0px_var(--primary)] transition-all">
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="Specific Repo (e.g. mozilla/pdf.js)..."
                className="w-full h-11 px-4 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            <div className="text-[9px] font-black uppercase text-accent tracking-wider select-none">
              {famousOrgs.length > 0 
                ? `🚀 dynamic priority active: bubble issues from ${famousOrgs.length} top starred orgs`
                : "⚡ fetching high-profile org indices..."
              }
            </div>

            <div className="flex gap-3">
              <select
                value={sortParam}
                onChange={handleSortChange}
                className="h-11 border-2 border-foreground bg-black px-4 py-2 text-xs font-bold uppercase text-foreground shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus:outline-none cursor-pointer"
              >
                <option value="best_match">BEST MATCH</option>
                <option value="created-desc">NEWEST CREATED</option>
                <option value="created-asc">OLDEST CREATED</option>
                <option value="comments-desc">MOST COMMENTED</option>
                <option value="comments-asc">LEAST COMMENTED</option>
                <option value="updated-desc">RECENTLY UPDATED</option>
                <option value="updated-asc">LEAST UPDATED</option>
                <option value="reactions-desc">MOST REACTED</option>
              </select>
              
              <button
                type="submit"
                className="h-11 px-6 border-2 border-foreground bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-purple-600 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                SEARCH
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--accent)] space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between text-xs font-black uppercase text-foreground select-none">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
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
                        ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

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
                  className="px-2.5 py-1 border-2 border-foreground bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-purple-600 cursor-pointer shrink-0"
                >
                  Set
                </button>
              </div>
            </FilterSection>

            <FilterSection
              title="Repo Popularity"
              isOpen={expandedSections.repoStars}
              onToggle={() => toggleSection("repoStars")}
            >
              <div className="space-y-1.5">
                {REPO_STARS_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      if (preset.value === "custom") {
                        updateUrlParams({ repoStars: "custom" })
                      } else {
                        updateUrlParams({ repoStars: preset.value, repoStarsMin: "", repoStarsMax: "" })
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      repoStarsParam === preset.value
                        ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {repoStarsParam === "custom" && (
                <div className="space-y-2 pt-2 border-t border-zinc-950">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="MIN STARS"
                      value={localRepoStarsMin}
                      onChange={(e) => setLocalRepoStarsMin(e.target.value)}
                      className="flex-1 min-w-0 h-8 px-2 border-2 border-foreground bg-black text-xs font-mono focus:outline-none placeholder:text-zinc-700"
                    />
                    <input
                      type="number"
                      placeholder="MAX STARS"
                      value={localRepoStarsMax}
                      onChange={(e) => setLocalRepoStarsMax(e.target.value)}
                      className="flex-1 min-w-0 h-8 px-2 border-2 border-foreground bg-black text-xs font-mono focus:outline-none placeholder:text-zinc-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateUrlParams({
                        repoStars: "custom",
                        repoStarsMin: localRepoStarsMin,
                        repoStarsMax: localRepoStarsMax,
                      })
                    }
                    className="w-full py-1.5 border-2 border-foreground bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-purple-600 cursor-pointer"
                  >
                    Apply Range
                  </button>
                </div>
              )}
            </FilterSection>

            <FilterSection
              title="Filter by Labels"
              isOpen={expandedSections.labels}
              onToggle={() => toggleSection("labels")}
            >
              <div className="space-y-1.5">
                {LABEL_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateUrlParams({ label: preset.value })}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      labelParam === preset.value
                        ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-zinc-950">
                <input
                  type="text"
                  placeholder="Custom label..."
                  value={customLabelInput}
                  onChange={(e) => setCustomLabelInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (customLabelInput.trim()) {
                        updateUrlParams({ label: customLabelInput.trim() })
                      }
                    }
                  }}
                  className="flex-grow min-w-0 h-8 px-2 border-2 border-foreground bg-black text-xs font-mono focus:outline-none placeholder:text-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customLabelInput.trim()) {
                      updateUrlParams({ label: customLabelInput.trim() })
                    }
                  }}
                  className="px-2.5 py-1 border-2 border-foreground bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-purple-600 cursor-pointer shrink-0"
                >
                  Set
                </button>
              </div>
            </FilterSection>

            <FilterSection
              title="Issue State"
              isOpen={expandedSections.state}
              onToggle={() => toggleSection("state")}
            >
              <div className="space-y-1.5">
                {STATE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateUrlParams({ state: preset.value })}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      stateParam === preset.value
                        ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Type / Kind"
              isOpen={expandedSections.type}
              onToggle={() => toggleSection("type")}
            >
              <div className="space-y-1.5">
                {TYPE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateUrlParams({ type: preset.value })}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      typeParam === preset.value
                        ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Assignee"
              isOpen={expandedSections.assignee}
              onToggle={() => toggleSection("assignee")}
            >
              <div className="space-y-1.5">
                {ASSIGNEE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      if (preset.value === "custom") {
                        updateUrlParams({ assignee: "custom" })
                      } else {
                        updateUrlParams({ assignee: preset.value, assigneeVal: "" })
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      assigneeParam === preset.value
                        ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {assigneeParam === "custom" && (
                <div className="flex gap-2 pt-2 border-t border-zinc-950">
                  <input
                    type="text"
                    placeholder="Username..."
                    value={customAssigneeInput}
                    onChange={(e) => setCustomAssigneeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        if (customAssigneeInput.trim()) {
                          updateUrlParams({ assignee: "custom", assigneeVal: customAssigneeInput.trim() })
                        }
                      }
                    }}
                    className="flex-grow min-w-0 h-8 px-2 border-2 border-foreground bg-black text-xs font-mono focus:outline-none placeholder:text-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAssigneeInput.trim()) {
                        updateUrlParams({ assignee: "custom", assigneeVal: customAssigneeInput.trim() })
                      }
                    }}
                    className="px-2.5 py-1 border-2 border-foreground bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-purple-600 cursor-pointer shrink-0"
                  >
                    Set
                  </button>
                </div>
              )}
            </FilterSection>

            <FilterSection
              title="Comments count"
              isOpen={expandedSections.comments}
              onToggle={() => toggleSection("comments")}
            >
              <div className="space-y-1.5">
                {COMMENTS_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updateUrlParams({ comments: preset.value })}
                    className={`w-full text-left px-2.5 py-1.5 border-2 text-[10px] font-bold uppercase transition-all select-none cursor-pointer block ${
                      commentsParam === preset.value
                        ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 text-zinc-400 hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Dates & Time"
              isOpen={expandedSections.dates}
              onToggle={() => toggleSection("dates")}
            >
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Created Date
                  </label>
                  <select
                    value={createdParam}
                    onChange={(e) => updateUrlParams({ created: e.target.value })}
                    className="w-full h-8 border-2 border-zinc-800 bg-black px-2 text-[10px] font-bold uppercase text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    {DATE_PRESETS.map(p => (
                      <option key={p.label} value={p.value}>{p.label.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Updated Date
                  </label>
                  <select
                    value={updatedParam}
                    onChange={(e) => updateUrlParams({ updated: e.target.value })}
                    className="w-full h-8 border-2 border-zinc-800 bg-black px-2 text-[10px] font-bold uppercase text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    {DATE_PRESETS.map(p => (
                      <option key={p.label} value={p.value}>{p.label.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
            </FilterSection>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Badges */}
          {isAnyFilterActive && (
            <div className="border-2 border-foreground bg-zinc-950 p-3 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <div className="text-[10px] font-bold text-zinc-500 uppercase select-none mb-2">
                Active Filters ({activeBadges.length + (qParam ? 1 : 0)}):
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
              <span className="text-xs uppercase text-zinc-500 font-bold">Querying GitHub Issues...</span>
            </div>
          ) : error ? (
            <div className="border-4 border-destructive bg-zinc-950 p-6 shadow-[4px_4px_0px_0px_var(--destructive)]">
              <h3 className="text-red-500 font-bold uppercase text-sm">GitHub Issue API Exception</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{error}</p>
              <button 
                onClick={handleClearAllFilters}
                className="mt-4 px-3 py-1.5 border-2 border-foreground bg-foreground text-background font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:bg-zinc-200 cursor-pointer"
              >
                Reset Search & Filters
              </button>
            </div>
          ) : issues.length === 0 ? (
            <div className="h-96 border-4 border-foreground bg-card flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-bold uppercase">No issues found</span>
              <span className="text-xs text-zinc-500 text-center max-w-sm px-4">
                Try widening your search terms, reducing filters, or selecting a different language/label.
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {issues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>

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
