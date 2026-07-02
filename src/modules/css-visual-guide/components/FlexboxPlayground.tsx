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
  AlertCircle
} from "lucide-react"

// --- TYPES & INTERFACES ---
interface FlexItem {
  id: number;
  label: string;
  grow: number;
  shrink: number;
  basis: string;
  alignSelf: string;
  width: string;
  height: string;
  order: number;
  color?: string;
}

interface PlaygroundState {
  container: {
    display: string;
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
    alignContent: string;
    flexWrap: string;
    gap: number;
    rowGap: number;
    columnGap: number;
    useIndividualGaps: boolean;
  };
  items: FlexItem[];
}

interface QuizChallenge {
  id: number;
  title: string;
  task: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stars: number;
  targetLayoutDescription: string;
  targetContainer: {
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
    flexWrap: string;
  };
  targetItems: Partial<FlexItem>[];
  initialState: {
    container: any;
    items: FlexItem[];
  };
  validate: (container: any, items: FlexItem[]) => boolean;
}

// --- CONSTANTS & HELPERS ---
const COLOR_PALETTE = [
  "#2dd4bf", // Teal
  "#a855f7", // Purple
  "#fbbf24", // Yellow/Amber
  "#f43f5e", // Rose
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f97316", // Orange
  "#ec4899", // Pink
];

// --- CORE UTILS ---
const DEFAULT_CONTAINER = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "stretch",
  alignContent: "stretch",
  flexWrap: "nowrap",
  gap: 16,
  rowGap: 16,
  columnGap: 16,
  useIndividualGaps: false,
};

const DEFAULT_ITEMS: FlexItem[] = [
  { id: 1, label: "1", grow: 0, shrink: 1, basis: "auto", alignSelf: "auto", width: "80px", height: "80px", order: 1, color: COLOR_PALETTE[0] },
  { id: 2, label: "2", grow: 0, shrink: 1, basis: "auto", alignSelf: "auto", width: "80px", height: "80px", order: 2, color: COLOR_PALETTE[1] },
  { id: 3, label: "3", grow: 0, shrink: 1, basis: "auto", alignSelf: "auto", width: "80px", height: "80px", order: 3, color: COLOR_PALETTE[2] },
];

const PRESETS: Record<string, { name: string; container: any; items: FlexItem[] }> = {
  navbar: {
    name: "Navbar",
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: 16,
      rowGap: 16,
      columnGap: 16,
      useIndividualGaps: false,
    },
    items: [
      { id: 1, label: "Logo", grow: 0, shrink: 0, basis: "auto", alignSelf: "auto", width: "100px", height: "40px", order: 1, color: COLOR_PALETTE[0] },
      { id: 2, label: "Nav Links", grow: 1, shrink: 1, basis: "auto", alignSelf: "auto", width: "auto", height: "40px", order: 2, color: COLOR_PALETTE[1] },
      { id: 3, label: "Action Button", grow: 0, shrink: 0, basis: "auto", alignSelf: "auto", width: "120px", height: "40px", order: 3, color: COLOR_PALETTE[2] },
    ]
  },
  centeredCard: {
    name: "Centered Card",
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: 0,
      rowGap: 0,
      columnGap: 0,
      useIndividualGaps: false,
    },
    items: [
      { id: 1, label: "Card Content", grow: 0, shrink: 0, basis: "auto", alignSelf: "auto", width: "240px", height: "160px", order: 1, color: COLOR_PALETTE[3] }
    ]
  },
  pricingCards: {
    name: "Pricing Cards",
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "stretch",
      flexWrap: "wrap",
      gap: 24,
      rowGap: 24,
      columnGap: 24,
      useIndividualGaps: false,
    },
    items: [
      { id: 1, label: "Basic Plan", grow: 1, shrink: 1, basis: "200px", alignSelf: "auto", width: "auto", height: "200px", order: 1, color: COLOR_PALETTE[4] },
      { id: 2, label: "Pro Plan (Featured)", grow: 1, shrink: 1, basis: "200px", alignSelf: "auto", width: "auto", height: "230px", order: 2, color: COLOR_PALETTE[1] },
      { id: 3, label: "Enterprise Plan", grow: 1, shrink: 1, basis: "200px", alignSelf: "auto", width: "auto", height: "200px", order: 3, color: COLOR_PALETTE[5] }
    ]
  },
  gallery: {
    name: "Grid Gallery",
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "stretch",
      flexWrap: "wrap",
      gap: 16,
      rowGap: 16,
      columnGap: 16,
      useIndividualGaps: false,
    },
    items: [
      { id: 1, label: "Image A", grow: 1, shrink: 1, basis: "150px", alignSelf: "auto", width: "auto", height: "120px", order: 1, color: COLOR_PALETTE[0] },
      { id: 2, label: "Image B", grow: 2, shrink: 1, basis: "150px", alignSelf: "auto", width: "auto", height: "120px", order: 2, color: COLOR_PALETTE[1] },
      { id: 3, label: "Image C", grow: 1, shrink: 1, basis: "150px", alignSelf: "auto", width: "auto", height: "120px", order: 3, color: COLOR_PALETTE[2] },
      { id: 4, label: "Image D", grow: 1, shrink: 1, basis: "150px", alignSelf: "auto", width: "auto", height: "120px", order: 4, color: COLOR_PALETTE[3] },
      { id: 5, label: "Image E", grow: 1, shrink: 1, basis: "150px", alignSelf: "auto", width: "auto", height: "120px", order: 5, color: COLOR_PALETTE[4] }
    ]
  },
  sidebar: {
    name: "Sidebar Layout",
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "stretch",
      flexWrap: "nowrap",
      gap: 16,
      rowGap: 16,
      columnGap: 16,
      useIndividualGaps: false,
    },
    items: [
      { id: 1, label: "Sidebar Menu", grow: 0, shrink: 0, basis: "180px", alignSelf: "auto", width: "180px", height: "auto", order: 1, color: COLOR_PALETTE[7] },
      { id: 2, label: "Primary Content Feed", grow: 1, shrink: 1, basis: "auto", alignSelf: "auto", width: "auto", height: "auto", order: 2, color: COLOR_PALETTE[0] }
    ]
  },
  hero: {
    name: "Hero Section",
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: 20,
      rowGap: 20,
      columnGap: 20,
      useIndividualGaps: false,
    },
    items: [
      { id: 1, label: "Eyebrow Badge", grow: 0, shrink: 0, basis: "auto", alignSelf: "auto", width: "140px", height: "30px", order: 1, color: COLOR_PALETTE[1] },
      { id: 2, label: "Primary Heading Title", grow: 0, shrink: 0, basis: "auto", alignSelf: "auto", width: "320px", height: "60px", order: 2, color: COLOR_PALETTE[0] },
      { id: 3, label: "Descriptive Subtitle text block", grow: 0, shrink: 0, basis: "auto", alignSelf: "auto", width: "260px", height: "40px", order: 3, color: COLOR_PALETTE[2] },
      { id: 4, label: "Call to Action", grow: 0, shrink: 0, basis: "auto", alignSelf: "auto", width: "150px", height: "44px", order: 4, color: COLOR_PALETTE[3] }
    ]
  },
  footer: {
    name: "Footer Columns",
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: 24,
      rowGap: 24,
      columnGap: 24,
      useIndividualGaps: false,
    },
    items: [
      { id: 1, label: "Company Info", grow: 1, shrink: 1, basis: "200px", alignSelf: "auto", width: "auto", height: "100px", order: 1, color: COLOR_PALETTE[5] },
      { id: 2, label: "Product Features", grow: 1, shrink: 1, basis: "120px", alignSelf: "auto", width: "auto", height: "100px", order: 2, color: COLOR_PALETTE[1] },
      { id: 3, label: "Free Resources", grow: 1, shrink: 1, basis: "120px", alignSelf: "auto", width: "auto", height: "100px", order: 3, color: COLOR_PALETTE[2] },
      { id: 4, label: "Copyright Notice & Policy Details", grow: 0, shrink: 0, basis: "100%", alignSelf: "auto", width: "auto", height: "40px", order: 4, color: COLOR_PALETTE[6] }
    ]
  },
  dashboard: {
    name: "Dashboard Panels",
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "stretch",
      flexWrap: "wrap",
      gap: 16,
      rowGap: 16,
      columnGap: 16,
      useIndividualGaps: false,
    },
    items: [
      { id: 1, label: "Card A", grow: 1, shrink: 1, basis: "120px", alignSelf: "auto", width: "auto", height: "80px", order: 1, color: COLOR_PALETTE[0] },
      { id: 2, label: "Card B", grow: 1, shrink: 1, basis: "120px", alignSelf: "auto", width: "auto", height: "80px", order: 2, color: COLOR_PALETTE[2] },
      { id: 3, label: "Card C", grow: 1, shrink: 1, basis: "120px", alignSelf: "auto", width: "auto", height: "80px", order: 3, color: COLOR_PALETTE[3] },
      { id: 4, label: "Charts Viewport", grow: 2, shrink: 1, basis: "280px", alignSelf: "auto", width: "auto", height: "200px", order: 4, color: COLOR_PALETTE[1] },
      { id: 5, label: "Recent Feed Log", grow: 1, shrink: 1, basis: "180px", alignSelf: "auto", width: "auto", height: "200px", order: 5, color: COLOR_PALETTE[4] }
    ]
  },
  chatLayout: {
    name: "Chat Window",
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "stretch",
      flexWrap: "nowrap",
      gap: 12,
      rowGap: 12,
      columnGap: 12,
      useIndividualGaps: false,
    },
    items: [
      { id: 1, label: "Chat Header", grow: 0, shrink: 0, basis: "auto", alignSelf: "auto", width: "auto", height: "40px", order: 1, color: COLOR_PALETTE[1] },
      { id: 2, label: "Scrollable Message Stream", grow: 1, shrink: 1, basis: "auto", alignSelf: "auto", width: "auto", height: "180px", order: 2, color: COLOR_PALETTE[0] },
      { id: 3, label: "Message Input Composer Area", grow: 0, shrink: 0, basis: "auto", alignSelf: "auto", width: "auto", height: "50px", order: 3, color: COLOR_PALETTE[7] }
    ]
  },
  timeline: {
    name: "Alternating Timeline",
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: 24,
      rowGap: 24,
      columnGap: 24,
      useIndividualGaps: false,
    },
    items: [
      { id: 1, label: "Year 2024 Event Item", grow: 0, shrink: 0, basis: "auto", alignSelf: "flex-start", width: "180px", height: "65px", order: 1, color: COLOR_PALETTE[0] },
      { id: 2, label: "Year 2025 Milestones Reached", grow: 0, shrink: 0, basis: "auto", alignSelf: "flex-end", width: "180px", height: "65px", order: 2, color: COLOR_PALETTE[2] },
      { id: 3, label: "Year 2026 Core Release Phase", grow: 0, shrink: 0, basis: "auto", alignSelf: "flex-start", width: "180px", height: "65px", order: 3, color: COLOR_PALETTE[1] }
    ]
  }
};

