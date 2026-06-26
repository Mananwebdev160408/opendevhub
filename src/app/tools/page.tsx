import { ToolboxLayout } from "@/modules/dev-toolbox"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Developer Toolbox - OpenDev Hub",
  description: "Access 32+ local, sandboxed developer utility widgets for formatting JSON, encoding URLs, testing RegEx, generating UUIDs, and translating timestamps.",
}

export default function ToolsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <Suspense fallback={
        <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center font-mono text-xs text-zinc-500 uppercase font-bold">
          Initializing Toolbox Components...
        </div>
      }>
        <ToolboxLayout />
      </Suspense>
    </div>
  )
}
