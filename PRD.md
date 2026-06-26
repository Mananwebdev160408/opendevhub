# OpenDev Hub

## Product Requirements Document (PRD)

**Version:** 1.0

**Author:** Manan

**Status:** Planning

---

# 1. Vision

OpenDev Hub is a developer-focused platform that makes discovering, learning, and contributing to open-source projects easier.

Instead of being another AI-powered tool, OpenDev Hub focuses on solving everyday problems developers face through useful utilities, curated resources, GitHub exploration, and contribution tools.

The platform should become a place where developers visit regularly—not just once.

---

# 2. Goals

## Primary Goals

* Help developers discover open-source projects.
* Help beginners start contributing.
* Provide useful developer utilities.
* Build a large collection of SEO-friendly pages.
* Generate recurring traffic.
* Monetize through advertisements.
* Require zero authentication.

---

## Non Goals

The platform will NOT include:

* User authentication
* User accounts
* AI features
* Chatbots
* Paid APIs
* Premium subscriptions
* Social networking
* User generated posts

---

# 3. Target Audience

### Primary

* Beginner Open Source Contributors
* College Students
* Self-Taught Developers
* Web Developers

### Secondary

* Professional Developers
* Open Source Maintainers
* Recruiters exploring repositories

---

# 4. Tech Stack

## Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Shadcn UI
* Framer Motion

---

## Backend

Next.js Route Handlers

No separate backend server.

---

## Database

Initially:

No database required.



---

## Hosting

Vercel Free Plan

---

## APIs

* GitHub REST API
* GitHub GraphQL API (optional)
* Static JSON datasets

---

# 5. Core Features

---

# Module 1 — Repository Explorer

Purpose:

Discover repositories easily.

Features

* Search repositories
* Filter by language
* Filter by stars
* Filter by license
* Filter by topics
* Sort by stars
* Sort by forks
* Sort by recently updated
* View repository details
* Open repository on GitHub

Repository Card

Shows

* Repository Name
* Owner
* Description
* Stars
* Forks
* Language
* License
* Last Updated
* Open Issues

---

# Module 2 — Good First Issues

Purpose

Help beginners contribute.

Features

* Search issues
* Filter by language
* Filter by labels
* Filter by repository
* Difficulty tags
* Recently created
* Recently updated

Issue Card

Displays

* Repository
* Issue title
* Labels
* Number of comments
* Last updated
* Direct GitHub link

---

# Module 3 — Trending Repositories

Daily

Weekly

Monthly

Trending by

* JavaScript
* TypeScript
* React
* Next.js
* Node
* Python
* Go
* Rust
* Java
* C++
* C#
* PHP

Sort options

* Stars
* Forks
* Activity

---

# Module 4 — Open Source Organizations

Search organizations.

Example categories

Frontend

Backend

AI

DevOps

Cloud

Security

Mobile

Game Development

Organization Page

Contains

* Description
* Repositories
* Stars
* Popular Projects
* Languages
* Website
* GitHub Link

---

# Module 5 — Developer Toolbox

One page.

Many tools.

## Utilities

JSON Formatter

JSON Validator

JWT Decoder

UUID Generator

Hash Generator

Base64 Encode

Base64 Decode

URL Encode

URL Decode

Regex Tester

Timestamp Converter

Unix Timestamp

Color Converter

HEX ↔ RGB

HEX ↔ HSL

Gradient Generator

Lorem Ipsum

Slug Generator

Case Converter

Password Generator

Markdown Preview

HTML Preview

Diff Checker

Cron Parser

Character Counter

Word Counter

Line Counter

QR Generator

Barcode Generator

CSS Minifier

JS Minifier

HTML Minifier

Prettier Formatter

CSV Viewer

YAML Viewer

XML Viewer

---

# Module 6 — Git Cheat Sheets

Categories

Git Basics

Branching

Merge

Rebase

Reset

Cherry Pick

Stash

