"use client"

import * as React from "react"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { Sparkles, Terminal } from "lucide-react"

interface AdBannerProps {
  slot?: string // For AdSense specific slot ID
  layout?: string // e.g., 'horizontal', 'vertical', 'sidebar'
}

export function AdBanner({ slot, layout = "horizontal" }: AdBannerProps) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  const carbonZoneId = process.env.NEXT_PUBLIC_CARBON_ZONE_ID
  const carbonServeId = process.env.NEXT_PUBLIC_CARBON_SERVE_ID
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // If AdSense client and slot exist, trigger initialization
    if (adsenseClientId && slot) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("AdSense initialization warning:", err)
      }
    }
  }, [adsenseClientId, slot])

  // Carbon Ads script injector
  useEffect(() => {
    if (carbonZoneId && carbonServeId && adRef.current) {
      const script = document.createElement("script")
      script.src = `//cdn.carbonads.com/carbon.js?serve=${carbonServeId}&placement=${carbonZoneId}`
      script.id = "_carbonads_js"
      script.async = true
      adRef.current.appendChild(script)

      return () => {
        if (adRef.current) {
          adRef.current.innerHTML = ""
        }
      }
    }
  }, [carbonZoneId, carbonServeId])

  // 1. If Carbon ads are active
  if (carbonZoneId && carbonServeId) {
    return (
      <div
        ref={adRef}
        className="carbon-container min-h-[130px] border-2 border-foreground bg-zinc-950 p-3 font-mono text-xs flex justify-center items-center shadow-[4px_4px_0px_0px_var(--accent)] w-full"
      />
    )
  }

  // 2. If AdSense is active
  if (adsenseClientId && slot) {
    return (
      <div className="w-full flex justify-center py-4 overflow-hidden border-2 border-foreground bg-zinc-950 shadow-[4px_4px_0px_0px_var(--accent)]">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseClientId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  // 3. Premium Retro Direct-Sponsorship fallback banner
  const isSidebar = layout === "sidebar"

  return (
    <div
      className={`border-2 border-dashed border-foreground/30 bg-zinc-950 p-4 font-mono relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(255,255,255,0.02)] w-full ${
        isSidebar ? "flex flex-col gap-3 text-center" : "flex flex-col sm:flex-row items-center justify-between gap-4"
      }`}
    >
      <div className="absolute top-1.5 right-2 text-[7px] text-zinc-500 font-bold uppercase select-none tracking-wider flex items-center gap-1">
        <Terminal className="h-2 w-2 text-primary" /> SPONSORSHIP PORT
      </div>

      <div className={`${isSidebar ? "space-y-2" : "space-y-1 text-left"}`}>
        <span className="text-[10px] text-accent font-black uppercase tracking-wider block flex items-center justify-center sm:justify-start gap-1 select-none">
          <Sparkles className="h-3 w-3 text-accent animate-pulse" /> SPONSOR DIRECTORY
        </span>
        <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xl">
          Showcase your developer tool, SaaS, or hiring banner here and reach thousands of builders, designers, and open-source contributors.
        </p>
      </div>

      <Link
        href="/contact?subject=Sponsorship"
        className="shrink-0 border-2 border-foreground bg-foreground text-background px-4 py-1.5 text-[10px] font-black uppercase hover:bg-accent hover:text-accent-foreground hover:border-foreground transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] select-none text-center cursor-pointer"
      >
        ADVERTISE HERE
      </Link>
    </div>
  )
}
