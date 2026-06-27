import { fetchWithCache } from "@/lib/cache-service"
import { GithubRepo, GithubIssue } from "./github"

const BASE_URL = "https://api.github.com"

function getHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }
  
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
  }
  
  return headers
}

export async function getRepository(owner: string, name: string): Promise<GithubRepo> {
  const url = `${BASE_URL}/repos/${owner}/${name}`
  return fetchWithCache(url, getHeaders(), 3600) // 1-hour TTL
}

export async function searchIssues(params: {
  q: string
  page?: number
  perPage?: number
  sort?: string
  order?: "asc" | "desc"
}): Promise<{ items: GithubIssue[]; total_count: number }> {
  const { q, page = 1, perPage = 20, sort, order = "desc" } = params
  
  const targetUrl = new URL(`${BASE_URL}/search/issues`)
  targetUrl.searchParams.set("q", q)
  targetUrl.searchParams.set("page", String(page))
  targetUrl.searchParams.set("per_page", String(perPage))
  if (sort) {
    targetUrl.searchParams.set("sort", sort)
    targetUrl.searchParams.set("order", order)
  }

  const data = await fetchWithCache(targetUrl.toString(), getHeaders(), 3600) // 1-hour TTL

  const items = (data.items || []).map((issue: any) => {
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
