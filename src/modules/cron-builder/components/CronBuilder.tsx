"use client"

import * as React from "react"
import { Calendar, Clock, Terminal, RefreshCw, AlertTriangle } from "lucide-react"

export function CronBuilder() {
  const [minOpt, setMinOpt] = React.useState("*")
  const [hourOpt, setHourOpt] = React.useState("*")
  const [domOpt, setDomOpt] = React.useState("*")
  const [monOpt, setMonOpt] = React.useState("*")
  const [dowOpt, setDowOpt] = React.useState("*")

  const [cronExpression, setCronExpression] = React.useState("* * * * *")
  const [occurrences, setOccurrences] = React.useState<Date[]>([])
  const [error, setError] = React.useState<string | null>(null)

  // Construct expression from selectors
  React.useEffect(() => {
    const expr = `${minOpt} ${hourOpt} ${domOpt} ${monOpt} ${dowOpt}`
    setCronExpression(expr)
  }, [minOpt, hourOpt, domOpt, monOpt, dowOpt])

  // Parse custom expressions too
  const handleCustomExprChange = (val: string) => {
    setCronExpression(val)
    const parts = val.trim().split(/\s+/)
    if (parts.length === 5) {
      setMinOpt(parts[0])
      setHourOpt(parts[1])
      setDomOpt(parts[2])
      setMonOpt(parts[3])
      setDowOpt(parts[4])
    }
  }

  // Self-contained cron parsing function
  React.useEffect(() => {
    try {
      const parts = cronExpression.trim().split(/\s+/)
      if (parts.length !== 5) {
        throw new Error("CRON expression must have exactly 5 elements: minute, hour, day of month, month, day of week.")
      }

      const [minPart, hourPart, domPart, monPart, dowPart] = parts

      const parseField = (part: string, minVal: number, maxVal: number): Set<number> => {
        const vals = new Set<number>()
        if (part === "*") {
          for (let v = minVal; v <= maxVal; v++) vals.add(v)
          return vals
        }
        const elements = part.split(",")
        for (const elem of elements) {
          if (elem.includes("/")) {
            const [range, stepStr] = elem.split("/")
            const step = parseInt(stepStr, 10) || 1
            let start = minVal
            let end = maxVal
            if (range !== "*") {
              if (range.includes("-")) {
                const [s, e] = range.split("-").map(Number)
                start = s
                end = e
              } else {
                start = parseInt(range, 10)
              }
            }
            for (let v = start; v <= end; v += step) {
              if (v >= minVal && v <= maxVal) vals.add(v)
            }
          } else if (elem.includes("-")) {
            const [start, end] = elem.split("-").map(Number)
            for (let v = start; v <= end; v++) {
              if (v >= minVal && v <= maxVal) vals.add(v)
            }
          } else {
            const v = parseInt(elem, 10)
            if (!isNaN(v) && v >= minVal && v <= maxVal) {
              vals.add(v)
            }
          }
        }
        return vals
      }

      const minutes = parseField(minPart, 0, 59)
      const hours = parseField(hourPart, 0, 23)
      const doms = parseField(domPart, 1, 31)
      const months = parseField(monPart, 1, 12)
      const dows = parseField(dowPart, 0, 6) // 0 = Sunday, 6 = Saturday

      if (minutes.size === 0 || hours.size === 0 || doms.size === 0 || months.size === 0 || dows.size === 0) {
        throw new Error("One or more fields resolved to an empty range.")
      }

      const list: Date[] = []
      let current = new Date()
      current.setSeconds(0, 0)
      current.setMinutes(current.getMinutes() + 1)

      let limitCount = 0
      const maxSearchLimit = 50000 // avoid infinite loops
      while (list.length < 10 && limitCount < maxSearchLimit) {
        limitCount++
        const m = current.getMinutes()
        const h = current.getHours()
        const dom = current.getDate()
        const mon = current.getMonth() + 1 // JS months are 0-11
        const dow = current.getDay() // 0 = Sunday

        if (months.has(mon) && doms.has(dom) && dows.has(dow) && hours.has(h) && minutes.has(m)) {
          list.push(new Date(current.getTime()))
        }

        current.setMinutes(current.getMinutes() + 1)
      }

      setOccurrences(list)
      setError(null)
    } catch (e: any) {
      setError(e.message || "Failed to parse cron expression.")
      setOccurrences([])
    }
  }, [cronExpression])

  const presetTemplates = [
    { label: "Every Minute", min: "*", hour: "*", dom: "*", mon: "*", dow: "*" },
    { label: "Every 5 Minutes", min: "*/5", hour: "*", dom: "*", mon: "*", dow: "*" },
    { label: "Every Hour (top of hour)", min: "0", hour: "*", dom: "*", mon: "*", dow: "*" },
    { label: "Daily (at midnight)", min: "0", hour: "0", dom: "*", mon: "*", dow: "*" },
    { label: "Weekly (Sunday midnight)", min: "0", hour: "0", dom: "*", mon: "*", dow: "0" },
    { label: "Monthly (1st of month)", min: "0", hour: "0", dom: "1", mon: "*", dow: "*" }
  ]

  const applyPreset = (p: typeof presetTemplates[0]) => {
    setMinOpt(p.min)
    setHourOpt(p.hour)
    setDomOpt(p.dom)
    setMonOpt(p.mon)
    setDowOpt(p.dow)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          CRON UTILITIES
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-accent animate-pulse" />
          <span>CRON EXPRESSION BUILDER & VISUALIZER</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Construct and preview CRON schedules interactively. Select variables or paste values to inspect execution dates on a timeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Builder Sidebar */}
        <div className="lg:col-span-1 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--accent)] space-y-6">
          <div className="space-y-4 text-xs font-bold">
            <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase">PRESET TEMPLATES</span>
            <div className="grid grid-cols-2 gap-2">
              {presetTemplates.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="px-2 py-1.5 border-2 border-foreground bg-black hover:bg-zinc-900 text-[9px] uppercase font-black text-left cursor-pointer transition-colors shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,1)]"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase pt-4">INTERACTIVE SELECTORS</span>
            
            {/* Minute Select */}
            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Minute</label>
              <select
                value={minOpt}
                onChange={(e) => setMinOpt(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
              >
                <option value="*">Every Minute (*)</option>
                <option value="*/5">Every 5 Minutes (*/5)</option>
                <option value="*/15">Every 15 Minutes (*/15)</option>
                <option value="0">At start of hour (0)</option>
                <option value="30">At half past hour (30)</option>
              </select>
            </div>

            {/* Hour Select */}
            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Hour</label>
              <select
                value={hourOpt}
                onChange={(e) => setHourOpt(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
              >
                <option value="*">Every Hour (*)</option>
                <option value="*/2">Every 2 Hours (*/2)</option>
                <option value="0">Midnight (0)</option>
                <option value="12">Noon (12)</option>
              </select>
            </div>

            {/* Day of Month Select */}
            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Day of Month</label>
              <select
                value={domOpt}
                onChange={(e) => setDomOpt(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
              >
                <option value="*">Every Day (*)</option>
                <option value="1">First day of month (1)</option>
                <option value="15">Middle day of month (15)</option>
              </select>
            </div>

            {/* Month Select */}
            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Month</label>
              <select
                value={monOpt}
                onChange={(e) => setMonOpt(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
              >
                <option value="*">Every Month (*)</option>
                <option value="1">January (1)</option>
                <option value="6">June (6)</option>
                <option value="12">December (12)</option>
              </select>
            </div>

            {/* Day of Week Select */}
            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Day of Week</label>
              <select
                value={dowOpt}
                onChange={(e) => setDowOpt(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
              >
                <option value="*">Any Day of Week (*)</option>
                <option value="1-5">Weekdays only (1-5)</option>
                <option value="0,6">Weekends only (0,6)</option>
                <option value="0">Sunday (0)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Visual Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-4 border-foreground p-6 bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-6">
            <span className="text-[9px] font-black text-black bg-zinc-200 border border-zinc-400 px-2 py-0.5 self-start uppercase select-none">
              Live Cron Compiler
            </span>

            {/* Generated String */}
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-400 block font-bold uppercase">CRON EXPRESSION STRING:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cronExpression}
                  onChange={(e) => handleCustomExprChange(e.target.value)}
                  className="flex-grow bg-black border-2 border-foreground p-3 text-lg font-black text-accent text-center tracking-widest focus:outline-none"
                />
                <button
                  onClick={() => handleCustomExprChange("* * * * *")}
                  className="border-2 border-foreground bg-zinc-900 hover:bg-zinc-800 px-4 text-xs font-black uppercase cursor-pointer transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {error && (
              <div className="border border-red-800 bg-red-950/20 p-3 text-xs text-red-400 leading-relaxed flex gap-2 rounded-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong>PARSING ERROR:</strong>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Next Occurrences */}
            {!error && occurrences.length > 0 && (
              <div className="space-y-4">
                <span className="text-[10px] text-zinc-400 block font-bold uppercase flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Next 10 Calculated Trigger Dates:</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {occurrences.map((date, index) => {
                    const month = date.toLocaleString("en-US", { month: "short" })
                    const day = date.getDate()
                    const weekday = date.toLocaleString("en-US", { weekday: "short" })
                    const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
                    return (
                      <div
                        key={index}
                        className="border-2 border-foreground bg-zinc-900 p-3 flex items-center gap-4 shadow-[2.5px_2.5px_0px_0px_#ffffff] hover:translate-y-[-1px] transition-transform"
                      >
                        {/* Mini Calendar Card */}
                        <div className="w-12 h-12 bg-black border-2 border-foreground flex flex-col select-none shrink-0">
                          <div className="bg-primary text-[8px] font-black text-primary-foreground text-center uppercase py-0.5">
                            {month}
                          </div>
                          <div className="flex-grow flex items-center justify-center text-sm font-black text-foreground">
                            {day}
                          </div>
                        </div>

                        {/* Date details */}
                        <div className="text-left font-mono">
                          <div className="text-xs font-black text-foreground uppercase tracking-wide">
                            {weekday}, {month} {day}
                          </div>
                          <div className="text-[10px] text-accent font-bold mt-0.5">
                            Triggers at {time}
                          </div>
                        </div>

                        <span className="ml-auto text-[9px] text-zinc-600 font-bold">
                          #{index + 1}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
