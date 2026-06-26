import { Metadata } from "next"
import { ExternalLink, Terminal, Rss, ArrowRight } from "lucide-react"
import newsData from "../../../data/news.json"

export const metadata: Metadata = {
  title: "Developer News Archive - OpenDev Hub",
  description: "Read curated updates on framework releases, compiler logs, and TypeScript changes.",
}

export default function NewsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          FEED // DEVELOPER RELEASES
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Rss className="h-6 w-6 text-primary" />
          <span>DEVELOPER NEWS STREAM</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Direct logs, engine updates, and framework notifications parsed from curated RSS feeds and announcements, updated hourly.
        </p>
      </div>

      {/* List of articles */}
      <div className="space-y-6">
        {newsData.map((item) => (
          <div
            key={item.id}
            className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-primary text-primary-foreground border border-foreground px-2 py-0.5 font-bold uppercase">
                  {item.category}
                </span>
                <span className="text-[10px] text-zinc-500 font-bold">{item.date}</span>
                <span className="text-[9px] text-accent font-bold uppercase">// SOURCE: {item.source}</span>
              </div>
              <h3 className="text-base font-black text-foreground uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
            
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border-2 border-foreground bg-zinc-950 text-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#ffffff] hover:bg-zinc-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#ffffff] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 align-self-start"
            >
              READ FULL ARTICLE <ExternalLink className="h-4 w-4 text-accent" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
