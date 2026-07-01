import { K8sCheats } from "@/modules/k8s-cheatsheets"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kubernetes Kubectl Cheatsheet & Diagnostics - OpenDev Hub",
  description: "Learn kubectl cluster operations, pod deployment configurations, service exposure setups, and diagnostic commands with clean copy-paste syntaxes.",
  alternates: {
    canonical: "/k8s-cheatsheets",
  },
}

export default function K8sCheatsheetsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <K8sCheats />
    </div>
  )
}
