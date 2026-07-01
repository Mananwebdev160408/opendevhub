"use client"

import * as React from "react"
import { Play, Sparkles, Copy, Check, Info, HelpCircle } from "lucide-react"

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
      className={`px-3 py-1 border-2 text-[10px] font-black uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
        copied
          ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
          : "bg-black border-foreground text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_#ffffff]"
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? "COPIED" : "COPY CSS"}</span>
    </button>
  )
}

export function CssBezier() {
  const [x1, setX1] = React.useState(0.25)
  const [y1, setY1] = React.useState(0.1)
  const [x2, setX2] = React.useState(0.25)
  const [y2, setY2] = React.useState(1.0)

  const [animating, setAnimating] = React.useState(false)
  const [comparePreset, setComparePreset] = React.useState("ease")

  const svgRef = React.useRef<SVGSVGElement | null>(null)
  const [activeHandle, setActiveHandle] = React.useState<"p1" | "p2" | null>(null)

  const presets = [
    { name: "ease", val: [0.25, 0.1, 0.25, 1.0] },
    { name: "linear", val: [0.0, 0.0, 1.0, 1.0] },
    { name: "ease-in", val: [0.42, 0.0, 1.0, 1.0] },
    { name: "ease-out", val: [0.0, 0.0, 0.58, 1.0] },
    { name: "ease-in-out", val: [0.42, 0.0, 0.58, 1.0] },
    { name: "bouncy (back)", val: [0.175, 0.885, 0.32, 1.275] },
    { name: "fast-out-slow-in", val: [0.4, 0.0, 0.2, 1.0] }
  ]

  const applyPreset = (vals: number[]) => {
    setX1(vals[0])
    setY1(vals[1])
    setX2(vals[2])
    setY2(vals[3])
  }

  // Handle Drag Events
  const handleMouseDown = (handle: "p1" | "p2") => {
    setActiveHandle(handle)
  }

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!activeHandle || !svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    // Calculate relative coordinates [0, 1] inside SVG grid
    let rawX = (e.clientX - rect.left) / rect.width
    let rawY = 1 - (e.clientY - rect.top) / rect.height

    // Clamp coordinates
    const x = Math.max(0, Math.min(1, parseFloat(rawX.toFixed(2))))
    const y = Math.max(-0.5, Math.min(1.5, parseFloat(rawY.toFixed(2))))

    if (activeHandle === "p1") {
      setX1(x)
      setY1(y)
    } else {
      setX2(x)
      setY2(y)
    }
  }, [activeHandle])

  const handleMouseUp = React.useCallback(() => {
    setActiveHandle(null)
  }, [])

  React.useEffect(() => {
    if (activeHandle) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [activeHandle, handleMouseMove, handleMouseUp])

  const triggerAnimation = () => {
    setAnimating(false)
    setTimeout(() => {
      setAnimating(true)
    }, 50)
  }

  // SVG grid coordinate conversions (SVG height/width is 200, padding of 50 to allow Y bounds overflow)
  const size = 200
  const pad = 50
  const toSvgX = (x: number) => pad + x * size
  const toSvgY = (y: number) => pad + size - y * size

  const bezierPath = `M ${toSvgX(0)} ${toSvgY(0)} C ${toSvgX(x1)} ${toSvgY(y1)}, ${toSvgX(x2)} ${toSvgY(y2)}, ${toSvgX(1)} ${toSvgY(1)}`

  const codeString = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
  const cssString = `transition: all 2s cubic-bezier(${x1}, ${y1}, ${x2}, ${y2});`

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          TIMING PLAYGROUND
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent animate-pulse" />
          <span>CSS BEZIER CURVE PLAYGROUND</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Drag handles to customize timing curves. Watch timing physics live compared to standard options and copy output variables directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Presets Sidebar */}
        <div className="lg:col-span-1 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--primary)] space-y-6">
          <div className="space-y-4 text-xs font-bold">
            <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase">BEZIER PRESETS</span>
            <div className="flex flex-col gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p.val)}
                  className="px-3 py-2 border-2 border-foreground bg-black hover:bg-zinc-900 text-[10px] uppercase font-black text-left cursor-pointer transition-colors shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex justify-between"
                >
                  <span>{p.name}</span>
                  <span className="text-zinc-500 text-[9px]">{p.val.join(", ")}</span>
                </button>
              ))}
            </div>

            <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase pt-4">MANUAL PARAMETERS</span>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-500 block uppercase">P1 Control point (x1, y1)</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex items-center gap-1.5 bg-black border border-border px-2 py-1">
                    <span className="text-[9px] text-zinc-500">X:</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={x1}
                      onChange={(e) => setX1(parseFloat(e.target.value) || 0)}
                      className="bg-transparent focus:outline-none w-full text-xs text-foreground"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-black border border-border px-2 py-1">
                    <span className="text-[9px] text-zinc-500">Y:</span>
                    <input
                      type="number"
                      step="0.05"
                      value={y1}
                      onChange={(e) => setY1(parseFloat(e.target.value) || 0)}
                      className="bg-transparent focus:outline-none w-full text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block uppercase">P2 Control point (x2, y2)</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex items-center gap-1.5 bg-black border border-border px-2 py-1">
                    <span className="text-[9px] text-zinc-500">X:</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={x2}
                      onChange={(e) => setX2(parseFloat(e.target.value) || 0)}
                      className="bg-transparent focus:outline-none w-full text-xs text-foreground"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-black border border-border px-2 py-1">
                    <span className="text-[9px] text-zinc-500">Y:</span>
                    <input
                      type="number"
                      step="0.05"
                      value={y2}
                      onChange={(e) => setY2(parseFloat(e.target.value) || 0)}
                      className="bg-transparent focus:outline-none w-full text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Drag Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* SVG Drag box */}
            <div className="border-4 border-foreground p-4 bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative flex flex-col justify-between items-center select-none">
              <span className="text-[9px] font-black text-black bg-zinc-200 border border-zinc-400 px-2 py-0.5 self-start uppercase">
                Draggable Editor
              </span>

              <svg
                ref={svgRef}
                viewBox={`0 0 ${size + pad * 2} ${size + pad * 2}`}
                className="w-full max-w-[260px] h-auto my-4 cursor-crosshair overflow-visible"
              >
                {/* Y=0 and Y=1 grid lines */}
                <line x1={toSvgX(0)} y1={toSvgY(0)} x2={toSvgX(1)} y2={toSvgY(0)} stroke="#27272a" strokeWidth="1.5" strokeDasharray="3" />
                <line x1={toSvgX(0)} y1={toSvgY(1)} x2={toSvgX(1)} y2={toSvgY(1)} stroke="#27272a" strokeWidth="1.5" strokeDasharray="3" />
                
                {/* Diagonal Helper */}
                <line x1={toSvgX(0)} y1={toSvgY(0)} x2={toSvgX(1)} y2={toSvgY(1)} stroke="#18181b" strokeWidth="1" />

                {/* Handles Anchor lines */}
                <line x1={toSvgX(0)} y1={toSvgY(0)} x2={toSvgX(x1)} y2={toSvgY(y1)} stroke="var(--primary)" strokeWidth="1.5" />
                <line x1={toSvgX(1)} y1={toSvgY(1)} x2={toSvgX(x2)} y2={toSvgY(y2)} stroke="var(--accent)" strokeWidth="1.5" />

                {/* Curves */}
                <path d={bezierPath} fill="none" stroke="#ffffff" strokeWidth="3" />

                {/* Control point 1 handle */}
                <circle
                  cx={toSvgX(x1)}
                  cy={toSvgY(y1)}
                  r="8"
                  fill="var(--primary)"
                  stroke="#ffffff"
                  strokeWidth="2"
                  onMouseDown={() => handleMouseDown("p1")}
                  className="cursor-pointer hover:scale-125 transition-transform"
                />

                {/* Control point 2 handle */}
                <circle
                  cx={toSvgX(x2)}
                  cy={toSvgY(y2)}
                  r="8"
                  fill="var(--accent)"
                  stroke="#ffffff"
                  strokeWidth="2"
                  onMouseDown={() => handleMouseDown("p2")}
                  className="cursor-pointer hover:scale-125 transition-transform"
                />
              </svg>

              <div className="flex gap-2 justify-between w-full text-[8px] text-zinc-500 px-2 uppercase font-bold">
                <span>P0 (0,0)</span>
                <span>Drag points to build elastic/overshooting values</span>
                <span>P3 (1,1)</span>
              </div>
            </div>

            {/* Animation Simulator */}
            <div className="border-4 border-foreground p-5 bg-zinc-900 shadow-[4px_4px_0px_0px_var(--accent)] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[9px] font-black text-black bg-zinc-200 border border-zinc-400 px-2 py-0.5 self-start uppercase">
                  Physics Simulator
                </span>

                <div className="space-y-4 py-4">
                  {/* Custom animated bar */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-400 block font-bold uppercase">Custom Curve:</span>
                    <div className="w-full h-8 bg-black border-2 border-foreground relative overflow-hidden">
                      <div
                        style={{
                          transition: animating ? `all 2s cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})` : "none",
                          transform: animating ? "translateX(calc(100% - 24px))" : "translateX(0)"
                        }}
                        className="w-6 h-full bg-primary border-r-2 border-foreground"
                      ></div>
                    </div>
                  </div>

                  {/* Compare bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-zinc-400 block font-bold uppercase">Compare to:</span>
                      <select
                        value={comparePreset}
                        onChange={(e) => setComparePreset(e.target.value)}
                        className="bg-black border border-border text-[9px] font-bold text-accent py-0.5 px-1 focus:outline-none"
                      >
                        <option value="linear">linear</option>
                        <option value="ease">ease</option>
                        <option value="ease-in">ease-in</option>
                        <option value="ease-out">ease-out</option>
                        <option value="ease-in-out">ease-in-out</option>
                      </select>
                    </div>
                    <div className="w-full h-8 bg-black border-2 border-foreground relative overflow-hidden">
                      <div
                        style={{
                          transition: animating ? `all 2s ${comparePreset}` : "none",
                          transform: animating ? "translateX(calc(100% - 24px))" : "translateX(0)"
                        }}
                        className="w-6 h-full bg-zinc-700 border-r-2 border-foreground"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={triggerAnimation}
                className="w-full border-2 border-foreground bg-foreground text-background py-2 text-xs font-black uppercase cursor-pointer hover:bg-zinc-200 transition-colors shadow-[2px_2px_0px_0px_#ffffff] flex items-center justify-center gap-1.5"
              >
                <Play className="h-4 w-4 fill-background" />
                <span>Simulate Transition (2s)</span>
              </button>
            </div>
          </div>

          {/* Code output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">OUTPUT STYLES:</span>
              <CopyButton text={cssString} />
            </div>
            <pre className="bg-zinc-950 border border-border p-4 text-[11px] text-foreground overflow-x-auto leading-relaxed select-all whitespace-pre-wrap">
              <code>{`/* Timing function */
transition-timing-function: ${codeString};

/* Inline declaration */
${cssString}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
