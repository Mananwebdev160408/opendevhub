import { DevGlossary } from "@/modules/glossary"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Developer Glossary & Core Engineering Reference - OpenDev Hub",
  description: "Search and filter key programming concepts, API architecture protocols, security defenses, and database schemas with practical implementation examples.",
  alternates: {
    canonical: "/glossary",
  },
}

export default function GlossaryPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <DevGlossary />
    </div>
  )
}
