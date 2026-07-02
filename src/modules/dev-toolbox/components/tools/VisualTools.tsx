"use client"

import * as React from "react"
import { Copy, Check, Play, RefreshCw, Eye, Maximize2, Minimize2, X } from "lucide-react"
import { CopyBtn } from "./ToolHelpers"
import { marked } from "marked"

export function ColorConverterTool() {
  const [hex, setHex] = React.useState("#2dd4bf")
  const [rgb, setRgb] = React.useState("")
  const [hsl, setHsl] = React.useState("")
  const [error, setError] = React.useState(false)

  const processColor = (hexVal: string) => {
    setError(false)
    let cleanHex = hexVal.trim()
    if (!cleanHex.startsWith("#")) cleanHex = "#" + cleanHex
    
    const reg = /^#([0-9a-f]{3}){1,2}$/i
    if (!reg.test(cleanHex)) {
      setError(true)
      return
    }

    let r = 0, g = 0, b = 0
    if (cleanHex.length === 4) {
      r = parseInt(cleanHex[1] + cleanHex[1], 16)
      g = parseInt(cleanHex[2] + cleanHex[2], 16)
      b = parseInt(cleanHex[3] + cleanHex[3], 16)
    } else if (cleanHex.length === 7) {
      r = parseInt(cleanHex.substring(1, 3), 16)
      g = parseInt(cleanHex.substring(3, 5), 16)
      b = parseInt(cleanHex.substring(5, 7), 16)
    }

    setRgb(`rgb(${r}, ${g}, ${b})`)

    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`)
  }

  React.useEffect(() => {
    processColor(hex)
  }, [hex])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">HEX ↔ RGB ↔ HSL COLOR CONVERTER</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-3">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold block mb-1">HEX CODE:</span>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="e.g. #a855f7"
              className="neo-input h-10 uppercase"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold block mb-1">RGB CODE:</span>
            <input readOnly type="text" value={rgb} className="neo-input bg-zinc-950 border-zinc-800 text-zinc-500 h-10 select-all" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold block mb-1">HSL CODE:</span>
            <input readOnly type="text" value={hsl} className="neo-input bg-zinc-950 border-zinc-800 text-zinc-500 h-10 select-all" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 border-4 border-foreground h-44 relative bg-dot-pattern">
          {!error ? (
            <>
              <div 
                style={{ backgroundColor: hex }}
                className="w-16 h-16 border-2 border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
              />
              <span className="text-[10px] font-black text-foreground uppercase mt-3 bg-black px-2 py-0.5 border border-border">
                PREVIEW: {hex}
              </span>
            </>
          ) : (
            <span className="text-xs font-bold text-red-500 uppercase bg-black px-2 py-1 border border-destructive">
              HEX SYNTAX ERROR
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function GradientGeneratorTool() {
  const [color1, setColor1] = React.useState("#a855f7")
  const [color2, setColor2] = React.useState("#2dd4bf")
  const [angle, setAngle] = React.useState("45")

  const cssValue = `linear-gradient(${angle}deg, ${color1}, ${color2})`

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">CSS GRADIENT GENERATOR</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block mb-1">COLOR 1:</span>
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-full h-10 border-2 border-foreground bg-black cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block mb-1">COLOR 2:</span>
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-full h-10 border-2 border-foreground bg-black cursor-pointer"
              />
            </div>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold block mb-1">ANGLE (DEGREES):</span>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="w-full accent-primary bg-zinc-900 border border-zinc-800 p-1 cursor-pointer"
            />
            <div className="text-[10px] font-bold text-zinc-500 text-right mt-1">{angle}°</div>
          </div>
        </div>

        <div 
          style={{ background: cssValue }}
          className="h-40 border-4 border-foreground shadow-[3px_3px_0px_0px_#ffffff] flex items-end justify-between p-3 select-none"
        >
          <span className="text-[9px] font-black text-black bg-white px-2 py-0.5 border border-black">
            VISUAL PREVIEW
          </span>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-zinc-400 font-bold block">CSS PROPERTY VALUE:</span>
          <CopyBtn value={`background: ${cssValue};`} />
        </div>
        <pre className="bg-zinc-950 border border-border p-3 text-[11px] text-foreground select-all truncate">
          background: {cssValue};
        </pre>
      </div>
    </div>
  )
}

export function MarkdownPreviewTool() {
  const [markdown, setMarkdown] = React.useState("# OpenDev Hub Markdown Previewer\n\n- Beautiful boxy designs\n- High information density\n\n```javascript\nconst hello = 'world';\n```")
  const [renderedHtml, setRenderedHtml] = React.useState("")
  const [fullscreen, setFullscreen] = React.useState<"editor" | "preview" | null>(null)

  React.useEffect(() => {
    const parseMarkdown = async () => {
      const html = await marked.parse(markdown)
      setRenderedHtml(html)
    }
    parseMarkdown()
  }, [markdown])

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <>
      {/* ── Fullscreen Overlay ── */}
      {fullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col font-mono">
          <div className="flex items-center justify-between px-4 py-2 border-b-2 border-foreground bg-black shrink-0">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              {fullscreen === "editor" ? "MARKDOWN WRITER — FULLSCREEN" : "LIVE PREVIEW — FULLSCREEN"}
            </span>
            <button
              onClick={() => setFullscreen(null)}
              className="p-1 border border-foreground bg-black hover:bg-zinc-900 active:translate-y-0.5 transition-all cursor-pointer"
              title="Exit fullscreen (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {fullscreen === "editor" ? (
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              autoFocus
              className="flex-1 w-full bg-black p-6 text-sm leading-relaxed focus:outline-none text-foreground resize-none"
            />
          ) : (
            <div
              className="flex-1 overflow-y-auto p-8 text-sm prose prose-invert markdown-reader-content leading-relaxed max-w-4xl mx-auto w-full"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          )}
        </div>
      )}

      {/* ── Normal View ── */}
      <div className="space-y-4 font-mono">
        <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">MARKDOWN INTERACTIVE PREVIEW</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-400 font-bold">MARKDOWN WRITER:</span>
              <button
                onClick={() => setFullscreen("editor")}
                className="p-1 border border-zinc-700 bg-black hover:bg-zinc-900 hover:border-foreground active:translate-y-0.5 transition-all cursor-pointer"
                title="Expand editor to fullscreen"
              >
                <Maximize2 className="h-3 w-3 text-zinc-400" />
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-80 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-400 font-bold">LIVE PREVIEW:</span>
              <button
                onClick={() => setFullscreen("preview")}
                className="p-1 border border-zinc-700 bg-black hover:bg-zinc-900 hover:border-foreground active:translate-y-0.5 transition-all cursor-pointer"
                title="Expand preview to fullscreen"
              >
                <Maximize2 className="h-3 w-3 text-zinc-400" />
              </button>
            </div>
            <div
              className="w-full h-80 bg-zinc-950 border-2 border-border p-4 overflow-y-auto text-xs prose prose-invert markdown-reader-content leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export function HtmlPreviewTool() {
  const [html, setHtml] = React.useState("<div style='background-color:#2dd4bf;color:#000;padding:20px;text-align:center;font-weight:bold;'>\n  HELLO FROM THE PREVIEW GRID\n</div>")
  const [srcDoc, setSrcDoc] = React.useState("")

  const runPreview = () => {
    setSrcDoc(html)
  }

  React.useEffect(() => {
    runPreview()
  }, [html])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">SANDBOXED HTML CODE PREVIEW</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">HTML MARKUP INPUT:</span>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-80 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">RENDERED IFRAME:</span>
          <iframe
            srcDoc={srcDoc}
            title="sandbox-preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-80 bg-white border-2 border-border"
          />
        </div>
      </div>
    </div>
  )
}

export function QrGeneratorTool() {
  const [text, setText] = React.useState("https://opendevhub.com")
  const [qrUrl, setQrUrl] = React.useState("")

  React.useEffect(() => {
    if (!text.trim()) {
      setQrUrl("")
      return
    }
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`)
  }, [text])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">QR CODE INSTANT GENERATOR</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">QR TARGET URL OR DATA STRING:</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type URL or text..."
            className="w-full h-36 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-4 border-foreground h-44 bg-dot-pattern">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="QR Code Code"
              className="w-32 h-32 border-2 border-foreground bg-white"
            />
          ) : (
            <span className="text-xs text-zinc-500 font-bold uppercase">Empty Data Input</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function BarcodeGeneratorTool() {
  const [text, setText] = React.useState("CODE-128")
  const [barcodeUrl, setBarcodeUrl] = React.useState("")

  React.useEffect(() => {
    if (!text.trim()) {
      setBarcodeUrl("")
      return
    }
    setBarcodeUrl(`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(text)}`)
  }, [text])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">BARCODE CODE GENERATOR</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">BARCODE VALUE:</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full neo-input h-10"
          />
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-4 border-foreground h-44 bg-dot-pattern">
          {barcodeUrl ? (
            <img
              src={barcodeUrl}
              alt="Barcode Code"
              className="max-h-24 bg-white border border-foreground p-2"
              onError={() => setBarcodeUrl("")}
            />
          ) : (
            <span className="text-xs text-zinc-500 font-bold uppercase">Empty Value Input</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function SvgOptimizerTool() {
  const [input, setInput] = React.useState(`<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"\n\t width="100px" height="100px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">\n  <!-- This is a sample comment to remove -->\n  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="#2dd4bf" />\n</svg>`)
  const [removeComments, setRemoveComments] = React.useState(true)
  const [removeMetadata, setRemoveMetadata] = React.useState(true)
  const [removeDimensions, setRemoveDimensions] = React.useState(true)
  const [output, setOutput] = React.useState("")

  const optimizeSvg = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    let clean = input

    if (removeComments) {
      clean = clean.replace(/<!--[\s\S]*?-->/g, "")
    }

    if (removeMetadata) {
      // Remove xmlns attributes or metadata block tags
      clean = clean.replace(/<metadata>[\s\S]*?<\/metadata>/gi, "")
      clean = clean.replace(/\s*id="[^"]*"/g, "")
      clean = clean.replace(/\s*style="enable-background:[^"]*"/g, "")
    }

    if (removeDimensions) {
      // Remove width and height, enforce using viewBox
      clean = clean.replace(/\s*width="[^"]*"/g, "")
      clean = clean.replace(/\s*height="[^"]*"/g, "")
    }

    // Clean empty lines or trailing white spaces
    clean = clean.split("\n").map(l => l.trim()).filter(Boolean).join("\n")
    setOutput(clean)
  }

  React.useEffect(() => {
    optimizeSvg()
  }, [input, removeComments, removeMetadata, removeDimensions])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">SVG CLEANER & OPTIMIZER</span>

      <div className="flex flex-wrap gap-4 text-xs font-bold select-none pb-2 border-b border-zinc-800/40">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={removeComments} onChange={(e) => setRemoveComments(e.target.checked)} className="accent-primary" />
          <span>STRIP COMMENTS</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={removeMetadata} onChange={(e) => setRemoveMetadata(e.target.checked)} className="accent-primary" />
          <span>STRIP METADATA & IDS</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={removeDimensions} onChange={(e) => setRemoveDimensions(e.target.checked)} className="accent-primary" />
          <span>STRIP WIDTH & HEIGHT</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">RAW SVG INPUT:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">CLEANED SVG MARKUP:</span>
            {output && <CopyBtn value={output} />}
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
          />
        </div>
      </div>

      <div className="border-4 border-foreground p-4 bg-white flex flex-col items-center justify-center min-h-32 shadow-[3px_3px_0px_0px_#ffffff]">
        <span className="text-[9px] font-black text-black bg-zinc-200 border border-zinc-400 px-2 py-0.5 mb-3 self-start">SVG LIVE RENDER</span>
        <div 
          className="w-32 h-32 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full text-black"
          dangerouslySetInnerHTML={{ __html: output }}
        />
      </div>
    </div>
  )
}

export function CssPlaygroundTool() {
  const [hOffset, setHOffset] = React.useState(6)
  const [vOffset, setVOffset] = React.useState(6)
  const [blur, setBlur] = React.useState(0)
  const [spread, setSpread] = React.useState(0)
  const [shadowColor, setShadowColor] = React.useState("#2dd4bf")
  const [shadowOpacity, setShadowOpacity] = React.useState(100)
  const [inset, setInset] = React.useState(false)

  const [borderRadius, setBorderRadius] = React.useState(0)
  const [borderWidth, setBorderWidth] = React.useState(4)

  const hexToRgba = (hex: string, opacityPercent: number) => {
    let clean = hex.trim().replace("#", "")
    if (clean.length === 3) {
      clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
    }
    const r = parseInt(clean.substring(0, 2), 16) || 0
    const g = parseInt(clean.substring(2, 4), 16) || 0
    const b = parseInt(clean.substring(4, 6), 16) || 0
    return `rgba(${r}, ${g}, ${b}, ${opacityPercent / 100})`
  }

  const rgbaColor = hexToRgba(shadowColor, shadowOpacity)
  const shadowValue = `${inset ? "inset " : ""}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${rgbaColor}`
  
  const cssString = `box-shadow: ${shadowValue};\nborder-radius: ${borderRadius}px;\nborder: ${borderWidth}px solid #000000;`

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">CSS SHADOW & BORDER VISUAL PLAYGROUND</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4 bg-zinc-950 border border-zinc-800 p-4 text-xs font-bold">
          <span className="text-[10px] text-zinc-500 font-bold block mb-2 uppercase border-b border-zinc-800 pb-1">BOX SHADOW CONTROLS</span>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">HORIZ. OFFSET: {hOffset}px</span>
              <input type="range" min="-50" max="50" value={hOffset} onChange={(e) => setHOffset(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">VERT. OFFSET: {vOffset}px</span>
              <input type="range" min="-50" max="50" value={vOffset} onChange={(e) => setVOffset(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">BLUR RADIUS: {blur}px</span>
              <input type="range" min="0" max="50" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">SPREAD RADIUS: {spread}px</span>
              <input type="range" min="-30" max="30" value={spread} onChange={(e) => setSpread(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">SHADOW COLOR:</span>
              <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="w-full h-8 border border-foreground bg-black cursor-pointer" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">OPACITY: {shadowOpacity}%</span>
              <input type="range" min="0" max="100" value={shadowOpacity} onChange={(e) => setShadowOpacity(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1.5">
            <input type="checkbox" id="insetShadow" checked={inset} onChange={(e) => setInset(e.target.checked)} className="accent-primary cursor-pointer" />
            <label htmlFor="insetShadow" className="text-[10px] text-zinc-400 uppercase cursor-pointer select-none">INSET SHADOW</label>
          </div>

          <span className="text-[10px] text-zinc-500 font-bold block mb-2 uppercase border-b border-zinc-800 pt-3 pb-1">BORDER & RADIUS CONTROLS</span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">BORDER RADIUS: {borderRadius}px</span>
              <input type="range" min="0" max="100" value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">BORDER WIDTH: {borderWidth}px</span>
              <input type="range" min="0" max="20" value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-4 border-foreground p-8 flex items-center justify-center min-h-[220px] bg-dot-pattern">
            <div 
              style={{
                boxShadow: shadowValue,
                borderRadius: `${borderRadius}px`,
                border: `${borderWidth}px solid #000000`
              }}
              className="w-36 h-36 bg-zinc-900 border-foreground flex items-center justify-center text-center p-3 select-none transition-all duration-100 font-black text-xs text-zinc-400 uppercase"
            >
              Visual Box
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-bold block">CSS CODES:</span>
              <CopyBtn value={cssString} />
            </div>
            <pre className="w-full bg-zinc-950 border border-border p-3 text-[11px] leading-relaxed text-foreground select-all whitespace-pre-wrap">
              {cssString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
