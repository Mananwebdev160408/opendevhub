import { Hero, BentoGrid, Philosophy, GitVisualizer, DeepDive, FAQ } from "@/modules/home"
import { AdBanner } from "@/shared/components/AdBanner"
import { Metadata } from "next"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

const MARQUEE_ITEMS = [
  "★ 100% In-Browser Computation",
  "★ Zero Cookies Tracking",
  "★ 32+ Offline Core Developer Utilities",
  "★ Direct GitHub API Exploration",
  "★ 1200+ HTTP Status Codes Indexed",
  "★ No Cost, No Signup, No Login Required",
  "★ Open Source MIT Licensed Codebase",
]

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Hero />

      <div className="w-full bg-primary text-primary-foreground border-y-4 border-foreground overflow-hidden py-3 select-none">
        <div className="animate-marquee whitespace-nowrap flex gap-10 font-mono text-xs font-black uppercase tracking-wider">
          {/* Two copies of the same array — required for seamless CSS -50% loop */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
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
