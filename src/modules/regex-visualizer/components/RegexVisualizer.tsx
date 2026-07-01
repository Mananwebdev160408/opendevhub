"use client"

import * as React from "react"
import { Play, Sparkles, Terminal, Info, AlertCircle, HelpCircle } from "lucide-react"

interface RegexNode {
  type: "start" | "end" | "literal" | "class" | "group" | "quantifier" | "wildcard" | "anchor"
  value: string
  description: string
  quantifier?: string
  children?: RegexNode[]
}

export function RegexVisualizer() {
  const [pattern, setPattern] = React.useState("^([a-zA-Z]+)-(\\d{3})\\s?xyz$")
  const [nodes, setNodes] = React.useState<RegexNode[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [selectedNode, setSelectedNode] = React.useState<RegexNode | null>(null)

  // Simple token parser to build a visual diagram representation
  const parseRegex = React.useCallback((regexStr: string) => {
    try {
      // Validate pattern using JS RegExp constructor
      new RegExp(regexStr)
      setError(null)
    } catch (e: any) {
      setError(e.message || "Invalid regular expression pattern.")
      setNodes([])
      return
    }

    const parsedNodes: RegexNode[] = []
    let i = 0

    const nextChar = () => regexStr[i]
    const consume = () => regexStr[i++]

    // Start anchor
    if (regexStr[0] === "^") {
      parsedNodes.push({
        type: "anchor",
        value: "^",
        description: "Asserts position at start of the string."
      })
      i = 1
    }

    let groupCounter = 1

    while (i < regexStr.length) {
      const char = nextChar()

      if (char === "$") {
        parsedNodes.push({
          type: "anchor",
          value: "$",
          description: "Asserts position at the end of the string."
        })
        i++
        break
      }

      // Escape character
      if (char === "\\") {
        consume() // consume \
        const escaped = consume()
        let desc = `Matches a literal '${escaped}' character.`
        let type: RegexNode["type"] = "literal"
        if (escaped === "d") {
          desc = "Matches any digit character (0-9)."
          type = "class"
        } else if (escaped === "w") {
          desc = "Matches any word character (alphanumeric or underscore)."
          type = "class"
        } else if (escaped === "s") {
          desc = "Matches any whitespace character (space, tab, newline)."
          type = "class"
        } else if (escaped === "D") {
          desc = "Matches any non-digit character."
          type = "class"
        } else if (escaped === "W") {
          desc = "Matches any non-word character."
          type = "class"
        } else if (escaped === "S") {
          desc = "Matches any non-whitespace character."
          type = "class"
        }

        // Check quantifier
        let q = ""
        if (nextChar() === "+" || nextChar() === "*" || nextChar() === "?") {
          q = consume()
        } else if (nextChar() === "{") {
          let qContent = ""
          while (i < regexStr.length && nextChar() !== "}") {
            qContent += consume()
          }
          qContent += consume() // consume }
          q = qContent
        }

        parsedNodes.push({
          type,
          value: "\\" + escaped,
          description: desc,
          quantifier: q || undefined
        })
        continue
      }

      // Capturing Group
      if (char === "(") {
        consume() // consume (
        let isCapturing = true
        let groupHeader = `Group #${groupCounter++}`
        if (nextChar() === "?") {
          consume()
          if (nextChar() === ":") {
            consume()
            isCapturing = false
            groupHeader = "Non-capturing Group"
          }
        }

        // Get matching group contents
        let groupContent = ""
        let depth = 1
        while (i < regexStr.length && depth > 0) {
          const next = consume()
          if (next === "(") depth++
          else if (next === ")") depth--
          
          if (depth > 0) {
            groupContent += next
          }
        }

        // Check quantifier
        let q = ""
        if (nextChar() === "+" || nextChar() === "*" || nextChar() === "?") {
          q = consume()
        } else if (nextChar() === "{") {
          let qContent = ""
          while (i < regexStr.length && nextChar() !== "}") {
            qContent += consume()
          }
          qContent += consume() // consume }
          q = qContent
        }

        parsedNodes.push({
          type: "group",
          value: `(${groupContent})`,
          description: `${groupHeader}: Matches the sequence inside the parenthesis ${isCapturing ? "and captures the matched tokens" : ""}.`,
          quantifier: q || undefined,
          // Recursively parse group inner tokens
          children: parseGroupContent(groupContent)
        })
        continue
      }

      // Character sets/classes
      if (char === "[") {
        let setContent = consume() // consume [
        while (i < regexStr.length && nextChar() !== "]") {
          setContent += consume()
        }
        setContent += consume() // consume ]

        // Check quantifier
        let q = ""
        if (nextChar() === "+" || nextChar() === "*" || nextChar() === "?") {
          q = consume()
        } else if (nextChar() === "{") {
          let qContent = ""
          while (i < regexStr.length && nextChar() !== "}") {
            qContent += consume()
          }
          qContent += consume() // consume }
          q = qContent
        }

        parsedNodes.push({
          type: "class",
          value: setContent,
          description: `Matches any single character listed inside the set: '${setContent}'.`,
          quantifier: q || undefined
        })
        continue
      }

      // Wildcard
      if (char === ".") {
        consume()
        let q = ""
        if (nextChar() === "+" || nextChar() === "*" || nextChar() === "?") {
          q = consume()
        }
        parsedNodes.push({
          type: "wildcard",
          value: ".",
          description: "Matches any single character except line terminators.",
          quantifier: q || undefined
        })
        continue
      }

      // Standard literals
      let literalWord = consume()
      while (i < regexStr.length && /[a-zA-Z0-9_-]/.test(nextChar())) {
        literalWord += consume()
      }

      // Check quantifier on the last character if it is a quantifier
      let q = ""
      if (nextChar() === "+" || nextChar() === "*" || nextChar() === "?") {
        q = consume()
      }

      parsedNodes.push({
        type: "literal",
        value: literalWord,
        description: `Matches the literal word or string '${literalWord}'.`,
        quantifier: q || undefined
      })
    }

    setNodes(parsedNodes)
  }, [])

  // Helper to parse subcontents inside capturing groups
  const parseGroupContent = (sub: string): RegexNode[] => {
    const list: RegexNode[] = []
    let idx = 0
    while (idx < sub.length) {
      const c = sub[idx]
      if (c === "\\") {
        idx += 2
        list.push({
          type: "class",
          value: "\\" + sub[idx - 1],
          description: "Escape sequence."
        })
      } else if (c === "[") {
        let set = ""
        while (idx < sub.length && sub[idx] !== "]") {
          set += sub[idx++]
        }
        set += "]"
        idx++
        list.push({
          type: "class",
          value: set,
          description: "Character class set."
        })
      } else {
        list.push({
          type: "literal",
          value: c,
          description: `Literal character '${c}'`
        })
        idx++
      }
    }
    return list
  }

  React.useEffect(() => {
    parseRegex(pattern)
  }, [pattern, parseRegex])

  const renderQuantifierLabel = (q?: string) => {
    if (!q) return null
    let title = "Match count"
    if (q === "+") title = "One or more times (1+)"
    else if (q === "*") title = "Zero or more times (0+)"
    else if (q === "?") title = "Optional (0 or 1)"
    else if (q.startsWith("{")) title = `Matches exactly ${q}`

    return (
      <span className="text-[8px] bg-accent text-accent-foreground border border-foreground px-1 py-0.5 rounded-sm font-black tracking-wide uppercase mt-1">
        {title}
      </span>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          REGEX PLAYGROUND
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-accent animate-pulse" />
          <span>REGULAR EXPRESSION PARSER & TREE VISUALIZER</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Paste your regex patterns below. The engine compiles and maps out token branches, group scopes, character filters, and matching pathways instantly.
        </p>
      </div>

      {/* Editor & Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Pattern Input Sidebar */}
        <div className="lg:col-span-1 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--primary)] space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase font-bold">REGEX CONFIGURATION</span>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase">Input Regex Pattern:</label>
              <div className="relative border-2 border-foreground bg-zinc-950 p-2 shadow-[2px_2px_0px_0px_#ffffff] flex items-center gap-2">
                <span className="text-primary font-black ml-1 select-none">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-zinc-700 font-mono py-1"
                  placeholder="^([a-z]+)@([a-z]+)\.com$"
                />
                <span className="text-primary font-black mr-1 select-none">/g</span>
              </div>
            </div>

            {error ? (
              <div className="border border-red-800 bg-red-950/20 p-3 text-xs text-red-400 leading-relaxed flex gap-2 rounded-sm">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong>COMPILE ERROR:</strong>
                  <p className="mt-1 text-[11px] break-all">{error}</p>
                </div>
              </div>
            ) : (
              <div className="border border-green-800 bg-green-950/20 p-3 text-xs text-green-400 leading-relaxed flex gap-2 rounded-sm">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong>SUCCESSFULLY COMPILED:</strong>
                  <p className="mt-1 text-[10px]">All anchors, quantifiers, and groupings are syntactically sound.</p>
                </div>
              </div>
            )}
          </div>

          {/* Node detail block */}
          {selectedNode ? (
            <div className="border-2 border-foreground bg-zinc-900 p-4 space-y-3 relative shadow-[3px_3px_0px_0px_var(--accent)]">
              <span className="absolute top-1 right-2 text-[8px] font-black text-accent uppercase">NODE INSPECTOR</span>
              <h4 className="text-sm font-black uppercase text-foreground">{selectedNode.type}</h4>
              <pre className="bg-black border border-border p-2 text-xs text-primary font-bold overflow-x-auto">
                <code>{selectedNode.value}</code>
              </pre>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {selectedNode.description}
              </p>
              {selectedNode.quantifier && (
                <div className="text-[10px] text-zinc-500">
                  Quantifier: <code className="text-accent">{selectedNode.quantifier}</code>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-500">
              <HelpCircle className="h-6 w-6 mx-auto mb-2 text-zinc-600" />
              Click on any schematic node in the visual chart to see its parsing scope and match behavior.
            </div>
          )}
        </div>

        {/* Visual Graph Viewport */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-4 border-foreground p-6 bg-zinc-950 min-h-[380px] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative flex flex-col justify-between overflow-x-auto">
            <span className="text-[9px] font-black text-black bg-zinc-200 border border-zinc-400 px-2 py-0.5 self-start uppercase select-none mb-6">
              Tree Layout Flowchart
            </span>

            {/* Visualizer flowchart */}
            <div className="flex-grow flex items-center justify-start gap-4 py-8 overflow-x-auto min-w-full">
              {/* Start anchor */}
              <div className="flex items-center">
                <div className="border-2 border-foreground bg-black px-3 py-1.5 font-black text-[10px] text-zinc-300 uppercase shadow-[2px_2px_0px_0px_#ffffff] select-none">
                  ▶ START
                </div>
                <div className="w-6 h-0.5 bg-foreground relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 border-l-[4px] border-l-foreground border-y-[4px] border-y-transparent"></div>
                </div>
              </div>

              {/* Parsed Nodes Flow */}
              {nodes.map((node, index) => {
                const isSelected = selectedNode === node
                return (
                  <div key={index} className="flex items-center shrink-0">
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`border-2 p-3 font-mono cursor-pointer transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-foreground shadow-[3px_3px_0px_0px_#ffffff] scale-105"
                          : "bg-zinc-900 border-zinc-700 text-foreground hover:border-foreground hover:bg-zinc-800"
                      }`}
                    >
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
                        {node.type}
                      </span>
                      <span className="text-xs font-black px-1.5 py-0.5 bg-black border border-border text-green-400">
                        {node.value}
                      </span>
                      {renderQuantifierLabel(node.quantifier)}

                      {/* Display sub-children inside group box */}
                      {node.children && node.children.length > 0 && (
                        <div className="mt-3 border border-zinc-800 bg-zinc-950/60 p-2 flex gap-1 items-center">
                          {node.children.map((child, cIdx) => (
                            <span key={cIdx} className="text-[9px] px-1.5 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-400">
                              {child.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Connection Line */}
                    <div className="w-6 h-0.5 bg-foreground relative shrink-0">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 border-l-[4px] border-l-foreground border-y-[4px] border-y-transparent"></div>
                    </div>
                  </div>
                )
              })}

              {/* End anchor */}
              <div className="flex items-center shrink-0">
                <div className="border-2 border-foreground bg-black px-3 py-1.5 font-black text-[10px] text-zinc-300 uppercase shadow-[2px_2px_0px_0px_#ffffff] select-none">
                  ■ MATCHED
                </div>
              </div>
            </div>

            <div className="flex gap-2 items-center text-[9px] text-zinc-500 select-none mt-6">
              <Info className="h-3.5 w-3.5 text-accent" />
              <span>Regex parser analyzes standard modifiers, capture sets, escapes and groups client-side.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
