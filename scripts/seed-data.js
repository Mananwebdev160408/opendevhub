const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. News
const news = [
  {
    id: "news-1",
    title: "Tailwind CSS v4.0 is Now Stable with All-New Rust Engine",
    description: "A major update featuring a new compile engine built in Rust, CSS-first configuration, native support for cascade layers, and automatic element discovery.",
    category: "Styling",
    date: "2026-01-22",
    source: "Tailwind CSS Blog",
    url: "https://tailwindcss.com"
  },
  {
    id: "news-2",
    title: "React 19 Enters General Availability with Server Components & Actions",
    description: "React 19 is officially ready. Key changes include Document Metadata support, Action Hooks (useActionState, useFormStatus), and the use() API for dynamic promises.",
    category: "Frameworks",
    date: "2025-12-05",
    source: "React Blog",
    url: "https://react.dev"
  },
  {
    id: "news-3",
    title: "Next.js 16 Drops Support for Node.js 18, Moving to React 19 Server Components by Default",
    description: "Next.js announces version 16, optimizing router memory usage by 40%, introducing a new local compiler runtime, and deprecating older server runtimes.",
    category: "Next.js",
    date: "2026-05-18",
    source: "Vercel News",
    url: "https://nextjs.org"
  },
  {
    id: "news-4",
    title: "TypeScript 5.8 Introduces Return Type Inference Improvements and Fast Module Compiling",
    description: "The TS team announces TS 5.8, refining module resolution checks, allowing checks on parameter property fields in constructors, and boosting incremental builds.",
    category: "Languages",
    date: "2026-03-02",
    source: "TypeScript Dev Blog",
    url: "https://typescriptlang.org"
  }
];

// 2. Trending Repositories
const trending = [
  {
    owner: "facebook",
    name: "react",
    description: "The library for web and native user interfaces.",
    stars: 221000,
    forks: 46000,
    language: "JavaScript",
    license: "MIT",
    starsToday: 142,
    lastUpdated: "2026-06-25"
  },
  {
    owner: "vercel",
    name: "next.js",
    description: "The React Framework for the Web.",
    stars: 122500,
    forks: 26500,
    language: "TypeScript",
    license: "MIT",
    starsToday: 89,
    lastUpdated: "2026-06-26"
  },
  {
    owner: "rust-lang",
    name: "rust",
    description: "Empowering everyone to build reliable and efficient software.",
    stars: 97800,
    forks: 18400,
    language: "Rust",
    license: "MIT / Apache-2.0",
    starsToday: 55,
    lastUpdated: "2026-06-24"
  },
  {
    owner: "golang",
    name: "go",
    description: "The Go programming language.",
    stars: 119800,
    forks: 17200,
    language: "Go",
    license: "BSD-3-Clause",
    starsToday: 62,
    lastUpdated: "2026-06-26"
  },
  {
    owner: "shadcn-ui",
    name: "ui",
    description: "Beautifully designed components that you can copy and paste into your apps.",
    stars: 71200,
    forks: 6400,
    language: "TypeScript",
    license: "MIT",
    starsToday: 210,
    lastUpdated: "2026-06-26"
  },
  {
    owner: "features",
    name: "awesome-lists",
    description: "A directory of lists containing collections of awesome open source assets.",
    stars: 298000,
    forks: 28400,
    language: "Markdown",
    license: "CC0-1.0",
    starsToday: 304,
    lastUpdated: "2026-06-25"
  }
];

