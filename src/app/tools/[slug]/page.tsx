import { ToolboxLayout } from "@/modules/dev-toolbox"
import { Metadata } from "next"
import { Suspense } from "react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

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

const toolMetadata: Record<string, { title: string; description: string }> = {
  "json-formatter": {
    title: "JSON Formatter & Pretty Printer - OpenDev Hub",
    description: "Format, beautify, and validate JSON data online. Clean your minified JSON code with custom spacing instantly."
  },
  "json-validator": {
    title: "JSON Validator & Syntax Checker - OpenDev Hub",
    description: "Validate JSON strings for syntax correctness. Check and debug JSON structure errors in real-time."
  },
  "jwt-decoder": {
    title: "JWT Decoder & Token Parser - OpenDev Hub",
    description: "Decode JSON Web Tokens (JWT) client-side. Inspect and analyze the header, payload, and signature of your JWTs."
  },
  "uuid-generator": {
    title: "UUID/GUID Generator - OpenDev Hub",
    description: "Generate cryptographically secure RFC 4122 compliant UUIDs (Version 4) individually or in bulk."
  },
  "hash-generator": {
    title: "Hash Generator (MD5, SHA-1, SHA-256) - OpenDev Hub",
    description: "Compute secure MD5, SHA-1, SHA-256, and SHA-512 cryptographic hash values from your raw text strings."
  },
  "base64-encode": {
    title: "Base64 Encoder - OpenDev Hub",
    description: "Encode text strings or binary files to Base64 format client-side for secure data transmission."
  },
  "base64-decode": {
    title: "Base64 Decoder - OpenDev Hub",
    description: "Decode Base64 encoded strings back into clean, readable raw text strings."
  },
  "url-encode": {
    title: "URL Encoder - OpenDev Hub",
    description: "Encode URL parameters to safely transmit data in queries using percent-encoding standard."
  },
  "url-decode": {
    title: "URL Decoder - OpenDev Hub",
    description: "Decode percent-encoded URL parameters back to their original human-readable text representations."
  },
  "regex-tester": {
    title: "RegEx Tester & Matcher - OpenDev Hub",
    description: "Test regular expressions with syntax highlighting, group matches, and real-time query analysis in your browser."
  },
  "timestamp-converter": {
    title: "Unix Timestamp Converter - OpenDev Hub",
    description: "Convert Unix timestamps to human-readable dates and local times, or convert ISO 8601 strings to Unix epoch time."
  },
  "color-converter": {
    title: "HEX / RGB / HSL Color Converter - OpenDev Hub",
    description: "Convert colors between HEX, RGB, HSL formats. Adjust brightness, alpha channel, and preview output."
  },
  "gradient-generator": {
    title: "CSS Gradient Generator - OpenDev Hub",
    description: "Create beautiful linear and radial CSS gradients, preview background styles, and copy output code."
  },
  "lorem-ipsum": {
    title: "Lorem Ipsum Placeholder Generator - OpenDev Hub",
    description: "Generate standard placeholder text. Custom configurations for paragraphs, words, or lists."
  },
  "slug-generator": {
    title: "URL Slug Generator - OpenDev Hub",
    description: "Convert text headlines into SEO-friendly URL slugs. Lowercases, strips special characters, and joins with hyphens."
  },
  "case-converter": {
    title: "Text Case Converter (Upper, Lower, Title) - OpenDev Hub",
    description: "Convert text cases between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case."
  },
  "password-generator": {
    title: "Secure Password Generator - OpenDev Hub",
    description: "Generate strong, cryptographically secure passwords. Customize lengths, digits, symbols, and uppercase characters."
  },
  "markdown-preview": {
    title: "Markdown Preview & Editor - OpenDev Hub",
    description: "Write markdown text and preview output parsed into HTML in real-time with full GitHub styling."
  },
  "html-preview": {
    title: "HTML Sandbox Previewer - OpenDev Hub",
    description: "Write raw HTML, CSS, and JS, and render it in a secure sandbox frame to preview components instantly."
  },
  "diff-checker": {
    title: "Text Diff Checker & Comparison - OpenDev Hub",
    description: "Compare two text snippets side-by-side to highlight additions, deletions, and inline differences."
  },
  "cron-parser": {
    title: "Cron Expression Parser - OpenDev Hub",
    description: "Decode cron schedules into clear human-readable sentences. View next scheduled execution times."
  },
  "character-counter": {
    title: "Word & Character Counter - OpenDev Hub",
    description: "Count words, characters, sentences, lines, and estimate read time of text blocks instantly."
  },
  "word-counter": {
    title: "Word Counter - OpenDev Hub",
    description: "Count words, characters, and spaces in your paragraphs or reports for copywriting."
  },
  "line-counter": {
    title: "Line Counter - OpenDev Hub",
    description: "Calculate lines, empty spaces, and character counts inside code files or plain text."
  },
  "qr-generator": {
    title: "QR Code Generator - OpenDev Hub",
    description: "Generate customized QR codes with custom colors, margins, error correction levels, and download as PNG."
  },
  "barcode-generator": {
    title: "Barcode Generator - OpenDev Hub",
    description: "Create standard Code128, EAN, or UPC barcodes and download SVG or PNG assets."
  },
  "css-minifier": {
    title: "CSS Code Minifier - OpenDev Hub",
    description: "Compress and optimize CSS styles. Remove comments, whitespace, and redundancies to reduce page size."
  },
  "js-minifier": {
    title: "JavaScript Code Minifier - OpenDev Hub",
    description: "Minify JS scripts client-side. Optimize variables, compress syntax, and minimize production payload size."
  },
  "html-minifier": {
    title: "HTML Code Minifier - OpenDev Hub",
    description: "Compress HTML markup. Strip whitespace, comments, and empty attributes for high-performance loading."
  },
  "prettier-formatter": {
    title: "Prettier Code Formatter - OpenDev Hub",
    description: "Format files using Prettier configuration. Beautify JS, CSS, HTML, and Markdown code."
  },
  "csv-viewer": {
    title: "CSV Grid Viewer & Parser - OpenDev Hub",
    description: "Load, parse, and browse large CSV spreadsheets in a clean, filterable tabular grid view."
  },
  "yaml-viewer": {
    title: "YAML Viewer & Parser - OpenDev Hub",
    description: "View and edit YAML data formats. Parse, check, and convert YAML structures to JSON."
  },
  "xml-viewer": {
    title: "XML Viewer & Beautifier - OpenDev Hub",
    description: "Validate and pretty-print XML trees. Expand nodes, format indentations, and inspect structures."
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = toolMetadata[slug] || {
    title: "Developer Toolbox - OpenDev Hub",
    description: "Access local, sandboxed developer utility widgets for formatting, encoding, and parsing."
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://opendev-hub.vercel.app"
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${baseUrl}/tools/${slug}`
    }
  }
}

export default async function ToolSlugPage({ params }: PageProps) {
  const { slug } = await params
  const meta = toolMetadata[slug] || {
    title: "Developer Toolbox - OpenDev Hub",
    description: "Access local, sandboxed developer utility widgets for formatting, encoding, and parsing."
  }
  const cleanTitle = meta.title.split(" - ")[0]

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": cleanTitle,
    "description": meta.description,
    "operatingSystem": "All",
    "applicationCategory": "DeveloperApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  return (
    <div className="w-full bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
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
