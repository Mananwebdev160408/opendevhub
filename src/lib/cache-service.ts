import { connectToDatabase } from "./mongodb"
import mongoose, { Schema } from "mongoose"

// ----------------------------------------------------
// Schemas & Models
// ----------------------------------------------------

const CacheSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
})

export const Cache = mongoose.models.Cache || mongoose.model("Cache", CacheSchema)

const ApiSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  rateLimit: { type: String, required: true },
  authentication: { type: String, required: true },
  freeTier: { type: String, required: true },
  website: { type: String, required: true },
  documentation: { type: String, required: true }
})

export const ApiModel = mongoose.models.Api || mongoose.model("Api", ApiSchema)

const ImportantDateSchema = new Schema({
  event: { type: String, required: true },
  date: { type: String, required: true }
})

const EventSchema = new Schema({
  name: { type: String, required: true, unique: true },
  timeline: { type: String, required: true },
  eligibility: { type: String, required: true },
  website: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, default: "Open Source" },
  region: { type: String, required: true, default: "Online" },
  source: { type: String, required: true, default: "Local Curation" },
  importantDates: [ImportantDateSchema],
  updatedAt: { type: Date, default: Date.now }
})

export const EventModel = mongoose.models.Event || mongoose.model("Event", EventSchema)

// ----------------------------------------------------
// Helper Caching Functions
// ----------------------------------------------------

export async function getCache(key: string, ttlSeconds: number): Promise<any | null> {
  try {
    await connectToDatabase()
    const record = await Cache.findOne({ key }).lean()
    if (!record) {
      return null
    }
    const ageSeconds = (Date.now() - new Date(record.updatedAt).getTime()) / 1000
    if (ageSeconds > ttlSeconds) {
      console.log(`Cache expired for key: ${key}`)
      return null
    }
    return record.value
  } catch (err) {
    console.error(`MongoDB read error for key: ${key}. Safely falling back...`, err)
    return null
  }
}

export async function setCache(key: string, value: any): Promise<void> {
  try {
    await connectToDatabase()
    await Cache.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true }
    )
  } catch (err) {
    console.error(`MongoDB write error for key: ${key}. Safely continuing...`, err)
  }
}

export async function fetchWithCache(url: string, headers: any, ttlSeconds: number): Promise<any> {
  const cacheKey = `github:${url}`
  
  // 1. Try reading from MongoDB Cache
  try {
    const cachedData = await getCache(cacheKey, ttlSeconds)
    if (cachedData) {
      console.log(`[Server Cache Hit] Serving cached response for key: ${cacheKey}`)
      return cachedData
    }
  } catch (err) {
    console.error("MongoDB Cache check failed, trying live fetch...", err)
  }

  // 2. Fetch live data
  try {
    const res = await fetch(url, { headers })
    if (res.ok) {
      const data = await res.json()
      // Async save to cache
      setCache(cacheKey, data).catch((err) =>
        console.error(`Failed to update cache for ${cacheKey}:`, err)
      )
      return data
    }
    console.warn(`Fetch returned non-OK status: ${res.status}. Checking expired cache fallback...`)
  } catch (err) {
    console.error("Fetch error:", err)
  }

  // 3. Fallback to expired cache
  try {
    await connectToDatabase()
    const expiredRecord = await Cache.findOne({ key: cacheKey }).lean()
    if (expiredRecord && expiredRecord.value) {
      console.log(`[Server Expired Cache Fallback] Serving expired cached data for ${cacheKey}`)
      return expiredRecord.value
    }
  } catch (dbErr) {
    console.error("Failed to fetch expired cache from MongoDB:", dbErr)
  }

  throw new Error(`Failed to fetch and no cache available for ${url}`)
}
