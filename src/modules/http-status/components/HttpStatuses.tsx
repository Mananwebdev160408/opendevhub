"use client"

import * as React from "react"
import { ShieldCheck, Info, HelpCircle } from "lucide-react"
import httpStatusesData from "../../../../data/http-status.json"

export function HttpStatuses() {
  const [activeCategory, setActiveCategory] = React.useState("ALL")
  const [selectedCode, setSelectedCode] = React.useState<number | null>(200)

  const categories = ["ALL", "Success", "Redirection", "Client Error", "Server Error"]

  const filteredStatuses = React.useMemo(() => {
    if (activeCategory === "ALL") return httpStatusesData
    return httpStatusesData.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase())
  }, [activeCategory])

  const activeStatus = httpStatusesData.find(s => s.code === selectedCode) || httpStatusesData[0]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          HTTP STATUS CODES
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          <span>HTTP STATUS CODES FINDER</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Quick reference index of standard Hypertext Transfer Protocol (HTTP) response status codes, their categories, and exact definitions.
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <span className="text-[10px] text-zinc-500 font-bold block mb-4 uppercase select-none">HTTP STATUS CODES:</span>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {filteredStatuses.map((s) => (
              <button
                key={s.code}
                id={`code-${s.code}`}
                onClick={() => setSelectedCode(s.code)}
                className={`flex flex-col items-center justify-center p-4 border-2 text-center select-none cursor-pointer transition-all ${
                  selectedCode === s.code
                    ? "bg-accent text-accent-foreground border-foreground shadow-[3px_3px_0px_0px_#ffffff] translate-x-[-1px] translate-y-[-1px]"
                    : "border-zinc-800 hover:border-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_var(--border)]"
                }`}
              >
                <span className="text-sm font-black tracking-tight">{s.code}</span>
                <span className="text-[8px] font-bold text-zinc-500 uppercase mt-1 truncate max-w-[60px]">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 border-4 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--primary)] min-h-[300px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-foreground pb-3 mb-4 select-none">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">CODE DETAIL PROFILE</span>
              <span className={`text-[9px] font-black px-2 py-0.5 border ${
                activeStatus.category === "Success" 
                  ? "border-green-800 bg-green-950/20 text-green-400" 
                  : activeStatus.category === "Redirection" 
                  ? "border-blue-800 bg-blue-950/20 text-blue-400" 
                  : "border-red-800 bg-red-950/20 text-red-400"
              }`}>
                {activeStatus.category}
              </span>
            </div>

            <h2 className="text-4xl font-black text-foreground">{activeStatus.code}</h2>
            <h3 className="text-sm font-black text-accent uppercase mt-2">{activeStatus.name}</h3>
            
            <p className="text-xs text-muted-foreground leading-relaxed mt-4 border-l-4 border-primary pl-3 bg-zinc-950/40 py-2">
              {activeStatus.meaning}
            </p>
          </div>

          <div className="border-t border-border pt-4 mt-6 text-[10px] text-zinc-500 leading-normal">
            For specific headers or standard client integrations, verify MDN Web docs.
          </div>
        </div>

      </div>
    </div>
  )
}
