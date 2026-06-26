"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Terminal, Cpu } from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Route to repositories search with query
    router.push(`/repos?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-90px)] border-b-4 border-foreground py-16 px-4 sm:px-6 lg:px-8 bg-dot-pattern overflow-hidden flex flex-col justify-center">
      {/* Absolute floating abstract boxes/shapes - Geometric Maximalist Piles */}
      {/* Top Right Pile */}
      <div className="absolute top-8 right-10 hidden sm:block pointer-events-none select-none">
        <div className="relative w-28 h-28">
          <div className="absolute top-0 right-0 h-20 w-20 bg-stripes-pattern border-2 border-foreground rotate-12 opacity-35" />
          <div className="absolute top-4 right-4 h-16 w-16 bg-primary border-2 border-foreground -rotate-6 opacity-20" />
          <div className="absolute top-8 right-8 h-12 w-12 bg-checkered-pattern border-2 border-foreground rotate-3 opacity-40" />
        </div>
      </div>

      {/* Bottom Left Pile */}
      <div className="absolute bottom-8 left-10 hidden sm:block pointer-events-none select-none">
        <div className="relative w-32 h-28">
          <div className="absolute bottom-0 left-0 h-24 w-16 bg-checkered-pattern border-2 border-foreground -rotate-12 opacity-25" />
          <div className="absolute bottom-3 left-4 h-14 w-28 bg-accent border-2 border-foreground rotate-6 opacity-15" />
          <div className="absolute bottom-6 left-8 h-12 w-20 bg-stripes-pattern border-2 border-foreground -rotate-3 opacity-35" />
        </div>
      </div>

      {/* Top Left Pile */}
      <div className="absolute top-12 left-10 hidden md:block pointer-events-none select-none">
        <div className="relative w-28 h-28">
          <div className="absolute top-0 left-0 h-16 w-24 bg-checkered-pattern border-2 border-foreground -rotate-6 opacity-20" />
          <div className="absolute top-4 left-4 h-20 w-16 bg-stripes-pattern border-2 border-foreground rotate-12 opacity-30" />
          <div className="absolute top-8 left-8 h-14 w-14 bg-accent border-2 border-foreground -rotate-12 opacity-20" />
        </div>
      </div>

      {/* Bottom Right Pile */}
      <div className="absolute bottom-12 right-12 hidden md:block pointer-events-none select-none">
        <div className="relative w-32 h-28">
          <div className="absolute bottom-0 right-0 h-14 w-28 bg-stripes-pattern border-2 border-foreground rotate-6 opacity-35" />
          <div className="absolute bottom-3 right-4 h-20 w-20 bg-primary border-2 border-foreground -rotate-12 opacity-15" />
          <div className="absolute bottom-6 right-8 h-16 w-16 bg-checkered-pattern border-2 border-foreground rotate-3 opacity-25" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-foreground bg-accent text-accent-foreground font-mono text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          <Cpu className="h-3 w-3 animate-spin" />
          <span>ZERO-COMPUTE INFRASTRUCTURE READY</span>
        </div>

        <h1 className="font-mono text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground uppercase leading-none">
          DISCOVER & BUILD <br />
          <span className="text-primary bg-foreground px-2 py-0.5 inline-block mt-2">
            OPEN SOURCE
          </span>
        </h1>

        <p className="max-w-2xl mx-auto font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
          OpenDev Hub compiles everything you need to discover new repositories,
          find good first issues, read public APIs, explore open-source
          licenses, and access 32+ developer utilities in one supercharged, boxy
          dashboard.
        </p>

        {/* Big styled search bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-4">
          <div className="relative flex items-center shadow-[4px_4px_0px_0px_var(--primary)] border-2 border-foreground bg-black focus-within:shadow-[4px_4px_0px_0px_var(--accent)] transition-all">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories, issues or dev tools..."
              className="w-full h-14 pl-12 pr-28 bg-transparent text-sm font-mono text-foreground focus:outline-none placeholder:text-zinc-600"
            />
            <button
              type="submit"
              className="absolute right-2 h-10 px-4 border-2 border-foreground bg-accent text-accent-foreground font-mono font-bold text-xs uppercase tracking-wider hover:bg-teal-400 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            >
              RUN SEARCH
            </button>
          </div>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 font-mono text-[9px] text-zinc-500">
            <span>Press</span>
            <span className="bg-zinc-900 border border-border px-1.5 py-0.5 rounded text-foreground font-bold">
              CTRL + K
            </span>
            <span>anywhere to trigger global command menu.</span>
          </div>
        </form>
      </div>
    </section>
  );
}
