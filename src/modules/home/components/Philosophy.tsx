"use client"

import { EyeOff, Radio, Terminal } from "lucide-react"

export function Philosophy() {
  return (
    <section className="w-full min-h-[100vh] border-t-4 border-foreground py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950 bg-grid-pattern flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block border-2 border-foreground bg-accent text-accent-foreground font-mono text-xs font-black px-3 py-1 uppercase tracking-wider">
            [ SITE PHILOSOPHY ]
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl font-black uppercase text-foreground">
            Built for developers. <br />
            <span className="text-primary bg-foreground px-2 py-0.5 inline-block mt-2">Zero compromises.</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
            OpenDev Hub is designed with the engineering values we miss in the modern web. We believe developer portals should be ultra-fast, zero-hassle utilities—not sales funnels loaded with cookie requests and tracking scripts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_var(--primary)] hover:translate-y-[-2px] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <EyeOff className="h-6 w-6" />
              </div>
              <h3 className="font-mono text-lg font-black uppercase tracking-tight text-foreground">
                Absolute Client Privacy
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                Everything you input into the Developer Toolbox—be it passwords, JWT decodes, JSON formatting, or cryptographic hashes—is compiled and processed in-browser. Your secret credentials and data strings never touch our servers, logs, or databases.
              </p>
            </div>
            <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>STORAGE: LOCAL ONLY</span>
              <span className="text-accent font-bold">✓ PRIVACY COMPLIANT</span>
            </div>
          </div>

          <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_var(--accent)] hover:translate-y-[-2px] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 border-2 border-foreground bg-accent text-accent-foreground flex items-center justify-center font-bold">
                <Radio className="h-6 w-6" />
              </div>
              <h3 className="font-mono text-lg font-black uppercase tracking-tight text-foreground">
                Decoupled API Architecture
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                Rather than bottlenecking your explorer queries behind a centralized backend server, OpenDev Hub runs queries straight from your browser directly to GitHub APIs. This ensures zero downtime, zero middleman limits, and direct GitHub speed.
              </p>
            </div>
            <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>API OVERHEAD: 0%</span>
              <span className="text-primary font-bold">✓ BYPASS ROUTER LIMITS</span>
            </div>
          </div>

          <div className="border-4 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_#ffffff] hover:translate-y-[-2px] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 border-2 border-foreground bg-zinc-800 text-foreground flex items-center justify-center font-bold">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="font-mono text-lg font-black uppercase tracking-tight text-foreground">
                No Accounts, Zero Bloat
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                We don&apos;t need your email, your name, or your GitHub authorization token. Access any repositories, issues, status codes, and cheatsheets instantly. No signups, no onboarding, no notifications, and no sales emails.
              </p>
            </div>
            <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>COOKIES SAVED: 0</span>
              <span className="text-white font-bold">✓ 100% AD-HOC UTILITY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
