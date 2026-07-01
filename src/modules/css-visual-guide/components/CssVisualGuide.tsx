"use client"

import * as React from "react"
import { Sliders, Copy, Check, Info, LayoutGrid, Layers } from "lucide-react"

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

export function CssVisualGuide() {
  const [activeTab, setActiveTab] = React.useState<"flex" | "grid">("flex")

  // --- Flexbox States ---
  const [flexDirection, setFlexDirection] = React.useState("row")
  const [justifyContent, setJustifyContent] = React.useState("flex-start")
  const [alignItems, setAlignItems] = React.useState("stretch")
  const [flexWrap, setFlexWrap] = React.useState("nowrap")
  const [flexGap, setFlexGap] = React.useState(16)
  const [flexItemCount, setFlexItemCount] = React.useState(4)
  const [activeFlexItem, setActiveFlexItem] = React.useState<number>(1)
  
  // Flex Item Overrides
  const [itemGrow, setItemGrow] = React.useState<Record<number, number>>({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 })
  const [itemShrink, setItemShrink] = React.useState<Record<number, number>>({ 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 })
  const [itemAlignSelf, setItemAlignSelf] = React.useState<Record<number, string>>({ 0: "auto", 1: "auto", 2: "auto", 3: "auto", 4: "auto", 5: "auto", 6: "auto", 7: "auto" })

  // --- Grid States ---
  const [gridCols, setGridCols] = React.useState("repeat(3, 1fr)")
  const [gridRows, setGridRows] = React.useState("auto auto")
  const [gridGap, setGridGap] = React.useState(16)
  const [justifyItems, setJustifyItems] = React.useState("stretch")
  const [gridAlignItems, setGridAlignItems] = React.useState("stretch")
  const [gridItemCount, setGridItemCount] = React.useState(6)
  const [activeGridItem, setActiveGridItem] = React.useState<number>(1)

  // Grid Item Overrides
  const [itemColSpan, setItemColSpan] = React.useState<Record<number, string>>({ 0: "auto", 1: "auto", 2: "auto", 3: "auto", 4: "auto", 5: "auto", 6: "auto", 7: "auto", 8: "auto", 9: "auto", 10: "auto", 11: "auto" })
  const [itemRowSpan, setItemRowSpan] = React.useState<Record<number, string>>({ 0: "auto", 1: "auto", 2: "auto", 3: "auto", 4: "auto", 5: "auto", 6: "auto", 7: "auto", 8: "auto", 9: "auto", 10: "auto", 11: "auto" })

  // Code Generation
  const generatedFlexCss = `.flex-container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${flexGap}px;
}
.active-item {
  flex-grow: ${itemGrow[activeFlexItem] || 0};
  flex-shrink: ${itemShrink[activeFlexItem] || 1};
  align-self: ${itemAlignSelf[activeFlexItem] || "auto"};
}`

  const generatedGridCss = `.grid-container {
  display: grid;
  grid-template-columns: ${gridCols};
  grid-template-rows: ${gridRows};
  gap: ${gridGap}px;
  justify-items: ${justifyItems};
  align-items: ${gridAlignItems};
}
.active-item {
  grid-column: ${itemColSpan[activeGridItem] || "auto"};
  grid-row: ${itemRowSpan[activeGridItem] || "auto"};
}`

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title block */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          CSS PLAYGROUND
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <LayoutGrid className="h-6 w-6 text-accent animate-pulse" />
          <span>FLEXBOX & GRID INTERACTIVE VISUAL GUIDE</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Toggle CSS layout models in real time. Adjust direction, alignment, sizing constraints, gaps, and item-level overrides with copy-pasteable CSS.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-2 border-foreground bg-zinc-950 p-2 shadow-[4px_4px_0px_0px_var(--primary)] flex gap-2 select-none">
        <button
          onClick={() => setActiveTab("flex")}
          className={`flex-1 py-3 border-2 font-black uppercase text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
            activeTab === "flex"
              ? "bg-primary text-primary-foreground border-foreground shadow-[3px_3px_0px_0px_#ffffff]"
              : "border-zinc-800 text-zinc-500 hover:text-foreground hover:border-foreground"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Flexbox Playground</span>
        </button>
        <button
          onClick={() => setActiveTab("grid")}
          className={`flex-1 py-3 border-2 font-black uppercase text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
            activeTab === "grid"
              ? "bg-primary text-primary-foreground border-foreground shadow-[3px_3px_0px_0px_#ffffff]"
              : "border-zinc-800 text-zinc-500 hover:text-foreground hover:border-foreground"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>CSS Grid Playground</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Controls Sidebar */}
        <div className="lg:col-span-1 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--accent)] space-y-6">
          {activeTab === "flex" ? (
            // --- FLEXBOX CONTROLS ---
            <div className="space-y-4 text-xs font-bold">
              <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase">CONTAINER OPTIONS</span>
              
              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">flex-direction</label>
                <select
                  value={flexDirection}
                  onChange={(e) => setFlexDirection(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="row">row (default)</option>
                  <option value="row-reverse">row-reverse</option>
                  <option value="column">column</option>
                  <option value="column-reverse">column-reverse</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">justify-content</label>
                <select
                  value={justifyContent}
                  onChange={(e) => setJustifyContent(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="flex-start">flex-start (default)</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="space-between">space-between</option>
                  <option value="space-around">space-around</option>
                  <option value="space-evenly">space-evenly</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">align-items</label>
                <select
                  value={alignItems}
                  onChange={(e) => setAlignItems(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="stretch">stretch (default)</option>
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="baseline">baseline</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">flex-wrap</label>
                <select
                  value={flexWrap}
                  onChange={(e) => setFlexWrap(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="nowrap">nowrap (default)</option>
                  <option value="wrap">wrap</option>
                  <option value="wrap-reverse">wrap-reverse</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">gap: {flexGap}px</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="8"
                  value={flexGap}
                  onChange={(e) => setFlexGap(parseInt(e.target.value))}
                  className="w-full accent-primary bg-zinc-950 p-1 cursor-pointer"
                />
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Items Count: {flexItemCount}</label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={flexItemCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    setFlexItemCount(val)
                    if (activeFlexItem >= val) setActiveFlexItem(0)
                  }}
                  className="w-full accent-primary bg-zinc-950 p-1 cursor-pointer"
                />
              </div>

              <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase pt-4">ACTIVE ITEM OVERRIDES</span>
              
              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">SELECT ACTIVE ITEM</label>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: flexItemCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFlexItem(i)}
                      className={`w-7 h-7 border text-[10px] font-black uppercase cursor-pointer transition-all ${
                        activeFlexItem === i
                          ? "bg-accent text-accent-foreground border-foreground shadow-[1px_1px_0px_0px_#ffffff]"
                          : "border-zinc-800 text-zinc-400 hover:border-foreground"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">flex-grow: {itemGrow[activeFlexItem] || 0}</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={itemGrow[activeFlexItem] || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    setItemGrow(prev => ({ ...prev, [activeFlexItem]: val }))
                  }}
                  className="w-full accent-primary bg-zinc-950 p-1 cursor-pointer"
                />
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">flex-shrink: {itemShrink[activeFlexItem] || 1}</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={itemShrink[activeFlexItem] || 1}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    setItemShrink(prev => ({ ...prev, [activeFlexItem]: val }))
                  }}
                  className="w-full accent-primary bg-zinc-950 p-1 cursor-pointer"
                />
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">align-self</label>
                <select
                  value={itemAlignSelf[activeFlexItem] || "auto"}
                  onChange={(e) => {
                    const val = e.target.value
                    setItemAlignSelf(prev => ({ ...prev, [activeFlexItem]: val }))
                  }}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="auto">auto (default)</option>
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="baseline">baseline</option>
                  <option value="stretch">stretch</option>
                </select>
              </div>
            </div>
          ) : (
            // --- GRID CONTROLS ---
            <div className="space-y-4 text-xs font-bold">
              <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase">CONTAINER OPTIONS</span>
              
              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">grid-template-columns</label>
                <select
                  value={gridCols}
                  onChange={(e) => setGridCols(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="repeat(3, 1fr)">repeat(3, 1fr)</option>
                  <option value="repeat(auto-fit, minmax(100px, 1fr))">repeat(auto-fit, minmax(100px, 1fr))</option>
                  <option value="2fr 1fr 1fr">2fr 1fr 1fr</option>
                  <option value="1fr 2fr">1fr 2fr</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">grid-template-rows</label>
                <select
                  value={gridRows}
                  onChange={(e) => setGridRows(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="auto auto">auto auto</option>
                  <option value="repeat(3, 1fr)">repeat(3, 1fr)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">gap: {gridGap}px</label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  step="8"
                  value={gridGap}
                  onChange={(e) => setGridGap(parseInt(e.target.value))}
                  className="w-full accent-primary bg-zinc-950 p-1 cursor-pointer"
                />
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">justify-items</label>
                <select
                  value={justifyItems}
                  onChange={(e) => setJustifyItems(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="stretch">stretch (default)</option>
                  <option value="start">start</option>
                  <option value="end">end</option>
                  <option value="center">center</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">align-items</label>
                <select
                  value={gridAlignItems}
                  onChange={(e) => setGridAlignItems(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="stretch">stretch (default)</option>
                  <option value="start">start</option>
                  <option value="end">end</option>
                  <option value="center">center</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Items Count: {gridItemCount}</label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={gridItemCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    setGridItemCount(val)
                    if (activeGridItem >= val) setActiveGridItem(0)
                  }}
                  className="w-full accent-primary bg-zinc-950 p-1 cursor-pointer"
                />
              </div>

              <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase pt-4">ACTIVE ITEM OVERRIDES</span>
              
              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">SELECT ACTIVE ITEM</label>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: gridItemCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveGridItem(i)}
                      className={`w-7 h-7 border text-[10px] font-black uppercase cursor-pointer transition-all ${
                        activeGridItem === i
                          ? "bg-accent text-accent-foreground border-foreground shadow-[1px_1px_0px_0px_#ffffff]"
                          : "border-zinc-800 text-zinc-400 hover:border-foreground"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">grid-column</label>
                <select
                  value={itemColSpan[activeGridItem] || "auto"}
                  onChange={(e) => {
                    const val = e.target.value
                    setItemColSpan(prev => ({ ...prev, [activeGridItem]: val }))
                  }}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="auto">auto</option>
                  <option value="span 2">span 2</option>
                  <option value="span 3">span 3</option>
                  <option value="1 / 3">1 / 3</option>
                  <option value="2 / 4">2 / 4</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">grid-row</label>
                <select
                  value={itemRowSpan[activeGridItem] || "auto"}
                  onChange={(e) => {
                    const val = e.target.value
                    setItemRowSpan(prev => ({ ...prev, [activeGridItem]: val }))
                  }}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="auto">auto</option>
                  <option value="span 2">span 2</option>
                  <option value="1 / 3">1 / 3</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Live Visual Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-4 border-foreground p-6 bg-zinc-900 min-h-[360px] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative flex flex-col justify-between">
            <span className="text-[9px] font-black text-black bg-zinc-200 border border-zinc-400 px-2 py-0.5 self-start uppercase select-none">
              Live Rendering Viewport
            </span>

            <div className="flex-grow flex items-center justify-center py-6">
              {activeTab === "flex" ? (
                // --- FLEX CONTAINER RENDER ---
                <div
                  style={{
                    display: "flex",
                    flexDirection: flexDirection as any,
                    justifyContent: justifyContent,
                    alignItems: alignItems,
                    flexWrap: flexWrap as any,
                    gap: `${flexGap}px`,
                    width: "100%",
                    minHeight: "260px"
                  }}
                  className="border-2 border-dashed border-zinc-700 p-4 bg-zinc-950/40"
                >
                  {Array.from({ length: flexItemCount }).map((_, i) => {
                    const isSelected = activeFlexItem === i
                    return (
                      <div
                        key={i}
                        onClick={() => setActiveFlexItem(i)}
                        style={{
                          flexGrow: itemGrow[i] || 0,
                          flexShrink: itemShrink[i] || 1,
                          alignSelf: itemAlignSelf[i] || "auto",
                          // Curated HSL colors
                          backgroundColor: isSelected ? "var(--primary)" : `hsl(${140 + i * 25}, 70%, 45%)`,
                        }}
                        className={`min-w-[60px] min-h-[60px] p-4 flex flex-col justify-center items-center font-black border-2 text-xs cursor-pointer select-none transition-all ${
                          isSelected
                            ? "border-foreground text-primary-foreground scale-105 shadow-[2px_2px_0px_0px_#ffffff]"
                            : "border-zinc-800 text-zinc-950 hover:border-foreground"
                        }`}
                      >
                        <div>{i + 1}</div>
                        {(itemGrow[i] > 0 || itemAlignSelf[i] !== "auto") && (
                          <div className="text-[8px] mt-1 font-bold">MOD</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                // --- GRID CONTAINER RENDER ---
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: gridCols,
                    gridTemplateRows: gridRows,
                    gap: `${gridGap}px`,
                    justifyItems: justifyItems,
                    alignItems: gridAlignItems,
                    width: "100%",
                    minHeight: "260px"
                  }}
                  className="border-2 border-dashed border-zinc-700 p-4 bg-zinc-950/40"
                >
                  {Array.from({ length: gridItemCount }).map((_, i) => {
                    const isSelected = activeGridItem === i
                    return (
                      <div
                        key={i}
                        onClick={() => setActiveGridItem(i)}
                        style={{
                          gridColumn: itemColSpan[i] || "auto",
                          gridRow: itemRowSpan[i] || "auto",
                          backgroundColor: isSelected ? "var(--accent)" : `hsl(${220 + i * 20}, 75%, 45%)`,
                        }}
                        className={`min-w-[60px] min-h-[60px] p-4 flex flex-col justify-center items-center font-black border-2 text-xs cursor-pointer select-none transition-all ${
                          isSelected
                            ? "border-foreground text-accent-foreground scale-102 shadow-[2px_2px_0px_0px_#ffffff]"
                            : "border-zinc-800 text-zinc-950 hover:border-foreground"
                        }`}
                      >
                        <div>{i + 1}</div>
                        {(itemColSpan[i] !== "auto" || itemRowSpan[i] !== "auto") && (
                          <div className="text-[8px] mt-1 font-bold">MOD</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-2 items-center text-[9px] text-zinc-400 select-none">
              <Info className="h-3.5 w-3.5 text-accent" />
              <span>Click any box inside the viewport to focus and configure its child-level style overrides.</span>
            </div>
          </div>

          {/* Code output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">GENERATED CSS CODES:</span>
              <CopyButton text={activeTab === "flex" ? generatedFlexCss : generatedGridCss} />
            </div>
            <pre className="bg-zinc-950 border border-border p-4 text-[11px] text-foreground overflow-x-auto leading-relaxed select-all whitespace-pre-wrap">
              <code>{activeTab === "flex" ? generatedFlexCss : generatedGridCss}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
