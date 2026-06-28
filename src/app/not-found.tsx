import Link from "next/link"
import { AlertCircle, ArrowRight, Settings, Search, GitBranch } from "lucide-react"

export default function NotFound() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-mono space-y-8 flex flex-col justify-center grow">
      <div className="border-4 border-foreground bg-black p-8 shadow-[8px_8px_0px_0px_var(--primary)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          SYSTEM ERROR STATUS
        </div>
        
        <div className="flex items-center gap-4 text-red-500 mb-4 select-none">
          <AlertCircle className="h-10 w-10 shrink-0" />
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">
            404 - ROUTE NOT FOUND
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed border-l-4 border-destructive pl-4 py-1.5 bg-zinc-950/40">
          The requested system pathway could not be resolved by the server router. The route does not exist or has been shifted in active release iterations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--accent)] space-y-4">
          <span className="text-[10px] text-accent font-black uppercase block border-b border-zinc-800 pb-1.5">
            DIAGNOSTICS & ACTIONS
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Verify the URL address query spelling in your browser bar. If you were following an old index link, please utilize the navigation hubs or return to the main operator interface.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-purple-600 hover:shadow-[2px_2px_0px_0px_var(--accent)] transition-all cursor-pointer"
            >
              <span>RETURN TO MAIN DASHBOARD</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="border-2 border-foreground bg-zinc-950 p-6 space-y-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <span className="text-[10px] text-zinc-500 font-black uppercase block border-b border-zinc-900 pb-1.5">
            OPERATING DIRECTORIES
          </span>
          
          <div className="grid grid-cols-1 gap-2 text-xs">
            <Link
              href="/tools"
              className="flex items-center justify-between p-2 border border-zinc-850 bg-black hover:border-foreground hover:text-accent transition-colors"
            >
              <span className="flex items-center gap-2">
                <Settings className="h-3.5 w-3.5 text-accent" />
                <span>DEV TOOLBOX (32 TOOLS)</span>
              </span>
              <span>→</span>
            </Link>
            <Link
              href="/repos"
              className="flex items-center justify-between p-2 border border-zinc-850 bg-black hover:border-foreground hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-primary" />
                <span>REPOSITORY EXPLORER</span>
              </span>
              <span>→</span>
            </Link>
            <Link
              href="/issues"
              className="flex items-center justify-between p-2 border border-zinc-850 bg-black hover:border-foreground hover:text-green-400 transition-colors"
            >
              <span className="flex items-center gap-2">
                <GitBranch className="h-3.5 w-3.5 text-green-400" />
                <span>GOOD FIRST ISSUES</span>
              </span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
