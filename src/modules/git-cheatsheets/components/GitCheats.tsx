"use client"

import * as React from "react"
import { FileText, Terminal, Info, AlertTriangle } from "lucide-react"
import cheatsheetsData from "../../../../data/git-cheatsheets.json"

export function GitCheats() {
  const [activeCategory, setActiveCategory] = React.useState("ALL")

  const categories = ["ALL", ...cheatsheetsData.map(c => c.category)]

  const filteredData = React.useMemo(() => {
    if (activeCategory === "ALL") return cheatsheetsData
    return cheatsheetsData.filter(c => c.category === activeCategory)
  }, [activeCategory])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Title block */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          REFERENCE // GIT CHEATSHEET
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-accent" />
          <span>GIT REFERENCE CHEATSHEET</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Quick reference list of essential Git commands, correct syntax, examples, and common pitfalls to avoid during development workflows.
        </p>
      </div>

      {/* Category selector */}
      <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--primary)] mb-8 flex flex-wrap gap-2 select-none">
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

      {/* List of categories and commands */}
      <div className="space-y-12">
        {filteredData.map((catGroup) => (
          <div key={catGroup.category} className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent border-b-2 border-foreground pb-2">
              {catGroup.category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {catGroup.commands.map((c) => (
                <div
                  key={c.cmd}
                  className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] transition-all space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-black text-foreground bg-zinc-900 px-2 py-0.5 border border-border">
                      {c.cmd}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold">SYNTAX SPECIFICATION</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {c.description}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[9px] text-zinc-500 font-bold block uppercase">SYNTAX:</span>
                    <code className="bg-black border border-border p-2 text-xs text-primary block overflow-x-auto">
                      {c.syntax}
                    </code>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] text-zinc-500 font-bold block uppercase">EXAMPLE:</span>
                    <code className="bg-black border border-border p-2 text-xs text-accent block overflow-x-auto">
                      {c.example}
                    </code>
                  </div>

                  {c.mistake && (
                    <div className="border border-red-800 bg-red-950/20 p-3 text-xs text-red-400 leading-relaxed flex gap-2">
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
      </div>
    </div>
  )
}