Tag

Remote

Examples

Each command includes

Description

Syntax

Example

Common mistakes

---

# Module 7 — HTTP Status Codes

Search by

Status code

Meaning

Examples

Categories

100

200

300

400

500

---

# Module 8 — API Directory

Search APIs.

Categories

Authentication

Weather

Finance

Movies

Music

Games

Images

AI

Maps

Education

Developer Tools

Each API contains

Name

Description

Authentication

Rate Limit

Free Tier

Documentation

Website

---

# Module 9 — Resources Hub

Curated learning resources.

Categories

React

Next.js

TypeScript

JavaScript

Node

Express

Docker

Kubernetes

GraphQL

PostgreSQL

MongoDB

Linux

Git

Tailwind

System Design

Each resource

Title

Description

Official Link

Difficulty

---

# Module 10 — Open Source Events

Show upcoming events.

Examples

Hacktoberfest

Google Summer of Code

Outreachy

MLH

Open Source Hackathons

Each event contains

Timeline

Eligibility

Website

Important Dates

---

# Module 11 — License Explorer

Search licenses.

MIT

GPL

Apache

BSD

ISC

Mozilla

Each page

Permissions

Conditions

Limitations

Example Usage

---

# Module 12 — GitHub Topic Explorer

Browse repositories by topics.

Examples

React

Next.js

Tailwind

TypeScript

Rust

Go

Python

Machine Learning

Game Dev

---

# Module 13 — Awesome Lists Explorer

Search Awesome GitHub lists.

Examples

Awesome React

Awesome Node

Awesome CSS

Awesome DevOps

Awesome Docker

Awesome Rust

---

# Module 14 — Developer News

Latest

Releases

Framework updates

Major GitHub announcements

Curated links only.

---

# 6. Navigation

Home

Repositories

Issues

Organizations

Trending

Resources

Developer Tools

Git Cheatsheets

Events

API Directory

About

---

# 7. Home Page

Sections

Hero

Search Bar

Trending Repositories

Latest Good First Issues

Popular Developer Tools

Featured Resources

Upcoming Events

Latest News

Footer

---

# 8. Search

Global search.

Search

Repositories

Organizations

Issues

Tools

Resources

Licenses

Events

---

# 9. SEO Strategy

Every major item gets its own page.

Examples

/tools/json-formatter

/tools/password-generator

/repos/react

/issues/javascript

/license/mit

/resources/react

/apis/weather

/events/hacktoberfest

Benefits

Thousands of indexable pages.

Fast loading.

High Google ranking potential.

---

# 10. Performance

Use

Server Components

Static Rendering

Incremental Static Regeneration

Caching

Lazy Loading

Image Optimization

Edge Runtime where appropriate

---

# 11. Monetization

Google AdSense

Ads should appear

Home

Repository pages

Resource pages

Tool pages

Blog pages

No intrusive ads.

---

# 12. Future Features

Bookmarks

Dark Mode

PWA

Weekly Newsletter

Email Alerts

Contributor Rankings

GitHub OAuth

Community Contributions

Custom Collections

Browser Extension

---

# 13. Folder Structure

OpenDev Hub uses a domain-driven, module-based folder structure designed to strictly adhere to the SOLID design principles:

### SOLID Architecture Principles
1. **Single Responsibility Principle (SRP)**:
   * Next.js `src/app/` folder serves strictly as the routing and entry-point layer. It contains no business logic or visual structures; it delegates layout and page logic to specific domain modules.
   * Inside each module, directories are split by their responsibility (e.g. data fetching services are isolated from UI components, which are isolated from React hooks).
2. **Open-Closed Principle (OCP)**:
   * The structure is open for extension but closed for modification. Adding a new module or feature is as simple as adding a new folder under `src/modules/` without modifying other features.
3. **Liskov Substitution Principle (LSP)**:
   * Shared interfaces, abstractions, and generic types are housed under `src/shared/types/` and `src/core/`, ensuring swapability and contract compatibility across components and services.
