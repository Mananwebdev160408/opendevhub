import { Metadata } from "next"
import { Info, Heart, Shield, Cpu, CpuIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "About OpenDev Hub - Developer Directory",
  description: "Learn about OpenDev Hub vision, SOLID architecture principles, and zero serverless compute budget.",
}

export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-2 flex items-center gap-2">
          <Info className="h-6 w-6 text-accent" />
          <span>ABOUT OPENDEV HUB</span>
        </h2>
        <span className="text-[10px] bg-primary text-primary-foreground border border-foreground px-2 py-0.5 font-bold uppercase tracking-wider">
          PLATFORM VISION
        </span>
      </div>

      <div className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--primary)] space-y-4">
        <h3 className="text-sm font-black uppercase tracking-tight text-accent">THE MISSION</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          OpenDev Hub was designed to address daily hurdles web developers encounter by unifying repository queries, good first issues discovery, public APIs exploration, license reference documentation, and essential developer utility tools in one high-density dashboard.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Instead of wrapping basic API prompts in custom chatbot wrappers, OpenDev Hub focuses on delivering tangible utilities and static directory databases. We prioritize lightning-fast page loading and offline-first client-side calculations, keeping server resource overhead at absolute zero.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-foreground bg-zinc-950 p-5 space-y-3">
          <span className="text-[10px] text-primary font-black uppercase block border-b border-zinc-900 pb-1.5 flex items-center gap-1">
            <Cpu className="h-4 w-4" /> STATIC DATA INGESTION
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Data directories (Trending Repositories, Events, News) are refreshed via scheduled GitHub Actions pipelines. Updates compile into static JSON files, bypassing active database constraints and eliminating continuous deployment hosting costs.
          </p>
        </div>

        <div className="border-2 border-foreground bg-zinc-950 p-5 space-y-3">
          <span className="text-[10px] text-accent font-black uppercase block border-b border-zinc-900 pb-1.5 flex items-center gap-1">
            <Shield className="h-4 w-4" /> CLIENT-SIDE COMPUTING
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Developer tools (Minifiers, Cryptographic generators, Regex matchers, JWT Decoders) execute 100% locally in your browser. Inputs are never logged, sent to servers, or cataloged. All data remains inside your screen memory.
          </p>
        </div>
      </div>
    </div>
  )
}