// 3. Events
const events = [
  {
    name: "Hacktoberfest",
    timeline: "October 1 - October 31 (Annual)",
    eligibility: "Open to everyone worldwide. Beginners and experienced developers alike.",
    website: "https://hacktoberfest.com",
    description: "A month-long celebration of open-source software. Run by DigitalOcean, it encourages participation in the open-source community by submitting pull requests.",
    importantDates: [
      { event: "Registration Opens", date: "September 26" },
      { event: "Hacking Begins", date: "October 1" },
      { event: "PR Submission Deadline", date: "October 31" }
    ]
  },
  {
    name: "Google Summer of Code (GSoC)",
    timeline: "March - November (Annual Cycle)",
    eligibility: "Students and beginners to open source who are 18+ years old.",
    website: "https://summerofcode.withgoogle.com",
    description: "A global, online program focused on bringing new contributors into open source software development. Contributors work with an open source organization on a 12+ week programming project.",
    importantDates: [
      { event: "Mentoring Organizations Announced", date: "February 22" },
      { event: "Contributor Application Period", date: "March 18 - April 2" },
      { event: "Coding Period Starts", date: "June 1" }
    ]
  },
  {
    name: "Outreachy",
    timeline: "Bi-annual cycles (May to August & December to March)",
    eligibility: "People subject to systemic bias or underrepresented in tech.",
    website: "https://www.outreachy.org",
    description: "Outreachy provides paid, remote internships to people newly participating in open source. Internships are for 3 months with a $7,000 USD stipend.",
    importantDates: [
      { event: "Initial Applications Open", date: "August / January" },
      { event: "Contribution Period", date: "October / March" },
      { event: "Internships Begin", date: "December / May" }
    ]
  },
  {
    name: "LFX Mentorship",
    timeline: "Quarterly cycles (Spring, Summer, Fall)",
    eligibility: "Open globally, developers looking to contribute to Linux Foundation projects.",
    website: "https://mentorship.lfx.linuxfoundation.org",
    description: "A platform created by the Linux Foundation to help open-source projects find, align, and onboard developers to advance community projects.",
    importantDates: [
      { event: "Spring Application", date: "January - February" },
      { event: "Summer Application", date: "May - June" },
      { event: "Fall Application", date: "August - September" }
    ]
  }
];

// 4. Organizations
const organizations = [
  {
    login: "vercel",
    name: "Vercel",
    description: "Vercel provides the developer experience and infrastructure to build, deploy, and scale the web.",
    stars: 185000,
    popularProjects: ["next.js", "hyper", "swr", "turbopack"],
    languages: ["TypeScript", "Rust", "JavaScript", "Go"],
    website: "https://vercel.com",
    githubLink: "https://github.com/vercel",
    category: "Frontend & Serverless"
  },
  {
    login: "supabase",
    name: "Supabase",
    description: "Supabase is an open source Firebase alternative. It provides a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.",
    stars: 94000,
    popularProjects: ["supabase", "postgrest-js", "realtime", "auth-helpers"],
    languages: ["TypeScript", "Go", "PostgreSQL", "Rust"],
    website: "https://supabase.com",
    githubLink: "https://github.com/supabase",
    category: "Backend & Database"
  },
  {
    login: "docker",
    name: "Docker",
    description: "Docker is a platform designed to help developers build, share, and run modern applications using container technology.",
    stars: 62000,
    popularProjects: ["cli", "compose", "buildx"],
    languages: ["Go", "Shell", "TypeScript"],
    website: "https://docker.com",
    githubLink: "https://github.com/docker",
    category: "DevOps & Infrastructure"
  },
  {
    login: "facebook",
    name: "Meta Open Source",
    description: "Meta's open-source projects, ranging from React to PyTorch, power some of the world's largest apps.",
    stars: 480000,
    popularProjects: ["react", "react-native", "pytorch", "docusaurus"],
    languages: ["C++", "Python", "JavaScript", "TypeScript"],
    website: "https://opensource.fb.com",
    githubLink: "https://github.com/facebook",
    category: "Big Tech / Frameworks"
  }
];

