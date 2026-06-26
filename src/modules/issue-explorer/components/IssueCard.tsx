"use client"

import { GithubIssue } from "@/core/services/github"
import { MessageSquare, Calendar, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface IssueCardProps {
  issue: GithubIssue
}

export function IssueCard({ issue }: IssueCardProps) {
  let formattedDate = ""
  try {
    formattedDate = formatDistanceToNow(new Date(issue.updated_at), { addSuffix: true })
  } catch (e) {
    formattedDate = issue.updated_at.split("T")[0]
  }

  return (
    <div className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-y-[-2px] transition-all flex flex-col justify-between h-full font-mono">
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-[10px] bg-zinc-900 border border-border px-2 py-0.5 text-accent font-bold uppercase tracking-wider truncate max-w-[200px]">
            {issue.repo_owner && issue.repo_name ? `${issue.repo_owner}/${issue.repo_name}` : "Repository"}
          </span>
          <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-1 shrink-0">
            <Calendar className="h-3 w-3 shrink-0" />
            {formattedDate}
          </span>
        </div>

        <h3 className="text-xs sm:text-sm font-black text-foreground hover:text-primary hover:underline mt-3 select-none leading-snug">
          <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
            #{issue.number} - {issue.title}
          </a>
        </h3>

        {issue.labels && issue.labels.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1">
            {issue.labels.slice(0, 5).map((label) => (
              <span
                key={label.id}
                style={{ 
                  borderColor: label.color ? `#${label.color}` : "#262626",
                  color: label.color ? `#${label.color}` : "#a1a1aa"
                }}
                className="text-[9px] border px-2 py-0.5 bg-black font-bold"
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
          <MessageSquare className="h-3.5 w-3.5 text-primary" />
          <span>{issue.comments} comments</span>
        </div>

        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] font-black uppercase text-foreground hover:bg-accent hover:text-accent-foreground border-2 border-foreground px-2 py-1 shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1 cursor-pointer bg-black"
        >
          SOLVE ISSUE <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
