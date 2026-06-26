import { Metadata } from "next"
import { Scale, Check, X, ShieldAlert } from "lucide-react"
import licensesData from "../../../data/licenses.json"

export const metadata: Metadata = {
  title: "Open Source License Explorer - OpenDev Hub",
  description: "Compare MIT, Apache 2.0, and GPLv3 licenses, their permissions, obligations, and limitations.",
}

export default function LicensesPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          REFERENCE // LICENSES
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Scale className="h-6 w-6 text-accent" />
          <span>OPEN-SOURCE LICENSE EXPLORER</span>
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Quickly understand what you can and cannot do with popular open source licenses, from permissive MIT to copyleft GPL.
        </p>
      </div>

      {/* Grid of Licenses */}
      <div className="space-y-8">
        {licensesData.map((lic) => (
          <div
            key={lic.slug}
            id={`lic-${lic.slug}`}
            className="border-4 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-y-[-2px] transition-all"
          >
            <div className="border-b border-border pb-3 mb-4">
              <span className="text-[10px] bg-accent text-accent-foreground border border-foreground px-2 py-0.5 font-bold uppercase tracking-wider">
                LICENSE OVERVIEW
              </span>
              <h3 className="text-lg font-black text-foreground uppercase mt-2">{lic.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{lic.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Permissions */}
              <div className="border-2 border-foreground bg-zinc-950 p-4 space-y-3">
                <span className="text-[10px] text-green-400 font-black uppercase block border-b border-zinc-900 pb-1.5 flex items-center gap-1">
                  <Check className="h-4 w-4" /> PERMISSIONS
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {lic.permissions.map((p) => (
                    <li key={p} className="flex items-center gap-1.5 font-bold">
                      <span className="h-1.5 w-1.5 bg-green-500 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conditions */}
              <div className="border-2 border-foreground bg-zinc-950 p-4 space-y-3">
                <span className="text-[10px] text-yellow-400 font-black uppercase block border-b border-zinc-900 pb-1.5 flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" /> CONDITIONS
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {lic.conditions.map((c) => (
                    <li key={c} className="flex items-center gap-1.5 font-bold">
                      <span className="h-1.5 w-1.5 bg-yellow-500 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              <div className="border-2 border-foreground bg-zinc-950 p-4 space-y-3">
                <span className="text-[10px] text-red-400 font-black uppercase block border-b border-zinc-900 pb-1.5 flex items-center gap-1">
                  <X className="h-4 w-4" /> LIMITATIONS
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {lic.limitations.map((l) => (
                    <li key={l} className="flex items-center gap-1.5 font-bold">
                      <span className="h-1.5 w-1.5 bg-red-500 shrink-0" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-border/40 text-[10px] font-bold text-zinc-500 flex items-center justify-between">
              <span>USAGE EXAMPLE:</span>
              <span className="text-foreground">{lic.example}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
