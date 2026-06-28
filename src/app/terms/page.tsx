import { Metadata } from "next"
import { FileText, Lock } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service - OpenDev Hub",
  description: "Read about OpenDev Hub software utilization permissions, MIT limits, and sandbox boundaries.",
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-2 flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span>TERMS OF SERVICE</span>
        </h1>
        <span className="text-[10px] bg-accent text-accent-foreground border border-foreground px-2 py-0.5 font-bold uppercase tracking-wider">
          TERMS PROTOCOL // CORE SYSTEM CONTRACT
        </span>
      </div>

      <div className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-5 leading-relaxed text-xs text-muted-foreground">
        
        <div className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-tight text-accent flex items-center gap-1 border-b border-zinc-800 pb-1.5">
            <Lock className="h-4 w-4" /> 1. SYSTEM ACCEPTANCE
          </h3>
          <p>
            By accessing OpenDev Hub, you agree to comply with these terms. The platform is designed strictly for developers as a sandboxed helper and directory listing. If you do not agree to local runtime processing, please terminate your active node session.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-black uppercase tracking-tight text-accent flex items-center gap-1 border-b border-zinc-800 pb-1.5">
            <Lock className="h-4 w-4" /> 2. CODE CONSTRAINTS & LICENSING
          </h3>
          <p>
            OpenDev Hub is open-source software licensed under the MIT License. You are free to inspect, fork, or modify the repository. Core interactive components inside the Developer Toolbox operate 100% locally in your screen memory space. We provide zero runtime guarantees.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-black uppercase tracking-tight text-accent flex items-center gap-1 border-b border-zinc-800 pb-1.5">
            <Lock className="h-4 w-4" /> 3. DATA BOUNDARIES & API LIMITS
          </h3>
          <p>
            Live explorer metrics leverage the official GitHub REST API. You agree to respect GitHub's standard rate limit quotas when querying resources. Connection proxies are run strictly client-side. We are not responsible for GitHub services outages or quota terminations.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-black uppercase tracking-tight text-accent flex items-center gap-1 border-b border-zinc-800 pb-1.5">
            <Lock className="h-4 w-4" /> 4. LIABILITY LIMITATIONS
          </h3>
          <p>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.
          </p>
        </div>
      </div>
    </div>
  )
}
