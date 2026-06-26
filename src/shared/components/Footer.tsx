"use client"

import Link from "next/link"
import { Shield, Info, Heart, Mail, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-black border-t-4 border-foreground text-foreground mt-auto">
      {/* Premium Boxy Ad Slot Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b-2 border-foreground bg-grid-pattern">
        <div className="border-4 border-primary bg-zinc-950 p-6 flex flex-col md:flex-row items-center justify-between shadow-[4px_4px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all select-none">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="h-10 w-10 bg-stripes-pattern border-2 border-foreground shrink-0" />
            <div>
              <span className="font-mono text-[10px] tracking-wider text-accent font-black block">SPONSORED RESIDENCY SLOT</span>
              <h4 className="font-mono text-sm font-black text-foreground tracking-tight">ADVERTISE YOUR DEV TOOL WITH US</h4>
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">Reach over 150,000 active developers, engineers, and open-source contributors monthly.</p>
            </div>
          </div>
          <a 
            href="mailto:ads@opendevhub.com?subject=Ad%20Inquiry%20-%20OpenDev%20Hub"
            className="px-4 py-2 border-2 border-foreground bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#ffffff] hover:bg-purple-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#ffffff] transition-all shrink-0 cursor-pointer"
          >
            GET RATE SHEET ↗
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Info Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-1 select-none">
            <span className="font-mono font-black text-xs tracking-tighter bg-foreground text-background px-2 py-0.5 border border-foreground">
              OPENDEV
            </span>
            <span className="font-mono font-black text-xs tracking-widest text-foreground pl-1">
              HUB
            </span>
          </div>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            The developer utility workspace and open-source explorer. Built on absolute transparency, efficiency, and zero serverless overhead.
          </p>
          <div className="font-mono text-[10px] text-zinc-500 flex items-center gap-1.5 pt-2">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>for open source.</span>
          </div>
        </div>

        {/* Sitemap 1 */}
        <div>
          <h5 className="font-mono text-xs font-black tracking-widest text-accent uppercase mb-4 border-b border-foreground/30 pb-1">DISCOVER</h5>
          <ul className="space-y-2 font-mono text-xs">
            <li><Link href="/repos" className="text-muted-foreground hover:text-foreground hover:underline">Repository Explorer</Link></li>
            <li><Link href="/issues" className="text-muted-foreground hover:text-foreground hover:underline">Good First Issues</Link></li>
            <li><Link href="/trending" className="text-muted-foreground hover:text-foreground hover:underline">Trending Software</Link></li>
            <li><Link href="/orgs" className="text-muted-foreground hover:text-foreground hover:underline">Featured Organizations</Link></li>
          </ul>
        </div>

        {/* Sitemap 2 */}
        <div>
          <h5 className="font-mono text-xs font-black tracking-widest text-primary uppercase mb-4 border-b border-foreground/30 pb-1">UTILITIES</h5>
          <ul className="space-y-2 font-mono text-xs">
            <li><Link href="/tools" className="text-muted-foreground hover:text-foreground hover:underline">Developer Toolbox (32 Tools)</Link></li>
            <li><Link href="/git-cheatsheets" className="text-muted-foreground hover:text-foreground hover:underline">Git Cheatsheets</Link></li>
            <li><Link href="/http-status" className="text-muted-foreground hover:text-foreground hover:underline">HTTP Status Codes</Link></li>
            <li><Link href="/licenses" className="text-muted-foreground hover:text-foreground hover:underline">License Explorer</Link></li>
          </ul>
        </div>

        {/* Directory Column */}
        <div>
          <h5 className="font-mono text-xs font-black tracking-widest text-foreground uppercase mb-4 border-b border-foreground/30 pb-1">DIRECTORIES</h5>
          <ul className="space-y-2 font-mono text-xs">
            <li><Link href="/apis" className="text-muted-foreground hover:text-foreground hover:underline">Public API Hub</Link></li>
            <li><Link href="/resources" className="text-muted-foreground hover:text-foreground hover:underline">Learning Resources</Link></li>
            <li><Link href="/events" className="text-muted-foreground hover:text-foreground hover:underline">Open Source Programs</Link></li>
            <li>
              <a 
                href="https://github.com/sindresorhus/awesome" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1"
              >
                Awesome Lists <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copy & Legal */}
      <div className="w-full bg-zinc-950 border-t border-foreground/20 py-4 px-4 sm:px-6 lg:px-8 font-mono text-[10px] text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} OPENDEV HUB. ALL RIGHTS RESERVED. LICENSED UNDER MIT.</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-foreground hover:underline flex items-center gap-1">
              <Info className="h-3 w-3" /> ABOUT THE SITE
            </Link>
            <Link href="/privacy" className="hover:text-foreground hover:underline flex items-center gap-1">
              <Shield className="h-3 w-3" /> PRIVACY POLICY
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
