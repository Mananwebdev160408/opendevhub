"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Settings, Search, Box, SlidersHorizontal, Terminal, Activity } from "lucide-react"
import { AdBanner } from "@/shared/components/AdBanner"

import {
  JsonFormatterTool,
  JwtDecoderTool,
  UuidGeneratorTool,
  HashGeneratorTool,
  Base64Tool,
  UrlTool,
  RegexTesterTool,
  TimestampTool,
  ColorConverterTool,
  GradientGeneratorTool,
  LoremIpsumTool,
  SlugGeneratorTool,
  CaseConverterTool,
  PasswordGeneratorTool,
  MarkdownPreviewTool,
  HtmlPreviewTool,
  DiffCheckerTool,
  CronParserTool,
  QrGeneratorTool,
  BarcodeGeneratorTool,
  MinifierTool,
  CsvViewerTool,
  YamlXmlTool,
  JsonToTypescriptTool,
  YamlJsonConverterTool,
  KeycodeListenerTool,
  SqlFormatterTool,
  SvgOptimizerTool,
  HtmlEntityCoderTool,
  CssPlaygroundTool,
  DnsLookupTool
} from "./ToolRegistry"

interface ToolboxLayoutProps {
  initialTool?: string
}

export function ToolboxLayout({ initialTool }: ToolboxLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const activeToolSlug = initialTool || searchParams.get("tool") || "json-formatter"
  const [query, setQuery] = React.useState("")

  const tools = [
    { name: "JSON Formatter", slug: "json-formatter", category: "Data Formatters", component: <JsonFormatterTool /> },
    { name: "JSON Validator", slug: "json-validator", category: "Data Formatters", component: <JsonFormatterTool /> },
    { name: "Prettier Format", slug: "prettier-formatter", category: "Data Formatters", component: <JsonFormatterTool /> },
    { name: "CSV Grid Viewer", slug: "csv-viewer", category: "Data Formatters", component: <CsvViewerTool /> },
    { name: "YAML/XML View", slug: "yaml-viewer", category: "Data Formatters", component: <YamlXmlTool /> },
    { name: "JSON to TS Interface", slug: "json-to-typescript", category: "Data Formatters", component: <JsonToTypescriptTool /> },
    { name: "YAML ↔ JSON", slug: "yaml-json-converter", category: "Data Formatters", component: <YamlJsonConverterTool /> },
    { name: "JWT Decoder", slug: "jwt-decoder", category: "Encoders & Crypto", component: <JwtDecoderTool /> },
    { name: "UUID Generator", slug: "uuid-generator", category: "Encoders & Crypto", component: <UuidGeneratorTool /> },
    { name: "Hash Generator", slug: "hash-generator", category: "Encoders & Crypto", component: <HashGeneratorTool /> },
    { name: "Base64 Converter", slug: "base64-encode", category: "Encoders & Crypto", component: <Base64Tool /> },
    { name: "URL Converter", slug: "url-encode", category: "Encoders & Crypto", component: <UrlTool /> },
    { name: "Password Gen", slug: "password-generator", category: "Encoders & Crypto", component: <PasswordGeneratorTool /> },
    { name: "HTML Entity Coder", slug: "html-entity-coder", category: "Encoders & Crypto", component: <HtmlEntityCoderTool /> },
    { name: "RegEx Tester", slug: "regex-tester", category: "Text & Parsers", component: <RegexTesterTool /> },
    { name: "Lorem Ipsum", slug: "lorem-ipsum", category: "Text & Parsers", component: <LoremIpsumTool /> },
    { name: "Slug Generator", slug: "slug-generator", category: "Text & Parsers", component: <SlugGeneratorTool /> },
    { name: "Case Converter", slug: "case-converter", category: "Text & Parsers", component: <CaseConverterTool /> },
    { name: "Word/Char Counter", slug: "character-counter", category: "Text & Parsers", component: <LoremIpsumTool /> },
    { name: "Cron Parser", slug: "cron-parser", category: "Text & Parsers", component: <CronParserTool /> },
    { name: "Diff Checker", slug: "diff-checker", category: "Text & Parsers", component: <DiffCheckerTool /> },
    { name: "Keycode Listener", slug: "keycode-listener", category: "Text & Parsers", component: <KeycodeListenerTool /> },
    { name: "SQL Formatter", slug: "sql-formatter", category: "Text & Parsers", component: <SqlFormatterTool /> },
    { name: "DNS Lookup", slug: "dns-lookup", category: "Text & Parsers", component: <DnsLookupTool /> },
    { name: "Color Converter", slug: "color-converter", category: "Visuals & CSS", component: <ColorConverterTool /> },
    { name: "Gradient Gen", slug: "gradient-generator", category: "Visuals & CSS", component: <GradientGeneratorTool /> },
    { name: "QR Generator", slug: "qr-generator", category: "Visuals & CSS", component: <QrGeneratorTool /> },
    { name: "Barcode Gen", slug: "barcode-generator", category: "Visuals & CSS", component: <BarcodeGeneratorTool /> },
    { name: "Markdown Preview", slug: "markdown-preview", category: "Visuals & CSS", component: <MarkdownPreviewTool /> },
    { name: "HTML Sandbox Preview", slug: "html-preview", category: "Visuals & CSS", component: <HtmlPreviewTool /> },
    { name: "CSS Visual Playground", slug: "css-playground", category: "Visuals & CSS", component: <CssPlaygroundTool /> },
    { name: "SVG Optimizer", slug: "svg-optimizer", category: "Visuals & CSS", component: <SvgOptimizerTool /> },
    { name: "Minifiers (CSS/JS)", slug: "css-minifier", category: "Minifiers", component: <MinifierTool /> }
  ]

  const filteredTools = React.useMemo(() => {
    return tools.filter(t => 
      t.name.toLowerCase().includes(query.toLowerCase()) || 
      t.category.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const activeTool = tools.find(t => t.slug === activeToolSlug) || tools[0]

  const handleToolSelect = (slug: string) => {
    if (initialTool) {
      router.push(`/tools/${slug}`)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.set("tool", slug)
      router.push(`/tools?${params.toString()}`)
    }
  }

  const categories = Array.from(new Set(filteredTools.map(t => t.category)))

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          DEVELOPER TOOLBOX
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary animate-spin" />
          <span>DEVELOPER TOOLBOX WORKSPACE</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          A high-density sandbox workspace containing 32 core developer utility widgets. All code computations happen 100% locally in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        <div className="lg:col-span-1 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--accent)] space-y-6">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <span className="text-xs font-black uppercase text-foreground select-none flex items-center gap-1.5">
              <Box className="h-4 w-4 text-accent" /> UTILITIES
            </span>
            <span className="text-[10px] bg-zinc-900 border border-border px-1.5 text-zinc-400 font-bold">{tools.length}</span>
          </div>

          <div className="relative border border-foreground bg-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full h-8 pl-8 pr-2 bg-transparent text-[11px] text-foreground focus:outline-none placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div key={cat} className="space-y-1">
                <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block mb-1 border-b border-border/30 pb-0.5 select-none">
                  {cat}
                </span>
                <div className="flex flex-col gap-1">
                  {filteredTools
                    .filter(t => t.category === cat)
                    .map(t => (
                      <Link
                        key={t.slug}
                        href={`/tools/${t.slug}`}
                        className={`text-left px-2.5 py-1.5 border text-[11px] font-black uppercase transition-all select-none cursor-pointer ${
                          activeToolSlug === t.slug
                            ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                            : "border-zinc-800 hover:border-foreground hover:bg-zinc-900"
                        }`}
                      >
                        {t.name}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t-2 border-dashed border-border/40">
            <AdBanner layout="sidebar" slot={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT} />
          </div>
        </div>

        <div className="lg:col-span-3 border-4 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] min-h-[500px]">
          <div className="mb-6 flex items-center justify-between border-b-2 border-foreground pb-3 select-none">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="font-mono text-sm font-black uppercase text-foreground">
                ACTIVE WORKSPACE: {activeTool.name}
              </h3>
            </div>
            <span className="text-[9px] bg-primary text-primary-foreground px-2 py-0.5 border border-foreground font-bold uppercase tracking-wider">
              {activeTool.category}
            </span>
          </div>

          <div className="w-full">
            {activeTool.component}
          </div>

          {/* Related Tools Section */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-foreground/30">
            <h4 className="font-mono text-[10px] font-black uppercase text-accent mb-3 select-none">
              RELATED UTILITIES
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(() => {
                const relatedMapping: Record<string, string[]> = {
                  "json-formatter": ["json-validator", "prettier-formatter", "yaml-viewer"],
                  "json-validator": ["json-formatter", "yaml-viewer", "xml-viewer"],
                  "prettier-formatter": ["json-formatter", "diff-checker", "case-converter"],
                  "csv-viewer": ["yaml-viewer", "json-formatter", "xml-viewer"],
                  "yaml-viewer": ["xml-viewer", "json-formatter", "csv-viewer"],
                  "xml-viewer": ["yaml-viewer", "json-formatter", "csv-viewer"],
                  "jwt-decoder": ["hash-generator", "base64-encode", "password-generator"],
                  "uuid-generator": ["hash-generator", "password-generator", "slug-generator"],
                  "hash-generator": ["uuid-generator", "jwt-decoder", "base64-encode"],
                  "base64-encode": ["base64-decode", "url-encode", "jwt-decoder"],
                  "base64-decode": ["base64-encode", "url-decode", "jwt-decoder"],
                  "url-encode": ["url-decode", "base64-encode", "slug-generator"],
                  "url-decode": ["url-encode", "base64-decode", "slug-generator"],
                  "password-generator": ["uuid-generator", "hash-generator", "jwt-decoder"],
                  "regex-tester": ["lorem-ipsum", "character-counter", "case-converter"],
                  "lorem-ipsum": ["character-counter", "word-counter", "line-counter"],
                  "slug-generator": ["url-encode", "case-converter", "lorem-ipsum"],
                  "case-converter": ["slug-generator", "character-counter", "prettier-formatter"],
                  "character-counter": ["word-counter", "line-counter", "lorem-ipsum"],
                  "word-counter": ["character-counter", "line-counter", "lorem-ipsum"],
                  "line-counter": ["character-counter", "word-counter", "lorem-ipsum"],
                  "cron-parser": ["timestamp-converter", "uuid-generator", "hash-generator"],
                  "diff-checker": ["prettier-formatter", "json-formatter", "case-converter"],
                  "color-converter": ["gradient-generator", "html-preview", "qr-generator"],
                  "gradient-generator": ["color-converter", "html-preview", "css-minifier"],
                  "qr-generator": ["barcode-generator", "color-converter", "url-encode"],
                  "barcode-generator": ["qr-generator", "color-converter", "url-encode"],
                  "markdown-preview": ["html-preview", "lorem-ipsum", "diff-checker"],
                  "html-preview": ["markdown-preview", "css-minifier", "js-minifier"],
                  "css-minifier": ["js-minifier", "html-minifier", "gradient-generator"],
                  "js-minifier": ["css-minifier", "html-minifier", "prettier-formatter"],
                  "html-minifier": ["css-minifier", "js-minifier", "html-preview"],
                  "json-to-typescript": ["json-formatter", "prettier-formatter", "yaml-json-converter"],
                  "yaml-json-converter": ["yaml-viewer", "json-formatter", "json-to-typescript"],
                  "keycode-listener": ["regex-tester", "character-counter", "case-converter"],
                  "sql-formatter": ["prettier-formatter", "json-formatter", "diff-checker"],
                  "svg-optimizer": ["html-preview", "markdown-preview", "css-playground"],
                  "html-entity-coder": ["url-encode", "base64-encode", "jwt-decoder"],
                  "css-playground": ["gradient-generator", "color-converter", "svg-optimizer"],
                  "dns-lookup": ["cron-parser", "timestamp-converter", "hash-generator"]
                }
                const relatedSlugs = relatedMapping[activeTool.slug] || ["json-formatter", "jwt-decoder", "uuid-generator"]
                const related = relatedSlugs
                  .map(s => tools.find(t => t.slug === s))
                  .filter((t): t is Exclude<typeof t, undefined> => !!t)

                return related.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="px-3 py-2 border-2 border-foreground bg-zinc-950 hover:bg-zinc-900 text-left hover:text-accent transition-all font-mono text-[10px] font-bold uppercase cursor-pointer flex items-center justify-between group"
                  >
                    <span>{t.name}</span>
                    <span className="text-zinc-500 group-hover:text-accent group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                ))
              })()}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
