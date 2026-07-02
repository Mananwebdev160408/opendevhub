"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"

export function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1 border border-foreground bg-black hover:bg-zinc-900 active:translate-y-0.5 transition-all text-xs font-mono font-bold flex items-center gap-1 select-none cursor-pointer"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? "COPIED" : "COPY"}</span>
    </button>
  )
}
