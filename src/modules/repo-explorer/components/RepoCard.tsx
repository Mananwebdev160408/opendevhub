"use client"

import Link from "next/link"
import { Star, GitFork, AlertCircle, Calendar, ExternalLink } from "lucide-react"
import { GithubRepo } from "@/core/services/github"
import { formatDistanceToNow } from "date-fns"

interface RepoCardProps {
  repo: GithubRepo
}

export function RepoCard({ repo }: RepoCardProps) {
  // Format the updated date cleanly
  let formattedDate = ""
  try {
    formattedDate = formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })
  } catch (e) {
    formattedDate = repo.updated_at.split("T")[0]
  }

  return (
    <div className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all flex flex-col justify-between h-full font-mono">
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-[10px] bg-zinc-900 border border-border px-2 py-0.5 text-accent font-bold uppercase tracking-wider">
            {repo.language || "Unknown"}
          </span>
          <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-1">
            <Calendar className="h-3 w-3 shrink-0" />
            {formattedDate}
          </span>
        </div>

        <h3 className="text-sm font-black text-foreground hover:text-primary hover:underline mt-3 select-none break-all">
          <Link href={`/repos/${repo.owner.login}/${repo.name}`}>
            {repo.owner.login} / {repo.name}
          </Link>
        </h3>

        <p className="text-[11px] text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
          {repo.description || "No description provided for this repository."}
        </p>

        {repo.topics && repo.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {repo.topics.slice(0, 4).map((topic) => (
              <span key={topic} className="text-[8px] bg-zinc-950 border border-border text-zinc-400 px-1 py-0.5 font-bold">
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500">
          <span className="flex items-center gap-0.5 text-yellow-400">
            <Star className="h-3 w-3 fill-yellow-400" />
            {repo.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-0.5 text-zinc-400">
            <GitFork className="h-3 w-3" />
            {repo.forks_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-0.5 text-red-400">
            <AlertCircle className="h-3 w-3" />
            {repo.open_issues_count.toLocaleString()}
          </span>
        </div>

        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] font-black uppercase text-foreground hover:text-accent flex items-center gap-0.5 border border-foreground/30 px-1.5 py-0.5 bg-black"
        >
          GITHUB <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>
    </div>
  )
}
