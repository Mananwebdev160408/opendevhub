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
    router.push(`/repos?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-90px)] border-b-4 border-foreground py-16 px-4 sm:px-6 lg:px-8 bg-dot-pattern overflow-hidden flex flex-col justify-center">
      <div className="absolute top-8 right-10 hidden sm:block pointer-events-none select-none">
        <div className="relative w-28 h-28">
          <div className="absolute top-0 right-0 h-20 w-20 bg-stripes-pattern border-2 border-foreground rotate-12 opacity-35" />
          <div className="absolute top-4 right-4 h-16 w-16 bg-primary border-2 border-foreground -rotate-6 opacity-20" />
          <div className="absolute top-8 right-8 h-12 w-12 bg-checkered-pattern border-2 border-foreground rotate-3 opacity-40" />
        </div>
      </div>

      <div className="absolute bottom-8 left-10 hidden sm:block pointer-events-none select-none">
        <div className="relative w-32 h-28">
          <div className="absolute bottom-0 left-0 h-24 w-16 bg-checkered-pattern border-2 border-foreground -rotate-12 opacity-25" />
          <div className="absolute bottom-3 left-4 h-14 w-28 bg-accent border-2 border-foreground rotate-6 opacity-15" />
          <div className="absolute bottom-6 left-8 h-12 w-20 bg-stripes-pattern border-2 border-foreground -rotate-3 opacity-35" />
        </div>
      </div>

      <div className="absolute top-12 left-10 hidden md:block pointer-events-none select-none">
        <div className="relative w-28 h-28">
          <div className="absolute top-0 left-0 h-16 w-24 bg-checkered-pattern border-2 border-foreground -rotate-6 opacity-20" />
          <div className="absolute top-4 left-4 h-20 w-16 bg-stripes-pattern border-2 border-foreground rotate-12 opacity-30" />
          <div className="absolute top-8 left-8 h-14 w-14 bg-accent border-2 border-foreground -rotate-12 opacity-20" />
        </div>
      </div>

      <div className="absolute bottom-12 right-12 hidden md:block pointer-events-none select-none">
        <div className="relative w-32 h-28">
          <div className="absolute bottom-0 right-0 h-14 w-28 bg-stripes-pattern border-2 border-foreground rotate-6 opacity-35" />
          <div className="absolute bottom-3 right-4 h-20 w-20 bg-primary border-2 border-foreground -rotate-12 opacity-15" />
          <div className="absolute bottom-6 right-8 h-16 w-16 bg-checkered-pattern border-2 border-foreground rotate-3 opacity-25" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border-2 border-foreground bg-accent text-accent-foreground font-mono text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          <Cpu className="h-3.5 w-3.5 animate-spin" />
          <span>ZERO-COMPUTE INFRASTRUCTURE READY</span>
        </div>

        <h1 className="font-mono text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-foreground uppercase leading-none">
          DISCOVER & BUILD <br />
          <span className="text-primary bg-foreground px-3 py-1 inline-block mt-3 shadow-[4px_4px_0px_0px_var(--accent)]">
            OPEN SOURCE
          </span>
        </h1>

        <p className="max-w-3xl mx-auto font-mono text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
          OpenDev Hub compiles everything you need to discover new repositories,
          find good first issues, read public APIs, explore open-source
          licenses, and access 32+ developer utilities in one supercharged, boxy
          dashboard.
        </p>

        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-4">
          <div className="relative flex items-center shadow-[6px_6px_0px_0px_var(--primary)] border-2 border-foreground bg-black focus-within:shadow-[6px_6px_0px_0px_var(--accent)] transition-all">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories, issues or dev tools..."
              className="w-full h-16 pl-12 pr-32 bg-transparent text-sm sm:text-base font-mono text-foreground focus:outline-none placeholder:text-zinc-650"
            />
            <button
              type="submit"
              className="absolute right-3 h-11 px-5 border-2 border-foreground bg-accent text-accent-foreground font-mono font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-teal-400 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            >
              RUN SEARCH
            </button>
          </div>
          <div className="mt-3.5 flex items-center justify-center gap-1.5 font-mono text-[10px] text-zinc-500">
            <span>Press</span>
            <span className="bg-zinc-900 border border-border px-2 py-0.5 rounded text-foreground font-bold">
              CTRL + K
            </span>
            <span>anywhere to trigger global command menu.</span>
          </div>
        </form>

        <div className="pt-10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--primary)] text-center font-mono">
            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">UTILITIES</div>
            <div className="text-base font-black text-foreground mt-1">32+ OFFLINE</div>
          </div>
          <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--accent)] text-center font-mono">
            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">EXPLORER</div>
            <div className="text-base font-black text-foreground mt-1">GITHUB RADAR</div>
          </div>
          <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_#ffffff] text-center font-mono">
            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">OPEN SOURCE</div>
            <div className="text-base font-black text-foreground mt-1">GOOD FIRST ISSUES</div>
          </div>
          <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--primary)] text-center font-mono">
            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">REFERENCE</div>
            <div className="text-base font-black text-foreground mt-1">APIs & CHEATS</div>
          </div>
        </div>
      </div>
    </section>
  );
}
