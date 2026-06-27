"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  GitBranch, 
  Terminal, 
  Settings, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Layers, 
  Code,
  ArrowRight,
  Info,
  ExternalLink,
  Loader2
} from "lucide-react"

import newsData from "../../../../data/news.json"
import trendingData from "../../../../data/trending-repositories.json"
import eventsData from "../../../../data/events.json"
import apisData from "../../../../data/apis.json"
import { getTrendingRepositories, searchIssues } from "@/core/services/github"

export function BentoGrid() {
  const router = useRouter()

  const popularTools = [
    { name: "JSON Format", slug: "json-formatter" },
    { name: "JWT Decoder", slug: "jwt-decoder" },
    { name: "UUID Gen", slug: "uuid-generator" },
    { name: "Hash Gen", slug: "hash-generator" },
    { name: "Base64 Code", slug: "base64-encode" },
    { name: "RegEx Tester", slug: "regex-tester" },
    { name: "Lorem Ipsum", slug: "lorem-ipsum" },
    { name: "Slug Gen", slug: "slug-generator" },
  ]

  const mockIssues = [
    { repo: "facebook/react", title: "fix(docs): update hooks render cycle tutorial link", label: "documentation", difficulty: "Easy", html_url: "/issues" },
    { repo: "vercel/next.js", title: "feat: add support for dynamic local route pre-renders", label: "feature", difficulty: "Medium", html_url: "/issues" },
    { repo: "shadcn/ui", title: "bug: custom input group border overlapping in dark mode", label: "bug", difficulty: "Easy", html_url: "/issues" }
  ]

  const [trendingRepos, setTrendingRepos] = React.useState<any[]>([])
  const [liveIssues, setLiveIssues] = React.useState<any[]>([])
  const [isTrendingLoading, setIsTrendingLoading] = React.useState(true)
  const [isIssuesLoading, setIsIssuesLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingRepositories({ timeRange: "weekly", perPage: 4 })
        setTrendingRepos(data.items)
      } catch (e) {
        console.error("Failed to load bento trending repos:", e)
        setTrendingRepos(trendingData.slice(0, 4) as any[])
      } finally {
        setIsTrendingLoading(false)
      }
    }

    const fetchIssues = async () => {
      try {
        const data = await searchIssues({ q: 'is:issue state:open label:"good first issue"', perPage: 3 })
        setLiveIssues(data.items)
      } catch (e) {
        console.error("Failed to load bento issues:", e)
        setLiveIssues(mockIssues)
      } finally {
        setIsIssuesLoading(false)
      }
    }

    fetchTrending()
    fetchIssues()
  }, [])

  return (
    <section className="w-full min-h-[100vh] border-b-4 border-foreground py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center bg-background">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--primary)] flex flex-col hover:translate-y-[-2px] transition-all lg:col-span-2 lg:row-span-2">
          <div className="bg-primary text-primary-foreground border-b-2 border-foreground p-3 font-mono font-bold flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>TRENDING REPOSITORIES</span>
            </div>
            <Link href="/trending" className="text-[10px] underline tracking-wider font-black hover:text-accent">
              VIEW ALL
            </Link>
          </div>
          {isTrendingLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-zinc-500 font-mono text-xs gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span>LOAD_API_TRENDS</span>
            </div>
          ) : (
            <div className="p-4 flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingRepos.map((repo) => {
                const ownerLogin = repo.owner?.login || repo.owner
                const starsCount = repo.stargazers_count !== undefined ? repo.stargazers_count : repo.stars
                const forksCount = repo.forks_count !== undefined ? repo.forks_count : repo.forks
                return (
                  <div 
                    key={repo.id || `${ownerLogin}-${repo.name}`} 
                    className="p-3 border-2 border-foreground bg-black shadow-[2px_2px_0px_0px_var(--border)] flex flex-col justify-between font-mono"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link 
                          href={`/repos/${ownerLogin}/${repo.name}`}
                          className="text-xs font-black text-foreground hover:text-primary hover:underline truncate"
                        >
                          {ownerLogin}/{repo.name}
                        </Link>
                        {repo.language && (
                          <span className="text-[9px] bg-zinc-900 border border-border px-1 text-accent font-bold shrink-0">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                        {repo.description || "No public description provided."}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-3 text-[10px] text-zinc-500 font-bold">
                      <span>★ {starsCount.toLocaleString()}</span>
                      <span>⑂ {forksCount.toLocaleString()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--accent)] flex flex-col hover:translate-y-[-2px] transition-all lg:col-span-2 lg:row-span-1">
          <div className="bg-accent text-accent-foreground border-b-2 border-foreground p-3 font-mono font-bold flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span>GOOD FIRST ISSUES</span>
            </div>
            <Link href="/issues" className="text-[10px] underline tracking-wider font-black hover:text-primary">
              FIND ISSUES
            </Link>
          </div>
          {isIssuesLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-zinc-500 font-mono text-xs gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
              <span>LOAD_API_ISSUES</span>
            </div>
          ) : (
            <div className="p-4 flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4 bg-dot-pattern">
              {liveIssues.map((issue, idx) => {
                const repoName = issue.repo_name || issue.repo || "unknown/repo"
                const labelName = issue.labels && issue.labels.length > 0 ? issue.labels[0].name : (issue.label || "good-first-issue")
                return (
                  <div 
                    key={issue.id || idx} 
                    className="p-3 border-2 border-foreground bg-black shadow-[2px_2px_0px_0px_var(--border)] flex flex-col justify-between font-mono"
                  >
                    <div>
                      <span className="text-[9px] text-zinc-500 block font-bold truncate">{repoName}</span>
                      <a 
                        href={issue.html_url || "/issues"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black text-foreground hover:underline line-clamp-2 mt-1 leading-snug"
                      >
                        {issue.title}
                      </a>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[8px] border border-border px-1 py-0.5 bg-zinc-900 text-zinc-400 font-bold uppercase truncate max-w-[80px]">
                        {labelName}
                      </span>
                      <span className="text-[8px] border px-1.5 py-0.5 font-bold uppercase border-green-800 bg-green-950/30 text-green-400">
                        {issue.difficulty || "Easy"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_#ffffff] flex flex-col hover:translate-y-[-2px] transition-all lg:col-span-1 lg:row-span-1">
          <div className="bg-zinc-900 text-foreground border-b-2 border-foreground p-3 font-mono font-bold flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>FEATURED APIs</span>
            </div>
            <Link href="/apis" className="text-[10px] underline tracking-wider font-black hover:text-primary">
              EXPLORE
            </Link>
          </div>
          <div className="p-4 flex-grow flex flex-col justify-center divide-y divide-border/60">
            {apisData.slice(0, 2).map((api) => (
              <div key={api.name} className="py-2.5 first:pt-0 last:pb-0 font-mono">
                <div className="flex items-center justify-between gap-2">
                  <Link href="/apis" className="text-xs font-black text-foreground hover:underline truncate">
                    {api.name}
                  </Link>
                  <span className="text-[8px] border border-border px-1 bg-black text-zinc-400 uppercase font-bold">
                    {api.category}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  {api.description}
                </p>
                <div className="mt-1 flex items-center justify-between text-[9px] text-zinc-500 font-bold">
                  <span>Auth: {api.authentication.split(" ")[0]}</span>
                  <span className="text-accent">{api.rateLimit.split(" ")[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_#ffffff] flex flex-col hover:translate-y-[-2px] transition-all lg:col-span-1 lg:row-span-2">
          <div className="bg-zinc-900 text-foreground border-b-2 border-foreground p-3 font-mono font-bold flex items-center justify-between select-none bg-stripes-pattern">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>POPULAR DEV TOOLS</span>
            </div>
            <Link href="/tools" className="text-[10px] underline tracking-wider font-black hover:text-accent">
              OPEN BOX
            </Link>
          </div>
          <div className="p-4 flex-grow flex flex-col justify-between bg-checkered-pattern">
            <div className="grid grid-cols-1 gap-2">
              {popularTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools?tool=${tool.slug}`}
                  className="border-2 border-foreground p-2 bg-black font-mono text-left text-xs font-black hover:bg-primary hover:text-primary-foreground shadow-[2px_2px_0px_0px_var(--border)] hover:translate-y-[-1px] transition-all"
                >
                  &gt; {tool.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 text-center">
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                32 utilities running 100% in-browser. Zero latency, zero data logs.
              </p>
            </div>
          </div>
        </div>

        <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--primary)] flex flex-col hover:translate-y-[-2px] transition-all lg:col-span-2 lg:row-span-1">
          <div className="bg-primary text-primary-foreground border-b-2 border-foreground p-3 font-mono font-bold flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>UPCOMING PROGRAMS</span>
            </div>
            <Link href="/events" className="text-[10px] underline tracking-wider font-black hover:text-accent">
              SCHEDULES
            </Link>
          </div>
          <div className="p-4 flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stripes-pattern">
            {eventsData.slice(0, 2).map((event) => (
              <div 
                key={event.name} 
                className="p-3 border-2 border-foreground bg-black shadow-[2px_2px_0px_0px_var(--border)] flex flex-col justify-between font-mono"
              >
                <div>
                  <h4 className="text-xs font-black text-foreground truncate">{event.name}</h4>
                  <p className="text-[9px] text-accent mt-0.5 font-bold uppercase">
                    {event.timeline}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--accent)] flex flex-col hover:translate-y-[-2px] transition-all lg:col-span-1 lg:row-span-1">
          <div className="bg-accent text-accent-foreground border-b-2 border-foreground p-3 font-mono font-bold flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>DEVELOPER NEWS</span>
            </div>
            <Link href="/news" className="text-[10px] underline tracking-wider font-black hover:text-primary">
              ARCHIVE
            </Link>
          </div>
          <div className="p-4 flex-grow flex flex-col justify-center divide-y divide-border/60">
            {newsData.slice(0, 2).map((item) => (
              <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] bg-primary text-primary-foreground px-1 py-0.5 font-black uppercase">
                    {item.category}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-bold">{item.date}</span>
                </div>
                <h4 className="text-xs font-black text-foreground mt-1 line-clamp-1 hover:underline">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5">
                    {item.title} <ExternalLink className="h-3 w-3 inline shrink-0 opacity-50" />
                  </a>
                </h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </section>
  )
}
