import { ApiList } from "@/modules/api-directory"
import { Metadata } from "next"
import apisDataFallback from "../../../data/apis.json"

export const metadata: Metadata = {
  title: "Public APIs Directory - OpenDev Hub",
  description: "Browse curated developer-friendly APIs with authorization schemes, limits, and docs.",
}

interface PublicApi {
  name: string
  category: string
  description: string
  rateLimit: string
  authentication: string
  freeTier: string
  website: string
  documentation: string
}

async function getApis(): Promise<PublicApi[]> {
  try {
    const res = await fetch("https://public-api-lists.github.io/public-api-lists/api/all.json", {
      next: { revalidate: 86400 } // Cache for 24 hours
    })
    if (!res.ok) {
      throw new Error("Failed to fetch public APIs database.")
    }
    const data = await res.json()
    const rawEntries = data.entries || []
    
    return rawEntries.map((api: any) => ({
      name: api.name || api.API || "Unknown API",
      category: api.category || api.Category || "Other",
      description: api.description || api.Description || "No description available.",
      rateLimit: api.cors ? `CORS: ${api.cors.toUpperCase()}` : (api.Cors ? `CORS: ${api.Cors.toUpperCase()}` : "CORS: UNKNOWN"),
      authentication: api.auth || api.Auth || "NONE",
      freeTier: "YES",
      website: api.url || api.Link || "https://github.com",
      documentation: api.url || api.Link || "https://github.com"
    }))
  } catch (err) {
    console.error("Could not load dynamic public APIs database:", err)
    return apisDataFallback.map(a => ({
      name: a.name,
      category: a.category,
      description: a.description,
      rateLimit: a.rateLimit,
      authentication: a.authentication,
      freeTier: a.freeTier,
      website: a.website,
      documentation: a.documentation
    }))
  }
}

export default async function ApisPage() {
  const apis = await getApis()
  return (
    <div className="w-full bg-background min-h-screen">
      <ApiList initialApis={apis} />
    </div>
  )
}
