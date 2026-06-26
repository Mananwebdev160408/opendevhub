import { Metadata } from "next"
import { Shield, Lock } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy - OpenDev Hub",
  description: "Read about OpenDev Hub offline-first data principles and security standards.",
}

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-2 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span>PRIVACY POLICY</span>
        </h2>
        <span className="text-[10px] bg-accent text-accent-foreground border border-foreground px-2 py-0.5 font-bold uppercase tracking-wider">
          PRIVACY RULES // SECURITY LOG
        </span>
      </div>

      <div className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4 leading-relaxed">
        <h3 className="text-sm font-black uppercase tracking-tight text-accent flex items-center gap-1">
          <Lock className="h-4 w-4" /> 1. DATA COLLECTION & TRACKING
        </h3>
        <p className="text-xs text-muted-foreground">
          OpenDev Hub does not compile user profiles, require authentication logins, track browser cookies, or write sessions to databases. We collect zero personally identifiable data.
        </p>

        <h3 className="text-sm font-black uppercase tracking-tight text-accent flex items-center gap-1">
          <Lock className="h-4 w-4" /> 2. WORKSPACE EXECUTION PRIVACY
        </h3>
        <p className="text-xs text-muted-foreground">
          All utilities nested under the Developer Toolbox module process text strings, JSON data, keys, or passwords locally on your machine. Input structures are never processed by external servers or parsed by analytics providers.
        </p>

        <h3 className="text-sm font-black uppercase tracking-tight text-accent flex items-center gap-1">
          <Lock className="h-4 w-4" /> 3. EXTERNAL APIS & GITHUB LINKAGES
        </h3>
        <p className="text-xs text-muted-foreground">
          When exploring live repositories or issues, requests connect directly to the GitHub REST API. Inspect the GitHub Privacy Statement to understand how they parse connection logs.
        </p>
      </div>
    </div>
  )
}