// 5. API Directory
const apis = [
  {
    name: "Open-Meteo API",
    description: "Free weather forecast API for non-commercial use. Offers global hourly and daily forecasts, historical data, and atmospheric variables.",
    category: "Weather",
    authentication: "None (Free for under 10k req/day)",
    rateLimit: "10,000 requests/day",
    freeTier: "Yes",
    documentation: "https://open-meteo.com/en/docs",
    website: "https://open-meteo.com"
  },
  {
    name: "The Movie Database (TMDB) API",
    description: "Access metadata about millions of movies, TV shows, actors, and images. Highly popular for developer portfolio projects.",
    category: "Movies & TV",
    authentication: "API Key (OAuth2)",
    rateLimit: "No strict limits, but requires fair usage",
    freeTier: "Yes (For non-commercial use)",
    documentation: "https://developer.themoviedb.org/docs",
    website: "https://www.themoviedb.org"
  },
  {
    name: "CoinGecko API",
    description: "Get cryptocurrency prices, trading volumes, market charts, and exchange details instantly from the largest independent crypto data aggregator.",
    category: "Finance",
    authentication: "None (Public Demo tier) / API Key",
    rateLimit: "30 requests/minute",
    freeTier: "Yes",
    documentation: "https://www.coingecko.com/en/api/documentation",
    website: "https://www.coingecko.com"
  },
  {
    name: "JSONPlaceholder",
    description: "Free online REST API that you can use when you need some mock data. Perfect for tutorials, testing prototypes, and sharing code examples.",
    category: "Developer Tools",
    authentication: "None",
    rateLimit: "Unlimited",
    freeTier: "Yes (Always free)",
    documentation: "https://jsonplaceholder.typicode.com",
    website: "https://jsonplaceholder.typicode.com"
  },
  {
    name: "PokeAPI",
    description: "All the Pokémon data you'll ever need in one place, easily accessible through a modern RESTful API.",
    category: "Games & Entertainment",
    authentication: "None",
    rateLimit: "100 requests per IP per minute",
    freeTier: "Yes",
    documentation: "https://pokeapi.co/docs/v2",
    website: "https://pokeapi.co"
  }
];

// 6. Resources
const resources = [
  {
    title: "React Official Documentation",
    description: "The absolute best place to learn React, covering hooks, states, rendering lifecycles, and advanced server components.",
    category: "React",
    officialLink: "https://react.dev",
    difficulty: "Beginner to Advanced"
  },
  {
    title: "TypeScript Handbook",
    description: "The official guide to learning TypeScript, covering typing systems, generics, type assertion, structural types, and narrowing.",
    category: "TypeScript",
    officialLink: "https://www.typescriptlang.org/docs/handbook/intro.html",
    difficulty: "Intermediate"
  },
  {
    title: "System Design Primer",
    description: "An incredible open-source GitHub repository detailing scalability, server loads, caching, message queues, CDNs, and database partitioning.",
    category: "System Design",
    officialLink: "https://github.com/donnemartin/system-design-primer",
    difficulty: "Advanced"
  },
  {
    title: "Next.js Learn Course",
    description: "Interactive tutorial covering router layouts, fetching methods, SQL database connectivity, server components, and styling configurations.",
    category: "Next.js",
    officialLink: "https://nextjs.org/learn",
    difficulty: "Beginner"
  },
  {
    title: "Linux Command Line Journey",
    description: "A complete walkthrough of shell operations, navigation, text manipulation, permissions, scripting, and processes.",
    category: "Linux",
    officialLink: "https://linuxjourney.com",
    difficulty: "Beginner to Intermediate"
  }
];

// 7. Awesome Lists
const awesomeLists = [
  {
    name: "Awesome React",
    description: "A collection of awesome things regarding the React ecosystem, including state management, animation, forms, and tools.",
    stars: 64000,
    owner: "enaqx",
    repo: "awesome-react",
    githubLink: "https://github.com/enaqx/awesome-react"
  },
  {
    name: "Awesome Selfhosted",
    description: "A list of Free Software network services and web applications which can be hosted on your own servers.",
    stars: 185000,
    owner: "awesome-selfhosted",
    repo: "awesome-selfhosted",
    githubLink: "https://github.com/awesome-selfhosted/awesome-selfhosted"
  },
  {
    name: "Awesome Python",
    description: "A curated list of awesome Python frameworks, libraries, software, and resources.",
    stars: 205000,
    owner: "vinta",
    repo: "awesome-python",
    githubLink: "https://github.com/vinta/awesome-python"
  },
  {
    name: "Awesome Rust",
    description: "A curated list of Rust code, libraries, developer frameworks, utilities, and resources.",
    stars: 45000,
    owner: "rust-unofficial",
    repo: "awesome-rust",
    githubLink: "https://github.com/rust-unofficial/awesome-rust"
  }
];

