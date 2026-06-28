"use client"

import * as React from "react"
import { Send, Terminal } from "lucide-react"

export default function ContactFormClient() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [message, setMessage] = React.useState("")

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [logs, setLogs] = React.useState<string[]>([])
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setIsSubmitting(true)
    setIsSuccess(false)
    setLogs([])

    // Client-side initial logs
    const clientSteps = [
      "INITIALIZING SECURE COMMS TUNNEL...",
      "PACKAGING PAYLOAD OBJECT...",
      "TRANSMITTING PAYLOAD TO NODE ROUTER...",
    ]

    for (let i = 0; i < clientSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setLogs((prev) => [...prev, `[LOG] ${clientSteps[i]}`])
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })

      const data = await res.json()
      const serverLogs = data.logs || []

      for (let i = 0; i < serverLogs.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 400))
        const logLine = serverLogs[i]
        // Avoid duplicate client logs if returned by server
        const isDuplicate = clientSteps.some(step => logLine.includes(step))
        if (!isDuplicate) {
          setLogs((prev) => [...prev, logLine])
        }
      }

      if (res.ok && data.success) {
        setIsSuccess(true)
      } else {
        setIsSuccess(false)
      }
    } catch (err: any) {
      console.error(err)
      await new Promise((resolve) => setTimeout(resolve, 400))
      setLogs((prev) => [
        ...prev,
        `[FATAL ERROR] TRANSMISSION PIPELINE FAILURE: ${err.message || err}`,
        `[LOG] RETRY RECOMMENDED.`,
      ])
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setIsSuccess(false)
    setLogs([])
  }

  if (isSuccess) {
    return (
      <div className="border-2 border-foreground bg-zinc-950 p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4 font-mono">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-black text-foreground uppercase">COMMUNICATION SUCCESSFUL</span>
        </div>

        <div className="bg-black border border-zinc-800 p-4 space-y-1.5 text-xs text-zinc-500">
          {logs.map((log, index) => {
            const isError = log.includes("[ERROR]") || log.includes("[FATAL]")
            const isWarning = log.includes("[WARNING]")
            const isSuccessLog = log.includes("SUCCESSFULLY") || log.includes("COMPLETE")
            return (
              <p
                key={index}
                className={
                  isError
                    ? "text-red-400 font-bold"
                    : isWarning
                    ? "text-amber-400"
                    : isSuccessLog
                    ? "text-green-400 font-bold"
                    : ""
                }
              >
                {log}
              </p>
            )
          })}
        </div>

        <div className="space-y-2 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            Thank you for reaching out, <strong className="text-foreground">{name}</strong>. Your transmission has been securely logged in our database and routed to the operator.
          </p>
        </div>

        <button
          onClick={resetForm}
          className="px-4 py-2 border-2 border-foreground bg-zinc-900 text-foreground text-xs font-bold uppercase hover:bg-zinc-800 active:translate-y-0.5 transition-all cursor-pointer"
        >
          SEND NEW TRANSMISSION
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4">
      <div className="flex items-center gap-1.5 text-xs font-black uppercase text-foreground border-b border-border pb-3 mb-2">
        <Terminal className="h-4 w-4 text-primary" />
        <span>TRANSMISSION FORM</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-500 font-bold uppercase">NAME (REQUIRED):</label>
          <input
            type="text"
            required
            disabled={isSubmitting}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 border-2 border-foreground bg-black px-3 text-xs focus:outline-none focus:border-primary disabled:opacity-50"
            placeholder="e.g. Linus Torvalds"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-500 font-bold uppercase">EMAIL (REQUIRED):</label>
          <input
            type="email"
            required
            disabled={isSubmitting}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 border-2 border-foreground bg-black px-3 text-xs focus:outline-none focus:border-primary disabled:opacity-50"
            placeholder="e.g. linus@linuxfoundation.org"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] text-zinc-500 font-bold uppercase">SUBJECT:</label>
        <input
          type="text"
          disabled={isSubmitting}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full h-10 border-2 border-foreground bg-black px-3 text-xs focus:outline-none focus:border-primary disabled:opacity-50"
          placeholder="e.g. Bug report, API request..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] text-zinc-500 font-bold uppercase">MESSAGE (REQUIRED):</label>
        <textarea
          required
          disabled={isSubmitting}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 border-2 border-foreground bg-black p-3 text-xs focus:outline-none focus:border-primary disabled:opacity-50 leading-relaxed"
          placeholder="Type your message details here..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !name || !email || !message}
        className="w-full h-11 border-2 border-foreground bg-primary hover:bg-purple-600 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 disabled:cursor-not-allowed text-primary-foreground font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Send className="h-3.5 w-3.5" />
        <span>{isSubmitting ? "TRANSMITTING..." : "SEND TRANSMISSION"}</span>
      </button>

      {(isSubmitting || (logs.length > 0 && !isSuccess)) && (
        <div className="bg-black border border-zinc-800 p-3 space-y-1 text-[10px] text-zinc-500 font-mono">
          {logs.map((log, idx) => {
            const isError = log.includes("[ERROR]") || log.includes("[FATAL]")
            const isWarning = log.includes("[WARNING]")
            return (
              <p
                key={idx}
                className={
                  isError
                    ? "text-red-400 font-semibold"
                    : isWarning
                    ? "text-amber-400"
                    : "text-zinc-500"
                }
              >
                {log}
              </p>
            )
          })}
        </div>
      )}
    </form>
  )
}

