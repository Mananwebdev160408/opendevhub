"use client"

import * as React from "react"
import { Terminal, AlertTriangle, Search, HelpCircle, Layers, Plus, Trash2, Code, FileText, Settings, Play, ArrowRight } from "lucide-react"
import cheatsheetsData from "../../../../data/docker-compose-cheatsheets.json"

interface ServiceConfig {
  id: string
  name: string
  image: string
  restart: string
  ports: { host: string; container: string }[]
  env: { key: string; value: string }[]
  volumes: { hostOrNamed: string; container: string; isNamed: boolean }[]
  dependsOn: string[]
}

function CopyButton({ text, label = "COPY" }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-2.5 py-1 border text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
        copied
          ? "bg-accent text-accent-foreground border-foreground scale-95"
          : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-foreground hover:border-foreground shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
      }`}
    >
      {copied ? "COPIED!" : label}
    </button>
  )
}

export function DockerComposeCheats() {
  const [activeTab, setActiveTab] = React.useState<"maker" | "reference">("maker")
  const [activeCategory, setActiveCategory] = React.useState("ALL")
  const [searchQuery, setSearchQuery] = React.useState("")

  // --- FILE MAKER STATE ---
  const [services, setServices] = React.useState<ServiceConfig[]>([
    {
      id: "1",
      name: "web-app",
      image: "node:20-alpine",
      restart: "always",
      ports: [{ host: "3000", container: "3000" }],
      env: [{ key: "NODE_ENV", value: "production" }],
      volumes: [{ hostOrNamed: "app_data", container: "/app/data", isNamed: true }],
      dependsOn: []
    }
  ])

  // Presets definition
  const loadPreset = (type: "node-postgres" | "python-redis" | "nginx-static") => {
    if (type === "node-postgres") {
      setServices([
        {
          id: "1",
          name: "web",
          image: "node:20-alpine",
          restart: "always",
          ports: [{ host: "3000", container: "3000" }],
          env: [
            { key: "NODE_ENV", value: "production" },
            { key: "DATABASE_URL", value: "postgres://postgres:secret@db:5432/production_db" }
          ],
          volumes: [],
          dependsOn: ["db"]
        },
        {
          id: "2",
          name: "db",
          image: "postgres:15-alpine",
          restart: "unless-stopped",
          ports: [{ host: "5432", container: "5432" }],
          env: [
            { key: "POSTGRES_USER", value: "postgres" },
            { key: "POSTGRES_PASSWORD", value: "secret" },
            { key: "POSTGRES_DB", value: "production_db" }
          ],
          volumes: [{ hostOrNamed: "pgdata", container: "/var/lib/postgresql/data", isNamed: true }],
          dependsOn: []
        }
      ])
    } else if (type === "python-redis") {
      setServices([
        {
          id: "1",
          name: "api",
          image: "python:3.11-slim",
          restart: "always",
          ports: [{ host: "8000", container: "8000" }],
          env: [
            { key: "REDIS_HOST", value: "cache" },
            { key: "REDIS_PORT", value: "6379" }
          ],
          volumes: [],
          dependsOn: ["cache"]
        },
        {
          id: "2",
          name: "cache",
          image: "redis:7-alpine",
          restart: "always",
          ports: [{ host: "6379", container: "6379" }],
          env: [],
          volumes: [{ hostOrNamed: "redis_data", container: "/data", isNamed: true }],
          dependsOn: []
        }
      ])
    } else if (type === "nginx-static") {
      setServices([
        {
          id: "1",
          name: "nginx-server",
          image: "nginx:alpine",
          restart: "unless-stopped",
          ports: [{ host: "80", container: "80" }],
          env: [],
          volumes: [
            { hostOrNamed: "./html", container: "/usr/share/nginx/html", isNamed: false },
            { hostOrNamed: "./nginx.conf", container: "/etc/nginx/nginx.conf", isNamed: false }
          ],
          dependsOn: []
        }
      ])
    }
  }

  const addService = () => {
    const newId = (Math.max(...services.map(s => parseInt(s.id))) + 1).toString()
    setServices([
      ...services,
      {
        id: newId,
        name: `service-${newId}`,
        image: "alpine:latest",
        restart: "always",
        ports: [],
        env: [],
        volumes: [],
        dependsOn: []
      }
    ])
  }

  const removeService = (id: string) => {
    // If we remove a service, make sure we clean up references in dependsOn of other services
    const serviceToRemove = services.find(s => s.id === id)
    const nameToRemove = serviceToRemove ? serviceToRemove.name : ""

    setServices(
      services
        .filter(s => s.id !== id)
        .map(s => ({
          ...s,
          dependsOn: s.dependsOn.filter(dep => dep !== nameToRemove)
        }))
    )
  }

  const updateService = (id: string, updates: Partial<ServiceConfig>) => {
    setServices(services.map(s => (s.id === id ? { ...s, ...updates } : s)))
  }

  // Generate dynamic docker-compose.yml content
  const generatedYaml = React.useMemo(() => {
    let yaml = "version: '3.8'\n\nservices:\n"

    services.forEach(s => {
      const serviceName = s.name.trim() || "unnamed-service"
      yaml += `  ${serviceName}:\n`
      yaml += `    image: ${s.image.trim() || "scratch"}\n`
      yaml += `    restart: ${s.restart}\n`

      if (s.ports.length > 0) {
        yaml += "    ports:\n"
        s.ports.forEach(p => {
          if (p.host || p.container) {
            yaml += `      - "${p.host || p.container}:${p.container || p.host}"\n`
          }
        })
      }

      if (s.env.length > 0) {
        yaml += "    environment:\n"
        s.env.forEach(e => {
          if (e.key.trim()) {
            yaml += `      - ${e.key.trim()}=${e.value}\n`
          }
        })
      }

      if (s.volumes.length > 0) {
        yaml += "    volumes:\n"
        s.volumes.forEach(v => {
          if (v.hostOrNamed.trim() || v.container.trim()) {
            yaml += `      - ${v.hostOrNamed.trim() || "data"}:${v.container.trim() || "/data"}\n`
          }
        })
      }

      if (s.dependsOn.length > 0) {
        yaml += "    depends_on:\n"
        s.dependsOn.forEach(dep => {
          yaml += `      - ${dep}\n`
        })
      }

      yaml += "\n"
    })

    // Find any named volumes
    const namedVolumes = Array.from(
      new Set(
        services
          .flatMap(s => s.volumes)
          .filter(v => v.isNamed && v.hostOrNamed.trim())
          .map(v => v.hostOrNamed.trim())
      )
    )

    if (namedVolumes.length > 0) {
      yaml += "volumes:\n"
      namedVolumes.forEach(volName => {
        yaml += `  ${volName}:\n`
      })
    }

    return yaml.trim()
  }, [services])

  // --- CHEATSHEET FILTERING ---
  const categories = React.useMemo(() => {
    return ["ALL", ...cheatsheetsData.map(c => c.category)]
  }, [])

  const filteredData = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return cheatsheetsData
      .map(catGroup => {
        const matchedCommands = catGroup.commands.filter(c => {
          const matchesSearch = !query || 
            c.cmd.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.syntax.toLowerCase().includes(query) ||
            c.example.toLowerCase().includes(query) ||
            (c.mistake && c.mistake.toLowerCase().includes(query))

          return matchesSearch
        })

        return {
          ...catGroup,
          commands: matchedCommands
        }
      })
      .filter(catGroup => {
        const matchesCategory = activeCategory === "ALL" || catGroup.category === activeCategory
        return matchesCategory && catGroup.commands.length > 0
      })
  }, [activeCategory, searchQuery])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Hero Banner */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          DOCKER COMPOSE HUB
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-primary" />
          <span>DOCKER COMPOSE TOOL DECK</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Build multi-container systems interactively with our File Maker or explore the complete syntax registry and pitfall alerts in the Options Reference index.
        </p>

        {/* Tab Selection */}
        <div className="flex gap-4 mt-6 border-t border-zinc-800 pt-6">
          <button
            onClick={() => setActiveTab("maker")}
            className={`px-4 py-2 border-2 text-xs font-black uppercase cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === "maker"
                ? "bg-primary text-primary-foreground border-foreground shadow-[3px_3px_0px_0px_#ffffff]"
                : "border-zinc-800 text-zinc-400 hover:border-foreground hover:text-foreground"
            }`}
          >
            <Code className="h-4 w-4" />
            <span>Interactive File Maker</span>
          </button>
          <button
            onClick={() => setActiveTab("reference")}
            className={`px-4 py-2 border-2 text-xs font-black uppercase cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === "reference"
                ? "bg-accent text-accent-foreground border-foreground shadow-[3px_3px_0px_0px_#ffffff]"
                : "border-zinc-800 text-zinc-400 hover:border-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Options Reference</span>
          </button>
        </div>
      </div>

      {activeTab === "maker" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Configuration Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--accent)] space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Settings className="h-4 w-4 text-accent" />
                  Stack Configuration & Presets
                </h2>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => loadPreset("node-postgres")}
                    className="px-2 py-0.5 border border-zinc-800 text-[9px] hover:border-foreground hover:bg-zinc-900 font-bold uppercase transition-all"
                  >
                    Node + Postgres
                  </button>
                  <button
                    onClick={() => loadPreset("python-redis")}
                    className="px-2 py-0.5 border border-zinc-800 text-[9px] hover:border-foreground hover:bg-zinc-900 font-bold uppercase transition-all"
                  >
                    Python + Redis
                  </button>
                  <button
                    onClick={() => loadPreset("nginx-static")}
                    className="px-2 py-0.5 border border-zinc-800 text-[9px] hover:border-foreground hover:bg-zinc-900 font-bold uppercase transition-all"
                  >
                    Nginx Static
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground leading-normal">
                Customize your microservices configuration below. Add, modify or remove services. Changes will update the `docker-compose.yml` code preview instantly.
              </p>
            </div>

            {/* Service Config Panels */}
            <div className="space-y-4">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4 relative"
                >
                  <div className="absolute top-2 right-4 flex items-center gap-2">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">SERVICE #{index + 1}</span>
                    {services.length > 1 && (
                      <button
                        onClick={() => removeService(service.id)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-950/20 p-1 border border-transparent hover:border-red-900 transition-all cursor-pointer"
                        title="Remove Service"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Core Service Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-border pb-4">
                    <div>
                      <label className="text-[9px] text-zinc-400 font-bold uppercase block mb-1">Service ID/Name</label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(service.id, { name: e.target.value.replace(/[^a-zA-Z0-9_-]/g, "") })}
                        className="w-full bg-zinc-900 border border-zinc-700 text-xs text-foreground p-2 font-mono focus:outline-none focus:border-accent"
                        placeholder="e.g. web-app"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-zinc-400 font-bold uppercase block mb-1">Image Name : Tag</label>
                      <input
                        type="text"
                        value={service.image}
                        onChange={(e) => updateService(service.id, { image: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 text-xs text-foreground p-2 font-mono focus:outline-none focus:border-accent"
                        placeholder="e.g. node:20-alpine"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-zinc-400 font-bold uppercase block mb-1">Restart Policy</label>
                      <select
                        value={service.restart}
                        onChange={(e) => updateService(service.id, { restart: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 text-xs text-foreground p-2 font-mono focus:outline-none focus:border-accent"
                      >
                        <option value="always">always</option>
                        <option value="unless-stopped">unless-stopped</option>
                        <option value="on-failure">on-failure</option>
                        <option value="no">no</option>
                      </select>
                    </div>
                  </div>

                  {/* Ports, Env, Volumes configs */}
                  <div className="space-y-4">
                    {/* Ports Config */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-zinc-300 font-bold uppercase">Port Bindings (Host:Container)</span>
                        <button
                          onClick={() => {
                            const newPorts = [...service.ports, { host: "", container: "" }]
                            updateService(service.id, { ports: newPorts })
                          }}
                          className="px-2 py-0.5 border border-zinc-800 text-[9px] font-bold text-accent uppercase hover:bg-zinc-900 hover:border-foreground transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="h-2.5 w-2.5" /> ADD PORT
                        </button>
                      </div>

                      {service.ports.map((port, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Host Port (e.g. 8080)"
                            value={port.host}
                            onChange={(e) => {
                              const newPorts = [...service.ports]
                              newPorts[idx].host = e.target.value.replace(/[^0-9]/g, "")
                              updateService(service.id, { ports: newPorts })
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 text-xs text-foreground p-1.5 font-mono focus:outline-none focus:border-primary"
                          />
                          <span className="text-zinc-600">:</span>
                          <input
                            type="text"
                            placeholder="Container Port (e.g. 80)"
                            value={port.container}
                            onChange={(e) => {
                              const newPorts = [...service.ports]
                              newPorts[idx].container = e.target.value.replace(/[^0-9]/g, "")
                              updateService(service.id, { ports: newPorts })
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 text-xs text-foreground p-1.5 font-mono focus:outline-none focus:border-primary"
                          />
                          <button
                            onClick={() => {
                              const newPorts = service.ports.filter((_, i) => i !== idx)
                              updateService(service.id, { ports: newPorts })
                            }}
                            className="text-red-500 hover:text-red-400 p-1.5"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Environment Config */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-zinc-300 font-bold uppercase">Environment Variables</span>
                        <button
                          onClick={() => {
                            const newEnv = [...service.env, { key: "", value: "" }]
                            updateService(service.id, { env: newEnv })
                          }}
                          className="px-2 py-0.5 border border-zinc-800 text-[9px] font-bold text-accent uppercase hover:bg-zinc-900 hover:border-foreground transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="h-2.5 w-2.5" /> ADD VARIABLE
                        </button>
                      </div>

                      {service.env.map((envVar, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="KEY"
                            value={envVar.key}
                            onChange={(e) => {
                              const newEnv = [...service.env]
                              newEnv[idx].key = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "")
                              updateService(service.id, { env: newEnv })
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 text-xs text-foreground p-1.5 font-mono focus:outline-none focus:border-primary"
                          />
                          <span className="text-zinc-600">=</span>
                          <input
                            type="text"
                            placeholder="VALUE"
                            value={envVar.value}
                            onChange={(e) => {
                              const newEnv = [...service.env]
                              newEnv[idx].value = e.target.value
                              updateService(service.id, { env: newEnv })
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 text-xs text-foreground p-1.5 font-mono focus:outline-none focus:border-primary"
                          />
                          <button
                            onClick={() => {
                              const newEnv = service.env.filter((_, i) => i !== idx)
                              updateService(service.id, { env: newEnv })
                            }}
                            className="text-red-500 hover:text-red-400 p-1.5"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Volumes Config */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-zinc-300 font-bold uppercase">Volume Mounts</span>
                        <button
                          onClick={() => {
                            const newVols = [...service.volumes, { hostOrNamed: "", container: "", isNamed: true }]
                            updateService(service.id, { volumes: newVols })
                          }}
                          className="px-2 py-0.5 border border-zinc-800 text-[9px] font-bold text-accent uppercase hover:bg-zinc-900 hover:border-foreground transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="h-2.5 w-2.5" /> ADD VOLUME
                        </button>
                      </div>

                      {service.volumes.map((vol, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row gap-2 border border-zinc-900 p-2 bg-black/40">
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              placeholder={vol.isNamed ? "Named Volume (e.g. db_data)" : "Host Path (e.g. ./data)"}
                              value={vol.hostOrNamed}
                              onChange={(e) => {
                                const newVols = [...service.volumes]
                                newVols[idx].hostOrNamed = e.target.value
                                updateService(service.id, { volumes: newVols })
                              }}
                              className="w-full bg-zinc-900 border border-zinc-800 text-xs text-foreground p-1.5 font-mono focus:outline-none focus:border-primary"
                            />
                            <span className="text-zinc-600">:</span>
                            <input
                              type="text"
                              placeholder="Container Path (e.g. /var/lib/data)"
                              value={vol.container}
                              onChange={(e) => {
                                const newVols = [...service.volumes]
                                newVols[idx].container = e.target.value
                                updateService(service.id, { volumes: newVols })
                              }}
                              className="w-full bg-zinc-900 border border-zinc-800 text-xs text-foreground p-1.5 font-mono focus:outline-none focus:border-primary"
                            />
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-4 min-w-[120px]">
                            <label className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-bold uppercase select-none cursor-pointer">
                              <input
                                type="checkbox"
                                checked={vol.isNamed}
                                onChange={(e) => {
                                  const newVols = [...service.volumes]
                                  newVols[idx].isNamed = e.target.checked
                                  updateService(service.id, { volumes: newVols })
                                }}
                                className="accent-accent"
                              />
                              NAMED VOLUME
                            </label>
                            <button
                              onClick={() => {
                                const newVols = service.volumes.filter((_, i) => i !== idx)
                                updateService(service.id, { volumes: newVols })
                              }}
                              className="text-red-500 hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Depends On Config */}
                    {services.length > 1 && (
                      <div className="space-y-2 pt-2 border-t border-zinc-900">
                        <span className="text-[9px] text-zinc-400 font-bold uppercase block mb-1">Depends On (Startup Sequence)</span>
                        <div className="flex flex-wrap gap-4">
                          {services
                            .filter(s => s.id !== service.id)
                            .map(otherService => {
                              const isChecked = service.dependsOn.includes(otherService.name)
                              return (
                                <label
                                  key={otherService.id}
                                  className="flex items-center gap-1.5 text-[10px] text-foreground font-semibold cursor-pointer select-none"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      let newDeps = [...service.dependsOn]
                                      if (e.target.checked) {
                                        newDeps.push(otherService.name)
                                      } else {
                                        newDeps = newDeps.filter(n => n !== otherService.name)
                                      }
                                      updateService(service.id, { dependsOn: newDeps })
                                    }}
                                    className="accent-primary"
                                  />
                                  <span>{otherService.name}</span>
                                </label>
                              )
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addService}
              className="w-full py-3 border-4 border-dashed border-zinc-800 hover:border-foreground bg-zinc-950 text-xs font-black uppercase text-zinc-500 hover:text-foreground transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
            >
              <Plus className="h-4 w-4" />
              <span>Add Custom Service</span>
            </button>
          </div>

          {/* Generated Code Preview Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
            <div className="border-4 border-foreground bg-zinc-950 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
              {/* Card Header */}
              <div className="border-b-4 border-foreground bg-black p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary fill-primary" />
                  <span className="text-xs font-black uppercase text-foreground">docker-compose.yml</span>
                </div>
                <CopyButton text={generatedYaml} label="COPY FILE" />
              </div>

              {/* Code display */}
              <pre className="p-4 text-xs text-accent overflow-x-auto block bg-black select-all whitespace-pre font-mono leading-relaxed min-h-[400px] max-h-[700px] overflow-y-auto">
                <code>{generatedYaml}</code>
              </pre>
            </div>

            <div className="border-2 border-foreground bg-card p-4 shadow-[4px_4px_0px_0px_var(--primary)] text-xs leading-relaxed space-y-2">
              <span className="font-black text-foreground uppercase block text-[10px]">Deployment instructions:</span>
              <p className="text-muted-foreground text-[10px]">
                Create a file named <code className="text-foreground bg-zinc-900 px-1 border border-border">docker-compose.yml</code> in your directory, copy the code content above into it, and launch your stack by executing:
              </p>
              <div className="flex justify-between items-center bg-black border border-border p-2 text-primary font-mono text-[11px] mt-1 select-all">
                <code>docker compose up -d</code>
                <CopyButton text="docker compose up -d" label="COPY CMD" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* REFERENCE CHEATSHEET TAB */
        <div className="space-y-12">
          <div className="space-y-4">
            {/* Search Box */}
            <div className="relative border-2 border-foreground bg-zinc-950 p-2 shadow-[3px_3px_0px_0px_var(--primary)] flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
              <input
                type="text"
                placeholder="Search configuration options, syntax, examples, or pitfalls (e.g. 'depends_on', 'ports', 'volumes')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder-zinc-600 font-mono py-1.5"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-zinc-500 hover:text-foreground cursor-pointer px-2"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_var(--accent)] flex flex-wrap gap-2 select-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase cursor-pointer transition-all ${
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
                      : "border-zinc-800 hover:border-foreground hover:bg-zinc-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {searchQuery && (
            <div className="text-xs text-zinc-500 font-bold uppercase select-none">
              SEARCH RESULTS FOR: "{searchQuery}"
            </div>
          )}

          <div className="space-y-12">
            {filteredData.map((catGroup) => (
              <div key={catGroup.category} className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary border-b-2 border-foreground pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-accent" />
                    {catGroup.category}
                  </span>
                  <span className="text-[10px] text-zinc-600 font-bold">
                    {catGroup.commands.length} {catGroup.commands.length === 1 ? "OPTION" : "OPTIONS"}
                  </span>
                </h3>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {catGroup.commands.map((c) => (
                    <div
                      key={c.cmd}
                      className="border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <span className="text-xs font-black text-foreground bg-zinc-900 px-2 py-0.5 border border-border">
                            {c.cmd}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-bold uppercase">{catGroup.category}</span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {c.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-zinc-500 font-bold block uppercase flex items-center gap-1">
                              <HelpCircle className="h-3 w-3 text-zinc-600" />
                              SYNTAX FORMAT:
                            </span>
                            <CopyButton text={c.syntax} />
                          </div>
                          <pre className="bg-black border border-border p-2 text-xs text-primary block overflow-x-auto select-all whitespace-pre-wrap">
                            <code>{c.syntax}</code>
                          </pre>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-zinc-500 font-bold block uppercase flex items-center gap-1">
                              <Terminal className="h-3 w-3 text-zinc-600" />
                              EXAMPLE CODE:
                            </span>
                            <CopyButton text={c.example} />
                          </div>
                          <pre className="bg-black border border-border p-2 text-xs text-accent block overflow-x-auto select-all whitespace-pre-wrap">
                            <code>{c.example}</code>
                          </pre>
                        </div>
                      </div>

                      {c.mistake && (
                        <div className="border border-red-800 bg-red-950/20 p-3 text-xs text-red-400 leading-relaxed flex gap-2 mt-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                          <div>
                            <strong>COMMON PITFALL:</strong>
                            <p className="mt-1">{c.mistake}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="border-4 border-dashed border-zinc-800 bg-zinc-950 p-12 text-center space-y-4">
                <AlertTriangle className="h-8 w-8 text-accent mx-auto" />
                <h4 className="text-sm font-black uppercase text-foreground">NO MATCHING DOCKER COMPOSE OPTIONS FOUND</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  We couldn't find anything matching your search term. Try searching for other terms like "build", "depends_on", "restart", "deploy" or reset the filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("ALL")
                  }}
                  className="px-3 py-1.5 border-2 border-foreground bg-accent text-accent-foreground text-[10px] font-black uppercase cursor-pointer hover:bg-zinc-950 hover:text-foreground transition-all"
                >
                  RESET FILTERS
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
