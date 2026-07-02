"use client"

import * as React from "react"
import { Copy, Check, Play, RefreshCw, Eye, X } from "lucide-react"
import { CopyBtn } from "./ToolHelpers"

export function RegexTesterTool() {
  const [regex, setRegex] = React.useState("([a-zA-Z]+)-explorer")
  const [text, setText] = React.useState("issue-explorer repo-explorer file-explorer web-app")
  const [flags, setFlags] = React.useState("g")
  const [matches, setMatches] = React.useState<{ text: string; index: number }[]>([])
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setError(null)
    setMatches([])
    if (!regex) return

    try {
      const rx = new RegExp(regex, flags)
      const list = []
      let match
      
      if (flags.includes("g")) {
        while ((match = rx.exec(text)) !== null) {
          list.push({ text: match[0], index: match.index })
          if (match[0] === "") rx.lastIndex++
        }
      } else {
        match = rx.exec(text)
        if (match) {
          list.push({ text: match[0], index: match.index })
        }
      }
      setMatches(list)
    } catch (e: any) {
      setError(e.message || "Invalid regular expression.")
    }
  }, [regex, text, flags])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">REGULAR EXPRESSION TESTER</span>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">REGEX PATTERN:</span>
          <input
            type="text"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
            placeholder="e.g. [a-z]+"
            className="w-full neo-input"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">FLAGS:</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g, i, m, u, s"
            className="w-full neo-input"
          />
        </div>
      </div>

      {error && (
        <div className="border-2 border-destructive bg-red-950/20 p-2.5 text-xs text-red-400 font-bold">
          REGEX CONSTRUCT FAULT: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">TEST STRING:</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type sample text to matches..."
            className="w-full h-48 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">MATCH RESULTS ({matches.length}):</span>
          <div className="w-full h-48 bg-zinc-950 border-2 border-border p-3 overflow-y-auto space-y-1">
            {matches.length === 0 ? (
              <span className="text-xs text-zinc-600">No matches found in string.</span>
            ) : (
              matches.map((m, idx) => (
                <div key={idx} className="text-xs flex items-center justify-between border border-border/40 px-2 py-1 bg-black">
                  <span className="text-accent select-all font-bold">"{m.text}"</span>
                  <span className="text-[9px] text-zinc-500 font-bold">INDEX {m.index}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TimestampTool() {
  const [epoch, setEpoch] = React.useState(() => String(Math.floor(Date.now() / 1000)))
  const [iso, setIso] = React.useState("")
  const [currentEpoch, setCurrentEpoch] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleEpochConvert = () => {
    try {
      const date = new Date(parseInt(epoch, 10) * 1000)
      setIso(date.toUTCString() + " - " + date.toString())
    } catch (e) {
      setIso("Invalid timestamp")
    }
  }

  React.useEffect(() => {
    handleEpochConvert()
  }, [epoch])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">TIMESTAMP / EPOCH CONVERTER</span>
      
      <div className="border border-foreground bg-zinc-950 p-3 flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-400">REALTIME UNIX EPOCH CLOCK:</span>
        <span className="text-xs font-black text-accent">{currentEpoch}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">UNIX EPOCH TIMESTAMP (SECONDS):</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={epoch}
              onChange={(e) => setEpoch(e.target.value)}
              className="flex-grow neo-input h-10"
            />
            <button
              onClick={() => setEpoch(String(Math.floor(Date.now() / 1000)))}
              className="px-3 bg-primary text-primary-foreground border-2 border-foreground shadow-[2px_2px_0px_0px_#ffffff] text-xs font-bold active:translate-y-0.5 cursor-pointer flex items-center gap-1 uppercase"
            >
              <RefreshCw className="h-3.5 w-3.5" /> NOW
            </button>
          </div>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">UTC / LOCAL CONVERTED DATE:</span>
          <div className="w-full bg-zinc-950 border-2 border-border p-2.5 h-10 text-xs text-foreground select-all font-bold truncate">
            {iso}
          </div>
        </div>
      </div>
    </div>
  )
}

export function LoremIpsumTool() {
  const [paragraphs, setParagraphs] = React.useState(3)
  const [output, setOutput] = React.useState("")

  const loremSource = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent hendrerit rhoncus lorem at lacinia. Aliquam ac justo vel nibh condimentum lobortis non vitae justo. Phasellus hendrerit elit eget augue bibendum dictum. Sed eu lectus ac felis sollicitudin facilisis. Curabitur hendrerit ex diam, vel rutrum erat efficitur sed. Morbi vel eleifend turpis.",
    "Proin congue convallis erat, sed ultrices tellus sodales id. In tristique ipsum et elit mollis tristique. Aliquam scelerisque interdum ex, eget feugiat nunc egestas in. Fusce vestibulum lacus non elementum eleifend. Maecenas ac ante et velit lacinia imperdiet eu vel eros. Duis eleifend nisl ut lacus interdum tempor. Mauris id nisl egestas, congue risus in, dictum eros.",
    "Aenean scelerisque, sapien a porta feugiat, elit ligula mollis urna, non feugiat elit lorem at magna. Suspendisse pulvinar arcu vel quam laoreet finibus. Ut ut efficitur turpis, hendrerit pretium orci. Integer vitae feugiat diam, quis accumsan mi. Nunc convallis mi lacus, a finibus diam bibendum quis. Proin sed mi arcu. Ut eu eros sit amet nulla efficitur sodales eu ut tortor.",
    "Vestibulum id tellus a turpis placerat interdum at a eros. Pellentesque hendrerit elit quis nisl rutrum, sed mattis ex imperdiet. Integer vel nisl egestas, placerat leo vel, consequat magna. Nam nec nibh vel arcu congue viverra. Pellentesque a sem sed dolor tristique pretium quis at risus. Mauris sollicitudin ipsum ut sapien rutrum feugiat."
  ]

  const generateLorem = () => {
    const lines = []
    for (let i = 0; i < paragraphs; i++) {
      lines.push(loremSource[i % loremSource.length])
    }
    setOutput(lines.join("\n\n"))
  }

  React.useEffect(() => {
    generateLorem()
  }, [paragraphs])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">LOREM IPSUM GENERATOR</span>
        <div className="flex items-center gap-3">
          <label className="text-[10px] text-zinc-500 font-bold">PARAGRAPHS:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={paragraphs}
            onChange={(e) => setParagraphs(Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1)))}
            className="w-16 border-2 border-foreground bg-black px-2 py-0.5 text-xs text-foreground text-center"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-400 font-bold block">GENERATED DUMMY TEXT:</span>
          {output && <CopyBtn value={output} />}
        </div>
        <textarea
          readOnly
          value={output}
          className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
        />
        
        <div className="flex gap-4 text-[10px] font-bold text-zinc-500 pt-1">
          <span>CHARS: {output.length}</span>
          <span>WORDS: {output.split(/\s+/).filter(Boolean).length}</span>
          <span>LINES: {output.split("\n").length}</span>
        </div>
      </div>
    </div>
  )
}

export function SlugGeneratorTool() {
  const [text, setText] = React.useState("OpenDev Hub: Web Developer Tools & Resources!")
  const [slug, setSlug] = React.useState("")

  React.useEffect(() => {
    if (!text) {
      setSlug("")
      return
    }
    const slugified = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setSlug(slugified)
  }, [text])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">URL SLUG GENERATOR</span>
      
      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">INPUT TEXT STRING:</span>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type title here..."
          className="w-full neo-input h-10"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-accent font-bold block">URL-FRIENDLY SLUG:</span>
          {slug && <CopyBtn value={slug} />}
        </div>
        <div className="w-full bg-zinc-950 border border-border p-3 text-xs text-accent select-all font-bold">
          {slug || "Waiting for input..."}
        </div>
      </div>
    </div>
  )
}

