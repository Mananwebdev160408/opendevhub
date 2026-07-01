import { DockerComposeCheats } from "@/modules/docker-compose-cheatsheets"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Docker Compose Cheatsheet & Configuration Reference - OpenDev Hub",
  description: "Learn Docker Compose syntax, configuration keys, and block parameters including services, volumes, networks, ports, environments, and deployment scaling with copyable examples.",
  alternates: {
    canonical: "/docker-compose-cheatsheets",
  },
}

export default function DockerComposeCheatsheetsPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      <DockerComposeCheats />
    </div>
  )
}
