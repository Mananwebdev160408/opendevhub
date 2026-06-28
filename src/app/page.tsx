import { Hero, BentoGrid, Philosophy, GitVisualizer, DeepDive, FAQ } from "@/modules/home"
import { AdBanner } from "@/shared/components/AdBanner"
import { Metadata } from "next"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Hero />

      <div className="w-full bg-primary text-primary-foreground border-y-4 border-foreground overflow-hidden py-3 select-none">
        <div className="animate-marquee whitespace-nowrap flex gap-10 font-mono text-xs font-black uppercase tracking-wider">
          <span>★ 100% In-Browser Computation</span>
          <span>★ Zero Cookies tracking</span>
          <span>★ 32+ Offline Core Developer Utilities</span>
          <span>★ Direct GitHub API Exploration</span>
          <span>★ 1200+ HTTP Status Codes indexed</span>
          <span>★ No Cost, No Signup, No AI Hype</span>
          <span>★ Open Source MIT Licensed Codebase</span>
          <span>★ 100% In-Browser Computation</span>
          <span>★ Zero Cookies tracking</span>
          <span>★ 32+ Offline Core Developer Utilities</span>
          <span>★ Direct GitHub API Exploration</span>
          <span>★ 1200+ HTTP Status Codes indexed</span>
          <span>★ No Cost, No Signup, No AI Hype</span>
          <span>★ Open Source MIT Licensed Codebase</span>
        </div>
      </div>

      <BentoGrid />

      <Philosophy />

      <GitVisualizer />

      <DeepDive />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_HOMEPAGE_SLOT} />
      </div>

      <FAQ />
    </div>
  )
}
