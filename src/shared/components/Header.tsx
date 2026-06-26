"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, X, Sparkles } from "lucide-react"
import { CmdKDialog } from "./CmdKDialog"

// Inline SVG GithubIcon to resolve missing lucide-react export issues in workspaces
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)


export function Header() {
  const pathname = usePathname()
  const [openSearch, setOpenSearch] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [activeGroup, setActiveGroup] = React.useState<string | null>(null)

  const groupedLinks = [
    {
      label: "CODE HUBS",
      description: "Primary developer hubs for searching code repositories, tracing open source issues, and exploring global development trends.",
      links: [
        { label: "EXPLORER", href: "/repos", description: "Search and view raw files, stats, and branches for any GitHub repository." },
        { label: "ISSUES", href: "/issues", description: "Find beginner-friendly 'good first issues' and track live open bugs across GitHub." },
        { label: "TRENDING", href: "/trending", description: "Analyze what repositories and languages are gaining the most traction today." },
      ]
    },
    {
      label: "DEV TOOLS",
      description: "Essential developer utilities and helpers to format configurations, inspect tokens, and verify network responses.",
      links: [
        { label: "TOOLBOX", href: "/tools", description: "Interactive utilities including JWT Decoders, JSON Formatters, Regex Testers, and Base64 Converters." },
        { label: "GIT CHEATS", href: "/git-cheatsheets", description: "Universal Git cheatsheet and recovery troubleshooting guide for common command errors." },
        { label: "HTTP CODES", href: "/http-status", description: "Visual index of HTTP status codes with detailed explanations, headers, and code snippets." },
      ]
    },
    {
      label: "RESOURCES",
      description: "Curated databases, live calendars, and markdown document parsers for developers.",
      links: [
        { label: "APIs DIRECTORY", href: "/apis", description: "Searchable catalog of over 700+ free, public REST APIs classified by category." },
        { label: "MARKDOWN READER", href: "/resources", description: "Read raw GitHub Markdown files and repository READMEs in a clean reader format." },
        { label: "EVENTS TIMELINE", href: "/events", description: "Schedule of upcoming open-source programs, hackathons, and contribution events." },
      ]
    },
    {
      label: "MORE",
      description: "Stay up to date with core framework releases, license files, and project specifications.",
      links: [
        { label: "NEWS STREAM", href: "/news", description: "Live feed of programming articles, engineering updates, and dev updates from Dev.to." },
        { label: "LICENSES", href: "/licenses", description: "A visual reference of open source license permissions, limitations, and terms." },
      ]
    }
  ]

  const categoryExtras = {
    "CODE HUBS": {
      quote: "Talk is cheap. Show me the code. — Linus Torvalds",
      stat: "DATABASE: 420M+ repos, live issues & trending stats queried via GitHub REST v3."
    },
    "DEV TOOLS": {
      quote: "First, solve the problem. Then, write the code. — John Johnson",
      stat: "UTILITIES: 30+ client-side JSON formatters, token parsers & regex validators."
    },
    "RESOURCES": {
      quote: "The best error message is the one that never shows up. — Thomas Fuchs",
      stat: "CATALOG: 770+ active public APIs, raw markdown reader & live timeline events."
    },
    "MORE": {
      quote: "Clean code always looks like it was written by someone who cares. — Michael Feathers",
      stat: "STREAM: Live framework engineering blogs, licenses dictionary & hourly logs."
    }
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const isGroupActive = (group: typeof groupedLinks[0]) => {
    return group.links.some(link => isActive(link.href))
  }

  return (
    <header className="w-full sticky top-0 z-50 bg-black border-b-4 border-foreground text-foreground">
      {/* Top running ticker banner */}
      <div className="w-full bg-primary text-primary-foreground font-mono text-[10px] py-1 px-4 overflow-hidden border-b border-foreground select-none">
        <div className="flex animate-marquee whitespace-nowrap gap-8">
          <span>⚡ OPENDEV HUB V1.0 // PURE MAXIMALISM EDITION</span>
          <span>⚡ API STATUS: 100% OPERATIONAL</span>
          <span>⚡ CLIENT ENGINE: LOADED & CACHED</span>
          <span>⚡ TRENDING TECH: TAILWIND V4, NEXT.JS 16, RUST, GO</span>
          <span>⚡ ZERO AUTH REQUIRED // 100% OPEN SOURCE</span>
          <span className="hidden md:inline">⚡ PRESS CTRL+K TO TRIGGER INSTANT SEARCH COMMAND PALETTE</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 select-none shrink-0 group">
          <span className="font-mono font-black text-sm tracking-tighter bg-foreground text-background px-2.5 py-1 border-2 border-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            OPENDEV
          </span>
          <span className="font-mono font-black text-sm tracking-widest text-foreground group-hover:text-accent transition-colors pl-1">
            HUB
          </span>
        </Link>

        {/* Desktop Navigation Wrapper */}
        <div
          className="hidden xl:block"
          onMouseLeave={() => setActiveGroup(null)}
        >
          <nav className="flex items-center gap-4.5 font-mono text-xs font-bold">
            {groupedLinks.map((group) => {
              const groupActive = isGroupActive(group)
              const isHovered = activeGroup === group.label
              return (
                <div
                  key={group.label}
                  className="py-4"
                  onMouseEnter={() => setActiveGroup(group.label)}
                >
                  <button
                    className={`px-3.5 py-1.5 border-2 border-foreground transition-all flex items-center gap-2 cursor-pointer uppercase ${
                      groupActive
                        ? "bg-accent text-accent-foreground shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                        : "bg-zinc-950 text-foreground hover:bg-primary hover:text-primary-foreground shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-[3px_3px_0px_0px_var(--accent)]"
                    }`}
                  >
                    <span>{group.label}</span>
                    <span className={`text-[8px] text-zinc-500 transition-transform duration-250 ${isHovered ? "rotate-180" : ""}`}>▼</span>
                  </button>
                </div>
              )
            })}
          </nav>

          {/* Mega Menu Dropdown */}
          <div
            className={`absolute top-[60px] left-1/2 -translate-x-1/2 w-[980px] h-[340px] bg-black border-4 border-foreground shadow-[8px_8px_0px_0px_var(--accent)] z-50 transition-all duration-300 ease-out overflow-hidden ${
              activeGroup
                ? "opacity-100 visible translate-y-0 pointer-events-auto"
                : "opacity-0 invisible -translate-y-2 pointer-events-none"
            }`}
          >
            {groupedLinks.map((group) => {
              const isSelected = group.label === activeGroup
              return (
                <div
                  key={group.label}
                  className={`grid grid-cols-12 gap-0 absolute inset-0 transition-all duration-200 ease-in-out ${
                    isSelected
                      ? "opacity-100 visible translate-x-0"
                      : "opacity-0 invisible translate-x-4 pointer-events-none"
                  }`}
                >
                  {/* Left Column (Category Info) */}
                  <div className="col-span-4 bg-zinc-950 p-6 border-r-2 border-foreground flex flex-col justify-between select-none text-left font-mono">
                    {/* Category Title & Description */}
                    <div className="space-y-3">
                      <h4 className="text-xl font-black text-foreground uppercase tracking-tight">
                        {group.label}
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {group.description}
                      </p>
                    </div>

                    {/* Developer Proverb / Quote */}
                    <div className="border-2 border-dashed border-zinc-800 bg-black/60 p-4 space-y-2 text-[10px] text-zinc-400 leading-relaxed italic relative">
                      <span className="text-[8px] font-black text-primary uppercase tracking-wide block border-b border-zinc-900 pb-1 not-italic">
                        DEVELOPER PROVERB
                      </span>
                      <p>
                        "{categoryExtras[group.label as keyof typeof categoryExtras]?.quote.split(" — ")[0]}"
                      </p>
                      <cite className="text-[9px] text-accent not-italic font-bold block text-right mt-1">
                        — {categoryExtras[group.label as keyof typeof categoryExtras]?.quote.split(" — ")[1]}
                      </cite>
                    </div>

                    {/* Category Stat Metric */}
                    <div className="border-2 border-foreground bg-zinc-900 p-3 space-y-1 text-[10px]">
                      <span className="text-[8px] font-black text-accent uppercase tracking-widest block">
                        ESTATE METRIC
                      </span>
                      <p className="text-zinc-400 leading-normal text-[10px]">
                        {categoryExtras[group.label as keyof typeof categoryExtras]?.stat}
                      </p>
                    </div>
                  </div>

                  {/* Right Column (Link List with Descriptions) */}
                  <div className="col-span-8 p-6 bg-black flex flex-col justify-center gap-3">
                    {group.links.map((link) => {
                      const linkActive = isActive(link.href)
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setActiveGroup(null)}
                          className={`border-2 p-3 transition-all flex items-center justify-between group/item ${
                            linkActive
                              ? "bg-accent text-accent-foreground border-foreground shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                              : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-foreground hover:bg-zinc-900 hover:border-foreground hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                          }`}
                        >
                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black uppercase tracking-wide">{link.label}</span>
                              {linkActive && <span className="h-1.5 w-1.5 bg-accent-foreground rounded-full"></span>}
                            </div>
                            <p className={`text-[10px] ${linkActive ? "text-accent-foreground/80" : "text-zinc-500 group-hover/item:text-zinc-400"}`}>
                              {link.description}
                            </p>
                          </div>
                          <span className={`transition-all text-xs font-bold ${
                            linkActive ? "text-accent-foreground" : "text-zinc-700 group-hover/item:text-accent group-hover/item:translate-x-1"
                          }`}>
                            →
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-3">
          {/* Global Search CMD Trigger */}
          <button
            onClick={() => setOpenSearch(true)}
            className="flex items-center gap-2 border-2 border-foreground bg-zinc-950 px-3 py-1.5 font-mono text-xs font-bold hover:bg-primary hover:text-primary-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_var(--accent)] transition-all cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">SEARCH</span>
            <kbd className="hidden md:inline-flex h-4 items-center gap-1 rounded bg-zinc-900 border border-foreground/30 px-1 text-[9px] font-mono text-muted-foreground group-hover:text-primary-foreground">
              Ctrl+K
            </kbd>
          </button>

          {/* GitHub Star Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 border-2 border-foreground hover:bg-accent hover:text-accent-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="h-4 w-4" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 border-2 border-foreground hover:bg-zinc-900 active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden w-full bg-black border-t-2 border-foreground p-4 flex flex-col gap-4 font-mono text-sm font-bold max-h-[75vh] overflow-y-auto">
          {groupedLinks.map((group) => {
            const groupActive = isGroupActive(group)
            return (
              <div
                key={group.label}
                className={`border-2 p-3 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.08)] space-y-2.5 transition-all ${
                  groupActive
                    ? "border-accent bg-zinc-950/40"
                    : "border-zinc-800 bg-zinc-950"
                }`}
              >
                <div className="text-[10px] text-zinc-500 tracking-wider font-black border-b border-zinc-800 pb-1.5 flex justify-between items-center uppercase">
                  <span>{group.label}</span>
                  {groupActive && <span className="h-1.5 w-1.5 bg-accent rounded-full"></span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-2.5 border transition-all text-xs uppercase ${
                        isActive(link.href)
                          ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] font-black"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-zinc-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Search dialog overlay */}
      <CmdKDialog open={openSearch} setOpen={setOpenSearch} />
    </header>
  )
}
