"use client"

import * as React from "react"
import { FileCode } from "lucide-react"
import { YamlReference } from "./YamlReference"
import dynamic from "next/dynamic"

const LazyYamlGenerator = dynamic(
  () => import("./YamlGenerator").then((m) => m.YamlGenerator),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-24 text-xs font-mono text-zinc-500">
        Loading YAML generator...
      </div>
    ),
  }
)

export function YamlCheats() {
  const [activeTab, setActiveTab] = React.useState<"reference" | "generator">("reference")

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Header Block */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          YAML TOOLKIT
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <FileCode className="h-6 w-6 text-accent" />
          <span>YAML CHEATSHEET & INTERACTIVE GENERATOR</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          An all-in-one guide and interactive builder for YAML structures. Study syntax specifications, filter options, or configure template variables to generate ready-to-use configs in real-time.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-4 border-foreground bg-black p-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] select-none">
        <button
          onClick={() => setActiveTab("reference")}
          className={`flex-1 text-center py-3 text-xs sm:text-sm font-black uppercase cursor-pointer border-2 transition-all ${
            activeTab === "reference"
              ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
              : "border-transparent text-zinc-500 hover:text-foreground hover:bg-zinc-900"
          }`}
        >
          [ REFERENCE SHEET ]
        </button>
        <button
          onClick={() => setActiveTab("generator")}
          className={`flex-1 text-center py-3 text-xs sm:text-sm font-black uppercase cursor-pointer border-2 transition-all ${
            activeTab === "generator"
              ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
              : "border-transparent text-zinc-500 hover:text-foreground hover:bg-zinc-900"
          }`}
        >
          [ INTERACTIVE GENERATOR ]
        </button>
      </div>

      {activeTab === "reference" ? <YamlReference /> : <LazyYamlGenerator />}
    </div>
  )
}
