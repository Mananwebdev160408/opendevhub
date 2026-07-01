"use client"

import * as React from "react"
import { GitBranch, GitCommit, RefreshCw, GitPullRequest, Plus, ZoomIn, ZoomOut } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Commit {
  id: string
  hash: string
  branch: string
  msg: string
  x: number
  y: number
  parents: string[]
}

interface BranchMeta {
  name: string
  color: string
  y: number
  forkFromBranch: string | null
  forkAtX: number | null
  forkCommitId: string | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BRANCH_COLORS = [
  "#a855f7", // purple  — main
  "#2dd4bf", // teal
  "#f59e0b", // amber
  "#ef4444", // red
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f97316", // orange
  "#e879f9", // fuchsia
]

const COMMIT_MESSAGES = [
  "feat: initialize app layout",
  "fix: overlapping bento grid borders",
  "style: configure custom scrollbars",
  "docs: draft repository readme",
  "refactor: decouple toolbox services",
  "test: write tests for base64 decoder",
  "feat: integrate public api directory",
  "style: refine hero search alignment",
  "chore: bundle bundle-analyzer logs",
  "fix: standard headers in dev tools",
]

const BRANCH_Y_BASE = 50
const BRANCH_Y_GAP = 70

const INITIAL_BRANCHES: BranchMeta[] = [
  { name: "main", color: BRANCH_COLORS[0], y: BRANCH_Y_BASE, forkFromBranch: null, forkAtX: null, forkCommitId: null },
]

const INITIAL_COMMITS: Commit[] = [
  {
    id: "c1",
    hash: "8a3d2e1",
    branch: "main",
    msg: "chore: initial commit",
    x: 1,
    y: BRANCH_Y_BASE,
    parents: [],
  },
]

// Pick white or black text based on background luminance
function labelTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? "#000000" : "#ffffff"
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GitVisualizer() {
  const [commits, setCommits] = React.useState<Commit[]>(INITIAL_COMMITS)
  const [branches, setBranches] = React.useState<BranchMeta[]>(INITIAL_BRANCHES)
  const [activeBranch, setActiveBranch] = React.useState<string>("main")
  const [nextX, setNextX] = React.useState<number>(2)
  const [logs, setLogs] = React.useState<string[]>([
    "$ git init",
    "Initialized empty Git repository in /workspace/opendevhub/",
  ])
  const [msgIndex, setMsgIndex] = React.useState<number>(0)
  const [newBranchName, setNewBranchName] = React.useState<string>("")
  const [mergeTarget, setMergeTarget] = React.useState<string>("main")
  const [zoom, setZoom] = React.useState<number>(1.0)

  const logsContainerRef = React.useRef<HTMLDivElement>(null)
  const graphContainerRef = React.useRef<HTMLDivElement>(null)

  // Drag-to-scroll / panning states
  const [isDragging, setIsDragging] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const [startY, setStartY] = React.useState(0)
  const [scrollLeft, setScrollLeft] = React.useState(0)
  const [scrollTop, setScrollTop] = React.useState(0)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    // Avoid dragging when clicking control buttons, selectors, SVG interactives or text inputs
    if (
      target.closest('.z-20') ||
      target.closest('button') ||
      target.closest('select') ||
      target.closest('circle') ||
      target.closest('a') ||
      target.closest('input')
    ) {
      return
    }

    setIsDragging(true)
    const container = graphContainerRef.current
    if (container) {
      setStartX(e.pageX - container.offsetLeft)
      setStartY(e.pageY - container.offsetTop)
      setScrollLeft(container.scrollLeft)
      setScrollTop(container.scrollTop)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    e.preventDefault()
    const container = graphContainerRef.current
    if (container) {
      const x = e.pageX - container.offsetLeft
      const y = e.pageY - container.offsetTop
      const walkX = (x - startX) * 1.5
      const walkY = (y - startY) * 1.5
      container.scrollLeft = scrollLeft - walkX
      container.scrollTop = scrollTop - walkY
    }
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  // Auto-scroll logs to bottom
  React.useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
    }
  }, [logs])

  // Keep mergeTarget pointing at a valid, non-active branch
  React.useEffect(() => {
    const validTargets = branches.filter((b) => b.name !== activeBranch)
    if (!validTargets.find((b) => b.name === mergeTarget) && validTargets.length > 0) {
      setMergeTarget(validTargets[0].name)
    }
  }, [activeBranch, branches, mergeTarget])

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const getBranchMeta = (name: string): BranchMeta | undefined =>
    branches.find((b) => b.name === name)

  const getLatestCommit = (branchName: string): Commit | null => {
    const bc = commits.filter((c) => c.branch === branchName)
    if (bc.length === 0) return null
    return bc.reduce((prev, curr) => (prev.x > curr.x ? prev : curr))
  }

  const generateHash = () => Math.random().toString(16).substring(2, 9)

  // ─── Actions ──────────────────────────────────────────────────────────────

  const handleCommit = () => {
    const hash = generateHash()
    const msg = COMMIT_MESSAGES[msgIndex % COMMIT_MESSAGES.length]
    setMsgIndex((p) => p + 1)

    const meta = getBranchMeta(activeBranch)
    if (!meta) return
    const latest = getLatestCommit(activeBranch)
    
    let parentsList: string[] = []
    if (latest) {
      parentsList = [latest.id]
    } else if (meta.forkCommitId) {
      parentsList = [meta.forkCommitId]
    }

    const newCommit: Commit = {
      id: `c_${hash}`,
      hash,
      branch: activeBranch,
      msg,
      x: nextX,
      y: meta.y,
      parents: parentsList,
    }

    setCommits((p) => [...p, newCommit])
    setNextX((p) => p + 1)
    setLogs((p) => [
      ...p,
      `$ git commit -m "${msg}"`,
      `[${activeBranch} ${hash}] ${msg}`,
      ` 1 file changed, ${Math.floor(Math.random() * 20) + 1} insertions(+)`,
    ])
  }

  const handleCreateBranch = () => {
    const name = newBranchName.trim().replace(/\s+/g, "-").toLowerCase()
    if (!name) {
      setLogs((p) => [...p, "$ git checkout -b", "error: branch name cannot be empty."])
      return
    }
    if (branches.find((b) => b.name === name)) {
      setLogs((p) => [...p, `$ git checkout -b ${name}`, `fatal: A branch named '${name}' already exists.`])
      setNewBranchName("")
      return
    }

    const colorIndex = branches.length % BRANCH_COLORS.length
    const newY = BRANCH_Y_BASE + branches.length * BRANCH_Y_GAP
    const forkPoint = getLatestCommit(activeBranch)

    setBranches((p) => [
      ...p,
      {
        name,
        color: BRANCH_COLORS[colorIndex],
        y: newY,
        forkFromBranch: activeBranch,
        forkAtX: forkPoint ? forkPoint.x : 1,
        forkCommitId: forkPoint ? forkPoint.id : null,
      },
    ])
    setActiveBranch(name)
    setNewBranchName("")
    setLogs((p) => [...p, `$ git checkout -b ${name}`, `Switched to a new branch '${name}'`])
  }

  const handleCheckout = (branchName: string) => {
    if (branchName === activeBranch) {
      setLogs((p) => [...p, `$ git checkout ${branchName}`, `Already on '${branchName}'`])
      return
    }
    setActiveBranch(branchName)
    setLogs((p) => [...p, `$ git checkout ${branchName}`, `Switched to branch '${branchName}'`])
  }

  const handleMerge = () => {
    const target = mergeTarget
    if (activeBranch === target) return

    const targetMeta = getBranchMeta(target)
    if (!targetMeta) return

    const latestActive = getLatestCommit(activeBranch)
    if (!latestActive) {
      setLogs((p) => [
        ...p,
        `$ git merge ${activeBranch}`,
        `Already up to date. (No commits on '${activeBranch}')`,
      ])
      return
    }

    const latestTarget = getLatestCommit(target)
    const hash = generateHash()
    const mergeCommit: Commit = {
      id: `c_${hash}`,
      hash,
      branch: target,
      msg: `Merge branch '${activeBranch}' into ${target}`,
      x: nextX,
      y: targetMeta.y,
      parents: [...(latestTarget ? [latestTarget.id] : []), latestActive.id],
    }

    setCommits((p) => [...p, mergeCommit])
    setNextX((p) => p + 1)
    // Remove merged branch from branch list
    setBranches((p) => p.filter((b) => b.name !== activeBranch))
    setActiveBranch(target)
    setLogs((p) => [
      ...p,
      `$ git merge ${activeBranch}`,
      `Merge made by the 'ort' strategy.`,
      `[${target} ${hash}] Merge branch '${activeBranch}' into ${target}`,
    ])
  }

  const handleRebase = () => {
    if (activeBranch === "main") {
      setLogs((p) => [...p, `$ git rebase main`, `error: Cannot rebase 'main' onto itself.`])
      return
    }
    const latestMain = getLatestCommit("main")
    if (!latestMain) return

    const branchCommits = commits.filter((c) => c.branch === activeBranch)
    if (branchCommits.length === 0) {
      setLogs((p) => [...p, `$ git rebase main`, `Current branch ${activeBranch} is up to date.`])
      return
    }

    const sorted = [...branchCommits].sort((a, b) => a.x - b.x)
    const startX = latestMain.x + 1
    const base = commits.filter((c) => c.branch !== activeBranch)

    let lastParentId = latestMain.id
    const rebased: Commit[] = sorted.map((item, idx) => {
      const newHash = generateHash()
      const newC: Commit = { ...item, id: `c_${newHash}`, hash: newHash, x: startX + idx, parents: [lastParentId] }
      lastParentId = newC.id
      return newC
    })

    setCommits([...base, ...rebased])
    setBranches((p) =>
      p.map((b) => (b.name === activeBranch ? { ...b, forkAtX: latestMain.x, forkCommitId: latestMain.id, forkFromBranch: "main" } : b))
    )
    setNextX(startX + rebased.length)
    setLogs((p) => [
      ...p,
      `$ git rebase main`,
      `Rewinding head to replay commits on top of main...`,
      ...rebased.map((c) => `Applying: ${c.msg} (new hash: ${c.hash})`),
      `Successfully rebased and updated refs/heads/${activeBranch}.`,
    ])
  }

  const handleDeleteBranch = (branchName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (branchName === "main") {
      setLogs((p) => [...p, `$ git branch -d main`, `error: Cannot delete 'main'.`])
      return
    }
    if (branchName === activeBranch) {
      setLogs((p) => [
        ...p,
        `$ git branch -d ${branchName}`,
        `error: Cannot delete the currently checked out branch '${branchName}'.`,
      ])
      return
    }
    setBranches((p) => p.filter((b) => b.name !== branchName))
    setCommits((p) => p.filter((c) => c.branch !== branchName))
    setLogs((p) => [...p, `$ git branch -d ${branchName}`, `Deleted branch ${branchName}.`])
  }

  const handleReset = () => {
    setCommits(INITIAL_COMMITS)
    setBranches(INITIAL_BRANCHES)
    setActiveBranch("main")
    setNextX(2)
    setMsgIndex(0)
    setNewBranchName("")
    setMergeTarget("main")
    setLogs(["$ git init", "Initialized empty Git repository in /workspace/opendevhub/"])
  }

  // ─── Derived layout values ─────────────────────────────────────────────────

  const svgHeight = Math.max(140, BRANCH_Y_BASE + (branches.length - 1) * BRANCH_Y_GAP + 60)
  const viewWidth = Math.max(720, nextX * 65 + 50)
  const validMergeTargets = branches.filter((b) => b.name !== activeBranch)

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section className="w-full min-h-[100vh] border-t-4 border-foreground py-16 px-4 sm:px-6 lg:px-8 bg-black flex flex-col justify-center">
      <div className="w-full max-w-5xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-foreground bg-accent text-accent-foreground font-mono text-[10px] font-black uppercase tracking-wider">
            <GitBranch className="h-3.5 w-3.5 animate-pulse" />
            <span>INTERACTIVE GIT GRAPH</span>
          </div>
          <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-foreground">
            Git Branching Sandbox
          </h2>
          <p className="font-mono text-xs text-muted-foreground max-w-xl mx-auto">
            Create unlimited named branches, commit, merge into any target, rebase onto main, or delete branches. Watch the graph rewrite in real time.
          </p>
        </div>

        <div className="w-full border-4 border-foreground bg-zinc-950 shadow-[6px_6px_0px_0px_var(--primary)] flex flex-col overflow-hidden">

          {/* ── Terminal title bar ── */}
          <div className="border-b-2 border-foreground bg-zinc-900 px-4 py-2 flex items-center justify-between select-none font-mono text-[10px] text-muted-foreground font-bold uppercase gap-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border border-foreground bg-red-500" />
              <div className="h-3 w-3 rounded-full border border-foreground bg-yellow-500" />
              <div className="h-3 w-3 rounded-full border border-foreground bg-green-500" />
            </div>
            <span className="truncate">opendevhub-git-sandbox.sh</span>
            <span className="text-accent font-black shrink-0 flex items-center gap-1">
              HEAD → {activeBranch}
            </span>
          </div>

          {/* ── Branch legend / checkout bar ── */}
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap gap-2 select-none min-h-[42px] items-center">
            {branches.map((b) => (
              <button
                key={b.name}
                onClick={() => handleCheckout(b.name)}
                className={`flex items-center gap-1.5 px-2.5 py-1 border-2 font-mono text-[10px] font-black uppercase transition-all cursor-pointer ${
                  activeBranch === b.name
                    ? "shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)]"
                    : "border-zinc-700 opacity-50 hover:opacity-80 hover:border-zinc-500"
                }`}
                style={{
                  borderColor: activeBranch === b.name ? b.color : undefined,
                  color: activeBranch === b.name ? b.color : undefined,
                }}
              >
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                {b.name}
                {b.name !== "main" && (
                  <span
                    onClick={(e) => handleDeleteBranch(b.name, e)}
                    className="ml-0.5 text-zinc-600 hover:text-red-400 cursor-pointer font-black leading-none"
                    title={`Delete branch '${b.name}'`}
                  >
                    ×
                  </span>
                )}
              </button>
            ))}
            {branches.length === 1 && (
              <span className="text-zinc-700 font-mono text-[10px] italic">
                — create a branch below to get started
              </span>
            )}
          </div>

          {/* ── SVG commit graph ── */}
          <div
            ref={graphContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`w-full overflow-auto p-6 bg-zinc-950 border-b-2 border-foreground bg-grid-pattern relative group/graph resize-y ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ 
              height: "320px",
              minHeight: "180px",
              maxHeight: "800px"
            }}
          >
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-black/80 border border-zinc-800 p-1 rounded backdrop-blur select-none">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-foreground transition-colors cursor-pointer rounded"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[9px] font-bold text-zinc-500 min-w-[32px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-foreground transition-colors cursor-pointer rounded"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              {zoom !== 1.0 && (
                <button
                  onClick={() => setZoom(1.0)}
                  className="p-1 hover:bg-zinc-800 text-[8px] font-black uppercase text-accent hover:text-primary transition-colors cursor-pointer rounded ml-1"
                  title="Reset Zoom"
                >
                  Reset
                </button>
              )}
            </div>

            <svg 
              width={viewWidth * zoom} 
              height={svgHeight * zoom} 
              className="overflow-visible select-none transition-all duration-150"
            >
              <g transform={`scale(${zoom})`} className="transition-transform duration-150" style={{ transformOrigin: "top left" }}>

              {/* Branch lane lines + name labels */}
              {branches.map((b) => (
                <React.Fragment key={`lane-${b.name}`}>
                  <line
                    x1="10" y1={b.y} x2={viewWidth - 10} y2={b.y}
                    stroke="#1f2937" strokeWidth="3" strokeDasharray="6 6"
                  />
                  <text
                    x="12" y={b.y - 12}
                    fill={b.color}
                    style={{ fontSize: "9px", fontWeight: 700, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}
                  >
                    {b.name}
                  </text>
                </React.Fragment>
              ))}

              {/* Fork origin dashed connectors — only shown if the branch has 0 commits */}
              {branches
                .filter((b) => b.forkFromBranch !== null && b.forkAtX !== null)
                .map((b) => {
                  const hasCommits = commits.some((c) => c.branch === b.name)
                  if (hasCommits) return null

                  const parentMeta = getBranchMeta(b.forkFromBranch!)
                  if (!parentMeta) return null
                  const px = b.forkAtX! * 65 + 30
                  const py = parentMeta.y
                  const cx = (b.forkAtX! + 1) * 65 + 30
                  const cy = b.y
                  return (
                    <path
                      key={`fork-${b.name}`}
                      d={`M ${px} ${py} C ${(px + cx) / 2} ${py}, ${(px + cx) / 2} ${cy}, ${cx} ${cy}`}
                      stroke={b.color}
                      strokeWidth="2"
                      strokeDasharray="5 4"
                      fill="none"
                      opacity="0.45"
                    />
                  )
                })}

              {/* Commit edges */}
              {commits.map((c) => {
                const cx = c.x * 65 + 30
                const cy = c.y
                return c.parents.map((pId) => {
                  const parent = commits.find((pc) => pc.id === pId)
                  if (!parent) return null
                  const px = parent.x * 65 + 30
                  const py = parent.y
                  const color = getBranchMeta(c.branch)?.color ?? "#a855f7"
                  const d =
                    py !== cy
                      ? `M ${px} ${py} C ${(px + cx) / 2} ${py}, ${(px + cx) / 2} ${cy}, ${cx} ${cy}`
                      : `M ${px} ${py} L ${cx} ${cy}`
                  return (
                    <path
                      key={`${c.id}-${pId}`}
                      d={d}
                      stroke={color}
                      strokeWidth="3"
                      fill="none"
                      className="transition-all duration-300"
                    />
                  )
                })
              })}

              {/* Commit circles + HEAD labels */}
              {commits.map((c) => {
                const cx = c.x * 65 + 30
                const cy = c.y
                const meta = getBranchMeta(c.branch)
                const color = meta?.color ?? "#a855f7"
                const isHead = getLatestCommit(c.branch)?.id === c.id
                const isMainLane = meta?.y === BRANCH_Y_BASE

                // Label dimensions
                const truncName = c.branch.length > 11 ? c.branch.substring(0, 10) + "…" : c.branch
                const labelW = Math.max(truncName.length * 6 + 10, 32)
                // Place label above for main lane, below for all others
                const labelY = isMainLane ? cy - 32 : cy + 18

                return (
                  <g key={c.id} className="group cursor-pointer">
                    <circle
                      cx={cx} cy={cy} r="12"
                      fill={color} stroke="#ffffff" strokeWidth="2.5"
                      className="hover:scale-125 transition-transform duration-200"
                    />
                    <text
                      x={cx} y={cy + 3.5}
                      textAnchor="middle"
                      style={{ fontSize: "8px", fontWeight: 900, fontFamily: "monospace", pointerEvents: "none", fill: "#000" }}
                    >
                      {c.hash.substring(0, 3)}
                    </text>
                    <title>{`[${c.hash}] ${c.msg}`}</title>

                    {isHead && (
                      <g transform={`translate(${cx - labelW / 2}, ${labelY})`}>
                        <rect width={labelW} height="13" fill={color} stroke="#ffffff" strokeWidth="1" />
                        <text
                          x={labelW / 2} y="9.5"
                          textAnchor="middle"
                          style={{
                            fontSize: "7px",
                            fontWeight: 900,
                            fontFamily: "monospace",
                            textTransform: "uppercase",
                            fill: labelTextColor(color),
                          }}
                        >
                          {truncName}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
              </g>
            </svg>
          </div>

          {/* ── Terminal log output ── */}
          <div
            ref={logsContainerRef}
            className="p-4 bg-zinc-950 font-mono text-xs max-h-[130px] overflow-y-auto border-b-2 border-foreground scrollbar-thin divide-y divide-zinc-900 bg-dot-pattern"
          >
            {logs.map((log, i) => (
              <div key={i} className={`py-1 ${log.startsWith("$") ? "text-zinc-400" : "text-green-400 pl-3"}`}>
                {log}
              </div>
            ))}
          </div>

          {/* ── Action buttons ── */}
          <div className="bg-zinc-900 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={handleCommit}
              className="border-2 border-foreground p-2 bg-black font-mono font-bold text-[10px] uppercase text-foreground hover:bg-primary hover:text-white shadow-[2px_2px_0px_0px_var(--border)] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <GitCommit className="h-4 w-4 text-primary" />
              <span>git commit</span>
            </button>

            <button
              onClick={handleMerge}
              disabled={validMergeTargets.length === 0 || activeBranch === mergeTarget}
              className="border-2 border-foreground p-2 bg-black font-mono font-bold text-[10px] uppercase text-foreground hover:bg-accent hover:text-black disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_var(--border)] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <GitPullRequest className="h-4 w-4 text-accent" />
              <span className="truncate max-w-full">merge → {mergeTarget}</span>
            </button>

            <button
              onClick={handleRebase}
              disabled={activeBranch === "main"}
              className="border-2 border-foreground p-2 bg-black font-mono font-bold text-[10px] uppercase text-foreground hover:bg-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_var(--border)] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <GitCommit className="h-4 w-4 text-primary" />
              <span>rebase → main</span>
            </button>

            {/* Merge target selector */}
            <div className="border-2 border-foreground p-2 bg-black font-mono text-[10px] uppercase flex flex-col gap-1.5">
              <span className="text-zinc-600 font-bold text-[9px] select-none">MERGE TARGET:</span>
              <select
                value={mergeTarget}
                onChange={(e) => setMergeTarget(e.target.value)}
                disabled={validMergeTargets.length === 0}
                className="bg-zinc-900 border border-zinc-700 text-foreground px-1 py-0.5 text-[10px] font-bold uppercase focus:outline-none cursor-pointer w-full disabled:opacity-40"
              >
                {validMergeTargets.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
                {validMergeTargets.length === 0 && (
                  <option value="">— no other branches</option>
                )}
              </select>
            </div>
          </div>

          {/* ── Create branch input ── */}
          <div className="bg-zinc-950 px-4 py-3 border-t-2 border-foreground flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-grow flex items-center border-2 border-zinc-700 bg-black focus-within:border-accent transition-colors min-w-0">
              <span className="px-3 text-zinc-600 font-mono text-[10px] font-bold shrink-0 select-none">
                $ git checkout -b
              </span>
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateBranch() }}
                placeholder="new-branch-name"
                className="flex-grow min-w-0 bg-transparent text-foreground font-mono text-xs py-2 pr-3 focus:outline-none placeholder:text-zinc-700"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleCreateBranch}
                className="flex items-center gap-1.5 px-4 py-2 border-2 border-foreground bg-accent text-black font-mono font-black text-[10px] uppercase hover:bg-primary hover:text-white shadow-[2px_2px_0px_0px_var(--border)] active:translate-y-[1px] active:shadow-none cursor-pointer transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                CREATE
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 border-2 border-zinc-800 bg-transparent text-red-500 font-mono font-black text-[10px] uppercase hover:border-red-800 hover:bg-red-950/30 cursor-pointer transition-all"
              >
                <RefreshCw className="h-3 w-3" />
                RESET
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
