"use client"

import * as React from "react"
import { Copy, Check, Sparkles, Terminal, Info, Globe, Mail } from "lucide-react"

function CopyButton({ text }: { text: string }) {
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
      className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
        copied
          ? "bg-accent text-accent-foreground border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
          : "bg-black border-foreground text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_#ffffff]"
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? "COPIED" : "COPY MARKDOWN"}</span>
    </button>
  )
}

interface TechBadge {
  name: string
  logo: string
  color: string
  textColor?: string
}

export function ReadmeBuilder() {
  // Inputs
  const [name, setName] = React.useState("Jane Dev")
  const [title, setTitle] = React.useState("Full Stack Software Engineer")
  const [subtitle, setSubtitle] = React.useState("Building modular open-source systems and developer playgrounds.")
  const [workingOn, setWorkingOn] = React.useState("OpenDevHub & modular plugins")
  const [learning, setLearning] = React.useState("Rust concurrency and WebAssembly compiler pipes")
  const [collab, setCollab] = React.useState("developer automation and terminal tools")
  const [email, setEmail] = React.useState("jane.dev@example.com")

  // Socials
  const [githubUser, setGithubUser] = React.useState("janedev")
  const [twitterUser, setTwitterUser] = React.useState("janedev_code")
  const [linkedinUser, setLinkedinUser] = React.useState("jane-dev")
  const [portfolioUrl, setPortfolioUrl] = React.useState("https://janedev.com")

  // Stats Card Settings
  const [showStats, setShowStats] = React.useState(true)
  const [showLangs, setShowLangs] = React.useState(true)
  const [statsTheme, setStatsTheme] = React.useState("dark")

  // Tech Badge categories
  const techCategories: { category: string; items: TechBadge[] }[] = [
    {
      category: "Languages",
      items: [
        { name: "JavaScript", logo: "javascript", color: "F7DF1E" },
        { name: "TypeScript", logo: "typescript", color: "3178C6" },
        { name: "Python", logo: "python", color: "3776AB" },
        { name: "Go", logo: "go", color: "00ADD8" },
        { name: "Rust", logo: "rust", color: "000000" },
        { name: "C++", logo: "cplusplus", color: "00599C" }
      ]
    },
    {
      category: "Frontend & Design",
      items: [
        { name: "HTML5", logo: "html5", color: "E34F26" },
        { name: "CSS3", logo: "css3", color: "1572B6" },
        { name: "TailwindCSS", logo: "tailwindcss", color: "06B6D4" },
        { name: "React", logo: "react", color: "20232A", textColor: "61DAFB" },
        { name: "Next.js", logo: "nextdotjs", color: "000000" },
        { name: "Vue", logo: "vuedotjs", color: "4FC08D" }
      ]
    },
    {
      category: "Backend & Database",
      items: [
        { name: "Node.js", logo: "nodedotjs", color: "339933" },
        { name: "Express", logo: "express", color: "000000" },
        { name: "PostgreSQL", logo: "postgresql", color: "4169E1" },
        { name: "MongoDB", logo: "mongodb", color: "47A248" },
        { name: "Redis", logo: "redis", color: "DC382D" }
      ]
    },
    {
      category: "Tools & DevOps",
      items: [
        { name: "Docker", logo: "docker", color: "2496ED" },
        { name: "Kubernetes", logo: "kubernetes", color: "326CE5" },
        { name: "AWS", logo: "amazonwebservices", color: "232F3E" },
        { name: "Git", logo: "git", color: "F05032" },
        { name: "Vercel", logo: "vercel", color: "000000" }
      ]
    }
  ]

  const [selectedTechs, setSelectedTechs] = React.useState<string[]>(["TypeScript", "React", "Next.js", "Node.js", "Docker"])

  const toggleTech = (name: string) => {
    setSelectedTechs(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    )
  }

  // Compile Markdown code
  const generatedMarkdown = React.useMemo(() => {
    let md = `# Hi there, I'm ${name}! 👋\n`
    if (title) md += `### ${title}\n\n`
    if (subtitle) md += `_${subtitle}_\n\n`

    md += `---\n\n`
    md += `### 🔭 Profile Details\n`
    if (workingOn) md += `- 🔭 I’m currently working on **${workingOn}**\n`
    if (learning) md += `- 🌱 I’m currently learning **${learning}**\n`
    if (collab) md += `- 🤝 I’m looking to collaborate on **${collab}**\n`
    if (email) md += `- ✉️ Reach me at **${email}**\n\n`

    if (selectedTechs.length > 0) {
      md += `---\n\n`
      md += `### 🛠️ Tech Stack & Tools\n`
      const badges = selectedTechs.map(tName => {
        // Find badge info
        let badge: TechBadge | undefined
        for (const cat of techCategories) {
          const found = cat.items.find(item => item.name === tName)
          if (found) {
            badge = found
            break
          }
        }
        if (!badge) return ""
        const textCol = badge.textColor ? `&logoColor=${badge.textColor}` : `&logoColor=white`
        return `![${badge.name}](https://img.shields.io/badge/${encodeURIComponent(badge.name)}-%23${badge.color}.svg?style=for-the-badge&logo=${badge.logo}${textCol})`
      })
      md += `<p align="left">\n  ${badges.filter(Boolean).join("\n  ")}\n</p>\n\n`
    }

    if (showStats || showLangs) {
      md += `---\n\n`
      md += `### 📊 GitHub Stats\n`
      md += `<p align="left">\n`
      if (showStats && githubUser) {
        md += `  <a href="https://github.com/${githubUser}">\n    <img align="center" src="https://github-readme-stats.vercel.app/api?username=${githubUser}&show_icons=true&theme=${statsTheme}&locale=en" alt="${githubUser}'s github stats" />\n  </a>\n`
      }
      if (showLangs && githubUser) {
        md += `  <a href="https://github.com/${githubUser}">\n    <img align="center" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUser}&layout=compact&theme=${statsTheme}" alt="top languages" />\n  </a>\n`
      }
      md += `</p>\n\n`
    }

    // Connect Section
    const hasSocials = githubUser || twitterUser || linkedinUser || portfolioUrl
    if (hasSocials) {
      md += `---\n\n`
      md += `### 🤝 Connect with Me\n`
      md += `<p align="left">\n`
      if (linkedinUser) {
        md += `  <a href="https://linkedin.com/in/${linkedinUser}" target="blank"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="${linkedinUser}" /></a>\n`
      }
      if (twitterUser) {
        md += `  <a href="https://twitter.com/${twitterUser}" target="blank"><img src="https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=twitter&logoColor=white" alt="${twitterUser}" /></a>\n`
      }
      if (portfolioUrl) {
        md += `  <a href="${portfolioUrl}" target="blank"><img src="https://img.shields.io/badge/Portfolio-%23FF5733.svg?style=for-the-badge&logo=firefox-browser&logoColor=white" alt="portfolio" /></a>\n`
      }
      md += `</p>\n`
    }

    return md
  }, [name, title, subtitle, workingOn, learning, collab, email, selectedTechs, showStats, showLangs, statsTheme, githubUser, twitterUser, linkedinUser, portfolioUrl])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-8">
      {/* Title */}
      <div className="border-4 border-foreground bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden bg-dot-pattern">
        <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-bold uppercase select-none">
          README BUILDER
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-4 flex items-center gap-2">
          <Globe className="h-6 w-6 text-accent animate-pulse" />
          <span>GITHUB PROFILE README BUILDER</span>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
          Construct a stunning profile overview for your GitHub dashboard. Choose stats themes, tech stack badges, and copy the markdown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs Panel - 5 Columns */}
        <div className="lg:col-span-5 border-4 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--primary)] space-y-5 overflow-y-auto max-h-[85vh]">
          <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase font-bold">PROFILE SETUP</span>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase font-bold">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase font-bold">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase font-bold">Bio Subtitle</label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none h-16"
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase font-bold">Currently working on</label>
              <input
                type="text"
                value={workingOn}
                onChange={(e) => setWorkingOn(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase font-bold">Currently learning</label>
              <input
                type="text"
                value={learning}
                onChange={(e) => setLearning(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase font-bold">Looking to collaborate on</label>
              <input
                type="text"
                value={collab}
                onChange={(e) => setCollab(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase font-bold">Contact Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase pt-2 font-bold">SOCIAL HANDLES</span>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">GitHub User</label>
                <input
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Twitter User</label>
                <input
                  type="text"
                  value={twitterUser}
                  onChange={(e) => setTwitterUser(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1 text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">LinkedIn User</label>
                <input
                  type="text"
                  value={linkedinUser}
                  onChange={(e) => setLinkedinUser(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Portfolio URL</label>
                <input
                  type="text"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full border-2 border-foreground bg-black px-2 py-1 text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>

          <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase pt-2 font-bold">GITHUB CARDS</span>
          <div className="space-y-3 text-xs font-bold">
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showStats}
                  onChange={(e) => setShowStats(e.target.checked)}
                  className="accent-primary"
                />
                <span>Show Stats Card</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLangs}
                  onChange={(e) => setShowLangs(e.target.checked)}
                  className="accent-primary"
                />
                <span>Show Languages</span>
              </label>
            </div>

            <div>
              <label className="block mb-1 text-[10px] text-zinc-500 uppercase">Stats Theme</label>
              <select
                value={statsTheme}
                onChange={(e) => setStatsTheme(e.target.value)}
                className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-xs text-foreground cursor-pointer"
              >
                <option value="dark">dark</option>
                <option value="radical">radical</option>
                <option value="merko">merko</option>
                <option value="gruvbox">gruvbox</option>
                <option value="tokyonight">tokyonight</option>
              </select>
            </div>
          </div>

          <span className="text-[10px] text-zinc-400 block border-b border-border pb-1.5 uppercase pt-2 font-bold">TECH STACK BADGES</span>
          <div className="space-y-4">
            {techCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5 text-left">
                <span className="text-[9px] text-zinc-500 font-bold block uppercase">{cat.category}</span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => {
                    const isSelected = selectedTechs.includes(item.name)
                    return (
                      <button
                        key={item.name}
                        onClick={() => toggleTech(item.name)}
                        className={`px-2 py-1 border text-[9px] font-black uppercase cursor-pointer transition-all ${
                          isSelected
                            ? "bg-accent text-accent-foreground border-foreground shadow-[1px_1px_0px_0px_#ffffff]"
                            : "border-zinc-800 text-zinc-400 hover:border-foreground"
                        }`}
                      >
                        {item.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Panel - 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-4 border-foreground p-6 bg-zinc-950 min-h-[480px] shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 select-none">
              <span className="text-[9px] font-black text-black bg-zinc-200 border border-zinc-400 px-2 py-0.5 uppercase">
                Markdown Source Codes
              </span>
              <CopyButton text={generatedMarkdown} />
            </div>

            <pre className="flex-grow bg-black border border-border p-4 text-[11px] text-green-400 overflow-x-auto leading-relaxed select-all whitespace-pre-wrap">
              <code>{generatedMarkdown}</code>
            </pre>

            <div className="flex gap-2 items-center text-[9px] text-zinc-500 select-none mt-6 border-t border-zinc-800 pt-3">
              <Info className="h-3.5 w-3.5 text-accent" />
              <span>Copy and paste this compiled markdown directly into your user repository's README.md file.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
