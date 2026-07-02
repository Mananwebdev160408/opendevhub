"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Copy,
  Check,
  Info,
  Plus,
  Minus,
  RotateCcw,
  Share2,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Monitor,
  Tablet,
  Smartphone,
  HelpCircle,
  Trophy,
  Trash2,
  Sliders,
  Code2,
  FileCode,
  Layout,
  Eye,
  AlertCircle,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Accessibility
} from "lucide-react"

// --- TYPES & INTERFACES ---
interface GridItem {
  id: number;
  label: string;
  gridColumnStart: string; // "auto", "1", "2", etc.
  gridColumnEnd: string;
  gridRowStart: string;
  gridRowEnd: string;
  justifySelf: string;
  alignSelf: string;
  color: string;
  content?: string;
  isNestedGrid?: boolean;
  nestedGridCols?: string;
  nestedGridRows?: string;
  nestedGridGap?: number;
  nestedItems?: { id: number; label: string; color: string }[];
}

interface BreakpointConfig {
  columns: string[]; // ["1fr", "1fr", "1fr"]
  rows: string[]; // ["100px", "100px"]
  gap: number;
  rowGap: number;
  colGap: number;
  useIndividualGaps: boolean;
}

interface PlaygroundGridState {
  breakpoints: {
    desktop: BreakpointConfig;
    tablet: BreakpointConfig;
    mobile: BreakpointConfig;
  };
  activeBreakpoint: "desktop" | "tablet" | "mobile";
  container: {
    justifyItems: string;
    alignItems: string;
    justifyContent: string;
    alignContent: string;
    gridAutoFlow: string; // row, column, dense, row dense, column dense
    width: string;
    height: string;
    padding: number;
    borderWidth: number;
    borderRadius: number;
    background: string;
    borderColor: string;
  };
  items: GridItem[];
  namedAreas: string;
}

interface QuizChallenge {
  id: number;
  title: string;
  task: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stars: number;
  validate: (state: PlaygroundGridState) => boolean;
}

// --- CONSTANTS & PALETTE ---
const COLOR_PALETTE = [
  "#2dd4bf", // Teal
  "#a855f7", // Purple
  "#fbbf24", // Yellow/Amber
  "#f43f5e", // Rose
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f97316", // Orange
  "#ec4899", // Pink
]

const DEFAULT_CONTAINER = {
  justifyItems: "stretch",
  alignItems: "stretch",
  justifyContent: "stretch",
  alignContent: "stretch",
  gridAutoFlow: "row",
  width: "100%",
  height: "360px",
  padding: 16,
  borderWidth: 2,
  borderRadius: 0,
  background: "#09090b",
  borderColor: "#27272a",
}

const DEFAULT_ITEMS: GridItem[] = [
  { id: 1, label: "Item 1", gridColumnStart: "auto", gridColumnEnd: "auto", gridRowStart: "auto", gridRowEnd: "auto", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[0] },
  { id: 2, label: "Item 2", gridColumnStart: "auto", gridColumnEnd: "auto", gridRowStart: "auto", gridRowEnd: "auto", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[1] },
  { id: 3, label: "Item 3", gridColumnStart: "auto", gridColumnEnd: "auto", gridRowStart: "auto", gridRowEnd: "auto", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[2] },
  { id: 4, label: "Item 4", gridColumnStart: "auto", gridColumnEnd: "auto", gridRowStart: "auto", gridRowEnd: "auto", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[3] },
  { id: 5, label: "Item 5", gridColumnStart: "auto", gridColumnEnd: "auto", gridRowStart: "auto", gridRowEnd: "auto", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[4] },
  { id: 6, label: "Item 6", gridColumnStart: "auto", gridColumnEnd: "auto", gridRowStart: "auto", gridRowEnd: "auto", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[5] },
]

const INITIAL_STATE: PlaygroundGridState = {
  breakpoints: {
    desktop: {
      columns: ["1fr", "1fr", "1fr"],
      rows: ["120px", "120px"],
      gap: 16,
      rowGap: 16,
      colGap: 16,
      useIndividualGaps: false,
    },
    tablet: {
      columns: ["1fr", "1fr"],
      rows: ["120px", "120px", "120px"],
      gap: 12,
      rowGap: 12,
      colGap: 12,
      useIndividualGaps: false,
    },
    mobile: {
      columns: ["1fr"],
      rows: ["120px", "120px", "120px", "120px", "120px", "120px"],
      gap: 8,
      rowGap: 8,
      colGap: 8,
      useIndividualGaps: false,
    }
  },
  activeBreakpoint: "desktop",
  container: DEFAULT_CONTAINER,
  items: DEFAULT_ITEMS,
  namedAreas: "",
}

// --- CHALLENGES ---
const GRID_CHALLENGES: QuizChallenge[] = [
  {
    id: 1,
    title: "Span Two Columns",
    task: "Modify Item 2 so that it spans across exactly 2 columns. (Hint: set grid-column: span 2 or adjust column span controls).",
    difficulty: "Easy",
    stars: 1,
    validate: (s) => {
      const item2 = s.items.find(i => i.id === 2);
      if (!item2) return false;
      const start = parseInt(item2.gridColumnStart);
      const end = parseInt(item2.gridColumnEnd);
      if (item2.gridColumnStart.includes("span 2") || item2.gridColumnEnd.includes("span 2")) return true;
      if (!isNaN(start) && !isNaN(end) && end - start === 2) return true;
      return false;
    }
  },
  {
    id: 2,
    title: "Side-by-Side Split",
    task: "Make Item 1 span the first column, and Item 2 span columns 2 and 3. Set the columns template to '1fr 2fr 1fr'.",
    difficulty: "Medium",
    stars: 2,
    validate: (s) => {
      const activeBp = s.breakpoints[s.activeBreakpoint];
      const cols = activeBp.columns.join(" ");
      const item2 = s.items.find(i => i.id === 2);
      if (!cols.includes("2fr")) return false;
      if (!item2) return false;
      const start = parseInt(item2.gridColumnStart);
      const end = parseInt(item2.gridColumnEnd);
      return (start === 2 && end === 4) || item2.gridColumnStart === "2 / 4" || (item2.gridColumnStart === "2" && item2.gridColumnEnd === "4");
    }
  },
  {
    id: 3,
    title: "Change the Flow",
    task: "Switch the container auto-placement algorithm so items flow as columns instead of rows (set grid-auto-flow: column).",
    difficulty: "Easy",
    stars: 1.5,
    validate: (s) => s.container.gridAutoFlow === "column"
  },
  {
    id: 4,
    title: "Vertical Bento Box",
    task: "Align Item 3 to span 2 rows vertically (grid-row: span 2) and span 2 columns horizontally (grid-column: span 2).",
    difficulty: "Medium",
    stars: 2.5,
    validate: (s) => {
      const item3 = s.items.find(i => i.id === 3);
      if (!item3) return false;
      const isColSpan2 = item3.gridColumnStart.includes("span 2") || item3.gridColumnEnd.includes("span 2") || (parseInt(item3.gridColumnEnd) - parseInt(item3.gridColumnStart) === 2);
      const isRowSpan2 = item3.gridRowStart.includes("span 2") || item3.gridRowEnd.includes("span 2") || (parseInt(item3.gridRowEnd) - parseInt(item3.gridRowStart) === 2);
      return isColSpan2 && isRowSpan2;
    }
  },
  {
    id: 5,
    title: "Holy Grail Dashboard",
    task: "Create a 3-column dashboard where Item 1 (Header) spans columns 1 to 4 (entire width) and Item 6 (Footer) spans columns 1 to 4 at the bottom.",
    difficulty: "Hard",
    stars: 3,
    validate: (s) => {
      const item1 = s.items.find(i => i.id === 1);
      const item6 = s.items.find(i => i.id === 6);
      if (!item1 || !item6) return false;
      const i1Span = item1.gridColumnStart === "1 / 4" || item1.gridColumnStart === "1 / 5" || (item1.gridColumnStart === "1" && item1.gridColumnEnd === "4") || (item1.gridColumnStart === "1" && item1.gridColumnEnd === "5") || item1.gridColumnStart.includes("span 3") || item1.gridColumnStart.includes("span 4");
      const i6Span = item6.gridColumnStart === "1 / 4" || item6.gridColumnStart === "1 / 5" || (item6.gridColumnStart === "1" && item6.gridColumnEnd === "4") || (item6.gridColumnStart === "1" && item6.gridColumnEnd === "5") || item6.gridColumnStart.includes("span 3") || item6.gridColumnStart.includes("span 4");
      return i1Span && i6Span;
    }
  }
]

// --- CHEAT SHEET DATA ---
const GRID_CHEAT_SHEET = [
  { prop: "display: grid", desc: "Defines the element as a grid container and establishes a new grid formatting context." },
  { prop: "grid-template-columns", desc: "Defines the columns of the grid with a space-separated list of values. (e.g. repeat(3, 1fr))." },
  { prop: "grid-template-rows", desc: "Defines the rows of the grid with a space-separated list of values." },
  { prop: "grid-template-areas", desc: "Defines a grid template by referencing the names of the grid areas specified with the grid-area property." },
  { prop: "gap / column-gap / row-gap", desc: "Specifies the size of the grid lines (gutters) between columns and rows." },
  { prop: "grid-auto-flow", desc: "Controls how the auto-placement algorithm works, specifying exactly how auto-placed items get flowed into the grid." },
  { prop: "justify-items", desc: "Aligns grid items along the inline (row) axis (stretches, starts, ends, centers)." },
  { prop: "align-items", desc: "Aligns grid items along the block (column) axis." },
  { prop: "justify-content", desc: "Aligns the grid container's tracks along the inline axis when the total size of grid tracks is smaller than the grid container." },
  { prop: "align-content", desc: "Aligns the grid container's tracks along the block axis." },
  { prop: "grid-column / grid-row", desc: "Shorthands for specifying a grid item's size and location within the grid by contributing lines to its placement." },
  { prop: "justify-self / align-self", desc: "Aligns a specific grid item inside its cell, overriding the container's justify-items / align-items." }
]

