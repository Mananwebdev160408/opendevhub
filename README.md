# OpenDevHub

> **The Ultimate Developer Toolbox & Open Source Directory**

Discover open-source repositories, search good first issues, explore public APIs, access developer tools, browse cheatsheets, and explore CSS/design utilities — all in one high-density, zero-fluff portal.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## ✨ Highlights

- 🧰 **40+ Offline Developer Utilities** — all computation happens in the browser
- 🔍 **Direct GitHub API Exploration** — repos, issues, trending, and orgs
- 📖 **1200+ HTTP Status Codes** indexed and searchable
- 🗂 **API Directory** — curated public APIs catalogue
- 🎨 **CSS Visual Tools** — Bezier playground, Flexbox/Grid guide, Color & Font explorers
- 📋 **6 Cheatsheet Collections** — Git, Bash, YAML, Docker Compose, Kubernetes, Security
- 🔨 **Builder Tools** — Commit Builder, README Builder, NPM Package Comparator
- 📚 **Dev Glossary** — A–Z developer terminology reference
- 📰 **Dev News & Events** — stay updated with the open-source world
- 🔐 **Zero cookies, zero tracking, zero sign-up**
- 🆓 **100% free and open-source** (MIT Licensed)

---

## 🗺️ Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — Hero, Bento grid overview, Git visualizer, FAQ |
| `/tools` | Dev Toolbox — 25+ in-browser utilities organized by category |
| `/repos` | Repository Explorer — search GitHub repos |
| `/trending` | Trending Repositories — daily / weekly / monthly |
| `/issues` | Issue Explorer — find good first issues across GitHub |
| `/orgs` | Organization Explorer — search GitHub organizations |
| `/apis` | API Directory — curated catalogue of public APIs |
| `/git-cheatsheets` | Git Cheatsheets — offline, searchable reference |
| `/bash-cheatsheets` | Bash Cheatsheets — shell commands & scripting reference |
| `/yaml-cheatsheets` | YAML Cheatsheets — syntax & structure reference |
| `/docker-compose-cheatsheets` | Docker Compose Cheatsheets — service configuration reference |
| `/k8s-cheatsheets` | Kubernetes Cheatsheets — `kubectl` commands & concepts |
| `/security-cheatsheets` | Security Cheatsheets — OWASP, headers, and best practices |
| `/http-status` | HTTP Status Codes — 1200+ codes explained |
| `/css-bezier` | CSS Bezier Curve Playground — visual timing function editor |
| `/css-visual-guide` | CSS Visual Guide — interactive Flexbox & Grid reference |
| `/flex` | Flexbox Playground — live interactive layout builder |
| `/colors` | Color Palette Explorer — palettes, conversions & accessibility |
| `/fonts` | Font Explorer — preview and compare Google Fonts |
| `/commit-builder` | Commit Message Builder — Conventional Commits scaffolder |
| `/readme-builder` | README Builder — markdown README generator |
| `/npm-compare` | NPM Package Comparator — side-by-side package analysis |
| `/glossary` | Dev Glossary — A–Z developer terminology reference |
| `/events` | Developer Events — upcoming conferences & open-source programs |
| `/news` | Dev News feed |
| `/resources` | Resources Hub — curated awesome lists & learning material |
| `/licenses` | Open Source License Explorer |
| `/about` | About the project |
| `/contact` | Contact page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

---

## 🧰 Dev Toolbox

All tools run entirely **in-browser** — no server calls, no data leaves your machine.

### Data Formatters
- JSON Formatter & Validator
- CSV Grid Viewer
- YAML / XML Viewer

### Encoders & Crypto
- JWT Decoder
- UUID Generator
- Hash Generator (MD5, SHA-1, SHA-256…)
- Base64 Encoder / Decoder
- URL Encoder / Decoder
- Password Generator

### Text & Parsers
- RegEx Tester
- Lorem Ipsum Generator
- Slug Generator
- Case Converter
- Word / Character Counter
- Cron Expression Parser
- Diff Checker

### Visuals & CSS
- Color Converter (HEX / RGB / HSL)
- Gradient Generator
- QR Code Generator
- Barcode Generator
- Markdown Preview
- HTML Sandbox Preview

### Minifiers
- CSS / JS / HTML Minifier

---

## 🎨 CSS & Design Tools

Interactive visual utilities for front-end developers:

| Tool | Route | Description |
|---|---|---|
| CSS Bezier Playground | `/css-bezier` | Visual editor for `cubic-bezier()` timing functions with live preview |
| CSS Visual Guide | `/css-visual-guide` | Interactive reference for Flexbox & CSS Grid layouts |
| Flexbox Playground | `/flex` | Live builder: tweak flex properties and see results in real time |
| Color Palette Explorer | `/colors` | Browse palettes, convert colors, check WCAG contrast ratios |
| Font Explorer | `/fonts` | Preview and compare 1000+ Google Fonts with live text editing |

---

## 📋 Cheatsheet Library

Offline, searchable, categorized references for everyday developer commands:

| Cheatsheet | Route |
|---|---|
| Git | `/git-cheatsheets` |
| Bash / Shell | `/bash-cheatsheets` |
| YAML | `/yaml-cheatsheets` |
| Docker Compose | `/docker-compose-cheatsheets` |
| Kubernetes (kubectl) | `/k8s-cheatsheets` |
| Web Security | `/security-cheatsheets` |

---

## 🔨 Builder Tools

| Tool | Route | Description |
|---|---|---|
| Commit Builder | `/commit-builder` | Structured Conventional Commits generator with scope, type & body |
| README Builder | `/readme-builder` | Section-based markdown README generator with live preview |
| NPM Compare | `/npm-compare` | Side-by-side download stats, size, licenses, and metadata comparison |

---

## 🔌 GitHub Integration

