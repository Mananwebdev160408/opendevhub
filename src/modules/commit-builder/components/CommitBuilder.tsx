"use client"

import * as React from "react"
import { Copy, Check, Terminal, Info, AlertTriangle, AlertCircle } from "lucide-react"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
        copied
          ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
          : "bg-black border-foreground text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_#ffffff]"
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? "COPIED" : "COPY MESSAGE"}</span>
    </button>
  )
}

interface CommitTypeOption {
  name: string
  desc: string
  color: string
}

export function CommitBuilder() {
  const commitTypes: CommitTypeOption[] = [
    { name: "feat", desc: "A new user-facing feature", color: "text-green-400" },
    { name: "fix", desc: "A bug fix", color: "text-red-400" },
    { name: "docs", desc: "Documentation only changes", color: "text-blue-400" },
    { name: "style", desc: "Formatting, missing semi-colons, style tweaks", color: "text-purple-400" },
    { name: "refactor", desc: "A code change that neither fixes a bug nor adds a feature", color: "text-amber-400" },
    { name: "perf", desc: "A code change that improves performance", color: "text-cyan-400" },
    { name: "test", desc: "Adding missing tests or correcting existing tests", color: "text-indigo-400" },
    { name: "build", desc: "Changes that affect the build system or external dependencies", color: "text-rose-400" },
    { name: "ci", desc: "Changes to CI files and runner configurations", color: "text-emerald-400" },
    { name: "chore", desc: "Chore tasks, config setups, and house-keeping tasks", color: "text-zinc-400" }
  ]

  const [activeType, setActiveType] = React.useState("feat")
  const [scope, setScope] = React.useState("")
  const [subject, setSubject] = React.useState("add user registration api endpoints")
  const [body, setBody] = React.useState("")
  const [isBreaking, setIsBreaking] = React.useState(false)
  const [breakingDesc, setBreakingDesc] = React.useState("")
  const [footerIssues, setFooterIssues] = React.useState("")

  const compiledCommit = React.useMemo(() => {
    let header = activeType
    if (scope.trim()) {
      header += `(${scope.trim()})`
    }
    if (isBreaking) {
      header += `!`
    }
    header += `: ${subject.trim()}`

    let full = header
    if (body.trim()) {
      full += `\n\n${body.trim()}`
    }
    if (isBreaking && breakingDesc.trim()) {
      full += `\n\nBREAKING CHANGE: ${breakingDesc.trim()}`
    }
    if (footerIssues.trim()) {
      full += `\n\n${footerIssues.trim()}`
    }
    return full
  }, [activeType, scope, subject, body, isBreaking, breakingDesc, footerIssues])

  const subjectLength = subject.trim().length
  const isSubjectTooLong = subjectLength > 72

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          COMMIT BUILDER
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-accent animate-pulse" />
          <span>CONVENTIONAL COMMIT MESSAGE BUILDER</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Construct structured commit messages matching the Conventional Commit specification. Select types, describe changes, declare breakages, and check message lengths.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel - 5 Columns */}
        <div className="lg:col-span-5 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--accent)] space-y-5">
          <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase font-bold">COMMIT METADATA</span>
          
          <div className="space-y-4 text-xs font-bold">
            {/* Type selector */}
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase block">SELECT COMMIT TYPE</label>
              <div className="grid grid-cols-2 gap-1.5">
                {commitTypes.map((type) => {
                  const isSelected = activeType === type.name
                  return (
                    <button
                      key={type.name}
                      onClick={() => setActiveType(type.name)}
                      className={`p-2 border border-border text-[9.5px] uppercase text-left flex flex-col justify-between cursor-pointer transition-all hover:bg-zinc-950 ${
                        isSelected
                          ? "bg-black border-foreground text-foreground shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,1)]"
                          : "text-zinc-500 border-zinc-800"
                      }`}
                    >
                      <span className={type.color}>{type.name}</span>
                      <span className="text-[7.5px] text-zinc-600 lowercase font-normal leading-normal mt-0.5">
                        {type.desc}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Scope */}
            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Scope (optional)</label>
              <input
                type="text"
                placeholder="e.g. auth, api, router, ui"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            {/* Subject */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] text-zinc-500 uppercase">Subject</label>
                <span className={`text-[8.5px] font-black ${isSubjectTooLong ? "text-red-400" : "text-zinc-500"}`}>
                  {subjectLength} / 72 chars
                </span>
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full border-2 bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none ${
                  isSubjectTooLong ? "border-red-500" : "border-foreground"
                }`}
              />
              {isSubjectTooLong && (
                <div className="text-[8.5px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Warning: Subject line exceeds recommended conventional commit limit (72 characters).</span>
                </div>
              )}
            </div>

            {/* Body */}
            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Body (optional)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Detail changes made in the code..."
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none h-20"
              />
            </div>

            {/* Breaking change */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="accent-primary"
                />
                <span className="text-[10px] text-red-400 uppercase font-black">Is Breaking Change? (!)</span>
              </label>

              {isBreaking && (
                <div>
                  <label className="block mb-1 text-[9px] text-zinc-500 uppercase">BREAKING CHANGE DESCRIPTION</label>
                  <input
                    type="text"
                    value={breakingDesc}
                    onChange={(e) => setBreakingDesc(e.target.value)}
                    placeholder="Describe what API/usage was broken..."
                    className="w-full border-2 border-red-800 bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Footer Issues */}
            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Footer References (optional)</label>
              <input
                type="text"
                placeholder="e.g. Closes #123, Fixes #45"
                value={footerIssues}
                onChange={(e) => setFooterIssues(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Output Panel - 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-4 border-foreground p-6 bg-zinc-950 min-h-[380px] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 select-none">
              <span className="text-[9px] font-black text-black bg-zinc-200 border border-zinc-400 px-2 py-0.5 uppercase">
                Compiled Commit Log
              </span>
              <CopyButton text={compiledCommit} />
            </div>

            <pre className="flex-grow bg-black border border-border p-4 text-xs text-primary font-bold overflow-x-auto leading-relaxed select-all whitespace-pre-wrap">
              <code>{compiledCommit}</code>
            </pre>

            <div className="flex gap-2 items-center text-[9px] text-zinc-500 select-none mt-6 border-t border-zinc-800 pt-3">
              <Info className="h-3.5 w-3.5 text-accent" />
              <span>Copy and paste this message directly into your git commit dialog.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
