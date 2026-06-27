import { ApiList } from "@/modules/api-directory"
import { Metadata } from "next"
import apisDataFallback from "../../../data/apis.json"
import { connectToDatabase } from "@/lib/mongodb"
import { ApiModel } from "@/lib/cache-service"

export const dynamic = "force-dynamic"

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
  // 1. Try to load from MongoDB Atlas
  try {
    await connectToDatabase()
    const dbApis = await ApiModel.find({}).lean()
    
    if (dbApis && dbApis.length > 0) {
      console.log(`[APIs DB Hit] Retrieved ${dbApis.length} APIs from MongoDB.`)
      return dbApis.map((api: any) => ({
        name: api.name,
        category: api.category,
        description: api.description,
        rateLimit: api.rateLimit,
        authentication: api.authentication,
        freeTier: api.freeTier,
        website: api.website,
        documentation: api.documentation
      }))
    }

    console.log("[APIs Cache Empty] Seeding APIs database from remote database...")
  } catch (err) {
    console.error("MongoDB APIs load failed, trying remote live fetch...", err)
  }

  // 2. Fetch live list to seed/fallback
  try {
    const res = await fetch("https://public-api-lists.github.io/public-api-lists/api/all.json")
    if (!res.ok) {
      throw new Error("Failed to fetch public APIs database.")
    }
    const data = await res.json()
    const rawEntries = data.entries || []
    
    const mapped = rawEntries.map((api: any) => ({
      name: api.name || api.API || "Unknown API",
      category: api.category || api.Category || "Other",
      description: api.description || api.Description || "No description available.",
      rateLimit: api.cors ? `CORS: ${api.cors.toUpperCase()}` : (api.Cors ? `CORS: ${api.Cors.toUpperCase()}` : "CORS: UNKNOWN"),
      authentication: api.auth || api.Auth || "NONE",
      freeTier: "YES",
      website: api.url || api.Link || "https://github.com",
      documentation: api.url || api.Link || "https://github.com"
    }))

    // Save to MongoDB Atlas in bulk asynchronously
    if (mapped.length > 0) {
      connectToDatabase().then(() => {
        ApiModel.insertMany(mapped)
          .then(() => console.log(`[APIs DB Seeding] Successfully seeded ${mapped.length} APIs.`))
          .catch(err => console.error("Failed to seed APIs into database:", err))
      }).catch(err => console.error("Database connection failed during seeding:", err))
    }

    return mapped
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
