import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")
  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 })
  }

  const targetUrl = new URL(`https://api.github.com/${path}`)
  searchParams.forEach((value, key) => {
    if (key !== "path") {
      targetUrl.searchParams.set(key, value)
    }
  })

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
  }

  try {
    const res = await fetch(targetUrl.toString(), {
      headers,
      next: { revalidate: 3600 }
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API responded with status ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
