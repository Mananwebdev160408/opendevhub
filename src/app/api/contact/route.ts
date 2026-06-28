import { connectToDatabase } from "@/lib/mongodb"
import { Feedback } from "@/lib/feedback"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, logs: ["[ERROR] Missing required fields (name, email, message)"] },
        { status: 400 }
      )
    }

    const logs = [
      "INITIALIZING SECURE COMMS TUNNEL...",
      "PACKAGING PAYLOAD OBJECT...",
      "VERIFYING DATA STRUCTURES...",
    ]

    let dbSuccess = false
    logs.push("CONNECTING TO MONGODB ATLAS...")
    try {
      await connectToDatabase()
      logs.push("CONNECTION ESTABLISHED. PREPARING RECORD...")
      
      await Feedback.create({
        name,
        email,
        subject: subject || "No Subject",
        message,
        createdAt: new Date(),
      })
      logs.push("FEEDBACK SECURELY LOGGED IN MONGODB COLLECTION.")
      dbSuccess = true
    } catch (dbErr: any) {
      console.error("MongoDB feedback save failed:", dbErr)
      logs.push(`[ERROR] MONGODB SAVE FAILED: ${dbErr.message || dbErr}`)
    }

    // Try sending email via Resend HTTP API
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      logs.push("CONNECTING TO EMAIL RELAY SERVER (RESEND)...")
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "OpenDev Hub Contact <onboarding@resend.dev>",
            to: ["guptamanan576@gmail.com"],
            subject: `New Feedback: ${subject || "Contact Form Submission"}`,
            html: `
              <h3>New Contact Form Submission</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject || "N/A"}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            `,
          }),
        })

        if (res.ok) {
          logs.push("EMAIL NOTIFICATION DISPATCHED TO OPERATOR NODE.")
        } else {
          const errText = await res.text()
          console.error("Resend API failed:", errText)
          logs.push(`[WARNING] EMAIL RELAY RETURNED ERROR: ${res.status}`)
        }
      } catch (mailErr: any) {
        console.error("Resend fetch failed:", mailErr)
        logs.push(`[WARNING] EMAIL RELAY CONNECTION FAILED: ${mailErr.message || mailErr}`)
      }
    } else {
      logs.push("[INFO] EMAIL DISPATCH SKIPPED (RESEND_API_KEY MISSING).")
    }

    if (dbSuccess) {
      logs.push("TRANSMISSION COMPLETED SUCCESSFULLY!")
      return NextResponse.json({ success: true, logs })
    } else {
      logs.push("TRANSMISSION COMPLETED WITH CRITICAL WARNINGS.")
      return NextResponse.json({ success: false, logs }, { status: 500 })
    }

  } catch (err: any) {
    console.error("API Route error:", err)
    return NextResponse.json(
      { success: false, logs: [`[FATAL ERROR] API CRASHED: ${err.message || err}`] },
      { status: 500 }
    )
  }
}
