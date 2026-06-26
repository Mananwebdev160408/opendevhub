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

  const groupedLinks = [
    {
      label: "CODE HUBS",
      links: [
        { label: "EXPLORER", href: "/repos" },
        { label: "ISSUES", href: "/issues" },
        { label: "TRENDING", href: "/trending" },
      ]
    },
    {
      label: "DEV TOOLS",
      links: [
        { label: "TOOLBOX", href: "/tools" },
        { label: "GIT CHEATS", href: "/git-cheatsheets" },
        { label: "HTTP CODES", href: "/http-status" },
      ]
    },
    {
      label: "RESOURCES",
      links: [
        { label: "APIs DIRECTORY", href: "/apis" },
        { label: "MARKDOWN READER", href: "/resources" },
        { label: "EVENTS TIMELINE", href: "/events" },
      ]
    },
    {
      label: "MORE",
      links: [
        { label: "NEWS STREAM", href: "/news" },
        { label: "LICENSES", href: "/licenses" },
      ]
    }
  ]

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 select-none shrink-0 group">
          <span className="font-mono font-black text-sm tracking-tighter bg-foreground text-background px-2.5 py-1 border-2 border-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            OPENDEV
          </span>
          <span className="font-mono font-black text-sm tracking-widest text-foreground group-hover:text-accent transition-colors pl-1">
            HUB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 font-mono text-xs font-bold">
          {groupedLinks.map((group) => {
            const groupActive = isGroupActive(group)
            return (
              <div key={group.label} className="relative group select-none py-4">
                <button
                  className={`px-3 py-1.5 border-2 transition-all flex items-center gap-1.5 cursor-pointer uppercase ${
                    groupActive
                      ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      : "border-transparent hover:border-foreground hover:bg-zinc-900"
                  }`}
                >
                  <span>{group.label}</span>
                  <span className="text-[9px] text-zinc-500 group-hover:text-foreground font-normal">▼</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-[85%] left-0 mt-1 hidden group-hover:block w-48 bg-black border-2 border-foreground shadow-[4px_4px_0px_0px_var(--accent)] font-mono text-[11px] z-50">
                  <div className="flex flex-col p-1.5 gap-1">
                    {group.links.map((link) => {
                      const linkActive = isActive(link.href)
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`px-3 py-2 border transition-all text-left uppercase ${
                            linkActive
                              ? "bg-accent text-accent-foreground border-foreground font-black"
                              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-zinc-900 hover:border-foreground/30"
                          }`}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </nav>

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