OpenDevHub uses the **GitHub REST API v3** to power its exploration features:

- Search repositories with filters (stars, forks, language, topic)
- Browse trending repos by daily / weekly / monthly ranges
- Search issues with label and language filters
- Explore organizations
- View repository READMEs inline

> **Optional**: Set a `GITHUB_TOKEN` environment variable to increase API rate limits from 60 → 5000 requests/hour.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Mananwebdev160408/opendevhub.git
cd opendevhub

# 2. Install dependencies
npm install

# 3. Set up environment variables (optional)
# Create .env.local and add your GitHub token
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional — increases GitHub API rate limit from 60 to 5,000 req/hour
GITHUB_TOKEN=your_github_personal_access_token
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

## 🏗️ Project Structure

```
opendevhub/
├── data/                        # Static JSON data files
│   ├── apis.json                # Public API catalogue
│   ├── git-cheatsheets.json     # Git command reference
│   ├── http-status.json         # HTTP status codes
│   ├── licenses.json            # OSS license data
│   ├── events.json              # Developer events
│   ├── resources.json           # Curated resources
│   └── ...
├── src/
│   ├── app/                             # Next.js App Router pages
│   │   ├── page.tsx                     # Home page
│   │   ├── layout.tsx                   # Root layout
│   │   ├── tools/                       # Dev Toolbox route
│   │   ├── repos/                       # Repo Explorer route
│   │   ├── trending/                    # Trending route
│   │   ├── issues/                      # Issue Explorer route
│   │   ├── orgs/                        # Org Explorer route
│   │   ├── apis/                        # API Directory route
│   │   ├── git-cheatsheets/             # Git Cheatsheets route
│   │   ├── bash-cheatsheets/            # Bash Cheatsheets route
│   │   ├── yaml-cheatsheets/            # YAML Cheatsheets route
│   │   ├── docker-compose-cheatsheets/  # Docker Compose Cheatsheets route
│   │   ├── k8s-cheatsheets/             # Kubernetes Cheatsheets route
│   │   ├── security-cheatsheets/        # Security Cheatsheets route
│   │   ├── http-status/                 # HTTP Status route
│   │   ├── css-bezier/                  # Bezier Playground route
│   │   ├── css-visual-guide/            # CSS Visual Guide route
│   │   ├── flex/                        # Flexbox Playground route
│   │   ├── colors/                      # Color Explorer route
│   │   ├── fonts/                       # Font Explorer route
│   │   ├── commit-builder/              # Commit Builder route
│   │   ├── readme-builder/              # README Builder route
│   │   ├── npm-compare/                 # NPM Compare route
│   │   ├── glossary/                    # Dev Glossary route
│   │   └── api/                         # Next.js API routes (GitHub proxy)
│   ├── core/
│   │   └── services/
│   │       ├── github.ts                # GitHub REST API client
│   │       └── github-server.ts         # Server-side GitHub helpers
│   ├── modules/                         # Feature modules (domain-driven)
│   │   ├── home/                        # Landing page sections
│   │   ├── dev-toolbox/                 # All 25+ tool implementations
│   │   ├── repo-explorer/               # Repository search & display
│   │   ├── issue-explorer/              # Issue search & display
│   │   ├── trending/                    # Trending repositories
│   │   ├── org-explorer/               # Organization search
│   │   ├── api-directory/              # Public APIs catalogue
│   │   ├── git-cheatsheets/            # Git reference module
│   │   ├── bash-cheatsheets/           # Bash reference module
│   │   ├── yaml-cheatsheets/           # YAML reference module
│   │   ├── docker-compose-cheatsheets/ # Docker Compose reference module
│   │   ├── k8s-cheatsheets/            # Kubernetes reference module
│   │   ├── security-cheatsheets/       # Security reference module
│   │   ├── http-status/                # HTTP status codes module
│   │   ├── css-bezier/                 # Bezier curve playground module
│   │   ├── css-visual-guide/           # CSS visual guide module
│   │   ├── colors/                     # Color explorer module
│   │   ├── fonts/                      # Font explorer module
│   │   ├── commit-builder/             # Commit builder module
│   │   ├── readme-builder/             # README builder module
│   │   ├── npm-compare/                # NPM compare module
│   │   ├── glossary/                   # Dev glossary module
│   │   ├── events/                     # Events module
│   │   └── resources-hub/              # Resources & awesome lists
│   ├── components/
│   │   └── ui/                         # shadcn/ui component library
│   ├── shared/
│   │   └── components/                 # Header, Footer, shared UI
│   ├── hooks/                          # Custom React hooks
│   └── lib/                            # Utility functions
├── public/                      # Static assets
├── package.json
├── next.config.ts
├── tsconfig.json
└── vercel.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Component Library | [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Markdown | [marked](https://marked.js.org/) |
| Dates | [date-fns](https://date-fns.org/) |
| Fonts | [Geist](https://vercel.com/font) (Sans + Mono) |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) + Speed Insights |
| Deployment | [Vercel](https://vercel.com/) |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Ideas for Contribution
- Add new developer tools to the Toolbox
- Add new cheatsheet sections or categories
- Expand the data in `data/*.json` files (new APIs, events, resources)
- Improve search and filtering UX
- Add new CSS/design playground features
- Bug fixes and performance improvements

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgements

- [GitHub REST API](https://docs.github.com/en/rest) — for powering the open-source exploration features
- [shadcn/ui](https://ui.shadcn.com/) — for the accessible, composable component primitives
- [Google Fonts](https://fonts.google.com/) — powering the Font Explorer
- The open-source community — for inspiring this project

---

<p align="center">
  Built with ❤️ for developers, by developers.
  <br/>
  <strong>No Cost · No Signup · 100% Open Source</strong>
</p>
