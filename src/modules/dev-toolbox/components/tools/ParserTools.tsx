"use client"

import * as React from "react"
import { Copy, Check, Play, RefreshCw, Eye, X, Trash2, Clipboard, FileText, Sparkles, BookOpen, Volume2, Hash, SlidersHorizontal } from "lucide-react"
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

// ── Two-way Cron Parser & Generator Helpers ─────────────────────────────────

interface FieldState {
  type: "every" | "interval" | "range" | "specific";
  interval: number;
  intervalStart: number;
  rangeStart: number;
  rangeEnd: number;
  specific: number[];
}

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAY_FULL = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const FIELDS_META = [
  { label: "Minutes", name: "Minute", key: "min" },
  { label: "Hours", name: "Hour", key: "hour" },
  { label: "Day of Month", name: "Day of Month", key: "dom" },
  { label: "Month", name: "Month", key: "mon" },
  { label: "Day of Week", name: "Day of Week", key: "dow" },
];

const PRESETS = [
  { name: "Every minute", value: "* * * * *" },
  { name: "Every 5 minutes", value: "*/5 * * * *" },
  { name: "Every hour (at :00)", value: "0 * * * *" },
  { name: "Every 2 hours", value: "0 */2 * * *" },
  { name: "Daily at midnight", value: "0 0 * * *" },
  { name: "Daily at 9:30 AM", value: "30 9 * * *" },
  { name: "Weekly (Sunday midnight)", value: "0 0 * * 0" },
  { name: "Monthly (1st at midnight)", value: "0 0 1 * *" },
  { name: "Weekdays at 9:00 AM", value: "0 9 * * 1-5" },
];

