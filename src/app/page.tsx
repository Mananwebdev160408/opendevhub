import { Hero, BentoGrid, Philosophy, GitVisualizer, DeepDive, FAQ } from "@/modules/home"

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Hero Header Section */}
      <Hero />

      {/* Scrolling Marquee Banner */}
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

      {/* Main Bento Grid Dashboard Panel */}
      <BentoGrid />

      {/* Philosophy Section */}
      <Philosophy />

      {/* Interactive Git Graph Visualizer Sandbox */}
      <GitVisualizer />

      {/* Deep Dive Feature Capabilities */}
      <DeepDive />

      {/* Technical Q&A FAQ Accordions */}
      <FAQ />
    </div>
  )
}
