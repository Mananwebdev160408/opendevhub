"use client"

import * as React from "react"
import { Copy, Check, Play, Pause, Trash2, Download, Search, Keyboard, BookOpen, Activity, Flame, RotateCcw, AlertTriangle, HelpCircle, CheckCircle, Clock } from "lucide-react"
import { CopyBtn } from "./ToolHelpers"

// Static Reference Database
const KEY_REFERENCE_DATABASE = [
  // Letters
  ...Array.from({ length: 26 }, (_, i) => {
    const char = String.fromCharCode(65 + i);
    return {
      name: `Letter ${char}`,
      key: char.toLowerCase(),
      code: `Key${char}`,
      keyCode: 65 + i,
      ascii: 97 + i,
      category: "letters"
    };
  }),
  // Numbers
  ...Array.from({ length: 10 }, (_, i) => ({
    name: `Digit ${i}`,
    key: String(i),
    code: `Digit${i}`,
    keyCode: 48 + i,
    ascii: 48 + i,
    category: "numbers"
  })),
  // Function keys
  ...Array.from({ length: 12 }, (_, i) => ({
    name: `F${i + 1}`,
    key: `F${i + 1}`,
    code: `F${i + 1}`,
    keyCode: 112 + i,
    ascii: null,
    category: "function"
  })),
  { name: "Escape", key: "Escape", code: "Escape", keyCode: 27, ascii: null, category: "function" },
  // Arrows
  { name: "Arrow Up", key: "ArrowUp", code: "ArrowUp", keyCode: 38, ascii: null, category: "arrow" },
  { name: "Arrow Down", key: "ArrowDown", code: "ArrowDown", keyCode: 40, ascii: null, category: "arrow" },
  { name: "Arrow Left", key: "ArrowLeft", code: "ArrowLeft", keyCode: 37, ascii: null, category: "arrow" },
  { name: "Arrow Right", key: "ArrowRight", code: "ArrowRight", keyCode: 39, ascii: null, category: "arrow" },
  // Modifiers
  { name: "Control Left", key: "Control", code: "ControlLeft", keyCode: 17, ascii: null, category: "modifier" },
  { name: "Control Right", key: "Control", code: "ControlRight", keyCode: 17, ascii: null, category: "modifier" },
  { name: "Shift Left", key: "Shift", code: "ShiftLeft", keyCode: 16, ascii: null, category: "modifier" },
  { name: "Shift Right", key: "Shift", code: "ShiftRight", keyCode: 16, ascii: null, category: "modifier" },
  { name: "Alt Left", key: "Alt", code: "AltLeft", keyCode: 18, ascii: null, category: "modifier" },
  { name: "Alt Right", key: "Alt", code: "AltRight", keyCode: 18, ascii: null, category: "modifier" },
  { name: "Meta Left (Win/Cmd)", key: "Meta", code: "MetaLeft", keyCode: 91, ascii: null, category: "modifier" },
  { name: "Meta Right (Win/Cmd)", key: "Meta", code: "MetaRight", keyCode: 92, ascii: null, category: "modifier" },
  { name: "Caps Lock", key: "CapsLock", code: "CapsLock", keyCode: 20, ascii: null, category: "modifier" },
  { name: "Num Lock", key: "NumLock", code: "NumLock", keyCode: 144, ascii: null, category: "modifier" },
  { name: "Scroll Lock", key: "ScrollLock", code: "ScrollLock", keyCode: 145, ascii: null, category: "modifier" },
  // Numpad
  ...Array.from({ length: 10 }, (_, i) => ({
    name: `Numpad ${i}`,
    key: String(i),
    code: `Numpad${i}`,
    keyCode: 96 + i,
    ascii: 48 + i,
    category: "numpad"
  })),
  { name: "Numpad Add", key: "+", code: "NumpadAdd", keyCode: 107, ascii: 43, category: "numpad" },
  { name: "Numpad Subtract", key: "-", code: "NumpadSubtract", keyCode: 109, ascii: 45, category: "numpad" },
  { name: "Numpad Multiply", key: "*", code: "NumpadMultiply", keyCode: 106, ascii: 42, category: "numpad" },
  { name: "Numpad Divide", key: "/", code: "NumpadDivide", keyCode: 111, ascii: 47, category: "numpad" },
  { name: "Numpad Decimal", key: ".", code: "NumpadDecimal", keyCode: 110, ascii: 46, category: "numpad" },
  // Common symbols
  { name: "Space", key: " ", code: "Space", keyCode: 32, ascii: 32, category: "letters" },
  { name: "Enter", key: "Enter", code: "Enter", keyCode: 13, ascii: null, category: "letters" },
  { name: "Tab", key: "Tab", code: "Tab", keyCode: 9, ascii: null, category: "modifier" },
  { name: "Backspace", key: "Backspace", code: "Backspace", keyCode: 8, ascii: null, category: "modifier" },
  { name: "Delete", key: "Delete", code: "Delete", keyCode: 46, ascii: null, category: "arrow" }
]

interface VirtualKey {
  code: string
  label: string
  width?: string
  type: "alphanumeric" | "modifier" | "navigation" | "function" | "numpad"
}

interface LoggedEvent {
  id: string
  type: string
  key: string
  code: string
  keyCode: number
  ascii: number | null
  location: string
  repeat: boolean
  timestamp: string
  duration?: number
}

function JsonViewer({ data }: { data: any }) {
  const jsonString = JSON.stringify(data, null, 2)
  const highlighted = jsonString
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
      let cls = "text-yellow-500 font-medium"
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-primary font-bold dark:text-emerald-400"
        } else {
          cls = "text-amber-600 dark:text-amber-300"
        }
      } else if (/true|false/.test(match)) {
        cls = "text-blue-600 dark:text-blue-400 font-bold"
      } else if (/null/.test(match)) {
        cls = "text-zinc-500"
      } else {
        cls = "text-orange-500 dark:text-orange-400"
      }
      return `<span class="${cls}">${match}</span>`
    })

  return (
    <pre
      className="bg-zinc-950 text-foreground text-xs font-mono p-4 border-2 border-foreground overflow-x-auto select-text leading-relaxed max-h-96"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  )
}

