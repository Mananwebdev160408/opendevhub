import { Metadata } from "next"
import { Scale } from "lucide-react"
import licensesData from "../../../data/licenses.json"
import LicenseExplorerClient from "./LicenseExplorerClient"

export const metadata: Metadata = {
  title: "Open Source License Explorer - OpenDev Hub",
  description: "Compare popular open source licenses (MIT, Apache 2.0, GPLv3, BSD 3-Clause, MPL 2.0, AGPLv3, Unlicense), their permissions, obligations, and limitations.",
  alternates: {
    canonical: "/licenses",
  },
}

export default function LicensesPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          LICENSES
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Scale className="h-6 w-6 text-accent" />
          <span>OPEN-SOURCE LICENSE EXPLORER</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Quickly understand what you can and cannot do with popular open source licenses, from permissive MIT/BSD to copyleft GPL/AGPL and weak copyleft MPL.
        </p>
      </div>

      <LicenseExplorerClient licenses={licensesData} />
    </div>
  )
}