4. **Interface Segregation Principle (ISP)**:
   * Every module exposes a clean public interface via a barrel file (`index.ts`). Routes (`app/`) or other components can only import from this public interface, preventing the leakage of internal helper details and reducing bloat.
5. **Dependency Inversion Principle (DIP)**:
   * High-level routing and modules depend on abstract service layers and types rather than directly on concrete configurations.
   * Core infrastructural modules (like HTTP clients and configuration parsers) reside in `src/core/`, decoupled from domain/feature-specific logic.

### Folder Layout Diagram
```text
src/
├── app/                  # Next.js App Router (Routing & Entrypoints only)
│   ├── layout.tsx        # Global layout & HTML shell
│   ├── page.tsx          # Home page (delegates to modules/home)
│   ├── repos/            # /repos route -> delegates to modules/repo-explorer
│   ├── issues/           # /issues route -> delegates to modules/issue-explorer
│   ├── tools/            # /tools route -> delegates to modules/dev-toolbox
│   └── ...
├── modules/              # Domain-driven features/modules (SOLID Boundaries)
│   ├── repo-explorer/    # Module 1: Repository Explorer
│   │   ├── components/   # UI elements specific to Repository Explorer
│   │   ├── hooks/        # React hooks (e.g., useRepoSearch)
│   │   ├── services/     # API request logic (GitHub API, etc.)
│   │   ├── types/        # TypeScript interfaces unique to Repository Explorer
│   │   ├── utils/        # Small domain-specific utility helpers
│   │   └── index.ts      # Module public interface/barrel file (ISP/Encapsulation)
│   ├── issue-explorer/   # Module 2: Good First Issues
│   │   └── ...
│   ├── trending/         # Module 3: Trending Repositories
│   │   └── ...
│   ├── org-explorer/     # Module 4: Open Source Organizations
│   │   └── ...
│   ├── dev-toolbox/      # Module 5: Developer Toolbox
│   │   └── ...
│   └── ...
├── shared/               # Reusable UI & cross-cutting components (DRY/SRP)
│   ├── components/       # Primitive UI elements (e.g., design system, shadcn components)
│   ├── hooks/            # Global custom hooks (e.g., useDebounce, useTheme)
│   ├── utils/            # General helpers (e.g., class merge helpers like `cn`)
│   └── types/            # Shared cross-domain TypeScript types
└── core/                 # App-wide configuration & infrastructure (DIP)
    ├── config/           # App configuration/env variables validation
    └── services/         # Core clients (e.g., API clients, telemetry/logging)
```

---

# 14. Success Metrics

Monthly Users

Returning Users

Average Session Duration

Pages Per Session

Search Traffic

Tool Usage

Repository Clicks

Issue Clicks

Ad Revenue

---

# 15. Development Phases

## Phase 1

Project Setup

Landing Page

Navigation

Theme

SEO

Deployment

---

## Phase 2

Repository Explorer

Trending

Issue Explorer

Organization Explorer

---

## Phase 3

Developer Toolbox

Git Cheatsheets

HTTP Status Pages

License Explorer

---

## Phase 4

API Directory

Resources Hub

Events

Awesome Lists

---

## Phase 5

Developer News

Performance Optimization

Analytics

Advertisements

---

# Final Vision

OpenDev Hub should become one of the best free developer resource platforms by combining open-source discovery, developer utilities, curated learning resources, and practical references into a single fast, SEO-friendly website. Every page should provide immediate value without requiring an account, allowing the platform to grow organically through search traffic while remaining inexpensive to host on the Vercel free tier.


# 16. Data Synchronization Strategy

## Purpose

Some modules (such as Developer News, Trending Repositories, Open Source Events, and API Directory) require periodically updated data from external sources. Running a dedicated backend server 24/7 would increase infrastructure costs and is unnecessary for this project.