// --- PRESET LAYOUTS ---
const PRESETS: Record<string, { name: string; columns: string[]; rows: string[]; items: GridItem[]; namedAreas?: string }> = {
  dashboard: {
    name: "Dashboard Panel",
    columns: ["200px", "1fr", "1fr"],
    rows: ["60px", "160px", "160px"],
    items: [
      { id: 1, label: "Navbar", gridColumnStart: "1", gridColumnEnd: "4", gridRowStart: "1", gridRowEnd: "2", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[0] },
      { id: 2, label: "Sidebar", gridColumnStart: "1", gridColumnEnd: "2", gridRowStart: "2", gridRowEnd: "4", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[1] },
      { id: 3, label: "Stats Card A", gridColumnStart: "2", gridColumnEnd: "3", gridRowStart: "2", gridRowEnd: "3", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[2] },
      { id: 4, label: "Stats Card B", gridColumnStart: "3", gridColumnEnd: "4", gridRowStart: "2", gridRowEnd: "3", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[3] },
      { id: 5, label: "Main Chart", gridColumnStart: "2", gridColumnEnd: "4", gridRowStart: "3", gridRowEnd: "4", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[4] }
    ]
  },
  gallery: {
    name: "Photo Grid",
    columns: ["1fr", "1fr", "1fr", "1fr"],
    rows: ["100px", "100px", "100px"],
    items: [
      { id: 1, label: "Large Hero", gridColumnStart: "1", gridColumnEnd: "3", gridRowStart: "1", gridRowEnd: "3", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[5] },
      { id: 2, label: "Square A", gridColumnStart: "3", gridColumnEnd: "4", gridRowStart: "1", gridRowEnd: "2", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[1] },
      { id: 3, label: "Square B", gridColumnStart: "4", gridColumnEnd: "5", gridRowStart: "1", gridRowEnd: "2", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[2] },
      { id: 4, label: "Wide Card", gridColumnStart: "3", gridColumnEnd: "5", gridRowStart: "2", gridRowEnd: "3", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[6] },
      { id: 5, label: "Full Footer", gridColumnStart: "1", gridColumnEnd: "5", gridRowStart: "3", gridRowEnd: "4", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[7] }
    ]
  },
  pricing: {
    name: "Pricing Cards",
    columns: ["1fr", "1.1fr", "1fr"],
    rows: ["280px"],
    items: [
      { id: 1, label: "Basic Plan ($9)", gridColumnStart: "1", gridColumnEnd: "2", gridRowStart: "auto", gridRowEnd: "auto", justifySelf: "stretch", alignSelf: "center", color: COLOR_PALETTE[4] },
      { id: 2, label: "Pro Plan ($29)", gridColumnStart: "2", gridColumnEnd: "3", gridRowStart: "auto", gridRowEnd: "auto", justifySelf: "stretch", alignSelf: "stretch", color: COLOR_PALETTE[1] },
      { id: 3, label: "Enterprise ($99)", gridColumnStart: "3", gridColumnEnd: "4", gridRowStart: "auto", gridRowEnd: "auto", justifySelf: "stretch", alignSelf: "center", color: COLOR_PALETTE[5] }
    ]
  },
  holyGrail: {
    name: "Holy Grail Layout",
    columns: ["180px", "1fr", "180px"],
    rows: ["60px", "200px", "60px"],
    items: [
      { id: 1, label: "Header", gridColumnStart: "1", gridColumnEnd: "4", gridRowStart: "1", gridRowEnd: "2", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[0] },
      { id: 2, label: "Left Sidebar", gridColumnStart: "1", gridColumnEnd: "2", gridRowStart: "2", gridRowEnd: "3", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[1] },
      { id: 3, label: "Main Content Area", gridColumnStart: "2", gridColumnEnd: "3", gridRowStart: "2", gridRowEnd: "3", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[2] },
      { id: 4, label: "Right Sidebar", gridColumnStart: "3", gridColumnEnd: "4", gridRowStart: "2", gridRowEnd: "3", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[3] },
      { id: 5, label: "Footer Info", gridColumnStart: "1", gridColumnEnd: "4", gridRowStart: "3", gridRowEnd: "4", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[6] }
    ]
  },
  bento: {
    name: "Bento Portfolio Grid",
    columns: ["1fr", "1fr", "1.2fr"],
    rows: ["120px", "120px", "120px"],
    items: [
      { id: 1, label: "Featured Work", gridColumnStart: "1", gridColumnEnd: "3", gridRowStart: "1", gridRowEnd: "2", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[0] },
      { id: 2, label: "About Me Card", gridColumnStart: "3", gridColumnEnd: "4", gridRowStart: "1", gridRowEnd: "3", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[1] },
      { id: 3, label: "Github Stats", gridColumnStart: "1", gridColumnEnd: "2", gridRowStart: "2", gridRowEnd: "4", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[2] },
      { id: 4, label: "Social Link A", gridColumnStart: "2", gridColumnEnd: "3", gridRowStart: "2", gridRowEnd: "3", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[3] },
      { id: 5, label: "Contact CTA", gridColumnStart: "2", gridColumnEnd: "4", gridRowStart: "3", gridRowEnd: "4", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[7] }
    ]
  },
  kanban: {
    name: "Kanban Board",
    columns: ["1fr", "1fr", "1fr"],
    rows: ["300px"],
    items: [
      { id: 1, label: "Backlog / To-Do List", gridColumnStart: "1", gridColumnEnd: "2", gridRowStart: "1", gridRowEnd: "2", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[4] },
      { id: 2, label: "Active Sprint Progress", gridColumnStart: "2", gridColumnEnd: "3", gridRowStart: "1", gridRowEnd: "2", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[6] },
      { id: 3, label: "Done / Completed Tasks", gridColumnStart: "3", gridColumnEnd: "4", gridRowStart: "1", gridRowEnd: "2", justifySelf: "auto", alignSelf: "auto", color: COLOR_PALETTE[5] }
    ]
  }
}

// --- HELPER SERIALIZATION ---
function serializeGridState(state: PlaygroundGridState): string {
  try {
    return btoa(JSON.stringify(state));
  } catch (e) {
    return "";
  }
}

function deserializeGridState(str: string): PlaygroundGridState | null {
  try {
    const parsed = JSON.parse(atob(str));
    if (parsed && parsed.breakpoints && parsed.container && Array.isArray(parsed.items)) {
      return parsed;
    }
  } catch (e) {}
  return null;
}

// --- MAIN SUSPENSE WRAPPER ---
export function GridPlayground() {
  return (
    <React.Suspense fallback={
      <div className="border-4 border-foreground bg-card p-12 text-center font-mono text-xs font-bold text-zinc-500 uppercase">
        Loading Grid Playground Workspace...
      </div>
    }>
      <GridPlaygroundContent />
    </React.Suspense>
  )
}

function GridPlaygroundContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // --- STATE ---
  const [state, setState] = React.useState<PlaygroundGridState>(INITIAL_STATE)
  const [activeItemId, setActiveItemId] = React.useState<number>(1)
  const [history, setHistory] = React.useState<PlaygroundGridState[]>([INITIAL_STATE])
  const [historyIndex, setHistoryIndex] = React.useState<number>(0)

  // View States
  const [zoom, setZoom] = React.useState<number>(100)
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false)
  const [activeSidebarTab, setActiveSidebarTab] = React.useState<"container" | "items" | "visualizer" | "challenges" | "export">("container")
  const [activeCodeTab, setActiveCodeTab] = React.useState<"css" | "html" | "tailwind" | "react" | "bootstrap">("css")

  // Inspector Options
  const [showGridLines, setShowGridLines] = React.useState<boolean>(true)
  const [showAreas, setShowAreas] = React.useState<boolean>(true)
  const [showGaps, setShowGaps] = React.useState<boolean>(true)
  const [showTrackSizes, setShowTrackSizes] = React.useState<boolean>(true)
  
  // Advanced Toggles
  const [experimentalMasonry, setExperimentalMasonry] = React.useState<boolean>(false)
  const [animateTransitions, setAnimateTransitions] = React.useState<boolean>(true)

  // Simulator / Slider values
  const [autoFitVsFillWidth, setAutoFitVsFillWidth] = React.useState<number>(600)
  const [newColTrackSize, setNewColTrackSize] = React.useState<string>("1fr")
  const [newRowTrackSize, setNewRowTrackSize] = React.useState<string>("120px")
  const [minmaxMin, setMinmaxMin] = React.useState<string>("100px")
  const [minmaxMax, setMinmaxMax] = React.useState<string>("1fr")
  const [repeatCount, setRepeatCount] = React.useState<string>("3")
  const [repeatSize, setRepeatSize] = React.useState<string>("1fr")

  // AI Generator Prompt
  const [aiPrompt, setAiPrompt] = React.useState<string>("")
  const [aiGenerating, setAiGenerating] = React.useState<boolean>(false)
  const [aiMessage, setAiMessage] = React.useState<string>("")

  // Challenge Mode
  const [activeChallengeIdx, setActiveChallengeIdx] = React.useState<number>(-1)
  const [challengeCompleted, setChallengeCompleted] = React.useState<boolean>(false)

  // Saves List
  const [savedConfigs, setSavedConfigs] = React.useState<{ name: string; key: string }[]>([])

  // Dragging/Resizing pointer state
  const [pointerState, setPointerState] = React.useState<{
    type: "col" | "row" | "both" | "move" | null;
    itemId: number | null;
    startX: number;
    startY: number;
    initialStartCol: number;
    initialEndCol: number;
    initialStartRow: number;
    initialEndRow: number;
  }>({
    type: null,
    itemId: null,
    startX: 0,
    startY: 0,
    initialStartCol: 1,
    initialEndCol: 2,
    initialStartRow: 1,
    initialEndRow: 2,
  })

  const currentBreakpoint = state.activeBreakpoint
  const currentBreakpointData = state.breakpoints[currentBreakpoint]
  const columns = currentBreakpointData.columns
  const rows = currentBreakpointData.rows

  // --- ACTIONS & HISTORY ---
  const saveStateToHistory = (newState: PlaygroundGridState) => {
    const updatedHistory = history.slice(0, historyIndex + 1)
    updatedHistory.push(JSON.parse(JSON.stringify(newState)))
    if (updatedHistory.length > 30) updatedHistory.shift()
    setHistory(updatedHistory)
    setHistoryIndex(updatedHistory.length - 1)
  }

  const updateState = (updater: (draft: PlaygroundGridState) => void) => {
    const nextState = JSON.parse(JSON.stringify(state))
    updater(nextState)
    setState(nextState)
    saveStateToHistory(nextState)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1
      setHistoryIndex(idx)
      setState(JSON.parse(JSON.stringify(history[idx])))
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1
      setHistoryIndex(idx)
      setState(JSON.parse(JSON.stringify(history[idx])))
    }
  }

  const handleReset = () => {
    setState(INITIAL_STATE)
    setActiveItemId(1)
    setHistory([INITIAL_STATE])
    setHistoryIndex(0)
    setActiveChallengeIdx(-1)
    setChallengeCompleted(false)
  }

  // --- RECONCILE URL PARAMS ---
  React.useEffect(() => {
    const config = searchParams?.get("config")
    if (config) {
      const decoded = deserializeGridState(config)
      if (decoded) {
        setState(decoded)
        setHistory([decoded])
        setHistoryIndex(0)
      }
    }
    loadLocalSaves()
  }, [searchParams])

  // --- KEYBOARD SHORTCUTS ---
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return
      }

      const key = e.key.toLowerCase()
      if (e.ctrlKey && key === "z") {
        e.preventDefault()
        handleUndo()
      } else if ((e.ctrlKey && key === "y") || (e.ctrlKey && e.shiftKey && key === "z")) {
        e.preventDefault()
        handleRedo()
      } else if (e.ctrlKey && key === "c") {
        e.preventDefault()
        navigator.clipboard.writeText(generatedCssCode)
      } else if (key === "delete" || key === "backspace") {
        e.preventDefault()
        handleRemoveItem(activeItemId)
      } else if (key === "arrowup" || key === "arrowdown" || key === "arrowleft" || key === "arrowright") {
        // Move item
        e.preventDefault()
        handleMoveItemByKey(key)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [state, history, historyIndex, activeItemId])

  // --- CHALLENGE ENGINE VALIDATOR ---
  React.useEffect(() => {
    if (activeChallengeIdx !== -1) {
      const challenge = GRID_CHALLENGES[activeChallengeIdx]
      if (challenge && challenge.validate(state)) {
        setChallengeCompleted(true)
      } else {
        setChallengeCompleted(false)
      }
    }
  }, [state, activeChallengeIdx])

  const handleMoveItemByKey = (key: string) => {
    const item = state.items.find(i => i.id === activeItemId)
    if (!item) return
    let startCol = parseInt(item.gridColumnStart) || 1
    let endCol = parseInt(item.gridColumnEnd) || (startCol + 1)
    let startRow = parseInt(item.gridRowStart) || 1
    let endRow = parseInt(item.gridRowEnd) || (startRow + 1)
    const colSpan = endCol - startCol
    const rowSpan = endRow - startRow

    if (key === "arrowup" && startRow > 1) {
      startRow -= 1
      endRow -= 1
    } else if (key === "arrowdown" && endRow <= rows.length + 1) {
      startRow += 1
      endRow += 1
    } else if (key === "arrowleft" && startCol > 1) {
      startCol -= 1
      endCol -= 1
    } else if (key === "arrowright" && endCol <= columns.length + 1) {
      startCol += 1
      endCol += 1
    }

    updateState(draft => {
      const activeIt = draft.items.find(i => i.id === activeItemId)
      if (activeIt) {
        activeIt.gridColumnStart = String(startCol)
        activeIt.gridColumnEnd = String(endCol)
        activeIt.gridRowStart = String(startRow)
        activeIt.gridRowEnd = String(endRow)
      }
    })
  }

  // --- ITEM HANDLERS ---
  const handleAddItem = () => {
    if (state.items.length >= 16) return // cap items size
    const newId = state.items.length > 0 ? Math.max(...state.items.map(i => i.id)) + 1 : 1
    const color = COLOR_PALETTE[(newId - 1) % COLOR_PALETTE.length]
    const newItem: GridItem = {
      id: newId,
      label: `Item ${newId}`,
      gridColumnStart: "auto",
      gridColumnEnd: "auto",
      gridRowStart: "auto",
      gridRowEnd: "auto",
      justifySelf: "auto",
      alignSelf: "auto",
      color,
    }
    updateState(draft => {
      draft.items.push(newItem)
    })
    setActiveItemId(newId)
  }

  const handleRemoveItem = (id: number) => {
    if (state.items.length <= 1) return
    updateState(draft => {
      draft.items = draft.items.filter(i => i.id !== id)
    })
    // Auto-focus next item
    const remain = state.items.filter(i => i.id !== id)
    if (remain.length > 0) {
      setActiveItemId(remain[0].id)
    }
  }

  // --- TEMPLATE EDITING ---
  const handleAddColumn = (size = "1fr") => {
    if (columns.length >= 8) return
    updateState(draft => {
      draft.breakpoints[currentBreakpoint].columns.push(size)
    })
  }

  const handleRemoveColumn = (index: number) => {
    if (columns.length <= 1) return
    updateState(draft => {
      draft.breakpoints[currentBreakpoint].columns.splice(index, 1)
    })
  }

  const handleUpdateColumnValue = (index: number, val: string) => {
    updateState(draft => {
      draft.breakpoints[currentBreakpoint].columns[index] = val
    })
  }

  const handleMoveColumn = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return
    if (direction === "right" && index === columns.length - 1) return
    const targetIdx = direction === "left" ? index - 1 : index + 1
    updateState(draft => {
      const temp = draft.breakpoints[currentBreakpoint].columns[index]
      draft.breakpoints[currentBreakpoint].columns[index] = draft.breakpoints[currentBreakpoint].columns[targetIdx]
      draft.breakpoints[currentBreakpoint].columns[targetIdx] = temp
    })
  }

  const handleAddRow = (size = "120px") => {
    if (rows.length >= 8) return
    updateState(draft => {
      draft.breakpoints[currentBreakpoint].rows.push(size)
    })
  }

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return
    updateState(draft => {
      draft.breakpoints[currentBreakpoint].rows.splice(index, 1)
    })
  }

  const handleUpdateRowValue = (index: number, val: string) => {
    updateState(draft => {
      draft.breakpoints[currentBreakpoint].rows[index] = val
    })
  }

  const handleMoveRow = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === rows.length - 1) return
    const targetIdx = direction === "up" ? index - 1 : index + 1
    updateState(draft => {
      const temp = draft.breakpoints[currentBreakpoint].rows[index]
      draft.breakpoints[currentBreakpoint].rows[index] = draft.breakpoints[currentBreakpoint].rows[targetIdx]
      draft.breakpoints[currentBreakpoint].rows[targetIdx] = temp
    })
  }

  // --- LOCALSTORAGE SAVING ---
  const loadLocalSaves = () => {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith("grid_save_"))
      setSavedConfigs(keys.map(k => ({ name: k.replace("grid_save_", ""), key: k })))
    } catch (e) {}
  }

  const handleSaveConfig = () => {
    const name = prompt("Enter a name to save this layout:")
    if (!name || !name.trim()) return
    try {
      localStorage.setItem(`grid_save_${name.trim()}`, serializeGridState(state))
      loadLocalSaves()
      alert("Layout saved successfully!")
    } catch (e) {}
  }

  const handleLoadConfig = (key: string) => {
    const data = localStorage.getItem(key)
    if (data) {
      const decoded = deserializeGridState(data)
      if (decoded) {
        setState(decoded)
        setHistory([decoded])
        setHistoryIndex(0)
        alert("Layout loaded!")
      }
    }
  }

  const handleDeleteSavedConfig = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Delete this saved configuration?")) {
      try {
        localStorage.removeItem(key)
        loadLocalSaves()
      } catch (e) {}
    }
  }

  const handleShareConfig = () => {
    const code = serializeGridState(state)
    const link = `${window.location.origin}${window.location.pathname}?tab=grid&config=${code}`
    navigator.clipboard.writeText(link)
    alert("Shareable configuration URL copied to clipboard!")
  }

  // --- AI LAYOUT GENERATOR SIMULATOR ---
  const handleAiPromptSubmit = () => {
    if (!aiPrompt.trim()) return
    setAiGenerating(true)
    setAiMessage("Analyzing prompt requirements...")
    
    setTimeout(() => {
      setAiMessage("Matching prompt keywords to grid blueprints...")
      
      setTimeout(() => {
        const query = aiPrompt.toLowerCase()
        let matchingPreset: any = null
        
        // Match presets or build custom configuration based on keywords
        if (query.includes("bento") || query.includes("portfolio")) {
          matchingPreset = PRESETS.bento
        } else if (query.includes("dashboard") || query.includes("admin") || query.includes("panel")) {
          matchingPreset = PRESETS.dashboard
        } else if (query.includes("pricing") || query.includes("cards") || query.includes("pricing table")) {
          matchingPreset = PRESETS.pricing
        } else if (query.includes("gallery") || query.includes("image") || query.includes("photo")) {
          matchingPreset = PRESETS.gallery
        } else if (query.includes("holy") || query.includes("grail") || query.includes("classic")) {
          matchingPreset = PRESETS.holyGrail
        } else if (query.includes("kanban") || query.includes("task") || query.includes("board")) {
          matchingPreset = PRESETS.kanban
        }

        if (matchingPreset) {
          updateState(draft => {
            draft.breakpoints.desktop.columns = matchingPreset.columns
            draft.breakpoints.desktop.rows = matchingPreset.rows
            draft.items = matchingPreset.items
          })
          setAiMessage(`AI Generated: Loaded "${matchingPreset.name}" configuration.`)
        } else {
          // Custom generator logic
          let parsedCols = ["1fr", "1fr", "1fr"]
          let parsedRows = ["120px", "120px"]
          let itemsCount = 6

          // Columns number match
          const colMatch = query.match(/(\d+)\s*col/)
          if (colMatch && colMatch[1]) {
            const num = Math.min(8, Math.max(1, parseInt(colMatch[1])))
            parsedCols = Array(num).fill("1fr")
          }
          // Rows number match
          const rowMatch = query.match(/(\d+)\s*row/)
          if (rowMatch && rowMatch[1]) {
            const num = Math.min(6, Math.max(1, parseInt(rowMatch[1])))
            parsedRows = Array(num).fill("120px")
          }
          // Items count match
          const itemsMatch = query.match(/(\d+)\s*element|item/)
          if (itemsMatch && itemsMatch[1]) {
            itemsCount = Math.min(12, Math.max(1, parseInt(itemsMatch[1])))
          }

          const generatedItems = Array.from({ length: itemsCount }).map((_, i) => ({
            id: i + 1,
            label: `Item ${i + 1}`,
            gridColumnStart: "auto",
            gridColumnEnd: "auto",
            gridRowStart: "auto",
            gridRowEnd: "auto",
            justifySelf: "auto",
            alignSelf: "auto",
            color: COLOR_PALETTE[i % COLOR_PALETTE.length]
          }))

          updateState(draft => {
            draft.breakpoints.desktop.columns = parsedCols
            draft.breakpoints.desktop.rows = parsedRows
            draft.items = generatedItems
          })
          setAiMessage(`AI Generated a ${parsedCols.length}x${parsedRows.length} grid with ${itemsCount} items.`);
        }
        setAiGenerating(false)
      }, 800)
    }, 600)
  }

  // ---FIGMA-STYLE POINTER DRAG & RESIZE ENGINE ---
  const handlePointerDown = (e: React.PointerEvent, type: "col" | "row" | "both" | "move", itemId: number) => {
    e.stopPropagation()
    e.preventDefault()

    const item = state.items.find(i => i.id === itemId)
    if (!item) return

    let sCol = parseInt(item.gridColumnStart)
    let eCol = parseInt(item.gridColumnEnd)
    let sRow = parseInt(item.gridRowStart)
    let eRow = parseInt(item.gridRowEnd)

    // Fallbacks if auto
    if (isNaN(sCol)) sCol = 1
    if (isNaN(eCol)) eCol = sCol + 1
    if (isNaN(sRow)) sRow = 1
    if (isNaN(eRow)) eRow = sRow + 1

    setPointerState({
      type,
      itemId,
      startX: e.clientX,
      startY: e.clientY,
      initialStartCol: sCol,
      initialEndCol: eCol,
      initialStartRow: sRow,
      initialEndRow: eRow
    })

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const gridContainer = document.getElementById("visual-grid-container")
      if (!gridContainer) return

      const containerRect = gridContainer.getBoundingClientRect()
      const colWidth = containerRect.width / columns.length
      const rowHeight = containerRect.height / rows.length

      const dx = moveEvent.clientX - e.clientX
      const dy = moveEvent.clientY - e.clientY

      const colsDelta = Math.round(dx / colWidth)
      const rowsDelta = Math.round(dy / rowHeight)

      updateState(draft => {
        const draftItem = draft.items.find(i => i.id === itemId)
        if (!draftItem) return

        if (type === "col" || type === "both") {
          const nextEndCol = Math.min(columns.length + 1, Math.max(sCol + 1, eCol + colsDelta))
          draftItem.gridColumnStart = String(sCol)
          draftItem.gridColumnEnd = String(nextEndCol)
        }
        if (type === "row" || type === "both") {
          const nextEndRow = Math.min(rows.length + 1, Math.max(sRow + 1, eRow + rowsDelta))
          draftItem.gridRowStart = String(sRow)
          draftItem.gridRowEnd = String(nextEndRow)
        }
        if (type === "move") {
          const spanCol = eCol - sCol
          const spanRow = eRow - sRow
          const nextStartCol = Math.min(columns.length - spanCol + 1, Math.max(1, sCol + colsDelta))
          const nextStartRow = Math.min(rows.length - spanRow + 1, Math.max(1, sRow + rowsDelta))
          
          draftItem.gridColumnStart = String(nextStartCol)
          draftItem.gridColumnEnd = String(nextStartCol + spanCol)
          draftItem.gridRowStart = String(nextStartRow)
          draftItem.gridRowEnd = String(nextStartRow + spanRow)
        }
      })
    }

    const handlePointerUp = () => {
      setPointerState(prev => ({ ...prev, type: null, itemId: null }))
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
  }

  // --- GENERATE CSS / HTML / TAILWIND CODE ---
  const activeBreakpointData = state.breakpoints[state.activeBreakpoint]
  const gapValue = activeBreakpointData.useIndividualGaps 
    ? `${activeBreakpointData.rowGap}px ${activeBreakpointData.colGap}px`
    : `${activeBreakpointData.gap}px`

  const hasAreasSet = state.namedAreas.trim().length > 0

  const generatedCssContainer = `.grid-container {
  display: ${experimentalMasonry ? "grid" : "grid"};
  grid-template-columns: ${columns.join(" ")};
  grid-template-rows: ${experimentalMasonry ? "masonry" : rows.join(" ")};
  gap: ${gapValue};
  justify-items: ${state.container.justifyItems};
  align-items: ${state.container.alignItems};
  justify-content: ${state.container.justifyContent};
  align-content: ${state.container.alignContent};
  ${hasAreasSet ? `grid-template-areas:\n${state.namedAreas
    .split("\n")
    .map(line => `    "${line.trim()}"`)
    .join("\n")};` : ""}
}`

  const generatedCssItems = state.items
    .map(item => {
      const hasCol = item.gridColumnStart !== "auto" || item.gridColumnEnd !== "auto"
      const hasRow = item.gridRowStart !== "auto" || item.gridRowEnd !== "auto"
      const hasJustify = item.justifySelf !== "auto"
      const hasAlign = item.alignSelf !== "auto"

      if (!hasCol && !hasRow && !hasJustify && !hasAlign && !item.isNestedGrid) return ""

      let str = `.item-${item.id} {\n`
      if (hasCol) {
        if (item.gridColumnStart !== "auto" && item.gridColumnEnd === "auto") {
          str += `  grid-column: ${item.gridColumnStart};\n`
        } else {
          str += `  grid-column: ${item.gridColumnStart} / ${item.gridColumnEnd};\n`
        }
      }
      if (hasRow) {
        if (item.gridRowStart !== "auto" && item.gridRowEnd === "auto") {
          str += `  grid-row: ${item.gridRowStart};\n`
        } else {
          str += `  grid-row: ${item.gridRowStart} / ${item.gridRowEnd};\n`
        }
      }
      if (hasJustify) str += `  justify-self: ${item.justifySelf};\n`
      if (hasAlign) str += `  align-self: ${item.alignSelf};\n`
      
      if (item.isNestedGrid) {
        str += `  display: grid;\n`
        str += `  grid-template-columns: ${item.nestedGridCols || "repeat(2, 1fr)"};\n`
        str += `  gap: ${item.nestedGridGap || 8}px;\n`
      }
      str += `}`
      return str
    })
    .filter(Boolean)
    .join("\n\n")

  const generatedCssCode = `${generatedCssContainer}\n\n${generatedCssItems}`

  // HTML Output
  const generatedHtmlCode = `<div class="grid-container">
${state.items.map(item => {
  if (item.isNestedGrid) {
    return `  <div class="item-${item.id}">
    <div class="sub-item">A</div>
    <div class="sub-item">B</div>
  </div>`
  }
  return `  <div class="item-${item.id}">${item.label}</div>`
}).join("\n")}
</div>`

  // Tailwind Equivalent
  const getTailwindGap = (gap: number) => {
    if (gap <= 4) return "gap-1"
    if (gap <= 8) return "gap-2"
    if (gap <= 12) return "gap-3"
    if (gap <= 16) return "gap-4"
    if (gap <= 24) return "gap-6"
    return "gap-8"
  }

  const getTailwindColSpan = (item: GridItem) => {
    const start = parseInt(item.gridColumnStart)
    const end = parseInt(item.gridColumnEnd)
    if (!isNaN(start) && !isNaN(end)) {
      const diff = end - start
      if (diff === columns.length) return "col-span-full"
      return `col-span-${diff}`
    }
    if (item.gridColumnStart.includes("span")) return `col-span-${item.gridColumnStart.replace(/\D/g, "")}`
    return ""
  }

  const getTailwindRowSpan = (item: GridItem) => {
    const start = parseInt(item.gridRowStart)
    const end = parseInt(item.gridRowEnd)
    if (!isNaN(start) && !isNaN(end)) {
      const diff = end - start
      if (diff === rows.length) return "row-span-full"
      return `row-span-${diff}`
    }
    if (item.gridRowStart.includes("span")) return `row-span-${item.gridRowStart.replace(/\D/g, "")}`
    return ""
  }

  const generatedTailwindCode = `<div class="grid grid-cols-${columns.length} ${getTailwindGap(activeBreakpointData.gap)} justify-items-${state.container.justifyItems} items-${state.container.alignItems}">
${state.items.map(item => {
  const colSpan = getTailwindColSpan(item)
  const rowSpan = getTailwindRowSpan(item)
  const alignSelf = item.alignSelf !== "auto" ? `self-${item.alignSelf}` : ""
  const justifySelf = item.justifySelf !== "auto" ? `justify-self-${item.justifySelf}` : ""
  const classes = [colSpan, rowSpan, alignSelf, justifySelf].filter(Boolean).join(" ")
  return `  <div class="${classes}">${item.label}</div>`
}).join("\n")}
</div>`

  // Bootstrap layout approximation
  const getBootstrapColWidth = (item: GridItem) => {
    const start = parseInt(item.gridColumnStart)
    const end = parseInt(item.gridColumnEnd)
    if (!isNaN(start) && !isNaN(end)) {
      const span = end - start
      const percentage = span / columns.length
      const bootstrapSpan = Math.round(percentage * 12)
      return `col-${bootstrapSpan}`
    }
    return "col"
  }

  const generatedBootstrapCode = `<div class="container-fluid">
  <div class="row g-${activeBreakpointData.gap > 12 ? 3 : 2}">
${state.items.map(item => {
  const col = getBootstrapColWidth(item)
  return `    <div class="${col}">${item.label}</div>`
}).join("\n")}
  </div>
</div>`

  // React component template
  const generatedReactCode = `import React from 'react';

export default function MyGridLayout() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '${columns.join(" ")}',
      gridTemplateRows: '${rows.join(" ")}',
      gap: '${gapValue}',
      justifyItems: '${state.container.justifyItems}',
      alignItems: '${state.container.alignItems}'
    }}>
      ${state.items.map(item => `
      <div key={${item.id}} style={{
        gridColumn: '${item.gridColumnStart} / ${item.gridColumnEnd}',
        gridRow: '${item.gridRowStart} / ${item.gridRowEnd}',
        backgroundColor: '${item.color}'
      }}>
        {/* ${item.label} */}
      </div>`).join("")}
    </div>
  );
}`

  // --- ACCESSIBILITY CHECKER ---
  const getAccessibilityWarnings = () => {
    const warnings: string[] = []
    
    // Check for small tap targets
    const gridEl = document.getElementById("visual-grid-container")
    if (gridEl) {
      const rect = gridEl.getBoundingClientRect()
      const colWidth = rect.width / columns.length
      const rowHeight = rect.height / rows.length
      if (colWidth < 44 || rowHeight < 44) {
        warnings.push("Some grid cells are smaller than 44px (the recommended minimum touch target size). Consider increasing sizes.")
      }
    }

    // Check item overflow risks
    state.items.forEach(it => {
      if (it.label.length > 20 && (it.gridColumnStart === "auto" || (parseInt(it.gridColumnEnd) - parseInt(it.gridColumnStart) === 1))) {
        warnings.push(`"${it.label}" has a long label which may overflow or truncate in a single column track. Consider increasing its column span.`)
      }
    })

    // Check total element complexity
    if (state.items.length > 12) {
      warnings.push("High density of grid items (over 12 elements) might reduce readable layout space on smaller mobile screens.")
    }

    return warnings
  }

  const activeWarnings = getAccessibilityWarnings()

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start font-mono text-xs text-foreground">
      
      {/* 1. VIEWPORT & CODE PREVIEW (LEFT COLUMN - SPANS 2 COLS ON BIG SCREEN) */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Workspace Toolbar */}
        <div className="border-4 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_#ffffff] flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Breakpoints */}
            <div className="flex border-2 border-foreground bg-black select-none">
              {(["desktop", "tablet", "mobile"] as const).map(bp => (
                <button
                  key={bp}
                  onClick={() => updateState(d => { d.activeBreakpoint = bp })}
                  className={`px-3 py-1.5 border-r last:border-0 border-foreground cursor-pointer flex items-center gap-1.5 transition-all text-[10px] font-black uppercase ${
                    state.activeBreakpoint === bp ? "bg-primary text-primary-foreground font-black" : "text-zinc-500 hover:text-foreground"
                  }`}
                >
                  {bp === "desktop" && <Monitor className="h-3.5 w-3.5" />}
                  {bp === "tablet" && <Tablet className="h-3.5 w-3.5" />}
                  {bp === "mobile" && <Smartphone className="h-3.5 w-3.5" />}
                  <span>{bp}</span>
                </button>
              ))}
            </div>

            {/* Undo / Redo */}
            <div className="flex border-2 border-foreground bg-black">
              <button
                disabled={historyIndex <= 0}
                onClick={handleUndo}
                className="p-1.5 border-r border-foreground text-foreground hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-3.5 w-3.5" />
              </button>
              <button
                disabled={historyIndex >= history.length - 1}
                onClick={handleRedo}
                className="p-1.5 text-foreground hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex border-2 border-foreground bg-black items-center gap-1 px-2 py-0.5">
              <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-0.5 text-zinc-400 hover:text-foreground cursor-pointer"><ZoomOut className="h-3.5 w-3.5" /></button>
              <span className="text-[10px] text-foreground font-bold select-none min-w-[36px] text-center">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-0.5 text-zinc-400 hover:text-foreground cursor-pointer"><ZoomIn className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveConfig}
              className="px-2.5 py-1.5 border-2 border-foreground bg-black text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] text-[10px] font-black uppercase cursor-pointer flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5 text-primary" />
              <span>SAVE</span>
            </button>
            
            <button
              onClick={handleShareConfig}
              className="px-2.5 py-1.5 border-2 border-foreground bg-black text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] text-[10px] font-black uppercase cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5 text-accent" />
              <span>SHARE</span>
            </button>

            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 border-2 border-foreground bg-black text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] text-[10px] font-black uppercase cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5 text-rose-500" />
              <span>RESET</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 border-2 border-foreground bg-black text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Saved Layouts Bar */}
        {savedConfigs.length > 0 && (
          <div className="border-2 border-foreground bg-black p-3 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">LOAD LOCAL SAVES:</span>
            {savedConfigs.map(save => (
              <div key={save.key} className="flex border border-zinc-700 bg-zinc-900 hover:border-foreground">
                <button
                  onClick={() => handleLoadConfig(save.key)}
                  className="px-2.5 py-1 text-[10px] font-bold text-zinc-300 hover:text-foreground cursor-pointer"
                >
                  {save.name}
                </button>
                <button
                  onClick={(e) => handleDeleteSavedConfig(save.key, e)}
                  className="px-1.5 py-1 border-l border-zinc-700 text-rose-400 hover:text-rose-500 hover:bg-rose-950/20 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Visual Live Grid Area */}
        <div 
          className={`border-4 border-foreground p-6 bg-zinc-900 relative shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] overflow-auto min-h-[440px] flex items-center justify-center ${
            isFullscreen ? "fixed inset-4 z-50 bg-zinc-900 border-8" : ""
          }`}
        >
          {isFullscreen && (
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-black border-2 border-foreground text-foreground hover:bg-zinc-800 cursor-pointer"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          )}

          {/* Interactive Responsive Wrapper */}
          <div
            style={{
              width: state.activeBreakpoint === "desktop" ? "100%" : state.activeBreakpoint === "tablet" ? "768px" : "375px",
              maxWidth: "100%",
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center",
              transition: animateTransitions ? "width 0.3s ease-in-out, transform 0.2s ease" : "none"
            }}
            className="border-2 border-dashed border-zinc-800 bg-zinc-950 p-4 relative flex flex-col justify-center min-h-[360px]"
          >
            
            {/* GRID LINE NUMBERS (OVERLAY VISUALIZER) */}
            {showGridLines && (
              <>
                {/* Column Track Numbers */}
                <div className="absolute top-[-22px] left-4 right-4 flex justify-between text-[9px] font-bold text-primary select-none pointer-events-none">
                  {Array.from({ length: columns.length + 1 }).map((_, i) => (
                    <span key={i} style={{ width: 0, overflow: "visible", textAlign: "center" }}>{i + 1}</span>
                  ))}
                </div>
                {/* Row Track Numbers */}
                <div className="absolute left-[-22px] top-4 bottom-4 flex flex-col justify-between text-[9px] font-bold text-accent select-none pointer-events-none">
                  {Array.from({ length: rows.length + 1 }).map((_, i) => (
                    <span key={i} style={{ height: 0, overflow: "visible", display: "flex", alignItems: "center" }}>{i + 1}</span>
                  ))}
                </div>
              </>
            )}

            {/* Actual Grid rendering viewport */}
            <div
              id="visual-grid-container"
              style={{
                display: "grid",
                gridTemplateColumns: columns.join(" "),
                gridTemplateRows: experimentalMasonry ? "masonry" : rows.join(" "),
                gap: showGaps ? gapValue : "0px",
                justifyItems: state.container.justifyItems,
                alignItems: state.container.alignItems,
                justifyContent: state.container.justifyContent,
                alignContent: state.container.alignContent,
                width: "100%",
                minHeight: "300px",
                padding: `${state.container.padding}px`,
                border: `${state.container.borderWidth}px solid ${state.container.borderColor}`,
                borderRadius: `${state.container.borderRadius}px`,
                backgroundColor: state.container.background,
                transition: animateTransitions ? "all 0.3s ease" : "none"
              }}
              className="relative"
            >
              
              {/* CELL GRID UNDERLAY OR TRACK LABELS */}
              {showGridLines && (
                <div 
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    gridTemplateColumns: columns.join(" "),
                    gridTemplateRows: rows.join(" "),
                    gap: gapValue,
                    pointerEvents: "none",
                    zIndex: 5
                  }}
                >
                  {Array.from({ length: columns.length * rows.length }).map((_, idx) => (
                    <div key={idx} className="border border-dashed border-primary/20 bg-primary/2 pointer-events-none relative flex items-center justify-center">
                      {showTrackSizes && idx < columns.length && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-zinc-800 text-[8px] text-primary px-1 font-bold">
                          {columns[idx]}
                        </div>
                      )}
                      {showTrackSizes && idx % columns.length === 0 && (
                        <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 bg-black border border-zinc-800 text-[8px] text-accent px-1 font-bold">
                          {rows[Math.floor(idx / columns.length)]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* RENDER GRID ITEMS */}
              {state.items.map((item) => {
                const isSelected = activeItemId === item.id
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItemId(item.id)}
                    style={{
                      gridColumnStart: item.gridColumnStart,
                      gridColumnEnd: item.gridColumnEnd,
                      gridRowStart: item.gridRowStart,
                      gridRowEnd: item.gridRowEnd,
                      justifySelf: item.justifySelf !== "auto" ? item.justifySelf : undefined,
                      alignSelf: item.alignSelf !== "auto" ? item.alignSelf : undefined,
                      backgroundColor: isSelected ? "var(--primary)" : item.color,
                      color: isSelected ? "var(--primary-foreground)" : "#09090b",
                      transition: animateTransitions ? "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)" : "none"
                    }}
                    className={`min-w-[40px] min-h-[40px] border-2 border-foreground relative font-black select-none flex flex-col justify-center items-center cursor-grab group text-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                      isSelected ? "ring-2 ring-accent scale-102 z-10" : "hover:border-primary"
                    }`}
                  >
                    {/* Item label */}
                    <div className="text-[11px] uppercase tracking-wider">{item.label}</div>
                    
                    {/* Size and info overlay inside item */}
                    {showAreas && item.gridColumnStart !== "auto" && (
                      <div className="text-[8px] mt-1 font-bold opacity-60">
                        {item.gridColumnStart} / {item.gridColumnEnd}
                      </div>
                    )}

                    {/* Nested items builder view */}
                    {item.isNestedGrid && (
                      <div 
                        style={{
                          display: "grid",
                          gridTemplateColumns: item.nestedGridCols || "repeat(2, 1fr)",
                          gap: `${item.nestedGridGap || 8}px`,
                          width: "100%",
                          padding: "4px"
                        }}
                        className="mt-2 border-t border-black/20 pt-2"
                      >
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div key={idx} className="bg-black/20 text-[7px] p-1 text-foreground border border-black/10">
                            Sub {idx + 1}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Figma-style Resizers & Drag Handles */}
                    {isSelected && (
                      <>
                        {/* Right column resize handle */}
                        <div
                          onPointerDown={(e) => handlePointerDown(e, "col", item.id)}
                          className="absolute right-[-4px] top-0 bottom-0 w-2.5 bg-accent border-l border-r border-foreground cursor-col-resize z-20 hover:scale-x-125 transition-transform"
                          title="Resize Columns"
                        />
                        {/* Bottom row resize handle */}
                        <div
                          onPointerDown={(e) => handlePointerDown(e, "row", item.id)}
                          className="absolute bottom-[-4px] left-0 right-0 h-2.5 bg-accent border-t border-b border-foreground cursor-row-resize z-20 hover:scale-y-125 transition-transform"
                          title="Resize Rows"
                        />
                        {/* Bottom-right corner both resize handle */}
                        <div
                          onPointerDown={(e) => handlePointerDown(e, "both", item.id)}
                          className="absolute right-[-4px] bottom-[-4px] w-3 h-3 bg-white border border-foreground cursor-se-resize z-30 shadow-md hover:scale-125 transition-transform"
                          title="Resize Rows & Columns"
                        />
                        {/* Center Drag to move handle */}
                        <div
                          onPointerDown={(e) => handlePointerDown(e, "move", item.id)}
                          className="absolute top-1 left-1 p-0.5 bg-black/80 border border-zinc-800 text-[6px] text-white cursor-move select-none uppercase font-bold"
                          title="Drag to Reorder"
                        >
                          MOVE
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Real-time Code Output Console */}
        <div className="border-4 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_#ffffff] space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-[10px] font-black text-zinc-400 uppercase">REALTIME GENERATED CODE:</span>
            
            {/* Copy button */}
            <button
              onClick={() => {
                let code = ""
                if (activeCodeTab === "css") code = generatedCssCode
                if (activeCodeTab === "html") code = generatedHtmlCode
                if (activeCodeTab === "tailwind") code = generatedTailwindCode
                if (activeCodeTab === "bootstrap") code = generatedBootstrapCode
                if (activeCodeTab === "react") code = generatedReactCode
                navigator.clipboard.writeText(code)
                alert("Copied code to clipboard!")
              }}
              className="px-2.5 py-1 border border-foreground bg-black text-foreground hover:bg-zinc-900 shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] text-[9px] font-black uppercase cursor-pointer"
            >
              COPY CODE
            </button>
          </div>

          {/* Export Language Tabs */}
          <div className="flex border-b border-zinc-800 bg-black">
            {(["css", "html", "tailwind", "bootstrap", "react"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveCodeTab(tab)}
                className={`px-3 py-1.5 border-r border-zinc-800 text-[9px] font-bold uppercase transition-all cursor-pointer ${
                  activeCodeTab === tab ? "bg-primary text-primary-foreground font-black" : "text-zinc-500 hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <pre className="bg-black border border-zinc-800 p-4 text-[10px] text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
            <code>
              {activeCodeTab === "css" && generatedCssCode}
              {activeCodeTab === "html" && generatedHtmlCode}
              {activeCodeTab === "tailwind" && generatedTailwindCode}
              {activeCodeTab === "bootstrap" && generatedBootstrapCode}
              {activeCodeTab === "react" && generatedReactCode}
            </code>
          </pre>
        </div>
      </div>

      {/* 2. SIDEBAR WORKSPACE CONTROLS (RIGHT COLUMNS - SPANS 2 COLS ON BIG SCREEN) */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Workspace Sidebar Tabs */}
        <div className="flex border-4 border-foreground bg-zinc-950 p-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          {(["container", "items", "visualizer", "challenges", "export"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSidebarTab(tab)}
              className={`flex-1 py-2.5 border-2 border-transparent font-black uppercase text-[10px] cursor-pointer transition-all ${
                activeSidebarTab === tab
                  ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
                  : "text-zinc-500 hover:text-foreground hover:border-zinc-800"
              }`}
            >
              {tab === "container" && "Container"}
              {tab === "items" && "Active Item"}
              {tab === "visualizer" && "Visualizers"}
              {tab === "challenges" && "Challenges"}
              {tab === "export" && "Export"}
            </button>
          ))}
        </div>

        {/* CONTAINER TAB */}
        {activeSidebarTab === "container" && (
          <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-6">
            
            {/* Section 1: Template Columns Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                <span className="font-black text-primary text-[10px] uppercase">grid-template-columns</span>
                <button
                  onClick={() => handleAddColumn()}
                  className="px-2 py-0.5 border border-foreground bg-black text-foreground hover:bg-zinc-900 text-[9px] font-black uppercase cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> ADD COL
                </button>
              </div>

              {/* Visual columns list */}
              <div className="space-y-2">
                {columns.map((col, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-black border border-zinc-800 p-1.5">
                    <span className="text-[9px] font-bold text-zinc-500 min-w-[20px]">#{idx + 1}</span>
                    <select
                      value={col}
                      onChange={(e) => handleUpdateColumnValue(idx, e.target.value)}
                      className="flex-grow bg-zinc-900 border border-zinc-700 text-foreground px-1.5 py-1 text-[10px] cursor-pointer font-mono"
                    >
                      <option value="1fr">1fr (Fraction)</option>
                      <option value="2fr">2fr</option>
                      <option value="3fr">3fr</option>
                      <option value="100px">100px (Pixels)</option>
                      <option value="150px">150px</option>
                      <option value="200px">200px</option>
                      <option value="auto">auto (Squeeze)</option>
                      <option value="minmax(100px, 1fr)">minmax(100px, 1fr)</option>
                      <option value="minmax(150px, 1fr)">minmax(150px, 1fr)</option>
                    </select>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleMoveColumn(idx, "left")}
                        disabled={idx === 0}
                        className="p-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleMoveColumn(idx, "right")}
                        disabled={idx === columns.length - 1}
                        className="p-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleRemoveColumn(idx)}
                        disabled={columns.length <= 1}
                        className="p-1 bg-zinc-900 border border-rose-950 text-rose-400 hover:text-rose-300 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Template Rows Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                <span className="font-black text-accent text-[10px] uppercase">grid-template-rows</span>
                <button
                  onClick={() => handleAddRow()}
                  className="px-2 py-0.5 border border-foreground bg-black text-foreground hover:bg-zinc-900 text-[9px] font-black uppercase cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> ADD ROW
                </button>
              </div>

              {/* Visual rows list */}
              <div className="space-y-2">
                {rows.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-black border border-zinc-800 p-1.5">
                    <span className="text-[9px] font-bold text-zinc-500 min-w-[20px]">#{idx + 1}</span>
                    <select
                      value={row}
                      onChange={(e) => handleUpdateRowValue(idx, e.target.value)}
                      className="flex-grow bg-zinc-900 border border-zinc-700 text-foreground px-1.5 py-1 text-[10px] cursor-pointer font-mono"
                    >
                      <option value="120px">120px (Pixels)</option>
                      <option value="160px">160px</option>
                      <option value="100px">100px</option>
                      <option value="1fr">1fr (Fraction)</option>
                      <option value="auto">auto</option>
                    </select>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleMoveRow(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="h-3 w-3 rotate-90" />
                      </button>
                      <button
                        onClick={() => handleMoveRow(idx, "down")}
                        disabled={idx === rows.length - 1}
                        className="p-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-foreground disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="h-3 w-3 rotate-90" />
                      </button>
                      <button
                        onClick={() => handleRemoveRow(idx)}
                        disabled={rows.length <= 1}
                        className="p-1 bg-zinc-900 border border-rose-950 text-rose-400 hover:text-rose-300 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Gaps Sizing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                <span className="font-bold text-zinc-400 text-[10px] uppercase">Gaps & Gutters Sizing</span>
                <label className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={activeBreakpointData.useIndividualGaps}
                    onChange={(e) => updateState(d => {
                      d.breakpoints[currentBreakpoint].useIndividualGaps = e.target.checked
                    })}
                    className="accent-primary"
                  />
                  <span>SPLIT ROW/COL GAPS</span>
                </label>
              </div>

              {!activeBreakpointData.useIndividualGaps ? (
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-zinc-500">grid gap</span>
                    <span className="text-foreground font-bold">{activeBreakpointData.gap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    step="4"
                    value={activeBreakpointData.gap}
                    onChange={(e) => updateState(d => {
                      d.breakpoints[currentBreakpoint].gap = parseInt(e.target.value)
                    })}
                    className="w-full accent-primary bg-zinc-900 py-1"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-zinc-500">row-gap</span>
                      <span className="text-foreground font-bold">{activeBreakpointData.rowGap}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="48"
                      step="4"
                      value={activeBreakpointData.rowGap}
                      onChange={(e) => updateState(d => {
                        d.breakpoints[currentBreakpoint].rowGap = parseInt(e.target.value)
                      })}
                      className="w-full accent-primary bg-zinc-900 py-1"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-zinc-500">column-gap</span>
                      <span className="text-foreground font-bold">{activeBreakpointData.colGap}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="48"
                      step="4"
                      value={activeBreakpointData.colGap}
                      onChange={(e) => updateState(d => {
                        d.breakpoints[currentBreakpoint].colGap = parseInt(e.target.value)
                      })}
                      className="w-full accent-primary bg-zinc-900 py-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Justify & Align Playground */}
            <div className="space-y-4">
              <span className="block border-b border-zinc-800 pb-1 text-zinc-400 font-bold text-[10px] uppercase">CONTAINER TRACK ALIGNMENTS</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-[10px] text-zinc-500 uppercase">justify-items</label>
                  <select
                    value={state.container.justifyItems}
                    onChange={(e) => updateState(d => { d.container.justifyItems = e.target.value })}
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
                    value={state.container.alignItems}
                    onChange={(e) => updateState(d => { d.container.alignItems = e.target.value })}
                    className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                  >
                    <option value="stretch">stretch (default)</option>
                    <option value="start">start</option>
                    <option value="end">end</option>
                    <option value="center">center</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-[10px] text-zinc-500 uppercase">justify-content</label>
                  <select
                    value={state.container.justifyContent}
                    onChange={(e) => updateState(d => { d.container.justifyContent = e.target.value })}
                    className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                  >
                    <option value="stretch">stretch</option>
                    <option value="start">start</option>
                    <option value="end">end</option>
                    <option value="center">center</option>
                    <option value="space-between">space-between</option>
                    <option value="space-around">space-around</option>
                    <option value="space-evenly">space-evenly</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-[10px] text-zinc-500 uppercase">align-content</label>
                  <select
                    value={state.container.alignContent}
                    onChange={(e) => updateState(d => { d.container.alignContent = e.target.value })}
                    className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                  >
                    <option value="stretch">stretch</option>
                    <option value="start">start</option>
                    <option value="end">end</option>
                    <option value="center">center</option>
                    <option value="space-between">space-between</option>
                    <option value="space-around">space-around</option>
                    <option value="space-evenly">space-evenly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 5: Auto Placement & Named Area Grid */}
            <div className="space-y-4">
              <span className="block border-b border-zinc-800 pb-1 text-zinc-400 font-bold text-[10px] uppercase">AUTO-FLOW & AREAS</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-[10px] text-zinc-500 uppercase">grid-auto-flow</label>
                  <select
                    value={state.container.gridAutoFlow}
                    onChange={(e) => updateState(d => { d.container.gridAutoFlow = e.target.value })}
                    className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                  >
                    <option value="row">row (default)</option>
                    <option value="column">column</option>
                    <option value="row dense">row dense</option>
                    <option value="column dense">column dense</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="block text-[10px] text-zinc-500 uppercase select-none">ITEMS VISIBILITY</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleAddItem}
                      disabled={state.items.length >= 16}
                      className="flex-1 py-1 border border-foreground bg-black text-foreground hover:bg-zinc-900 text-[9px] font-black uppercase cursor-pointer text-center font-mono"
                    >
                      + ADD ITEM
                    </button>
                    <button
                      onClick={() => handleRemoveItem(activeItemId)}
                      disabled={state.items.length <= 1}
                      className="flex-1 py-1 border border-rose-950 bg-black text-rose-400 hover:bg-rose-950/20 text-[9px] font-black uppercase cursor-pointer text-center font-mono"
                    >
                      DELETE ITEM
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Named Grid Areas Template (multi-line layout)</label>
                <textarea
                  value={state.namedAreas}
                  onChange={(e) => updateState(d => { d.namedAreas = e.target.value })}
                  placeholder={'header header header\nsidebar main main\nfooter footer footer'}
                  rows={3}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground font-mono focus:border-primary resize-y"
                />
              </div>
            </div>

            {/* Section 6: Inspector Toggles */}
            <div className="space-y-2">
              <span className="block border-b border-zinc-800 pb-1 text-zinc-400 font-bold text-[10px] uppercase">GRID INSPECTOR OVERLAYS</span>
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer select-none hover:text-foreground">
                  <input type="checkbox" checked={showGridLines} onChange={(e) => setShowGridLines(e.target.checked)} className="accent-primary" />
                  <span>Show Grid Lines</span>
                </label>
                <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer select-none hover:text-foreground">
                  <input type="checkbox" checked={showAreas} onChange={(e) => setShowAreas(e.target.checked)} className="accent-primary" />
                  <span>Show Grid Areas</span>
                </label>
                <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer select-none hover:text-foreground">
                  <input type="checkbox" checked={showGaps} onChange={(e) => setShowGaps(e.target.checked)} className="accent-primary" />
                  <span>Show Grid Gaps</span>
                </label>
                <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer select-none hover:text-foreground">
                  <input type="checkbox" checked={showTrackSizes} onChange={(e) => setShowTrackSizes(e.target.checked)} className="accent-primary" />
                  <span>Show Track Sizes</span>
                </label>
              </div>
            </div>

            {/* Experimental Settings */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex justify-between items-center text-[10px]">
                <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer select-none hover:text-foreground">
                  <input type="checkbox" checked={experimentalMasonry} onChange={(e) => setExperimentalMasonry(e.target.checked)} className="accent-primary" />
                  <span className="font-bold text-accent">Experimental Masonry Grid</span>
                </label>
                <span className="text-[8px] bg-zinc-800 px-1 text-zinc-400 uppercase">CSS Draft</span>
              </div>
              <p className="text-[9px] text-zinc-500 leading-normal">
                This enables `grid-template-rows: masonry`. We simulate it in client-side preview via column layouts. Note: Browser support is currently evolving.
              </p>
            </div>

          </div>
        )}

        {/* ACTIVE ITEM OVERRIDES TAB */}
        {activeSidebarTab === "items" && (
          <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-6">
            
            {/* Active Item Selector */}
            <div>
              <label className="block mb-2 text-[10px] text-zinc-500 uppercase">SELECT THE TARGET ITEM TO OVERRIDE</label>
              <div className="flex flex-wrap gap-2">
                {state.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveItemId(item.id)}
                    className={`px-3 py-1.5 border text-[10px] font-black uppercase cursor-pointer transition-all ${
                      activeItemId === item.id
                        ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 text-zinc-400 hover:border-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Item Properties Overrides */}
            {(() => {
              const activeItem = state.items.find(i => i.id === activeItemId)
              if (!activeItem) return <div className="text-zinc-500 text-[10px]">No active item selected.</div>

              return (
                <div className="space-y-4">
                  
                  {/* Grid Column positioning */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-[10px] text-zinc-500 uppercase">grid-column-start</label>
                      <select
                        value={activeItem.gridColumnStart}
                        onChange={(e) => updateState(d => {
                          const it = d.items.find(i => i.id === activeItemId)
                          if (it) it.gridColumnStart = e.target.value
                        })}
                        className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer font-mono"
                      >
                        <option value="auto">auto</option>
                        {Array.from({ length: columns.length + 1 }).map((_, i) => (
                          <option key={i} value={String(i + 1)}>{i + 1}</option>
                        ))}
                        <option value="span 1">span 1</option>
                        <option value="span 2">span 2</option>
                        <option value="span 3">span 3</option>
                        <option value="span 4">span 4</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-[10px] text-zinc-500 uppercase">grid-column-end</label>
                      <select
                        value={activeItem.gridColumnEnd}
                        onChange={(e) => updateState(d => {
                          const it = d.items.find(i => i.id === activeItemId)
                          if (it) it.gridColumnEnd = e.target.value
                        })}
                        className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer font-mono"
                      >
                        <option value="auto">auto</option>
                        {Array.from({ length: columns.length + 2 }).map((_, i) => (
                          <option key={i} value={String(i + 1)}>{i + 1}</option>
                        ))}
                        <option value="span 1">span 1</option>
                        <option value="span 2">span 2</option>
                        <option value="span 3">span 3</option>
                        <option value="span 4">span 4</option>
                      </select>
                    </div>
                  </div>

                  {/* Grid Row positioning */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-[10px] text-zinc-500 uppercase">grid-row-start</label>
                      <select
                        value={activeItem.gridRowStart}
                        onChange={(e) => updateState(d => {
                          const it = d.items.find(i => i.id === activeItemId)
                          if (it) it.gridRowStart = e.target.value
                        })}
                        className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer font-mono"
                      >
                        <option value="auto">auto</option>
                        {Array.from({ length: rows.length + 1 }).map((_, i) => (
                          <option key={i} value={String(i + 1)}>{i + 1}</option>
                        ))}
                        <option value="span 1">span 1</option>
                        <option value="span 2">span 2</option>
                        <option value="span 3">span 3</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-[10px] text-zinc-500 uppercase">grid-row-end</label>
                      <select
                        value={activeItem.gridRowEnd}
                        onChange={(e) => updateState(d => {
                          const it = d.items.find(i => i.id === activeItemId)
                          if (it) it.gridRowEnd = e.target.value
                        })}
                        className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer font-mono"
                      >
                        <option value="auto">auto</option>
                        {Array.from({ length: rows.length + 2 }).map((_, i) => (
                          <option key={i} value={String(i + 1)}>{i + 1}</option>
                        ))}
                        <option value="span 1">span 1</option>
                        <option value="span 2">span 2</option>
                        <option value="span 3">span 3</option>
                      </select>
                    </div>
                  </div>

                  {/* Manual Arrow Buttons for Shift/Translate cell */}
                  <div>
                    <span className="block text-[9px] text-zinc-500 uppercase mb-1.5 select-none">Quick Move Positions</span>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => handleMoveItemByKey("arrowleft")}
                        className="px-2 py-1 border border-zinc-800 bg-black text-foreground hover:bg-zinc-900 uppercase text-[9px] font-bold cursor-pointer font-mono"
                      >
                        ← Left
                      </button>
                      <button
                        onClick={() => handleMoveItemByKey("arrowright")}
                        className="px-2 py-1 border border-zinc-800 bg-black text-foreground hover:bg-zinc-900 uppercase text-[9px] font-bold cursor-pointer font-mono"
                      >
                        Right →
                      </button>
                      <button
                        onClick={() => handleMoveItemByKey("arrowup")}
                        className="px-2 py-1 border border-zinc-800 bg-black text-foreground hover:bg-zinc-900 uppercase text-[9px] font-bold cursor-pointer font-mono"
                      >
                        ↑ Up
                      </button>
                      <button
                        onClick={() => handleMoveItemByKey("arrowdown")}
                        className="px-2 py-1 border border-zinc-800 bg-black text-foreground hover:bg-zinc-900 uppercase text-[9px] font-bold cursor-pointer font-mono"
                      >
                        Down ↓
                      </button>
                    </div>
                  </div>

                  {/* Alignments overrides */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-[10px] text-zinc-500 uppercase">justify-self</label>
                      <select
                        value={activeItem.justifySelf}
                        onChange={(e) => updateState(d => {
                          const it = d.items.find(i => i.id === activeItemId)
                          if (it) it.justifySelf = e.target.value
                        })}
                        className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                      >
                        <option value="auto">auto (inherit)</option>
                        <option value="stretch">stretch</option>
                        <option value="start">start</option>
                        <option value="end">end</option>
                        <option value="center">center</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-[10px] text-zinc-500 uppercase">align-self</label>
                      <select
                        value={activeItem.alignSelf}
                        onChange={(e) => updateState(d => {
                          const it = d.items.find(i => i.id === activeItemId)
                          if (it) it.alignSelf = e.target.value
                        })}
                        className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
                      >
                        <option value="auto">auto (inherit)</option>
                        <option value="stretch">stretch</option>
                        <option value="start">start</option>
                        <option value="end">end</option>
                        <option value="center">center</option>
                      </select>
                    </div>
                  </div>

                  {/* Colors & Text labels */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Label Text</label>
                      <input
                        type="text"
                        value={activeItem.label}
                        onChange={(e) => updateState(d => {
                          const it = d.items.find(i => i.id === activeItemId)
                          if (it) it.label = e.target.value
                        })}
                        className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Color Theme</label>
                      <div className="flex gap-1 items-center h-8">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c}
                            onClick={() => updateState(d => {
                              const it = d.items.find(i => i.id === activeItemId)
                              if (it) it.color = c
                            })}
                            style={{ backgroundColor: c }}
                            className={`w-6 h-6 border ${activeItem.color === c ? "border-foreground scale-110" : "border-transparent"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Turn into Nested Grid */}
                  <div className="pt-4 border-t border-zinc-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-primary text-[10px] uppercase">NESTED SUB-GRID</span>
                      <label className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeItem.isNestedGrid || false}
                          onChange={(e) => updateState(d => {
                            const it = d.items.find(i => i.id === activeItemId)
                            if (it) it.isNestedGrid = e.target.checked
                          })}
                          className="accent-primary"
                        />
                        <span>Enable Sub-Grid</span>
                      </label>
                    </div>
                    {activeItem.isNestedGrid && (
                      <div className="grid grid-cols-2 gap-4 bg-zinc-900 p-3 border border-zinc-800">
                        <div>
                          <label className="block mb-1 text-[9px] text-zinc-500 uppercase">Columns Template</label>
                          <input
                            type="text"
                            value={activeItem.nestedGridCols || "repeat(2, 1fr)"}
                            onChange={(e) => updateState(d => {
                              const it = d.items.find(i => i.id === activeItemId)
                              if (it) it.nestedGridCols = e.target.value
                            })}
                            className="w-full bg-black border border-zinc-700 px-2 py-1 text-[10px] text-foreground font-mono"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-[9px] text-zinc-500 uppercase">Gap (px)</label>
                          <input
                            type="number"
                            value={activeItem.nestedGridGap || 8}
                            onChange={(e) => updateState(d => {
                              const it = d.items.find(i => i.id === activeItemId)
                              if (it) it.nestedGridGap = parseInt(e.target.value) || 0
                            })}
                            className="w-full bg-black border border-zinc-700 px-2 py-1 text-[10px] text-foreground font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )
            })()}

          </div>
        )}

        {/* VISUALIZERS TAB */}
        {activeSidebarTab === "visualizer" && (
          <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-6">
            
            {/* 1. Fraction visualizer */}
            <div className="space-y-2">
              <span className="block border-b border-zinc-800 pb-1 text-primary font-black text-[10px] uppercase">FRACTION SIZE VISUALIZER</span>
              <p className="text-[10px] text-zinc-400 leading-normal">
                Observe the width proportional ratios of columns configured using `fr` (Fractional units).
              </p>
              
              <div className="flex border-2 border-foreground bg-zinc-900 h-10 w-full select-none mt-2">
                {columns.map((col, idx) => {
                  let weight = 1
                  if (col.includes("fr")) {
                    weight = parseFloat(col.replace("fr", "")) || 1
                  } else if (col.includes("px")) {
                    weight = parseFloat(col.replace("px", "")) / 100
                  }
                  
                  return (
                    <div
                      key={idx}
                      style={{ flexGrow: weight }}
                      className="border-r last:border-0 border-foreground flex items-center justify-center bg-zinc-950/40 text-[9px] font-black text-accent-foreground relative overflow-hidden"
                    >
                      <span className="relative z-10">{weight.toFixed(1)}fr</span>
                      <div className="absolute inset-0 bg-primary/10 select-none pointer-events-none" />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2. repeat() & minmax() builders */}
            <div className="space-y-3 pt-2">
              <span className="block border-b border-zinc-800 pb-1 text-accent font-black text-[10px] uppercase">repeat() & minmax() SYNTAX BUILDER</span>
              
              {/* Repeat widget */}
              <div className="bg-black border border-zinc-800 p-3 space-y-2">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase">BUILD REPEAT TRACK</span>
                <div className="flex gap-2 items-center">
                  <span className="text-foreground text-[10px] font-mono">repeat(</span>
                  <select
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-foreground px-1.5 py-1 text-[10px] cursor-pointer"
                  >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="auto-fit">auto-fit</option>
                    <option value="auto-fill">auto-fill</option>
                  </select>
                  <span className="text-zinc-500 font-mono">,</span>
                  <select
                    value={repeatSize}
                    onChange={(e) => setRepeatSize(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-foreground px-1.5 py-1 text-[10px] cursor-pointer"
                  >
                    <option value="1fr">1fr</option>
                    <option value="150px">150px</option>
                    <option value="minmax(100px, 1fr)">minmax(100px, 1fr)</option>
                  </select>
                  <span className="text-foreground text-[10px] font-mono">)</span>
                  
                  <button
                    onClick={() => handleAddColumn(`repeat(${repeatCount}, ${repeatSize})`)}
                    className="px-2.5 py-1 border border-foreground bg-primary text-primary-foreground font-black text-[9px] uppercase cursor-pointer ml-auto font-mono"
                  >
                    APPLY COL
                  </button>
                </div>
              </div>

              {/* Minmax widget */}
              <div className="bg-black border border-zinc-800 p-3 space-y-2">
                <span className="block text-[9px] text-zinc-500 font-bold uppercase">BUILD MINMAX TRACK</span>
                <div className="flex gap-2 items-center">
                  <span className="text-foreground text-[10px] font-mono">minmax(</span>
                  <select
                    value={minmaxMin}
                    onChange={(e) => setMinmaxMin(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-foreground px-1.5 py-1 text-[10px] cursor-pointer"
                  >
                    <option value="100px">100px</option>
                    <option value="150px">150px</option>
                    <option value="200px">200px</option>
                    <option value="auto">auto</option>
                  </select>
                  <span className="text-zinc-500 font-mono">,</span>
                  <select
                    value={minmaxMax}
                    onChange={(e) => setMinmaxMax(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-foreground px-1.5 py-1 text-[10px] cursor-pointer"
                  >
                    <option value="1fr">1fr</option>
                    <option value="2fr">2fr</option>
                    <option value="300px">300px</option>
                  </select>
                  <span className="text-foreground text-[10px] font-mono">)</span>
                  
                  <button
                    onClick={() => handleAddColumn(`minmax(${minmaxMin}, ${minmaxMax})`)}
                    className="px-2.5 py-1 border border-foreground bg-primary text-primary-foreground font-black text-[9px] uppercase cursor-pointer ml-auto font-mono"
                  >
                    APPLY COL
                  </button>
                </div>
              </div>
            </div>

            {/* 3. auto-fit vs auto-fill simulator */}
            <div className="space-y-3 pt-2">
              <span className="block border-b border-zinc-800 pb-1 text-zinc-400 font-black text-[10px] uppercase">auto-fit VS auto-fill COMPARISON TOOL</span>
              <p className="text-[10px] text-zinc-500 leading-normal font-mono">
                Drag the slider below to resize the simulated viewport container and check the difference in auto track sizing behavior.
              </p>
              
              <div>
                <div className="flex justify-between text-[10px] mb-1.5 font-bold">
                  <span className="text-zinc-400">Viewport Width</span>
                  <span className="text-foreground">{autoFitVsFillWidth}px</span>
                </div>
                <input
                  type="range"
                  min="280"
                  max="800"
                  value={autoFitVsFillWidth}
                  onChange={(e) => setAutoFitVsFillWidth(parseInt(e.target.value))}
                  className="w-full accent-primary bg-zinc-900 py-1"
                />
              </div>

              {/* Side-by-side demo rendering */}
              <div className="space-y-4">
                {/* auto-fit */}
                <div>
                  <span className="block text-[9px] text-zinc-500 font-bold mb-1 uppercase">auto-fit (Stretches columns to fill space)</span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(auto-fit, minmax(80px, 1fr))`,
                      gap: "8px",
                      width: `${autoFitVsFillWidth}px`,
                      maxWidth: "100%"
                    }}
                    className="bg-black border border-zinc-800 p-2 min-h-[60px]"
                  >
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="bg-primary/20 border border-primary text-[8px] p-2 flex items-center justify-center font-bold text-foreground">
                        Fit {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* auto-fill */}
                <div>
                  <span className="block text-[9px] text-zinc-500 font-bold mb-1 uppercase">auto-fill (Preserves empty tracks size)</span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(auto-fill, minmax(80px, 1fr))`,
                      gap: "8px",
                      width: `${autoFitVsFillWidth}px`,
                      maxWidth: "100%"
                    }}
                    className="bg-black border border-zinc-800 p-2 min-h-[60px]"
                  >
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="bg-accent/20 border border-accent text-[8px] p-2 flex items-center justify-center font-bold text-foreground">
                        Fill {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* INTERACTIVE CHALLENGES TAB */}
        {activeSidebarTab === "challenges" && (
          <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-6">
            
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-black text-foreground text-[12px] uppercase">GRID INTERACTIVE QUESTS</span>
            </div>

            {/* Challenges list */}
            <div className="space-y-2">
              {GRID_CHALLENGES.map((challenge, idx) => (
                <button
                  key={challenge.id}
                  onClick={() => {
                    setActiveChallengeIdx(idx)
                    setChallengeCompleted(false)
                  }}
                  className={`w-full text-left p-3 border-2 border-zinc-800 flex items-center justify-between cursor-pointer transition-all font-mono ${
                    activeChallengeIdx === idx
                      ? "bg-black border-primary shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      : "bg-zinc-950 text-zinc-400 hover:border-foreground hover:text-foreground"
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span>Level {idx + 1}: {challenge.title}</span>
                      <span className={`text-[8px] px-1 font-bold ${
                        challenge.difficulty === "Easy" ? "text-green-400 bg-green-950/20" :
                        challenge.difficulty === "Medium" ? "text-yellow-400 bg-yellow-950/20" :
                        "text-rose-400 bg-rose-950/20"
                      }`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-[9px] mt-1 text-zinc-400 line-clamp-1">{challenge.task}</p>
                  </div>
                  <div className="flex gap-0.5 text-yellow-500">
                    {Array.from({ length: Math.ceil(challenge.stars) }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Challenge Details */}
            {activeChallengeIdx !== -1 && (() => {
              const ch = GRID_CHALLENGES[activeChallengeIdx]
              return (
                <div className="bg-black border-2 border-foreground p-4 space-y-3 relative overflow-hidden font-mono">
                  <span className="absolute top-2 right-4 text-[8px] text-zinc-500 uppercase font-black">QUEST ACTIVE</span>
                  <h4 className="font-bold text-foreground text-[11px] uppercase">{ch.title}</h4>
                  <p className="text-zinc-300 text-[10px] leading-relaxed">{ch.task}</p>
                  
                  {challengeCompleted ? (
                    <div className="border border-green-500 bg-green-950/20 text-green-400 p-2 text-[10px] font-black uppercase flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> SUCCESS! LEVEL COMPLETED!
                    </div>
                  ) : (
                    <div className="border border-yellow-600 bg-yellow-950/20 text-yellow-500 p-2 text-[10px] font-black uppercase flex items-center gap-1.5 font-mono">
                      <AlertCircle className="h-4 w-4 animate-pulse" /> WAITING FOR CORRECT CONFIGURATION...
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActiveChallengeIdx(-1)
                        setChallengeCompleted(false)
                      }}
                      className="px-3 py-1 border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-foreground text-[9px] font-black uppercase cursor-pointer font-mono"
                    >
                      EXIT QUEST
                    </button>
                    <button
                      onClick={() => {
                        handleReset()
                        setChallengeCompleted(false)
                      }}
                      className="px-3 py-1 border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-foreground text-[9px] font-black uppercase cursor-pointer ml-auto font-mono"
                    >
                      RESET LEVEL
                    </button>
                  </div>
                </div>
              )
            })()}

          </div>
        )}

        {/* AI GENERATOR & EXPORTS TAB */}
        {activeSidebarTab === "export" && (
          <div className="border-4 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-6">
            
            {/* Presets List */}
            <div className="space-y-2">
              <span className="block border-b border-zinc-800 pb-1 text-primary font-black text-[10px] uppercase">PRESET LAYOUT BLUEPRINTS</span>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PRESETS).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => updateState(d => {
                      d.breakpoints.desktop.columns = value.columns
                      d.breakpoints.desktop.rows = value.rows
                      d.items = value.items
                      if (value.namedAreas) d.namedAreas = value.namedAreas
                    })}
                    className="p-2 border border-zinc-800 bg-black text-foreground hover:border-primary text-left text-[10px] font-bold cursor-pointer font-mono"
                  >
                    {value.name}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generator */}
            <div className="space-y-3 pt-2 font-mono">
              <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-1.5">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="font-black text-accent text-[10px] uppercase">AI LAYOUT GENERATOR</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Type a natural language prompt to generate Grid rows, columns, and items.
              </p>
              
              <div className="space-y-2">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. 'Generate a bento grid portfolio layout with 5 cards'"
                  rows={2}
                  className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground font-mono"
                />
                
                <button
                  onClick={handleAiPromptSubmit}
                  disabled={aiGenerating}
                  className="w-full py-1.5 border-2 border-foreground bg-accent text-accent-foreground font-black text-[10px] uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] font-mono"
                >
                  {aiGenerating ? "GENERATING LAYOUT..." : "GENERATE WITH AI"}
                </button>

                {aiMessage && (
                  <div className="border border-zinc-800 bg-black text-zinc-400 p-2 text-[9px] font-mono">
                    {aiMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Grid Cheat Sheet Reference */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <span className="block text-[10px] font-black text-zinc-400 uppercase">GRID CHEAT SHEET REFERENCE</span>
              <div className="space-y-2 max-h-[140px] overflow-y-auto border border-zinc-800 bg-black p-2">
                {GRID_CHEAT_SHEET.map((sheet, i) => (
                  <div key={i} className="border-b border-zinc-900 last:border-0 pb-1.5 mb-1.5">
                    <span className="block text-primary font-bold text-[9px]">{sheet.prop}</span>
                    <p className="text-zinc-500 text-[8px] mt-0.5 leading-normal">{sheet.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessibility and Performance Panel */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
              <div className="space-y-2 font-mono">
                <span className="block text-[9px] font-black text-zinc-400 uppercase flex items-center gap-1"><Accessibility className="h-3 w-3 text-emerald-400" /> Accessibility Checker</span>
                {activeWarnings.length > 0 ? (
                  <div className="bg-rose-950/20 border border-rose-900 text-rose-300 p-1.5 text-[8px] leading-normal max-h-[100px] overflow-y-auto">
                    {activeWarnings.map((w, idx) => <p key={idx} className="mb-1">• {w}</p>)}
                  </div>
                ) : (
                  <div className="bg-emerald-950/20 border border-emerald-900 text-emerald-300 p-1.5 text-[8px] leading-normal font-bold">
                    ✓ All clear. No accessibility warnings.
                  </div>
                )}
              </div>

              <div className="space-y-2 font-mono">
                <span className="block text-[9px] font-black text-zinc-400 uppercase flex items-center gap-1"><Sliders className="h-3 w-3 text-cyan-400" /> Performance Indicators</span>
                <div className="bg-black border border-zinc-800 p-2 text-[8px] text-zinc-400 space-y-1">
                  <div className="flex justify-between"><span>Columns tracks:</span><span className="font-bold text-foreground">{columns.length}</span></div>
                  <div className="flex justify-between"><span>Rows tracks:</span><span className="font-bold text-foreground">{rows.length}</span></div>
                  <div className="flex justify-between"><span>Total Items:</span><span className="font-bold text-foreground">{state.items.length}</span></div>
                  <div className="flex justify-between"><span>DOM Complexity:</span><span className="font-bold text-foreground">{columns.length * rows.length + state.items.length} cells</span></div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