// 8. Git Cheatsheets
const gitCheatsheets = [
  {
    category: "Git Basics",
    commands: [
      {
        cmd: "git init",
        description: "Initialize a local Git repository in the current directory.",
        syntax: "git init [directory-name]",
        example: "git init my-awesome-app",
        mistake: "Running git init in a folder that is already inside a Git repository, which creates nested .git files."
      },
      {
        cmd: "git clone",
        description: "Clone a remote repository to your local system.",
        syntax: "git clone <url>",
        example: "git clone https://github.com/vercel/next.js.git",
        mistake: "Forgetting to cd into the newly cloned directory after cloning, and running commands in the parent folder."
      },
      {
        cmd: "git commit",
        description: "Record staged snapshots in version history.",
        syntax: "git commit -m \"<message>\"",
        example: "git commit -m \"feat: implement client-side regex tester\"",
        mistake: "Writing generic commit messages like 'fix' or 'update' which make history hard to search."
      }
    ]
  },
  {
    category: "Branching & Merging",
    commands: [
      {
        cmd: "git checkout -b",
        description: "Create a new branch and switch to it immediately.",
        syntax: "git checkout -b <branch-name>",
        example: "git checkout -b feat/devtools",
        mistake: "Creating a branch from a dirty worktree (uncommitted modifications), which pulls local changes into the new branch."
      },
      {
        cmd: "git merge",
        description: "Merge target branch history into the active head branch.",
        syntax: "git merge <branch>",
        example: "git merge main",
        mistake: "Merging without running git pull first, leading to conflicts on outdated commits."
      }
    ]
  },
  {
    category: "Advanced / Recovery",
    commands: [
      {
        cmd: "git reset --hard",
        description: "Discard all uncommitted changes and revert to a specific commit. Warning: destructive operation!",
        syntax: "git reset --hard <commit-hash>",
        example: "git reset --hard HEAD~1",
        mistake: "Executing reset --hard when you have valuable uncommitted modifications; they will be permanently lost."
      },
      {
        cmd: "git reflog",
        description: "Show a record of all commits, branch switches, and resets. Best tool to recover 'lost' commits.",
        syntax: "git reflog",
        example: "git reflog",
        mistake: "Assuming deleted branches or hard resets are unrecoverable without checking reflog first."
      }
    ]
  }
];

// 9. HTTP Status Codes
const httpStatuses = [
  { code: 200, name: "OK", category: "Success", meaning: "The request succeeded. Client receives requested body payload." },
  { code: 201, name: "Created", category: "Success", meaning: "The request succeeded and a new resource was created as a result." },
  { code: 204, name: "No Content", category: "Success", meaning: "There is no content to send for this request, but headers are valid." },
  { code: 301, name: "Moved Permanently", category: "Redirection", meaning: "The URL of the requested resource has been changed permanently. New URL given in response." },
  { code: 302, name: "Found", category: "Redirection", meaning: "The resource is temporarily located at a different URL. Clients should reuse the original URL." },
  { code: 400, name: "Bad Request", category: "Client Error", meaning: "The server cannot process the request due to client error (e.g., malformed syntax, size limit)." },
  { code: 401, name: "Unauthorized", category: "Client Error", meaning: "Authentication is required and has failed or has not yet been provided." },
  { code: 403, name: "Forbidden", category: "Client Error", meaning: "Client does not have access rights to the content; unlike 401, identity is known to the server." },
  { code: 404, name: "Not Found", category: "Client Error", meaning: "The server cannot find the requested resource. URL is not recognized." },
  { code: 429, name: "Too Many Requests", category: "Client Error", meaning: "The user has sent too many requests in a given amount of time (rate limiting)." },
  { code: 500, name: "Internal Server Error", category: "Server Error", meaning: "The server encountered an unexpected condition that prevented it from fulfilling the request." },
  { code: 502, name: "Bad Gateway", category: "Server Error", meaning: "The server, while acting as a gateway or proxy, received an invalid response from the upstream server." },
  { code: 503, name: "Service Unavailable", category: "Server Error", meaning: "The server is not ready to handle the request. Common causes are server maintenance or overload." }
];

