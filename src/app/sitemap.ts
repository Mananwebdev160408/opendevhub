import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://opendev-hub.vercel.app"

  const staticRoutes = [
    "",
    "/about",
    "/privacy",
    "/contact",
    "/terms",
    "/repos",
    "/issues",
    "/trending",
    "/orgs",
    "/tools",
    "/git-cheatsheets",
    "/yaml-cheatsheets",
    "/http-status",
    "/licenses",
    "/apis",
    "/resources",
    "/events",
    "/news",
  ]

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

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }))

  const toolEntries: MetadataRoute.Sitemap = tools.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...toolEntries]
}