To keep hosting costs at zero while ensuring data remains reasonably up to date, OpenDev Hub will use **GitHub Actions** as a scheduled data synchronization service.

---

## Architecture

```text
GitHub Action (Runs Every Hour)
            │
            ▼
Fetch External APIs / RSS Feeds
            │
            ▼
Process & Clean Data
            │
            ▼
Generate Static JSON Files
            │
            ▼
Commit Updated Files to Repository
            │
            ▼
GitHub Push Trigger
            │
            ▼
Vercel Automatically Redeploys
            │
            ▼
Users Receive Updated Data
```

---

## Workflow

1. A GitHub Action is scheduled to run at a fixed interval (e.g., every hour).
2. The action fetches data from public APIs, RSS feeds, or other official sources.
3. The fetched data is validated, cleaned, and transformed into a consistent structure.
4. Static JSON files are generated inside the project's `/data` directory.
5. If the generated data has changed, the GitHub Action commits the updated files back to the repository.
6. The new commit automatically triggers a Vercel deployment.
7. The deployed application serves the latest data directly from static JSON files.

---

## Example Directory Structure

```text
data/
├── news.json
├── trending-repositories.json
├── events.json
├── organizations.json
├── apis.json
└── resources.json
```

---

## Advantages

* No dedicated backend server required.
* No continuously running processes.
* Works entirely within GitHub Actions and Vercel free tiers.
* Extremely fast page loads because all data is served as static files.
* Simple deployment pipeline.
* Reduced API requests during user visits.
* Lower chance of hitting third-party API rate limits.
* Easy to debug by inspecting generated JSON files.

---

## Suitable Modules

This synchronization strategy is ideal for:

* Developer News
* Trending Repositories
* Open Source Events
* API Directory
* Resource Directory
* Awesome Lists
* Open Source Organizations

Modules that require real-time user interaction (if introduced in the future) should use dedicated API routes or a database instead.

---

## Update Frequency

| Module                | Suggested Interval |
| --------------------- | ------------------ |
| Developer News        | Every 1 hour       |
| Trending Repositories | Every 6 hours      |
| Open Source Events    | Every 24 hours     |
| API Directory         | Every 24 hours     |
| Resources             | Every 24 hours     |
| Organizations         | Every 24 hours     |

---

## Failure Handling

* If an external API is unavailable, retain the previously generated JSON file.
* Log the error in the GitHub Actions workflow.
* Skip committing changes if no new data is available.
* Retry automatically during the next scheduled execution.

---

## Future Enhancements

As OpenDev Hub grows, this architecture can evolve to:

* Store synchronized data in PostgreSQL.
* Use Incremental Static Regeneration (ISR) for selected pages.
* Add on-demand revalidation for specific modules.
* Introduce webhooks where supported by external services.
* Use Vercel Cron Jobs if more frequent updates become necessary.

---

## Decision

For Version 1.0, GitHub Actions will act as the project's scheduled data synchronization layer. This approach provides a reliable, cost-effective, and maintenance-friendly solution that aligns with the project's goal of remaining fully deployable on the Vercel Free Plan without requiring a dedicated backend server.


# 17. Free-Tier Infrastructure & Architecture Guardrails

## Purpose
To ensure 100% compatibility with the Vercel, GitHub, and Next.js free-tier constraints while scaling to thousands of indexable, SEO-friendly pages. This section provides strict directives for the AI implementation agent to avoid build timeouts, deployment caps, and API rate-limiting blocks.

---

## Technical Constraints & Module-Specific Fixes