const QUIZ_CHALLENGES: QuizChallenge[] = [
  {
    id: 1,
    title: "Perfect Center Alignment",
    task: "Align the boxes to be in the absolute center of the main axis and cross axis. (Hint: adjust container's justify-content and align-items).",
    difficulty: "Easy",
    stars: 1,
    targetLayoutDescription: "justify-content: center; align-items: center;",
    targetContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "nowrap" },
    targetItems: [],
    initialState: {
      container: DEFAULT_CONTAINER,
      items: DEFAULT_ITEMS
    },
    validate: (c, items) => c.justifyContent === "center" && c.alignItems === "center"
  },
  {
    id: 2,
    title: "Fill the Empty Space",
    task: "Make Item 2 expand to take up all remaining horizontal space, while keeping Item 1 and Item 3 at their default dimensions.",
    difficulty: "Easy",
    stars: 1.5,
    targetLayoutDescription: "Item 2 flex-grow: 1 or higher; others flex-grow: 0",
    targetContainer: { flexDirection: "row", justifyContent: "flex-start", alignItems: "stretch", flexWrap: "nowrap" },
    targetItems: [{ id: 1, grow: 0 }, { id: 2, grow: 1 }, { id: 3, grow: 0 }],
    initialState: {
      container: DEFAULT_CONTAINER,
      items: DEFAULT_ITEMS
    },
    validate: (c, items) => {
      const i1 = items.find(x => x.id === 1);
      const i2 = items.find(x => x.id === 2);
      const i3 = items.find(x => x.id === 3);
      return i2 !== undefined && i2.grow >= 1 && (i1 === undefined || i1.grow === 0) && (i3 === undefined || i3.grow === 0);
    }
  },
  {
    id: 3,
    title: "The Reverse Stack",
    task: "Stack the items vertically from bottom to top so that Item 3 is at the top of the stack and Item 1 is at the bottom. The elements must stretch to full width.",
    difficulty: "Medium",
    stars: 2,
    targetLayoutDescription: "flex-direction: column-reverse; align-items: stretch;",
    targetContainer: { flexDirection: "column-reverse", justifyContent: "flex-start", alignItems: "stretch", flexWrap: "nowrap" },
    targetItems: [],
    initialState: {
      container: DEFAULT_CONTAINER,
      items: DEFAULT_ITEMS
    },
    validate: (c, items) => c.flexDirection === "column-reverse" && c.alignItems === "stretch"
  },
  {
    id: 4,
    title: "Custom Item Reordering",
    task: "Reorder the items along the horizontal row so that Item 3 is first, Item 1 is second, and Item 2 is third, without swapping their actual positions in the HTML list. (Hint: Use individual order values).",
    difficulty: "Medium",
    stars: 2.5,
    targetLayoutDescription: "Item 3 has the lowest order value, Item 2 has the highest.",
    targetContainer: { flexDirection: "row", justifyContent: "flex-start", alignItems: "stretch", flexWrap: "nowrap" },
    targetItems: [{ id: 3, order: -1 }, { id: 1, order: 0 }, { id: 2, order: 1 }],
    initialState: {
      container: DEFAULT_CONTAINER,
      items: DEFAULT_ITEMS
    },
    validate: (c, items) => {
      const o1 = items.find(x => x.id === 1)?.order ?? 0;
      const o2 = items.find(x => x.id === 2)?.order ?? 0;
      const o3 = items.find(x => x.id === 3)?.order ?? 0;
      return o3 < o1 && o1 < o2;
    }
  },
  {
    id: 5,
    title: "Responsive Space Distribution",
    task: "Align items in a horizontal row such that the first box clings to the left edge, the last box clings to the right edge, and the middle box sits centered in the available gap space. (Ensure wrap is disabled).",
    difficulty: "Hard",
    stars: 3,
    targetLayoutDescription: "justify-content: space-between; flex-wrap: nowrap;",
    targetContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "stretch", flexWrap: "nowrap" },
    targetItems: [],
    initialState: {
      container: DEFAULT_CONTAINER,
      items: DEFAULT_ITEMS
    },
    validate: (c, items) => c.flexDirection === "row" && c.justifyContent === "space-between" && c.flexWrap === "nowrap"
  }
];

const PROPERTY_EXPLANATIONS: Record<string, { title: string; desc: string; values: { name: string; desc: string }[] }> = {
  "display": {
    title: "display",
    desc: "Defines the layout model for the element. Setting it to flex or inline-flex establishes a flex formatting context for all its direct children.",
    values: [
      { name: "flex", desc: "Generates a block-level flex container box." },
      { name: "inline-flex", desc: "Generates an inline-level flex container box." }
    ]
  },
  "flex-direction": {
    title: "flex-direction",
    desc: "Establishes the main-axis, defining the direction flex items are placed in the flex container.",
    values: [
      { name: "row", desc: "Horizontal row from left to right (standard direction)." },
      { name: "row-reverse", desc: "Horizontal row from right to left." },
      { name: "column", desc: "Vertical column from top to bottom." },
      { name: "column-reverse", desc: "Vertical column from bottom to top." }
    ]
  },
  "justify-content": {
    title: "justify-content",
    desc: "Defines the alignment along the main axis. It helps distribute extra free space left over when items are either inflexible or flexible but have reached their maximum size.",
    values: [
      { name: "flex-start", desc: "Items are packed toward the start of the flex-direction." },
      { name: "flex-end", desc: "Items are packed toward the end of the flex-direction." },
      { name: "center", desc: "Items are centered along the line." },
      { name: "space-between", desc: "Items are evenly distributed; first item is at the start, last item is at the end." },
      { name: "space-around", desc: "Items are evenly distributed with equal space around them." },
      { name: "space-evenly", desc: "Items are distributed so that the spacing between any two items is equal." }
    ]
  },
  "align-items": {
    title: "align-items",
    desc: "Defines the default behavior for how flex items are laid out along the cross axis on the current line.",
    values: [
      { name: "stretch", desc: "Stretch to fill the container (still respects min-width/max-width)." },
      { name: "flex-start", desc: "Items are aligned to the start of the cross axis." },
      { name: "flex-end", desc: "Items are aligned to the end of the cross axis." },
      { name: "center", desc: "Items are centered in the cross axis." },
      { name: "baseline", desc: "Items are aligned such as their baselines align." }
    ]
  },
  "align-content": {
    title: "align-content",
    desc: "Aligns a flex container's lines within the flex container when there is extra space in the cross-axis. Only has an effect if there are multiple lines (i.e. flex-wrap is active).",
    values: [
      { name: "stretch", desc: "Lines stretch to take up the remaining space." },
      { name: "flex-start", desc: "Lines packed to the start of the container." },
      { name: "flex-end", desc: "Lines packed to the end of the container." },
      { name: "center", desc: "Lines packed to the center of the container." },
      { name: "space-between", desc: "Lines evenly distributed; first line is at the start, last line is at the end." },
      { name: "space-around", desc: "Lines evenly distributed with equal space around them." }
    ]
  },
  "flex-wrap": {
    title: "flex-wrap",
    desc: "By default, flex items will all try to fit onto one line. You can change that and allow the items to wrap as needed with this property.",
    values: [
      { name: "nowrap", desc: "All flex items will be on one line (may shrink or overflow)." },
      { name: "wrap", desc: "Flex items will wrap onto multiple lines from top to bottom." },
      { name: "wrap-reverse", desc: "Flex items will wrap onto multiple lines from bottom to top." }
    ]
  },
  "gap": {
    title: "gap / row-gap / column-gap",
    desc: "Explicitly controls the space between flex items. It applies that spacing only between items, not on the outer edges.",
    values: [
      { name: "gap", desc: "Sets spacing for both rows and columns simultaneously." },
      { name: "row-gap", desc: "Sets vertical spacing between flex lines." },
      { name: "column-gap", desc: "Sets horizontal spacing between flex items on the same line." }
    ]
  },
  "order": {
    title: "order",
    desc: "By default, flex items are laid out in the source order. However, the order property controls their order in the flex container.",
    values: [
      { name: "integer", desc: "Negative, zero, or positive integer. Items with lower values are rendered first." }
    ]
  },
  "flex-grow": {
    title: "flex-grow",
    desc: "Defines the ability for a flex item to grow if necessary. It accepts a unitless value that serves as a proportion.",
    values: [
      { name: "0", desc: "Item will not grow to fill space (default)." },
      { name: ">= 1", desc: "The item will grow to fill a proportion of the remaining space." }
    ]
  },
  "flex-shrink": {
    title: "flex-shrink",
    desc: "Defines the ability for a flex item to shrink if necessary. It accepts a unitless value that serves as a proportion.",
    values: [
      { name: "1", desc: "Item will shrink to fit (default)." },
      { name: "0", desc: "Item will not shrink even if it overflows." }
    ]
  },
  "flex-basis": {
    title: "flex-basis",
    desc: "Defines the default size of an element before the remaining space is distributed. It can be a length (e.g. 20%, 10rem, etc.) or a keyword.",
    values: [
      { name: "auto", desc: "Looks at the item's width or height property (default)." },
      { name: "0", desc: "Does not look at item width; starts layout from 0 width." },
      { name: "px / %", desc: "Explicit base size constraints (e.g. 100px, 25%)." }
    ]
  },
  "align-self": {
    title: "align-self",
    desc: "Allows the default alignment (or the one specified by align-items) to be overridden for individual flex items.",
    values: [
      { name: "auto", desc: "Inherits container's align-items setting (default)." },
      { name: "flex-start", desc: "Aligns item to the start of cross-axis." },
      { name: "flex-end", desc: "Aligns item to the end of cross-axis." },
      { name: "center", desc: "Aligns item in the center of cross-axis." },
      { name: "stretch", desc: "Stretches item to fill cross-axis." }
    ]
  }
};