export function KeycodeListenerTool() {
  const [lastEvent, setLastEvent] = React.useState<any>(null)
  const [heldKeys, setHeldKeys] = React.useState<Map<string, { time: number; key: string }>>(new Map())
  const [eventHistory, setEventHistory] = React.useState<LoggedEvent[]>([])
  const [isPaused, setIsPaused] = React.useState(false)
  const [preventDefaultToggle, setPreventDefaultToggle] = React.useState(false)
  const [capsLock, setCapsLock] = React.useState(false)
  const [numLock, setNumLock] = React.useState(false)
  const [scrollLock, setScrollLock] = React.useState(false)

  // Heatmap
  const [heatmap, setHeatmap] = React.useState<Record<string, number>>({})
  const [showHeatmap, setShowHeatmap] = React.useState(false)
  const [selectedLayout, setSelectedLayout] = React.useState<"US" | "UK">("US")
  
  // Navigation
  const [activeTab, setActiveTab] = React.useState<"log" | "inspector" | "reference" | "typing" | "mobile">("log")
  
  // Filters & Search
  const [historySearch, setHistorySearch] = React.useState("")
  const [historyTypeFilter, setHistoryTypeFilter] = React.useState<"all" | "keydown" | "keyup">("all")
  const [referenceSearch, setReferenceSearch] = React.useState("")
  const [referenceCategory, setReferenceCategory] = React.useState<string>("all")

  // Typing Speed Test States
  const typingTarget = "The quick brown fox jumps over the lazy dog. Web developers inspect keycodes and keystrokes in real-time."
  const [typingInput, setTypingInput] = React.useState("")
  const [typingStartTime, setTypingStartTime] = React.useState<number | null>(null)
  const [typingEndTime, setTypingEndTime] = React.useState<number | null>(null)
  const [typingStats, setTypingStats] = React.useState({ wpm: 0, kpm: 0, accuracy: 100 })

  // Mobile support states
  const [mobileInputVal, setMobileInputVal] = React.useState("")
  const [mobileLog, setMobileLog] = React.useState<string[]>([])

  // ASCII helper
  const getAsciiValue = (key: string): number | null => {
    if (key.length === 1) {
      const code = key.charCodeAt(0)
      if (code >= 32 && code <= 126) {
        return code
      }
    }
    return null
  }

  // Key locations lookup
  const getKeyLocation = (loc: number): string => {
    switch (loc) {
      case 0: return "Standard"
      case 1: return "Left"
      case 2: return "Right"
      case 3: return "Numpad"
      default: return "Unknown"
    }
  }

  // Handle Event Triggers
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Manage Lock Keys State
      setCapsLock(e.getModifierState("CapsLock"))
      setNumLock(e.getModifierState("NumLock"))
      setScrollLock(e.getModifierState("ScrollLock"))

      // If active target is an input field, do not block browser defaults
      const activeEl = document.activeElement
      const isInput = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.getAttribute("contenteditable") === "true")
      if (!isInput && preventDefaultToggle) {
        e.preventDefault()
      }



      // Track Held Keys and heatmaps
      const time = Date.now()
      setHeldKeys(prev => {
        const next = new Map(prev)
        if (!next.has(e.code)) {
          next.set(e.code, { time, key: e.key === " " ? "Space" : e.key })
        }
        return next
      })

      setHeatmap(prev => ({
        ...prev,
        [e.code]: (prev[e.code] || 0) + 1
      }))

      if (isPaused) return

      // Serialize Event
      const ascii = getAsciiValue(e.key)
      const serialized = {
        key: e.key === " " ? "Space" : e.key,
        code: e.code,
        which: e.which || e.keyCode,
        keyCode: e.keyCode || e.which,
        location: getKeyLocation(e.location),
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey,
        repeat: e.repeat,
        timeStamp: parseFloat(e.timeStamp.toFixed(2))
      }

      setLastEvent(serialized)

      // Add to history log
      const newLog: LoggedEvent = {
        id: Math.random().toString(36).substring(2, 9),
        type: "keydown",
        key: serialized.key,
        code: serialized.code,
        keyCode: serialized.keyCode,
        ascii,
        location: serialized.location,
        repeat: serialized.repeat,
        timestamp: new Date().toLocaleTimeString()
      }

      setEventHistory(prev => [newLog, ...prev].slice(0, 100))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      // Lock Keys
      setCapsLock(e.getModifierState("CapsLock"))
      setNumLock(e.getModifierState("NumLock"))
      setScrollLock(e.getModifierState("ScrollLock"))

      const activeEl = document.activeElement
      const isInput = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.getAttribute("contenteditable") === "true")
      if (!isInput && preventDefaultToggle) {
        e.preventDefault()
      }



      // Find press duration
      let duration: number | undefined
      const pressData = heldKeys.get(e.code)
      if (pressData) {
        duration = Date.now() - pressData.time
      }

      setHeldKeys(prev => {
        const next = new Map(prev)
        next.delete(e.code)
        return next
      })

      if (isPaused) return

      const ascii = getAsciiValue(e.key)
      const newLog: LoggedEvent = {
        id: Math.random().toString(36).substring(2, 9),
        type: "keyup",
        key: e.key === " " ? "Space" : e.key,
        code: e.code,
        keyCode: e.keyCode || e.which,
        ascii,
        location: getKeyLocation(e.location),
        repeat: e.repeat,
        timestamp: new Date().toLocaleTimeString(),
        duration
      }

      setEventHistory(prev => [newLog, ...prev].slice(0, 100))
    }

    const handleBlur = () => {
      setHeldKeys(new Map())
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("blur", handleBlur)
    }
  }, [isPaused, heldKeys, preventDefaultToggle])

  // Clear Event History
  const clearHistory = () => {
    setEventHistory([])
    setLastEvent(null)
  }

  // Export Events (JSON, CSV, TXT)
  const exportHistory = (format: "json" | "csv" | "txt") => {
    if (eventHistory.length === 0) return
    let content = ""
    let mime = "text/plain"
    let filename = `keyboard-events.${format}`

    if (format === "json") {
      content = JSON.stringify(eventHistory, null, 2)
      mime = "application/json"
    } else if (format === "csv") {
      content = "Timestamp,Type,Key,Code,KeyCode,ASCII,Location,Repeat,Duration(ms)\n"
      eventHistory.forEach(ev => {
        content += `"${ev.timestamp}","${ev.type}","${ev.key}","${ev.code}",${ev.keyCode},${ev.ascii ?? ""},"${ev.location}",${ev.repeat},${ev.duration ?? ""}\n`
      })
      mime = "text/csv"
    } else {
      eventHistory.forEach(ev => {
        content += `[${ev.timestamp}] ${ev.type.toUpperCase()}: Key="${ev.key}" Code="${ev.code}" KeyCode=${ev.keyCode} ASCII=${ev.ascii ?? "N/A"} Location=${ev.location} Repeat=${ev.repeat} ${ev.duration ? `Held=${ev.duration}ms` : ""}\n`
      })
    }

    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Copy History to Clipboard
  const copyHistoryToClipboard = () => {
    if (eventHistory.length === 0) return
    let text = "Timestamp\tType\tKey\tCode\tKeyCode\tASCII\tLocation\tDuration\n"
    eventHistory.forEach(ev => {
      text += `${ev.timestamp}\t${ev.type}\t${ev.key}\t${ev.code}\t${ev.keyCode}\t${ev.ascii ?? "-"}\t${ev.location}\t${ev.duration ? `${ev.duration}ms` : "-"}\n`
    })
    navigator.clipboard.writeText(text)
  }

  // Shortcut combo generation
  const getHeldCombinationString = () => {
    const parts: string[] = []
    const keysArr = Array.from(heldKeys.values())
    const codesArr = Array.from(heldKeys.keys())
    
    if (codesArr.includes("ControlLeft") || codesArr.includes("ControlRight")) parts.push("Ctrl")
    if (codesArr.includes("ShiftLeft") || codesArr.includes("ShiftRight")) parts.push("Shift")
    if (codesArr.includes("AltLeft") || codesArr.includes("AltRight")) parts.push("Alt")
    if (codesArr.includes("MetaLeft") || codesArr.includes("MetaRight")) parts.push("Meta")

    keysArr.forEach(item => {
      if (!["Control", "Shift", "Alt", "Meta", "Ctrl", "AltGraph"].includes(item.key)) {
        parts.push(item.key)
      }
    })

    return parts.length > 0 ? parts.join(" + ") : ""
  }



  // Typing Speed Calculation
  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setTypingInput(val)

    if (!typingStartTime && val.length > 0) {
      setTypingStartTime(Date.now())
      setTypingEndTime(null)
    }

    // Accuracy Calculation
    let correctChars = 0
    const minLen = Math.min(val.length, typingTarget.length)
    for (let i = 0; i < minLen; i++) {
      if (val[i] === typingTarget[i]) {
        correctChars++
      }
    }
    const accuracy = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100

    // Time calculation
    const startTime = typingStartTime || Date.now()
    const now = Date.now()
    const elapsedSecs = (now - startTime) / 1000
    const elapsedMins = elapsedSecs / 60

    // Keystrokes & words speed
    const kpm = elapsedMins > 0 ? Math.round(val.length / elapsedMins) : 0
    const wpm = elapsedMins > 0 ? Math.round((val.length / 5) / elapsedMins) : 0

    setTypingStats({
      wpm,
      kpm,
      accuracy
    })

    if (val === typingTarget) {
      setTypingEndTime(now)
    }
  }

  const resetTypingSpeedTest = () => {
    setTypingInput("")
    setTypingStartTime(null)
    setTypingEndTime(null)
    setTypingStats({ wpm: 0, kpm: 0, accuracy: 100 })
  }

  // Mobile Log Support
  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setMobileInputVal(val)
    if (val) {
      const lastChar = val[val.length - 1]
      const logMsg = `Input: "${lastChar}" (length: ${val.length}) at ${new Date().toLocaleTimeString()}`
      setMobileLog(prev => [logMsg, ...prev].slice(0, 15))
    }
  }

  // Keyboard layout rows for Virtual Keyboard
  const keyboardRows: VirtualKey[][] = [
    // Row 1
    [
      { code: "Escape", label: "Esc", type: "function" },
      { code: "F1", label: "F1", type: "function" },
      { code: "F2", label: "F2", type: "function" },
      { code: "F3", label: "F3", type: "function" },
      { code: "F4", label: "F4", type: "function" },
      { code: "F5", label: "F5", type: "function" },
      { code: "F6", label: "F6", type: "function" },
      { code: "F7", label: "F7", type: "function" },
      { code: "F8", label: "F8", type: "function" },
      { code: "F9", label: "F9", type: "function" },
      { code: "F10", label: "F10", type: "function" },
      { code: "F11", label: "F11", type: "function" },
      { code: "F12", label: "F12", type: "function" },
    ],
    [
      { code: "Backquote", label: selectedLayout === "US" ? "`" : "`", type: "alphanumeric" },
      { code: "Digit1", label: "1", type: "alphanumeric" },
      { code: "Digit2", label: selectedLayout === "US" ? "2 @" : "2 \"", type: "alphanumeric" },
      { code: "Digit3", label: selectedLayout === "US" ? "3 #" : "3 £", type: "alphanumeric" },
      { code: "Digit4", label: "4", type: "alphanumeric" },
      { code: "Digit5", label: "5", type: "alphanumeric" },
      { code: "Digit6", label: "6", type: "alphanumeric" },
      { code: "Digit7", label: "7", type: "alphanumeric" },
      { code: "Digit8", label: "8", type: "alphanumeric" },
      { code: "Digit9", label: "9", type: "alphanumeric" },
      { code: "Digit0", label: "0", type: "alphanumeric" },
      { code: "Minus", label: "-", type: "alphanumeric" },
      { code: "Equal", label: "=", type: "alphanumeric" },
      { code: "Backspace", label: "⌫ Backspace", type: "modifier", width: "w-20 sm:w-24 grow" }
    ],
    // Row 2
    [
      { code: "Tab", label: "⇥ Tab", type: "modifier", width: "w-12 sm:w-14" },
      { code: "KeyQ", label: "Q", type: "alphanumeric" },
      { code: "KeyW", label: "W", type: "alphanumeric" },
      { code: "KeyE", label: "E", type: "alphanumeric" },
      { code: "KeyR", label: "R", type: "alphanumeric" },
      { code: "KeyT", label: "T", type: "alphanumeric" },
      { code: "KeyY", label: "Y", type: "alphanumeric" },
      { code: "KeyU", label: "U", type: "alphanumeric" },
      { code: "KeyI", label: "I", type: "alphanumeric" },
      { code: "KeyO", label: "O", type: "alphanumeric" },
      { code: "KeyP", label: "P", type: "alphanumeric" },
      { code: "BracketLeft", label: "[", type: "alphanumeric" },
      { code: "BracketRight", label: "]", type: "alphanumeric" },
      { code: "Backslash", label: "\\", type: "alphanumeric", width: "grow" }
    ],
    // Row 3
    [
      { code: "CapsLock", label: `⇪ Caps ${capsLock ? "●" : ""}`, type: "modifier", width: "w-14 sm:w-16" },
      { code: "KeyA", label: "A", type: "alphanumeric" },
      { code: "KeyS", label: "S", type: "alphanumeric" },
      { code: "KeyD", label: "D", type: "alphanumeric" },
      { code: "KeyF", label: "F", type: "alphanumeric" },
      { code: "KeyG", label: "G", type: "alphanumeric" },
      { code: "KeyH", label: "H", type: "alphanumeric" },
      { code: "KeyJ", label: "J", type: "alphanumeric" },
      { code: "KeyK", label: "K", type: "alphanumeric" },
      { code: "KeyL", label: "L", type: "alphanumeric" },
      { code: "Semicolon", label: ";", type: "alphanumeric" },
      { code: "Quote", label: selectedLayout === "US" ? "' \"" : "' @", type: "alphanumeric" },
      { code: "Enter", label: "⏎ Enter", type: "modifier", width: "w-18 sm:w-20 grow" }
    ],
    // Row 4
    [
      { code: "ShiftLeft", label: "⇧ Shift", type: "modifier", width: "w-18 sm:w-24" },
      { code: "KeyZ", label: "Z", type: "alphanumeric" },
      { code: "KeyX", label: "X", type: "alphanumeric" },
      { code: "KeyC", label: "C", type: "alphanumeric" },
      { code: "KeyV", label: "V", type: "alphanumeric" },
      { code: "KeyB", label: "B", type: "alphanumeric" },
      { code: "KeyN", label: "N", type: "alphanumeric" },
      { code: "KeyM", label: "M", type: "alphanumeric" },
      { code: "Comma", label: ",", type: "alphanumeric" },
      { code: "Period", label: ".", type: "alphanumeric" },
      { code: "Slash", label: "/", type: "alphanumeric" },
      { code: "ShiftRight", label: "⇧ Shift", type: "modifier", width: "grow" }
    ],
    // Row 5
    [
      { code: "ControlLeft", label: "Ctrl", type: "modifier", width: "w-12 sm:w-14" },
      { code: "MetaLeft", label: "Win", type: "modifier", width: "w-10 sm:w-12" },
      { code: "AltLeft", label: "Alt", type: "modifier", width: "w-10 sm:w-12" },
      { code: "Space", label: "Space", type: "alphanumeric", width: "grow-[6] min-w-[120px]" },
      { code: "AltRight", label: "Alt", type: "modifier", width: "w-10 sm:w-12" },
      { code: "MetaRight", label: "Win", type: "modifier", width: "w-10 sm:w-12" },
      { code: "ControlRight", label: "Ctrl", type: "modifier", width: "w-12 sm:w-14" }
    ]
  ]

  // Filter Event History list
  const filteredEventHistory = React.useMemo(() => {
    return eventHistory.filter(ev => {
      const matchesSearch =
        ev.key.toLowerCase().includes(historySearch.toLowerCase()) ||
        ev.code.toLowerCase().includes(historySearch.toLowerCase()) ||
        String(ev.keyCode).includes(historySearch) ||
        (ev.ascii !== null && String(ev.ascii).includes(historySearch))
      
      const matchesType =
        historyTypeFilter === "all" || ev.type === historyTypeFilter
      
      return matchesSearch && matchesType
    })
  }, [eventHistory, historySearch, historyTypeFilter])

  // Filter Static Lookup Reference
  const filteredReference = React.useMemo(() => {
    return KEY_REFERENCE_DATABASE.filter(ref => {
      const matchesSearch =
        ref.name.toLowerCase().includes(referenceSearch.toLowerCase()) ||
        ref.key.toLowerCase().includes(referenceSearch.toLowerCase()) ||
        ref.code.toLowerCase().includes(referenceSearch.toLowerCase()) ||
        String(ref.keyCode).includes(referenceSearch) ||
        (ref.ascii !== null && String(ref.ascii).includes(referenceSearch))

      const matchesCat =
        referenceCategory === "all" || ref.category === referenceCategory

      return matchesSearch && matchesCat
    })
  }, [referenceSearch, referenceCategory])

  // Highlight key color code helper
  const getKeyColorCodeClass = (type: string, isPressed: boolean) => {
    if (isPressed) {
      return "bg-primary border-foreground text-primary-foreground scale-[0.98] shadow-inner font-black"
    }

    switch (type) {
      case "modifier":
        return "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
      case "navigation":
        return "bg-sky-950/20 border-sky-900 text-sky-400 hover:bg-sky-950/40"
      case "function":
        return "bg-amber-950/20 border-amber-900 text-amber-400 hover:bg-amber-950/40"
      default:
        return "bg-card border-border text-foreground hover:bg-zinc-900"
    }
  }

  // Get Heatmap styling
  const getKeyStyle = (code: string) => {
    if (!showHeatmap) return {}
    const count = heatmap[code] || 0
    if (count === 0) return {}

    const maxCount = Math.max(...Object.values(heatmap), 1)
    const ratio = count / maxCount

    return {
      backgroundColor: `rgba(249, 115, 22, ${Math.min(0.15 + ratio * 0.75, 0.9)})`,
      color: ratio > 0.4 ? "#ffffff" : undefined,
      borderColor: "rgba(249, 115, 22, 1)"
    }
  }

  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      
      {/* Configuration Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Keyboard className="h-5 w-5 text-primary" />
          <h2 className="text-base font-black uppercase text-foreground">
            Keyboard Tester & Reference
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={preventDefaultToggle}
              onChange={(e) => setPreventDefaultToggle(e.target.checked)}
              className="accent-primary border-2 border-foreground"
            />
            <span className="font-bold text-zinc-500 dark:text-zinc-400">BLOCK BROWSER DEFAULTS</span>
          </label>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <button
            onClick={() => setSelectedLayout(prev => prev === "US" ? "UK" : "US")}
            className="px-2 py-1 border-2 border-foreground bg-card font-bold hover:bg-accent hover:text-accent-foreground active:translate-y-0.5 transition-all cursor-pointer"
          >
            LAYOUT: {selectedLayout}
          </button>

          <button
            onClick={() => {
              setHeatmap({})
              setShowHeatmap(false)
            }}
            className="px-2 py-1 border-2 border-zinc-500 bg-card font-bold hover:bg-red-500 hover:text-white hover:border-foreground active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" /> RESET STATS
          </button>
        </div>
      </div>

      {/* Focus & Info Message banner */}
      <div className="border-2 border-border bg-card p-3 text-xs text-center flex flex-col sm:flex-row items-center justify-center gap-2 select-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse inline-block" />
        <span className="font-bold text-foreground uppercase tracking-wide">
          Click inside this page and press any keys to inspect.
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">
          Supports multiple keys held simultaneously.
        </span>
      </div>

      {/* Primary Key Value Details Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Large Key Display Box */}
        <div className="lg:col-span-2 border-4 border-foreground p-6 bg-card flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] min-h-60">
          <div className="flex items-center justify-between border-b border-border pb-2 text-[10px] text-zinc-500 font-bold uppercase select-none">
            <span>LAST DETECTED EVENT</span>
            <span>{lastEvent ? `TIMESTAMP: ${lastEvent.timeStamp}ms` : "AWAITING PRESS"}</span>
          </div>

          <div className="py-6 flex flex-col items-center justify-center text-center">
            {lastEvent ? (
              <>
                <div className="text-6xl font-black text-primary tracking-tight truncate max-w-full uppercase mb-2 select-all">
                  {lastEvent.key === " " ? "Space" : lastEvent.key}
                </div>
                <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  event.key
                </div>
              </>
            ) : (
              <div className="text-zinc-400 dark:text-zinc-600 font-bold text-lg select-none">
                Press a Key
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">event.code</span>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 truncate select-all">{lastEvent?.code || "-"}</div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">event.keyCode (which)</span>
              <div className="text-xs font-bold text-accent truncate select-all">
                {lastEvent?.keyCode || "-"}
                {lastEvent?.keyCode ? <span className="text-[9px] text-red-500 font-bold block">(Deprecated)</span> : null}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">ASCII Value</span>
              <div className="text-xs font-bold text-sky-600 dark:text-sky-400 truncate select-all">
                {lastEvent ? (getAsciiValue(lastEvent.key) ?? "N/A") : "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Modifier states & Held Keys details */}
        <div className="border-4 border-foreground p-6 bg-card flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
          <div className="space-y-4">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block border-b border-border pb-2 select-none">
              MODIFIER & LOCK STATES
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-black">
              <div className={`p-2 border-2 text-center transition-colors ${lastEvent?.ctrl ? "bg-primary border-foreground text-primary-foreground" : "border-border text-zinc-400"}`}>
                CTRL
              </div>
              <div className={`p-2 border-2 text-center transition-colors ${lastEvent?.shift ? "bg-primary border-foreground text-primary-foreground" : "border-border text-zinc-400"}`}>
                SHIFT
              </div>
              <div className={`p-2 border-2 text-center transition-colors ${lastEvent?.alt ? "bg-primary border-foreground text-primary-foreground" : "border-border text-zinc-400"}`}>
                ALT
              </div>
              <div className={`p-2 border-2 text-center transition-colors ${lastEvent?.meta ? "bg-primary border-foreground text-primary-foreground" : "border-border text-zinc-400"}`}>
                META (Win/Cmd)
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold mt-2">
              <div className={`p-1.5 border text-center ${capsLock ? "bg-amber-500 text-white border-foreground" : "border-border text-zinc-500"}`}>
                CAPS LOCK
              </div>
              <div className={`p-1.5 border text-center ${numLock ? "bg-amber-500 text-white border-foreground" : "border-border text-zinc-500"}`}>
                NUM LOCK
              </div>
              <div className={`p-1.5 border text-center ${scrollLock ? "bg-amber-500 text-white border-foreground" : "border-border text-zinc-500"}`}>
                SCROLL LOCK
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-xs border-b border-zinc-800/10 dark:border-zinc-100/10 pb-1.5">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">Location:</span>
              <span className="font-bold text-foreground">{lastEvent?.location || "-"}</span>
            </div>
            <div className="flex justify-between text-xs border-b border-zinc-800/10 dark:border-zinc-100/10 pb-1.5">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">Repeating:</span>
              <span className="font-bold text-foreground">{lastEvent?.repeat ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between text-xs pb-0.5">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">Held Combo:</span>
              <span className="font-bold text-primary truncate max-w-[150px]" title={getHeldCombinationString()}>
                {getHeldCombinationString() || "-"}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Virtual Keyboard */}
      <div className="border-4 border-foreground p-4 bg-zinc-950 text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
        
        {/* Keyboard Header / Toggles */}
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-3 mb-4 select-none">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Keyboard className="h-3.5 w-3.5" /> INTERACTIVE VIRTUAL LAYOUT ({selectedLayout})
          </span>
          
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="accent-primary"
              />
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Usage Heatmap Overlay</span>
            </label>
            <div className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 font-bold uppercase">
              Total Keys Logged: {Object.values(heatmap).reduce((a, b) => a + b, 0)}
            </div>
          </div>
        </div>

        {/* QWERTY Layout Grid */}
        <div className="space-y-1.5 overflow-x-auto pb-1 select-none">
          {keyboardRows.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 justify-start min-w-[640px]">
              {row.map((key) => {
                const isPressed = heldKeys.has(key.code)
                const colorClass = getKeyColorCodeClass(key.type, isPressed)
                const widthClass = key.width || "w-10 sm:w-11"
                
                return (
                  <button
                    key={key.code}
                    style={getKeyStyle(key.code)}
                    className={`h-10 text-[9px] sm:text-xs font-bold border-2 border-foreground rounded transition-all flex flex-col justify-between p-1.5 font-mono truncate cursor-default ${widthClass} ${colorClass}`}
                    title={`Code: ${key.code}`}
                  >
                    <span>{key.label}</span>
                    {showHeatmap && heatmap[key.code] ? (
                      <span className="text-[8px] opacity-75 self-end">{heatmap[key.code]}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Mini legend and Navigation clusters */}
        <div className="flex flex-wrap items-center justify-between border-t border-zinc-800 pt-3 mt-4 text-[9px] text-zinc-500 font-bold uppercase gap-4">
          <div className="flex flex-wrap gap-4 select-none">
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 border border-foreground bg-card rounded inline-block" />
              <span>Alphanumeric</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 border border-foreground bg-zinc-200 dark:bg-zinc-900 rounded inline-block" />
              <span>Modifiers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 border border-foreground bg-amber-100 dark:bg-amber-950/30 rounded inline-block" />
              <span>Function Keys</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 border border-foreground bg-primary rounded inline-block animate-pulse" />
              <span>Held / Pressed</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <div className="grid grid-cols-3 gap-1">
                {["Insert", "Home", "PageUp", "Delete", "End", "PageDown"].map(c => {
                  const isPressed = heldKeys.has(c)
                  return (
                    <div
                      key={c}
                      className={`w-7 h-7 text-[8px] flex items-center justify-center border border-foreground rounded font-mono font-bold ${isPressed ? "bg-primary text-primary-foreground" : "bg-zinc-900 text-zinc-400"}`}
                      title={c}
                    >
                      {c.substring(0, 3)}
                    </div>
                  )
                })}
              </div>

              <div className="relative w-20 h-14">
                <div
                  className={`absolute top-0 left-7 w-6 h-6 border border-foreground rounded text-[8px] flex items-center justify-center font-bold ${heldKeys.has("ArrowUp") ? "bg-primary text-primary-foreground" : "bg-zinc-900 text-zinc-400"}`}
                  title="ArrowUp"
                >
                  ▲
                </div>
                <div
                  className={`absolute bottom-0 left-0 w-6 h-6 border border-foreground rounded text-[8px] flex items-center justify-center font-bold ${heldKeys.has("ArrowLeft") ? "bg-primary text-primary-foreground" : "bg-zinc-900 text-zinc-400"}`}
                  title="ArrowLeft"
                >
                  ◀
                </div>
                <div
                  className={`absolute bottom-0 left-7 w-6 h-6 border border-foreground rounded text-[8px] flex items-center justify-center font-bold ${heldKeys.has("ArrowDown") ? "bg-primary text-primary-foreground" : "bg-zinc-900 text-zinc-400"}`}
                  title="ArrowDown"
                >
                  ▼
                </div>
                <div
                  className={`absolute bottom-0 left-14 w-6 h-6 border border-foreground rounded text-[8px] flex items-center justify-center font-bold ${heldKeys.has("ArrowRight") ? "bg-primary text-primary-foreground" : "bg-zinc-900 text-zinc-400"}`}
                  title="ArrowRight"
                >
                  ▶
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs panels container */}
      <div className="border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b-4 border-foreground overflow-x-auto select-none bg-zinc-900 dark:bg-zinc-950">
          {(["log", "inspector", "reference", "typing", "mobile"] as const).map((tab) => {
            const isActive = activeTab === tab
            const labelMap: Record<string, string> = {
              log: "EVENT HISTORY LOG",
              inspector: "KEYBOARD EVENT JSON",
              reference: "LOOKUP REFERENCE",
              typing: "SPEED TEST (WPM)",
              mobile: "MOBILE KEY TESTER"
            }
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-bold border-r-2 border-foreground font-mono transition-all cursor-pointer whitespace-nowrap ${isActive ? "bg-primary text-primary-foreground font-black" : "text-zinc-400 hover:bg-zinc-800"}`}
              >
                {labelMap[tab]}
              </button>
            )
          })}
        </div>

        {/* Tab View Contents */}
        <div className="p-4 sm:p-6 min-h-96">
          
          {/* TAB 1: Live Event Log */}
          {activeTab === "log" && (
            <div className="space-y-4">
              
              {/* Event Filter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950 p-3 border-2 border-foreground">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Filter key, code, keyCode..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-background border-2 border-foreground text-xs text-foreground font-mono outline-none w-48 sm:w-60 focus:border-primary"
                    />
                  </div>

                  <select
                    value={historyTypeFilter}
                    onChange={(e: any) => setHistoryTypeFilter(e.target.value)}
                    className="px-2 py-1.5 bg-background border-2 border-foreground text-xs text-foreground font-mono outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="all">ALL EVENTS</option>
                    <option value="keydown">KEYDOWN ONLY</option>
                    <option value="keyup">KEYUP ONLY</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1.5 border-2 border-foreground bg-card text-xs font-bold font-mono hover:bg-accent hover:text-accent-foreground active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1"
                  >
                    {isPaused ? <Play className="h-3.5 w-3.5 text-green-500" /> : <Pause className="h-3.5 w-3.5 text-amber-500" />}
                    <span>{isPaused ? "RESUME" : "PAUSE"}</span>
                  </button>

                  <button
                    onClick={clearHistory}
                    className="p-1.5 border-2 border-foreground bg-card text-xs font-bold font-mono hover:bg-red-500 hover:text-white active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>CLEAR</span>
                  </button>

                  <button
                    onClick={copyHistoryToClipboard}
                    className="p-1.5 border-2 border-foreground bg-card text-xs font-bold font-mono hover:bg-accent hover:text-accent-foreground active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    COPY LOG
                  </button>

                  <div className="relative group inline-block">
                    <button className="p-1.5 border-2 border-foreground bg-card text-xs font-bold font-mono hover:bg-accent hover:text-accent-foreground active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" /> EXPORT
                    </button>
                    <div className="absolute right-0 bottom-full mb-1 bg-zinc-950 border-2 border-foreground py-1 hidden group-hover:block z-20 w-24">
                      <button onClick={() => exportHistory("json")} className="w-full text-left px-2 py-1 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800">JSON</button>
                      <button onClick={() => exportHistory("csv")} className="w-full text-left px-2 py-1 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800">CSV</button>
                      <button onClick={() => exportHistory("txt")} className="w-full text-left px-2 py-1 text-[10px] text-zinc-400 hover:text-white hover:bg-zinc-800">TXT</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Logs list table */}
              <div className="overflow-x-auto border-2 border-foreground bg-zinc-950">
                <table className="w-full font-mono text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900 border-b border-foreground text-zinc-400 select-none">
                      <th className="p-2 border-r border-zinc-800">Timestamp</th>
                      <th className="p-2 border-r border-zinc-800">Event</th>
                      <th className="p-2 border-r border-zinc-800">key</th>
                      <th className="p-2 border-r border-zinc-800">code</th>
                      <th className="p-2 border-r border-zinc-800">keyCode</th>
                      <th className="p-2 border-r border-zinc-800">ASCII</th>
                      <th className="p-2 border-r border-zinc-800">Location</th>
                      <th className="p-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEventHistory.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-zinc-500 font-bold uppercase">
                          No events logged. Press keys to populate history log.
                        </td>
                      </tr>
                    ) : (
                      filteredEventHistory.map((ev) => (
                        <tr key={ev.id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                          <td className="p-2 border-r border-zinc-900 text-zinc-500 font-bold select-none">{ev.timestamp}</td>
                          <td className="p-2 border-r border-zinc-900">
                            <span className={`px-1.5 py-0.5 border font-bold text-[10px] select-none ${ev.type === "keydown" ? "bg-green-950/40 text-green-400 border-green-800" : "bg-blue-950/40 text-blue-400 border-blue-800"}`}>
                              {ev.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-2 border-r border-zinc-900 text-primary font-black">{ev.key}</td>
                          <td className="p-2 border-r border-zinc-900 text-yellow-500 select-all">{ev.code}</td>
                          <td className="p-2 border-r border-zinc-900 text-zinc-300 font-bold">{ev.keyCode}</td>
                          <td className="p-2 border-r border-zinc-900 text-sky-400">{ev.ascii ?? "-"}</td>
                          <td className="p-2 border-r border-zinc-900 text-zinc-400">{ev.location}</td>
                          <td className="p-2 text-[10px] text-zinc-400">
                            {ev.repeat && <span className="bg-amber-950/50 text-amber-500 border border-amber-900 px-1 py-0.2 rounded font-bold mr-1">REPEAT</span>}
                            {ev.duration !== undefined && <span className="text-emerald-500 font-bold">HELD {ev.duration}ms</span>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}



          {/* TAB 3: Developer Info (Full Event Object Viewer) */}
          {activeTab === "inspector" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2 select-none">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">
                  RAW KEYBOARD EVENT OBJECT VIEWER
                </span>
                {lastEvent && (
                  <div className="flex items-center gap-2">
                    <CopyBtn value={JSON.stringify(lastEvent, null, 2)} />
                  </div>
                )}
              </div>

              {lastEvent ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left: Code Box */}
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[10px] text-zinc-400 font-bold block">JSON Object Payload:</span>
                    <JsonViewer data={lastEvent} />
                  </div>

                  {/* Right: Quick Values copy grid */}
                  <div className="space-y-4">
                    <span className="text-[10px] text-zinc-400 font-bold block">Individual Values Copy:</span>
                    <div className="space-y-2 text-xs">
                      {[
                        { label: "event.key", val: lastEvent.key },
                        { label: "event.code", val: lastEvent.code },
                        { label: "event.keyCode", val: String(lastEvent.keyCode) },
                        { label: "ASCII Value", val: String(getAsciiValue(lastEvent.key) ?? "N/A") },
                        { label: "Key Location", val: lastEvent.location }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 border border-border bg-zinc-950">
                          <div>
                            <span className="text-[9px] text-zinc-500 font-bold block uppercase">{item.label}</span>
                            <span className="font-mono font-bold text-foreground select-all">{item.val}</span>
                          </div>
                          <button
                            onClick={() => navigator.clipboard.writeText(item.val)}
                            className="p-1 border border-border text-[9px] font-bold hover:bg-zinc-800 hover:text-white"
                          >
                            COPY
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-16 text-zinc-500 font-bold uppercase select-none">
                  Awaiting event triggers. Press any key to inspect full event.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Searchable Lookup Reference & Learn */}
          {activeTab === "reference" && (
            <div className="space-y-6">
              
              {/* Learning section header info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border pb-6">
                
                {/* Learn details */}
                <div className="space-y-3">
                  <h4 className="font-black text-foreground text-xs uppercase flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-primary" /> UNDERSTANDING KEYBOARD OBJECT APIs
                  </h4>
                  <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <div>
                      <strong className="text-foreground">event.key:</strong> Represents the character value of the pressed key, which updates depending on layout modifiers (e.g. pressing 1 with Shift outputs <code className="bg-zinc-100 dark:bg-zinc-900 px-1 border">"!"</code>).
                    </div>
                    <div>
                      <strong className="text-foreground">event.code:</strong> Represents the physical key location on the keyboard structure. It remains layout-independent (e.g. the key next to Tab always returns <code className="bg-zinc-100 dark:bg-zinc-900 px-1 border">"KeyQ"</code>).
                    </div>
                    <div>
                      <strong className="text-foreground">event.keyCode (Deprecated):</strong> Legacy property utilizing browser-specific character mappings. We strongly recommend using <code className="text-primary font-bold">key</code> or <code className="text-primary font-bold">code</code> for modern code bases.
                    </div>
                    <div>
                      <strong className="text-foreground">ASCII Value:</strong> Numeric character code matching the classic 7-bit ASCII reference. Only applies to standard printable characters (values 32 to 126).
                    </div>
                  </div>
                </div>

                {/* Common JS shortcut syntax details */}
                <div className="space-y-3">
                  <h4 className="font-black text-foreground text-xs uppercase flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" /> JAVASCRIPT SHORTCUT DETECT EXAMPLES
                  </h4>
                  <pre className="bg-zinc-950 text-emerald-400 p-3 border border-border text-[11px] font-mono leading-relaxed overflow-x-auto">
{`window.addEventListener("keydown", (e) => {
  // Detect Ctrl + Shift + K combo
  if (e.ctrlKey && e.shiftKey && e.key === "K") {
    e.preventDefault();
    console.log("Shortcut Triggered!");
  }
  
  // Detect Escape key
  if (e.key === "Escape") {
    closeModal();
  }
});`}
                  </pre>
                </div>

              </div>

              {/* Reference Search section */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase select-none">
                    OFFLINE KEY & KEYCODE LOOKUP DATABASE
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search lookup table..."
                        value={referenceSearch}
                        onChange={(e) => setReferenceSearch(e.target.value)}
                        className="pl-7 pr-2.5 py-1 bg-background border-2 border-foreground text-xs text-foreground font-mono outline-none w-48 focus:border-primary"
                      />
                    </div>

                    <select
                      value={referenceCategory}
                      onChange={(e) => setReferenceCategory(e.target.value)}
                      className="px-2 py-1 bg-background border-2 border-foreground text-xs text-foreground font-mono outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="all">ALL CATEGORIES</option>
                      <option value="letters">LETTERS</option>
                      <option value="numbers">NUMBERS</option>
                      <option value="function">FUNCTION KEYS</option>
                      <option value="arrow">ARROW/NAV KEYS</option>
                      <option value="modifier">MODIFIERS</option>
                      <option value="numpad">NUMPAD KEYS</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-y-auto max-h-80 border-2 border-foreground bg-zinc-950">
                  <table className="w-full text-xs font-mono text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-900 border-b border-foreground text-zinc-400 select-none">
                        <th className="p-2 border-r border-zinc-800">Key Name</th>
                        <th className="p-2 border-r border-zinc-800">event.key</th>
                        <th className="p-2 border-r border-zinc-800">event.code</th>
                        <th className="p-2 border-r border-zinc-800">Legacy keyCode</th>
                        <th className="p-2 border-r border-zinc-800">ASCII Code</th>
                        <th className="p-2">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReference.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-zinc-500 font-bold uppercase">
                            No matching keys found in reference table.
                          </td>
                        </tr>
                      ) : (
                        filteredReference.map((ref, idx) => (
                          <tr key={idx} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                            <td className="p-2 border-r border-zinc-900 font-bold text-foreground">{ref.name}</td>
                            <td className="p-2 border-r border-zinc-900 text-primary font-black">"{ref.key === " " ? "Space" : ref.key}"</td>
                            <td className="p-2 border-r border-zinc-900 text-amber-500">{ref.code}</td>
                            <td className="p-2 border-r border-zinc-900 text-zinc-400 font-bold">{ref.keyCode}</td>
                            <td className="p-2 border-r border-zinc-900 text-sky-400">{ref.ascii ?? "N/A"}</td>
                            <td className="p-2 text-zinc-500 text-[10px] uppercase font-bold">{ref.category}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: Typing Speed Test (WPM / KPM) */}
          {activeTab === "typing" && (
            <div className="space-y-4">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block border-b border-border pb-2">
                REAL-TIME TYPING SPEED MEASURE
              </span>
              <p className="text-xs text-zinc-500">
                Test your keyboard usage and speed in real-time. Start typing the target text below:
              </p>

              {/* Target Prompt Box */}
              <div className="p-4 bg-zinc-950 border-2 border-foreground select-none relative">
                <span className="absolute right-3 top-3 text-[9px] font-bold text-zinc-400">TARGET TEXT PROMPT</span>
                <p className="text-sm font-bold text-foreground leading-relaxed">
                  {typingTarget.split("").map((char, index) => {
                    let color = "text-zinc-400"
                    if (index < typingInput.length) {
                      color = typingInput[index] === char ? "text-green-500" : "text-red-500 border-b border-red-500"
                    }
                    return (
                      <span key={index} className={color}>
                        {char}
                      </span>
                    )
                  })}
                </p>
              </div>

              {/* Typing Input */}
              <textarea
                value={typingInput}
                onChange={handleTypingChange}
                disabled={typingEndTime !== null}
                placeholder="Click here and begin typing the prompt above..."
                className="w-full h-24 p-3 bg-zinc-950 border-2 border-foreground text-xs text-foreground font-mono outline-none focus:border-primary leading-relaxed resize-none"
              />

              {/* Stats display & reset */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 border-2 border-foreground bg-zinc-950">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className="text-[9px] text-zinc-500 font-bold block uppercase">SPEED (WPM)</span>
                    <span className="text-lg font-black text-primary">{typingStats.wpm}</span>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <span className="text-[9px] text-zinc-500 font-bold block uppercase">Keystrokes (KPM)</span>
                    <span className="text-lg font-black text-amber-500">{typingStats.kpm}</span>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <span className="text-[9px] text-zinc-500 font-bold block uppercase">Accuracy</span>
                    <span className={`text-lg font-black ${typingStats.accuracy > 90 ? "text-green-500" : "text-amber-500"}`}>
                      {typingStats.accuracy}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {typingEndTime !== null && (
                    <span className="text-xs text-green-500 font-bold animate-pulse flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> TEST COMPLETED!
                    </span>
                  )}
                  <button
                    onClick={resetTypingSpeedTest}
                    className="px-3 py-1.5 border-2 border-foreground bg-card text-xs font-bold font-mono hover:bg-accent hover:text-accent-foreground active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> START OVER
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Mobile Keyboard Tester */}
          {activeTab === "mobile" && (
            <div className="space-y-4">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block border-b border-border pb-2">
                MOBILE & EXTERNAL KEYBOARD DETECTOR
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Mobile Input Area */}
                <div className="border-2 border-foreground p-5 bg-zinc-950 space-y-3">
                  <p className="text-xs text-zinc-500 leading-normal">
                    Mobile OS virtual keyboards (like Android/iOS Gboard or SwiftKey) optimize inputs through composition engines. Traditional `keydown` events often fail or return `keyCode: 229`. Use this input to test text injection events.
                  </p>

                  <div>
                    <label className="text-[10px] text-zinc-400 font-bold block mb-1">TYPE TEST HERE ON MOBILE DEVICE:</label>
                    <input
                      type="text"
                      placeholder="Tap to open virtual keyboard..."
                      value={mobileInputVal}
                      onChange={handleMobileInput}
                      className="w-full bg-background border-2 border-foreground text-xs text-foreground p-2 outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setMobileInputVal("")
                      setMobileLog([])
                    }}
                    className="w-full py-1.5 border-2 border-foreground bg-card font-mono text-xs font-bold hover:bg-zinc-800 hover:text-white cursor-pointer active:translate-y-0.5 transition-all"
                  >
                    RESET MOBILE LOGS
                  </button>
                </div>

                {/* Mobile composition log */}
                <div className="border-2 border-foreground p-5 bg-zinc-950 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase block border-b border-zinc-800 pb-1">
                      INPUT COMPOSITION LOG
                    </span>
                    <div className="space-y-1 max-h-48 overflow-y-auto text-[11px] font-mono text-zinc-400">
                      {mobileLog.length === 0 ? (
                        <div className="text-zinc-600 italic py-8 text-center text-xs">
                          No text inputs detected yet.
                        </div>
                      ) : (
                        mobileLog.map((m, idx) => (
                          <div key={idx} className="border-b border-zinc-900/50 pb-1 flex items-center justify-between">
                            <span>{m}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
