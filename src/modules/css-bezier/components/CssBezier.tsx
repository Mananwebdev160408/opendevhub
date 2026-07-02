"use client"

import * as React from "react"
import { Play, Sparkles, Copy, Check, RotateCcw, ChevronRight } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Preset {
  name: string
  label: string
  val: [number, number, number, number]
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PRESETS: Preset[] = [
  { name: "ease",              label: "Ease",           val: [0.25,  0.1,  0.25,  1.0]  },
  { name: "linear",           label: "Linear",         val: [0.0,   0.0,  1.0,   1.0]  },
  { name: "ease-in",          label: "Ease In",        val: [0.42,  0.0,  1.0,   1.0]  },
  { name: "ease-out",         label: "Ease Out",       val: [0.0,   0.0,  0.58,  1.0]  },
  { name: "ease-in-out",      label: "Ease In-Out",    val: [0.42,  0.0,  0.58,  1.0]  },
  { name: "bouncy",           label: "Bouncy (Back)",  val: [0.175, 0.885, 0.32, 1.275] },
  { name: "fast-out-slow-in", label: "Fast → Slow",    val: [0.4,   0.0,  0.2,   1.0]  },
  { name: "anticipate",       label: "Anticipate",     val: [0.36, -0.4,  0.63,  1.3]  },
]

const COMPARE_OPTS = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}
function r2(n: number) {
  return Math.round(n * 100) / 100
}

// ─── Copy Button ─────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* blocked */ }
  }
  return (
    <button
      onClick={handle}
      className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase transition-all duration-100 cursor-pointer flex items-center gap-1.5 select-none ${
        copied
          ? "bg-accent text-accent-foreground border-accent"
          : "bg-black border-foreground text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_#ffffff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? "COPIED!" : "COPY CSS"}</span>
    </button>
  )
}

// ─── Slider Row ───────────────────────────────────────────────────────────────
function SliderRow({
  label, value, min, max, step = 0.01, color, onChange,
}: {
  label: string; value: number; min: number; max: number;
  step?: number; color: string; onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-black uppercase" style={{ color }}>{label}</span>
        <span className="text-[10px] font-mono font-bold text-foreground tabular-nums w-10 text-right">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 appearance-none bg-zinc-800 border border-zinc-700 cursor-pointer"
        style={{ accentColor: color }}
      />
    </div>
  )
}

