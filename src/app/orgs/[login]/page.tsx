import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Building2, ExternalLink, Globe, Star, GitFork, Info } from "lucide-react"
import organizationsData from "../../../../data/organizations.json"

export const revalidate = 86400

export async function generateStaticParams() {
  return []
}

interface PageProps {
  params: Promise<{ login: string }>
}

async function fetchOrgDetails(login: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
  }

  const res = await fetch(`https://api.github.com/orgs/${login}`, {
    headers,
    next: { revalidate: 86400 }
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch org from GitHub: ${res.statusText}`)
  }
  const org = await res.json()

  const reposRes = await fetch(`https://api.github.com/orgs/${login}/repos?sort=stars&per_page=6`, {
    headers,
    next: { revalidate: 86400 }
  })
  let repos = []
  if (reposRes.ok) {
    repos = await reposRes.json()
  }

  return { org, repos }
}

export default async function OrgDetailsPage({ params }: PageProps) {
  const { login } = await params

  const seedOrg = organizationsData.find(o => o.login.toLowerCase() === login.toLowerCase())

  let orgData
  let repos: any[] = []
  let isFallback = false

  try {
    const result = await fetchOrgDetails(login)
    orgData = result.org
    repos = result.repos
  } catch (e) {
    console.warn("Failed to fetch live org details, using local seed file:", e)
    if (!seedOrg) {
      notFound()
    }
    orgData = {
      login: seedOrg.login,
      name: seedOrg.name,
      description: seedOrg.description,
      blog: seedOrg.website,
      html_url: seedOrg.githubLink,
      avatar_url: `https://github.com/${seedOrg.login}.png`,
      public_repos: seedOrg.popularProjects.length,
      followers: seedOrg.stars
    }
    repos = seedOrg.popularProjects.map(proj => ({
      id: proj,
      name: proj,
      full_name: `${seedOrg.login}/${proj}`,
      description: `Popular repository built by ${seedOrg.name}`,
      stargazers_count: Math.floor(seedOrg.stars / seedOrg.popularProjects.length),
      forks_count: Math.floor(seedOrg.stars / 10),
      language: seedOrg.languages[0],
      html_url: `https://github.com/${seedOrg.login}/${proj}`
    }))
    isFallback = true
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      <Link
        href="/orgs"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900 transition-all select-none cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>BACK TO ORGANIZATIONS</span>
      </Link>

      <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_var(--accent)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          ORGANIZATION PROFILE
        </div>

        {isFallback && (
          <div className="mb-4 border-2 border-yellow-500 bg-yellow-950/20 text-yellow-400 p-2 text-[10px] font-bold uppercase flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0" />
            <span>GitHub API limit hit / offline. Displaying local cache data.</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <img
            src={orgData.avatar_url}
            alt={orgData.name || orgData.login}
            className="w-20 h-20 border-4 border-foreground bg-zinc-800 shadow-[3px_3px_0px_0px_#ffffff] shrink-0"
          />
          <div>
            <span className="text-[10px] bg-accent text-accent-foreground border border-foreground px-2.5 py-0.5 font-black uppercase tracking-wider">
              {seedOrg ? seedOrg.category : "FOUNDATION / TEAM"}
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-foreground uppercase tracking-tight mt-2 break-all">
              {orgData.name || orgData.login}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Github Node Identifier: @{orgData.login}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-6 border-l-4 border-primary pl-4 bg-zinc-950/40 py-2">
          {orgData.description || "No public organization description available."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_var(--primary)] space-y-3 font-bold text-xs">
          <h3 className="text-xs font-black uppercase text-primary border-b border-zinc-800 pb-2">VITAL SPECS</h3>
          <div className="flex justify-between">
            <span className="text-zinc-500">PUBLIC REPOS</span>
            <span>{orgData.public_repos}</span>
          </div>
          {orgData.followers !== undefined && (
            <div className="flex justify-between">
              <span className="text-zinc-500">FOLLOWERS</span>
              <span>{orgData.followers.toLocaleString()}</span>
            </div>
          )}
          {orgData.location && (
            <div className="flex justify-between">
              <span className="text-zinc-500">LOCATION</span>
              <span className="truncate max-w-[120px]">{orgData.location}</span>
            </div>
          )}
        </div>

        <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_#ffffff] space-y-3 font-bold text-xs">
          <h3 className="text-xs font-black uppercase text-foreground border-b border-zinc-800 pb-2">NETWORK</h3>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">WEBSITE</span>
            {orgData.blog ? (
              <a href={orgData.blog} target="_blank" rel="noopener noreferrer" className="text-accent underline truncate max-w-[120px] flex items-center gap-0.5">
                Visit <Globe className="h-3 w-3" />
              </a>
            ) : (
              <span>NONE</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">GITHUB LINK</span>
            <a href={orgData.html_url || `https://github.com/${orgData.login}`} target="_blank" rel="noopener noreferrer" className="text-primary underline flex items-center gap-0.5">
              Source <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_var(--accent)] space-y-3 font-bold text-xs">
          <h3 className="text-xs font-black uppercase text-accent border-b border-zinc-800 pb-2">CORE TECHNOLOGIES</h3>
          <p className="text-[10px] text-zinc-400 font-normal leading-relaxed">
            Main programming languages and framework structures heavily maintained by this organization.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {seedOrg ? seedOrg.languages.map(lang => (
              <span key={lang} className="text-[9px] border border-border px-2 py-0.5 bg-black text-zinc-300">
                {lang}
              </span>
            )) : (
              <span className="text-[9px] text-zinc-500 font-bold uppercase">NOT SPECIFIED</span>
            )}
          </div>
        </div>

      </div>

      <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_#ffffff] hover:translate-y-[-2px] transition-all">
        <div className="bg-zinc-900 border-b-2 border-foreground p-4 font-mono font-bold flex items-center justify-between bg-stripes-pattern select-none">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-accent" />
            <span>POPULAR REPOSITORIES BY THIS ORG ({repos.length})</span>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.length === 0 ? (
            <div className="col-span-full py-4 text-center text-xs text-zinc-500">
              No repositories visible or available for this organization right now.
            </div>
          ) : (
            repos.map((repo) => (
              <div 
                key={repo.id}
                className="border-2 border-border p-4 bg-zinc-950 hover:border-foreground transition-all flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-foreground hover:underline">
                    <Link href={`/repos/${orgData.login}/${repo.name}`}>
                      {repo.name}
                    </Link>
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {repo.description || "No project overview description available."}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-zinc-900 flex items-center justify-between text-[9px] text-zinc-500 font-bold">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400">★ {repo.stargazers_count.toLocaleString()}</span>
                    <span>⑂ {repo.forks_count.toLocaleString()}</span>
                  </div>
                  {repo.language && (
                    <span className="text-accent">{repo.language}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
