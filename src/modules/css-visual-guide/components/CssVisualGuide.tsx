"use client"

import * as React from "react"
import { LayoutGrid, Layers } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { FlexboxPlayground } from "./FlexboxPlayground"
import { GridPlayground } from "./GridPlayground"

export function CssVisualGuide() {
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get("tab")
  const [activeTab, setActiveTab] = React.useState<"flex" | "grid">("flex")

  React.useEffect(() => {
    if (tabParam === "grid") {
      setActiveTab("grid")
    } else if (tabParam === "flex") {
      setActiveTab("flex")
    }
  }, [tabParam])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title block */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          CSS PLAYGROUND
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <LayoutGrid className="h-6 w-6 text-accent animate-pulse" />
          <span>FLEXBOX & GRID INTERACTIVE VISUAL GUIDE</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Toggle CSS layout models in real time. Adjust direction, alignment, sizing constraints, gaps, and item-level overrides with copy-pasteable CSS.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-2 border-foreground bg-zinc-950 p-2 shadow-[4px_4px_0px_0px_var(--primary)] flex gap-2 select-none">
        <button
          onClick={() => setActiveTab("flex")}
          className={`flex-1 py-3 border-2 font-black uppercase text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
            activeTab === "flex"
              ? "bg-primary text-primary-foreground border-foreground shadow-[3px_3px_0px_0px_#ffffff]"
              : "border-zinc-800 text-zinc-500 hover:text-foreground hover:border-foreground"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Flexbox Playground</span>
        </button>
        <button
          onClick={() => setActiveTab("grid")}
          className={`flex-1 py-3 border-2 font-black uppercase text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
            activeTab === "grid"
              ? "bg-primary text-primary-foreground border-foreground shadow-[3px_3px_0px_0px_#ffffff]"
              : "border-zinc-800 text-zinc-500 hover:text-foreground hover:border-foreground"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>CSS Grid Playground</span>
        </button>
      </div>

      {activeTab === "flex" ? <FlexboxPlayground /> : <GridPlayground />}
    </div>
  )
}