| Infrastructure Vector | Free-Tier Limit | Platform Risk | Targeted Module Fixes |
| :--- | :--- | :--- | :--- |
| **Vercel Build Duration** | Max 45 minutes per build | Build timeout when pre-rendering thousands of dynamic pages. | **On-Demand ISR:** Use empty `generateStaticParams` arrays to defer compilation to runtime. <br>• *Applies to:* **Module 1** (Repository Explorer), **Module 2** (Good First Issues), **Module 4** (Organizations). |
| **Vercel Daily Deployments** | Max 100 builds per day | Automated hourly cron pushes waste build limits when no new data exists. | **Smart Git Diffs:** Workflow logic blocks upstream pushes if JSON changes are absent. <br>• *Applies to:* **Module 3** (Trending), **Module 10** (Events), **Module 14** (News). |
| **GitHub API Access** | 60 requests/hr unauthenticated | Application crashes on direct user search proxies. | **Dual Pipeline:** Server-side sync via `GH_TOKEN` (5,000 req/hr) + direct client-side proxy. <br>• *Applies to:* **Module 1** (Repository Explorer), **Module 2** (Good First Issues). |
| **Serverless Function Window** | 10s default execution limit | Network latency timeouts on third-party API fetches. | **Static JSON Reads:** Read from local disk `/data/*.json` rather than making runtime network calls. <br>• *Applies to:* **Module 8** (API Directory), **Module 9** (Resources), **Module 13** (Awesome Lists). |

---

## Concrete Implementation Patterns for AI Agents

The implementation agent must strictly adhere to the following three structural design patterns across all targeted modules:

### Pattern A: Dynamic Catch-All with Fallback (Modules 1, 2, & 4)
For deeply nested resource routes (such as `/repos/[owner]/[name]` or `/issues/[id]`), do **not** generate page variants at build time. Implement dynamic runtime caching via Incremental Static Regeneration (ISR).

