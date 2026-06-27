
export interface GithubRepo {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
    html_url: string
  }
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  language: string | null
  license: {
    key: string
    name: string
    spdx_id: string
  } | null
  updated_at: string
  topics?: string[]
}

export interface GithubIssue {
  id: number
  number: number
  title: string
  html_url: string
  state: string
  comments: number
  created_at: string
  updated_at: string
  labels: {
    id: number
    name: string
    color: string
    description: string
  }[]
  repository_url: string
  body: string | null
  user: {
    login: string
    avatar_url: string
  }
  repo_name?: string
  repo_owner?: string
}

const BASE_URL = "https://api.github.com"

function getHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }
  
  if (typeof window === "undefined" && process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
  }
  
  return headers
}

export async function searchRepositories(params: {
  q: string
  sort?: "stars" | "forks" | "updated"
  order?: "asc" | "desc"
  page?: number
  perPage?: number
}): Promise<{ items: GithubRepo[]; total_count: number }> {
  const { q, sort, order = "desc", page = 1, perPage = 20 } = params
  
  const queryParams: Record<string, string | number> = {
    q,
    page,
    per_page: perPage
  }
  if (sort) {
    queryParams.sort = sort
    queryParams.order = order
  }
  const url = getFetchUrl("search/repositories", queryParams)

  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 }
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`GitHub search query failed: ${res.statusText} (${res.status}). Details: ${errText}`)
  }

  const data = await res.json()
  return {
    items: data.items || [],
    total_count: data.total_count || 0
  }
}

export async function getRepository(owner: string, name: string): Promise<GithubRepo> {
  const url = getFetchUrl(`repos/${owner}/${name}`)
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 86400 }
  })

  if (!res.ok) {
    throw new Error(`GitHub getRepository failed: ${res.statusText} (${res.status})`)
  }

  return res.json()
}

export async function searchIssues(params: {
  q: string
  page?: number
  perPage?: number
  sort?: string
  order?: "asc" | "desc"
}): Promise<{ items: GithubIssue[]; total_count: number }> {
  const { q, page = 1, perPage = 20, sort, order = "desc" } = params
  const queryParams: Record<string, string | number> = {
    q,
    page,
    per_page: perPage
  }
  if (sort) {
    queryParams.sort = sort
    queryParams.order = order
  }
  const url = getFetchUrl("search/issues", queryParams)

  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 1800 }
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`GitHub issues search query failed: ${res.statusText} (${res.status}). Details: ${errText}`)
  }

  const data = await res.json()
  const items = (data.items || []).map((issue: any) => {
    // repository_url format: https://api.github.com/repos/owner/name
    const parts = issue.repository_url.split("/repos/")
    if (parts.length > 1) {
      const repoParts = parts[1].split("/")
      issue.repo_owner = repoParts[0]
      issue.repo_name = repoParts[1]
    }
    return issue as GithubIssue
  })

  return {
    items,
    total_count: data.total_count || 0
  }
}

export async function getTrendingRepositories(params: {
  timeRange: "daily" | "weekly" | "monthly"
  language?: string
  sort?: "stars" | "forks"
  page?: number
  perPage?: number
}): Promise<{ items: GithubRepo[]; total_count: number }> {
  const { timeRange, language, sort = "stars", page = 1, perPage = 20 } = params

  const date = new Date()
  if (timeRange === "daily") {
    date.setDate(date.getDate() - 2)
  } else if (timeRange === "weekly") {
    date.setDate(date.getDate() - 7)
  } else {
    date.setDate(date.getDate() - 30)
  }

  const dateStr = date.toISOString().split("T")[0]
  let q = `created:>${dateStr}`

  if (language && language !== "ALL") {
    q += ` language:${language}`
  }

  return searchRepositories({
    q,
    sort: sort,
    order: "desc",
    page,
    perPage
  })
}

export async function getRepositoryReadme(owner: string, name: string): Promise<string> {
  const url = getFetchUrl(`repos/${owner}/${name}/readme`)
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 86400 }
  })

  if (!res.ok) {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${name}/master/README.md`
    const rawRes = await fetch(rawUrl)
    if (rawRes.ok) return rawRes.text()
    
    const mainRawUrl = `https://raw.githubusercontent.com/${owner}/${name}/main/README.md`
    const mainRawRes = await fetch(mainRawUrl)
    if (mainRawRes.ok) return mainRawRes.text()

    throw new Error(`Failed to retrieve README from GitHub API or raw branch paths.`)
  }

  const data = await res.json()
  if (data.encoding === "base64" && data.content) {
    const cleaned = data.content.replace(/\s/g, "")
    try {
      if (typeof window === "undefined") {
        return Buffer.from(cleaned, "base64").toString("utf-8")
      } else {
        const binaryString = atob(cleaned)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        return new TextDecoder("utf-8").decode(bytes)
      }
    } catch (e) {
      console.error("Base64 decode failed, using raw fallback:", e)
    }
  }

  return ""
}
function getFetchUrl(path: string, queryParams?: Record<string, string | number>) {
  if (typeof window !== "undefined") {
    const url = new URL("/api/github", window.location.origin)
    url.searchParams.set("path", path)
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, val]) => {
        url.searchParams.set(key, String(val))
      })
    }
    return url.toString()
  }
  
  const url = new URL(`https://api.github.com/${path}`)
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, val]) => {
      url.searchParams.set(key, String(val))
    })
  }
  return url.toString()
}

export async function searchOrganizations(params: {
  q: string
  page?: number
  perPage?: number
}): Promise<{ items: any[]; total_count: number }> {
  const { q, page = 1, perPage = 10 } = params
  
  let queryParts = []
  if (!q.trim()) {
    queryParts.push("type:org")
  } else {
    queryParts.push(`${q} type:org`)
  }
  const queryString = queryParts.join(" ")
  const sortParam = !q.trim() ? "followers" : ""
  const orderParam = !q.trim() ? "desc" : ""

  const queryParams: Record<string, string | number> = {
    q: queryString,
    page,
    per_page: perPage
  }
  if (sortParam) queryParams.sort = sortParam
  if (orderParam) queryParams.order = orderParam

  const url = getFetchUrl("search/users", queryParams)

  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 }
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`GitHub organization search failed: ${res.statusText} (${res.status}). Details: ${errText}`)
  }

  const data = await res.json()
  return {
    items: data.items || [],
    total_count: data.total_count || 0
  }
}

export async function getOrganizationDetails(login: string): Promise<any> {
  const url = getFetchUrl(`orgs/${login}`)
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 86400 }
  })

  if (!res.ok) {
    throw new Error(`GitHub getOrganizationDetails failed: ${res.statusText} (${res.status})`)
  }

  return res.json()
}


