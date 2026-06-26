"use client"

import * as React from "react"
import { GitBranch, GitCommit, HelpCircle, RefreshCw, GitPullRequest, ArrowRightLeft } from "lucide-react"

interface Commit {
  id: string
  hash: string
  branch: "main" | "feature"
  msg: string
  x: number // horizontal slot index
  y: number // y coordinate: main=40, feature=100
  parents: string[]
}

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
  "fix: standard headers in dev tools"
]

export function GitVisualizer() {
  const [commits, setCommits] = React.useState<Commit[]>([
    {
      id: "c1",
      hash: "8a3d2e1",
      branch: "main",
      msg: "chore: initial commit",
      x: 1,
      y: 40,
      parents: []
    }
  ])
  const [activeBranch, setActiveBranch] = React.useState<"main" | "feature">("main")
  const [hasFeatureBranch, setHasFeatureBranch] = React.useState<boolean>(false)
  const [featureForkX, setFeatureForkX] = React.useState<number | null>(null)
  const [nextX, setNextX] = React.useState<number>(2)
  const [logs, setLogs] = React.useState<string[]>([
    "$ git init",
    "Initialized empty Git repository in /workspace/opendevhub/"
  ])
  const [msgIndex, setMsgIndex] = React.useState<number>(0)

  // Container ref for scrolling logs
  const logsContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
    }
  }, [logs])

  // Get latest commit of a branch
  const getLatestCommitOfBranch = (branchName: "main" | "feature"): Commit | null => {
    const branchCommits = commits.filter(c => c.branch === branchName)
    if (branchCommits.length === 0) return null
    return branchCommits.reduce((prev, current) => (prev.x > current.x ? prev : current))
  }

  // Get absolute latest commit overall
  const getAbsoluteLatestCommit = (): Commit => {
    return commits.reduce((prev, current) => (prev.x > current.x ? prev : current))
  }

  const generateHash = () => {
    return Math.random().toString(16).substring(2, 9)
  }

  // 1. Commit action
  const handleCommit = () => {
    const hash = generateHash()
    const msg = COMMIT_MESSAGES[msgIndex % COMMIT_MESSAGES.length]
    setMsgIndex(prev => prev + 1)

    const latestMain = getLatestCommitOfBranch("main")
    const latestFeature = getLatestCommitOfBranch("feature")

    let newCommit: Commit

    if (activeBranch === "main") {
      newCommit = {
        id: `c_${hash}`,
        hash,
        branch: "main",
        msg,
        x: nextX,
        y: 40,
        parents: latestMain ? [latestMain.id] : []
      }
      setLogs(prev => [...prev, `$ git commit -m "${msg}"`, `[main ${hash}] ${msg}`, ` 1 file changed, 12 insertions(+)`])
    } else {
      // activeBranch is feature
      const parentId = latestFeature ? latestFeature.id : (latestMain ? latestMain.id : "")
      newCommit = {
        id: `c_${hash}`,
        hash,
        branch: "feature",
        msg,
        x: nextX,
        y: 100,
        parents: parentId ? [parentId] : []
      }
      setLogs(prev => [...prev, `$ git commit -m "${msg}"`, `[feature ${hash}] ${msg}`, ` 1 file changed, 8 insertions(+)`])
    }

    setCommits(prev => [...prev, newCommit])
    setNextX(prev => prev + 1)
  }

  // 2. Create feature branch action
  const handleCreateBranch = () => {
    if (hasFeatureBranch) {
      setLogs(prev => [...prev, "$ git checkout -b feature", "fatal: A branch named 'feature' already exists."])
      return
    }

    const latestMain = getLatestCommitOfBranch("main")
    const forkX = latestMain ? latestMain.x : 1

    setHasFeatureBranch(true)
    setFeatureForkX(forkX)
    setActiveBranch("feature")
    setLogs(prev => [...prev, "$ git checkout -b feature", "Switched to a new branch 'feature'"])
  }

  // 3. Switch branch
  const handleCheckout = (branch: "main" | "feature") => {
    if (branch === "feature" && !hasFeatureBranch) {
      setLogs(prev => [...prev, "$ git checkout feature", "error: pathspec 'feature' did not match any file(s) known to git"])
      return
    }

    setActiveBranch(branch)
    setLogs(prev => [...prev, `$ git checkout ${branch}`, `Switched to branch '${branch}'`])
  }

  // 4. Merge feature into main
  const handleMerge = () => {
    if (!hasFeatureBranch) {
      setLogs(prev => [...prev, "$ git merge feature", "merge: feature - not something we can merge"])
      return
    }

    if (activeBranch !== "main") {
      setLogs(prev => [...prev, "$ git merge feature", "error: You must be on 'main' branch to merge 'feature'."])
      return
    }

    const latestMain = getLatestCommitOfBranch("main")
    const latestFeature = getLatestCommitOfBranch("feature")

    if (!latestFeature) {
      setLogs(prev => [...prev, "$ git merge feature", "Already up to date. (No commits on feature)"])
      return
    }

    const hash = generateHash()
    const msg = `Merge branch 'feature' into main`
    
    const newCommit: Commit = {
      id: `c_${hash}`,
      hash,
      branch: "main",
      msg,
      x: nextX,
      y: 40,
      parents: [latestMain ? latestMain.id : "", latestFeature.id].filter(Boolean) as string[]
    }

    setCommits(prev => [...prev, newCommit])
    setNextX(prev => prev + 1)
    setHasFeatureBranch(false)
    setFeatureForkX(null)
    setLogs(prev => [
      ...prev, 
      "$ git merge feature", 
      "Updating commit tree structures...",
      `Fast-forward merge finalized under hash ${hash}`,
      `Merge made by the 'ort' strategy.`
    ])
  }

  // 5. Rebase feature onto main
  const handleRebase = () => {
    if (!hasFeatureBranch) {
      setLogs(prev => [...prev, "$ git rebase main", "error: no active feature branch found to rebase"])
      return
    }

    if (activeBranch !== "feature") {
      setLogs(prev => [...prev, "$ git rebase main", "error: You must checkout 'feature' branch first."])
      return
    }

    const latestMain = getLatestCommitOfBranch("main")
    if (!latestMain) return

    // Get all feature branch commits
    const featureCommits = commits.filter(c => c.branch === "feature")
    if (featureCommits.length === 0) {
      setLogs(prev => [...prev, "$ git rebase main", "Current branch feature is up to date."])
      return
    }

    // Sort feature commits by their horizontal position
    const sortedFeature = [...featureCommits].sort((a, b) => a.x - b.x)

    // Re-index their horizontally positioned coordinates starting after latest main commit
    const startX = latestMain.x + 1
    const updatedCommits = commits.filter(c => c.branch !== "feature")

    let lastParentId = latestMain.id
    const rebased: Commit[] = sortedFeature.map((item, idx) => {
      const newHash = generateHash()
      const newC: Commit = {
        ...item,
        hash: newHash,
        x: startX + idx,
        parents: [lastParentId]
      }
      lastParentId = newC.id
      return newC
    })

    const finalCommitsList = [...updatedCommits, ...rebased]
    setCommits(finalCommitsList)
    setFeatureForkX(latestMain.x)
    setNextX(startX + rebased.length)
    setLogs(prev => [
      ...prev,
      "$ git rebase main",
      `First, rewinding head to cherry-pick commits on top of main...`,
      ...rebased.map(c => `Applying: ${c.msg} (rewritten hash: ${c.hash})`),
      "Successfully rebased and updated refs/heads/feature."
    ])
  }

  // 6. Reset history
  const handleReset = () => {
    setCommits([
      {
        id: "c1",
        hash: "8a3d2e1",
        branch: "main",
        msg: "chore: initial commit",
        x: 1,
        y: 40,
        parents: []
      }
    ])
    setActiveBranch("main")
    setHasFeatureBranch(false)
    setFeatureForkX(null)
    setNextX(2)
    setMsgIndex(0)
    setLogs([
      "$ git init",
      "Initialized empty Git repository in /workspace/opendevhub/"
    ])
  }

  // SVG dimensions
  const viewWidth = Math.max(720, nextX * 65 + 50)

  return (
    <section className="border-t-4 border-foreground py-16 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-foreground bg-accent text-accent-foreground font-mono text-[10px] font-black uppercase tracking-wider">
            <GitBranch className="h-3.5 w-3.5 animate-pulse" />
            <span>INTERACTIVE GIT GRAPH</span>
          </div>
          <h2 className="font-mono text-2xl sm:text-3xl font-black uppercase text-foreground">
            Git Branching Sandbox
          </h2>
          <p className="font-mono text-xs text-muted-foreground max-w-xl mx-auto">
            Interactive visualization showing commit graphs, branches, merges, and rebasing. Run actions below to observe git history rewrite.
          </p>
        </div>

        {/* Console & SVG Box */}
        <div className="border-4 border-foreground bg-zinc-950 shadow-[6px_6px_0px_0px_var(--primary)] flex flex-col overflow-hidden">
          
          {/* Header Bar */}
          <div className="border-b-2 border-foreground bg-zinc-900 px-4 py-2 flex items-center justify-between select-none font-mono text-[10px] text-muted-foreground font-bold uppercase">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border border-foreground bg-red-500" />
              <div className="h-3 w-3 rounded-full border border-foreground bg-yellow-500" />
              <div className="h-3 w-3 rounded-full border border-foreground bg-green-500" />
            </div>
            <span>opendevhub-git-monitor.sh</span>
            <div className="flex items-center gap-2 text-accent font-black">
              <span>ACTIVE: {activeBranch.toUpperCase()}</span>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div className="p-6 bg-zinc-950 border-b-2 border-foreground overflow-x-auto bg-grid-pattern relative min-h-[180px]">
            <svg 
              width={viewWidth} 
              height="140" 
              className="overflow-visible select-none"
            >
              {/* Branch Guides */}
              <line x1="10" y1="40" x2={viewWidth - 10} y2="40" stroke="#1f2937" strokeWidth="3" strokeDasharray="6 6" />
              <text x="15" y="25" fill="#a855f7" className="font-mono text-[9px] font-bold uppercase tracking-wider">main branch</text>
              
              {hasFeatureBranch && (
                <>
                  <line x1="10" y1="100" x2={viewWidth - 10} y2="100" stroke="#1f2937" strokeWidth="3" strokeDasharray="6 6" />
                  <text x="15" y="85" fill="#2dd4bf" className="font-mono text-[9px] font-bold uppercase tracking-wider">feature branch</text>
                </>
              )}

              {/* Render Connections */}
              {commits.map((c) => {
                const cx = c.x * 65 + 30
                const cy = c.y
                return c.parents.map((pId) => {
                  const parent = commits.find(pc => pc.id === pId)
                  if (!parent) return null
                  const px = parent.x * 65 + 30
                  const py = parent.y

                  // Draw connecting lines with curve if branching/merging
                  let d = `M ${px} ${py} L ${cx} ${cy}`
                  if (py !== cy) {
                    // Curved connector
                    const midX = (px + cx) / 2
                    d = `M ${px} ${py} C ${midX} ${py}, ${midX} ${cy}, ${cx} ${cy}`
                  }

                  return (
                    <path
                      key={`${c.id}-${pId}`}
                      d={d}
                      stroke={c.branch === "main" ? "#a855f7" : "#2dd4bf"}
                      strokeWidth="3"
                      fill="none"
                      className="transition-all duration-300"
                    />
                  )
                })
              })}

              {/* Fork start link guide indicator */}
              {hasFeatureBranch && featureForkX !== null && (
                <path 
                  d={`M ${featureForkX * 65 + 30} 40 C ${(featureForkX * 65 + 30 + (featureForkX + 1) * 65 + 30)/2} 40, ${(featureForkX * 65 + 30 + (featureForkX + 1) * 65 + 30)/2} 100, ${(featureForkX + 1) * 65 + 30} 100`} 
                  stroke="#2dd4bf" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  fill="none" 
                />
              )}

              {/* Render Commit Nodes */}
              {commits.map((c) => {
                const cx = c.x * 65 + 30
                const cy = c.y
                const isLatestMain = getLatestCommitOfBranch("main")?.id === c.id
                const isLatestFeature = getLatestCommitOfBranch("feature")?.id === c.id

                return (
                  <g key={c.id} className="group cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r="12"
                      fill={c.branch === "main" ? "#a855f7" : "#2dd4bf"}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="hover:scale-125 transition-transform duration-200"
                    />
                    {/* Hash label text inside node */}
                    <text
                      x={cx}
                      y={cy + 3.5}
                      textAnchor="middle"
                      fill="#000000"
                      className="font-mono text-[8px] font-black pointer-events-none"
                    >
                      {c.hash.substring(0, 3)}
                    </text>

                    {/* Hover tooltip card */}
                    <title>{`[${c.hash}] ${c.msg}`}</title>

                    {/* Branch pointer tags */}
                    {isLatestMain && (
                      <g transform={`translate(${cx - 15}, ${cy - 30})`}>
                        <rect width="30" height="12" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
                        <text x="15" y="9" fill="#ffffff" textAnchor="middle" className="font-mono text-[7px] font-black uppercase">main</text>
                      </g>
                    )}

                    {isLatestFeature && hasFeatureBranch && (
                      <g transform={`translate(${cx - 20}, ${cy + 20})`}>
                        <rect width="40" height="12" fill="#2dd4bf" stroke="#000000" strokeWidth="1" />
                        <text x="20" y="9" fill="#000000" textAnchor="middle" className="font-mono text-[7px] font-black uppercase">feat</text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Git Terminal Logs */}
          <div ref={logsContainerRef} className="p-4 bg-zinc-950 font-mono text-xs max-h-[140px] overflow-y-auto border-b-2 border-foreground scrollbar-thin divide-y divide-zinc-900 bg-dot-pattern">
            {logs.map((log, index) => (
              <div key={index} className={`py-1 ${log.startsWith("$") ? "text-zinc-350" : "text-green-400 pl-3"}`}>
                {log}
              </div>
            ))}
          </div>

          {/* Git Controllers Panel */}
          <div className="bg-zinc-900 p-4 grid grid-cols-2 sm:grid-cols-6 gap-3">
            <button
              onClick={handleCommit}
              className="border-2 border-foreground p-2 bg-black font-mono font-bold text-[10px] uppercase text-foreground hover:bg-primary hover:text-white shadow-[2px_2px_0px_0px_var(--border)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <GitCommit className="h-4 w-4 text-primary" />
              <span>git commit</span>
            </button>

            <button
              onClick={handleCreateBranch}
              className="border-2 border-foreground p-2 bg-black font-mono font-bold text-[10px] uppercase text-foreground hover:bg-accent hover:text-black shadow-[2px_2px_0px_0px_var(--border)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <GitBranch className="h-4 w-4 text-accent" />
              <span>git branch</span>
            </button>

            <button
              onClick={() => handleCheckout("main")}
              disabled={activeBranch === "main"}
              className="border-2 border-foreground p-2 bg-black font-mono font-bold text-[10px] uppercase text-foreground hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-black disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_var(--border)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <ArrowRightLeft className="h-4 w-4 text-zinc-400" />
              <span>checkout main</span>
            </button>

            <button
              onClick={() => handleCheckout("feature")}
              disabled={!hasFeatureBranch || activeBranch === "feature"}
              className="border-2 border-foreground p-2 bg-black font-mono font-bold text-[10px] uppercase text-foreground hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-black disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_var(--border)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <ArrowRightLeft className="h-4 w-4 text-accent" />
              <span>checkout feat</span>
            </button>

            <button
              onClick={handleMerge}
              disabled={activeBranch !== "main" || !hasFeatureBranch}
              className="border-2 border-foreground p-2 bg-black font-mono font-bold text-[10px] uppercase text-foreground hover:bg-accent hover:text-black disabled:opacity-30 disabled:hover:bg-black disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_var(--border)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <GitPullRequest className="h-4 w-4 text-accent" />
              <span>git merge</span>
            </button>

            <button
              onClick={handleRebase}
              disabled={activeBranch !== "feature"}
              className="border-2 border-foreground p-2 bg-black font-mono font-bold text-[10px] uppercase text-foreground hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-black disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_var(--border)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--border)] transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <GitCommit className="h-4 w-4 text-primary" />
              <span>git rebase</span>
            </button>
          </div>

          {/* Reset Bar */}
          <div className="bg-zinc-950 p-2 border-t border-foreground/30 flex items-center justify-between px-4 font-mono text-[9px] text-zinc-500">
            <span>Commit spacing: dynamic horizontal grid layout</span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-red-400 hover:text-red-500 font-bold uppercase cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset Sandbox</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  )
}