```typescript
// app/repos/[owner]/[name]/page.tsx
import { notFound } from 'next/navigation';

export const revalidate = 86400; // Cache the generated page at the Edge for 24 hours

// CRITICAL: Force an empty array to ensure zero compilation overhead during `next build`
export async function generateStaticParams() {
  return [];
}

interface RepoPageProps {
  params: Promise<{ owner: string; name: string }>;
}

export default async function RepoPage({ params }: RepoPageProps) {
  const { owner, name } = await params;
  
  try {
    // Fetch via GitHub authenticated API token inside Server Component
    const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 86400 }
    });

    if (res.status === 404) notFound();
    const repo = await res.json();

    return (
      <main className="p-6 text-slate-100 bg-black">
        <h1 className="text-2xl font-mono font-bold">{repo.full_name}</h1>
        <p className="text-muted-foreground mt-2">{repo.description}</p>
      </main>
    );
  } catch (error) {
    notFound();
  }
}
Pattern B: Optimized Change-Aware Sync Workflow (Modules 3, 10, & 14)
The scheduled synchronization GitHub action must include verification gates to check for file changes before pushing to main and triggering a Vercel deployment.

YAML
# .github/workflows/data-sync.yml
name: Scheduled Data Sync

on:
  schedule:
    - cron: '0 * * * *' # Every hour
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm ci

      - name: Run Data Scraper Engine
        run: node scripts/sync-data.js
        env:
          GITHUB_TOKEN: ${{ secrets.SYNC_GITHUB_TOKEN }}

      - name: Smart Commit & Conditional Push
        run: |
          git config --local user.email "agent-sync@opendevhub.local"
          git config --local user.name "OpenDev Sync Bot"
          git add data/
          
          # Check if changes exist in the data/ directory to prevent redundant Vercel deployments
          if git diff --staged --quiet; then
            echo "No data adjustments found. Skipping push execution."
          else
            git commit -m "chore(data): automated static dataset ingestion [skip ci]"
            git push origin main
          fi
Pattern C: Zero-Compute Client-Side Operations (Modules 5, 8, & 13)
Module 5 (Developer Toolbox): All tools must run completely in-browser via pure client state or Web Workers. Server-side computation or Server Actions are strictly prohibited.

Modules 8 & 13 (Directories): Search functionality must load the static target JSON file generated by the automation pipeline directly onto the client side, running in-memory filtering (Fuse.js or basic array filtering) locally to avoid hitting Vercel serverless function timeouts.

TypeScript
// components/tools/api-explorer.tsx
'use client';

import { useState, useTransition } from 'react';
import apiDirectoryData from '@/data/apis.json'; // Sourced from static generation pipeline

export function APIExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  // Instant filtering executes locally within the client memory stack, saving compute costs
  const filteredAPIs = apiDirectoryData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Filter APIs instantly..."
        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-slate-100"
        onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
      />
      {isPending && <p className="text-xs text-zinc-500">Filtering database...</p>}
      <div className="grid gap-4">
        {filteredAPIs.slice(0, 20).map((api) => (
          <div key={api.name} className="p-4 rounded-lg border border-zinc-800 bg-zinc-950">
            <h3 className="font-semibold text-purple-400 font-mono">{api.name}</h3>
            <p className="text-xs text-zinc-400 mt-1">{api.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
Strict Compliance Requirements for the AI Agent
Static Pre-render Prohibition: Do not invoke generateStaticParams for items sourced from dynamic developer ecosystems (e.g., individual GitHub issues or dynamic repository addresses). Keep these paths un-built until user request.

Local Client Fallbacks: Keep the main Next.js build clean of third-party network fetches. If an external layout endpoint or feed times out, fall back cleanly to your static local dataset file located under /data.

No Database Imports: Ensure modules 1 through 14 match structural schemas using static .json configuration endpoints inside the code repository. Do not connect external SQL/NoSQL parameters until Phase 5 development thresholds are explicitly hit.

---

# 18. UI & Aesthetics - Maximalist Design Guidelines

OpenDev Hub will adopt a **Maximalist UI** style. Unlike minimalist, blank-canvas developer portals, a maximalist design prioritizes high visual energy, high information density, expressive typography, and engaging micro-interactions to create a memorable, premium, and active user experience.

### Key Characteristics of the Maximalist UI
* **High Information Density**: Screen real estate is fully optimized with cards, badges, statistics, activity trackers, and dense lists. No empty space is wasted; everything is rich with valuable developer data.
* **Expressive Typography**: Oversized, bold headings utilizing monospaced or punchy sans-serif web fonts (e.g., Space Grotesk, Syne, or Outfit) mixed with compact, high-contrast monospace text for technical data.
* **Structured Layering & Neo-Brutalism Details**:
  * Heavy, crisp borders (e.g., solid 2px or 3px border-zinc-800 or colored borders) with zero-blur offset hard shadows (often referred to as Neo-Brutalist shadows) to give elements a tangible, tactile feel.
  * Overlapping cards, badges, and tabs that stack dynamically.
* **Rich Micro-Interactions & Motion**:
  * Smooth, snappy Framer Motion animations for list loading, tool transitions, and hover states.
  * Hover effects that shift border colors, offset shadows, rotate tiny details (like gears, chevron icons, or external links), or highlight cells.
  * Continuous subtle motion cues, such as ticking counts or minor layout changes on filter toggles.
* **Color Scheme**:
  * **Nova-Neutral Maximalist Color Palette**: The system will leverage a highly stylized, high-contrast dark theme canvas with rich layout panels and extremely vibrant neon accents to guide the developer's eye:
    ```css
    /* Custom Nova-Neutral Maximalist Color Palette */
    :root {
      --background: #000000;         /* Pure Canvas Black */
      --card: #111113;               /* Bento Grid Surface Panel */
      --foreground: #fafafa;         /* Stark White High-Contrast Text */
      --muted-foreground: #a1a1aa;   /* Slate Gray Secondary Text */
      --border: #262626;             /* Crisp Industrial Grid Border */
      --input: #262626;              /* Interactive Element Outline */
      --primary: #a855f7;            /* Saturated Neon Purple Accent */
      --accent: #2dd4bf;             /* Saturated Neon Teal Accent */
    }
    ```