import { notFound } from "next/navigation"
import Link from "next/link"
import { getRepository, searchIssues } from "@/core/services/github-server"
import { ArrowLeft, Star, GitFork, AlertCircle, Info, ExternalLink, ShieldAlert, Cpu, Calendar, Eye, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Metadata } from "next"

export const revalidate = 86400 // Cache edge response for 24 hours

export async function generateStaticParams() {
  return []
}

interface PageProps {
  params: Promise<{ owner: string; name: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, name } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://opendev-hub.vercel.app"
  return {
    title: `${owner}/${name} Repository Insights - OpenDev Hub`,
    description: `Analyze stars, forks, issues, and contribution metrics for ${owner}/${name} on OpenDev Hub, the open-source developer hub.`,
    alternates: {
      canonical: `${baseUrl}/repos/${owner}/${name}`
    }
  }
}

export default async function RepositoryDetailsPage({ params }: PageProps) {
  const { owner, name } = await params

  let repo
  let issues: any[] = []
  let otherIssues: any[] = []

  try {
    repo = await getRepository(owner, name)
    
    try {
      const issueData = await searchIssues({
        q: `repo:${owner}/${name} state:open label:\"good first issue\"`,
        perPage: 5
      })
      issues = issueData.items
    } catch (e) {
      console.warn("Failed to fetch repo specific issues:", e)
    }

    try {
      const otherIssueData = await searchIssues({
        q: `repo:${owner}/${name} state:open -label:\"good first issue\"`,
        perPage: 5
      })
      otherIssues = otherIssueData.items
    } catch (e) {
      console.warn("Failed to fetch general repo issues:", e)
    }
  } catch (error) {
    console.error("Repository Details Fetch Error:", error)
    notFound()
  }

  let formattedDate = ""
  try {
    formattedDate = formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })
  } catch (e) {
    formattedDate = repo.updated_at.split("T")[0]
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      <Link
        href="/repos"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900 transition-all select-none cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>BACK TO SEARCH</span>
      </Link>

      <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_var(--primary)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          REPOSITORY DETAILS
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            className="w-16 h-16 border-2 border-foreground bg-zinc-800 shadow-[2px_2px_0px_0px_#ffffff] shrink-0"
          />
          <div>
            <span className="text-[10px] bg-primary text-primary-foreground border border-foreground px-2 py-0.5 font-bold uppercase tracking-wider">
              {repo.language || "Unknown"}
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-foreground uppercase tracking-tight mt-2 break-all">
              {repo.name}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Developed by{" "}
              <a href={repo.owner.html_url} target="_blank" rel="noopener noreferrer" className="text-accent underline font-bold">
                {repo.owner.login}
              </a>
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-6 border-l-4 border-accent pl-4 bg-zinc-950/40 py-2">
          {repo.description || "No project overview description provided for this repository."}
        </p>

        {repo.topics && repo.topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {repo.topics.map((topic) => (
              <span key={topic} className="text-[9px] bg-black border border-border text-zinc-300 px-2 py-0.5 font-bold uppercase">
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_var(--accent)] space-y-4">
          <h3 className="text-xs font-black uppercase text-accent border-b border-zinc-800 pb-2">VITAL STATISTICS</h3>
          <div className="space-y-3 font-bold text-xs">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 flex items-center gap-1.5"><Star className="h-3.5 w-3.5" /> STARS</span>
              <span className="text-yellow-400">{repo.stargazers_count.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 flex items-center gap-1.5"><GitFork className="h-3.5 w-3.5" /> FORKS</span>
              <span>{repo.forks_count.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> WATCHERS</span>
              <span>{repo.watchers_count.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" /> OPEN ISSUES</span>
              <span className="text-red-400">{repo.open_issues_count.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_#ffffff] space-y-4">
          <h3 className="text-xs font-black uppercase text-foreground border-b border-zinc-800 pb-2">METADATA</h3>
          <div className="space-y-3 font-bold text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">PRIMARY LANG</span>
              <span className="text-primary">{repo.language || "NONE"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">LICENSE CODE</span>
              <span className="truncate max-w-[120px] text-right">{repo.license ? repo.license.spdx_id || repo.license.name : "NONE"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">LAST SYNC</span>
              <span className="text-[10px] font-normal text-zinc-400">{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_var(--primary)] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase text-primary border-b border-zinc-800 pb-2">LINKS & RESOURCES</h3>
            <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
              Explore codebase files, read contributor guides, or inspect issues directly on GitHub.
            </p>
          </div>
          <div className="space-y-2 mt-4">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2 border-2 border-foreground bg-accent text-accent-foreground font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#ffffff] hover:bg-teal-400 active:translate-x-[1px] active:translate-y-[1px] block cursor-pointer"
            >
              OPEN ON GITHUB ↗
            </a>
          </div>
        </div>

      </div>

      <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_#ffffff] hover:translate-y-[-2px] transition-all">
        <div className="bg-zinc-900 border-b-2 border-foreground p-4 font-mono font-bold flex items-center justify-between bg-stripes-pattern select-none">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-accent" />
            <span>GOOD FIRST ISSUES FROM THIS REPO ({issues.length})</span>
          </div>
          <Link href="/issues" className="text-[10px] underline tracking-wider font-black hover:text-accent">
            ALL ISSUES
          </Link>
        </div>
        <div className="p-6 divide-y divide-border">
          {issues.length === 0 ? (
            <div className="py-4 text-center text-xs text-zinc-500">
              No open issues tagged as `good first issue` found inside this repository right now.
            </div>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-foreground hover:underline">
                    <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                      #{issue.number} - {issue.title}
                    </a>
                  </h4>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {issue.labels.slice(0, 3).map((lbl: any) => (
                      <span
                        key={lbl.id}
                        className="text-[8px] px-1 border border-border text-zinc-400 uppercase font-black"
                      >
                        {lbl.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 font-bold text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {issue.comments} comments</span>
                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 border border-foreground bg-black text-[9px] uppercase hover:text-accent flex items-center gap-0.5"
                  >
                    SOLVE ↗
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all">
        <div className="bg-zinc-900 border-b-2 border-foreground p-4 font-mono font-bold flex items-center justify-between bg-stripes-pattern select-none">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            <span>OTHER OPEN ISSUES FROM THIS REPO ({repo.open_issues_count - issues.length > 0 ? repo.open_issues_count - issues.length : otherIssues.length})</span>
          </div>
          <a
            href={`${repo.html_url}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] underline tracking-wider font-black hover:text-primary"
          >
            VIEW ALL ON GITHUB
          </a>
        </div>
        <div className="p-6 divide-y divide-border">
          {otherIssues.length === 0 ? (
            <div className="py-4 text-center text-xs text-zinc-500">
              No other open issues found inside this repository.
            </div>
          ) : (
            otherIssues.map((issue) => (
              <div key={issue.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-foreground hover:underline">
                    <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                      #{issue.number} - {issue.title}
                    </a>
                  </h4>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {issue.labels.slice(0, 3).map((lbl: any) => (
                      <span
                        key={lbl.id}
                        className="text-[8px] px-1 border border-border text-zinc-400 uppercase font-black"
                      >
                        {lbl.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 font-bold text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {issue.comments} comments</span>
                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 border border-foreground bg-black text-[9px] uppercase hover:text-primary flex items-center gap-0.5"
                  >
                    DISCUSS ↗
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
