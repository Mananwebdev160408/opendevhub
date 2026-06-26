import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Developer News Archive - OpenDev Hub",
  description: "Read curated updates on framework releases, compiler logs, and TypeScript changes.",
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