export function CaseConverterTool() {
  const [input, setInput] = React.useState("software design principles")
  const [upper, setUpper] = React.useState("")
  const [lower, setLower] = React.useState("")
  const [camel, setCamel] = React.useState("")
  const [snake, setSnake] = React.useState("")
  const [kebab, setKebab] = React.useState("")
  const [pascal, setPascal] = React.useState("")

  React.useEffect(() => {
    if (!input) {
      setUpper(""); setLower(""); setCamel(""); setSnake(""); setKebab(""); setPascal("")
      return
    }

    setUpper(input.toUpperCase())
    setLower(input.toLowerCase())

    const words = input.trim().split(/[\s_-]+/)

    setSnake(words.map(w => w.toLowerCase()).join("_"))

    setKebab(words.map(w => w.toLowerCase()).join("-"))

    const camelCased = words.map((w, i) => {
      const low = w.toLowerCase()
      if (i === 0) return low
      return low.charAt(0).toUpperCase() + low.slice(1)
    }).join("")
    setCamel(camelCased)

    const pascalCased = words.map(w => {
      const low = w.toLowerCase()
      return low.charAt(0).toUpperCase() + low.slice(1)
    }).join("")
    setPascal(pascalCased)

  }, [input])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">STRING CASE CONVERTER</span>
      
      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">INPUT TEXT STRING:</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. hello world"
          className="w-full neo-input h-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">UPPERCASE</span>{upper && <CopyBtn value={upper} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold">{upper || "-"}</div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">LOWERCASE</span>{lower && <CopyBtn value={lower} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold">{lower || "-"}</div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">CAMEL CASE</span>{camel && <CopyBtn value={camel} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold text-accent">{camel || "-"}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">SNAKE CASE</span>{snake && <CopyBtn value={snake} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold">{snake || "-"}</div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">KEBAB CASE</span>{kebab && <CopyBtn value={kebab} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold">{kebab || "-"}</div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">PASCAL CASE</span>{pascal && <CopyBtn value={pascal} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold text-primary">{pascal || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DiffCheckerTool() {
  const [original, setOriginal] = React.useState("hello world\nreact framework\nnextjs 15\nfoo bar")
  const [modified, setModified] = React.useState("hello world!\nreact library\nnextjs 16\nbaz qux\nfoo bar")

  // ── LCS-based diff ──────────────────────────────────────────────────────────
  type DiffOp = { type: "equal" | "remove" | "add"; origLine: number | null; modLine: number | null; text: string }

  const computeDiff = (a: string[], b: string[]): DiffOp[] => {
    const m = a.length, n = b.length
    // Build LCS table
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])

    // Backtrack
    const ops: DiffOp[] = []
    let i = m, j = n
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
        ops.push({ type: "equal", origLine: i, modLine: j, text: a[i - 1] })
        i--; j--
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        ops.push({ type: "add", origLine: null, modLine: j, text: b[j - 1] })
        j--
      } else {
        ops.push({ type: "remove", origLine: i, modLine: null, text: a[i - 1] })
        i--
      }
    }
    return ops.reverse()
  }

  // Pair up consecutive remove+add as "modified" for display
  type DisplayRow =
    | { kind: "equal";    origLine: number; modLine: number;  text: string }
    | { kind: "remove";   origLine: number;                   text: string }
    | { kind: "add";                        modLine: number;  text: string }
    | { kind: "modified"; origLine: number; modLine: number;  origText: string; modText: string }

  const buildRows = (ops: DiffOp[]): DisplayRow[] => {
    const rows: DisplayRow[] = []
    let k = 0
    while (k < ops.length) {
      const op = ops[k]
      if (op.type === "remove" && k + 1 < ops.length && ops[k + 1].type === "add") {
        rows.push({ kind: "modified", origLine: op.origLine!, modLine: ops[k + 1].modLine!, origText: op.text, modText: ops[k + 1].text })
        k += 2
      } else if (op.type === "equal") {
        rows.push({ kind: "equal", origLine: op.origLine!, modLine: op.modLine!, text: op.text })
        k++
      } else if (op.type === "remove") {
        rows.push({ kind: "remove", origLine: op.origLine!, text: op.text })
        k++
      } else {
        rows.push({ kind: "add", modLine: op.modLine!, text: op.text })
        k++
      }
    }
    return rows
  }

  // Inline char-level diff for "modified" rows
  const charDiff = (a: string, b: string): { ch: string; changed: boolean }[][] => {
    const ac = a.split(""), bc = b.split("")
    const m = ac.length, n = bc.length
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = ac[i - 1] === bc[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])

    const origParts: { ch: string; changed: boolean }[] = []
    const modParts:  { ch: string; changed: boolean }[] = []
    let i = m, j = n
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && ac[i - 1] === bc[j - 1]) {
        origParts.unshift({ ch: ac[i - 1], changed: false })
        modParts.unshift({ ch: bc[j - 1], changed: false })
        i--; j--
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        modParts.unshift({ ch: bc[j - 1], changed: true })
        j--
      } else {
        origParts.unshift({ ch: ac[i - 1], changed: true })
        i--
      }
    }
    return [origParts, modParts]
  }

  const oLines = original.split("\n")
  const mLines = modified.split("\n")
  const ops  = computeDiff(oLines, mLines)
  const rows = buildRows(ops)

  const added   = rows.filter(r => r.kind === "add" || r.kind === "modified").length
  const removed = rows.filter(r => r.kind === "remove" || r.kind === "modified").length
  const same    = rows.filter(r => r.kind === "equal").length

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">LINE-BY-LINE DIFF CHECKER</span>
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="text-green-400">+{added} added</span>
          <span className="text-red-400">−{removed} removed</span>
          <span className="text-zinc-500">{same} same</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">ORIGINAL:</span>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="w-full h-36 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">MODIFIED:</span>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="w-full h-36 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
      </div>

      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">DIFF OUTPUT:</span>
        <div className="border-2 border-border bg-zinc-950 overflow-auto max-h-72 text-[11px] leading-5">
          {rows.length === 0 && (
            <div className="p-3 text-zinc-600 italic">No input yet…</div>
          )}
          {rows.map((row, idx) => {
            if (row.kind === "equal") {
              return (
                <div key={idx} className="flex items-start text-zinc-600 hover:bg-zinc-900/40">
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-zinc-800 text-zinc-700 select-none">{row.origLine}</span>
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-zinc-800 text-zinc-700 select-none">{row.modLine}</span>
                  <span className="w-5 shrink-0 text-center py-0.5 select-none text-zinc-700"> </span>
                  <span className="py-0.5 px-2 whitespace-pre-wrap break-all">{row.text}</span>
                </div>
              )
            }
            if (row.kind === "remove") {
              return (
                <div key={idx} className="flex items-start bg-red-950/25 hover:bg-red-950/40">
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-red-900/50 text-red-500 select-none">{row.origLine}</span>
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-red-900/50 text-zinc-600 select-none">·</span>
                  <span className="w-5 shrink-0 text-center py-0.5 select-none text-red-400">−</span>
                  <span className="py-0.5 px-2 text-red-300 whitespace-pre-wrap break-all">{row.text}</span>
                </div>
              )
            }
            if (row.kind === "add") {
              return (
                <div key={idx} className="flex items-start bg-green-950/20 hover:bg-green-950/35">
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-green-900/50 text-zinc-600 select-none">·</span>
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-green-900/50 text-green-500 select-none">{row.modLine}</span>
                  <span className="w-5 shrink-0 text-center py-0.5 select-none text-green-400">+</span>
                  <span className="py-0.5 px-2 text-green-300 whitespace-pre-wrap break-all">{row.text}</span>
                </div>
              )
            }
            // modified — show char-level inline diff
            if (row.kind === "modified") {
              const [origParts, modParts] = charDiff(row.origText, row.modText)
              return (
                <React.Fragment key={idx}>
                  <div className="flex items-start bg-red-950/25 hover:bg-red-950/40">
                     <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-red-900/50 text-red-500 select-none">{row.origLine}</span>
                     <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-red-900/50 text-zinc-600 select-none">·</span>
                     <span className="w-5 shrink-0 text-center py-0.5 select-none text-red-400">−</span>
                     <span className="py-0.5 px-2 text-red-300 whitespace-pre-wrap break-all">
                       {origParts.map((p, i) =>
                         p.changed
                           ? <mark key={i} className="bg-red-700/60 text-red-100 rounded-[2px]">{p.ch}</mark>
                           : <span key={i}>{p.ch}</span>
                       )}
                     </span>
                  </div>
                  <div className="flex items-start bg-green-950/20 hover:bg-green-950/35">
                     <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-green-900/50 text-zinc-600 select-none">·</span>
                     <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-green-900/50 text-green-500 select-none">{row.modLine}</span>
                     <span className="w-5 shrink-0 text-center py-0.5 select-none text-green-400">+</span>
                     <span className="py-0.5 px-2 text-green-300 whitespace-pre-wrap break-all">
                       {modParts.map((p, i) =>
                         p.changed
                           ? <mark key={i} className="bg-green-700/60 text-green-100 rounded-[2px]">{p.ch}</mark>
                           : <span key={i}>{p.ch}</span>
                       )}
                     </span>
                  </div>
                </React.Fragment>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}

export function CronParserTool() {
  const [expr, setExpr] = React.useState("*/5 * * * *")
  const [description, setDescription] = React.useState("")

  React.useEffect(() => {
    if (!expr) {
      setDescription("")
      return
    }

    const parts = expr.trim().split(/\s+/)
    if (parts.length !== 5) {
      setDescription("CRON expression must have exactly 5 elements: minute, hour, day of month, month, day of week.")
      return
    }

    const [min, hour, dom, mon, dow] = parts
    let desc = "CRON triggers: "

    if (min === "*" && hour === "*") desc += "Every minute"
    else if (min.startsWith("*/") && hour === "*") desc += `Every ${min.split("/")[1]} minutes`
    else {
      desc += `At minute ${min} of hour ${hour}`
    }

    if (dom !== "*") desc += `, on day of month ${dom}`
    if (mon !== "*") desc += `, in month ${mon}`
    if (dow !== "*") desc += `, on day of week ${dow}`

    setDescription(desc + ".")
  }, [expr])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">CRON EXPRESSION DESCRIPTOR</span>
      
      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">CRON EXPRESSION (5 FIELDS):</span>
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="e.g. 0 0 * * *"
          className="w-full neo-input h-10 text-accent font-bold"
        />
      </div>

      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">HUMAN-READABLE SCHEDULE DESCRIPTION:</span>
        <div className="w-full bg-zinc-950 border border-border p-3 text-xs text-foreground font-bold">
          {description}
        </div>
      </div>
    </div>
  )
}

export function KeycodeListenerTool() {
  const [keyData, setKeyData] = React.useState<{
    key: string
    code: string
    which: number
    location: string
    shift: boolean
    ctrl: boolean
    alt: boolean
    meta: boolean
  } | null>({
    key: "Start typing...",
    code: "KeyName",
    which: 0,
    location: "Standard Keyboard",
    shift: false,
    ctrl: false,
    alt: false,
    meta: false
  })

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      let loc = "Standard Keyboard"
      if (e.location === 1) loc = "Left Side Key"
      if (e.location === 2) loc = "Right Side Key"
      if (e.location === 3) loc = "Numpad Key"

      setKeyData({
        key: e.key === " " ? "Space" : e.key,
        code: e.code,
        which: e.which || e.keyCode,
        location: loc,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">KEYBOARD KEYCODE EVENT LISTENER</span>
      <div className="text-center py-2 text-[10px] text-zinc-400 font-bold uppercase bg-zinc-950 border border-dashed border-zinc-800">
        FOCUS INSIDE THIS WINDOW AND PRESS ANY KEY TO INSPECT
      </div>

      {keyData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <div className="md:col-span-1 border-4 border-foreground p-5 bg-black flex flex-col justify-center items-center shadow-[4px_4px_0px_0px_#ffffff] text-center min-h-48">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-2">event.key</span>
            <div className="text-3xl font-black text-accent truncate max-w-full uppercase">{keyData.key}</div>
          </div>

          <div className="md:col-span-1 border-4 border-foreground p-5 bg-zinc-950 flex flex-col justify-center items-center shadow-[4px_4px_0px_0px_var(--primary)] text-center min-h-48">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-2">event.which (keyCode)</span>
            <div className="text-5xl font-black text-primary">{keyData.which || "-"}</div>
          </div>

          <div className="md:col-span-1 border-4 border-foreground p-5 bg-black flex flex-col justify-center items-center shadow-[4px_4px_0px_0px_#ffffff] text-center min-h-48">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-2">event.code</span>
            <div className="text-xl font-bold text-yellow-400 truncate max-w-full">{keyData.code}</div>
          </div>
        </div>
      )}

      {keyData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border bg-zinc-950 p-4">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-2">MODIFIER KEY STATUSES</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-black">
              <div className={`p-2 border text-center ${keyData.ctrl ? "bg-accent border-foreground text-accent-foreground" : "border-zinc-800 text-zinc-600"}`}>
                CTRL Key
              </div>
              <div className={`p-2 border text-center ${keyData.shift ? "bg-accent border-foreground text-accent-foreground" : "border-zinc-800 text-zinc-600"}`}>
                SHIFT Key
              </div>
              <div className={`p-2 border text-center ${keyData.alt ? "bg-accent border-foreground text-accent-foreground" : "border-zinc-800 text-zinc-600"}`}>
                ALT Key
              </div>
              <div className={`p-2 border text-center ${keyData.meta ? "bg-accent border-foreground text-accent-foreground" : "border-zinc-800 text-zinc-600"}`}>
                META Key (Cmd/Win)
              </div>
            </div>
          </div>

          <div className="border border-border bg-zinc-950 p-4 space-y-2 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-2">ADDITIONAL DATA</span>
            <div className="flex justify-between border-b border-zinc-800/40 pb-1.5">
              <span className="text-zinc-500">Key Location:</span>
              <span className="font-bold text-foreground">{keyData.location}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/40 pb-1.5">
              <span className="text-zinc-500">Char Code:</span>
              <span className="font-bold text-foreground">{keyData.which}</span>
            </div>
            <div className="flex justify-between pb-0.5">
              <span className="text-zinc-500">Key Identifier:</span>
              <span className="font-bold text-foreground">{keyData.code || "-"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function SqlFormatterTool() {
  const [input, setInput] = React.useState("select id, name, created_at from users where active = 1 and role = 'admin' order by created_at desc limit 10;")
  const [output, setOutput] = React.useState("")

  const formatSql = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    let clean = input.trim().replace(/\s+/g, " ")
    
    // Capitalize SQL Keywords
    const sqlKeywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN",
      "INNER JOIN", "ON", "GROUP BY", "ORDER BY", "LIMIT", "INSERT INTO", "VALUES",
      "UPDATE", "SET", "DELETE FROM", "HAVING", "CREATE TABLE", "INDEX"
    ]
    for (const kw of sqlKeywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "gi")
      clean = clean.replace(regex, kw)
    }

    // Insert line breaks before major keywords
    const lineBreakKeywords = [
      "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
      "GROUP BY", "ORDER BY", "LIMIT", "SET", "VALUES"
    ]
    for (const kw of lineBreakKeywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "g")
      clean = clean.replace(regex, `\n${kw}`)
    }

    // Format logical conditions in WHERE clause
    clean = clean.replace(/\b(AND|OR)\b/g, "\n  $1")

    // Clean extra line spaces
    const lines = clean.split("\n").map(l => l.trim()).filter(Boolean)
    // Add extra padding spaces where helpful
    const formatted = lines.map(line => {
      if (line.startsWith("SELECT") && line.length > 50) {
        // Format SELECT list if very long
        return line.replace(/,\s*/g, ",\n  ")
      }
      return line
    }).join("\n")

    setOutput(formatted)
  }

  React.useEffect(() => {
    formatSql()
  }, [input])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">SQL QUERY FORMATTER & BEAUTIFIER</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">UNFORMATTED SQL QUERY:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">BEAUTIFIED SQL OUTPUT:</span>
            {output && <CopyBtn value={output} />}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted SQL output..."
            className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
          />
        </div>
      </div>
    </div>
  )
}

export function DnsLookupTool() {
  const [domain, setDomain] = React.useState("google.com")
  const [recordType, setRecordType] = React.useState("A")
  const [provider, setProvider] = React.useState<"cloudflare" | "google">("cloudflare")
  const [loading, setLoading] = React.useState(false)
  const [records, setRecords] = React.useState<any[]>([])
  const [error, setError] = React.useState<string | null>(null)

  const performLookup = async () => {
    if (!domain.trim()) return
    setLoading(true)
    setError(null)
    setRecords([])

    const recordTypeMap: Record<string, number> = {
      A: 1, AAAA: 28, MX: 15, TXT: 16, CNAME: 5, NS: 2
    }
    const typeCode = recordTypeMap[recordType] || 1

    try {
      let url = ""
      let headers: HeadersInit = {}

      if (provider === "cloudflare") {
        url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${recordType}`
        headers = { accept: "application/dns-json" }
      } else {
        url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${typeCode}`
      }

      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error("Network response error during DNS query.")
      
      const data = await res.json()
      if (data.Status !== 0) {
        throw new Error(`DNS resolution failed with status code ${data.Status}.`)
      }

      if (data.Answer && Array.isArray(data.Answer)) {
        setRecords(data.Answer)
      } else {
        setRecords([])
      }
    } catch (e: any) {
      setError(e.message || "DNS fetch query failed.")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    performLookup()
  }, [domain, recordType, provider])

  const getRecordTypeName = (typeVal: number) => {
    const types: Record<number, string> = {
      1: "A", 28: "AAAA", 15: "MX", 16: "TXT", 5: "CNAME", 2: "NS"
    }
    return types[typeVal] || String(typeVal)
  }

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">DNS-OVER-HTTPS RESOLVER LOOKUP</span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-bold text-xs">
        <div>
          <span className="text-[10px] text-zinc-400 block mb-1">DOMAIN NAME:</span>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value.trim().toLowerCase())}
            placeholder="e.g. google.com"
            className="w-full neo-input h-10"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 block mb-1">RECORD TYPE:</span>
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full border-2 border-foreground bg-black px-2 h-10 text-xs text-foreground cursor-pointer"
          >
            <option value="A">A (IPv4 Address)</option>
            <option value="AAAA">AAAA (IPv6 Address)</option>
            <option value="MX">MX (Mail Exchanger)</option>
            <option value="TXT">TXT (Text Records)</option>
            <option value="CNAME">CNAME (Canonical Name)</option>
            <option value="NS">NS (Name Server)</option>
          </select>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 block mb-1">RESOLVER SERVER:</span>
          <div className="flex border-2 border-foreground bg-black h-10 select-none items-center p-1 gap-1">
            <button
              onClick={() => setProvider("cloudflare")}
              className={`flex-1 h-full text-[10px] uppercase font-bold cursor-pointer ${
                provider === "cloudflare" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
              }`}
            >
              Cloudflare
            </button>
            <button
              onClick={() => setProvider("google")}
              className={`flex-1 h-full text-[10px] uppercase font-bold cursor-pointer ${
                provider === "google" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
              }`}
            >
              Google
            </button>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">RESOLUTION ANSWER RECORDS:</span>
        <div className="w-full min-h-36 bg-zinc-950 border-2 border-border overflow-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-xs text-zinc-500 gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-accent" />
              <span>Querying DNS records over HTTPS...</span>
            </div>
          ) : error ? (
            <span className="text-xs text-red-500 font-bold block p-2">{error}</span>
          ) : records.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-600">No records found for query parameters.</div>
          ) : (
            <table className="w-full text-[11px] text-left border-collapse select-all">
              <thead>
                <tr className="border-b-2 border-foreground bg-zinc-900 font-black">
                  <th className="p-2 border border-zinc-800 uppercase">Name</th>
                  <th className="p-2 border border-zinc-800 uppercase">Type</th>
                  <th className="p-2 border border-zinc-800 uppercase">TTL</th>
                  <th className="p-2 border border-zinc-800 uppercase">Data</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, idx) => (
                  <tr key={idx} className="border-b border-zinc-800/40 hover:bg-zinc-900/40">
                    <td className="p-2 border border-zinc-800/40 font-bold text-zinc-400">{rec.name}</td>
                    <td className="p-2 border border-zinc-800/40 text-accent font-bold">{getRecordTypeName(rec.type)}</td>
                    <td className="p-2 border border-zinc-800/40 text-zinc-500">{rec.TTL}s</td>
                    <td className="p-2 border border-zinc-800/40 break-all select-all font-bold text-foreground">{rec.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