function formatList<T>(list: T[], formatFn?: (val: T) => string): string {
  const formatted = formatFn ? list.map(formatFn) : list.map(String);
  if (formatted.length === 0) return "";
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(", ")}, and ${formatted[formatted.length - 1]}`;
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function parseField(field: string, min: number, max: number, names?: string[]): Set<number> {
  const allowed = new Set<number>();
  const cleanField = field.toUpperCase().trim();
  
  if (cleanField === "*") {
    for (let i = min; i <= max; i++) allowed.add(i);
    return allowed;
  }

  let substituted = cleanField;
  if (names) {
    names.forEach((name, index) => {
      const offset = min;
      const value = index + offset;
      substituted = substituted.replace(new RegExp(`\\b${name}\\b`, "g"), String(value));
    });
  }

  const parts = substituted.split(",");
  for (const part of parts) {
    if (part.includes("/")) {
      const [rangePart, stepPart] = part.split("/");
      const step = parseInt(stepPart, 10);
      if (isNaN(step) || step <= 0) throw new Error(`Invalid step: ${stepPart}`);
      
      let start = min;
      let end = max;
      
      if (rangePart !== "*") {
        if (rangePart.includes("-")) {
          const [sStr, eStr] = rangePart.split("-");
          start = parseInt(sStr, 10);
          end = parseInt(eStr, 10);
        } else {
          start = parseInt(rangePart, 10);
        }
      }
      
      if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
        throw new Error(`Invalid range/values: ${rangePart}`);
      }
      
      for (let i = start; i <= end; i += step) {
        allowed.add(i);
      }
    } else if (part.includes("-")) {
      const [sStr, eStr] = part.split("-");
      const start = parseInt(sStr, 10);
      const end = parseInt(eStr, 10);
      
      if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
        throw new Error(`Invalid range: ${part}`);
      }
      
      for (let i = start; i <= end; i++) {
        allowed.add(i);
      }
    } else {
      const val = parseInt(part, 10);
      if (isNaN(val) || val < min || val > max) {
        if (max === 6 && val === 7) {
          allowed.add(0); // Sunday
        } else {
          throw new Error(`Value ${part} out of range [${min}-${max}]`);
        }
      } else {
        allowed.add(val);
      }
    }
  }
  return allowed;
}

function fieldToHuman(field: string, type: "minute" | "hour" | "dom" | "month" | "dow"): string {
  const clean = field.toUpperCase().trim();
  if (clean === "*") {
    switch (type) {
      case "minute": return "every minute";
      case "hour": return "every hour";
      case "dom": return "every day of the month";
      case "month": return "every month";
      case "dow": return "every day of the week";
    }
  }

  const formatVal = (v: number): string => {
    if (type === "month") return MONTH_FULL[v - 1] || String(v);
    if (type === "dow") return DAY_FULL[v] || String(v);
    if (type === "hour") {
      const ampm = v >= 12 ? "PM" : "AM";
      const displayHour = v % 12 === 0 ? 12 : v % 12;
      return `${displayHour} ${ampm}`;
    }
    if (type === "minute") return String(v).padStart(2, "0");
    if (type === "dom") return getOrdinal(v);
    return String(v);
  };

  if (clean.includes("/")) {
    const [rangePart, stepPart] = clean.split("/");
    const step = stepPart;
    if (rangePart === "*") {
      switch (type) {
        case "minute": return `every ${step} minutes`;
        case "hour": return `every ${step} hours`;
        case "dom": return `every ${step} days`;
        case "month": return `every ${step} months`;
        case "dow": return `every ${step} days of the week`;
      }
    } else if (rangePart.includes("-")) {
      const [startStr, endStr] = rangePart.split("-");
      let start = parseInt(startStr, 10);
      let end = parseInt(endStr, 10);
      return `every ${step} ${type}s from ${formatVal(start)} through ${formatVal(end)}`;
    }
  }

  if (clean.includes("-")) {
    const [startStr, endStr] = clean.split("-");
    let start = parseInt(startStr, 10);
    let end = parseInt(endStr, 10);
    if (type === "month") {
      const sIdx = MONTH_NAMES.indexOf(startStr);
      if (sIdx !== -1) start = sIdx + 1;
      const eIdx = MONTH_NAMES.indexOf(endStr);
      if (eIdx !== -1) end = eIdx + 1;
    }
    if (type === "dow") {
      const sIdx = DAY_NAMES.indexOf(startStr);
      if (sIdx !== -1) start = sIdx;
      const eIdx = DAY_NAMES.indexOf(endStr);
      if (eIdx !== -1) end = eIdx;
    }
    return `${formatVal(start)} through ${formatVal(end)}`;
  }

  const parts = clean.split(",");
  const items = parts.map(p => {
    if (type === "month") {
      const idx = MONTH_NAMES.indexOf(p);
      if (idx !== -1) return idx + 1;
    }
    if (type === "dow") {
      const idx = DAY_NAMES.indexOf(p);
      if (idx !== -1) return idx;
    }
    return parseInt(p, 10);
  });

  if (items.every(v => !isNaN(v))) {
    return formatList(items, formatVal);
  }

  return field;
}

function getNextExecutions(
  minSet: Set<number>,
  hourSet: Set<number>,
  domSet: Set<number>,
  monSet: Set<number>,
  dowSet: Set<number>,
  isDomRestricted: boolean,
  isDowRestricted: boolean,
  count = 5
): Date[] {
  const dates: Date[] = [];
  const current = new Date();
  current.setSeconds(0);
  current.setMilliseconds(0);
  
  // Start checking from the next minute
  current.setMinutes(current.getMinutes() + 1);

  // Safeguard boundary (max 5 years search window)
  const limitDate = new Date(current.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);

  while (dates.length < count && current < limitDate) {
    const month = current.getMonth() + 1;
    if (!monSet.has(month)) {
      current.setMonth(current.getMonth() + 1);
      current.setDate(1);
      current.setHours(0);
      current.setMinutes(0);
      continue;
    }

    const dom = current.getDate();
    const dow = current.getDay();
    
    let dayMatches = false;
    if (isDomRestricted && isDowRestricted) {
      dayMatches = domSet.has(dom) || dowSet.has(dow);
    } else {
      dayMatches = domSet.has(dom) && dowSet.has(dow);
    }

    if (!dayMatches) {
      current.setDate(current.getDate() + 1);
      current.setHours(0);
      current.setMinutes(0);
      continue;
    }

    const hour = current.getHours();
    if (!hourSet.has(hour)) {
      current.setHours(current.getHours() + 1);
      current.setMinutes(0);
      continue;
    }

    const min = current.getMinutes();
    if (!minSet.has(min)) {
      current.setMinutes(current.getMinutes() + 1);
      continue;
    }

    dates.push(new Date(current));
    current.setMinutes(current.getMinutes() + 1);
  }

  return dates;
}

function getRelativeTimeDesc(d: Date): string {
  const diffMs = d.getTime() - Date.now();
  if (diffMs <= 0) return "just now";
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    const hoursPart = diffHours % 24;
    return `in ${diffDays} day${diffDays > 1 ? "s" : ""}${hoursPart > 0 ? `, ${hoursPart} hr${hoursPart > 1 ? "s" : ""}` : ""}`;
  }
  if (diffHours > 0) {
    const minsPart = diffMins % 60;
    return `in ${diffHours} hr${diffHours > 1 ? "s" : ""}${minsPart > 0 ? `, ${minsPart} min${minsPart > 1 ? "s" : ""}` : ""}`;
  }
  if (diffMins > 0) {
    return `in ${diffMins} min${diffMins > 1 ? "s" : ""}`;
  }
  return "in less than a minute";
}

function parseStringToFieldState(fieldStr: string, minVal: number, maxVal: number): FieldState {
  const clean = fieldStr.trim().toUpperCase();
  
  const defaultState: FieldState = {
    type: "every",
    interval: 5,
    intervalStart: minVal,
    rangeStart: minVal,
    rangeEnd: maxVal,
    specific: []
  };

  if (clean === "*") {
    return defaultState;
  }

  const stepMatch = clean.match(/^(\*|\d+)\/(\d+)$/);
  if (stepMatch) {
    const startStr = stepMatch[1];
    const stepVal = parseInt(stepMatch[2], 10);
    const startVal = startStr === "*" ? minVal : parseInt(startStr, 10);
    if (!isNaN(stepVal)) {
      return {
        ...defaultState,
        type: "interval",
        interval: stepVal,
        intervalStart: startVal
      };
    }
  }

  const rangeMatch = clean.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const startVal = parseInt(rangeMatch[1], 10);
    const endVal = parseInt(rangeMatch[2], 10);
    if (!isNaN(startVal) && !isNaN(endVal)) {
      return {
        ...defaultState,
        type: "range",
        rangeStart: startVal,
        rangeEnd: endVal
      };
    }
  }

  const parts = clean.split(",");
  const specificList: number[] = [];
  let isSpecificValid = true;

  for (const part of parts) {
    const p = part.trim();
    let val = parseInt(p, 10);
    
    if (minVal === 1 && maxVal === 12) {
      const idx = MONTH_NAMES.indexOf(p);
      if (idx !== -1) val = idx + 1;
    }
    if (minVal === 0 && maxVal === 6) {
      const idx = DAY_NAMES.indexOf(p);
      if (idx !== -1) val = idx;
    }

    if (isNaN(val) || val < minVal || val > maxVal) {
      if (maxVal === 6 && val === 7) {
        val = 0;
      } else {
        isSpecificValid = false;
        break;
      }
    }
    specificList.push(val);
  }

  if (isSpecificValid && parts.length > 0) {
    return {
      ...defaultState,
      type: "specific",
      specific: specificList
    };
  }

  // Fallback to specific items calculated from standard parser parsing
  try {
    const allowed = parseField(fieldStr, minVal, maxVal, minVal === 1 && maxVal === 12 ? MONTH_NAMES : minVal === 0 && maxVal === 6 ? DAY_NAMES : undefined);
    return {
      ...defaultState,
      type: "specific",
      specific: Array.from(allowed)
    };
  } catch (e) {
    return defaultState;
  }
}

function fieldStateToString(state: FieldState, minVal: number, maxVal: number): string {
  switch (state.type) {
    case "every":
      return "*";
    case "interval":
      return state.intervalStart === minVal 
        ? `*/${state.interval}` 
        : `${state.intervalStart}/${state.interval}`;
    case "range":
      return `${state.rangeStart}-${state.rangeEnd}`;
    case "specific":
      if (state.specific.length === 0) return "*";
      return [...state.specific].sort((a, b) => a - b).join(",");
    default:
      return "*";
  }
}

function buildHumanDescription(
  expr: string,
  minAllowed: Set<number>,
  hourAllowed: Set<number>,
  domAllowed: Set<number>,
  monAllowed: Set<number>,
  dowAllowed: Set<number>
): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid CRON expression";
  const [min, hour, dom, mon, dow] = parts;

  const isMinAll = min === "*";
  const isHourAll = hour === "*";
  const isDomAll = dom === "*";
  const isMonAll = mon === "*";
  const isDowAll = dow === "*";

  if (isMinAll && isHourAll && isDomAll && isMonAll && isDowAll) {
    return "Runs every minute, every day.";
  }

  let timeStr = "";
  if (min.startsWith("*/") && isHourAll) {
    const interval = min.split("/")[1];
    timeStr = `Every ${interval} minutes`;
  } else if (min === "0" && hour.startsWith("*/")) {
    const interval = hour.split("/")[1];
    timeStr = `Every ${interval} hours`;
  } else {
    const mins = min.split(",").map(Number);
    const hrs = hour.split(",").map(Number);
    const isMinsSimple = mins.every(m => !isNaN(m) && m >= 0 && m <= 59);
    const isHrsSimple = hrs.every(h => !isNaN(h) && h >= 0 && h <= 23);

    if (isMinsSimple && isHrsSimple && min.indexOf("-") === -1 && min.indexOf("/") === -1 && hour.indexOf("-") === -1 && hour.indexOf("/") === -1) {
      const times: string[] = [];
      for (const h of hrs) {
        for (const m of mins) {
          const ampm = h >= 12 ? "PM" : "AM";
          const displayHour = h % 12 === 0 ? 12 : h % 12;
          const displayMin = String(m).padStart(2, "0");
          times.push(`${displayHour}:${displayMin} ${ampm}`);
        }
      }
      timeStr = `At ${formatList(times)}`;
    } else {
      const minDesc = fieldToHuman(min, "minute");
      const hourDesc = fieldToHuman(hour, "hour");
      timeStr = `${minDesc.charAt(0).toUpperCase() + minDesc.slice(1)} of ${hourDesc}`;
    }
  }

  let dayStr = "";
  if (!isDomAll && isDowAll) {
    dayStr = `, on the ${fieldToHuman(dom, "dom")}`;
  } else if (isDomAll && !isDowAll) {
    dayStr = `, only on ${fieldToHuman(dow, "dow")}`;
  } else if (!isDomAll && !isDowAll) {
    dayStr = `, on the ${fieldToHuman(dom, "dom")} and on ${fieldToHuman(dow, "dow")}`;
  } else {
    dayStr = " every day";
  }

  let monStr = "";
  if (!isMonAll) {
    monStr = `, in ${fieldToHuman(mon, "month")}`;
  }

  let result = `${timeStr}${dayStr}${monStr}.`;
  result = result.replace(/\s+/g, " ").replace(/ ,/g, ",").replace(/\.\./g, ".");
  return result;
}

export function CronParserTool() {
  const [expr, setExpr] = React.useState("*/5 * * * *");
  const [description, setDescription] = React.useState("");
  const [nextRuns, setNextRuns] = React.useState<Date[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"min" | "hour" | "dom" | "mon" | "dow">("min");

  // Visual generator field states
  const [minState, setMinState] = React.useState<FieldState>(() => parseStringToFieldState("*/5", 0, 59));
  const [hourState, setHourState] = React.useState<FieldState>(() => parseStringToFieldState("*", 0, 23));
  const [domState, setDomState] = React.useState<FieldState>(() => parseStringToFieldState("*", 1, 31));
  const [monState, setMonState] = React.useState<FieldState>(() => parseStringToFieldState("*", 1, 12));
  const [dowState, setDowState] = React.useState<FieldState>(() => parseStringToFieldState("*", 0, 6));

  const syncFromExprString = (exprString: string) => {
    const parts = exprString.trim().split(/\s+/);
    if (parts.length === 5) {
      setMinState(parseStringToFieldState(parts[0], 0, 59));
      setHourState(parseStringToFieldState(parts[1], 0, 23));
      setDomState(parseStringToFieldState(parts[2], 1, 31));
      setMonState(parseStringToFieldState(parts[3], 1, 12));
      setDowState(parseStringToFieldState(parts[4], 0, 6));
    }
  };

  const updateFieldState = (field: "min" | "hour" | "dom" | "mon" | "dow", newState: FieldState) => {
    let nextMin = minState;
    let nextHour = hourState;
    let nextDom = domState;
    let nextMon = monState;
    let nextDow = dowState;

    if (field === "min") { nextMin = newState; setMinState(newState); }
    if (field === "hour") { nextHour = newState; setHourState(newState); }
    if (field === "dom") { nextDom = newState; setDomState(newState); }
    if (field === "mon") { nextMon = newState; setMonState(newState); }
    if (field === "dow") { nextDow = newState; setDowState(newState); }

    const cronStr = [
      fieldStateToString(nextMin, 0, 59),
      fieldStateToString(nextHour, 0, 23),
      fieldStateToString(nextDom, 1, 31),
      fieldStateToString(nextMon, 1, 12),
      fieldStateToString(nextDow, 0, 6)
    ].join(" ");

    setExpr(cronStr);
  };

  React.useEffect(() => {
    try {
      const parts = expr.trim().split(/\s+/);
      if (parts.length !== 5) {
        throw new Error("CRON expression must have exactly 5 fields: minute, hour, day of month, month, day of week.");
      }
      const [min, hour, dom, mon, dow] = parts;
      const minSet = parseField(min, 0, 59);
      const hourSet = parseField(hour, 0, 23);
      const domSet = parseField(dom, 1, 31);
      const monSet = parseField(mon, 1, 12, MONTH_NAMES);
      const dowSet = parseField(dow, 0, 6, DAY_NAMES);

      const desc = buildHumanDescription(expr, minSet, hourSet, domSet, monSet, dowSet);
      const next = getNextExecutions(minSet, hourSet, domSet, monSet, dowSet, dom !== "*", dow !== "*");

      setDescription(desc);
      setNextRuns(next);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid CRON expression pattern.");
      setDescription("");
      setNextRuns([]);
    }

    // Two-way sync: Update builder controls if the expression was modified directly in text field
    const currentBuilderStr = [
      fieldStateToString(minState, 0, 59),
      fieldStateToString(hourState, 0, 23),
      fieldStateToString(domState, 1, 31),
      fieldStateToString(monState, 1, 12),
      fieldStateToString(dowState, 0, 6)
    ].join(" ");

    if (expr !== currentBuilderStr) {
      syncFromExprString(expr);
    }
  }, [expr]);

  const getActiveFieldState = (): { state: FieldState; minVal: number; maxVal: number; key: "min" | "hour" | "dom" | "mon" | "dow" } => {
    if (activeTab === "min") return { state: minState, minVal: 0, maxVal: 59, key: "min" };
    if (activeTab === "hour") return { state: hourState, minVal: 0, maxVal: 23, key: "hour" };
    if (activeTab === "dom") return { state: domState, minVal: 1, maxVal: 31, key: "dom" };
    if (activeTab === "mon") return { state: monState, minVal: 1, maxVal: 12, key: "mon" };
    return { state: dowState, minVal: 0, maxVal: 6, key: "dow" };
  };

  const renderTabContent = () => {
    const { state, minVal, maxVal, key } = getActiveFieldState();

    const handleTypeChange = (type: "every" | "interval" | "range" | "specific") => {
      updateFieldState(key, { ...state, type });
    };

    const formatItemVal = (val: number): string => {
      if (key === "mon") return MONTH_FULL[val - 1] || String(val);
      if (key === "dow") return DAY_FULL[val] || String(val);
      if (key === "hour") {
        const ampm = val >= 12 ? "PM" : "AM";
        const displayHour = val % 12 === 0 ? 12 : val % 12;
        return `${displayHour} ${ampm} (${val})`;
      }
      return String(val).padStart(2, "0");
    };

    return (
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["every", "interval", "range", "specific"] as const).map((t) => (
            <label
              key={t}
              className={`border px-3 py-2 text-[10px] font-bold uppercase cursor-pointer flex items-center justify-between transition-all select-none ${
                state.type === t
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              <span>{t}</span>
              <input
                type="radio"
                name={`radio-${key}`}
                checked={state.type === t}
                onChange={() => handleTypeChange(t)}
                className="sr-only"
              />
            </label>
          ))}
        </div>

        <div className="border border-zinc-900 bg-zinc-950 p-4 space-y-4 min-h-[140px] flex flex-col justify-center">
          {state.type === "every" && (
            <div className="text-center text-xs text-zinc-400 font-bold">
              Matches every single value for this field. (represented as <code className="text-primary font-mono">*</code>)
            </div>
          )}

          {state.type === "interval" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold block mb-1">RUN EVERY:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={maxVal - minVal}
                      value={state.interval}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(maxVal - minVal, parseInt(e.target.value, 10) || 1));
                        updateFieldState(key, { ...state, interval: val });
                      }}
                      className="w-20 border-2 border-foreground bg-black px-2 py-1 text-xs text-foreground text-center"
                    />
                    <span className="text-xs text-zinc-400 font-bold">units</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold block mb-1">STARTING OFFSET:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={minVal}
                      max={maxVal}
                      value={state.intervalStart}
                      onChange={(e) => {
                        const val = Math.max(minVal, Math.min(maxVal, parseInt(e.target.value, 10) || minVal));
                        updateFieldState(key, { ...state, intervalStart: val });
                      }}
                      className="w-20 border-2 border-foreground bg-black px-2 py-1 text-xs text-foreground text-center"
                    />
                    <span className="text-xs text-zinc-400 font-bold">({formatItemVal(state.intervalStart)})</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-zinc-500 italic">
                Generated pattern: <code className="text-accent">{state.intervalStart === minVal ? `*/${state.interval}` : `${state.intervalStart}/${state.interval}`}</code>
              </div>
            </div>
          )}

          {state.type === "range" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold block mb-1">FROM VALUE:</label>
                  <select
                    value={state.rangeStart}
                    onChange={(e) => {
                      const start = parseInt(e.target.value, 10);
                      const end = Math.max(start, state.rangeEnd);
                      updateFieldState(key, { ...state, rangeStart: start, rangeEnd: end });
                    }}
                    className="w-full border-2 border-foreground bg-black p-1 text-xs text-foreground"
                  >
                    {Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i).map((num) => (
                      <option key={num} value={num}>{formatItemVal(num)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold block mb-1">TO VALUE:</label>
                  <select
                    value={state.rangeEnd}
                    onChange={(e) => {
                      const end = parseInt(e.target.value, 10);
                      const start = Math.min(end, state.rangeStart);
                      updateFieldState(key, { ...state, rangeStart: start, rangeEnd: end });
                    }}
                    className="w-full border-2 border-foreground bg-black p-1 text-xs text-foreground"
                  >
                    {Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i).map((num) => (
                      <option key={num} value={num} disabled={num < state.rangeStart}>{formatItemVal(num)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="text-[10px] text-zinc-500 italic">
                Generated pattern: <code className="text-accent">{state.rangeStart}-{state.rangeEnd}</code>
              </div>
            </div>
          )}

          {state.type === "specific" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-zinc-500 font-bold">TOGGLE ACTIVE VALUES:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const allVals = Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i);
                      updateFieldState(key, { ...state, specific: allVals });
                    }}
                    className="text-[9px] text-primary hover:underline font-bold cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-zinc-800">|</span>
                  <button
                    onClick={() => {
                      updateFieldState(key, { ...state, specific: [] });
                    }}
                    className="text-[9px] text-zinc-500 hover:underline font-bold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className={`grid gap-1 max-h-[160px] overflow-y-auto ${
                key === "min" 
                  ? "grid-cols-6 sm:grid-cols-10" 
                  : key === "hour" 
                    ? "grid-cols-4 sm:grid-cols-6" 
                    : key === "dom" 
                      ? "grid-cols-5 sm:grid-cols-7" 
                      : "grid-cols-2 sm:grid-cols-4"
              }`}>
                {Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i).map((num) => {
                  const isChecked = state.specific.includes(num);
                  return (
                    <button
                      key={num}
                      onClick={() => {
                        const newSpecific = isChecked
                          ? state.specific.filter((v) => v !== num)
                          : [...state.specific, num];
                        updateFieldState(key, { ...state, specific: newSpecific });
                      }}
                      className={`p-1 text-[10px] font-bold border transition-all cursor-pointer text-center rounded-[2px] ${
                        isChecked
                          ? "border-primary bg-primary text-primary-foreground font-black"
                          : "border-zinc-900 bg-black text-zinc-500 hover:border-zinc-800 hover:text-zinc-300"
                      }`}
                    >
                      {key === "mon" ? MONTH_NAMES[num - 1] : key === "dow" ? DAY_NAMES[num] : String(num).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-mono text-zinc-200">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">CRON EXPRESSION DESCRIPTOR & BUILDER</span>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
        <div className="lg:col-span-2 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-400 font-bold block">CRON EXPRESSION (5 FIELDS):</span>
            {error ? (
              <span className="text-[9px] text-red-400 font-bold bg-red-950/20 px-2 py-0.5 border border-red-900 rounded-[2px]">INVALID</span>
            ) : (
              <span className="text-[9px] text-green-400 font-bold bg-green-950/20 px-2 py-0.5 border border-green-900 rounded-[2px]">VALID SCHEDULE</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="e.g. 0 0 * * *"
              className="flex-grow neo-input h-10 text-accent font-black tracking-widest text-sm uppercase"
            />
            {expr && <CopyBtn value={expr} />}
          </div>
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] text-zinc-400 font-bold block">LOAD COMMON PRESET:</span>
          <select
            onChange={(e) => {
              if (e.target.value) {
                setExpr(e.target.value);
                e.target.value = "";
              }
            }}
            className="w-full border-2 border-foreground bg-black px-2 h-10 text-xs text-foreground cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Select presets...</option>
            {PRESETS.map((p) => (
              <option key={p.value} value={p.value}>{p.name} ({p.value})</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="border-2 border-destructive bg-red-950/20 p-3 text-xs text-red-400 font-bold">
          PARSER ERROR: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parsed Description and Next Run Predictions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-2 border-border bg-zinc-950/40 p-4 space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-15 transition-opacity">
              <Sparkles className="w-12 h-12 text-accent" />
            </div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">HUMAN-READABLE SCHEDULE</span>
            <div className="text-sm font-bold text-accent leading-relaxed">
              {error ? "Please enter a valid expression." : description || "Waiting..."}
            </div>
          </div>

          {!error && (
            <div className="border-2 border-border bg-zinc-950 p-4 space-y-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">FIELD BREAKDOWN</span>
              <div className="divide-y divide-zinc-900 text-xs font-bold space-y-2">
                {FIELDS_META.map((f, idx) => {
                  const parts = expr.trim().split(/\s+/);
                  const val = parts[idx] || "*";
                  let meaning = "";
                  try {
                    meaning = fieldToHuman(val, f.key as any);
                  } catch (e) {
                    meaning = "Invalid field pattern";
                  }
                  return (
                    <div key={f.key} className="pt-2 flex items-start gap-4 justify-between">
                      <div className="w-32 shrink-0">
                        <span className="text-zinc-500 text-[10px] block uppercase">{f.name}</span>
                        <code className="text-primary text-xs bg-zinc-900 px-1 py-0.5 rounded font-mono">{val}</code>
                      </div>
                      <div className="text-zinc-300 text-right select-all text-xs">
                        {meaning}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!error && nextRuns.length > 0 && (
            <div className="border border-foreground bg-black p-4 space-y-3">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">UPCOMING RUNS (LOCAL & UTC)</span>
              <div className="space-y-2">
                {nextRuns.map((date, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-2 text-[11px] gap-1">
                    <div className="font-bold text-zinc-300">
                      <span>{date.toLocaleString()}</span>
                      <span className="text-zinc-600 block text-[9px]">{date.toUTCString()}</span>
                    </div>
                    <div className="shrink-0 text-accent font-black text-right self-end sm:self-center">
                      {getRelativeTimeDesc(date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Builder */}
        <div className="lg:col-span-7 border-2 border-foreground bg-black p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-black uppercase text-zinc-400">VISUAL SCHEDULER BUILDER</span>
            <button
              onClick={() => syncFromExprString(expr)}
              className="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
              title="Reload form settings from current input text"
            >
              <RefreshCw className="w-3 h-3" /> Sync Form
            </button>
          </div>

          <div className="flex flex-wrap border-b border-zinc-900">
            {FIELDS_META.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? "border-primary text-primary bg-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
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

export function WordCharCounterTool({ defaultMode = "character" }: { defaultMode?: "character" | "word" | "line" }) {
  const [text, setText] = React.useState("")

  const stats = React.useMemo(() => {
    const charCount = text.length
    const charNoSpaces = text.replace(/\s/g, "").length
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length
    const lineCount = text === "" ? 0 : text.split("\n").length
    const sentenceCount = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    const paragraphCount = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
    
    // Estimations
    const readTime = Math.ceil(wordCount / 200)
    const speakTime = (wordCount / 130).toFixed(1)

    return {
      charCount,
      charNoSpaces,
      wordCount,
      lineCount,
      sentenceCount,
      paragraphCount,
      readTime,
      speakTime
    }
  }, [text])

  const analytics = React.useMemo(() => {
    if (!text.trim()) return { topWords: [], topChars: [] }

    // Word frequency
    const words = text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .split(/\s+/)
      .filter(Boolean)
    
    const wordFreq: Record<string, number> = {}
    words.forEach(w => {
      wordFreq[w] = (wordFreq[w] || 0) + 1
    })
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Character frequency (alphanumeric only)
    const chars = text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .split("")
    
    const charFreq: Record<string, number> = {}
    chars.forEach(c => {
      charFreq[c] = (charFreq[c] || 0) + 1
    })
    const topChars = Object.entries(charFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return { topWords, topChars }
  }, [text])

  const loadSample = () => {
    setText(
      "OpenDev Hub is a high-density developer sandbox workspace built with Next.js and Tailwind CSS.\n\n" +
      "It features formatting, encoding, and parsing utility widgets. All computations run 100% locally client-side in the browser, ensuring your data is kept secure and private.\n\n" +
      "Start typing, pasting, or playing around with these tools to see live stats update!"
    )
  }

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      setText(clipboardText)
    } catch (err) {
      // Fallback
    }
  }

  const trimWhitespace = () => {
    setText(text.replace(/\s+/g, " ").trim())
  }

  const removeEmptyLines = () => {
    setText(
      text
        .split("\n")
        .filter(line => line.trim() !== "")
        .join("\n")
    )
  }

  const convertCase = (type: "upper" | "lower" | "title" | "sentence") => {
    if (!text) return
    if (type === "upper") {
      setText(text.toUpperCase())
    } else if (type === "lower") {
      setText(text.toLowerCase())
    } else if (type === "title") {
      setText(
        text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
      )
    } else if (type === "sentence") {
      setText(
        text
          .toLowerCase()
          .replace(/(^\s*|[.!?]\s+)([a-z])/g, m => m.toUpperCase())
      )
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
        <div>
          <span className="text-xs font-bold uppercase text-zinc-500 block">TEXT & METRIC ANALYSIS</span>
          <span className="text-[10px] text-zinc-400 font-bold block mt-0.5">
            REALTIME COUNTING & WHITESPACE UTILITIES
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadSample}
            className="px-2 py-1 bg-zinc-900 border border-zinc-700 hover:border-foreground hover:bg-black text-[10px] font-bold text-zinc-400 hover:text-foreground cursor-pointer transition-all flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3 text-accent" /> LOAD SAMPLE
          </button>
          <button
            onClick={() => setText("")}
            className="px-2 py-1 bg-red-950/20 border border-red-900/50 hover:border-red-500 hover:bg-red-950/40 text-[10px] font-bold text-red-400 cursor-pointer transition-all flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" /> CLEAR
          </button>
        </div>
      </div>

      {/* Grid of Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Character Card */}
        <div
          className={`border-2 p-3 bg-zinc-950 relative overflow-hidden transition-all ${
            defaultMode === "character"
              ? "border-primary shadow-[3px_3px_0px_0px_var(--primary)]"
              : "border-border shadow-[2px_2px_0px_0px_#27272a]"
          }`}
        >
          <div className="absolute top-1.5 right-1.5 opacity-10">
            <Hash className="h-8 w-8" />
          </div>
          <span className="text-[9px] text-zinc-500 font-black uppercase block">Characters</span>
          <div className="text-2xl font-black text-foreground mt-1">{stats.charCount}</div>
          <span className="text-[9px] text-zinc-400 font-bold block mt-0.5">
            {stats.charNoSpaces} without spaces
          </span>
        </div>

        {/* Word Card */}
        <div
          className={`border-2 p-3 bg-zinc-950 relative overflow-hidden transition-all ${
            defaultMode === "word"
              ? "border-accent shadow-[3px_3px_0px_0px_var(--accent)]"
              : "border-border shadow-[2px_2px_0px_0px_#27272a]"
          }`}
        >
          <div className="absolute top-1.5 right-1.5 opacity-10">
            <FileText className="h-8 w-8" />
          </div>
          <span className="text-[9px] text-zinc-500 font-black uppercase block">Words</span>
          <div className="text-2xl font-black text-foreground mt-1">{stats.wordCount}</div>
          <span className="text-[9px] text-zinc-400 font-bold block mt-0.5">
            Avg len: {stats.wordCount > 0 ? (stats.charNoSpaces / stats.wordCount).toFixed(1) : 0} chars
          </span>
        </div>

        {/* Line Card */}
        <div
          className={`border-2 p-3 bg-zinc-950 relative overflow-hidden transition-all ${
            defaultMode === "line"
              ? "border-yellow-500 shadow-[3px_3px_0px_0px_#eab308]"
              : "border-border shadow-[2px_2px_0px_0px_#27272a]"
          }`}
        >
          <div className="absolute top-1.5 right-1.5 opacity-10">
            <SlidersHorizontal className="h-8 w-8" />
          </div>
          <span className="text-[9px] text-zinc-500 font-black uppercase block">Lines</span>
          <div className="text-2xl font-black text-foreground mt-1">{stats.lineCount}</div>
          <span className="text-[9px] text-zinc-400 font-bold block mt-0.5">
            {text.split("\n").filter(l => l.trim() === "").length} blank lines
          </span>
        </div>

        {/* Read/Speak Time Card */}
        <div className="border-2 border-border p-3 bg-zinc-950 shadow-[2px_2px_0px_0px_#27272a] relative overflow-hidden">
          <div className="absolute top-1.5 right-1.5 opacity-10">
            <BookOpen className="h-8 w-8" />
          </div>
          <span className="text-[9px] text-zinc-500 font-black uppercase block">Reading / Speaking</span>
          <div className="text-lg font-black text-foreground mt-1">
            ~{stats.readTime}m / {stats.speakTime}m
          </div>
          <span className="text-[9px] text-zinc-400 font-bold block mt-1.5">
            {stats.paragraphCount} paragraphs · {stats.sentenceCount} sentences
          </span>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-bold block">PASTE OR TYPE YOUR TEXT:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePaste}
                className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 hover:border-foreground hover:bg-black text-[9px] font-bold text-zinc-400 hover:text-foreground cursor-pointer transition-all flex items-center gap-1"
                title="Paste from clipboard"
              >
                <Clipboard className="h-2.5 w-2.5" /> PASTE
              </button>
              {text && <CopyBtn value={text} />}
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or pasting text here..."
            className="w-full h-72 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700 resize-none font-mono"
          />

          {/* Quick Actions Row */}
          <div className="flex flex-wrap gap-2 pt-1.5">
            <button
              onClick={trimWhitespace}
              disabled={!text}
              className="px-2.5 py-1 border border-zinc-800 bg-zinc-950 hover:border-foreground hover:bg-black text-[10px] font-bold text-zinc-400 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all uppercase"
            >
              Trim Spaces
            </button>
            <button
              onClick={removeEmptyLines}
              disabled={!text}
              className="px-2.5 py-1 border border-zinc-800 bg-zinc-950 hover:border-foreground hover:bg-black text-[10px] font-bold text-zinc-400 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all uppercase"
            >
              Remove Blank Lines
            </button>
            <button
              onClick={() => convertCase("upper")}
              disabled={!text}
              className="px-2.5 py-1 border border-zinc-800 bg-zinc-950 hover:border-foreground hover:bg-black text-[10px] font-bold text-zinc-400 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all uppercase"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => convertCase("lower")}
              disabled={!text}
              className="px-2.5 py-1 border border-zinc-800 bg-zinc-950 hover:border-foreground hover:bg-black text-[10px] font-bold text-zinc-400 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all uppercase"
            >
              lowercase
            </button>
            <button
              onClick={() => convertCase("title")}
              disabled={!text}
              className="px-2.5 py-1 border border-zinc-800 bg-zinc-950 hover:border-foreground hover:bg-black text-[10px] font-bold text-zinc-400 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all uppercase"
            >
              Title Case
            </button>
            <button
              onClick={() => convertCase("sentence")}
              disabled={!text}
              className="px-2.5 py-1 border border-zinc-800 bg-zinc-950 hover:border-foreground hover:bg-black text-[10px] font-bold text-zinc-400 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all uppercase"
            >
              Sentence Case
            </button>
          </div>
        </div>

        {/* Frequency & Density Analysis */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold block mb-1.5 uppercase">Word Density (Top 5)</span>
            <div className="border border-border bg-zinc-950 p-3 min-h-[148px] flex flex-col justify-center">
              {!text.trim() ? (
                <span className="text-[10px] text-zinc-600 italic block text-center">
                  No word data. Type some text to analyze frequency.
                </span>
              ) : (
                <div className="space-y-2">
                  {analytics.topWords.map(([word, count]) => {
                    const totalWords = text.trim().split(/\s+/).filter(Boolean).length
                    const percentage = totalWords > 0 ? ((count / totalWords) * 100).toFixed(1) : 0
                    return (
                      <div key={word} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold text-[10px]">
                          <span className="text-accent truncate max-w-[120px]">"{word}"</span>
                          <span className="text-zinc-400">
                            {count}x ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 border border-zinc-800">
                          <div
                            className="bg-accent h-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-zinc-400 font-bold block mb-1.5 uppercase">Letter Density (Top 5)</span>
            <div className="border border-border bg-zinc-950 p-3 min-h-[148px] flex flex-col justify-center">
              {!text.trim() ? (
                <span className="text-[10px] text-zinc-600 italic block text-center">
                  No letter data. Type some text to analyze frequency.
                </span>
              ) : (
                <div className="space-y-2">
                  {analytics.topChars.map(([char, count]) => {
                    const totalChars = text.toLowerCase().replace(/[^a-z0-9]/g, "").length
                    const percentage = totalChars > 0 ? ((count / totalChars) * 100).toFixed(1) : 0
                    return (
                      <div key={char} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold text-[10px]">
                          <span className="text-primary uppercase">"{char}"</span>
                          <span className="text-zinc-400">
                            {count}x ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 border border-zinc-800">
                          <div
                            className="bg-primary h-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
