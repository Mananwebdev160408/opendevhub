import { SecurityCheats } from "@/modules/security-cheatsheets"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Web Security Headers & Encryption Cheatsheet - OpenDev Hub",
  description: "Search OWASP Top 10 vulnerabilities remediation steps, HTTP security response headers configuration, and symmetric AES/bcrypt hashing examples.",
  alternates: {
    canonical: "/security-cheatsheets",
  },
}

export default function SecurityCheatsheetsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <SecurityCheats />
    </div>
  )
}
