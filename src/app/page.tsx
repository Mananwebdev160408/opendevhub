import { Hero, BentoGrid } from "@/modules/home"

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      {/* Hero Header Section */}
      <Hero />

      {/* Main Bento Grid Dashboard Panel */}
      <BentoGrid />
    </div>
  )
}