// 10. Licenses
const licenses = [
  {
    slug: "mit",
    name: "MIT License",
    description: "A short and simple permissive license with conditions only requiring preservation of copyright and license notices.",
    permissions: ["Commercial use", "Modification", "Distribution", "Private use"],
    conditions: ["License and copyright notice must be included"],
    limitations: ["Liability", "Warranty"],
    example: "React, Vue, jQuery, and Express are licensed under MIT."
  },
  {
    slug: "apache-2.0",
    name: "Apache License 2.0",
    description: "A permissive license whose main conditions require preservation of copyright and license notices. Contributors provide an express grant of patent rights.",
    permissions: ["Commercial use", "Modification", "Distribution", "Patent use", "Private use"],
    conditions: ["License and copyright notice", "State changes", "Include NOTICE file"],
    limitations: ["Liability", "Trademark use", "Warranty"],
    example: "Kubernetes, Docker, and TensorFlow are licensed under Apache 2.0."
  },
  {
    slug: "gpl-3.0",
    name: "GNU GPLv3",
    description: "A copyleft license that requires source code of derivative works to be made available under the same license. Patent grants are also provided.",
    permissions: ["Commercial use", "Modification", "Distribution", "Patent use", "Private use"],
    conditions: ["Disclose source", "License and copyright notice", "State changes", "Use identical license (GPLv3)"],
    limitations: ["Liability", "Warranty"],
    example: "Git, Linux, and WordPress are licensed under GPL."
  }
];

// 11. Topics
const topics = [
  { slug: "react", name: "React", description: "Component-based user interface engineering." },
  { slug: "nextjs", name: "Next.js", description: "Production-ready fullstack web framework." },
  { slug: "typescript", name: "TypeScript", description: "Strict syntactical superset of JavaScript adding optional static typing." },
  { slug: "rust", name: "Rust", description: "Safe, concurrent, high-performance systems programming language." },
  { slug: "go", name: "Go", description: "Simple, reliable, compile-speed language developed by Google." },
  { slug: "python", name: "Python", description: "Highly readable general-purpose language, heavily used in AI/ML." },
  { slug: "machine-learning", name: "Machine Learning", description: "Algorithms and models for data predictions and analytics." },
  { slug: "gamedev", name: "Game Development", description: "Creating interactive graphical simulations and games." }
];

fs.writeFileSync(path.join(dataDir, 'news.json'), JSON.stringify(news, null, 2));
fs.writeFileSync(path.join(dataDir, 'trending-repositories.json'), JSON.stringify(trending, null, 2));
fs.writeFileSync(path.join(dataDir, 'events.json'), JSON.stringify(events, null, 2));
fs.writeFileSync(path.join(dataDir, 'organizations.json'), JSON.stringify(organizations, null, 2));
fs.writeFileSync(path.join(dataDir, 'apis.json'), JSON.stringify(apis, null, 2));
fs.writeFileSync(path.join(dataDir, 'resources.json'), JSON.stringify(resources, null, 2));
fs.writeFileSync(path.join(dataDir, 'awesome-lists.json'), JSON.stringify(awesomeLists, null, 2));
fs.writeFileSync(path.join(dataDir, 'git-cheatsheets.json'), JSON.stringify(gitCheatsheets, null, 2));
fs.writeFileSync(path.join(dataDir, 'http-status.json'), JSON.stringify(httpStatuses, null, 2));
fs.writeFileSync(path.join(dataDir, 'licenses.json'), JSON.stringify(licenses, null, 2));
fs.writeFileSync(path.join(dataDir, 'topics.json'), JSON.stringify(topics, null, 2));

console.log("All static mock datasets seeded successfully!");
