"use client"

import * as React from "react"
import Link from "next/link"
import { Building2, Search, ExternalLink, ArrowRight, Info } from "lucide-react"

// Curated list of 10 organization handles
const ORG_HANDLES = [
  "vercel",
  "supabase",
  "docker",
  "facebook",
  "google",
  "microsoft",
  "tailwindlabs",
  "hashicorp",
  "apache",
  "automattic"
]

// Local metadata fallback registry for 10 organizations
const ORG_METADATA: Record<
  string,
  {
    category: string;
    popularProjects: string[];
    languages: string[];
    website: string;
    githubLink: string;
    fallbackName: string;
    fallbackDesc: string;
  }
> = {
  vercel: {
    category: "Frontend & Serverless",
    popularProjects: ["next.js", "hyper", "swr", "turbopack"],
    languages: ["TypeScript", "Rust", "JavaScript", "Go"],
    website: "https://vercel.com",
    githubLink: "https://github.com/vercel",
    fallbackName: "Vercel",
    fallbackDesc: "Vercel provides the developer experience and infrastructure to build, deploy, and scale the web."
  },
  supabase: {
    category: "Backend & Database",
    popularProjects: ["supabase", "postgrest-js", "realtime", "auth-helpers"],
    languages: ["TypeScript", "Go", "PostgreSQL", "Rust"],
    website: "https://supabase.com",
    githubLink: "https://github.com/supabase",
    fallbackName: "Supabase",
    fallbackDesc: "Supabase is an open source Firebase alternative. It provides a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage."
  },
  docker: {
    category: "DevOps & Infrastructure",
    popularProjects: ["cli", "compose", "buildx"],
    languages: ["Go", "Shell", "TypeScript"],
    website: "https://docker.com",
    githubLink: "https://github.com/docker",
    fallbackName: "Docker",
    fallbackDesc: "Docker is a platform designed to help developers build, share, and run modern applications using container technology."
  },
  facebook: {
    category: "Big Tech / Frameworks",
    popularProjects: ["react", "react-native", "pytorch", "docusaurus"],
    languages: ["JavaScript", "TypeScript", "C++", "Python"],
    website: "https://opensource.fb.com",
    githubLink: "https://github.com/facebook",
    fallbackName: "Meta Open Source",
    fallbackDesc: "Meta's open-source projects, ranging from React to PyTorch, power some of the world's largest apps."
  },
  google: {
    category: "Big Tech / Frameworks",
    popularProjects: ["material-design-lite", "gson", "guava", "zx"],
    languages: ["Java", "C++", "Python", "TypeScript"],
    website: "https://opensource.google.com",
    githubLink: "https://github.com/google",
    fallbackName: "Google Open Source",
    fallbackDesc: "Google Open Source brings the best of Google to open source and the best of open source to Google."
  },
  microsoft: {
    category: "Big Tech / Frameworks",
    popularProjects: ["vscode", "typescript", "terminal", "playwright"],
    languages: ["TypeScript", "C++", "C#", "JavaScript"],
    website: "https://opensource.microsoft.com",
    githubLink: "https://github.com/microsoft",
    fallbackName: "Microsoft Open Source",
    fallbackDesc: "Microsoft Open Source is committed to open source development, developer communities, and partnerships."
  },
  tailwindlabs: {
    category: "Frontend & Styling",
    popularProjects: ["tailwindcss", "headlessui", "heroicons"],
    languages: ["TypeScript", "JavaScript", "HTML"],
    website: "https://tailwindcss.com",
    githubLink: "https://github.com/tailwindlabs",
    fallbackName: "Tailwind Labs",
    fallbackDesc: "Creators of Tailwind CSS, Headless UI, Heroicons, and Refactoring UI."
  },
  hashicorp: {
    category: "DevOps & Infrastructure",
    popularProjects: ["terraform", "vault", "consul", "nomad"],
    languages: ["Go", "HCL", "TypeScript"],
    website: "https://hashicorp.com",
    githubLink: "https://github.com/hashicorp",
    fallbackName: "HashiCorp",
    fallbackDesc: "HashiCorp provides infrastructure automation software for multi-cloud environments."
  },
  apache: {
    category: "Foundations & Ecosystems",
    popularProjects: ["spark", "kafka", "hadoop", "airflow"],
    languages: ["Java", "Python", "Scala", "C++"],
    website: "https://apache.org",
    githubLink: "https://github.com/apache",
    fallbackName: "Apache Software Foundation",
    fallbackDesc: "The Apache Software Foundation provides organizational, legal, and financial support for a broad range of open-source software projects."
  },
  automattic: {
    category: "Web & Publishing",
    popularProjects: ["wp-calypso", "jetpack", "woocommerce"],
    languages: ["JavaScript", "PHP", "TypeScript"],
    website: "https://automattic.com",
    githubLink: "https://github.com/automattic",
    fallbackName: "Automattic",
    fallbackDesc: "We are the people behind WordPress.com, WooCommerce, Jetpack, Tumblr, Simplenote, and more."
  }
}

interface OrgDetails {
  login: string
  name: string
  description: string
  avatar_url: string
  public_repos: number
  followers: number | null
  website: string
  category: string
  popularProjects: string[]
  languages: string[]
  isFallback: boolean
}

