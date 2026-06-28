"use client"

import * as React from "react"
import { Terminal, AlertTriangle, Search } from "lucide-react"
import cheatsheetsData from "../../../../data/git-cheatsheets.json"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-2 py-0.5 border text-[9px] font-bold uppercase transition-all duration-150 cursor-pointer ${
        copied
          ? "bg-accent text-accent-foreground border-foreground scale-95"
          : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-foreground hover:border-foreground"
      }`}
    >
      {copied ? "COPIED!" : "COPY"}
    </button>
  )
}

export function GitCheats() {
  const [activeCategory, setActiveCategory] = React.useState("ALL")
  const [searchQuery, setSearchQuery] = React.useState("")

  const categories = React.useMemo(() => {
    return ["ALL", ...cheatsheetsData.map(c => c.category)]
  }, [])

  const filteredData = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return cheatsheetsData
      .map(catGroup => {
        const matchedCommands = catGroup.commands.filter(c => {
          const matchesSearch = !query || 
            c.cmd.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.syntax.toLowerCase().includes(query) ||
            c.example.toLowerCase().includes(query) ||
            (c.mistake && c.mistake.toLowerCase().includes(query))

          return matchesSearch
        })

        return {
          ...catGroup,
          commands: matchedCommands
        }
      })
      .filter(catGroup => {
        const matchesCategory = activeCategory === "ALL" || catGroup.category === activeCategory
        return matchesCategory && catGroup.commands.length > 0
      })
  }, [activeCategory, searchQuery])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          GITHUB CHEATSHEET
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-accent" />
          <span>GITHUB UNIVERSAL CHEATSHEET & TROUBLESHOOTING</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          A definitive, searchable index of core Git operations and solutions to common workflow issues. Filter by category, search errors, and copy clean snippets instantly.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative border-2 border-foreground bg-zinc-950 p-2 shadow-[3px_3px_0px_0px_var(--primary)] flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
          <input
            type="text"
            placeholder="Search commands, syntaxes, examples, pitfalls, or problems (e.g. 'wrong branch', 'undo commit', 'checkout')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-zinc-600 font-mono py-1.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-zinc-500 hover:text-foreground cursor-pointer px-2"
            >
              CLEAR
            </button>
          )}
        </div>

        <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--accent)] flex flex-wrap gap-2 select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase cursor-pointer transition-all ${
                activeCategory === cat
                  ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
                  : "border-zinc-800 hover:border-foreground hover:bg-zinc-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {searchQuery && (
        <div className="text-xs text-zinc-500 font-bold uppercase select-none">
          SEARCH RESULTS FOR: "{searchQuery}"
        </div>
      )}

      <div className="space-y-12">
        {filteredData.map((catGroup) => (
          <div key={catGroup.category} className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary border-b-2 border-foreground pb-2 flex items-center justify-between">
              <span>{catGroup.category}</span>
              <span className="text-[10px] text-zinc-600 font-bold">
                {catGroup.commands.length} {catGroup.commands.length === 1 ? "ENTRY" : "ENTRIES"}
              </span>
            </h3>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {catGroup.commands.map((c) => (
                <div
                  key={c.cmd}
                  className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-xs font-black text-foreground bg-zinc-900 px-2 py-0.5 border border-border">
                        {c.cmd}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">{catGroup.category}</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {c.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase">SYNTAX:</span>
                        <CopyButton text={c.syntax} />
                      </div>
                      <pre className="bg-black border border-border p-2 text-xs text-primary block overflow-x-auto select-all whitespace-pre-wrap">
                        <code>{c.syntax}</code>
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase">EXAMPLE USAGE:</span>
                        <CopyButton text={c.example} />
                      </div>
                      <pre className="bg-black border border-border p-2 text-xs text-accent block overflow-x-auto select-all whitespace-pre-wrap">
                        <code>{c.example}</code>
                      </pre>
                    </div>
                  </div>

                  {c.mistake && (
                    <div className="border border-red-800 bg-red-950/20 p-3 text-xs text-red-400 leading-relaxed flex gap-2 mt-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>COMMON PITFALL:</strong>
                        <p className="mt-1">{c.mistake}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="border-4 border-dashed border-zinc-800 bg-zinc-950 p-12 text-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-accent mx-auto" />
            <h4 className="text-sm font-black uppercase text-foreground">NO MATCHING GIT COMMANDS OR SOLUTIONS FOUND</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              We couldn't find anything matching your search term. Try searching for other terms like "push", "undo", "commit", "reset" or reset the filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("ALL")
              }}
              className="px-4 py-2 border-2 border-foreground bg-foreground text-background font-black text-xs uppercase cursor-pointer hover:bg-zinc-200 transition-all shadow-[2px_2px_0px_0px_#ffffff]"
            >
              RESET FILTERS & SEARCH
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
