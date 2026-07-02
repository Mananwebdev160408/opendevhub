"use client"

import * as React from "react"
import { Copy, Check, Play, RefreshCw, Eye } from "lucide-react"
import { CopyBtn } from "./ToolHelpers"
import * as yaml from "js-yaml"

export function JsonFormatterTool() {
  const [input, setInput] = React.useState('{"name":"opendevhub","status":"active","tools":32}')
  const [spacing, setSpacing] = React.useState("2")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const processJson = () => {
    setError(null)
    try {
      if (!input.trim()) {
        setOutput("")
        return
      }
      const parsed = JSON.parse(input)
      const space = spacing === "tab" ? "\t" : parseInt(spacing, 10)
      setOutput(JSON.stringify(parsed, null, space))
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax.")
      setOutput("")
    }
  }

  React.useEffect(() => {
    processJson()
  }, [input, spacing])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">JSON FORMATTER / VALIDATOR</span>
        <div className="flex items-center gap-3">
          <label className="text-[10px] text-zinc-500 font-bold uppercase">SPACING:</label>
          <select
            value={spacing}
            onChange={(e) => setSpacing(e.target.value)}
            className="border-2 border-foreground bg-black px-2 py-0.5 text-xs text-foreground cursor-pointer"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="tab">Tabs</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">INPUT JSON:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON here e.g. {"foo": "bar"}'
            className="w-full h-80 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">FORMATTED OUTPUT:</span>
            {output && <CopyBtn value={output} />}
          </div>
          {error ? (
            <div className="w-full h-80 bg-red-950/20 border-2 border-destructive p-3 text-xs text-red-400 overflow-y-auto leading-relaxed">
              <strong>JSON PARSE FAILURE:</strong>
              <p className="mt-2">{error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Output will appear here..."
              className="w-full h-80 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function MinifierTool() {
  const [input, setInput] = React.useState("body {\n  background-color: #000;\n  color: #fff;\n}")
  const [mode, setMode] = React.useState<"css" | "js" | "html">("css")
  const [output, setOutput] = React.useState("")

  React.useEffect(() => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    let minified = input
    if (mode === "css") {
      minified = input
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{\}:;])\s*/g, "$1")
        .trim()
    } else if (mode === "js") {
      minified = input
        .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "")
        .replace(/\s+/g, " ")
        .trim()
    } else {
      minified = input
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s+/g, " ")
        .trim()
    }
    setOutput(minified)
  }, [input, mode])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">CODE MINIFIER (CSS/JS/HTML)</span>
        <div className="flex border-2 border-foreground bg-black select-none">
          {["css", "js", "html"].map((type) => (
            <button
              key={type}
              onClick={() => setMode(type as any)}
              className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
                mode === type ? "bg-primary text-primary-foreground" : "text-zinc-500 hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">EXPANDED CODE:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">MINIFIED CODE:</span>
            {output && <CopyBtn value={output} />}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Minified output will print here..."
            className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
          />
        </div>
      </div>
    </div>
  )
}

export function CsvViewerTool() {
  const [input, setInput] = React.useState("id,name,stars,language\n1,react,221000,JavaScript\n2,next.js,122500,TypeScript\n3,rust,97800,Rust")
  const [headers, setHeaders] = React.useState<string[]>([])
  const [rows, setRows] = React.useState<string[][]>([])
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setError(null)
    setHeaders([])
    setRows([])
    if (!input.trim()) return

    try {
      const lines = input.trim().split("\n")
      if (lines.length === 0) return

      const parsedHeaders = lines[0].split(",")
      const parsedRows = lines.slice(1).map((line) => line.split(","))

      setHeaders(parsedHeaders)
      setRows(parsedRows)
    } catch (e: any) {
      setError(e.message || "Failed parsing CSV data.")
    }
  }, [input])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">CSV FILE PARSER & GRID VIEW</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">RAW CSV DATA:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste comma separated values here..."
            className="w-full h-60 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">GRID RESULTS VIEW:</span>
          <div className="w-full h-60 bg-zinc-950 border-2 border-border overflow-auto p-2">
            {error ? (
              <span className="text-xs text-red-500 font-bold">{error}</span>
            ) : headers.length === 0 ? (
              <span className="text-xs text-zinc-600">Enter valid CSV values to view grid table.</span>
            ) : (
              <table className="w-full text-[11px] text-left border-collapse select-all">
                <thead>
                  <tr className="border-b-2 border-foreground bg-zinc-900 font-black">
                    {headers.map((h, i) => (
                      <th key={i} className="p-2 border border-zinc-800 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="border-b border-zinc-800/40 hover:bg-zinc-900/40">
                      {row.map((cell, i) => (
                        <td key={i} className="p-2 border border-zinc-800/40">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function YamlXmlTool() {
  const [input, setInput] = React.useState("<package>\n  <name>opendevhub</name>\n  <version>1.0</version>\n</package>")
  const [mode, setMode] = React.useState<"xml" | "yaml">("xml")
  const [isValid, setIsValid] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    if (!input.trim()) {
      setIsValid(null)
      return
    }

    if (mode === "xml") {
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(input, "application/xml")
        const parseError = doc.querySelector("parsererror")
        setIsValid(!parseError)
      } catch (e) {
        setIsValid(false)
      }
    } else {
      try {
        const lines = input.split("\n")
        let valid = true
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith("#")) continue
          if (trimmed.includes(":") === false && !trimmed.startsWith("-")) {
            valid = false
            break
          }
        }
        setIsValid(valid)
      } catch (e) {
        setIsValid(false)
      }
    }
  }, [input, mode])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">YAML / XML SYNTAX VIEW</span>
        <div className="flex border-2 border-foreground bg-black select-none">
          <button
            onClick={() => setMode("xml")}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "xml" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            xml View
          </button>
          <button
            onClick={() => setMode("yaml")}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "yaml" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            yaml View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">RAW {mode.toUpperCase()} INPUT:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">PARSED SYNTAX STATUS:</span>
          <div className="w-full h-64 bg-zinc-950 border-2 border-border p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">SYNTAX EVALUATION:</span>
              {isValid === null ? (
                <span className="text-xs text-zinc-500 font-bold">Waiting for input data...</span>
              ) : isValid ? (
                <span className="text-xs font-black text-green-400 bg-green-950/30 border border-green-800 px-3 py-1.5 block uppercase text-center">
                  Syntax is 100% Valid
                </span>
              ) : (
                <span className="text-xs font-black text-red-400 bg-red-950/30 border border-red-800 px-3 py-1.5 block uppercase text-center">
                  Syntax Error Detected
                </span>
              )}
            </div>
            
            <div className="border-t border-border pt-4 text-[10px] text-zinc-500 leading-normal">
              Checks for key tags nesting blocks (XML) or indentation structures (YAML) client-side in real-time.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function JsonToTypescriptTool() {
  const [input, setInput] = React.useState('{\n  "id": 1,\n  "name": "OpenDevHub",\n  "active": true,\n  "tags": ["developer", "tools"]\n}')
  const [interfaceName, setInterfaceName] = React.useState("RootInterface")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const convertJson = () => {
    setError(null)
    try {
      if (!input.trim()) {
        setOutput("")
        return
      }
      const parsed = JSON.parse(input)
      
      const interfaces: string[] = []
      const seen = new Set<string>()

      function parseObject(o: any, name: string): string {
        if (o === null) return "any"
        if (typeof o !== "object") return typeof o
        if (Array.isArray(o)) {
          if (o.length === 0) return "any[]"
          const elementTypes = Array.from(new Set(o.map(item => parseObject(item, name + "Item")))).join(" | ")
          return `(${elementTypes})[]`
        }

        const props: string[] = []
        for (const key of Object.keys(o)) {
          const val = o[key]
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/[^a-zA-Z0-9]/g, "")
          const typeStr = typeof val === "object" && val !== null
            ? (Array.isArray(val) ? parseObject(val, capitalizedKey) : capitalizedKey)
            : typeof val

          props.push(`  ${key}: ${typeStr};`)
          if (typeof val === "object" && val !== null && !Array.isArray(val)) {
            parseObject(val, capitalizedKey)
          }
        }

        const interfaceStr = `export interface ${name} {\n${props.join("\n")}\n}`
        if (!seen.has(name)) {
          seen.add(name)
          interfaces.push(interfaceStr)
        }
        return name
      }

      parseObject(parsed, interfaceName)
      setOutput(interfaces.reverse().join("\n\n"))
    } catch (e: any) {
      setError(e.message || "Failed to parse JSON. Please check syntax.")
      setOutput("")
    }
  }

  React.useEffect(() => {
    convertJson()
  }, [input, interfaceName])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">JSON TO TYPESCRIPT INTERFACE CONVERTER</span>
      <div className="flex gap-4 items-center">
        <label className="text-[10px] text-zinc-500 font-bold uppercase">ROOT INTERFACE NAME:</label>
        <input
          type="text"
          value={interfaceName}
          onChange={(e) => setInterfaceName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
          className="border-2 border-foreground bg-black px-2 py-0.5 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">INPUT JSON:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">TYPESCRIPT DECLARATIONS:</span>
            {output && <CopyBtn value={output} />}
          </div>
          {error ? (
            <div className="w-full h-80 bg-red-950/20 border-2 border-destructive p-3 text-xs text-red-400 overflow-y-auto leading-relaxed">
              <strong>JSON PARSE FAILURE:</strong>
              <p className="mt-2">{error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Interfaces will display here..."
              className="w-full h-80 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function YamlJsonConverterTool() {
  const [input, setInput] = React.useState("name: OpenDevHub\nversion: 1.0.0\ntags:\n  - developer\n  - toolbox\nactive: true")
  const [mode, setMode] = React.useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setError(null)
    if (!input.trim()) {
      setOutput("")
      return
    }

    try {
      if (mode === "yaml-to-json") {
        const doc = yaml.load(input)
        setOutput(JSON.stringify(doc, null, 2))
      } else {
        const doc = JSON.parse(input)
        setOutput(yaml.dump(doc, { indent: 2 }))
      }
    } catch (e: any) {
      setError(e.message || "Conversion error. Verify source syntax.")
      setOutput("")
    }
  }, [input, mode])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">YAML ↔ JSON CONVERTER</span>
        <div className="flex border-2 border-foreground bg-black select-none">
          <button
            onClick={() => {
              setMode("yaml-to-json")
              setInput("name: OpenDevHub\nversion: 1.0.0\ntags:\n  - developer\n  - toolbox\nactive: true")
            }}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "yaml-to-json" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            YAML → JSON
          </button>
          <button
            onClick={() => {
              setMode("json-to-yaml")
              setInput('{\n  "name": "OpenDevHub",\n  "version": "1.0.0",\n  "tags": [\n    "developer",\n    "toolbox"\n  ],\n  "active": true\n}')
            }}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "json-to-yaml" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            JSON → YAML
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">
            {mode === "yaml-to-json" ? "INPUT YAML:" : "INPUT JSON:"}
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">
              {mode === "yaml-to-json" ? "OUTPUT JSON:" : "OUTPUT YAML:"}
            </span>
            {output && <CopyBtn value={output} />}
          </div>
          {error ? (
            <div className="w-full h-80 bg-red-950/20 border-2 border-destructive p-3 text-xs text-red-400 overflow-y-auto leading-relaxed">
              <strong>CONVERSION FAILURE:</strong>
              <p className="mt-2 whitespace-pre-wrap">{error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              className="w-full h-80 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
            />
          )}
        </div>
      </div>
    </div>
  )
}