export function OrgExplorer() {
  const [query, setQuery] = React.useState("")
  const [orgs, setOrgs] = React.useState<OrgDetails[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [rateLimited, setRateLimited] = React.useState(false)

  React.useEffect(() => {
    let active = true

    async function loadOrgs() {
      try {
        const fetchedOrgs = await Promise.all(
          ORG_HANDLES.map(async (login) => {
            try {
              const res = await fetch(`https://api.github.com/orgs/${login}`, {
                headers: {
                  Accept: "application/vnd.github.v3+json",
                }
              })
              
              if (res.status === 403 || res.status === 429) {
                setRateLimited(true)
              }

              if (!res.ok) {
                throw new Error(`Status ${res.status}`)
              }

              const data = await res.json()
              return {
                login,
                name: data.name || ORG_METADATA[login].fallbackName,
                description: data.description || ORG_METADATA[login].fallbackDesc,
                avatar_url: data.avatar_url || `https://github.com/${login}.png`,
                public_repos: data.public_repos,
                followers: data.followers,
                website: data.blog || ORG_METADATA[login].website,
                category: ORG_METADATA[login].category,
                popularProjects: ORG_METADATA[login].popularProjects,
                languages: ORG_METADATA[login].languages,
                isFallback: false
              }
            } catch (err) {
              console.warn(`Failed to fetch live data for org ${login}:`, err)
              return {
                login,
                name: ORG_METADATA[login].fallbackName,
                description: ORG_METADATA[login].fallbackDesc,
                avatar_url: `https://github.com/${login}.png`,
                public_repos: ORG_METADATA[login].popularProjects.length,
                followers: null,
                website: ORG_METADATA[login].website,
                category: ORG_METADATA[login].category,
                popularProjects: ORG_METADATA[login].popularProjects,
                languages: ORG_METADATA[login].languages,
                isFallback: true
              }
            }
          })
        )

        if (active) {
          setOrgs(fetchedOrgs)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Critical error fetching organizations:", err)
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadOrgs()

    return () => {
      active = false
    }
  }, [])

  const filteredOrgs = React.useMemo(() => {
    return orgs.filter(org => 
      org.name.toLowerCase().includes(query.toLowerCase()) ||
      org.login.toLowerCase().includes(query.toLowerCase()) ||
      org.description.toLowerCase().includes(query.toLowerCase()) ||
      org.category.toLowerCase().includes(query.toLowerCase())
    )
  }, [orgs, query])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Title block */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          REGISTRY // ORGANIZATIONS
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-accent" />
          <span>OPEN-SOURCE ORGANIZATIONS</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Browse prominent tech organizations, framework creators, and open-source foundations driving modern software infrastructure.
        </p>
      </div>

      {/* Rate limit warning banner */}
      {rateLimited && (
        <div className="mb-8 border-2 border-yellow-500 bg-yellow-950/20 text-yellow-400 p-4 text-xs font-bold uppercase flex items-center gap-3 shadow-[4px_4px_0px_0px_#eab308]">
          <Info className="h-5 w-5 shrink-0 text-yellow-500" />
          <div>
            <p className="font-black text-sm">GITHUB API RATE LIMIT REACHED / OFFLINE</p>
            <p className="text-[10px] text-yellow-400/80 mt-1 font-normal select-none">
              DISPLAYING CACHED SYSTEM SPECIFICATIONS AND LOCAL PROFILES.
            </p>
          </div>
        </div>
      )}

      {/* Search board */}
      <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--accent)] mb-8">
        <div className="relative border-2 border-foreground bg-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus-within:shadow-[3px_3px_0px_0px_var(--accent)] transition-all">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by organization name, description, or focus category..."
            className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between animate-pulse"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="h-5 w-24 bg-zinc-800 border border-zinc-700" />
                  <div className="h-4 w-32 bg-zinc-800" />
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="w-12 h-12 border-2 border-zinc-700 bg-zinc-800 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-5 w-32 bg-zinc-800" />
                    <div className="h-3 w-16 bg-zinc-800" />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="h-4 w-full bg-zinc-800" />
                  <div className="h-4 w-5/6 bg-zinc-800" />
                </div>

                {/* Popular Projects Skeleton */}
                <div className="mt-5">
                  <div className="h-3 w-20 bg-zinc-800" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-5 w-14 bg-zinc-800" />
                    <div className="h-5 w-16 bg-zinc-800" />
                    <div className="h-5 w-12 bg-zinc-800" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div className="h-4 w-16 bg-zinc-800" />
                <div className="h-7 w-24 bg-zinc-800 border border-zinc-700" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid of Orgs */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredOrgs.map((org) => (
            <div
              key={org.login}
              className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[10px] bg-zinc-900 border border-border px-2 py-0.5 text-accent font-black uppercase tracking-wider">
                    {org.category}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase">
                    {org.public_repos} REPOS • {org.followers !== null ? `${org.followers.toLocaleString()} FOLLOWERS` : "CACHED"}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <img
                    src={org.avatar_url}
                    alt={org.name}
                    className="w-12 h-12 border-2 border-foreground bg-zinc-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                      {org.name}
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-bold">
                      @{org.login}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4 line-clamp-3 leading-relaxed">
                  {org.description}
                </p>

                {/* Popular Projects */}
                <div className="mt-4">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">KEY PROJECTS:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {org.popularProjects.map(proj => (
                      <Link
                        key={proj}
                        href={`/repos/${org.login}/${proj}`}
                        className="text-[9px] border border-border bg-black text-zinc-300 px-2 py-0.5 font-bold uppercase hover:text-accent hover:border-accent"
                      >
                        {proj}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Main Languages */}
                <div className="mt-4">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">LANGUAGES USED:</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {org.languages.map(lang => (
                      <span
                        key={lang}
                        className="text-[8.5px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 font-semibold"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-border flex items-center justify-between font-bold text-xs">
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-foreground flex items-center gap-1 hover:underline"
                >
                  Website <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <Link
                  href={`/orgs/${org.login}`}
                  className="px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#ffffff] hover:bg-zinc-900 flex items-center gap-1 hover:shadow-[2px_2px_0px_0px_var(--primary)] transition-all cursor-pointer"
                >
                  ORG SPECS <ArrowRight className="h-3.5 w-3.5 text-accent animate-pulse" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