function serializeState(c: any, it: FlexItem[]): string {
  try {
    return btoa(JSON.stringify({ c, it }));
  } catch (e) {
    return "";
  }
}

function deserializeState(str: string): { c: any; it: FlexItem[] } | null {
  try {
    const data = JSON.parse(atob(str));
    if (data && data.c && Array.isArray(data.it)) {
      return data;
    }
  } catch (e) {}
  return null;
}

// --- SUB-COMPONENTS ---
function CopyBtn({ text, label = "COPY" }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1 border border-foreground text-[9px] font-black uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
        copied ? "bg-accent text-accent-foreground" : "bg-black text-foreground hover:bg-zinc-900"
      }`}
    >
      <Check className={`h-3 w-3 ${copied ? "block" : "hidden"}`} />
      <span>{copied ? "COPIED" : label}</span>
    </button>
  )
}

// --- MAIN WRAPPER (FOR SSR SUSPENSE BOUNDARY) ---
export function FlexboxPlayground() {
  return (
    <React.Suspense fallback={
      <div className="border-4 border-foreground bg-card p-12 text-center font-mono text-xs font-bold text-zinc-500 uppercase">
        Loading Flexbox Playground Workspace...
      </div>
    }>
      <FlexboxPlaygroundContent />
    </React.Suspense>
  )
}

function FlexboxPlaygroundContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- COMPONENT STATE ---
  const [container, setContainer] = React.useState(DEFAULT_CONTAINER);
  const [items, setItems] = React.useState<FlexItem[]>(DEFAULT_ITEMS);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([1]);
  
  // History State (Undo/Redo)
  const [history, setHistory] = React.useState<PlaygroundState[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  
  // UI Preferences
  const [zoom, setZoom] = React.useState(100);
  const [responsiveMode, setResponsiveMode] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [animateChanges, setAnimateChanges] = React.useState(true);
  const [labelType, setLabelType] = React.useState<"number" | "alphabet" | "custom">("number");
  const [hoveredId, setHoveredId] = React.useState<number | null>(null);
  
  // Right Column Navigation Tabs
  const [rightActiveTab, setRightActiveTab] = React.useState<"code" | "explanation" | "saves">("code");
  const [codeTab, setCodeTab] = React.useState<"css" | "scss" | "tailwind" | "react" | "html">("css");
  
  // Explanations Panel Focused Property
  const [focusedProp, setFocusedProp] = React.useState<string>("flex-direction");
  
  // Saved playgrounds list
  const [savedConfigs, setSavedConfigs] = React.useState<{ name: string; key: string }[]>([]);
  
  // Drag and drop ordering states
  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null);
  
  // Quiz states
  const [quizActive, setQuizActive] = React.useState(false);
  const [quizId, setQuizId] = React.useState<number>(1);
  const [quizSuccess, setQuizSuccess] = React.useState(false);

  // --- INITIAL LOAD & SYNC ---
  React.useEffect(() => {
    // Load config from URL query param
    const configParam = searchParams.get("config");
    if (configParam) {
      const decoded = deserializeState(configParam);
      if (decoded) {
        setContainer(decoded.c);
        setItems(decoded.it);
        if (decoded.it.length > 0) {
          setSelectedIds([decoded.it[0].id]);
        }
      }
    } else {
      // Set initial history
      const initial = { container: DEFAULT_CONTAINER, items: DEFAULT_ITEMS };
      setHistory([initial]);
      setHistoryIndex(0);
    }

    // Load saves from localStorage
    loadLocalSaves();
  }, []);

  // Update history on state updates (non-debounced wrapper)
  const saveHistoryState = (newC: any, newItems: FlexItem[]) => {
    const freshState = {
      container: JSON.parse(JSON.stringify(newC)),
      items: JSON.parse(JSON.stringify(newItems))
    };
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(freshState);
    if (nextHistory.length > 30) nextHistory.shift(); // limit history size
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const loadLocalSaves = () => {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith("flex_save_"));
      const mapped = keys.map(k => ({
        name: k.replace("flex_save_", ""),
        key: k
      }));
      setSavedConfigs(mapped);
    } catch (e) {}
  };

  // --- KEYBOARD SHORTCUTS ---
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip shortcuts when editing text
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (e.ctrlKey && key === "c") {
        e.preventDefault();
        navigator.clipboard.writeText(generatedCss);
      } else if (e.ctrlKey && key === "z") {
        e.preventDefault();
        handleUndo();
      } else if (e.ctrlKey && key === "y") {
        e.preventDefault();
        handleRedo();
      } else if (key === "r") {
        e.preventDefault();
        handleReset();
      } else if (key === "a") {
        e.preventDefault();
        handleAddItem();
      } else if (key === "delete" || key === "backspace") {
        e.preventDefault();
        handleRemoveItems();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [container, items, historyIndex, history, selectedIds]);

  // --- QUIZ VALIDATOR ---
  React.useEffect(() => {
    if (quizActive) {
      const challenge = QUIZ_CHALLENGES.find(q => q.id === quizId);
      if (challenge) {
        const passes = challenge.validate(container, items);
        setQuizSuccess(passes);
      }
    }
  }, [container, items, quizActive, quizId]);

  // --- ACTION HANDLERS ---
  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIdx = historyIndex - 1;
      setHistoryIndex(targetIdx);
      setContainer(JSON.parse(JSON.stringify(history[targetIdx].container)));
      setItems(JSON.parse(JSON.stringify(history[targetIdx].items)));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIdx = historyIndex + 1;
      setHistoryIndex(targetIdx);
      setContainer(JSON.parse(JSON.stringify(history[targetIdx].container)));
      setItems(JSON.parse(JSON.stringify(history[targetIdx].items)));
    }
  };

  const handleReset = () => {
    setContainer(DEFAULT_CONTAINER);
    setItems(DEFAULT_ITEMS);
    setSelectedIds([1]);
    setQuizActive(false);
    saveHistoryState(DEFAULT_CONTAINER, DEFAULT_ITEMS);
  };

  const handleAddItem = () => {
    if (items.length >= 10) return; // Cap at 10 items for performance
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    let label = String(newId);
    if (labelType === "alphabet") label = String.fromCharCode(64 + newId);
    
    const newItem: FlexItem = {
      id: newId,
      label,
      grow: 0,
      shrink: 1,
      basis: "auto",
      alignSelf: "auto",
      width: "80px",
      height: "80px",
      order: newId,
      color: COLOR_PALETTE[(newId - 1) % COLOR_PALETTE.length]
    };
    const nextItems = [...items, newItem];
    setItems(nextItems);
    setSelectedIds([newId]);
    saveHistoryState(container, nextItems);
  };

  const handleRemoveItems = () => {
    if (items.length <= 1) return; // Leave at least 1
    const nextItems = items.filter(it => !selectedIds.includes(it.id));
    if (nextItems.length === 0) return;
    setItems(nextItems);
    setSelectedIds([nextItems[0].id]);
    saveHistoryState(container, nextItems);
  };

  const loadPreset = (key: string) => {
    const preset = PRESETS[key];
    if (preset) {
      setContainer(preset.container);
      setItems(preset.items);
      setSelectedIds([preset.items[0].id]);
      setQuizActive(false);
      saveHistoryState(preset.container, preset.items);
    }
  };

  const saveCurrentLayout = (name: string) => {
    if (!name.trim()) return;
    try {
      const serial = serializeState(container, items);
      localStorage.setItem(`flex_save_${name.trim()}`, serial);
      loadLocalSaves();
    } catch (e) {}
  };

  const deleteSavedLayout = (key: string) => {
    try {
      localStorage.removeItem(key);
      loadLocalSaves();
    } catch (e) {}
  };

  const loadSavedLayout = (key: string) => {
    const data = localStorage.getItem(key);
    if (data) {
      const decoded = deserializeState(data);
      if (decoded) {
        setContainer(decoded.c);
        setItems(decoded.it);
        if (decoded.it.length > 0) {
          setSelectedIds([decoded.it[0].id]);
        }
        setQuizActive(false);
        saveHistoryState(decoded.c, decoded.it);
      }
    }
  };

  const getShareLink = () => {
    const serialized = serializeState(container, items);
    const link = `${window.location.origin}${window.location.pathname}?config=${serialized}`;
    navigator.clipboard.writeText(link);
    alert("Shareable configuration link copied to clipboard!");
  };

  // --- ITEM SELECTION HANDLER ---
  const handleItemClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      if (selectedIds.includes(id)) {
        if (selectedIds.length > 1) setSelectedIds(selectedIds.filter(x => x !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      setSelectedIds([id]);
    }
  };

  // --- FIGMA-STYLE RESIZE HANDLER ---
  const handleResizeStart = (e: React.PointerEvent, itemId: number) => {
    e.stopPropagation();
    e.preventDefault();
    const element = document.getElementById(`flex-item-${itemId}`);
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const initialW = rect.width;
    const initialH = rect.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const newWidth = Math.max(40, Math.min(400, initialW + dx));
      const newHeight = Math.max(40, Math.min(400, initialH + dy));

      setItems(prevItems => prevItems.map(it => {
        if (it.id === itemId) {
          return { ...it, width: `${Math.round(newWidth)}px`, height: `${Math.round(newHeight)}px` };
        }
        return it;
      }));
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      saveHistoryState(container, items);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // --- DRAG-TO-REORDER HANDLERS ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const updated = [...items];
    const [draggedItem] = updated.splice(draggedIdx, 1);
    updated.splice(index, 0, draggedItem);
    setItems(updated);
    setDraggedIdx(index);
  };

  const handleDragEnd = () => {
    const reordered = items.map((it, idx) => ({ ...it, order: idx + 1 }));
    setItems(reordered);
    setDraggedIdx(null);
    saveHistoryState(container, reordered);
  };

  // --- BULK ITEM PROPERTY MODIFIERS ---
  const updateSelectedItemsProp = (key: keyof FlexItem, value: any) => {
    const updated = items.map(it => {
      if (selectedIds.includes(it.id)) {
        return { ...it, [key]: value };
      }
      return it;
    });
    setItems(updated);
  };

  const handleBulkItemRelease = () => {
    saveHistoryState(container, items);
  };

  // --- DYNAMIC LAYOUT GENERATION UTILS ---
  const generatedCss = React.useMemo(() => {
    let css = `.flex-container {
  display: ${container.display};
  flex-direction: ${container.flexDirection};
  justify-content: ${container.justifyContent};
  align-items: ${container.alignItems};
  flex-wrap: ${container.flexWrap};
`;
    if (container.flexWrap !== "nowrap" && container.alignContent !== "stretch") {
      css += `  align-content: ${container.alignContent};\n`;
    }
    if (container.useIndividualGaps) {
      css += `  row-gap: ${container.rowGap}px;\n  column-gap: ${container.columnGap}px;\n`;
    } else {
      css += `  gap: ${container.gap}px;\n`;
    }
    css += `}\n\n`;

    items.forEach((it, idx) => {
      let overrides = "";
      if (it.grow !== 0) overrides += `  flex-grow: ${it.grow};\n`;
      if (it.shrink !== 1) overrides += `  flex-shrink: ${it.shrink};\n`;
      if (it.basis !== "auto") overrides += `  flex-basis: ${it.basis};\n`;
      if (it.alignSelf !== "auto") overrides += `  align-self: ${it.alignSelf};\n`;
      if (it.order !== idx + 1) overrides += `  order: ${it.order};\n`;
      if (it.width !== "auto") overrides += `  width: ${it.width};\n`;
      if (it.height !== "auto") overrides += `  height: ${it.height};\n`;

      if (overrides) {
        css += `.flex-item-${it.id} {\n${overrides}}\n\n`;
      }
    });

    return css.trim();
  }, [container, items]);

  const generatedScss = React.useMemo(() => {
    let scss = `.flex-container {
  display: ${container.display};
  flex-direction: ${container.flexDirection};
  justify-content: ${container.justifyContent};
  align-items: ${container.alignItems};
  flex-wrap: ${container.flexWrap};
`;
    if (container.flexWrap !== "nowrap" && container.alignContent !== "stretch") {
      scss += `  align-content: ${container.alignContent};\n`;
    }
    if (container.useIndividualGaps) {
      scss += `  row-gap: ${container.rowGap}px;\n  column-gap: ${container.columnGap}px;\n`;
    } else {
      scss += `  gap: ${container.gap}px;\n`;
    }

    items.forEach((it, idx) => {
      let overrides = "";
      if (it.grow !== 0) overrides += `    flex-grow: ${it.grow};\n`;
      if (it.shrink !== 1) overrides += `    flex-shrink: ${it.shrink};\n`;
      if (it.basis !== "auto") overrides += `    flex-basis: ${it.basis};\n`;
      if (it.alignSelf !== "auto") overrides += `    align-self: ${it.alignSelf};\n`;
      if (it.order !== idx + 1) overrides += `    order: ${it.order};\n`;
      if (it.width !== "auto") overrides += `    width: ${it.width};\n`;
      if (it.height !== "auto") overrides += `    height: ${it.height};\n`;

      if (overrides) {
        scss += `\n  .flex-item-${it.id} {\n${overrides}  }\n`;
      }
    });

    scss += `}`;
    return scss;
  }, [container, items]);

  const containerTailwind = React.useMemo(() => {
    const cn = [];
    cn.push(container.display === "flex" ? "flex" : "inline-flex");
    
    if (container.flexDirection === "row") cn.push("flex-row");
    else if (container.flexDirection === "row-reverse") cn.push("flex-row-reverse");
    else if (container.flexDirection === "column") cn.push("flex-col");
    else if (container.flexDirection === "column-reverse") cn.push("flex-col-reverse");

    if (container.justifyContent === "flex-start") cn.push("justify-start");
    else if (container.justifyContent === "flex-end") cn.push("justify-end");
    else if (container.justifyContent === "center") cn.push("justify-center");
    else if (container.justifyContent === "space-between") cn.push("justify-between");
    else if (container.justifyContent === "space-around") cn.push("justify-around");
    else if (container.justifyContent === "space-evenly") cn.push("justify-evenly");

    if (container.alignItems === "flex-start") cn.push("items-start");
    else if (container.alignItems === "flex-end") cn.push("items-end");
    else if (container.alignItems === "center") cn.push("items-center");
    else if (container.alignItems === "baseline") cn.push("items-baseline");
    else if (container.alignItems === "stretch") cn.push("items-stretch");

    if (container.flexWrap === "nowrap") cn.push("flex-nowrap");
    else if (container.flexWrap === "wrap") cn.push("flex-wrap");
    else if (container.flexWrap === "wrap-reverse") cn.push("flex-wrap-reverse");

    if (container.flexWrap !== "nowrap") {
      if (container.alignContent === "flex-start") cn.push("content-start");
      else if (container.alignContent === "flex-end") cn.push("content-end");
      else if (container.alignContent === "center") cn.push("content-center");
      else if (container.alignContent === "space-between") cn.push("content-between");
      else if (container.alignContent === "space-around") cn.push("content-around");
    }

    const mapGap = (px: number) => {
      if (px === 0) return "0";
      if (px === 4) return "1";
      if (px === 8) return "2";
      if (px === 12) return "3";
      if (px === 16) return "4";
      if (px === 20) return "5";
      if (px === 24) return "6";
      if (px === 32) return "8";
      if (px === 40) return "10";
      if (px === 48) return "12";
      if (px === 64) return "16";
      return `[${px}px]`;
    };

    if (container.useIndividualGaps) {
      cn.push(`gap-y-${mapGap(container.rowGap)}`);
      cn.push(`gap-x-${mapGap(container.columnGap)}`);
    } else {
      cn.push(`gap-${mapGap(container.gap)}`);
    }

    return cn.join(" ");
  }, [container]);

  const itemsTailwind = React.useMemo(() => {
    return items.map((it, idx) => {
      const cn = [];
      if (it.grow === 1) cn.push("grow");
      else if (it.grow > 1) cn.push(`grow-[${it.grow}]`);
      else if (it.grow === 0) cn.push("grow-0");

      if (it.shrink === 1) cn.push("shrink");
      else if (it.shrink > 1) cn.push(`shrink-[${it.shrink}]`);
      else if (it.shrink === 0) cn.push("shrink-0");

      if (it.basis !== "auto") {
        if (it.basis === "0") cn.push("basis-0");
        else if (it.basis === "100%") cn.push("basis-full");
        else cn.push(`basis-[${it.basis}]`);
      }

      if (it.alignSelf !== "auto") {
        if (it.alignSelf === "flex-start") cn.push("self-start");
        else if (it.alignSelf === "flex-end") cn.push("self-end");
        else if (it.alignSelf === "center") cn.push("self-center");
        else if (it.alignSelf === "stretch") cn.push("self-stretch");
        else if (it.alignSelf === "baseline") cn.push("self-baseline");
      }

      if (it.order !== idx + 1) {
        cn.push(`order-[${it.order}]`);
      }

      if (it.width !== "auto") cn.push(`w-[${it.width}]`);
      if (it.height !== "auto") cn.push(`h-[${it.height}]`);

      return { id: it.id, classes: cn.join(" ") };
    });
  }, [items]);

  const generatedHtml = React.useMemo(() => {
    let html = `<div class="flex-container">\n`;
    items.forEach(it => {
      html += `  <div class="flex-item-${it.id}">${it.label}</div>\n`;
    });
    html += `</div>`;
    return html;
  }, [items]);

  const generatedTailwindMarkup = React.useMemo(() => {
    let html = `<div class="${containerTailwind}">\n`;
    items.forEach(it => {
      const itemCn = itemsTailwind.find(x => x.id === it.id)?.classes || "";
      const paddedItemCn = itemCn ? ` ${itemCn}` : "";
      html += `  <div class="border-2 border-foreground p-4 bg-zinc-800${paddedItemCn}">${it.label}</div>\n`;
    });
    html += `</div>`;
    return html;
  }, [containerTailwind, itemsTailwind, items]);

  const generatedReactCode = React.useMemo(() => {
    let cStyle = `{\n    display: "${container.display}",\n    flexDirection: "${container.flexDirection}",\n    justifyContent: "${container.justifyContent}",\n    alignItems: "${container.alignItems}",\n    flexWrap: "${container.flexWrap}",\n`;
    if (container.flexWrap !== "nowrap" && container.alignContent !== "stretch") {
      cStyle += `    alignContent: "${container.alignContent}",\n`;
    }
    if (container.useIndividualGaps) {
      cStyle += `    rowGap: "${container.rowGap}px",\n    columnGap: "${container.columnGap}px",\n`;
    } else {
      cStyle += `    gap: "${container.gap}px",\n`;
    }
    cStyle += `  }`;

    let divs = "";
    items.forEach((it, idx) => {
      let iStyle = "";
      if (it.grow !== 0) iStyle += `flexGrow: ${it.grow}, `;
      if (it.shrink !== 1) iStyle += `flexShrink: ${it.shrink}, `;
      if (it.basis !== "auto") iStyle += `flexBasis: "${it.basis}", `;
      if (it.alignSelf !== "auto") iStyle += `alignSelf: "${it.alignSelf}", `;
      if (it.order !== idx + 1) iStyle += `order: ${it.order}, `;
      if (it.width !== "auto") iStyle += `width: "${it.width}", `;
      if (it.height !== "auto") iStyle += `height: "${it.height}", `;
      
      const formattedStyle = iStyle ? ` style={{ ${iStyle.trim()} }}` : "";
      divs += `      <div${formattedStyle}>${it.label}</div>\n`;
    });

    return `import React from 'react';\n\nexport function FlexLayout() {\n  return (\n    <div style={${cStyle}}>\n${divs}    </div>\n  );\n}`;
  }, [container, items]);

  const activeItem = items.find(it => selectedIds.includes(it.id)) || items[0] || null;

  // --- HELPERS FOR STYLING ELEMENTS ---
  const isRowDirection = container.flexDirection.startsWith("row");
  const isReverseDirection = container.flexDirection.endsWith("reverse");

  // Load a quiz challenge
  const activateQuizChallenge = (id: number) => {
    const challenge = QUIZ_CHALLENGES.find(q => q.id === id);
    if (challenge) {
      setQuizId(id);
      setContainer(challenge.initialState.container);
      setItems(challenge.initialState.items);
      setSelectedIds([1]);
      setQuizActive(true);
      setQuizSuccess(false);
      saveHistoryState(challenge.initialState.container, challenge.initialState.items);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
      
      {/* 1. LEFT PANEL: Controls (Container & Item) */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* CONTAINER CONTROLS */}
        <div className="border-2 border-foreground bg-card p-4 shadow-neo-primary space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-2 select-none">
            <span className="text-[10px] font-black text-primary uppercase flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              <span>Container Rules</span>
            </span>
            {quizActive && (
              <span className="text-[9px] bg-yellow-500/25 border border-yellow-500 text-yellow-400 font-bold px-1.5 py-0.5 animate-pulse uppercase">
                Quiz Active
              </span>
            )}
          </div>

          <div className="space-y-3.5 text-xs font-bold font-mono">
            {/* display */}
            <div>
              <label 
                onClick={() => { setFocusedProp("display"); setRightActiveTab("explanation"); }}
                className="block mb-1 text-[9px] text-zinc-500 uppercase cursor-help hover:text-foreground transition-colors"
              >
                display
              </label>
              <select
                value={container.display}
                onChange={(e) => {
                  const nextC = { ...container, display: e.target.value };
                  setContainer(nextC);
                  saveHistoryState(nextC, items);
                }}
                className="w-full border border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer focus:outline-none focus:border-primary"
              >
                <option value="flex">flex</option>
                <option value="inline-flex">inline-flex</option>
              </select>
            </div>

            {/* flex-direction */}
            <div>
              <label 
                onClick={() => { setFocusedProp("flex-direction"); setRightActiveTab("explanation"); }}
                className="block mb-1 text-[9px] text-zinc-500 uppercase cursor-help hover:text-foreground transition-colors"
              >
                flex-direction
              </label>
              <select
                value={container.flexDirection}
                onChange={(e) => {
                  const nextC = { ...container, flexDirection: e.target.value };
                  setContainer(nextC);
                  saveHistoryState(nextC, items);
                }}
                className="w-full border border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer focus:outline-none focus:border-primary"
              >
                <option value="row">row</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column">column</option>
                <option value="column-reverse">column-reverse</option>
              </select>
            </div>

            {/* justify-content */}
            <div>
              <label 
                onClick={() => { setFocusedProp("justify-content"); setRightActiveTab("explanation"); }}
                className="block mb-1 text-[9px] text-zinc-500 uppercase cursor-help hover:text-foreground transition-colors"
              >
                justify-content
              </label>
              <select
                value={container.justifyContent}
                onChange={(e) => {
                  const nextC = { ...container, justifyContent: e.target.value };
                  setContainer(nextC);
                  saveHistoryState(nextC, items);
                }}
                className="w-full border border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer focus:outline-none focus:border-primary"
              >
                <option value="flex-start">flex-start</option>
                <option value="center">center</option>
                <option value="flex-end">flex-end</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>

            {/* align-items */}
            <div>
              <label 
                onClick={() => { setFocusedProp("align-items"); setRightActiveTab("explanation"); }}
                className="block mb-1 text-[9px] text-zinc-500 uppercase cursor-help hover:text-foreground transition-colors"
              >
                align-items
              </label>
              <select
                value={container.alignItems}
                onChange={(e) => {
                  const nextC = { ...container, alignItems: e.target.value };
                  setContainer(nextC);
                  saveHistoryState(nextC, items);
                }}
                className="w-full border border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer focus:outline-none focus:border-primary"
              >
                <option value="stretch">stretch</option>
                <option value="center">center</option>
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="baseline">baseline</option>
              </select>
            </div>

            {/* flex-wrap */}
            <div>
              <label 
                onClick={() => { setFocusedProp("flex-wrap"); setRightActiveTab("explanation"); }}
                className="block mb-1 text-[9px] text-zinc-500 uppercase cursor-help hover:text-foreground transition-colors"
              >
                flex-wrap
              </label>
              <select
                value={container.flexWrap}
                onChange={(e) => {
                  const nextC = { ...container, flexWrap: e.target.value };
                  setContainer(nextC);
                  saveHistoryState(nextC, items);
                }}
                className="w-full border border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer focus:outline-none focus:border-primary"
              >
                <option value="nowrap">nowrap</option>
                <option value="wrap">wrap</option>
                <option value="wrap-reverse">wrap-reverse</option>
              </select>
            </div>

            {/* align-content (only enabled if wrap is active) */}
            <div>
              <label 
                onClick={() => { setFocusedProp("align-content"); setRightActiveTab("explanation"); }}
                className={`block mb-1 text-[9px] uppercase cursor-help hover:text-foreground transition-colors ${
                  container.flexWrap === "nowrap" ? "text-zinc-700" : "text-zinc-500"
                }`}
              >
                align-content {container.flexWrap === "nowrap" && "(requires wrap)"}
              </label>
              <select
                disabled={container.flexWrap === "nowrap"}
                value={container.alignContent}
                onChange={(e) => {
                  const nextC = { ...container, alignContent: e.target.value };
                  setContainer(nextC);
                  saveHistoryState(nextC, items);
                }}
                className="w-full border border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer focus:outline-none focus:border-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <option value="stretch">stretch</option>
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="center">center</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
              </select>
            </div>

            {/* gap selection toggle */}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <label className="text-[9px] text-zinc-500 uppercase select-none cursor-pointer">
                Split Row/Col Gap
              </label>
              <input
                type="checkbox"
                checked={container.useIndividualGaps}
                onChange={(e) => {
                  const nextC = { ...container, useIndividualGaps: e.target.checked };
                  setContainer(nextC);
                  saveHistoryState(nextC, items);
                }}
                className="accent-primary cursor-pointer h-3.5 w-3.5"
              />
            </div>

            {/* Gaps Sliders */}
            {!container.useIndividualGaps ? (
              <div>
                <div className="flex justify-between mb-1 text-[9px] text-zinc-500">
                  <label 
                    onClick={() => { setFocusedProp("gap"); setRightActiveTab("explanation"); }}
                    className="uppercase cursor-help hover:text-foreground transition-colors"
                  >
                    gap
                  </label>
                  <span>{container.gap}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="64"
                  step="4"
                  value={container.gap}
                  onChange={(e) => setContainer({ ...container, gap: parseInt(e.target.value) })}
                  onMouseUp={() => saveHistoryState(container, items)}
                  onTouchEnd={() => saveHistoryState(container, items)}
                  className="w-full accent-primary bg-zinc-900 border border-zinc-800 p-0.5 cursor-pointer h-1.5"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1 text-[9px] text-zinc-500">
                    <label 
                      onClick={() => { setFocusedProp("gap"); setRightActiveTab("explanation"); }}
                      className="uppercase cursor-help hover:text-foreground"
                    >
                      row-gap
                    </label>
                    <span>{container.rowGap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    step="4"
                    value={container.rowGap}
                    onChange={(e) => setContainer({ ...container, rowGap: parseInt(e.target.value) })}
                    onMouseUp={() => saveHistoryState(container, items)}
                    onTouchEnd={() => saveHistoryState(container, items)}
                    className="w-full accent-primary bg-zinc-900 border border-zinc-800 p-0.5 cursor-pointer h-1.5"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[9px] text-zinc-500">
                    <label 
                      onClick={() => { setFocusedProp("gap"); setRightActiveTab("explanation"); }}
                      className="uppercase cursor-help hover:text-foreground"
                    >
                      column-gap
                    </label>
                    <span>{container.columnGap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    step="4"
                    value={container.columnGap}
                    onChange={(e) => setContainer({ ...container, columnGap: parseInt(e.target.value) })}
                    onMouseUp={() => saveHistoryState(container, items)}
                    onTouchEnd={() => saveHistoryState(container, items)}
                    className="w-full accent-primary bg-zinc-900 border border-zinc-800 p-0.5 cursor-pointer h-1.5"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ACTIVE ITEM CONTROLS */}
        <div className="border-2 border-foreground bg-card p-4 shadow-neo-accent space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-2 select-none">
            <span className="text-[10px] font-black text-accent uppercase flex items-center gap-1.5">
              <Layout className="h-3.5 w-3.5" />
              <span>Item Level Overrides</span>
            </span>
            <span className="text-[8px] bg-zinc-950 border border-zinc-800 text-zinc-400 font-bold px-1 py-0.5 uppercase">
              {selectedIds.length > 1 ? `${selectedIds.length} Selected` : `Item ${activeItem?.id || 1}`}
            </span>
          </div>

          {activeItem ? (
            <div className="space-y-3.5 text-xs font-bold font-mono">
              {/* Item selection buttons for quick focus */}
              <div className="space-y-1">
                <span className="block text-[8px] text-zinc-500 uppercase">Focus Selection</span>
                <div className="flex flex-wrap gap-1">
                  {items.map((it) => {
                    const isSelected = selectedIds.includes(it.id);
                    return (
                      <button
                        key={it.id}
                        onClick={(e) => handleItemClick(it.id, e as any)}
                        className={`w-7 h-7 border text-[9px] font-black cursor-pointer transition-all flex items-center justify-center ${
                          isSelected
                            ? "bg-accent text-accent-foreground border-foreground shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]"
                            : "border-zinc-800 text-zinc-400 hover:border-foreground"
                        }`}
                        title="Hold Ctrl/Cmd to select multiple"
                      >
                        {it.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* flex-grow */}
              <div>
                <div className="flex justify-between mb-1 text-[9px] text-zinc-500">
                  <label 
                    onClick={() => { setFocusedProp("flex-grow"); setRightActiveTab("explanation"); }}
                    className="uppercase cursor-help hover:text-foreground"
                  >
                    flex-grow
                  </label>
                  <span>{activeItem.grow}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={activeItem.grow}
                  onChange={(e) => updateSelectedItemsProp("grow", parseInt(e.target.value))}
                  onMouseUp={handleBulkItemRelease}
                  onTouchEnd={handleBulkItemRelease}
                  className="w-full accent-accent bg-zinc-900 border border-zinc-800 p-0.5 cursor-pointer h-1.5"
                />
              </div>

              {/* flex-shrink */}
              <div>
                <div className="flex justify-between mb-1 text-[9px] text-zinc-500">
                  <label 
                    onClick={() => { setFocusedProp("flex-shrink"); setRightActiveTab("explanation"); }}
                    className="uppercase cursor-help hover:text-foreground"
                  >
                    flex-shrink
                  </label>
                  <span>{activeItem.shrink}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={activeItem.shrink}
                  onChange={(e) => updateSelectedItemsProp("shrink", parseInt(e.target.value))}
                  onMouseUp={handleBulkItemRelease}
                  onTouchEnd={handleBulkItemRelease}
                  className="w-full accent-accent bg-zinc-900 border border-zinc-800 p-0.5 cursor-pointer h-1.5"
                />
              </div>

              {/* flex-basis */}
              <div>
                <label 
                  onClick={() => { setFocusedProp("flex-basis"); setRightActiveTab("explanation"); }}
                  className="block mb-1 text-[9px] text-zinc-500 uppercase cursor-help hover:text-foreground"
                >
                  flex-basis
                </label>
                <select
                  value={activeItem.basis}
                  onChange={(e) => {
                    updateSelectedItemsProp("basis", e.target.value);
                    saveHistoryState(container, items.map(it => selectedIds.includes(it.id) ? { ...it, basis: e.target.value } : it));
                  }}
                  className="w-full border border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer focus:outline-none focus:border-accent"
                >
                  <option value="auto">auto</option>
                  <option value="0">0</option>
                  <option value="100px">100px</option>
                  <option value="150px">150px</option>
                  <option value="200px">200px</option>
                  <option value="20%">20%</option>
                  <option value="50%">50%</option>
                  <option value="100%">100%</option>
                </select>
              </div>

              {/* align-self */}
              <div>
                <label 
                  onClick={() => { setFocusedProp("align-self"); setRightActiveTab("explanation"); }}
                  className="block mb-1 text-[9px] text-zinc-500 uppercase cursor-help hover:text-foreground"
                >
                  align-self
                </label>
                <select
                  value={activeItem.alignSelf}
                  onChange={(e) => {
                    updateSelectedItemsProp("alignSelf", e.target.value);
                    saveHistoryState(container, items.map(it => selectedIds.includes(it.id) ? { ...it, alignSelf: e.target.value } : it));
                  }}
                  className="w-full border border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer focus:outline-none focus:border-accent"
                >
                  <option value="auto">auto (default)</option>
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="stretch">stretch</option>
                  <option value="baseline">baseline</option>
                </select>
              </div>

              {/* order */}
              <div>
                <div className="flex justify-between mb-1 text-[9px] text-zinc-500">
                  <label 
                    onClick={() => { setFocusedProp("order"); setRightActiveTab("explanation"); }}
                    className="uppercase cursor-help hover:text-foreground"
                  >
                    order
                  </label>
                  <span>{activeItem.order}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  value={activeItem.order}
                  onChange={(e) => updateSelectedItemsProp("order", parseInt(e.target.value))}
                  onMouseUp={handleBulkItemRelease}
                  onTouchEnd={handleBulkItemRelease}
                  className="w-full accent-accent bg-zinc-900 border border-zinc-800 p-0.5 cursor-pointer h-1.5"
                />
              </div>

              {/* Custom Width Slider */}
              <div>
                <div className="flex justify-between mb-1 text-[9px] text-zinc-500">
                  <span>custom width</span>
                  <span>{activeItem.width}</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="range"
                    min="40"
                    max="300"
                    value={activeItem.width === "auto" ? 80 : parseInt(activeItem.width)}
                    onChange={(e) => updateSelectedItemsProp("width", `${e.target.value}px`)}
                    onMouseUp={handleBulkItemRelease}
                    onTouchEnd={handleBulkItemRelease}
                    disabled={activeItem.width === "auto"}
                    className="flex-grow accent-accent bg-zinc-900 border border-zinc-800 p-0.5 cursor-pointer h-1.5 disabled:opacity-30"
                  />
                  <button
                    onClick={() => {
                      const nextVal = activeItem.width === "auto" ? "80px" : "auto";
                      updateSelectedItemsProp("width", nextVal);
                      saveHistoryState(container, items.map(it => selectedIds.includes(it.id) ? { ...it, width: nextVal } : it));
                    }}
                    className="px-1.5 py-0.5 border border-foreground text-[8px] bg-black uppercase font-black cursor-pointer hover:bg-zinc-900 text-zinc-300"
                  >
                    {activeItem.width === "auto" ? "set" : "auto"}
                  </button>
                </div>
              </div>

              {/* Custom Height Slider */}
              <div>
                <div className="flex justify-between mb-1 text-[9px] text-zinc-500">
                  <span>custom height</span>
                  <span>{activeItem.height}</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="range"
                    min="40"
                    max="300"
                    value={activeItem.height === "auto" ? 80 : parseInt(activeItem.height)}
                    onChange={(e) => updateSelectedItemsProp("height", `${e.target.value}px`)}
                    onMouseUp={handleBulkItemRelease}
                    onTouchEnd={handleBulkItemRelease}
                    disabled={activeItem.height === "auto"}
                    className="flex-grow accent-accent bg-zinc-900 border border-zinc-800 p-0.5 cursor-pointer h-1.5 disabled:opacity-30"
                  />
                  <button
                    onClick={() => {
                      const nextVal = activeItem.height === "auto" ? "80px" : "auto";
                      updateSelectedItemsProp("height", nextVal);
                      saveHistoryState(container, items.map(it => selectedIds.includes(it.id) ? { ...it, height: nextVal } : it));
                    }}
                    className="px-1.5 py-0.5 border border-foreground text-[8px] bg-black uppercase font-black cursor-pointer hover:bg-zinc-900 text-zinc-300"
                  >
                    {activeItem.height === "auto" ? "set" : "auto"}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-[10px] text-zinc-500 font-mono italic">No items created</div>
          )}
        </div>

      </div>

      {/* 2. MIDDLE PANEL: Live Preview Canvas (Col Span 2) */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* PLAYGROUND HEADER TOOLBAR */}
        <div className="border-2 border-foreground bg-black p-3.5 flex flex-wrap gap-4 items-center justify-between shadow-neo-accent select-none font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1 border border-foreground bg-zinc-950 text-foreground hover:bg-zinc-900 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo Action (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1 border border-foreground bg-zinc-950 text-foreground hover:bg-zinc-900 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo Action (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 border border-foreground text-[9px] bg-zinc-950 hover:bg-zinc-900 text-zinc-300 font-black uppercase cursor-pointer"
              title="Reset Settings (R)"
            >
              Reset
            </button>
            <div className="h-4 w-px bg-zinc-800" />
            
            {/* Viewport size selectors */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setResponsiveMode("desktop")}
                className={`p-1 border cursor-pointer ${responsiveMode === "desktop" ? "bg-accent text-accent-foreground border-foreground" : "border-zinc-800 text-zinc-400 hover:border-foreground"}`}
                title="Desktop View (100%)"
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setResponsiveMode("tablet")}
                className={`p-1 border cursor-pointer ${responsiveMode === "tablet" ? "bg-accent text-accent-foreground border-foreground" : "border-zinc-800 text-zinc-400 hover:border-foreground"}`}
                title="Tablet View (768px)"
              >
                <Tablet className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setResponsiveMode("mobile")}
                className={`p-1 border cursor-pointer ${responsiveMode === "mobile" ? "bg-accent text-accent-foreground border-foreground" : "border-zinc-800 text-zinc-400 hover:border-foreground"}`}
                title="Mobile View (375px)"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom(prev => Math.max(50, prev - 25))}
                className="p-1 border border-foreground bg-zinc-950 hover:bg-zinc-900 cursor-pointer"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-bold w-10 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(150, prev + 25))}
                className="p-1 border border-foreground bg-zinc-950 hover:bg-zinc-900 cursor-pointer"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <div className="h-4 w-px bg-zinc-800" />
            <button
              onClick={getShareLink}
              className="px-2.5 py-1 border border-foreground bg-primary hover:bg-purple-600 text-primary-foreground text-[9px] font-black uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE PREVIEW FRAME */}
        <div className="border-4 border-foreground p-6 bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative flex flex-col justify-between overflow-hidden">
          
          {/* Top Panel Bar */}
          <div className="flex justify-between items-center select-none pb-4 border-b border-zinc-900 mb-4 text-[9px] font-mono font-bold text-zinc-500">
            <span className="uppercase flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-accent" />
              <span>Workspace Render Portal</span>
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={animateChanges}
                  onChange={(e) => setAnimateChanges(e.target.checked)}
                  className="accent-primary h-3 w-3"
                />
                <span>ANIMATE TRANSITIONS</span>
              </label>
              <span className="text-zinc-600">|</span>
              <div className="flex items-center gap-1.5">
                <span>LABELS:</span>
                <select
                  value={labelType}
                  onChange={(e) => {
                    const type = e.target.value as any;
                    setLabelType(type);
                    setItems(items.map((it, idx) => ({
                      ...it,
                      label: type === "number" ? String(it.id) : type === "alphabet" ? String.fromCharCode(64 + it.id) : it.label
                    })));
                  }}
                  className="bg-black border border-zinc-800 text-[9px] px-1 focus:outline-none"
                >
                  <option value="number">1,2,3</option>
                  <option value="alphabet">A,B,C</option>
                </select>
              </div>
            </div>
          </div>

          {/* Device and Zoom wrapper container */}
          <div className="flex-grow flex items-center justify-center py-4 overflow-auto min-h-[380px] bg-grid-pattern relative">
            
            {/* The actual width-restricted responsive simulator box */}
            <div
              style={{
                width: responsiveMode === "desktop" ? "100%" : responsiveMode === "tablet" ? "768px" : "375px",
                maxWidth: "100%",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center center",
                transition: "width 0.3s ease-in-out"
              }}
              className="border-2 border-dashed border-zinc-800 p-6 bg-black relative min-h-[300px] flex flex-col justify-center"
            >
              
              {/* VISUAL AXES INDICATORS */}
              <div className="absolute inset-0 pointer-events-none z-10 select-none">
                {/* Main Axis Line */}
                <div 
                  className={`absolute border-primary/25 border-dashed ${
                    isRowDirection 
                      ? "top-2 left-2 right-2 h-0 border-t" 
                      : "left-2 top-2 bottom-2 w-0 border-l"
                  }`}
                />

                {/* Cross Axis Line */}
                <div 
                  className={`absolute border-accent/25 border-dashed ${
                    isRowDirection 
                      ? "left-2 top-2 bottom-2 w-0 border-l" 
                      : "top-2 left-2 right-2 h-0 border-t"
                  }`}
                />
              </div>

              {/* GHOST TARGET OUTLINE (CHALLENGE MODE UNDERLAY) */}
              {quizActive && !quizSuccess && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: QUIZ_CHALLENGES.find(q => q.id === quizId)?.targetContainer.flexDirection as any,
                    justifyContent: QUIZ_CHALLENGES.find(q => q.id === quizId)?.targetContainer.justifyContent,
                    alignItems: QUIZ_CHALLENGES.find(q => q.id === quizId)?.targetContainer.alignItems,
                    flexWrap: QUIZ_CHALLENGES.find(q => q.id === quizId)?.targetContainer.flexWrap as any,
                    gap: `${container.gap}px`,
                    position: "absolute",
                    inset: "24px",
                    zIndex: 0,
                    opacity: 0.25,
                    pointerEvents: "none"
                  }}
                >
                  {items.map((it) => {
                    const matchOverride = QUIZ_CHALLENGES.find(q => q.id === quizId)?.targetItems.find(x => x.id === it.id);
                    return (
                      <div
                        key={`ghost-${it.id}`}
                        style={{
                          width: it.width,
                          height: it.height,
                          flexGrow: matchOverride && matchOverride.grow !== undefined ? matchOverride.grow : it.grow,
                          flexShrink: it.shrink,
                          flexBasis: it.basis,
                          alignSelf: it.alignSelf,
                          order: matchOverride && matchOverride.order !== undefined ? matchOverride.order : it.order,
                        }}
                        className="min-w-[60px] min-h-[60px] border-2 border-dashed border-yellow-400 bg-transparent flex items-center justify-center font-bold text-xs text-yellow-400"
                      >
                        Target
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MAIN ACTIVE FLEX CONTAINER */}
              <div
                id="flex-canvas-container"
                style={{
                  display: container.display as any,
                  flexDirection: container.flexDirection as any,
                  justifyContent: container.justifyContent,
                  alignItems: container.alignItems,
                  alignContent: container.alignContent,
                  flexWrap: container.flexWrap as any,
                  gap: container.useIndividualGaps ? undefined : `${container.gap}px`,
                  rowGap: container.useIndividualGaps ? `${container.rowGap}px` : undefined,
                  columnGap: container.useIndividualGaps ? `${container.columnGap}px` : undefined,
                  width: "100%",
                  minHeight: "220px",
                  position: "relative",
                  zIndex: 5
                }}
                className={`border border-zinc-800 p-2 bg-zinc-950/30 ${
                  animateChanges ? "transition-all duration-300" : ""
                }`}
              >
                {items.map((it, idx) => {
                  const isSelected = selectedIds.includes(it.id);
                  const isHovered = hoveredId === it.id;

                  return (
                    <div
                      key={it.id}
                      id={`flex-item-${it.id}`}
                      draggable={!quizActive}
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      onMouseEnter={() => setHoveredId(it.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={(e) => handleItemClick(it.id, e)}
                      style={{
                        flexGrow: it.grow,
                        flexShrink: it.shrink,
                        flexBasis: it.basis,
                        alignSelf: it.alignSelf,
                        order: it.order,
                        width: it.width,
                        height: it.height,
                        backgroundColor: isSelected ? "var(--primary)" : it.color || COLOR_PALETTE[0],
                        cursor: quizActive ? "pointer" : "grab"
                      }}
                      className={`min-w-[50px] min-h-[50px] p-3 flex flex-col justify-center items-center font-black border-2 relative text-xs select-none transition-all ${
                        isSelected
                          ? "border-foreground text-primary-foreground scale-[1.02] shadow-[2px_2px_0px_0px_#ffffff] z-20"
                          : "border-zinc-800 text-black hover:border-foreground"
                      } ${animateChanges ? "duration-200" : ""}`}
                    >
                      {/* CSS Inspector overlay tooltip on hover */}
                      {isHovered && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black border border-foreground text-[8px] text-zinc-300 p-1.5 font-mono shadow-2xl pointer-events-none z-30 whitespace-nowrap leading-relaxed select-none">
                          <div className="font-black text-accent">.item-{it.id}</div>
                          <div>w: {it.width} | h: {it.height}</div>
                          <div>grow: {it.grow} | shrink: {it.shrink}</div>
                          <div>basis: {it.basis} | order: {it.order}</div>
                        </div>
                      )}

                      {/* Item Label Text */}
                      <span className="text-sm font-black select-none pointer-events-none text-zinc-950">
                        {it.label}
                      </span>
                      {(it.grow > 0 || it.alignSelf !== "auto" || it.width !== "auto" || it.height !== "auto" || it.order !== idx + 1) && (
                        <span className="text-[7.5px] mt-1 font-black bg-black/10 px-0.5 text-zinc-950 uppercase select-none pointer-events-none">
                          MOD
                        </span>
                      )}

                      {/* Figma-style resize corner handle */}
                      {isSelected && !quizActive && (
                        <div
                          onPointerDown={(e) => handleResizeStart(e, it.id)}
                          className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-black cursor-se-resize flex items-center justify-center border-t border-l border-foreground hover:bg-accent"
                          title="Drag to resize dimensions"
                          style={{ zIndex: 30 }}
                        >
                          <div className="w-1 h-1 bg-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Quick item manipulation toolbar */}
          <div className="flex flex-wrap gap-4 items-center justify-between mt-3 pt-3 border-t border-zinc-900 font-mono text-[10px] font-bold text-zinc-400 select-none">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddItem}
                className="px-2.5 py-1 border border-foreground bg-zinc-950 text-foreground hover:bg-zinc-900 flex items-center gap-1 cursor-pointer font-black uppercase"
                title="Add flex item box (A)"
              >
                <Plus className="h-3 w-3" />
                <span>Add Item</span>
              </button>
              <button
                onClick={handleRemoveItems}
                disabled={items.length <= 1}
                className="px-2.5 py-1 border border-foreground bg-zinc-950 text-foreground hover:bg-zinc-900 flex items-center gap-1 cursor-pointer font-black uppercase disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove selected items (Delete)"
              >
                <Trash2 className="h-3 w-3" />
                <span>Remove</span>
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <Info className="h-3.5 w-3.5 text-accent" />
              <span>
                {quizActive 
                  ? "Align items with yellow target zones. Controls are disabled during quiz."
                  : "Click boxes to select. Drag them to reorder. Drag bottom-right corner to resize."
                }
              </span>
            </div>
          </div>

        </div>

        {/* 4. INTERACTIVE QUIZ & CHALLENGES PANEL */}
        <div className="border-2 border-foreground bg-card p-4 shadow-neo-primary space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-2 select-none">
            <span className="text-[10px] font-black text-primary uppercase flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5" />
              <span>Interactive Quiz Challenges</span>
            </span>
            <button
              onClick={() => {
                setQuizActive(!quizActive);
                if (!quizActive) activateQuizChallenge(1);
              }}
              className={`px-2 py-0.5 border text-[8px] font-black uppercase cursor-pointer ${
                quizActive ? "bg-red-950 border-destructive text-red-400" : "bg-black text-zinc-400 border-zinc-800 hover:border-foreground"
              }`}
            >
              {quizActive ? "Exit Quiz" : "Start Mode"}
            </button>
          </div>

          {quizActive ? (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-black text-foreground text-sm flex items-center gap-1.5">
                    <span>Task #{quizId}: {QUIZ_CHALLENGES[quizId - 1].title}</span>
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    {QUIZ_CHALLENGES[quizId - 1].task}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] border border-zinc-800 bg-zinc-950 text-zinc-500 font-bold px-1.5 py-0.5 uppercase block">
                    {QUIZ_CHALLENGES[quizId - 1].difficulty}
                  </span>
                  <span className="text-yellow-400 font-black text-[10px] mt-1 block">
                    {"★".repeat(Math.floor(QUIZ_CHALLENGES[quizId - 1].stars))}
                  </span>
                </div>
              </div>

              {quizSuccess ? (
                <div className="border border-green-800 bg-green-950/20 text-green-400 p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-black">
                    <Trophy className="h-4 w-4" />
                    <span>CHALLENGE COMPLETED SUCCESSFULLY!</span>
                  </div>
                  <p className="text-[10px]">
                    You successfully matched the layout conditions. Click below to load the next task!
                  </p>
                  {quizId < QUIZ_CHALLENGES.length ? (
                    <button
                      onClick={() => activateQuizChallenge(quizId + 1)}
                      className="neo-btn-accent h-7 text-[9px] self-start"
                    >
                      Next Challenge →
                    </button>
                  ) : (
                    <div className="text-[9px] font-black text-yellow-400">
                      ★ YOU CONQUERED ALL FLEXBOX CHALLENGES!
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-zinc-800 bg-zinc-950/50 p-2.5 flex items-start gap-2 text-[10px] text-zinc-400">
                  <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-foreground uppercase">Target Layout State:</span>
                    <code className="text-zinc-500 mt-1 block select-all">{QUIZ_CHALLENGES[quizId - 1].targetLayoutDescription}</code>
                  </div>
                </div>
              )}

              {/* Challenge Selector */}
              <div className="flex justify-between items-center pt-2.5 border-t border-border">
                <span className="text-[9px] text-zinc-500 uppercase">Load Select Task:</span>
                <div className="flex gap-1">
                  {QUIZ_CHALLENGES.map(q => (
                    <button
                      key={q.id}
                      onClick={() => activateQuizChallenge(q.id)}
                      className={`w-6 h-6 border text-[9px] font-black cursor-pointer ${
                        quizId === q.id 
                          ? "bg-primary text-primary-foreground border-foreground shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]" 
                          : "border-zinc-800 text-zinc-500 hover:border-foreground"
                      }`}
                    >
                      {q.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs font-mono text-zinc-500 leading-relaxed py-2">
              Learn Flexbox layout principles interactively! Click the <strong className="text-zinc-400">Start Mode</strong> button to complete coding goals and froggy-style targeting simulations.
            </div>
          )}
        </div>

      </div>

      {/* 3. RIGHT PANEL: Code Exports, Explanations, Cheatsheets */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* RIGHT COLUMN TAB CONTROLS */}
        <div className="border-2 border-foreground bg-zinc-950 p-1 shadow-neo-accent flex gap-1 select-none font-mono">
          <button
            onClick={() => setRightActiveTab("code")}
            className={`flex-1 py-1.5 border text-[9px] font-black uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
              rightActiveTab === "code"
                ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                : "border-transparent text-zinc-500 hover:text-foreground"
            }`}
          >
            <Code2 className="h-3 w-3" />
            <span>Code Export</span>
          </button>
          <button
            onClick={() => setRightActiveTab("explanation")}
            className={`flex-1 py-1.5 border text-[9px] font-black uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
              rightActiveTab === "explanation"
                ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                : "border-transparent text-zinc-500 hover:text-foreground"
            }`}
          >
            <HelpCircle className="h-3 w-3" />
            <span>Explanation</span>
          </button>
          <button
            onClick={() => setRightActiveTab("saves")}
            className={`flex-1 py-1.5 border text-[9px] font-black uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
              rightActiveTab === "saves"
                ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                : "border-transparent text-zinc-500 hover:text-foreground"
            }`}
          >
            <Save className="h-3 w-3" />
            <span>Presets</span>
          </button>
        </div>

        {/* TAB WORKSPACE */}
        <div className="border-2 border-foreground bg-card p-4 min-h-[380px] shadow-neo-primary relative">
          
          {/* TAB 1: CODE EXPORT */}
          {rightActiveTab === "code" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1 border-b border-border pb-2.5">
                {(["css", "scss", "tailwind", "react", "html"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setCodeTab(tab)}
                    className={`px-2 py-0.5 border text-[8px] font-mono font-black uppercase cursor-pointer transition-all ${
                      codeTab === tab
                        ? "bg-primary text-primary-foreground border-foreground shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]"
                        : "border-zinc-800 text-zinc-500 hover:border-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-2 relative font-mono">
                <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold select-none uppercase">
                  <span>Generated markup:</span>
                  <CopyBtn
                    text={
                      codeTab === "css" ? generatedCss :
                      codeTab === "scss" ? generatedScss :
                      codeTab === "tailwind" ? generatedTailwindMarkup :
                      codeTab === "react" ? generatedReactCode :
                      generatedHtml
                    }
                    label="COPY CODE"
                  />
                </div>

                <pre className="bg-zinc-950 border border-border p-3 text-[10px] text-zinc-300 overflow-x-auto leading-relaxed select-all whitespace-pre min-h-[250px] max-h-[320px] overflow-y-auto">
                  <code>
                    {codeTab === "css" && generatedCss}
                    {codeTab === "scss" && generatedScss}
                    {codeTab === "tailwind" && generatedTailwindMarkup}
                    {codeTab === "react" && generatedReactCode}
                    {codeTab === "html" && generatedHtml}
                  </code>
                </pre>
              </div>

              {/* Tailwind equivalents sidebar helper block */}
              {codeTab === "tailwind" && (
                <div className="border border-zinc-800 bg-zinc-950 p-2.5 text-[9px] font-mono space-y-1 select-none text-zinc-500">
                  <span className="font-bold text-accent uppercase block">Tailwind equivalent keys:</span>
                  <div>Container: <code className="text-zinc-300 font-bold bg-zinc-900 border border-zinc-800 px-1 py-0.5">{containerTailwind}</code></div>
                  <div className="mt-1">
                    Items:
                    {itemsTailwind.map((x, idx) => (
                      <div key={x.id} className="pl-2 mt-0.5">
                        Item {idx + 1}: <code className="text-zinc-300 bg-zinc-900 border border-zinc-800 px-1 py-0.5">{x.classes || "none"}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPLANATIONS */}
          {rightActiveTab === "explanation" && (
            <div className="space-y-4 font-mono text-xs select-none">
              <span className="text-[9px] font-black text-primary uppercase block border-b border-border pb-1">
                Property Cheat Sheet
              </span>

              {PROPERTY_EXPLANATIONS[focusedProp] ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-black text-accent text-sm flex items-center gap-1.5">
                      <span>{PROPERTY_EXPLANATIONS[focusedProp].title}</span>
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                      {PROPERTY_EXPLANATIONS[focusedProp].desc}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] text-zinc-500 uppercase block">Supported values:</span>
                    <div className="space-y-1.5 overflow-y-auto max-h-[220px] pr-1">
                      {PROPERTY_EXPLANATIONS[focusedProp].values.map((v, i) => (
                        <div key={i} className="p-2 border border-zinc-850 bg-black/45">
                          <span className="font-black text-foreground text-[10px] block select-all">{v.name}</span>
                          <span className="text-[10px] text-zinc-400 mt-0.5 block leading-normal">{v.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-zinc-500 italic text-[11px]">Click a property label in the sidebar to show detailed descriptions and cheat sheets.</div>
              )}

              {/* Selector index for manual cheat sheet lookup */}
              <div className="pt-2 border-t border-border">
                <span className="text-[8px] text-zinc-500 uppercase block mb-1">Index Lookup</span>
                <select
                  value={focusedProp}
                  onChange={(e) => setFocusedProp(e.target.value)}
                  className="w-full bg-black border border-zinc-800 text-[10px] py-1 cursor-pointer focus:outline-none"
                >
                  {Object.keys(PROPERTY_EXPLANATIONS).map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: LAYOUT PRESETS & SAVES */}
          {rightActiveTab === "saves" && (
            <div className="space-y-4 font-mono text-xs">
              
              {/* Presets segment */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-accent uppercase block border-b border-border pb-1 select-none">
                  Core Layout Presets
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.keys(PRESETS).map(key => (
                    <button
                      key={key}
                      onClick={() => loadPreset(key)}
                      className="px-2 py-1.5 border border-zinc-800 bg-black text-zinc-300 font-bold hover:bg-zinc-900 text-left truncate cursor-pointer text-[10px]"
                    >
                      {PRESETS[key].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Local Storage saves segment */}
              <div className="space-y-2 pt-3 border-t border-border">
                <span className="text-[9px] font-black text-primary uppercase block pb-1 select-none">
                  Custom Local Saves
                </span>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const input = form.elements.namedItem("saveName") as HTMLInputElement;
                    if (input && input.value) {
                      saveCurrentLayout(input.value);
                      input.value = "";
                    }
                  }}
                  className="flex gap-1"
                >
                  <input
                    name="saveName"
                    type="text"
                    required
                    placeholder="Layout name..."
                    className="flex-grow bg-black border border-zinc-800 px-2 py-1 text-[10px] focus:outline-none focus:border-primary text-foreground"
                  />
                  <button
                    type="submit"
                    className="px-3 border border-foreground bg-zinc-950 hover:bg-zinc-900 text-[10px] font-black uppercase cursor-pointer"
                  >
                    Save
                  </button>
                </form>

                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {savedConfigs.length > 0 ? (
                    savedConfigs.map(save => (
                      <div key={save.key} className="flex justify-between items-center p-1.5 border border-zinc-850 bg-black/45">
                        <button
                          onClick={() => loadSavedLayout(save.key)}
                          className="font-bold text-[10px] text-zinc-300 hover:underline cursor-pointer truncate flex-grow text-left pr-2"
                        >
                          {save.name}
                        </button>
                        <button
                          onClick={() => deleteSavedLayout(save.key)}
                          className="text-[9px] text-red-500 hover:text-red-400 font-black uppercase cursor-pointer shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-[9px] text-zinc-600 italic select-none">No custom configurations saved yet.</div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}
