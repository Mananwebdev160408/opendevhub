"use client"

import Link from "next/link"
import { 
  Search, 
  GitPullRequest, 
  TrendingUp, 
  Building, 
  Wrench, 
  BookOpen, 
  Globe, 
  Calendar 
} from "lucide-react"

export function DeepDive() {
  const capabilities = [
    {
      icon: <Search className="h-5 w-5 text-accent" />,
      title: "Repository Explorer",
      desc: "Perform comprehensive queries across GitHub repositories. Apply multi-layered filters including stars, forks, licenses, and primary code languages with speed.",
      link: "/repos"
    },
    {
      icon: <GitPullRequest className="h-5 w-5 text-primary" />,
      title: "Good First Issues",
      desc: "Lowering barriers to open source. We crawl GitHub for documentation, feature, and bug labels flagged as beginner-friendly difficulty for immediate contributions.",
      link: "/issues"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-400" />,
      title: "Trending Radar",
      desc: "Stay ahead of software shifts. Track daily, weekly, and monthly trending code bases sorted by stargazers and developers active across specific language topics.",
      link: "/trending"
    },
    {
      icon: <Building className="h-5 w-5 text-white" />,
      title: "Organizations Index",
      desc: "Explore public codebases owned by industry leaders like Vercel, Meta, and Google, alongside popular open-source collectives driving modern infrastructure.",
      link: "/orgs"
    },
    {
      icon: <Wrench className="h-5 w-5 text-accent" />,
      title: "Developer Toolbox",
      desc: "A suite of 32+ utilities running 100% locally in your browser cache. Format JSON, decode JWT payloads, generate cryptographically secure hashes or UUIDs with zero latency.",
      link: "/tools"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: "Cheatsheets & Status Codes",
      desc: "Read interactive visual maps for Git branching, stashing, and cherry-picking, alongside detailed reference sheets for all standard HTTP Status Codes.",
      link: "/git-cheatsheets"
    },
    {
      icon: <Globe className="h-5 w-5 text-green-400" />,
      title: "Public API Hub",
      desc: "Browse a catalog of free developer APIs. Categorized by authorization types, request rate limits, and SSL support to kickstart your next frontend prototype.",
      link: "/apis"
    },
    {
      icon: <Calendar className="h-5 w-5 text-white" />,
      title: "Open Source Programs",
      desc: "Never miss deadlines for community initiatives. Follow eligibility requirements, dates, and documentation links for Hacktoberfest, GSOC, MLH, and Outreachy.",
      link: "/events"
    }
  ]

  return (
    <section className="w-full min-h-[100vh] border-t-4 border-foreground py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950 bg-checkered-pattern flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block border-2 border-foreground bg-primary text-primary-foreground font-mono text-xs font-black px-3 py-1 uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            [ PLATFORM CAPABILITIES ]
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl font-black uppercase text-foreground">
            Complete Control Deck <br />
            <span className="text-accent bg-foreground px-2 py-0.5 inline-block mt-2">for developers.</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
            OpenDev Hub packs multiple utility directories, exploration modules, reference guides, and student timelines in a single interface. Every tool is built static-first for fast indexing and zero load bottlenecks.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, idx) => (
            <div 
              key={idx} 
              className="border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 border-2 border-foreground bg-black flex items-center justify-center">
                  {cap.icon}
                </div>
                <h3 className="font-mono text-sm font-black uppercase tracking-tight text-foreground">
                  {cap.title}
                </h3>
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                  {cap.desc}
                </p>
              </div>
              
              <div className="mt-5 pt-3 border-t border-border/60">
                <Link 
                  href={cap.link} 
                  className="inline-flex items-center gap-1 font-mono text-[10px] font-black uppercase text-accent hover:underline"
                >
                  Launch Module ↗
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
