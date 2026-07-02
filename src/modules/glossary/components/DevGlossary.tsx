"use client"

import * as React from "react"
import { Search, BookOpen, ChevronDown, ChevronUp, Tag, HelpCircle, X } from "lucide-react"
import glossaryDataRaw from "../../../../data/glossary.json"

interface GlossaryItem {
  term: string
  fullForm?: string
  category: string
  definition: string
  example: string
  related: string[]
}

const glossaryData = glossaryDataRaw as GlossaryItem[]

export function DevGlossary() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("ALL")
  const [activeLetter, setActiveLetter] = React.useState("ALL")
  const [expandedTerm, setExpandedTerm] = React.useState<string | null>(null)

  const categories = ["ALL", "Frontend", "Backend", "Databases", "DevOps", "Security", "Systems"]
  
  // Create an array of letters present in our data
  const alphabet = React.useMemo(() => {
    const letters = new Set<string>()
    glossaryData.forEach(item => {
      letters.add(item.term.charAt(0).toUpperCase())
    })
    return Array.from(letters).sort()
  }, [])

  // Filter glossary items
  const filteredItems = React.useMemo(() => {
    return glossaryData.filter(item => {
      // Category filter
      if (activeCategory !== "ALL" && item.category.toLowerCase() !== activeCategory.toLowerCase()) {
        return false
      }

      // Letter filter
      if (activeLetter !== "ALL" && item.term.charAt(0).toUpperCase() !== activeLetter) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesTerm = item.term.toLowerCase().includes(query)
        const matchesFullForm = item.fullForm?.toLowerCase().includes(query) || false
        const matchesDef = item.definition.toLowerCase().includes(query)
        const matchesExample = item.example.toLowerCase().includes(query)
        
        return matchesTerm || matchesFullForm || matchesDef || matchesExample
      }

      return true
    })
  }, [searchQuery, activeCategory, activeLetter])

  const toggleExpand = (term: string) => {
    setExpandedTerm(prev => prev === term ? null : term)
  }

  const handleRelatedClick = (relatedTerm: string) => {
    // Find the term in glossary
    const exists = glossaryData.some(item => item.term.toLowerCase() === relatedTerm.toLowerCase())
    if (exists) {
      setSearchQuery(relatedTerm)
      setActiveCategory("ALL")
      setActiveLetter("ALL")
      setExpandedTerm(relatedTerm)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setActiveCategory("ALL")
    setActiveLetter("ALL")
    setExpandedTerm(null)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Header section */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          GLOSSARY REFERENCE
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>DEVELOPER GLOSSARY</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          A searchable, categorized database of core engineering terms, systems patterns, security vulnerabilities, and database properties. Click any card to view detailed code snippets and execution models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search bar */}
          <div className="border-2 border-foreground p-4 bg-zinc-950 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
            <h3 className="text-xs font-black uppercase text-foreground mb-2 flex items-center gap-1.5">
              <span>Search Term</span>
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Type query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border-2 border-foreground text-foreground pl-9 pr-3 py-2 font-mono text-xs focus:outline-none focus:border-accent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="border-2 border-foreground p-4 bg-zinc-950 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] text-left">
            <h3 className="text-xs font-black uppercase text-foreground mb-3 border-b border-zinc-800 pb-1.5">
              Categories
            </h3>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat)
                    setExpandedTerm(null)
                  }}
                  className={`text-left px-2.5 py-1.5 text-xs font-bold border transition-all uppercase flex justify-between items-center ${
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground border-foreground"
                      : "border-zinc-900 text-zinc-400 hover:text-foreground hover:bg-zinc-900"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[9px] opacity-60">
                    ({cat === "ALL" 
                      ? glossaryData.length 
                      : glossaryData.filter(i => i.category.toLowerCase() === cat.toLowerCase()).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Alphabet Filter */}
          <div className="border-2 border-foreground p-4 bg-zinc-950 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] text-left">
            <h3 className="text-xs font-black uppercase text-foreground mb-3 border-b border-zinc-800 pb-1.5">
              Filter by Letter
            </h3>
            <div className="grid grid-cols-5 gap-1">
              <button
                onClick={() => {
                  setActiveLetter("ALL")
                  setExpandedTerm(null)
                }}
                className={`col-span-2 text-center py-1 text-[10px] font-black border transition-all uppercase ${
                  activeLetter === "ALL"
                    ? "bg-foreground text-background border-foreground"
                    : "border-zinc-900 text-zinc-500 hover:text-white"
                }`}
              >
                ALL
              </button>
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => {
                    setActiveLetter(letter)
                    setExpandedTerm(null)
                  }}
                  className={`text-center py-1 text-[10px] font-black border transition-all uppercase ${
                    activeLetter === letter
                      ? "bg-foreground text-background border-foreground"
                      : "border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Glossary List */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex justify-between items-center bg-zinc-950 border-2 border-foreground p-3 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
            <span className="text-xs font-black text-zinc-400 uppercase">
              SHOWING {filteredItems.length} OF {glossaryData.length} GLOSSARY ENTRIES
            </span>
            {(activeCategory !== "ALL" || activeLetter !== "ALL" || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-[10px] text-accent hover:underline font-bold"
              >
                CLEAR ALL FILTERS
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="border-4 border-foreground bg-zinc-950 p-12 text-center shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <HelpCircle className="h-10 w-10 mx-auto text-zinc-600 mb-3" />
              <h3 className="text-sm font-black text-foreground uppercase mb-1">No matches found</h3>
              <p className="text-xs text-zinc-500">Try adjusting your query or resetting filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const isExpanded = expandedTerm === item.term
                return (
                  <div
                    key={item.term}
                    className={`border-2 border-foreground bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all overflow-hidden ${
                      isExpanded ? "border-accent shadow-neo-accent" : ""
                    }`}
                  >
                    {/* Header trigger */}
                    <button
                      onClick={() => toggleExpand(item.term)}
                      className="w-full p-4 flex items-start justify-between text-left hover:bg-zinc-900 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-black tracking-tight text-foreground uppercase">
                            {item.term}
                          </span>
                          {item.fullForm && (
                            <span className="text-[10px] text-zinc-500 font-bold">
                              ({item.fullForm})
                            </span>
                          )}
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 border border-zinc-800 bg-black text-zinc-400">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-1">
                          {item.definition}
                        </p>
                      </div>
                      <span className="text-zinc-500 shrink-0 pl-4 pt-1">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </span>
                    </button>

                    {/* Details Panel */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-zinc-900 bg-black/60 space-y-4">
                        {/* Example Usage / Code block */}
                        <div className="space-y-1.5 text-left">
                          <span className="text-[8px] font-black text-accent uppercase tracking-widest block">
                            PRACTICAL ILLUSTRATION / MODEL
                          </span>
                          <div className="bg-zinc-950 border border-zinc-800 p-3 text-[11px] text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                            {item.example}
                          </div>
                        </div>

                        {/* Related tags */}
                        {item.related.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-900">
                            <Tag className="h-3 w-3 text-zinc-500 shrink-0" />
                            <span className="text-[9px] font-black text-zinc-500 uppercase mr-1">
                              Related:
                            </span>
                            {item.related.map((rel) => (
                              <button
                                key={rel}
                                onClick={() => handleRelatedClick(rel)}
                                className="text-[9px] font-bold text-accent hover:underline hover:text-white bg-zinc-900 px-2 py-0.5 border border-zinc-800 transition-colors uppercase"
                              >
                                {rel}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
