// Core service for interacting with the GitHub REST API.
// Implements direct client-side fetching with support for process.env.GITHUB_TOKEN when run on the server side.

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
  // Custom mapped field for the UI
  repo_name?: string
  repo_owner?: string
}

const BASE_URL = "https://api.github.com"

function getHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }
  
  // On the server-side, include the environment token if available
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
  
  const queryParts = [q]
  const queryString = encodeURIComponent(queryParts.join(" "))
  const sortParam = sort ? `&sort=${sort}&order=${order}` : ""
  const url = `${BASE_URL}/search/repositories?q=${queryString}${sortParam}&page=${page}&per_page=${perPage}`

  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 } // Cache results for 1 hour on server-side
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
  const url = `${BASE_URL}/repos/${owner}/${name}`
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 86400 } // Cache repo details for 24 hours on server-side
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
}): Promise<{ items: GithubIssue[]; total_count: number }> {
  const { q, page = 1, perPage = 20 } = params
  const queryString = encodeURIComponent(q)
  const url = `${BASE_URL}/search/issues?q=${queryString}&page=${page}&per_page=${perPage}`

  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 1800 } // Cache issue lists for 30 minutes on server-side
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`GitHub issues search query failed: ${res.statusText} (${res.status}). Details: ${errText}`)
  }

  const data = await res.json()
  const items = (data.items || []).map((issue: any) => {
    // Extract owner/repo name from repository_url
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
