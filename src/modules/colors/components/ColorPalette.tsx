"use client"

import * as React from "react"
import { Copy, Lock, Unlock, RefreshCw, Eye, Code, Check, AlertCircle, Palette } from "lucide-react"

interface ColorItem {
  hex: string
  locked: boolean
}

type PaletteType = "cohesive" | "analogous" | "complementary" | "triadic" | "monochromatic"

// Helper: Hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace(/^#/, "")
  let r = parseInt(hex.substring(0, 2), 16) / 255
  let g = parseInt(hex.substring(2, 4), 16) / 255
  let b = parseInt(hex.substring(4, 6), 16) / 255

  let max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

// Helper: HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  let c = (1 - Math.abs(2 * l - 1)) * s
  let x = c * (1 - Math.abs((h / 60) % 2 - 1))
  let m = l - c / 2
  let r = 0, g = 0, b = 0

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  let rHex = Math.round((r + m) * 255).toString(16).padStart(2, "0")
  let gHex = Math.round((g + m) * 255).toString(16).padStart(2, "0")
  let bHex = Math.round((b + m) * 255).toString(16).padStart(2, "0")

  return `#${rHex}${gHex}${bHex}`.toUpperCase()
}

// Helper: Hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace(/^#/, "")
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)
  return { r, g, b }
}

// Helper: HSL to OKLCH (approximate for dev display)
function hexToOklch(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const rL = r / 255, gL = g / 255, bL = b / 255
  
  // Linearize RGB
  const linearize = (c: number) => c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92
  const rS = linearize(rL)
  const gS = linearize(gL)
  const bS = linearize(bL)

  // LMS space
  const l = 0.4122214708 * rS + 0.5363325363 * gS + 0.0514459929 * bS
  const m = 0.2119034982 * rS + 0.6806995451 * gS + 0.1073969566 * bS
  const s = 0.0883024619 * rS + 0.2817188376 * gS + 0.6299787005 * bS

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  // OKLCH representation
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  const C = Math.sqrt(a * a + b_ * b_)
  let hRad = Math.atan2(b_, a)
  let hDeg = hRad * (180 / Math.PI)
  if (hDeg < 0) hDeg += 360

  return `${L.toFixed(3)} ${C.toFixed(3)} ${Math.round(hDeg)}`
}

// Relative Luminance
function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

// Contrast Ratio
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

