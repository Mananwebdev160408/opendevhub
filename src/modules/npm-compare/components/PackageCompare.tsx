"use client"

import * as React from "react"
import { Search, Loader2, Plus, X, BarChart3, HelpCircle, Check, Award, ShieldAlert, BookOpen, ExternalLink } from "lucide-react"

interface PackageData {
  name: string
  description: string
  version: string
  license: string
  downloads: number
  homepage: string
  repoUrl: string
  dependenciesCount: number
  size?: string // Bundlephobia size
}

const PRESETS = [
  ["react", "vue", "angular"],
  ["lodash", "ramda"],
  ["zod", "yup", "superstruct"],
  ["zustand", "redux", "recoil"],
  ["tailwind", "bootstrap", "bulma"]
]

export function PackageCompare() {
  const [packages, setPackages] = React.useState<string[]>(["react", "vue"])
  const [compareData, setCompareData] = React.useState<Record<string, PackageData>>({})
  const [loading, setLoading] = React.useState<Record<string, boolean>>({})
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [inputVal, setInputVal] = React.useState("")

  const fetchPackageData = async (name: string) => {
    const cleanName = name.trim().toLowerCase()
    if (!cleanName) return

    setLoading(prev => ({ ...prev, [cleanName]: true }))
    setErrors(prev => ({ ...prev, [cleanName]: "" }))

    try {
      // 1. Fetch registry metadata
      const registryPromise = fetch(`https://registry.npmjs.org/${cleanName}/latest`)
        .then(async res => {
          if (!res.ok) {
            if (res.status === 404) throw new Error("Package not found")
            throw new Error("Failed to load details")
          }
          return res.json()
        })

      // 2. Fetch weekly downloads
      const downloadsPromise = fetch(`https://api.npmjs.org/downloads/point/last-week/${cleanName}`)
        .then(async res => {
          if (!res.ok) return { downloads: 0 }
          return res.json()
        })
        .catch(() => ({ downloads: 0 }))

      // 3. Fetch bundle size (optional / best effort)
      const sizePromise = fetch(`https://bundlephobia.com/api/size?package=${cleanName}`)
        .then(async res => {
          if (!res.ok) return { size: null }
          return res.json()
        })
        .catch(() => ({ size: null }))

      const [registry, downloadsRes, sizeRes] = await Promise.all([
        registryPromise,
        downloadsPromise,
        sizePromise
      ])

      // Extract github repo url
      let repoUrl = ""
      if (registry.repository) {
        if (typeof registry.repository === "string") {
          repoUrl = registry.repository
        } else if (registry.repository.url) {
          repoUrl = registry.repository.url
        }
      }
      repoUrl = repoUrl
        .replace(/^git\+/, "")
        .replace(/\.git$/, "")
        .replace(/^git:\/\//, "https://")

      // Format bundle size
      let sizeStr = "N/A"
      if (sizeRes && sizeRes.size) {
        const kb = sizeRes.size / 1024
        sizeStr = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(1)} KB`
      }

      const dependenciesCount = registry.dependencies ? Object.keys(registry.dependencies).length : 0

      const data: PackageData = {
        name: registry.name,
        description: registry.description || "No description provided.",
        version: registry.version,
        license: registry.license || "N/A",
        downloads: downloadsRes.downloads || 0,
        homepage: registry.homepage || "",
        repoUrl: repoUrl,
        dependenciesCount,
        size: sizeStr
      }

      setCompareData(prev => ({ ...prev, [cleanName]: data }))
    } catch (err: any) {
      console.error(err)
      setErrors(prev => ({ ...prev, [cleanName]: err.message || "Failed to load package info" }))
    } finally {
      setLoading(prev => ({ ...prev, [cleanName]: false }))
    }
  }

  // Load initial packages
  React.useEffect(() => {
    packages.forEach(pkg => {
      if (!compareData[pkg]) {
        fetchPackageData(pkg)
      }
    })
  }, [packages])

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault()
    const name = inputVal.trim().toLowerCase()
    if (!name) return

    if (packages.includes(name)) {
      setInputVal("")
      return
    }

    if (packages.length >= 3) {
      // Limit to 3 packages for comparison table space
      alert("You can compare up to 3 packages side-by-side.")
      return
    }

    setPackages(prev => [...prev, name])
    setInputVal("")
  }

  const handleRemovePackage = (name: string) => {
    setPackages(prev => prev.filter(p => p !== name))
    setCompareData(prev => {
      const copy = { ...prev }
      delete copy[name]
      return copy
    })
  }

  const loadPreset = (preset: string[]) => {
    setPackages(preset)
    // Clear errors and data for non-preset packages to save state
    setCompareData({})
    setErrors({})
  }

  // Find the package with max downloads to highlight
  const maxDownloadsPackage = React.useMemo(() => {
    let max = -1
    let winner = ""
    packages.forEach(pkg => {
      const data = compareData[pkg]
      if (data && data.downloads > max) {
        max = data.downloads
        winner = pkg
      }
    })
    return winner
  }, [packages, compareData])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          REGISTRY INSIGHTS
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span>NPM PACKAGE COMPARATOR</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Conduct side-by-side comparisons of Node.js modules. Analyze download trends, bundle sizing estimates, external dependency footprints, and package licensing directly from NPM registry telemetry.
        </p>
      </div>

      {/* Input Toolbar */}
      <div className="border-4 border-foreground bg-zinc-950 p-4 sm:p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] text-left space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <form onSubmit={handleAddPackage} className="flex-1 w-full flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Type npm package name (e.g. zod, lodash)..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-black border-2 border-foreground text-foreground pl-9 pr-3 py-2 font-mono text-xs focus:outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 border-2 border-foreground bg-accent text-accent-foreground px-4 py-2 font-black text-xs hover:bg-opacity-90 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>COMPARE</span>
            </button>
          </form>

          {/* Active packages count limit tag */}
          <span className="text-[10px] text-zinc-500 font-bold bg-zinc-900 border border-zinc-800 px-3 py-2 shrink-0">
            {packages.length} / 3 PACKAGES SELECTED
          </span>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-900 items-center">
          <span className="text-[9px] font-black text-zinc-500 uppercase mr-2">Compare Presets:</span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset)}
              className="px-2.5 py-1 border border-zinc-800 text-[9px] font-black text-zinc-400 hover:text-white hover:border-zinc-600 transition-all uppercase"
            >
              {preset.join(" vs ")}
            </button>
          ))}
        </div>
      </div>

      {/* Compare table / column layouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkgName) => {
          const isLoading = loading[pkgName]
          const errorMsg = errors[pkgName]
          const data = compareData[pkgName]
          const isWinner = maxDownloadsPackage === pkgName && packages.length > 1

          return (
            <div
              key={pkgName}
              className={`border-4 border-foreground bg-zinc-950 p-5 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all flex flex-col justify-between relative ${
                isWinner ? "border-accent shadow-[6px_6px_0px_0px_var(--accent)]" : ""
              }`}
            >
              {/* Winner badge */}
              {isWinner && (
                <div className="absolute -top-3.5 left-4 bg-accent text-accent-foreground border-2 border-foreground px-2 py-0.5 text-[8px] font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Award className="h-3 w-3" />
                  <span>MOST DOWNLOADS</span>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => handleRemovePackage(pkgName)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-white border border-transparent hover:border-zinc-800 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="text-left space-y-5">
                {/* Name */}
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-foreground break-all uppercase tracking-tight pr-6">
                    {pkgName}
                  </h3>
                  {data && (
                    <span className="inline-block text-[9px] font-bold text-zinc-500 bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
                      v{data.version}
                    </span>
                  )}
                </div>

                {isLoading && (
                  <div className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent mb-2" />
                    <p className="text-[10px] text-zinc-500">Querying registry telemetry...</p>
                  </div>
                )}

                {errorMsg && (
                  <div className="py-12 text-center border-2 border-dashed border-red-900/60 bg-red-950/20 p-4">
                    <ShieldAlert className="h-6 w-6 mx-auto text-red-500 mb-2" />
                    <p className="text-[10px] text-red-400 font-bold mb-1 uppercase">Error loading data</p>
                    <p className="text-[9px] text-zinc-500">{errorMsg}</p>
                  </div>
                )}

                {!isLoading && !errorMsg && data && (
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans min-h-[44px]">
                      {data.description}
                    </p>

                    {/* Stats List */}
                    <div className="space-y-2.5 pt-4 border-t border-zinc-900">
                      {/* Weekly Downloads */}
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500 font-bold uppercase">Weekly Downloads</span>
                        <span className="font-black text-white">
                          {data.downloads.toLocaleString()}
                        </span>
                      </div>

                      {/* License */}
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500 font-bold uppercase">License</span>
                        <span className="font-black text-accent bg-accent/10 px-1 border border-accent/20">
                          {data.license}
                        </span>
                      </div>

                      {/* Dependency Footprint */}
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500 font-bold uppercase">Dependencies</span>
                        <span className={`font-black ${data.dependenciesCount > 10 ? "text-amber-500" : "text-green-500"}`}>
                          {data.dependenciesCount}
                        </span>
                      </div>

                      {/* Size */}
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500 font-bold uppercase">Minified Size</span>
                        <span className="font-black text-white">
                          {data.size}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Links */}
              {!isLoading && !errorMsg && data && (
                <div className="flex gap-2.5 pt-5 border-t border-zinc-900 mt-6 text-[10px]">
                  {data.repoUrl && (
                    <a
                      href={data.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-1.5 border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors uppercase font-bold flex items-center justify-center gap-1"
                    >
                      <span>Repository</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                  {data.homepage && (
                    <a
                      href={data.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-1.5 border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors uppercase font-bold flex items-center justify-center gap-1"
                    >
                      <span>Homepage</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Empty state placeholder column to invite search */}
        {packages.length < 3 && (
          <div className="border-4 border-dashed border-zinc-800 bg-zinc-950/20 p-8 flex flex-col items-center justify-center min-h-[380px] text-center select-none">
            <Plus className="h-8 w-8 text-zinc-700 mb-3" />
            <h4 className="text-xs font-black text-zinc-500 uppercase mb-1">Add Another Package</h4>
            <p className="text-[10px] text-zinc-600 leading-normal max-w-[180px] font-sans">
              Enter name in search bar above to inspect up to 3 side-by-side modules.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
