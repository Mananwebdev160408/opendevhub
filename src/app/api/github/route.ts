import { NextResponse } from "next/server"
import { getCache, setCache, Cache } from "@/lib/cache-service"
import { connectToDatabase } from "@/lib/mongodb"
import trendingFallback from "../../../../data/trending-repositories.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")
  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 })
  }

  // Construct target URL
  const targetUrl = new URL(`https://api.github.com/${path}`)
  searchParams.forEach((value, key) => {
    if (key !== "path") {
      targetUrl.searchParams.set(key, value)
    }
  })

  // Determine TTL (6 hours for trending repos, 1 hour for others)
  const isTrending = path === "search/repositories" && (targetUrl.searchParams.get("q")?.includes("created:") ?? false)
  const ttlSeconds = isTrending ? 21600 : 3600

  // Create sorting-safe cache key
  const sortedParams = Array.from(targetUrl.searchParams.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  const cacheKey = `github:${targetUrl.pathname}?${sortedParams.map(([k, v]) => `${k}=${v}`).join("&")}`

  // 1. Try reading from MongoDB Cache
  try {
    const cachedData = await getCache(cacheKey, ttlSeconds)
    if (cachedData) {
      console.log(`[Cache Hit] Serving cached response for key: ${cacheKey}`)
      return NextResponse.json(cachedData)
    }
  } catch (err) {
    console.error("MongoDB Cache check failed, trying live fetch...", err)
  }

  // 2. Fetch live data from GitHub API
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
  }

  try {
    const res = await fetch(targetUrl.toString(), {
      headers,
    })

    if (res.ok) {
      const data = await res.json()
      // Async save to cache
      setCache(cacheKey, data).catch((err) =>
        console.error(`Failed to update cache for ${cacheKey}:`, err)
      )
      return NextResponse.json(data)
    }

    console.warn(`GitHub API responded with status ${res.status}. Checking expired cache fallback...`)
  } catch (err: any) {
    console.error("GitHub API fetch error:", err)
  }

  // 3. Fallback to expired cache from MongoDB (if exists)
  try {
    await connectToDatabase()
    const expiredRecord = await Cache.findOne({ key: cacheKey }).lean()
    if (expiredRecord && expiredRecord.value) {
      console.log(`[Expired Cache Fallback] Serving expired cached data for ${cacheKey}`)
      return NextResponse.json(expiredRecord.value)
    }
  } catch (dbErr) {
    console.error("Failed to fetch expired cache from MongoDB:", dbErr)
  }

  // 4. Fallback to static local datasets
  if (isTrending) {
    console.warn("Serving static local trending repositories fallback.")
    const items = trendingFallback.map((item: any) => ({
      id: Math.floor(Math.random() * 1000000),
      name: item.name,
      full_name: `${item.owner}/${item.name}`,
      owner: {
        login: item.owner,
        avatar_url: `https://github.com/${item.owner}.png`,
        html_url: `https://github.com/${item.owner}`,
      },
      description: item.description,
      html_url: `https://github.com/${item.owner}/${item.name}`,
      stargazers_count: item.stars,
      forks_count: item.forks,
      watchers_count: item.stars,
      open_issues_count: 0,
      language: item.language,
      license: item.license ? { key: item.license, name: item.license, spdx_id: item.license } : null,
      updated_at: new Date().toISOString(),
    }))

    return NextResponse.json({
      items,
      total_count: items.length,
    })
  }

  return NextResponse.json(
    { error: "Service temporarily unavailable. Rate limit hit and no cache available." },
    { status: 503 }
  )
}
