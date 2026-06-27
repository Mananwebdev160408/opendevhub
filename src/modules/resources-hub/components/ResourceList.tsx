"use client"

import * as React from "react"
import { Search, Library, ExternalLink, Globe, BookOpen, ArrowLeft, Loader2, Sparkles } from "lucide-react"
import { marked } from "marked"
import { getRepositoryReadme } from "@/core/services/github"
import resourcesData from "../../../../data/resources.json"

export function ResourceList() {
  const [query, setQuery] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("ALL")
  
  const [importOwner, setImportOwner] = React.useState("")
  const [importRepo, setImportRepo] = React.useState("")
  const [readerContent, setReaderContent] = React.useState<string | null>(null)
  const [isImporting, setIsImporting] = React.useState(false)
  const [importError, setImportError] = React.useState<string | null>(null)

  const categories = ["ALL", "React", "TypeScript", "System Design", "Next.js", "Linux"]

  const filteredResources = React.useMemo(() => {
    return resourcesData.filter(res => {
      const matchQuery = res.title.toLowerCase().includes(query.toLowerCase()) || 
                          res.description.toLowerCase().includes(query.toLowerCase())
      const matchCat = activeCategory === "ALL" || res.category.toLowerCase() === activeCategory.toLowerCase()
      return matchQuery && matchCat
    })
  }, [query, activeCategory])

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importOwner.trim() || !importRepo.trim()) return

    setIsImporting(true)
    setImportError(null)
    setReaderContent(null)

    try {
      const readmeMarkdown = await getRepositoryReadme(importOwner.trim(), importRepo.trim())
      const htmlContent = await marked.parse(readmeMarkdown)
      setReaderContent(htmlContent)
    } catch (err: any) {
      console.error(err)
      setImportError(err.message || "Failed to retrieve or parse GitHub README. Check repository name and try again.")
    } finally {
      setIsImporting(false)
    }
  }

  const handleExitReader = () => {
    setReaderContent(null)
    setImportError(null)
  }

  const handlePresetImport = async (owner: string, repo: string) => {
    setImportOwner(owner)
    setImportRepo(repo)
    setIsImporting(true)
    setImportError(null)
    setReaderContent(null)

    try {
      const readmeMarkdown = await getRepositoryReadme(owner, repo)
      const htmlContent = await marked.parse(readmeMarkdown)
      setReaderContent(htmlContent)
    } catch (err: any) {
      console.error(err)
      setImportError("Failed to import presets.")
    } finally {
      setIsImporting(false)
    }
  }

  if (readerContent) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          <button
            onClick={handleExitReader}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900 transition-all cursor-pointer w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>EXIT DOCUMENT READER</span>
          </button>
          
          <div className="bg-primary text-primary-foreground border-2 border-foreground px-3 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_var(--accent)] w-fit">
            SOURCE: GITHUB://{importOwner.toUpperCase()}/{importRepo.toUpperCase()}
          </div>
        </div>

        <div className="border-4 border-foreground bg-card p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
          <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
            INTEGRATED READER
          </div>
          
          <div 
            className="markdown-reader-content prose prose-invert max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: readerContent }}
          />
        </div>

        <button
          onClick={handleExitReader}
          className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-foreground bg-zinc-950 text-foreground font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-900 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>RETURN TO DIRECTORY</span>
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          RESOURCES HUB
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Library className="h-6 w-6 text-accent" />
          <span>CURATED LEARNING RESOURCES</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Curated learning paths, coding specs, and documentation to build solid fundamentals. Or import any public GitHub README repository directly!
        </p>
      </div>

      <div className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--accent)] relative overflow-hidden">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          DOCS IMPORTER
        </div>
        <h3 className="text-sm font-black text-foreground uppercase flex items-center gap-1.5 mb-4">
          <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          <span>IMPORT GITHUB DOCUMENTATION READER</span>
        </h3>
        
        <form onSubmit={handleImportSubmit} className="flex flex-col sm:flex-row items-end gap-4 max-w-3xl">
          <div className="w-full sm:w-1/3 space-y-1">
            <label className="text-[10px] text-zinc-500 font-bold uppercase">GITHUB OWNER / ORG</label>
            <input 
              type="text"
              placeholder="e.g. sindresorhus"
              value={importOwner}
              onChange={(e) => setImportOwner(e.target.value)}
              className="w-full h-10 border-2 border-foreground bg-black text-xs px-3 font-bold text-foreground placeholder:text-zinc-700 focus:border-primary focus:outline-none"
            />
          </div>
          <div className="w-full sm:w-1/3 space-y-1">
            <label className="text-[10px] text-zinc-500 font-bold uppercase">REPOSITORY NAME</label>
            <input 
              type="text"
              placeholder="e.g. awesome-nodejs"
              value={importRepo}
              onChange={(e) => setImportRepo(e.target.value)}
              className="w-full h-10 border-2 border-foreground bg-black text-xs px-3 font-bold text-foreground placeholder:text-zinc-700 focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isImporting}
            className="w-full sm:w-auto h-10 px-6 border-2 border-foreground bg-accent text-accent-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-accent-foreground" />
                <span>IMPORTING...</span>
              </>
            ) : (
              <span>IMPORT & READ</span>
            )}
          </button>
        </form>

        {importError && (
          <div className="mt-4 border-2 border-red-500 bg-red-950/20 text-red-400 p-2.5 text-xs font-bold uppercase">
            ⚠️ {importError}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center gap-3">
          <span className="text-[9px] text-zinc-500 font-bold uppercase">POPULAR DOCS:</span>
          <button
            onClick={() => handlePresetImport("sindresorhus", "awesome-nodejs")}
            className="text-[9px] border border-border px-2 py-0.5 hover:border-accent hover:text-accent font-bold"
          >
            sindresorhus/awesome-nodejs
          </button>
          <button
            onClick={() => handlePresetImport("enaqx", "awesome-react")}
            className="text-[9px] border border-border px-2 py-0.5 hover:border-accent hover:text-accent font-bold"
          >
            enaqx/awesome-react
          </button>
          <button
            onClick={() => handlePresetImport("vhf", "free-programming-books")}
            className="text-[9px] border border-border px-2 py-0.5 hover:border-accent hover:text-accent font-bold"
          >
            vhf/free-programming-books
          </button>
        </div>
      </div>

      <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--primary)] space-y-4">
        <div className="relative border-2 border-foreground bg-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus-within:shadow-[2px_2px_0px_0px_var(--accent)] transition-all">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search learning resources by title or topic keywords..."
            className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 select-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 border-2 text-[10px] font-black uppercase cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
                  : "border-zinc-800 hover:border-foreground hover:bg-zinc-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredResources.map((res) => (
          <div
            key={res.title}
            className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] bg-zinc-900 border border-border px-2 py-0.5 text-accent font-black uppercase tracking-wider">
                  {res.category}
                </span>
                <span className={`text-[9px] border px-2 py-0.5 font-bold uppercase ${
                  res.difficulty.includes("Beginner") 
                    ? "border-green-800 bg-green-950/20 text-green-400" 
                    : res.difficulty.includes("Advanced") 
                    ? "border-red-800 bg-red-950/20 text-red-400" 
                    : "border-yellow-800 bg-yellow-950/20 text-yellow-400"
                }`}>
                  {res.difficulty}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight mt-4">
                {res.title}
              </h3>
              
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {res.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-border flex items-center justify-between font-bold text-xs select-none">
              <span className="text-zinc-500 text-[10px]">CURATED DIRECTORY</span>

              <a
                href={res.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#ffffff] hover:bg-zinc-900 flex items-center gap-1 hover:shadow-[2px_2px_0px_0px_var(--accent)] transition-all cursor-pointer"
              >
                STUDY GUIDE <BookOpen className="h-3.5 w-3.5 text-accent" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
