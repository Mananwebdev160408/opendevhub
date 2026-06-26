"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, SlidersHorizontal, Loader2, ArrowLeft, ArrowRight } from "lucide-react"
import { searchRepositories, GithubRepo } from "@/core/services/github"
import { RepoCard } from "./RepoCard"

export function RepoExplorer() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const qParam = searchParams.get("q") || ""
  const langParam = searchParams.get("lang") || ""
  const sortParam = (searchParams.get("sort") || "stars") as "stars" | "forks" | "updated"
  const pageParam = parseInt(searchParams.get("page") || "1", 10)

  const [searchInput, setSearchInput] = React.useState(qParam)
  const [repos, setRepos] = React.useState<GithubRepo[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Popular languages filter options
  const languages = ["JavaScript", "TypeScript", "Python", "Go", "Rust", "C++", "Java", "Ruby", "PHP", "HTML"]
  
  const updateUrlParams = React.useCallback(
    (newParams: { q?: string; lang?: string; sort?: string; page?: number }) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      
      if (newParams.q !== undefined) {
        if (newParams.q) current.set("q", newParams.q)
        else current.delete("q")
      }
      
      if (newParams.lang !== undefined) {
        if (newParams.lang) current.set("lang", newParams.lang)
        else current.delete("lang")
      }

      if (newParams.sort !== undefined) {
        current.set("sort", newParams.sort)
      }

      if (newParams.page !== undefined) {
        current.set("page", String(newParams.page))
      } else {
        current.set("page", "1") // reset to first page on filter change
      }

      router.push(`/repos?${current.toString()}`)
    },
    [searchParams, router]
  )

  React.useEffect(() => {
    // Sync input field with URL query param
    setSearchInput(qParam)
  }, [qParam])

  React.useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Construct query string for GitHub Search API
        let queryStr = qParam || "stars:>500" // Default trending search if query is empty
        if (langParam) {
          queryStr += ` language:${langParam}`
        }

        const data = await searchRepositories({
          q: queryStr,
          sort: sortParam,
          page: pageParam,
          perPage: 12
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
  }, [qParam, langParam, sortParam, pageParam])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrlParams({ q: searchInput })
  }

  const handleLangSelect = (lang: string) => {
    const nextLang = langParam === lang ? "" : lang // toggle language
    updateUrlParams({ lang: nextLang })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrlParams({ sort: e.target.value })
  }

  const totalPages = Math.min(Math.ceil(totalCount / 12), 80) // GitHub limit is 1000 search results (80 pages of 12)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
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
              className="h-11 px-6 border-2 border-foreground bg-accent text-accent-foreground font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-teal-400 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            >
              QUERY
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--primary)] space-y-6">
          <div className="border-b border-border pb-3 flex items-center gap-2 text-xs font-black uppercase text-foreground select-none">
            <SlidersHorizontal className="h-4 w-4 text-accent" />
            <span>FILTER BY LANGUAGE</span>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangSelect(lang)}
                className={`text-left px-3 py-2 border-2 text-xs font-bold uppercase transition-all select-none cursor-pointer ${
                  langParam.toLowerCase() === lang.toLowerCase()
                    ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    : "border-zinc-800 hover:border-foreground hover:bg-zinc-900"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Results Workspace */}
        <div className="lg:col-span-3 space-y-8">
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
                onClick={() => updateUrlParams({ q: "", lang: "", sort: "stars", page: 1 })}
                className="mt-4 px-3 py-1.5 border-2 border-foreground bg-foreground text-background font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:bg-zinc-200 cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : repos.length === 0 ? (
            <div className="h-96 border-4 border-foreground bg-card flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-bold uppercase">No repositories found</span>
              <span className="text-xs text-zinc-500">Try checking your spelling or selecting a different language filter.</span>
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
