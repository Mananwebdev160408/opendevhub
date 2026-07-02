"use client"

import dynamic from "next/dynamic"
import * as React from "react"

const Loading = () => (
  <div className="flex items-center justify-center p-12 text-xs font-mono text-zinc-500 gap-2">
    <span>Loading tool component...</span>
  </div>
)

// 1. Formatter Tools
export const JsonFormatterTool = dynamic(
  () => import("./tools/FormatterTools").then((m) => m.JsonFormatterTool),
  { ssr: false, loading: Loading }
)
export const MinifierTool = dynamic(
  () => import("./tools/FormatterTools").then((m) => m.MinifierTool),
  { ssr: false, loading: Loading }
)
export const CsvViewerTool = dynamic(
  () => import("./tools/FormatterTools").then((m) => m.CsvViewerTool),
  { ssr: false, loading: Loading }
)
export const YamlXmlTool = dynamic(
  () => import("./tools/FormatterTools").then((m) => m.YamlXmlTool),
  { ssr: false, loading: Loading }
)
export const JsonToTypescriptTool = dynamic(
  () => import("./tools/FormatterTools").then((m) => m.JsonToTypescriptTool),
  { ssr: false, loading: Loading }
)
export const YamlJsonConverterTool = dynamic(
  () => import("./tools/FormatterTools").then((m) => m.YamlJsonConverterTool),
  { ssr: false, loading: Loading }
)

// 2. Crypto Tools
export const JwtDecoderTool = dynamic(
  () => import("./tools/CryptoTools").then((m) => m.JwtDecoderTool),
  { ssr: false, loading: Loading }
)
export const UuidGeneratorTool = dynamic(
  () => import("./tools/CryptoTools").then((m) => m.UuidGeneratorTool),
  { ssr: false, loading: Loading }
)
export const HashGeneratorTool = dynamic(
  () => import("./tools/CryptoTools").then((m) => m.HashGeneratorTool),
  { ssr: false, loading: Loading }
)
export const Base64Tool = dynamic(
  () => import("./tools/CryptoTools").then((m) => m.Base64Tool),
  { ssr: false, loading: Loading }
)
export const UrlTool = dynamic(
  () => import("./tools/CryptoTools").then((m) => m.UrlTool),
  { ssr: false, loading: Loading }
)
export const PasswordGeneratorTool = dynamic(
  () => import("./tools/CryptoTools").then((m) => m.PasswordGeneratorTool),
  { ssr: false, loading: Loading }
)
export const HtmlEntityCoderTool = dynamic(
  () => import("./tools/CryptoTools").then((m) => m.HtmlEntityCoderTool),
  { ssr: false, loading: Loading }
)

// 3. Parser Tools
export const RegexTesterTool = dynamic(
  () => import("./tools/ParserTools").then((m) => m.RegexTesterTool),
  { ssr: false, loading: Loading }
)
export const TimestampTool = dynamic(
  () => import("./tools/ParserTools").then((m) => m.TimestampTool),
  { ssr: false, loading: Loading }
)
export const LoremIpsumTool = dynamic(
  () => import("./tools/ParserTools").then((m) => m.LoremIpsumTool),
  { ssr: false, loading: Loading }
)
export const WordCharCounterTool = dynamic(
  () => import("./tools/ParserTools").then((m) => m.WordCharCounterTool),
  { ssr: false, loading: Loading }
)
export const SlugGeneratorTool = dynamic(
  () => import("./tools/ParserTools").then((m) => m.SlugGeneratorTool),
  { ssr: false, loading: Loading }
)
export const CaseConverterTool = dynamic(
  () => import("./tools/ParserTools").then((m) => m.CaseConverterTool),
  { ssr: false, loading: Loading }
)
export const DiffCheckerTool = dynamic(
  () => import("./tools/ParserTools").then((m) => m.DiffCheckerTool),
  { ssr: false, loading: Loading }
)
export const CronParserTool = dynamic(
  () => import("./tools/ParserTools").then((m) => m.CronParserTool),
  { ssr: false, loading: Loading }
)
export const KeycodeListenerTool = dynamic(
  () => import("./tools/KeycodeListenerTool").then((m) => m.KeycodeListenerTool),
  { ssr: false, loading: Loading }
)
export const SqlFormatterTool = dynamic(
  () => import("./tools/ParserTools").then((m) => m.SqlFormatterTool),
  { ssr: false, loading: Loading }
)
export const DnsLookupTool = dynamic(
  () => import("./tools/ParserTools").then((m) => m.DnsLookupTool),
  { ssr: false, loading: Loading }
)

// 4. Visual Tools
export const ColorConverterTool = dynamic(
  () => import("./tools/VisualTools").then((m) => m.ColorConverterTool),
  { ssr: false, loading: Loading }
)
export const GradientGeneratorTool = dynamic(
  () => import("./tools/VisualTools").then((m) => m.GradientGeneratorTool),
  { ssr: false, loading: Loading }
)
export const MarkdownPreviewTool = dynamic(
  () => import("./tools/VisualTools").then((m) => m.MarkdownPreviewTool),
  { ssr: false, loading: Loading }
)
export const HtmlPreviewTool = dynamic(
  () => import("./tools/VisualTools").then((m) => m.HtmlPreviewTool),
  { ssr: false, loading: Loading }
)
export const QrGeneratorTool = dynamic(
  () => import("./tools/VisualTools").then((m) => m.QrGeneratorTool),
  { ssr: false, loading: Loading }
)
export const BarcodeGeneratorTool = dynamic(
  () => import("./tools/VisualTools").then((m) => m.BarcodeGeneratorTool),
  { ssr: false, loading: Loading }
)
export const SvgOptimizerTool = dynamic(
  () => import("./tools/VisualTools").then((m) => m.SvgOptimizerTool),
  { ssr: false, loading: Loading }
)
export const CssPlaygroundTool = dynamic(
  () => import("./tools/VisualTools").then((m) => m.CssPlaygroundTool),
  { ssr: false, loading: Loading }
)
