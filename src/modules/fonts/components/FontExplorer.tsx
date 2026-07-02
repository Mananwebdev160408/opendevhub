"use client"

import * as React from "react"
import { Search, Type, Copy, Check, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react"

interface FontItem {
  name: string
  family: string
}

const FALLBACK_FONTS: FontItem[] = [
  { name: "Inter", family: "'Inter', sans-serif" },
  { name: "Playfair Display", family: "'Playfair Display', serif" },
  { name: "Fira Code", family: "'Fira Code', monospace" },
  { name: "Lobster", family: "'Lobster', display" },
  { name: "Outfit", family: "'Outfit', sans-serif" },
  { name: "JetBrains Mono", family: "'JetBrains Mono', monospace" },
  { name: "Lora", family: "'Lora', serif" },
  { name: "Bungee", family: "'Bungee', display" },
  { name: "Montserrat", family: "'Montserrat', sans-serif" },
  { name: "Space Mono", family: "'Space Mono', monospace" },
  { name: "Merriweather", family: "'Merriweather', serif" },
  { name: "Syncopate", family: "'Syncopate', display" },
  { name: "Cinzel", family: "'Cinzel', serif" },
  { name: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif" },
  { name: "Source Code Pro", family: "'Source Code Pro', monospace" },
  { name: "Space Grotesk", family: "'Space Grotesk', sans-serif" }
]

export function FontExplorer() {
  const [fontList, setFontList] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [previewText, setPreviewText] = React.useState("OpenDev Hub: Neo-Brutalist Developer ecosystem.")
  const [fontSize, setFontSize] = React.useState<number>(32)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [activeFontModal, setActiveFontModal] = React.useState<string | null>(null)
  const [copiedType, setCopiedType] = React.useState<string | null>(null)

  const itemsPerPage = 12

  // Fetch full list of Google Fonts dynamically
  React.useEffect(() => {
    async function loadFonts() {
      try {
        const res = await fetch("https://cdn.jsdelivr.net/gh/hasinhayder/google-fonts/fonts.json")
        if (!res.ok) throw new Error("Failed to fetch fonts catalog")
        const data = await res.json()
        if (data && Array.isArray(data.fonts) && data.fonts.length > 0) {
          setFontList(data.fonts)
        } else if (Array.isArray(data) && data.length > 0) {
          setFontList(data)
        } else {
          throw new Error("Invalid format received")
        }
      } catch (err) {
        console.error("Failed to load online Google Fonts catalog, loading fallback list...", err)
        setFontList(FALLBACK_FONTS.map(f => f.name))
      } finally {
        setLoading(false)
      }
    }
    loadFonts()
  }, [])

  // Filter fonts list
  const filteredFonts = React.useMemo(() => {
    if (!searchQuery.trim()) return fontList
    const query = searchQuery.toLowerCase()
    return fontList.filter(name => name.toLowerCase().includes(query))
  }, [fontList, searchQuery])

  // Reset page on search change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Paginated fonts
  const totalPages = Math.max(1, Math.ceil(filteredFonts.length / itemsPerPage))
  const paginatedFonts = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredFonts.slice(start, start + itemsPerPage)
  }, [filteredFonts, currentPage])

  // Inject stylesheets for only the currently visible fonts on the page
  React.useEffect(() => {
    if (paginatedFonts.length === 0) return

    const linkId = "google-fonts-dynamic-sheet"
    let linkElement = document.getElementById(linkId) as HTMLLinkElement | null

    const fontQuery = paginatedFonts.map(name => name.replace(/ /g, "+")).join("&family=")
    const url = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`

    if (!linkElement) {
      linkElement = document.createElement("link")
      linkElement.id = linkId
      linkElement.rel = "stylesheet"
      document.head.appendChild(linkElement)
    }
    linkElement.href = url
  }, [paginatedFonts])

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 1500)
  }

  const getHTMLCode = (name: string) => {
    const nameParam = name.replace(/ /g, "+")
    return `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=${nameParam}&display=swap" rel="stylesheet">`
  }

  const getCSSCode = (name: string) => {
    const nameParam = name.replace(/ /g, "+")
    return `@import url('https://fonts.googleapis.com/css2?family=${nameParam}&display=swap');`
  }

  const getFamilyCode = (name: string) => {
    return `font-family: '${name}', sans-serif;`
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          TYPOGRAPHY STUDIO
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Type className="h-6 w-6 text-primary" />
          <span>FONTS & TYPOGRAPHY EXPLORER</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Preview all 1600+ Google Web Fonts dynamically. Enter custom test text, adjust sizes on the fly, search the entire global catalog, and instantly copy-paste code imports.
        </p>
      </div>

      {/* Control panel */}
      <div className="border-4 border-foreground bg-zinc-950 p-4 sm:p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Custom preview text input */}
          <div className="md:col-span-6 space-y-2">
            <label className="text-[10px] font-black uppercase text-accent tracking-wider block">
              Custom Preview Text
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value || "OpenDev Hub: Neo-Brutalist Developer ecosystem.")}
              className="w-full bg-black border-2 border-foreground text-foreground px-3 py-2 font-mono text-xs focus:outline-none focus:border-accent"
              placeholder="Type anything to test typography..."
            />
          </div>

          {/* Size slider */}
          <div className="md:col-span-3 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-accent tracking-wider">
              <span>Font Size</span>
              <span className="text-white">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-3 py-1">
              <input
                type="range"
                min="16"
                max="80"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-accent h-1 bg-zinc-800 rounded-none cursor-pointer"
              />
            </div>
          </div>

          {/* Search fonts */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-[10px] font-black uppercase text-accent tracking-wider block">
              Search {fontList.length > 0 ? fontList.length : "all"} Google Fonts
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Font name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border-2 border-foreground text-foreground pl-9 pr-3 py-2 font-mono text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="border-4 border-foreground bg-zinc-950 p-24 text-center shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent mb-3" />
          <p className="text-xs text-zinc-400 font-black uppercase">Loading google fonts database...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Grid showing fonts */}
          {filteredFonts.length === 0 ? (
            <div className="border-4 border-foreground bg-zinc-950 p-16 text-center shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
              <Type className="h-8 w-8 mx-auto text-zinc-700 mb-3" />
              <h3 className="text-sm font-black text-foreground uppercase mb-1">No fonts found</h3>
              <p className="text-xs text-zinc-500">No matching Google Fonts were discovered for "{searchQuery}".</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedFonts.map((name) => (
                  <div
                    key={name}
                    className="border-2 border-foreground bg-zinc-950 p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_var(--accent)] transition-all text-left"
                  >
                    {/* Header info */}
                    <div className="flex justify-between items-start border-b border-zinc-900 pb-3 mb-4 select-none">
                      <div>
                        <h3 className="text-sm font-black text-foreground">{name}</h3>
                        <span className="text-[9px] text-zinc-500 uppercase">
                          Google Web Font
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveFontModal(name)}
                        className="px-2.5 py-1 border border-foreground bg-black text-accent hover:text-white font-black text-[9px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,1)]"
                      >
                        Use Font
                      </button>
                    </div>

                    {/* Preview Box */}
                    <div className="flex-1 py-4 overflow-hidden">
                      <p
                        style={{ fontFamily: `'${name}', sans-serif`, fontSize: `${fontSize}px`, lineHeight: 1.25 }}
                        className="text-foreground transition-all truncate"
                      >
                        {previewText}
                      </p>
                    </div>

                    {/* Sample preview small */}
                    <div className="text-[10px] text-zinc-500 font-sans italic opacity-75 mt-3 select-none">
                      abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center bg-zinc-950 border-2 border-foreground p-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] select-none">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1 border border-foreground bg-black text-white hover:text-accent font-black text-xs disabled:opacity-30 disabled:pointer-events-none shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>PREV</span>
                  </button>
                  <span className="text-xs text-zinc-400 font-bold">
                    PAGE {currentPage} OF {totalPages} ({filteredFonts.length} FONTS FOUND)
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-3 py-1 border border-foreground bg-black text-white hover:text-accent font-black text-xs disabled:opacity-30 disabled:pointer-events-none shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center gap-1 cursor-pointer"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Code Modal */}
      {activeFontModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-zinc-950 border-4 border-foreground shadow-[8px_8px_0px_0px_var(--accent)] p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setActiveFontModal(null)}
              className="absolute top-4 right-4 border-2 border-foreground bg-black text-white hover:text-accent p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-accent uppercase tracking-widest">
                  INTEGRATION CODES
                </span>
                <h3 className="text-xl font-black uppercase text-white">
                  {activeFontModal}
                </h3>
                <p className="text-[10px] text-zinc-500">
                  Google Web Font
                </p>
              </div>

              {/* HTML Link option */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-zinc-400">1. HTML Link Tag (Paste in &lt;head&gt;)</span>
                  <button
                    onClick={() => handleCopy(getHTMLCode(activeFontModal), "html")}
                    className="flex items-center gap-1 text-accent hover:underline"
                  >
                    {copiedType === "html" ? "Copied!" : "Copy code"}
                    {copiedType === "html" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <pre className="bg-black border border-zinc-800 p-2.5 text-[9px] text-zinc-300 font-mono overflow-x-auto select-all">
                  <code>{getHTMLCode(activeFontModal)}</code>
                </pre>
              </div>

              {/* CSS Import option */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-zinc-400">2. CSS @import (Paste in stylesheet)</span>
                  <button
                    onClick={() => handleCopy(getCSSCode(activeFontModal), "css")}
                    className="flex items-center gap-1 text-accent hover:underline"
                  >
                    {copiedType === "css" ? "Copied!" : "Copy code"}
                    {copiedType === "css" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <pre className="bg-black border border-zinc-800 p-2.5 text-[9px] text-zinc-300 font-mono overflow-x-auto select-all">
                  <code>{getCSSCode(activeFontModal)}</code>
                </pre>
              </div>

              {/* CSS Rule option */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-zinc-400">3. CSS Rule (Apply style)</span>
                  <button
                    onClick={() => handleCopy(getFamilyCode(activeFontModal), "family")}
                    className="flex items-center gap-1 text-accent hover:underline"
                  >
                    {copiedType === "family" ? "Copied!" : "Copy code"}
                    {copiedType === "family" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <pre className="bg-black border border-zinc-800 p-2.5 text-[9px] text-zinc-300 font-mono overflow-x-auto select-all">
                  <code>{getFamilyCode(activeFontModal)}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
