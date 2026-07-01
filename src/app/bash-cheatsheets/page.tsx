import { BashCheats } from "@/modules/bash-cheatsheets"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Linux & Bash Shell Command Reference Cheatsheet - OpenDev Hub",
  description: "Search core bash terminal operations, user file permissions (chmod/chown), stdio redirection rules, and process job control parameters.",
  alternates: {
    canonical: "/bash-cheatsheets",
  },
}

export default function BashCheatsheetsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <BashCheats />
    </div>
  )
}