// ─── SVG Bezier Canvas ────────────────────────────────────────────────────────
// Key fix: uses SVG pointer capture (setPointerCapture on the circle) so
// dragging past the SVG boundary continues to work without losing the handle.
function BezierCanvas({
  x1, y1, x2, y2,
  onP1Change, onP2Change,
}: {
  x1: number; y1: number; x2: number; y2: number
  onP1Change: (x: number, y: number) => void
  onP2Change: (x: number, y: number) => void
}) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const dragging = React.useRef<"p1" | "p2" | null>(null)

  const SIZE = 200
  const PAD  = 40
  const TOTAL = SIZE + PAD * 2

  const toSX = (x: number) => PAD + x * SIZE
  const toSY = (y: number) => PAD + SIZE - y * SIZE

  const fromPtr = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect()
    const px = (clientX - rect.left) * (TOTAL / rect.width)
    const py = (clientY - rect.top)  * (TOTAL / rect.height)
    return {
      x: r2(clamp((px - PAD) / SIZE, 0, 1)),
      y: r2(clamp((PAD + SIZE - py) / SIZE, -0.6, 1.6)),
    }
  }

  const onCirclePointerDown = (e: React.PointerEvent<SVGCircleElement>, handle: "p1" | "p2") => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = handle
  }

  const onSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return
    const { x, y } = fromPtr(e.clientX, e.clientY)
    if (dragging.current === "p1") onP1Change(x, y)
    else onP2Change(x, y)
  }

  const onSvgPointerUp = () => { dragging.current = null }

  const path = `M ${toSX(0)} ${toSY(0)} C ${toSX(x1)} ${toSY(y1)}, ${toSX(x2)} ${toSY(y2)}, ${toSX(1)} ${toSY(1)}`

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${TOTAL} ${TOTAL}`}
      className="w-full h-auto cursor-crosshair touch-none select-none"
      onPointerMove={onSvgPointerMove}
      onPointerUp={onSvgPointerUp}
    >
      {/* Grid */}
      {[0.25, 0.5, 0.75].map((t) => (
        <React.Fragment key={t}>
          <line x1={toSX(t)} y1={toSY(-0.1)} x2={toSX(t)} y2={toSY(1.1)} stroke="#1a1a1d" strokeWidth="1" />
          <line x1={toSX(-0.05)} y1={toSY(t)} x2={toSX(1.05)} y2={toSY(t)} stroke="#1a1a1d" strokeWidth="1" />
        </React.Fragment>
      ))}

      {/* Y=0 and Y=1 boundary dashes */}
      <line x1={toSX(0)} y1={toSY(0)} x2={toSX(1)} y2={toSY(0)} stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />
      <line x1={toSX(0)} y1={toSY(1)} x2={toSX(1)} y2={toSY(1)} stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />

      {/* Linear reference diagonal */}
      <line x1={toSX(0)} y1={toSY(0)} x2={toSX(1)} y2={toSY(1)} stroke="#27272a" strokeWidth="1" />

      {/* Control arms */}
      <line x1={toSX(0)}  y1={toSY(0)}  x2={toSX(x1)} y2={toSY(y1)} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" />
      <line x1={toSX(1)}  y1={toSY(1)}  x2={toSX(x2)} y2={toSY(y2)} stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" />

      {/* Glow */}
      <path d={path} fill="none" stroke="#a855f7" strokeWidth="8" opacity="0.12" strokeLinecap="round" />

      {/* Main curve */}
      <path d={path} fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

      {/* Anchor dots */}
      <circle cx={toSX(0)} cy={toSY(0)} r="4" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
      <circle cx={toSX(1)} cy={toSY(1)} r="4" fill="#ffffff" stroke="#000" strokeWidth="1.5" />

      {/* P1 draggable handle */}
      <circle
        cx={toSX(x1)} cy={toSY(y1)} r="9"
        fill="#a855f7" stroke="#ffffff" strokeWidth="2"
        style={{ cursor: "grab", filter: "drop-shadow(0 0 6px #a855f7)" }}
        onPointerDown={(e) => onCirclePointerDown(e, "p1")}
      />
      <text x={toSX(x1) + 13} y={toSY(y1) + 4} fontSize="8" fill="#a855f7" fontFamily="monospace" fontWeight="bold">P1</text>

      {/* P2 draggable handle */}
      <circle
        cx={toSX(x2)} cy={toSY(y2)} r="9"
        fill="#2dd4bf" stroke="#ffffff" strokeWidth="2"
        style={{ cursor: "grab", filter: "drop-shadow(0 0 6px #2dd4bf)" }}
        onPointerDown={(e) => onCirclePointerDown(e, "p2")}
      />
      <text x={toSX(x2) + 13} y={toSY(y2) + 4} fontSize="8" fill="#2dd4bf" fontFamily="monospace" fontWeight="bold">P2</text>

      {/* Corner labels */}
      <text x={toSX(0) - 2} y={toSY(0) + 16} fontSize="7" fill="#52525b" fontFamily="monospace">(0,0)</text>
      <text x={toSX(1) - 14} y={toSY(1) - 8} fontSize="7" fill="#52525b" fontFamily="monospace">(1,1)</text>
    </svg>
  )
}

// ─── Animation Track ──────────────────────────────────────────────────────────
function AnimTrack({ curve, label, color, animating }: {
  curve: string; label: string; color: string; animating: boolean
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-[9px] font-black uppercase" style={{ color }}>{label}</span>
      <div className="relative h-10 bg-zinc-950 border-2 border-zinc-800 overflow-hidden">
        {/* Track */}
        <div className="absolute inset-y-0 inset-x-4 flex items-center pointer-events-none">
          <div className="w-full h-px bg-zinc-800" />
        </div>
        {/* Ball */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-7 h-7 border-2 border-white"
          style={{
            left: animating ? "calc(100% - 2.25rem)" : "0.25rem",
            transition: animating ? `left 2s ${curve}` : "none",
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}88`,
          }}
        />
      </div>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function CssBezier() {
  const [x1, setX1] = React.useState(0.25)
  const [y1, setY1] = React.useState(0.1)
  const [x2, setX2] = React.useState(0.25)
  const [y2, setY2] = React.useState(1.0)

  const [animating,    setAnimating]    = React.useState(false)
  const [comparePreset, setComparePreset] = React.useState("ease")
  const [activePreset, setActivePreset] = React.useState<string | null>("ease")

  const applyPreset = (p: Preset) => {
    setX1(p.val[0]); setY1(p.val[1]); setX2(p.val[2]); setY2(p.val[3])
    setActivePreset(p.name)
  }

  const resetToDefault = () => {
    setX1(0.25); setY1(0.1); setX2(0.25); setY2(1.0)
    setActivePreset("ease")
  }

  const handleP1 = (x: number, y: number) => { setX1(x); setY1(y); setActivePreset(null) }
  const handleP2 = (x: number, y: number) => { setX2(x); setY2(y); setActivePreset(null) }

  const triggerAnimation = () => {
    setAnimating(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)))
  }

  const codeStr = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
  const cssStr  = `transition: all 2s cubic-bezier(${x1}, ${y1}, ${x2}, ${y2});`

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-6">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className="border-4 border-foreground bg-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-600 font-bold uppercase select-none tracking-widest">
          CSS TIMING PLAYGROUND
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-2 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-accent animate-pulse shrink-0" />
          CSS BEZIER CURVE PLAYGROUND
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Drag the <span className="text-primary font-bold">purple P1</span> and{" "}
          <span className="text-accent font-bold">teal P2</span> handles on the canvas,
          use the sliders, or pick a preset. Simulate the animation and copy the CSS output.
        </p>
      </div>

      {/* ── 3-col grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-6 items-start">

        {/* LEFT – presets + sliders */}
        <div className="space-y-4">

          <div className="border-4 border-foreground bg-card p-4 shadow-[4px_4px_0px_0px_var(--primary)]">
            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block border-b border-border pb-2 mb-3">
              PRESETS
            </span>
            <div className="flex flex-col gap-1.5">
              {PRESETS.map((p) => {
                const active = activePreset === p.name
                return (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className={`px-3 py-2 border-2 text-[9px] uppercase font-black text-left cursor-pointer transition-all duration-100 flex justify-between items-center gap-1.5 ${
                      active
                        ? "bg-primary text-primary-foreground border-primary translate-x-[2px] translate-y-[2px]"
                        : "bg-black border-foreground text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {active && <ChevronRight className="h-3 w-3 shrink-0" />}
                      {p.label}
                    </span>
                    <span className={`text-[7px] font-normal shrink-0 ${active ? "text-primary-foreground/60" : "text-zinc-600"}`}>
                      {p.val.join(", ")}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="border-4 border-foreground bg-card p-4 shadow-[4px_4px_0px_0px_var(--accent)]">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">SLIDERS</span>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-1 text-[8px] text-zinc-500 hover:text-foreground transition-colors cursor-pointer uppercase font-bold"
              >
                <RotateCcw className="h-2.5 w-2.5" /> Reset
              </button>
            </div>
            <div className="space-y-5">
              <div className="space-y-2.5 pb-4 border-b border-zinc-800">
                <span className="text-[8px] text-primary font-black uppercase tracking-wider block">P1 Control Point</span>
                <SliderRow label="X1" value={x1} min={0}    max={1}   color="#a855f7" onChange={(v) => { setX1(v); setActivePreset(null) }} />
                <SliderRow label="Y1" value={y1} min={-0.6} max={1.6} color="#a855f7" onChange={(v) => { setY1(v); setActivePreset(null) }} />
              </div>
              <div className="space-y-2.5">
                <span className="text-[8px] text-accent font-black uppercase tracking-wider block">P2 Control Point</span>
                <SliderRow label="X2" value={x2} min={0}    max={1}   color="#2dd4bf" onChange={(v) => { setX2(v); setActivePreset(null) }} />
                <SliderRow label="Y2" value={y2} min={-0.6} max={1.6} color="#2dd4bf" onChange={(v) => { setY2(v); setActivePreset(null) }} />
              </div>
            </div>
          </div>
        </div>

        {/* CENTER – canvas + code */}
        <div className="space-y-4">
          <div className="border-4 border-foreground bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <div className="px-4 pt-3 pb-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase bg-zinc-800 text-zinc-300 px-2 py-0.5 border border-zinc-700">
                DRAG CANVAS
              </span>
              <span className="text-[8px] text-zinc-600 font-bold uppercase">Grab the glowing circles</span>
            </div>
            <div className="p-4 pb-2">
              <BezierCanvas
                x1={x1} y1={y1} x2={x2} y2={y2}
                onP1Change={handleP1} onP2Change={handleP2}
              />
            </div>
            <div className="px-4 pb-3 flex justify-between text-[8px] text-zinc-600 font-bold uppercase">
              <span>P0 (0,0) — start</span>
              <span>P3 (1,1) — end</span>
            </div>
          </div>

          <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)]">
            <div className="px-4 pt-3 pb-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">CSS OUTPUT</span>
              <CopyButton text={cssStr} />
            </div>
            <pre className="bg-zinc-950 p-4 text-[11px] overflow-x-auto leading-relaxed select-all whitespace-pre-wrap">
              <code>
                <span className="text-zinc-500">{"/* Timing function */"}</span>{"\n"}
                <span className="text-accent">{"transition-timing-function"}</span>
                <span className="text-zinc-400">{": "}</span>
                <span className="text-primary">{codeStr}</span>
                <span className="text-zinc-400">{";"}</span>{"\n\n"}
                <span className="text-zinc-500">{"/* Shorthand */"}</span>{"\n"}
                <span className="text-accent">{"transition"}</span>
                <span className="text-zinc-400">{": all 2s "}</span>
                <span className="text-primary">{codeStr}</span>
                <span className="text-zinc-400">{";"}</span>
              </code>
            </pre>
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-2">
                <span className="text-[8px] text-zinc-600 font-bold uppercase shrink-0">CURRENT:</span>
                <span className="text-[10px] font-bold text-foreground truncate">{codeStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT – physics simulator */}
        <div className="border-4 border-foreground bg-zinc-900 shadow-[4px_4px_0px_0px_var(--accent)] p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-700 pb-3">
            <span className="text-[9px] font-black uppercase bg-zinc-800 text-zinc-300 px-2 py-0.5 border border-zinc-700">
              PHYSICS SIM
            </span>
            <span className="text-[8px] text-zinc-600 font-bold">2s duration</span>
          </div>

          <div className="space-y-4">
            <AnimTrack
              curve={codeStr}
              label={`Your curve${activePreset ? ` (${activePreset})` : " (custom)"}`}
              color="#a855f7"
              animating={animating}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-zinc-400 font-black uppercase">Compare:</span>
                <select
                  value={comparePreset}
                  onChange={(e) => setComparePreset(e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 text-[9px] font-bold text-accent py-1 px-2 focus:outline-none focus:border-accent cursor-pointer"
                >
                  {COMPARE_OPTS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <AnimTrack
                curve={comparePreset}
                label={comparePreset}
                color="#2dd4bf"
                animating={animating}
              />
            </div>
          </div>

          {/* Value readout grid */}
          <div className="space-y-2 border-t border-zinc-700 pt-4">
            <span className="text-[8px] text-zinc-600 font-black uppercase tracking-wider">Live Values</span>
            <div className="grid grid-cols-2 gap-1.5">
              {([["X1", x1, "#a855f7"], ["Y1", y1, "#a855f7"], ["X2", x2, "#2dd4bf"], ["Y2", y2, "#2dd4bf"]] as const).map(([k, v, c]) => (
                <div key={k} className="bg-zinc-950 border border-zinc-800 px-2.5 py-2 flex items-center justify-between">
                  <span className="text-[8px] font-black" style={{ color: c }}>{k}</span>
                  <span className="text-[11px] font-mono font-bold text-foreground tabular-nums">{(v as number).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulate button */}
          <button
            onClick={triggerAnimation}
            className="w-full border-2 border-foreground bg-foreground text-background py-3 text-xs font-black uppercase cursor-pointer hover:bg-zinc-200 transition-colors shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
          >
            <Play className="h-4 w-4 fill-background shrink-0" />
            Simulate Transition (2s)
          </button>

          <p className="text-[8px] text-zinc-700 text-center uppercase tracking-wide">
            Both bars animate simultaneously
          </p>
        </div>
      </div>

      {/* Bottom hint strip */}
      <div className="border-2 border-zinc-800 bg-card p-3 flex flex-wrap gap-4 text-[9px] text-zinc-600 font-bold uppercase">
        <span className="flex items-center gap-1.5"><span style={{ color: "#a855f7" }}>●</span> P1 = arm from start (0,0)</span>
        <span className="flex items-center gap-1.5"><span style={{ color: "#2dd4bf" }}>●</span> P2 = arm from end (1,1)</span>
        <span>X values: 0–1 only</span>
        <span>Y values: can exceed 0–1 for bounce/overshoot</span>
      </div>
    </div>
  )
}
