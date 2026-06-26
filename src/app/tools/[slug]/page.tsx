import { ToolboxLayout } from "@/modules/dev-toolbox"
import { Metadata } from "next"
import { Suspense } from "react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

// Generate parameters for pre-defined slugs to ensure static compilation optimization
export async function generateStaticParams() {
  const tools = [
    "json-formatter", "json-validator", "jwt-decoder", "uuid-generator",
    "hash-generator", "base64-encode", "base64-decode", "url-encode",
    "url-decode", "regex-tester", "timestamp-converter", "color-converter",
    "gradient-generator", "lorem-ipsum", "slug-generator", "case-converter",
    "password-generator", "markdown-preview", "html-preview", "diff-checker",
    "cron-parser", "character-counter", "word-counter", "line-counter",
    "qr-generator", "barcode-generator", "css-minifier", "js-minifier",
    "html-minifier", "prettier-formatter", "csv-viewer", "yaml-viewer", "xml-viewer"
  ]
  return tools.map((slug) => ({ slug }))
}

export default async function ToolSlugPage({ params }: PageProps) {
  const { slug } = await params
  return (
    <div className="w-full bg-background min-h-screen">
      <Suspense fallback={
        <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center font-mono text-xs text-zinc-500 uppercase font-bold">
          Initializing Tool Environment...
        </div>
      }>
        <ToolboxLayout initialTool={slug} />
      </Suspense>
    </div>
  )
}
