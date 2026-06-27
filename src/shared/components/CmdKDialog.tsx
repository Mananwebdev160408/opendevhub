"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, Terminal, Settings, ArrowRight, FileText, Activity } from "lucide-react"

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

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command"

interface CmdKDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CmdKDialog({ open, setOpen }: CmdKDialogProps) {
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  const tools = [
    { name: "JSON Formatter", slug: "json-formatter" },
    { name: "JSON Validator", slug: "json-validator" },
    { name: "JWT Decoder", slug: "jwt-decoder" },
    { name: "UUID Generator", slug: "uuid-generator" },
    { name: "Hash Generator", slug: "hash-generator" },
    { name: "Base64 Encoder", slug: "base64-encode" },
    { name: "Base64 Decoder", slug: "base64-decode" },
    { name: "URL Encoder", slug: "url-encode" },
    { name: "URL Decoder", slug: "url-decode" },
    { name: "Regex Tester", slug: "regex-tester" },
    { name: "Timestamp Converter", slug: "timestamp-converter" },
    { name: "Color Converter", slug: "color-converter" },
    { name: "Gradient Generator", slug: "gradient-generator" },
    { name: "Lorem Ipsum", slug: "lorem-ipsum" },
    { name: "Slug Generator", slug: "slug-generator" },
    { name: "Case Converter", slug: "case-converter" },
    { name: "Password Generator", slug: "password-generator" },
    { name: "Markdown Preview", slug: "markdown-preview" },
    { name: "HTML Preview", slug: "html-preview" },
    { name: "Diff Checker", slug: "diff-checker" },
    { name: "Cron Parser", slug: "cron-parser" },
    { name: "Character Counter", slug: "character-counter" },
    { name: "Word Counter", slug: "word-counter" },
    { name: "Line Counter", slug: "line-counter" },
    { name: "QR Generator", slug: "qr-generator" },
    { name: "Barcode Generator", slug: "barcode-generator" },
    { name: "CSS Minifier", slug: "css-minifier" },
    { name: "JS Minifier", slug: "js-minifier" },
    { name: "HTML Minifier", slug: "html-minifier" },
    { name: "Prettier Formatter", slug: "prettier-formatter" },
    { name: "CSV Viewer", slug: "csv-viewer" },
    { name: "YAML Viewer", slug: "yaml-viewer" },
    { name: "XML Viewer", slug: "xml-viewer" }
  ]

  const statusCodes = [200, 201, 204, 301, 302, 400, 401, 403, 404, 429, 500, 502, 503]

  const licenses = [
    { name: "MIT License", slug: "mit" },
    { name: "Apache License 2.0", slug: "apache-2.0" },
    { name: "BSD 2-Clause License", slug: "bsd-2-clause" },
    { name: "BSD 3-Clause License", slug: "bsd-3-clause" },
    { name: "ISC License", slug: "isc" },
    { name: "zlib License", slug: "zlib" },
    { name: "Artistic License 2.0", slug: "artistic-2.0" },
    { name: "Python Software Foundation License", slug: "psfl" },
    { name: "Boost Software License 1.0", slug: "bsl-1.0" },
    { name: "University of Illinois/NCSA Open Source License", slug: "ncsa" },
    { name: "Mozilla Public License 2.0", slug: "mpl-2.0" },
    { name: "GNU Lesser General Public License v2.1", slug: "lgpl-2.1" },
    { name: "GNU Lesser General Public License v3.0", slug: "lgpl-3.0" },
    { name: "Eclipse Public License 2.0", slug: "epl-2.0" },
    { name: "Common Development and Distribution License", slug: "cddl-1.0" },
    { name: "GNU General Public License v2.0", slug: "gpl-2.0" },
    { name: "GNU GPLv3", slug: "gpl-3.0" },
    { name: "GNU AGPLv3", slug: "agpl-3.0" },
    { name: "European Union Public Licence 1.2", slug: "eupl-1.2" },
    { name: "CeCILL License v2.1", slug: "cecill-2.1" },
    { name: "The Unlicense", slug: "unlicense" },
    { name: "CC0 1.0 Universal", slug: "cc0-1.0" }
  ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="border-2 border-foreground bg-card shadow-[6px_6px_0px_0px_#000000]">
      <CommandInput placeholder="Type a command, page or tool code..." className="text-foreground caret-primary" />
      <CommandList className="border-t border-border p-2">
        <CommandEmpty className="font-mono text-xs text-muted-foreground p-4 text-center">No results found.</CommandEmpty>
        
        <CommandGroup heading="Core Pages">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))} className="font-mono text-xs border border-transparent hover:border-border">
            <Terminal className="mr-2 h-4 w-4 text-primary" />
            <span>Home (Dashboard)</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/repos"))} className="font-mono text-xs border border-transparent hover:border-border">
            <GithubIcon className="mr-2 h-4 w-4 text-accent" />
            <span>Repository Explorer</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/issues"))} className="font-mono text-xs border border-transparent hover:border-border">
            <FileText className="mr-2 h-4 w-4 text-purple-400" />
            <span>Good First Issues Finder</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/trending"))} className="font-mono text-xs border border-transparent hover:border-border">
            <Activity className="mr-2 h-4 w-4 text-green-400" />
            <span>Trending Repositories</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/tools"))} className="font-mono text-xs border border-transparent hover:border-border">
            <Settings className="mr-2 h-4 w-4 text-amber-400" />
            <span>Developer Toolbox</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-1" />

        <CommandGroup heading="Developer Tools">
          {tools.map((t) => (
            <CommandItem
              key={t.slug}
              onSelect={() => runCommand(() => router.push(`/tools?tool=${t.slug}`))}
              className="font-mono text-xs border border-transparent hover:border-border"
            >
              <Settings className="mr-2 h-3.5 w-3.5 text-zinc-500" />
              <span>{t.name}</span>
              <CommandShortcut className="text-[10px] uppercase font-bold text-accent">Tool</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="my-1" />

        <CommandGroup heading="HTTP Status Codes">
          {statusCodes.map((code) => (
            <CommandItem
              key={code}
              onSelect={() => runCommand(() => router.push(`/http-status#code-${code}`))}
              className="font-mono text-xs border border-transparent hover:border-border"
            >
              <ArrowRight className="mr-2 h-3.5 w-3.5 text-zinc-500" />
              <span>HTTP {code}</span>
              <CommandShortcut className="text-[10px] uppercase font-bold text-yellow-400">Status</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="my-1" />

        <CommandGroup heading="Open Source Licenses">
          {licenses.map((lic) => (
            <CommandItem
              key={lic.slug}
              onSelect={() => runCommand(() => router.push(`/licenses#lic-${lic.slug}`))}
              className="font-mono text-xs border border-transparent hover:border-border"
            >
              <FileText className="mr-2 h-3.5 w-3.5 text-zinc-500" />
              <span>{lic.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