export function ColorPalette() {
  const [colors, setColors] = React.useState<ColorItem[]>([
    { hex: "#FF5E5B", locked: false },
    { hex: "#D8D8D8", locked: false },
    { hex: "#FFFFEA", locked: false },
    { hex: "#00CECB", locked: false },
    { hex: "#FFED66", locked: false }
  ])
  const [paletteType, setPaletteType] = React.useState<PaletteType>("cohesive")
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)
  const [copiedFormat, setCopiedFormat] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"generator" | "preview" | "export">("generator")

  // Generate colors based on type
  const generatePalette = React.useCallback(() => {
    let baseHue = Math.floor(Math.random() * 360)
    let baseSat = 45 + Math.floor(Math.random() * 40) // 45% - 85%
    let baseLight = 40 + Math.floor(Math.random() * 20) // 40% - 60%

    // If one of the colors is locked, use its HSL as base Hue
    const firstLocked = colors.find(c => c.locked)
    if (firstLocked) {
      const hsl = hexToHsl(firstLocked.hex)
      baseHue = hsl.h
      // Randomize saturation and lightness so other slots change dynamically on each roll
      baseSat = 35 + Math.floor(Math.random() * 55) // 35% - 90%
      baseLight = 20 + Math.floor(Math.random() * 55) // 20% - 75%
    }

    // Dynamic steps for harmonies to ensure variety
    const analogousStep = 15 + Math.floor(Math.random() * 15) // 15 to 30 degrees
    const cohesiveStep = 30 + Math.floor(Math.random() * 50) // 30 to 80 degrees

    setColors(prev => {
      return prev.map((item, idx) => {
        if (item.locked) return item

        let h = baseHue
        let s = baseSat
        let l = baseLight

        const jitterH = -10 + Math.floor(Math.random() * 20) // -10 to +10 degrees
        const jitterS = -8 + Math.floor(Math.random() * 16) // -8 to +8 percent
        const jitterL = -6 + Math.floor(Math.random() * 12)  // -6 to +6 percent

        switch (paletteType) {
          case "analogous":
            h = (baseHue + (idx - 2) * analogousStep + 360 + jitterH) % 360
            s = Math.min(Math.max(baseSat + (idx - 2) * 5 + jitterS, 20), 95)
            l = Math.min(Math.max(baseLight + (idx - 2) * 2 + jitterL, 20), 85)
            break
          case "complementary":
            if (idx === 0 || idx === 1) {
              h = (baseHue + (idx === 0 ? 0 : jitterH)) % 360
              l = idx === 0 ? Math.min(Math.max(baseLight + jitterL, 15), 85) : Math.min(Math.max(baseLight + 25 + jitterL, 20), 90)
            } else if (idx === 3 || idx === 4) {
              h = (baseHue + 180 + jitterH) % 360
              l = idx === 3 ? Math.min(Math.max(baseLight + jitterL, 15), 85) : Math.min(Math.max(baseLight + 25 + jitterL, 20), 90)
            } else {
              h = (baseHue + 90 + jitterH) % 360
              s = Math.min(Math.max(baseSat + 15 + jitterS, 20), 95)
            }
            break
          case "triadic":
            if (idx === 0 || idx === 1) {
              h = (baseHue + (idx === 0 ? 0 : jitterH)) % 360
              l = idx === 0 ? Math.min(Math.max(baseLight + jitterL, 15), 85) : Math.min(Math.max(baseLight + 20 + jitterL, 20), 85)
            } else if (idx === 2 || idx === 3) {
              h = (baseHue + 120 + jitterH) % 360
              l = idx === 2 ? Math.min(Math.max(baseLight + jitterL, 15), 85) : Math.min(Math.max(baseLight + 20 + jitterL, 20), 85)
            } else {
              h = (baseHue + 240 + jitterH) % 360
            }
            break
          case "monochromatic":
            h = (baseHue + (idx === 2 ? 0 : Math.round(jitterH / 3))) % 360
            s = Math.min(Math.max(baseSat - (idx - 2) * 8 + jitterS, 15), 90)
            l = Math.min(Math.max(baseLight + (idx - 2) * 12 + jitterL, 10), 92)
            break
          case "cohesive":
          default:
            h = (baseHue + idx * cohesiveStep + jitterH) % 360
            s = Math.min(Math.max(baseSat - idx * 4 + jitterS, 30), 90)
            l = Math.min(Math.max(baseLight + (idx - 2) * 8 + jitterL, 15), 90)
            break
        }

        return { hex: hslToHex(h, s, l), locked: false }
      })
    })
  }, [paletteType, colors])

  // Keyboard shortcut: Spacebar to generate
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && activeTab === "generator" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        generatePalette()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [generatePalette, activeTab])

  const toggleLock = (idx: number) => {
    setColors(prev => prev.map((c, i) => i === idx ? { ...c, locked: !c.locked } : c))
  }

  const handleColorChange = (idx: number, hex: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setColors(prev => prev.map((c, i) => i === idx ? { ...c, hex } : c))
    }
  }

  const handleCopy = (text: string, idx: number, formatName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setCopiedFormat(formatName)
    setTimeout(() => {
      setCopiedIndex(null)
      setCopiedFormat(null)
    }, 1500)
  }

  const getExportString = (format: "css" | "tailwind" | "json" | "scss") => {
    if (format === "css") {
      return `:root {\n` + colors.map((c, idx) => `  --color-palette-${idx + 1}: ${c.hex};`).join("\n") + `\n}`
    }
    if (format === "scss") {
      return colors.map((c, idx) => `$palette-${idx + 1}: ${c.hex};`).join("\n")
    }
    if (format === "json") {
      return JSON.stringify(colors.reduce((acc, curr, idx) => {
        acc[`color${idx + 1}`] = curr.hex
        return acc
      }, {} as Record<string, string>), null, 2)
    }
    if (format === "tailwind") {
      return `@theme {\n` + colors.map((c, idx) => `  --color-dev-${idx + 1}: ${c.hex};`).join("\n") + `\n}`
    }
    return ""
  }

  const mainColor = colors[0].hex
  const secondaryColor = colors[1].hex
  const bgColor = colors[2].hex
  const cardBgColor = colors[3].hex
  const accentColor = colors[4].hex

  const isLightBg = getLuminance(bgColor) > 0.5
  const isLightMain = getLuminance(mainColor) > 0.5

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern mb-8">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          NEO-BRUTALIST COLOR TOOL
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <span>NEO-BRUTALIST PALETTE GENERATOR</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Generate high-contrast matching color groups. Lock variables, toggle color systems (Analogous, Complementary, Triadic), analyze WCAG contrast rates, and download CSS / Tailwind configs. Press <kbd className="bg-zinc-800 px-1 border border-foreground/30 text-accent font-black">Spacebar</kbd> to roll!
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-foreground pb-2">
        {(["generator", "preview", "export"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-2 border-foreground font-black text-xs uppercase transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] ${
              activeTab === tab 
                ? "bg-accent text-accent-foreground" 
                : "bg-zinc-950 text-muted-foreground hover:text-foreground hover:bg-zinc-900"
            }`}
          >
            {tab === "generator" && "🎨 Palette Editor"}
            {tab === "preview" && "👁 UI Layout Preview"}
            {tab === "export" && "💻 Export Code"}
          </button>
        ))}
      </div>

      <div className="border-4 border-foreground bg-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
        {activeTab === "generator" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-black text-muted-foreground uppercase">Theory:</span>
                {(["cohesive", "analogous", "complementary", "triadic", "monochromatic"] as PaletteType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setPaletteType(type)
                    }}
                    className={`px-2.5 py-1 border text-[10px] uppercase font-black transition-all ${
                      paletteType === type
                        ? "bg-foreground text-background border-foreground"
                        : "border-zinc-800 text-zinc-400 hover:text-foreground hover:border-zinc-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <button
                onClick={generatePalette}
                className="flex items-center gap-2 border-2 border-foreground bg-accent text-accent-foreground px-4 py-2 font-black text-xs hover:bg-opacity-90 transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>GENERATE NEW PALETTE</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {colors.map((color, idx) => {
                const isLight = getLuminance(color.hex) > 0.5
                const contrastWhite = getContrastRatio(color.hex, "#FFFFFF").toFixed(1)
                const contrastBlack = getContrastRatio(color.hex, "#000000").toFixed(1)
                
                const hslObj = hexToHsl(color.hex)
                const hslStr = `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`
                const rgbObj = hexToRgb(color.hex)
                const rgbStr = `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`
                const oklchStr = `oklch(${hexToOklch(color.hex)})`

                return (
                  <div 
                    key={idx}
                    className="border-2 border-foreground bg-zinc-950 flex flex-col shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  >
                    <div 
                      className="h-32 sm:h-44 w-full flex flex-col justify-between p-3 relative transition-all duration-300"
                      style={{ backgroundColor: color.hex }}
                    >
                      <div className="flex justify-between items-start">
                        <button
                          onClick={() => toggleLock(idx)}
                          className="p-1.5 border border-foreground bg-black text-white hover:bg-zinc-900 transition-all shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]"
                        >
                          {color.locked ? <Lock className="h-3 w-3 text-accent" /> : <Unlock className="h-3 w-3" />}
                        </button>
                        <span className="text-[10px] font-black px-1.5 py-0.5 border border-foreground bg-black text-white uppercase">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <input
                          type="text"
                          value={color.hex}
                          onChange={(e) => handleColorChange(idx, e.target.value)}
                          className="w-full bg-black text-white border border-foreground px-2 py-0.5 text-center text-xs font-black select-all rounded-none uppercase"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-950 text-left space-y-2 border-t-2 border-foreground flex-1 flex flex-col justify-between">
                      <div className="space-y-2 text-[10px]">
                        <div className="flex justify-between items-center bg-black/40 p-1 border border-zinc-900">
                          <span className="text-zinc-500 font-bold">HEX</span>
                          <button
                            onClick={() => handleCopy(color.hex, idx, "HEX")}
                            className="flex items-center gap-1 text-zinc-300 hover:text-white"
                          >
                            <span className="font-bold">{color.hex}</span>
                            {copiedIndex === idx && copiedFormat === "HEX" ? <Check className="h-2.5 w-2.5 text-accent" /> : <Copy className="h-2.5 w-2.5" />}
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-black/40 p-1 border border-zinc-900">
                          <span className="text-zinc-500 font-bold">RGB</span>
                          <button
                            onClick={() => handleCopy(rgbStr, idx, "RGB")}
                            className="flex items-center gap-1 text-zinc-300 hover:text-white truncate max-w-[100px]"
                          >
                            <span className="font-bold truncate">{rgbStr}</span>
                            {copiedIndex === idx && copiedFormat === "RGB" ? <Check className="h-2.5 w-2.5 text-accent" /> : <Copy className="h-2.5 w-2.5 shrink-0" />}
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-black/40 p-1 border border-zinc-900">
                          <span className="text-zinc-500 font-bold">HSL</span>
                          <button
                            onClick={() => handleCopy(hslStr, idx, "HSL")}
                            className="flex items-center gap-1 text-zinc-300 hover:text-white truncate max-w-[100px]"
                          >
                            <span className="font-bold truncate">{hslStr}</span>
                            {copiedIndex === idx && copiedFormat === "HSL" ? <Check className="h-2.5 w-2.5 text-accent" /> : <Copy className="h-2.5 w-2.5 shrink-0" />}
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-black/40 p-1 border border-zinc-900">
                          <span className="text-zinc-500 font-bold">OKLCH</span>
                          <button
                            onClick={() => handleCopy(oklchStr, idx, "OKLCH")}
                            className="flex items-center gap-1 text-zinc-300 hover:text-white truncate max-w-[100px]"
                          >
                            <span className="font-bold truncate">{oklchStr}</span>
                            {copiedIndex === idx && copiedFormat === "OKLCH" ? <Check className="h-2.5 w-2.5 text-accent" /> : <Copy className="h-2.5 w-2.5 shrink-0" />}
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-zinc-900 space-y-1 text-[9px] text-zinc-400">
                        <div className="flex justify-between">
                          <span>Contrast on White:</span>
                          <span className={`font-black ${parseFloat(contrastWhite) >= 4.5 ? "text-green-500" : "text-amber-500"}`}>
                            {contrastWhite}:1
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Contrast on Black:</span>
                          <span className={`font-black ${parseFloat(contrastBlack) >= 4.5 ? "text-green-500" : "text-amber-500"}`}>
                            {contrastBlack}:1
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-2 border-2 border-zinc-800 p-3 bg-zinc-950 text-left">
              <AlertCircle className="h-4 w-4 text-accent shrink-0" />
              <p className="text-[10px] text-zinc-400 leading-normal">
                To start a palette custom seed: toggle lock on a color, input its HEX, select theory mode, and click Generate. Use Spacebar to randomly spin unlocked fields.
              </p>
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <div className="space-y-6">
            <h2 className="text-sm font-black text-left uppercase text-foreground">LIVE MOCKPAGE PREVIEW</h2>
            <p className="text-[11px] text-zinc-400 text-left">
              This layout is styled dynamically using your generated color tokens to simulate an active interface.
            </p>

            <div 
              className="border-4 border-foreground p-6 text-left rounded-none font-sans"
              style={{ backgroundColor: bgColor, color: isLightBg ? "#18181b" : "#ffffff" }}
            >
              <div className="flex justify-between items-center border-b border-foreground/30 pb-4 mb-6">
                <span className="font-mono text-sm font-black tracking-tight" style={{ color: mainColor }}>
                  ⚡ MOCKUP.EXE
                </span>
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: mainColor }}></span>
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: secondaryColor }}></span>
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: accentColor }}></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-4">
                  <span 
                    className="inline-block text-[10px] font-black uppercase px-2.5 py-1 border border-current rounded-full"
                    style={{ backgroundColor: accentColor, color: getLuminance(accentColor) > 0.5 ? "#000" : "#fff" }}
                  >
                    FEATURED PREVIEW
                  </span>
                  <h3 className="text-3xl font-black leading-tight">
                    Premium Interface Visualized
                  </h3>
                  <p className="text-sm leading-relaxed opacity-90 max-w-xl">
                    Using this tool, developer palettes are mapped immediately to CSS utility classes. The text, borders, buttons, and backgrounds match the computed contrast scores.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                      className="px-5 py-2.5 border-2 border-foreground font-black text-sm transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 font-mono uppercase"
                      style={{ 
                        backgroundColor: mainColor, 
                        color: isLightMain ? "#000" : "#fff",
                        boxShadow: `3px 3px 0px 0px ${isLightBg ? "#000" : "#fff"}`
                      }}
                    >
                      Primary Action
                    </button>
                    <button 
                      className="px-5 py-2.5 border-2 border-foreground font-black text-sm bg-transparent transition-all hover:bg-black/10 font-mono uppercase"
                      style={{ 
                        borderColor: isLightBg ? "#000" : "#fff",
                        color: isLightBg ? "#000" : "#fff"
                      }}
                    >
                      Secondary
                    </button>
                  </div>
                </div>

                <div className="md:col-span-4 space-y-4 font-mono">
                  <div 
                    className="border-2 border-foreground p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    style={{ 
                      backgroundColor: cardBgColor,
                      color: getLuminance(cardBgColor) > 0.5 ? "#18181b" : "#ffffff",
                      boxShadow: `4px 4px 0px 0px ${isLightBg ? "#000" : "#fff"}`
                    }}
                  >
                    <h4 className="font-bold text-sm mb-2 uppercase">Metrics Widget</h4>
                    <p className="text-[10px] opacity-90 mb-4">
                      Analyzing and rendering custom colors dynamically with high contrast ratio.
                    </p>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-current/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: "70%", backgroundColor: mainColor }}></div>
                      </div>
                      <div className="h-2 w-full bg-current/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: "45%", backgroundColor: accentColor }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "export" && (
          <div className="space-y-6 text-left">
            <h2 className="text-sm font-black uppercase text-foreground">EXPORT PALETTE FOR DEVELOPMENT</h2>
            <p className="text-[11px] text-zinc-400">
              Copy-paste color tokens straight into your project's stylesheet or configuration bundle.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-accent">CSS Variables</span>
                  <button 
                    onClick={() => handleCopy(getExportString("css"), 99, "CSS")}
                    className="flex items-center gap-1 border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[9px] hover:text-white"
                  >
                    {copiedIndex === 99 && copiedFormat === "CSS" ? "Copied!" : "Copy"}
                    <Copy className="h-2.5 w-2.5" />
                  </button>
                </div>
                <pre className="bg-zinc-950 border-2 border-foreground p-3 text-[10px] text-zinc-300 overflow-x-auto font-mono">
                  <code>{getExportString("css")}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-accent">Tailwind CSS (Theme @theme)</span>
                  <button 
                    onClick={() => handleCopy(getExportString("tailwind"), 100, "Tailwind")}
                    className="flex items-center gap-1 border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[9px] hover:text-white"
                  >
                    {copiedIndex === 100 && copiedFormat === "Tailwind" ? "Copied!" : "Copy"}
                    <Copy className="h-2.5 w-2.5" />
                  </button>
                </div>
                <pre className="bg-zinc-950 border-2 border-foreground p-3 text-[10px] text-zinc-300 overflow-x-auto font-mono">
                  <code>{getExportString("tailwind")}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-accent">SCSS Variables</span>
                  <button 
                    onClick={() => handleCopy(getExportString("scss"), 101, "SCSS")}
                    className="flex items-center gap-1 border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[9px] hover:text-white"
                  >
                    {copiedIndex === 101 && copiedFormat === "SCSS" ? "Copied!" : "Copy"}
                    <Copy className="h-2.5 w-2.5" />
                  </button>
                </div>
                <pre className="bg-zinc-950 border-2 border-foreground p-3 text-[10px] text-zinc-300 overflow-x-auto font-mono">
                  <code>{getExportString("scss")}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-accent">JSON Dictionary</span>
                  <button 
                    onClick={() => handleCopy(getExportString("json"), 102, "JSON")}
                    className="flex items-center gap-1 border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[9px] hover:text-white"
                  >
                    {copiedIndex === 102 && copiedFormat === "JSON" ? "Copied!" : "Copy"}
                    <Copy className="h-2.5 w-2.5" />
                  </button>
                </div>
                <pre className="bg-zinc-950 border-2 border-foreground p-3 text-[10px] text-zinc-300 overflow-x-auto font-mono">
                  <code>{getExportString("json")}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
