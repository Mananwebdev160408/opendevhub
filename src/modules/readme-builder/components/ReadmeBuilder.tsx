"use client";

import * as React from "react";
import {
  Copy,
  Check,
  Sparkles,
  Terminal,
  Info,
  Globe,
  Mail,
  Eye,
  Code,
  Download,
  RotateCcw,
  User,
  BarChart2,
  Heart,
  Plus,
  Trash2,
  Search,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { marked } from "marked";

interface TechBadge {
  name: string;
  logo: string;
  color: string;
  textColor?: string;
  skillIconKey?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 border-2 text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
        copied
          ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_#000]"
          : "bg-black border-foreground text-foreground hover:bg-zinc-900 shadow-[2px_2px_0px_0px_#ffffff]"
      }`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      <span>{copied ? "COPIED" : "COPY MARKDOWN"}</span>
    </button>
  );
}

export function ReadmeBuilder() {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = React.useState<
    "intro" | "about" | "skills" | "stats" | "socials" | "support" | "layout"
  >("intro");
  const [previewMode, setPreviewMode] = React.useState<"preview" | "code">(
    "preview",
  );
  const [previewTheme, setPreviewTheme] = React.useState<"dark" | "light">(
    "dark",
  );
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // State Declarations
  // ── 1. GREETING & INTRO ──
  const [name, setName] = React.useState("Jane Dev");
  const [greetingTitle, setGreetingTitle] = React.useState(
    "Hi there, I'm Jane Dev",
  );
  const [greetingEmoji, setGreetingEmoji] = React.useState("👋");
  const [greetingSubtitle, setGreetingSubtitle] = React.useState(
    "Full Stack Software Engineer",
  );

  // Banner
  const [bannerType, setBannerType] = React.useState<
    "none" | "capsule" | "custom"
  >("capsule");
  const [customBannerUrl, setCustomBannerUrl] = React.useState("");
  const [capsuleType, setCapsuleType] = React.useState<
    "wave" | "rect" | "waving" | "slice" | "egg"
  >("wave");
  const [capsuleColor, setCapsuleColor] = React.useState<string>("gradient");
  const [capsuleCustomHex, setCapsuleCustomHex] = React.useState("#a855f7");
  const [capsuleText, setCapsuleText] = React.useState("WELCOME");
  const [capsuleHeight, setCapsuleHeight] = React.useState(150);
  const [capsuleFontSize, setCapsuleFontSize] = React.useState(50);
  const [bannerAlign, setBannerAlign] = React.useState<
    "left" | "center" | "right"
  >("center");

  // Typing SVG
  const [showTyping, setShowTyping] = React.useState(true);
  const [typingLines, setTypingLines] = React.useState<string[]>([
    "Full Stack Software Engineer",
    "Building modular tools & playgrounds",
    "Open-source enthusiast",
  ]);
  const [typingFont, setTypingFont] = React.useState("Fira Code");
  const [typingSize, setTypingSize] = React.useState(20);
  const [typingColor, setTypingColor] = React.useState("#2dd4bf");
  const [typingAlign, setTypingAlign] = React.useState<
    "left" | "center" | "right"
  >("left");
  const [typingWidth, setTypingWidth] = React.useState(435);
  const [typingDuration, setTypingDuration] = React.useState(3000);
  const [typingPause, setTypingPause] = React.useState(1000);

  // Visitor Counter
  const [showVisitorCounter, setShowVisitorCounter] = React.useState(true);
  const [visitorColor] = React.useState("blue");
  const [visitorStyle, setVisitorStyle] = React.useState<
    "flat" | "flat-square" | "for-the-badge" | "plastic"
  >("flat-square");
  const [visitorLabel, setVisitorLabel] = React.useState("Profile Views");

  // ── 2. ABOUT ME ──
  const [workingOn, setWorkingOn] = React.useState(
    "OpenDevHub & modular plugins",
  );
  const [learning, setLearning] = React.useState(
    "Rust concurrency and WebAssembly compiler pipes",
  );
  const [collab, setCollab] = React.useState(
    "developer automation and terminal tools",
  );
  const [help, setHelp] = React.useState("");
  const [askMe, setAskMe] = React.useState("");
  const [email, setEmail] = React.useState("jane.dev@example.com");
  const [portfolioUrl, setPortfolioUrl] = React.useState("https://janedev.com");
  const [resumeUrl, setResumeUrl] = React.useState("");
  const [pronouns, setPronouns] = React.useState("");
  const [jobStatus, setJobStatus] = React.useState("Software Engineer");
  const [location, setLocation] = React.useState("Global");
  const [funFact, setFunFact] = React.useState(
    "I debug by talking to a rubber duck named Jarvis.",
  );

  // ── 3. TECH STACK & BADGES ──
  const [techStyleMode, setTechStyleMode] = React.useState<
    "badges" | "skillicons"
  >("badges");
  const [badgeStyle, setBadgeStyle] = React.useState<
    "for-the-badge" | "flat" | "flat-square" | "plastic"
  >("for-the-badge");
  const [techGroupByCat, setTechGroupByCat] = React.useState(false);
  const [skillIconsTheme, setSkillIconsTheme] = React.useState<
    "dark" | "light"
  >("dark");
  const [selectedTechs, setSelectedTechs] = React.useState<string[]>([
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Docker",
    "Git",
  ]);
  const [skillsSearch, setSkillsSearch] = React.useState("");

  // Tech Badge categories
  const techCategories: { category: string; items: TechBadge[] }[] = [
    {
      category: "Languages",
      items: [
        {
          name: "JavaScript",
          logo: "javascript",
          color: "F7DF1E",
          textColor: "000",
          skillIconKey: "js",
        },
        {
          name: "TypeScript",
          logo: "typescript",
          color: "3178C6",
          skillIconKey: "ts",
        },
        { name: "Python", logo: "python", color: "3776AB", skillIconKey: "py" },
        { name: "Go", logo: "go", color: "00ADD8", skillIconKey: "go" },
        { name: "Rust", logo: "rust", color: "000000", skillIconKey: "rust" },
        {
          name: "C++",
          logo: "cplusplus",
          color: "00599C",
          skillIconKey: "cpp",
        },
        { name: "C#", logo: "csharp", color: "239120", skillIconKey: "cs" },
        {
          name: "Java",
          logo: "openjdk",
          color: "ED8B00",
          skillIconKey: "java",
        },
        { name: "Ruby", logo: "ruby", color: "CC342D", skillIconKey: "ruby" },
        { name: "PHP", logo: "php", color: "777BB4", skillIconKey: "php" },
        {
          name: "Swift",
          logo: "swift",
          color: "F05138",
          skillIconKey: "swift",
        },
        {
          name: "Kotlin",
          logo: "kotlin",
          color: "7F52FF",
          skillIconKey: "kotlin",
        },
        { name: "Dart", logo: "dart", color: "0175C2", skillIconKey: "dart" },
        { name: "HTML5", logo: "html5", color: "E34F26", skillIconKey: "html" },
        { name: "CSS3", logo: "css3", color: "1572B6", skillIconKey: "css" },
        { name: "SQL", logo: "mysql", color: "00758F", skillIconKey: "mysql" },
        {
          name: "GraphQL",
          logo: "graphql",
          color: "E10098",
          skillIconKey: "graphql",
        },
      ],
    },
    {
      category: "Frontend & Styling",
      items: [
        {
          name: "React",
          logo: "react",
          color: "20232A",
          textColor: "61DAFB",
          skillIconKey: "react",
        },
        {
          name: "Next.js",
          logo: "nextdotjs",
          color: "000000",
          skillIconKey: "nextjs",
        },
        { name: "Vue", logo: "vuedotjs", color: "4FC08D", skillIconKey: "vue" },
        {
          name: "Nuxt.js",
          logo: "nuxtdotjs",
          color: "00DC82",
          skillIconKey: "nuxtjs",
        },
        {
          name: "Angular",
          logo: "angular",
          color: "DD0031",
          skillIconKey: "angular",
        },
        {
          name: "Svelte",
          logo: "svelte",
          color: "FF3E00",
          skillIconKey: "svelte",
        },
        {
          name: "SolidJS",
          logo: "solid",
          color: "2C4F7C",
          skillIconKey: "solidity",
        },
        {
          name: "TailwindCSS",
          logo: "tailwindcss",
          color: "06B6D4",
          skillIconKey: "tailwind",
        },
        {
          name: "Bootstrap",
          logo: "bootstrap",
          color: "7952B3",
          skillIconKey: "bootstrap",
        },
        { name: "Sass", logo: "sass", color: "CC6699", skillIconKey: "sass" },
        {
          name: "Figma",
          logo: "figma",
          color: "F24E1E",
          skillIconKey: "figma",
        },
        {
          name: "Photoshop",
          logo: "adobephotoshop",
          color: "31A8FF",
          skillIconKey: "ps",
        },
      ],
    },
    {
      category: "Backend & Database",
      items: [
        {
          name: "Node.js",
          logo: "nodedotjs",
          color: "339933",
          skillIconKey: "nodejs",
        },
        {
          name: "Express",
          logo: "express",
          color: "000000",
          skillIconKey: "express",
        },
        {
          name: "NestJS",
          logo: "nestjs",
          color: "E0234E",
          skillIconKey: "nestjs",
        },
        {
          name: "Django",
          logo: "django",
          color: "092E20",
          skillIconKey: "django",
        },
        {
          name: "FastAPI",
          logo: "fastapi",
          color: "009688",
          skillIconKey: "fastapi",
        },
        {
          name: "Flask",
          logo: "flask",
          color: "000000",
          skillIconKey: "flask",
        },
        {
          name: "Spring Boot",
          logo: "springboot",
          color: "6DB33F",
          skillIconKey: "spring",
        },
        {
          name: "Ruby on Rails",
          logo: "rubyonrails",
          color: "CC0000",
          skillIconKey: "rails",
        },
        {
          name: "PostgreSQL",
          logo: "postgresql",
          color: "4169E1",
          skillIconKey: "postgres",
        },
        {
          name: "MongoDB",
          logo: "mongodb",
          color: "47A248",
          skillIconKey: "mongodb",
        },
        {
          name: "Redis",
          logo: "redis",
          color: "DC382D",
          skillIconKey: "redis",
        },
        {
          name: "SQLite",
          logo: "sqlite",
          color: "003B57",
          skillIconKey: "sqlite",
        },
        {
          name: "Prisma",
          logo: "prisma",
          color: "2D3748",
          skillIconKey: "prisma",
        },
        {
          name: "Supabase",
          logo: "supabase",
          color: "3ECF8E",
          skillIconKey: "supabase",
        },
        {
          name: "Firebase",
          logo: "firebase",
          color: "FFCA28",
          textColor: "000",
          skillIconKey: "firebase",
        },
      ],
    },
    {
      category: "Mobile & Game Dev",
      items: [
        {
          name: "Flutter",
          logo: "flutter",
          color: "02569B",
          skillIconKey: "flutter",
        },
        {
          name: "React Native",
          logo: "react",
          color: "20232A",
          textColor: "61DAFB",
          skillIconKey: "react",
        },
        {
          name: "SwiftUI",
          logo: "swift",
          color: "F05138",
          skillIconKey: "swift",
        },
        {
          name: "Electron",
          logo: "electron",
          color: "47848F",
          skillIconKey: "electron",
        },
        {
          name: "Tauri",
          logo: "tauri",
          color: "24C8DB",
          skillIconKey: "tauri",
        },
        {
          name: "Unity",
          logo: "unity",
          color: "000000",
          skillIconKey: "unity",
        },
        {
          name: "Unreal Engine",
          logo: "unrealengine",
          color: "313131",
          skillIconKey: "unreal",
        },
      ],
    },
    {
      category: "DevOps & Cloud",
      items: [
        {
          name: "Docker",
          logo: "docker",
          color: "2496ED",
          skillIconKey: "docker",
        },
        {
          name: "Kubernetes",
          logo: "kubernetes",
          color: "326CE5",
          skillIconKey: "kubernetes",
        },
        {
          name: "AWS",
          logo: "amazonwebservices",
          color: "232F3E",
          skillIconKey: "aws",
        },
        {
          name: "Google Cloud",
          logo: "googlecloud",
          color: "4285F4",
          skillIconKey: "gcp",
        },
        {
          name: "Azure",
          logo: "microsoftazure",
          color: "0089D6",
          skillIconKey: "azure",
        },
        {
          name: "Vercel",
          logo: "vercel",
          color: "000000",
          skillIconKey: "vercel",
        },
        {
          name: "Netlify",
          logo: "netlify",
          color: "00C896",
          skillIconKey: "netlify",
        },
        {
          name: "GitHub Actions",
          logo: "githubactions",
          color: "2088FF",
          skillIconKey: "githubactions",
        },
        {
          name: "GitLab CI",
          logo: "gitlab",
          color: "FCA121",
          skillIconKey: "gitlab",
        },
      ],
    },
    {
      category: "Tools & Testing",
      items: [
        { name: "Git", logo: "git", color: "F05032", skillIconKey: "git" },
        {
          name: "GitHub",
          logo: "github",
          color: "181717",
          skillIconKey: "github",
        },
        {
          name: "VS Code",
          logo: "visualstudiocode",
          color: "007ACC",
          skillIconKey: "vscode",
        },
        {
          name: "Postman",
          logo: "postman",
          color: "FF6C37",
          skillIconKey: "postman",
        },
        {
          name: "Linux",
          logo: "linux",
          color: "FCC624",
          textColor: "000",
          skillIconKey: "linux",
        },
        { name: "Jest", logo: "jest", color: "C21325", skillIconKey: "jest" },
        {
          name: "Cypress",
          logo: "cypress",
          color: "17202C",
          skillIconKey: "cypress",
        },
      ],
    },
  ];

  const toggleTech = (techName: string) => {
    setSelectedTechs((prev) =>
      prev.includes(techName)
        ? prev.filter((t) => t !== techName)
        : [...prev, techName],
    );
  };

  // ── 4. GITHUB WIDGETS & STATS ──
  const [githubUser, setGithubUser] = React.useState("octocat");

  // Stats Card
  const [showStatsCard, setShowStatsCard] = React.useState(true);
  const [statsTheme, setStatsTheme] = React.useState("dark");
  const [statsShowIcons, setStatsShowIcons] = React.useState(true);
  const [statsPrivateCommits, setStatsPrivateCommits] = React.useState(true);
  const [statsHideRank, setStatsHideRank] = React.useState(false);

  // Streak Stats
  const [showStreakCard, setShowStreakCard] = React.useState(true);
  const [streakTheme, setStreakTheme] = React.useState("dark");

  // Top Langs
  const [showLangsCard, setShowLangsCard] = React.useState(true);
  const [langsLayout, setLangsLayout] = React.useState<
    "classic" | "compact" | "donut"
  >("compact");
  const [langsTheme, setLangsTheme] = React.useState("dark");

  // Activity Graph
  const [showGraphCard, setShowGraphCard] = React.useState(false);
  const [graphTheme, setGraphTheme] = React.useState("dark");

  // Trophy Card
  const [showTrophyCard, setShowTrophyCard] = React.useState(false);
  const [trophyTheme, setTrophyTheme] = React.useState("radical");
  const [trophyColumns, setTrophyColumns] = React.useState(5);

  // LeetCode Card
  const [showLeetcodeCard, setShowLeetcodeCard] = React.useState(false);
  const [leetcodeUser, setLeetcodeUser] = React.useState("");
  const [leetcodeTheme, setLeetcodeTheme] = React.useState("dark");

  // Jokes Card
  const [showJokesCard, setShowJokesCard] = React.useState(false);
  const [jokesTheme, setJokesTheme] = React.useState("dark");

  // ── 5. SOCIAL CONNECTIONS ──
  const [socialLinks, setSocialLinks] = React.useState<Record<string, string>>({
    linkedin: "jane-dev",
    twitter: "janedev_code",
    youtube: "",
    medium: "",
    devto: "",
    hashnode: "",
    stackoverflow: "",
    discord: "",
    telegram: "",
    instagram: "",
    twitch: "",
    mastodon: "",
    facebook: "",
    substack: "",
  });

  const updateSocialLink = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  // ── 6. SUPPORT & EXTRAS ──
  const [supportBmc, setSupportBmc] = React.useState("");
  const [supportKofi, setSupportKofi] = React.useState("");
  const [supportPatreon, setSupportPatreon] = React.useState("");
  const [supportPaypal, setSupportPaypal] = React.useState("");
  const [customMarkdown, setCustomMarkdown] = React.useState("");

  // ── 7. SECTION LAYOUT ORDERING ──
  const defaultSections = [
    "banner",
    "greetings",
    "typing",
    "visitor",
    "subtitle",
    "about",
    "skills",
    "stats",
    "socials",
    "support",
    "custom",
  ];
  const [sectionOrder, setSectionOrder] = React.useState<string[]>([
    ...defaultSections,
  ]);

  const sectionNames: Record<string, string> = {
    banner: "Header Banner / Capsule Render",
    greetings: "Greeting Title & Emoji",
    typing: "Animated Typing SVGs",
    visitor: "Profile Visitor Counter",
    subtitle: "Bio Subtitle & Tagline",
    about: "About Me details",
    skills: "Tech Stack & Skills",
    stats: "GitHub Stats & Dashboard Cards",
    socials: "Social Media Connections",
    support: "Buy Me a Coffee & Sponsors",
    custom: "Custom Markdown Section",
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sectionOrder.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newOrder = [...sectionOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setSectionOrder(newOrder);
  };

  // Template Loader
  const loadTemplate = (type: "minimal" | "full" | "widgets") => {
    // Reset order to default first
    setSectionOrder([...defaultSections]);

    if (type === "minimal") {
      setName("Jane Developer");
      setGreetingTitle("Hi there, I'm Jane");
      setGreetingEmoji("💻");
      setGreetingSubtitle("Junior Full-Stack Software Developer");
      setWorkingOn("building lightweight tools and responsive websites");
      setLearning("TypeScript deep dive and next.js core structures");
      setCollab("open source issues");
      setEmail("jane.dev@example.com");
      setGithubUser("octocat");
      setHelp("");
      setAskMe("");
      setPronouns("she/her");
      setJobStatus("Freelancer");
      setLocation("Denver, CO");
      setFunFact("");
      updateSocialLink("linkedin", "jane-dev");
      updateSocialLink("twitter", "");
      updateSocialLink("youtube", "");
      updateSocialLink("medium", "");
      updateSocialLink("devto", "");
      updateSocialLink("hashnode", "");
      updateSocialLink("stackoverflow", "");
      updateSocialLink("discord", "");
      updateSocialLink("telegram", "");
      updateSocialLink("instagram", "");
      setTechStyleMode("skillicons");
      setSkillIconsTheme("dark");
      setSelectedTechs([
        "JavaScript",
        "TypeScript",
        "HTML5",
        "CSS3",
        "React",
        "Next.js",
        "TailwindCSS",
        "Git",
      ]);
      setShowStatsCard(true);
      setStatsTheme("tokyonight");
      setStatsShowIcons(true);
      setStatsPrivateCommits(true);
      setStatsHideRank(false);
      setShowStreakCard(false);
      setShowLangsCard(true);
      setLangsLayout("compact");
      setLangsTheme("tokyonight");
      setShowGraphCard(false);
      setShowTrophyCard(false);
      setShowLeetcodeCard(false);
      setShowJokesCard(false);
      setBannerType("none");
      setShowTyping(false);
      setShowVisitorCounter(true);
      setVisitorStyle("flat-square");
      setVisitorLabel("Profile Views");
      setSupportBmc("");
      setSupportKofi("");
      setSupportPatreon("");
      setSupportPaypal("");
      setCustomMarkdown("");
    } else if (type === "full") {
      setName("Alex Rivera");
      setGreetingTitle("Hello World, I'm Alex Rivera");
      setGreetingEmoji("🚀");
      setGreetingSubtitle(
        "Lead Software Architect | Open-Source Core Maintainer",
      );
      setWorkingOn(
        "next-generation reactive database drivers and orchestration tooling",
      );
      setLearning(
        "WebAssembly systems interfaces and Rust performance profile pipelines",
      );
      setCollab("scalable cloud APIs and distributed caching algorithms");
      setHelp("low level compiler engineering");
      setAskMe("distributed database systems");
      setEmail("alex.rivera@infra.dev");
      setGithubUser("octocat");
      setPortfolioUrl("https://alexrivera.dev");
      setResumeUrl("https://alexrivera.dev/resume.pdf");
      setPronouns("he/him");
      setJobStatus("Software Engineer @ Vercel");
      setLocation("San Francisco, CA");
      setFunFact(
        "I wrote my first assembler compiler in high school code classes!",
      );
      setTechStyleMode("badges");
      setBadgeStyle("for-the-badge");
      setTechGroupByCat(true);
      setSelectedTechs([
        "TypeScript",
        "Go",
        "Rust",
        "Python",
        "React",
        "Next.js",
        "TailwindCSS",
        "Node.js",
        "Express",
        "PostgreSQL",
        "Redis",
        "Docker",
        "Kubernetes",
        "AWS",
        "GitHub Actions",
        "Git",
        "VS Code",
      ]);

      updateSocialLink("linkedin", "alex-rivera-dev");
      updateSocialLink("twitter", "alex_codes_infra");
      updateSocialLink("youtube", "alexriveracodes");
      updateSocialLink("medium", "alex-rivera");
      updateSocialLink("devto", "alexrivera");
      updateSocialLink("stackoverflow", "1234567");
      updateSocialLink("discord", "https://discord.gg/inviteCode");

      setShowStatsCard(true);
      setStatsTheme("radical");
      setStatsShowIcons(true);
      setStatsPrivateCommits(true);
      setStatsHideRank(false);
      setShowStreakCard(true);
      setStreakTheme("radical");
      setShowLangsCard(true);
      setLangsLayout("compact");
      setLangsTheme("radical");
      setShowGraphCard(true);
      setGraphTheme("radical");
      setShowTrophyCard(true);
      setTrophyTheme("radical");
      setTrophyColumns(6);
      setShowLeetcodeCard(false);
      setShowJokesCard(true);
      setJokesTheme("radical");
      setBannerType("capsule");
      setCapsuleType("wave");
      setCapsuleColor("gradient");
      setCapsuleText("ALEX RIVERA");
      setCapsuleHeight(160);
      setCapsuleFontSize(55);
      setBannerAlign("center");
      setShowTyping(true);
      setTypingLines([
        "Lead Software Architect",
        "Rust & Go Enthusiast",
        "Open-Source Contributor",
      ]);
      setTypingFont("Fira Code");
      setTypingSize(22);
      setTypingColor("#a855f7");
      setTypingAlign("center");
      setTypingWidth(450);
      setTypingDuration(3000);
      setTypingPause(1000);
      setShowVisitorCounter(true);
      setVisitorStyle("for-the-badge");
      setVisitorLabel("VISITORS");
      setSupportBmc("alexrivera");
      setSupportKofi("alexrivera");
      setCustomMarkdown(
        "### 🚀 My Pinboard\nCheck out my pinned open source projects below!",
      );
    } else if (type === "widgets") {
      setName("Warp Coder");
      setGreetingTitle("Welcome to my Cyberdeck Space!");
      setGreetingEmoji("👾");
      setGreetingSubtitle("Widget-heavy, hyper-informative profile stats hub");
      setWorkingOn(
        "building gamified developer portfolios and interactive widgets",
      );
      setLearning("WebGPU and canvas physics rendering engines");
      setGithubUser("octocat");
      setEmail("warp.coder@cyber.net");
      setPortfolioUrl("https://warp.net");
      setPronouns("they/them");
      setLocation("Tokyo, JP");
      setTechStyleMode("skillicons");
      setSkillIconsTheme("dark");
      setSelectedTechs([
        "JavaScript",
        "TypeScript",
        "Python",
        "React",
        "Node.js",
        "Docker",
        "AWS",
        "Git",
        "VS Code",
      ]);

      updateSocialLink("linkedin", "octocat");
      updateSocialLink("twitter", "octocat");
      updateSocialLink("discord", "octocat#1234");

      setShowStatsCard(true);
      setStatsTheme("dracula");
      setStatsShowIcons(true);
      setStatsPrivateCommits(true);
      setShowStreakCard(true);
      setStreakTheme("dracula");
      setShowLangsCard(true);
      setLangsLayout("donut");
      setLangsTheme("dracula");
      setShowGraphCard(true);
      setGraphTheme("dracula");
      setShowTrophyCard(true);
      setTrophyTheme("dracula");
      setTrophyColumns(5);
      setShowLeetcodeCard(true);
      setLeetcodeUser("alexrivera");
      setLeetcodeTheme("dracula");
      setShowJokesCard(true);
      setJokesTheme("dracula");
      setBannerType("capsule");
      setCapsuleType("waving");
      setCapsuleColor("custom");
      setCapsuleCustomHex("#ff79c6");
      setCapsuleText("THE METAVERSE");
      setCapsuleHeight(180);
      setCapsuleFontSize(45);
      setBannerAlign("center");
      setShowTyping(false);
      setShowVisitorCounter(false);
      setCustomMarkdown("");
    }
  };

  // Reset Form
  const resetWorkspace = () => {
    setName("Jane Dev");
    setGreetingTitle("Hi there, I'm Jane Dev");
    setGreetingEmoji("👋");
    setGreetingSubtitle("Full Stack Software Engineer");
    setBannerType("none");
    setCustomBannerUrl("");
    setShowTyping(false);
    setShowVisitorCounter(false);
    setWorkingOn("");
    setLearning("");
    setCollab("");
    setHelp("");
    setAskMe("");
    setEmail("");
    setPortfolioUrl("");
    setResumeUrl("");
    setPronouns("");
    setJobStatus("");
    setLocation("");
    setFunFact("");
    setSelectedTechs([]);
    setShowStatsCard(false);
    setShowStreakCard(false);
    setShowLangsCard(false);
    setShowGraphCard(false);
    setShowTrophyCard(false);
    setShowLeetcodeCard(false);
    setShowJokesCard(false);
    setSupportBmc("");
    setSupportKofi("");
    setSupportPatreon("");
    setSupportPaypal("");
    setCustomMarkdown("");
    setSectionOrder([...defaultSections]);
    setSocialLinks({
      linkedin: "",
      twitter: "",
      youtube: "",
      medium: "",
      devto: "",
      hashnode: "",
      stackoverflow: "",
      discord: "",
      telegram: "",
      instagram: "",
      twitch: "",
      mastodon: "",
      facebook: "",
      substack: "",
    });
  };

  // Typings Array Helpers
  const addTypingLine = () => setTypingLines((prev) => [...prev, ""]);
  const removeTypingLine = (index: number) =>
    setTypingLines((prev) => prev.filter((_, i) => i !== index));
  const updateTypingLine = (index: number, val: string) => {
    setTypingLines((prev) => prev.map((l, i) => (i === index ? val : l)));
  };

  // Compile Markdown code
  const generatedMarkdown = React.useMemo(() => {
    const mdParts: Record<string, string> = {
      banner: "",
      greetings: "",
      typing: "",
      visitor: "",
      subtitle: "",
      about: "",
      skills: "",
      stats: "",
      socials: "",
      support: "",
      custom: "",
    };

    // 1. BANNER
    if (bannerType === "capsule" && capsuleText) {
      const capsTheme =
        capsuleColor === "custom"
          ? `&color=${capsuleCustomHex.replace("#", "")}`
          : `&color=${capsuleColor}`;
      mdParts.banner = `<p align="${bannerAlign}">\n  <img src="https://capsule-render.vercel.app/api?type=${capsuleType}${capsTheme}&height=${capsuleHeight}&section=header&text=${encodeURIComponent(capsuleText)}&fontSize=${capsuleFontSize}" />\n</p>\n\n`;
    } else if (bannerType === "custom" && customBannerUrl) {
      mdParts.banner = `<p align="${bannerAlign}">\n  <img src="${customBannerUrl}" alt="Banner" width="100%" />\n</p>\n\n`;
    }

    // 2. GREETINGS
    if (greetingTitle) {
      mdParts.greetings = `# ${greetingTitle} ${greetingEmoji}\n\n`;
    }

    // 3. TYPING SVG
    if (showTyping && typingLines.filter(Boolean).length > 0) {
      const linesStr = typingLines
        .filter(Boolean)
        .map((l) => encodeURIComponent(l))
        .join(";");
      const centerParam =
        typingAlign === "center" ? "&center=true&vCenter=true" : "";
      mdParts.typing = `<p align="${typingAlign}">\n  <a href="https://git.io/typing-svg">\n    <img src="https://readme-typing-svg.demolab.com?font=${typingFont}&size=${typingSize}&duration=${typingDuration}&pause=${typingPause}&color=${typingColor.replace("#", "")}&width=${typingWidth}${centerParam}&lines=${linesStr}" alt="Typing SVG" />\n  </a>\n</p>\n\n`;
    }

    // 4. VISITOR COUNTER
    if (showVisitorCounter && githubUser) {
      mdParts.visitor = `<p align="left">\n  <img src="https://komarev.com/ghpvc/?username=${githubUser}&color=${visitorColor}&style=${visitorStyle}&label=${encodeURIComponent(visitorLabel)}" alt="Visitor Counter" />\n</p>\n\n`;
    }

    // 5. SUBTITLE
    if (greetingSubtitle) {
      mdParts.subtitle = `**${greetingSubtitle}**\n\n`;
    }

    // 6. ABOUT ME
    const hasAbout =
      workingOn ||
      learning ||
      collab ||
      help ||
      askMe ||
      email ||
      resumeUrl ||
      portfolioUrl ||
      funFact ||
      pronouns ||
      jobStatus ||
      location;
    if (hasAbout) {
      let aboutMd = `### 💫 About Me\n`;
      if (workingOn)
        aboutMd += `- 🔭 I’m currently working on **${workingOn}**\n`;
      if (learning) aboutMd += `- 🌱 I’m currently learning **${learning}**\n`;
      if (collab)
        aboutMd += `- 👯 I’m looking to collaborate on **${collab}**\n`;
      if (help) aboutMd += `- 🤔 I’m looking for help with **${help}**\n`;
      if (askMe) aboutMd += `- 💬 Ask me about **${askMe}**\n`;
      if (email) aboutMd += `- 📫 How to reach me **${email}**\n`;
      if (portfolioUrl)
        aboutMd += `- 🌐 Visit my website **[${portfolioUrl}](${portfolioUrl})**\n`;
      if (resumeUrl)
        aboutMd += `- 📄 Check out my **[Resume](${resumeUrl})**\n`;
      if (pronouns) aboutMd += `- 💬 Pronouns: **${pronouns}**\n`;
      if (jobStatus) aboutMd += `- 💼 Job Status: **${jobStatus}**\n`;
      if (location) aboutMd += `- 📍 Location: **${location}**\n`;
      if (funFact) aboutMd += `- ⚡ Fun fact: **${funFact}**\n`;
      aboutMd += `\n`;
      mdParts.about = aboutMd;
    }

    // 7. TECH STACK
    if (selectedTechs.length > 0) {
      let skillsMd = `### 🛠️ Tech Stack & Skills\n`;
      if (techStyleMode === "badges") {
        if (techGroupByCat) {
          techCategories.forEach((cat) => {
            const catTechs = cat.items.filter((item) =>
              selectedTechs.includes(item.name),
            );
            if (catTechs.length > 0) {
              skillsMd += `- **${cat.category}**: `;
              const badgeStrings = catTechs.map((badge) => {
                const textCol = badge.textColor
                  ? `&logoColor=${badge.textColor}`
                  : `&logoColor=white`;
                return `<img src="https://img.shields.io/badge/${encodeURIComponent(badge.name)}-%23${badge.color}.svg?style=${badgeStyle}&logo=${badge.logo}${textCol}" alt="${badge.name}" />`;
              });
              skillsMd += badgeStrings.join(" ") + "\n";
            }
          });
          skillsMd += "\n";
        } else {
          skillsMd += `<p align="left">\n`;
          const badgeStrings = selectedTechs
            .map((tName) => {
              let badge: TechBadge | undefined;
              for (const cat of techCategories) {
                const found = cat.items.find((item) => item.name === tName);
                if (found) {
                  badge = found;
                  break;
                }
              }
              if (!badge) return "";
              const textCol = badge.textColor
                ? `&logoColor=${badge.textColor}`
                : `&logoColor=white`;
              return `  <img src="https://img.shields.io/badge/${encodeURIComponent(badge.name)}-%23${badge.color}.svg?style=${badgeStyle}&logo=${badge.logo}${textCol}" alt="${badge.name}" />`;
            })
            .filter(Boolean);
          skillsMd += badgeStrings.join("\n") + `\n</p>\n\n`;
        }
      } else {
        const mappedKeys = selectedTechs
          .map((tName) => {
            let badge: TechBadge | undefined;
            for (const cat of techCategories) {
              const found = cat.items.find((item) => item.name === tName);
              if (found) {
                badge = found;
                break;
              }
            }
            return badge?.skillIconKey || "";
          })
          .filter(Boolean)
          .join(",");
        skillsMd += `<p align="left">\n  <a href="https://skillicons.dev">\n    <img src="https://skillicons.dev/icons?i=${mappedKeys}&theme=${skillIconsTheme}" />\n  </a>\n</p>\n\n`;
      }
      mdParts.skills = skillsMd;
    }

    // 8. STATS CARDS
    const hasStatsCards =
      showStatsCard ||
      showStreakCard ||
      showLangsCard ||
      showGraphCard ||
      showTrophyCard ||
      showLeetcodeCard ||
      showJokesCard;
    if (hasStatsCards && githubUser) {
      let statsMd = `### 📊 GitHub Dashboard & Metrics\n`;
      statsMd += `<p align="left">\n`;
      if (showStatsCard) {
        const showIconsVal = statsShowIcons ? "&show_icons=true" : "";
        const privateCommitsVal = statsPrivateCommits
          ? "&count_private=true"
          : "";
        const hideRankVal = statsHideRank ? "&hide_rank=true" : "";
        statsMd += `  <a href="https://github.com/${githubUser}">\n    <img src="https://github-stats-extended.vercel.app/api?username=${githubUser}${showIconsVal}${privateCommitsVal}${hideRankVal}&theme=${statsTheme}&locale=en" alt="Stats Card" />\n  </a>\n`;
      }
      if (showStreakCard) {
        statsMd += `  <a href="https://github.com/${githubUser}">\n    <img src="https://github-readme-streak-stats.herokuapp.com/?user=${githubUser}&theme=${streakTheme}" alt="Streak Stats" />\n  </a>\n`;
      }
      if (showLangsCard) {
        statsMd += `  <a href="https://github.com/${githubUser}">\n    <img src="https://github-stats-extended.vercel.app/api/top-langs?username=${githubUser}&layout=${langsLayout}&theme=${langsTheme}" alt="Top Languages" />\n  </a>\n`;
      }
      if (showGraphCard) {
        statsMd += `  <a href="https://github.com/${githubUser}">\n    <img src="https://github-readme-activity-graph.vercel.app/graph?username=${githubUser}&theme=${graphTheme}" alt="Activity Graph" />\n  </a>\n`;
      }
      if (showTrophyCard) {
        statsMd += `  <a href="https://github.com/${githubUser}">\n    <img src="https://github-trophies.devomb.com/?username=${githubUser}&theme=${trophyTheme}&column=${trophyColumns}" alt="Trophies" />\n  </a>\n`;
      }
      if (showLeetcodeCard && leetcodeUser) {
        statsMd += `  <a href="https://github.com/JacobLinCool/LeetCard">\n    <img src="https://leetcard.jacoblin.cool/${leetcodeUser}?theme=${leetcodeTheme}" alt="LeetCode Stats" />\n  </a>\n`;
      }
      if (showJokesCard) {
        statsMd += `  <img src="https://readme-jokes.vercel.app/api?theme=${jokesTheme}" alt="GitHub Readme Jokes" />\n`;
      }
      statsMd += `</p>\n\n`;
      mdParts.stats = statsMd;
    }

    // 9. CONNECT
    const activeSocials = Object.entries(socialLinks).filter(
      ([_, val]) => !!val,
    );
    if (activeSocials.length > 0) {
      let socialsMd = `### 🤝 Connect with Me\n`;
      socialsMd += `<p align="left">\n`;
      activeSocials.forEach(([key, val]) => {
        let badgeUrl = "";
        let linkUrl = "";
        const style = badgeStyle;

        switch (key) {
          case "linkedin":
            badgeUrl = `https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=${style}&logo=linkedin&logoColor=white`;
            linkUrl = `https://linkedin.com/in/${val}`;
            break;
          case "twitter":
            badgeUrl = `https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=${style}&logo=twitter&logoColor=white`;
            linkUrl = `https://twitter.com/${val}`;
            break;
          case "youtube":
            badgeUrl = `https://img.shields.io/badge/YouTube-%23FF0000.svg?style=${style}&logo=youtube&logoColor=white`;
            linkUrl = `https://youtube.com/@${val}`;
            break;
          case "medium":
            badgeUrl = `https://img.shields.io/badge/Medium-%2312100E.svg?style=${style}&logo=medium&logoColor=white`;
            linkUrl = `https://medium.com/@${val}`;
            break;
          case "devto":
            badgeUrl = `https://img.shields.io/badge/Dev.to-%230A0A0A.svg?style=${style}&logo=devdotto&logoColor=white`;
            linkUrl = `https://dev.to/${val}`;
            break;
          case "hashnode":
            badgeUrl = `https://img.shields.io/badge/Hashnode-%232962FF.svg?style=${style}&logo=hashnode&logoColor=white`;
            linkUrl = `https://${val}.hashnode.dev`;
            break;
          case "stackoverflow":
            badgeUrl = `https://img.shields.io/badge/StackOverflow-%23F48024.svg?style=${style}&logo=stackoverflow&logoColor=white`;
            linkUrl = `https://stackoverflow.com/users/${val}`;
            break;
          case "discord":
            badgeUrl = `https://img.shields.io/badge/Discord-%235865F2.svg?style=${style}&logo=discord&logoColor=white`;
            linkUrl = val.startsWith("http")
              ? val
              : `https://discord.gg/${val}`;
            break;
          case "telegram":
            badgeUrl = `https://img.shields.io/badge/Telegram-%232CA5E0.svg?style=${style}&logo=telegram&logoColor=white`;
            linkUrl = `https://t.me/${val}`;
            break;
          case "instagram":
            badgeUrl = `https://img.shields.io/badge/Instagram-%23E4405F.svg?style=${style}&logo=instagram&logoColor=white`;
            linkUrl = `https://instagram.com/${val}`;
            break;
          case "twitch":
            badgeUrl = `https://img.shields.io/badge/Twitch-%239146FF.svg?style=${style}&logo=twitch&logoColor=white`;
            linkUrl = `https://twitch.tv/${val}`;
            break;
          case "mastodon":
            badgeUrl = `https://img.shields.io/badge/Mastodon-%233088d4.svg?style=${style}&logo=mastodon&logoColor=white`;
            linkUrl = val.startsWith("http")
              ? val
              : `https://mastodon.social/@${val}`;
            break;
          case "facebook":
            badgeUrl = `https://img.shields.io/badge/Facebook-%231877F2.svg?style=${style}&logo=facebook&logoColor=white`;
            linkUrl = `https://facebook.com/${val}`;
            break;
          case "substack":
            badgeUrl = `https://img.shields.io/badge/Substack-%23FF6633.svg?style=${style}&logo=substack&logoColor=white`;
            linkUrl = `https://${val}.substack.com`;
            break;
        }

        if (badgeUrl && linkUrl) {
          socialsMd += `  <a href="${linkUrl}" target="_blank"><img src="${badgeUrl}" alt="${key}" /></a>\n`;
        }
      });
      socialsMd += `</p>\n\n`;
      mdParts.socials = socialsMd;
    }

    // 10. SUPPORT
    const hasSupport =
      supportBmc || supportKofi || supportPatreon || supportPaypal;
    if (hasSupport) {
      let supportMd = `### ☕ Support Me\n`;
      supportMd += `<p align="left">\n`;
      if (supportBmc) {
        supportMd += `  <a href="https://www.buymeacoffee.com/${supportBmc}" target="_blank"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=${badgeStyle}&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" /></a>\n`;
      }
      if (supportKofi) {
        supportMd += `  <a href="https://ko-fi.com/${supportKofi}" target="_blank"><img src="https://img.shields.io/badge/Ko--fi-F16061?style=${badgeStyle}&logo=ko-fi&logoColor=white" alt="Ko-fi" /></a>\n`;
      }
      if (supportPatreon) {
        supportMd += `  <a href="https://www.patreon.com/${supportPatreon}" target="_blank"><img src="https://img.shields.io/badge/Patreon-%23F96854.svg?style=${badgeStyle}&logo=patreon&logoColor=white" alt="Patreon" /></a>\n`;
      }
      if (supportPaypal) {
        supportMd += `  <a href="https://www.paypal.me/${supportPaypal}" target="_blank"><img src="https://img.shields.io/badge/PayPal-003087?style=${badgeStyle}&logo=paypal&logoColor=white" alt="PayPal" /></a>\n`;
      }
      supportMd += `</p>\n\n`;
      mdParts.support = supportMd;
    }

    // 11. CUSTOM MARKDOWN
    if (customMarkdown.trim()) {
      mdParts.custom = `${customMarkdown.trim()}\n\n`;
    }

    // Assemble parts in custom section order
    let finalMd = "";
    sectionOrder.forEach((key) => {
      finalMd += mdParts[key] || "";
    });

    return finalMd;
  }, [
    name,
    greetingTitle,
    greetingEmoji,
    greetingSubtitle,
    bannerType,
    customBannerUrl,
    capsuleType,
    capsuleColor,
    capsuleCustomHex,
    capsuleText,
    capsuleHeight,
    capsuleFontSize,
    bannerAlign,
    showTyping,
    typingLines,
    typingFont,
    typingSize,
    typingColor,
    typingAlign,
    typingWidth,
    typingDuration,
    typingPause,
    showVisitorCounter,
    visitorColor,
    visitorStyle,
    visitorLabel,
    workingOn,
    learning,
    collab,
    help,
    askMe,
    email,
    portfolioUrl,
    resumeUrl,
    pronouns,
    jobStatus,
    location,
    funFact,
    techStyleMode,
    badgeStyle,
    techGroupByCat,
    skillIconsTheme,
    selectedTechs,
    githubUser,
    showStatsCard,
    statsTheme,
    statsShowIcons,
    statsPrivateCommits,
    statsHideRank,
    showStreakCard,
    streakTheme,
    showLangsCard,
    langsLayout,
    langsTheme,
    showGraphCard,
    graphTheme,
    showTrophyCard,
    trophyTheme,
    trophyColumns,
    showLeetcodeCard,
    leetcodeUser,
    leetcodeTheme,
    showJokesCard,
    jokesTheme,
    socialLinks,
    supportBmc,
    supportKofi,
    supportPatreon,
    supportPaypal,
    customMarkdown,
    sectionOrder,
  ]);

  // HTML Preview state & compiler
  const [renderedHtml, setRenderedHtml] = React.useState("");
  React.useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const html = await marked.parse(generatedMarkdown);
        setRenderedHtml(html);
      } catch (err) {
        console.error("Failed to parse markdown", err);
      }
    };
    parseMarkdown();
  }, [generatedMarkdown]);

  const handleDownload = () => {
    const blob = new Blob([generatedMarkdown], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter skills based on search query
  const getFilteredCategories = () => {
    if (!skillsSearch.trim()) return techCategories;
    const query = skillsSearch.toLowerCase();
    return techCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
          item.name.toLowerCase().includes(query),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono space-y-6">
      {/* ── HEADER PANEL ── */}
      <div className="border-2 border-foreground bg-card p-6 shadow-neo-primary relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-foreground mb-2 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <span>README BUILDER WORKSPACE</span>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              Design a customized markdown overview file for your GitHub user
              profile. Load templates, edit sections, and arrange layout order.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadTemplate("minimal")}
              className="px-3 py-1.5 border-2 border-foreground bg-zinc-950 text-foreground hover:bg-zinc-900 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer"
            >
              Minimal
            </button>
            <button
              onClick={() => loadTemplate("full")}
              className="px-3 py-1.5 border-2 border-foreground bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer"
            >
              Full Stack
            </button>
            <button
              onClick={() => loadTemplate("widgets")}
              className="px-3 py-1.5 border-2 border-foreground bg-accent text-accent-foreground hover:opacity-90 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer"
            >
              Telemetry
            </button>
            <button
              onClick={resetWorkspace}
              title="Reset workspace"
              className="px-2 py-1.5 border-2 border-foreground bg-black hover:bg-zinc-900 text-destructive text-xs font-bold shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              RESET
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT EDITOR WORKSPACE - 6 Columns ── */}
        <div className={`lg:col-span-6 border-2 border-foreground bg-card flex flex-col min-h-[680px] ${isFullscreen ? "hidden" : ""}`}>
          {/* Horizontal Tabs Menu */}
          <div className="flex flex-wrap border-b-2 border-foreground bg-black text-[10px] font-bold uppercase select-none">
            {[
              { id: "intro", label: "Intro", icon: Sparkles },
              { id: "about", label: "About", icon: User },
              { id: "skills", label: "Skills", icon: Terminal },
              { id: "stats", label: "Stats", icon: BarChart2 },
              { id: "socials", label: "Socials", icon: Globe },
              { id: "support", label: "Support", icon: Heart },
              { id: "layout", label: "Layout", icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-3 border-r border-zinc-900 transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground font-black"
                      : "text-zinc-400 hover:text-foreground hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Scroll Container */}
          <div className="p-5 flex-grow overflow-y-auto max-h-[580px] space-y-5 text-xs">
            {/* 🚀 TAB 1: INTRO & HEADER */}
            {activeTab === "intro" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-primary text-xs uppercase mb-2">
                    Banners & Headers
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase font-bold mb-1">
                        Banner Type
                      </label>
                      <select
                        value={bannerType}
                        onChange={(e) => setBannerType(e.target.value as any)}
                        className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-foreground cursor-pointer"
                      >
                        <option value="none">No Banner</option>
                        <option value="capsule">
                          Capsule Render (Dynamic SVG)
                        </option>
                        <option value="custom">Custom Banner Image URL</option>
                      </select>
                    </div>

                    {bannerType === "capsule" && (
                      <div className="border border-zinc-800 p-3 bg-zinc-950 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] text-zinc-500 uppercase">
                              Capsule Style
                            </label>
                            <select
                              value={capsuleType}
                              onChange={(e) =>
                                setCapsuleType(e.target.value as any)
                              }
                              className="w-full border border-foreground bg-black px-1.5 py-1 text-foreground"
                            >
                              <option value="wave">Wave</option>
                              <option value="waving">Waving (Animated)</option>
                              <option value="rect">Rectangle</option>
                              <option value="slice">Slice</option>
                              <option value="egg">Egg Shape</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] text-zinc-500 uppercase">
                              Theme / Color
                            </label>
                            <select
                              value={capsuleColor}
                              onChange={(e) => setCapsuleColor(e.target.value)}
                              className="w-full border border-foreground bg-black px-1.5 py-1 text-foreground"
                            >
                              <option value="gradient">Gradient Rainbow</option>
                              <option value="auto">Auto / Dark Slate</option>
                              <option value="transparent">Transparent</option>
                              <option value="custom">Custom Hex Color</option>
                            </select>
                          </div>
                        </div>

                        {capsuleColor === "custom" && (
                          <div>
                            <label className="block text-[9px] text-zinc-500 uppercase">
                              Custom Color Hex
                            </label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={capsuleCustomHex}
                                onChange={(e) =>
                                  setCapsuleCustomHex(e.target.value)
                                }
                                className="h-7 w-10 border border-foreground bg-black cursor-pointer"
                              />
                              <input
                                type="text"
                                value={capsuleCustomHex}
                                onChange={(e) =>
                                  setCapsuleCustomHex(e.target.value)
                                }
                                className="flex-grow border border-foreground bg-black px-2 py-1 text-foreground"
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-[9px] text-zinc-500 uppercase">
                            Banner text
                          </label>
                          <input
                            type="text"
                            value={capsuleText}
                            onChange={(e) => setCapsuleText(e.target.value)}
                            className="w-full border border-foreground bg-black px-2 py-1 text-foreground"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] text-zinc-500 uppercase">
                              Height ({capsuleHeight}px)
                            </label>
                            <input
                              type="range"
                              min="80"
                              max="300"
                              value={capsuleHeight}
                              onChange={(e) =>
                                setCapsuleHeight(Number(e.target.value))
                              }
                              className="w-full accent-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-zinc-500 uppercase">
                              Font Size ({capsuleFontSize}px)
                            </label>
                            <input
                              type="range"
                              min="20"
                              max="80"
                              value={capsuleFontSize}
                              onChange={(e) =>
                                setCapsuleFontSize(Number(e.target.value))
                              }
                              className="w-full accent-primary"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {bannerType === "custom" && (
                      <div className="border border-zinc-800 p-3 bg-zinc-950">
                        <label className="block text-[9px] text-zinc-500 uppercase mb-1">
                          Banner Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://example.com/banner.png"
                          value={customBannerUrl}
                          onChange={(e) => setCustomBannerUrl(e.target.value)}
                          className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                        />
                      </div>
                    )}

                    {bannerType !== "none" && (
                      <div>
                        <label className="block text-[9px] text-zinc-500 uppercase font-bold mb-1">
                          Banner Alignment
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {["left", "center", "right"].map((align) => (
                            <button
                              key={align}
                              onClick={() => setBannerAlign(align as any)}
                              className={`py-1 border text-[9px] uppercase font-bold cursor-pointer ${
                                bannerAlign === align
                                  ? "bg-primary text-primary-foreground border-foreground"
                                  : "bg-black border-zinc-800 hover:border-foreground"
                              }`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* Greetings */}
                <div>
                  <h3 className="font-bold text-primary text-xs uppercase mb-2">
                    Greeting Title
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-3">
                        <label className="block text-[9px] text-zinc-500 uppercase">
                          Title Header
                        </label>
                        <input
                          type="text"
                          value={greetingTitle}
                          onChange={(e) => setGreetingTitle(e.target.value)}
                          className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-zinc-500 uppercase">
                          Emoji
                        </label>
                        <input
                          type="text"
                          value={greetingEmoji}
                          onChange={(e) => setGreetingEmoji(e.target.value)}
                          className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-center text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase">
                        Subtitle Description
                      </label>
                      <input
                        type="text"
                        value={greetingSubtitle}
                        onChange={(e) => setGreetingSubtitle(e.target.value)}
                        className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* Typing SVG Generator */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-primary text-xs uppercase">
                      Animated Typing text
                    </h3>
                    <input
                      type="checkbox"
                      checked={showTyping}
                      onChange={(e) => setShowTyping(e.target.checked)}
                      className="accent-primary h-4 w-4 cursor-pointer"
                    />
                  </div>

                  {showTyping && (
                    <div className="border border-zinc-800 p-3 bg-zinc-950 space-y-3">
                      <div className="space-y-2">
                        <label className="block text-[9px] text-zinc-500 uppercase font-bold">
                          Text lines
                        </label>
                        {typingLines.map((line, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={line}
                              onChange={(e) =>
                                updateTypingLine(idx, e.target.value)
                              }
                              className="flex-grow border border-foreground bg-black px-2 py-1 text-foreground"
                              placeholder={`Line ${idx + 1}`}
                            />
                            <button
                              onClick={() => removeTypingLine(idx)}
                              className="p-1 border border-zinc-700 text-destructive hover:border-destructive cursor-pointer bg-black"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={addTypingLine}
                          className="w-full py-1 border border-zinc-700 bg-black text-foreground hover:bg-zinc-900 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" /> Add Typing Line
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] text-zinc-500 uppercase">
                            Font Family
                          </label>
                          <select
                            value={typingFont}
                            onChange={(e) => setTypingFont(e.target.value)}
                            className="w-full border border-foreground bg-black px-1.5 py-1 text-foreground"
                          >
                            <option value="Fira Code">Fira Code</option>
                            <option value="Inter">Inter</option>
                            <option value="Nunito">Nunito</option>
                            <option value="Ubuntu">Ubuntu</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Playfair Display">Playfair</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-zinc-500 uppercase">
                            Text color (Hex)
                          </label>
                          <div className="flex gap-1.5 items-center">
                            <input
                              type="color"
                              value={typingColor}
                              onChange={(e) => setTypingColor(e.target.value)}
                              className="h-6 w-8 border border-foreground bg-black cursor-pointer"
                            />
                            <input
                              type="text"
                              value={typingColor}
                              onChange={(e) => setTypingColor(e.target.value)}
                              className="w-full border border-foreground bg-black px-1 py-0.5 text-[10px] text-foreground"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[9px] text-zinc-500 uppercase">
                            Size ({typingSize}px)
                          </label>
                          <input
                            type="number"
                            value={typingSize}
                            onChange={(e) =>
                              setTypingSize(Number(e.target.value))
                            }
                            className="w-full border border-foreground bg-black px-1 py-0.5"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-zinc-500 uppercase">
                            Align
                          </label>
                          <select
                            value={typingAlign}
                            onChange={(e) =>
                              setTypingAlign(e.target.value as any)
                            }
                            className="w-full border border-foreground bg-black px-1 py-0.5 cursor-pointer"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] text-zinc-500 uppercase">
                            Width ({typingWidth}px)
                          </label>
                          <input
                            type="number"
                            value={typingWidth}
                            onChange={(e) =>
                              setTypingWidth(Number(e.target.value))
                            }
                            className="w-full border border-foreground bg-black px-1 py-0.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="border-zinc-800" />

                {/* Profile Views Counter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-primary text-xs uppercase">
                      Visitor Counter
                    </h3>
                    <input
                      type="checkbox"
                      checked={showVisitorCounter}
                      onChange={(e) => setShowVisitorCounter(e.target.checked)}
                      className="accent-primary h-4 w-4 cursor-pointer"
                    />
                  </div>

                  {showVisitorCounter && (
                    <div className="border border-zinc-800 p-3 bg-zinc-950 space-y-3">
                      <div>
                        <label className="block text-[9px] text-zinc-500 uppercase">
                          Visitor Label
                        </label>
                        <input
                          type="text"
                          value={visitorLabel}
                          onChange={(e) => setVisitorLabel(e.target.value)}
                          className="w-full border border-foreground bg-black px-2 py-1 text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-zinc-500 uppercase">
                          Visitor Badge Style
                        </label>
                        <select
                          value={visitorStyle}
                          onChange={(e) =>
                            setVisitorStyle(e.target.value as any)
                          }
                          className="w-full border border-foreground bg-black px-1.5 py-1 text-foreground cursor-pointer"
                        >
                          <option value="flat-square">Flat Square</option>
                          <option value="for-the-badge">For the Badge</option>
                          <option value="flat">Flat Standard</option>
                          <option value="plastic">Plastic</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 📝 TAB 2: ABOUT ME */}
            {activeTab === "about" && (
              <div className="space-y-4">
                <h3 className="font-bold text-primary text-xs uppercase">
                  Profile & Bio Bullet Points
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase">
                      Pronouns
                    </label>
                    <input
                      type="text"
                      value={pronouns}
                      onChange={(e) => setPronouns(e.target.value)}
                      placeholder="she/her"
                      className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase">
                      Job Status
                    </label>
                    <input
                      type="text"
                      value={jobStatus}
                      onChange={(e) => setJobStatus(e.target.value)}
                      placeholder="Software Engineer"
                      className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase">
                      Contact Email
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@domain.com"
                      className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-500 uppercase">
                    I'm currently working on
                  </label>
                  <input
                    type="text"
                    value={workingOn}
                    onChange={(e) => setWorkingOn(e.target.value)}
                    className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-500 uppercase">
                    I'm currently learning
                  </label>
                  <input
                    type="text"
                    value={learning}
                    onChange={(e) => setLearning(e.target.value)}
                    className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-500 uppercase">
                    I'm looking to collaborate on
                  </label>
                  <input
                    type="text"
                    value={collab}
                    onChange={(e) => setCollab(e.target.value)}
                    className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-500 uppercase">
                    I'm looking for help with
                  </label>
                  <input
                    type="text"
                    value={help}
                    onChange={(e) => setHelp(e.target.value)}
                    className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-500 uppercase">
                    Ask me about
                  </label>
                  <input
                    type="text"
                    value={askMe}
                    onChange={(e) => setAskMe(e.target.value)}
                    placeholder="React, GraphQL, etc."
                    className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase">
                      Portfolio Website URL
                    </label>
                    <input
                      type="text"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://site.com"
                      className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase">
                      Resume URL
                    </label>
                    <input
                      type="text"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://site.com/cv.pdf"
                      className="w-full border border-foreground bg-black px-2 py-1.5 text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-500 uppercase">
                    Fun Fact
                  </label>
                  <textarea
                    value={funFact}
                    onChange={(e) => setFunFact(e.target.value)}
                    className="w-full border border-foreground bg-black px-2 py-1 h-14 text-foreground focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 🛠️ TAB 3: TECH STACK & SKILLS */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                <h3 className="font-bold text-primary text-xs uppercase">
                  Tech Stack & Tools
                </h3>

                {/* Visual Settings */}
                <div className="border border-zinc-800 p-3 bg-zinc-950 space-y-3">
                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase font-bold">
                      Display Style
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => setTechStyleMode("badges")}
                        className={`py-1.5 border text-[9px] uppercase font-bold cursor-pointer ${
                          techStyleMode === "badges"
                            ? "bg-primary text-primary-foreground border-foreground"
                            : "bg-black border-zinc-800 hover:border-foreground"
                        }`}
                      >
                        Shields.io Badges
                      </button>
                      <button
                        onClick={() => setTechStyleMode("skillicons")}
                        className={`py-1.5 border text-[9px] uppercase font-bold cursor-pointer ${
                          techStyleMode === "skillicons"
                            ? "bg-primary text-primary-foreground border-foreground"
                            : "bg-black border-zinc-800 hover:border-foreground"
                        }`}
                      >
                        Skill Icons
                      </button>
                    </div>
                  </div>

                  {techStyleMode === "badges" && (
                    <>
                      <div>
                        <label className="block text-[9px] text-zinc-500 uppercase">
                          Badge Styling
                        </label>
                        <select
                          value={badgeStyle}
                          onChange={(e) => setBadgeStyle(e.target.value as any)}
                          className="w-full border border-foreground bg-black px-1.5 py-1 text-[10px] text-foreground cursor-pointer"
                        >
                          <option value="for-the-badge">For the Badge</option>
                          <option value="flat-square">Flat Square</option>
                          <option value="flat">Flat Standard</option>
                          <option value="plastic">Plastic</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold mt-1">
                        <input
                          type="checkbox"
                          checked={techGroupByCat}
                          onChange={(e) => setTechGroupByCat(e.target.checked)}
                          className="accent-primary"
                        />
                        <span>Group Badges by Category</span>
                      </label>
                    </>
                  )}

                  {techStyleMode === "skillicons" && (
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase">
                        Skill Icons Theme
                      </label>
                      <select
                        value={skillIconsTheme}
                        onChange={(e) =>
                          setSkillIconsTheme(e.target.value as any)
                        }
                        className="w-full border border-foreground bg-black px-1.5 py-1 text-[10px] text-foreground cursor-pointer"
                      >
                        <option value="dark">Dark Theme</option>
                        <option value="light">Light Theme</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Tech Selection Workspace */}
                <div className="space-y-3">
                  <div className="flex gap-2 items-center border border-zinc-800 bg-zinc-950 px-2 py-1">
                    <Search className="h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="SEARCH SKILLS..."
                      value={skillsSearch}
                      onChange={(e) => setSkillsSearch(e.target.value)}
                      className="flex-grow bg-transparent border-0 text-[10px] text-foreground focus:outline-none uppercase font-bold"
                    />
                    {skillsSearch && (
                      <button
                        onClick={() => setSkillsSearch("")}
                        className="text-zinc-500 hover:text-foreground"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end text-[9px] uppercase font-bold">
                    <button
                      onClick={() => {
                        const allNames = techCategories.flatMap((c) =>
                          c.items.map((i) => i.name),
                        );
                        setSelectedTechs(allNames);
                      }}
                      className="text-primary hover:underline"
                    >
                      [Select All]
                    </button>
                    <button
                      onClick={() => setSelectedTechs([])}
                      className="text-destructive hover:underline"
                    >
                      [Clear All]
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {getFilteredCategories().map((cat, idx) => (
                      <div
                        key={idx}
                        className="space-y-1.5 border border-zinc-900 p-2 bg-zinc-950"
                      >
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase border-b border-zinc-900 pb-0.5">
                          {cat.category}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.items.map((item) => {
                            const isSelected = selectedTechs.includes(
                              item.name,
                            );
                            return (
                              <button
                                key={item.name}
                                onClick={() => toggleTech(item.name)}
                                className={`px-2 py-1 border text-[9px] font-bold uppercase cursor-pointer transition-all ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground border-foreground shadow-[1px_1px_0px_0px_#ffffff]"
                                    : "border-zinc-800 text-zinc-500 hover:border-zinc-700 bg-black"
                                }`}
                              >
                                {item.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 📊 TAB 4: GITHUB STATS */}
            {activeTab === "stats" && (
              <div className="space-y-4">
                <h3 className="font-bold text-primary text-xs uppercase">
                  GitHub Telemetry Cards
                </h3>

                <div>
                  <label className="block text-[9px] text-zinc-500 uppercase font-bold">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    className="w-full border-2 border-foreground bg-black px-2 py-1.5 text-foreground font-bold"
                    placeholder="octocat"
                  />
                </div>

                <div className="space-y-3">
                  {/* Stats Card */}
                  <div className="border border-zinc-900 bg-zinc-950 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold uppercase text-[10px]">
                        <input
                          type="checkbox"
                          checked={showStatsCard}
                          onChange={(e) => setShowStatsCard(e.target.checked)}
                          className="accent-primary"
                        />
                        <span>GitHub Stats Card</span>
                      </label>
                    </div>

                    {showStatsCard && (
                      <div className="grid grid-cols-2 gap-2 text-[9px] mt-2 border-t border-zinc-900 pt-2">
                        <div>
                          <label className="block text-zinc-500 uppercase">
                            Theme
                          </label>
                          <select
                            value={statsTheme}
                            onChange={(e) => setStatsTheme(e.target.value)}
                            className="w-full border border-foreground bg-black px-1 py-0.5"
                          >
                            <option value="dark">Dark</option>
                            <option value="radical">Radical</option>
                            <option value="merko">Merko</option>
                            <option value="gruvbox">Gruvbox</option>
                            <option value="tokyonight">Tokyo Night</option>
                            <option value="dracula">Dracula</option>
                            <option value="highcontrast">High Contrast</option>
                          </select>
                        </div>
                        <div className="space-y-1 self-end font-bold">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={statsShowIcons}
                              onChange={(e) =>
                                setStatsShowIcons(e.target.checked)
                              }
                              className="accent-primary"
                            />
                            <span>Icons</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={statsPrivateCommits}
                              onChange={(e) =>
                                setStatsPrivateCommits(e.target.checked)
                              }
                              className="accent-primary"
                            />
                            <span>Private Commits</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Streak Stats */}
                  <div className="border border-zinc-900 bg-zinc-950 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold uppercase text-[10px]">
                        <input
                          type="checkbox"
                          checked={showStreakCard}
                          onChange={(e) => setShowStreakCard(e.target.checked)}
                          className="accent-primary"
                        />
                        <span>GitHub Streak Card</span>
                      </label>
                    </div>

                    {showStreakCard && (
                      <div className="text-[9px] mt-2 border-t border-zinc-900 pt-2">
                        <label className="block text-zinc-500 uppercase">
                          Theme
                        </label>
                        <select
                          value={streakTheme}
                          onChange={(e) => setStreakTheme(e.target.value)}
                          className="w-full border border-foreground bg-black px-1.5 py-0.5"
                        >
                          <option value="dark">Dark</option>
                          <option value="radical">Radical</option>
                          <option value="merko">Merko</option>
                          <option value="gruvbox">Gruvbox</option>
                          <option value="tokyonight">Tokyo Night</option>
                          <option value="dracula">Dracula</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Top Languages */}
                  <div className="border border-zinc-900 bg-zinc-950 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold uppercase text-[10px]">
                        <input
                          type="checkbox"
                          checked={showLangsCard}
                          onChange={(e) => setShowLangsCard(e.target.checked)}
                          className="accent-primary"
                        />
                        <span>Top Languages Card</span>
                      </label>
                    </div>

                    {showLangsCard && (
                      <div className="grid grid-cols-2 gap-2 text-[9px] mt-2 border-t border-zinc-900 pt-2">
                        <div>
                          <label className="block text-zinc-500 uppercase">
                            Layout
                          </label>
                          <select
                            value={langsLayout}
                            onChange={(e) =>
                              setLangsLayout(e.target.value as any)
                            }
                            className="w-full border border-foreground bg-black px-1 py-0.5 cursor-pointer"
                          >
                            <option value="compact">Compact</option>
                            <option value="classic">Classic</option>
                            <option value="donut">Donut</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase">
                            Theme
                          </label>
                          <select
                            value={langsTheme}
                            onChange={(e) => setLangsTheme(e.target.value)}
                            className="w-full border border-foreground bg-black px-1 py-0.5"
                          >
                            <option value="dark">Dark</option>
                            <option value="radical">Radical</option>
                            <option value="merko">Merko</option>
                            <option value="gruvbox">Gruvbox</option>
                            <option value="tokyonight">Tokyo Night</option>
                            <option value="dracula">Dracula</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Activity Graph */}
                  <div className="border border-zinc-900 bg-zinc-950 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold uppercase text-[10px]">
                        <input
                          type="checkbox"
                          checked={showGraphCard}
                          onChange={(e) => setShowGraphCard(e.target.checked)}
                          className="accent-primary"
                        />
                        <span>Activity Graph</span>
                      </label>
                    </div>

                    {showGraphCard && (
                      <div className="text-[9px] mt-2 border-t border-zinc-900 pt-2">
                        <label className="block text-zinc-500 uppercase">
                          Theme
                        </label>
                        <select
                          value={graphTheme}
                          onChange={(e) => setGraphTheme(e.target.value)}
                          className="w-full border border-foreground bg-black px-1.5 py-0.5"
                        >
                          <option value="dark">Dark</option>
                          <option value="radical">Radical</option>
                          <option value="merko">Merko</option>
                          <option value="tokyonight">Tokyo Night</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Trophies */}
                  <div className="border border-zinc-900 bg-zinc-950 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold uppercase text-[10px]">
                        <input
                          type="checkbox"
                          checked={showTrophyCard}
                          onChange={(e) => setShowTrophyCard(e.target.checked)}
                          className="accent-primary"
                        />
                        <span>GitHub Trophies</span>
                      </label>
                    </div>

                    {showTrophyCard && (
                      <div className="grid grid-cols-2 gap-2 text-[9px] mt-2 border-t border-zinc-900 pt-2">
                        <div>
                          <label className="block text-zinc-500 uppercase">
                            Theme
                          </label>
                          <select
                            value={trophyTheme}
                            onChange={(e) => setTrophyTheme(e.target.value)}
                            className="w-full border border-foreground bg-black px-1 py-0.5"
                          >
                            <option value="radical">Radical</option>
                            <option value="dark">Dark</option>
                            <option value="merko">Merko</option>
                            <option value="tokyonight">Tokyo Night</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase font-bold">
                            Columns ({trophyColumns})
                          </label>
                          <input
                            type="number"
                            min="2"
                            max="8"
                            value={trophyColumns}
                            onChange={(e) =>
                              setTrophyColumns(Number(e.target.value))
                            }
                            className="w-full border border-foreground bg-black px-1 py-0.5"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* LeetCode Card */}
                  <div className="border border-zinc-900 bg-zinc-950 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold uppercase text-[10px]">
                        <input
                          type="checkbox"
                          checked={showLeetcodeCard}
                          onChange={(e) =>
                            setShowLeetcodeCard(e.target.checked)
                          }
                          className="accent-primary"
                        />
                        <span>LeetCode Stats</span>
                      </label>
                    </div>

                    {showLeetcodeCard && (
                      <div className="grid grid-cols-2 gap-2 text-[9px] mt-2 border-t border-zinc-900 pt-2">
                        <div>
                          <label className="block text-zinc-500 uppercase font-bold">
                            Username
                          </label>
                          <input
                            type="text"
                            value={leetcodeUser}
                            onChange={(e) => setLeetcodeUser(e.target.value)}
                            className="w-full border border-foreground bg-black px-1 py-0.5 text-foreground font-bold"
                            placeholder="leetcode_username"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 uppercase">
                            Theme
                          </label>
                          <select
                            value={leetcodeTheme}
                            onChange={(e) => setLeetcodeTheme(e.target.value)}
                            className="w-full border border-foreground bg-black px-1 py-0.5 cursor-pointer"
                          >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="radical">Radical</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Jokes Card */}
                  <div className="border border-zinc-900 bg-zinc-950 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold uppercase text-[10px]">
                        <input
                          type="checkbox"
                          checked={showJokesCard}
                          onChange={(e) => setShowJokesCard(e.target.checked)}
                          className="accent-primary"
                        />
                        <span>Readme Jokes Card</span>
                      </label>
                    </div>

                    {showJokesCard && (
                      <div className="text-[9px] mt-2 border-t border-zinc-900 pt-2">
                        <label className="block text-zinc-500 uppercase">
                          Theme
                        </label>
                        <select
                          value={jokesTheme}
                          onChange={(e) => setJokesTheme(e.target.value)}
                          className="w-full border border-foreground bg-black px-1.5 py-0.5"
                        >
                          <option value="dark">Dark</option>
                          <option value="radical">Radical</option>
                          <option value="merko">Merko</option>
                          <option value="tokyonight">Tokyo Night</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 🤝 TAB 5: SOCIAL CONNECTIONS */}
            {activeTab === "socials" && (
              <div className="space-y-4">
                <h3 className="font-bold text-primary text-xs uppercase">
                  Social Connections
                </h3>

                <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                  {[
                    { key: "linkedin", label: "LinkedIn" },
                    { key: "twitter", label: "Twitter / X" },
                    { key: "youtube", label: "YouTube" },
                    { key: "medium", label: "Medium" },
                    { key: "devto", label: "Dev.to" },
                    { key: "hashnode", label: "Hashnode" },
                    { key: "stackoverflow", label: "StackOverflow ID" },
                    { key: "discord", label: "Discord Invite" },
                    { key: "telegram", label: "Telegram ID" },
                    { key: "instagram", label: "Instagram" },
                    { key: "twitch", label: "Twitch ID" },
                    { key: "mastodon", label: "Mastodon handle" },
                    { key: "facebook", label: "Facebook" },
                    { key: "substack", label: "Substack handle" },
                  ].map((social) => (
                    <div key={social.key} className="space-y-1">
                      <label className="block text-[9px] text-zinc-500 uppercase font-bold">
                        {social.label}
                      </label>
                      <input
                        type="text"
                        value={socialLinks[social.key] || ""}
                        onChange={(e) =>
                          updateSocialLink(social.key, e.target.value)
                        }
                        placeholder="username"
                        className="w-full border border-foreground bg-black px-2 py-1 text-foreground"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ☕ TAB 6: SUPPORT & COFFEE */}
            {activeTab === "support" && (
              <div className="space-y-4">
                <h3 className="font-bold text-primary text-xs uppercase">
                  Support & Custom sections
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase">
                        Buy Me a Coffee ID
                      </label>
                      <input
                        type="text"
                        value={supportBmc}
                        onChange={(e) => setSupportBmc(e.target.value)}
                        placeholder="username"
                        className="w-full border border-foreground bg-black px-2 py-1 text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase">
                        Ko-fi ID
                      </label>
                      <input
                        type="text"
                        value={supportKofi}
                        onChange={(e) => setSupportKofi(e.target.value)}
                        placeholder="username"
                        className="w-full border border-foreground bg-black px-2 py-1 text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase">
                        Patreon Username
                      </label>
                      <input
                        type="text"
                        value={supportPatreon}
                        onChange={(e) => setSupportPatreon(e.target.value)}
                        placeholder="username"
                        className="w-full border border-foreground bg-black px-2 py-1 text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase">
                        PayPal Handle
                      </label>
                      <input
                        type="text"
                        value={supportPaypal}
                        onChange={(e) => setSupportPaypal(e.target.value)}
                        placeholder="username"
                        className="w-full border border-foreground bg-black px-2 py-1 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                <div>
                  <label className="block text-[10px] text-primary font-bold uppercase mb-1">
                    Custom Extra Markdown
                  </label>
                  <textarea
                    value={customMarkdown}
                    onChange={(e) => setCustomMarkdown(e.target.value)}
                    className="w-full border border-foreground bg-black px-2 py-1.5 h-32 text-foreground font-mono text-[10px] focus:outline-none focus:border-primary"
                    placeholder="### 📊 Pinned Projects..."
                  />
                </div>
              </div>
            )}

            {/* ⚙️ TAB 7: SECTION LAYOUT ORDER */}
            {activeTab === "layout" && (
              <div className="space-y-4">
                <h3 className="font-bold text-primary text-xs uppercase">
                  README Section Sequence
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase leading-relaxed">
                  Arrange the vertical layout order of your generated README.md.
                  Click the up/down arrows to shift elements.
                </p>

                <div className="space-y-2 border border-zinc-800 bg-zinc-950 p-3">
                  {sectionOrder.map((sectionId, idx) => (
                    <div
                      key={sectionId}
                      className="flex items-center justify-between border border-zinc-900 bg-black p-2.5 font-mono text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-600 font-bold w-4">
                          {idx + 1}.
                        </span>
                        <span className="font-bold text-foreground">
                          {sectionNames[sectionId] || sectionId}
                        </span>
                      </div>

                      {/* Reordering triggers */}
                      <div className="flex gap-1.5">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, "up")}
                          className={`p-1 border border-zinc-800 hover:border-foreground bg-zinc-950 cursor-pointer disabled:opacity-30 disabled:hover:border-zinc-800 disabled:cursor-not-allowed`}
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5 text-zinc-400" />
                        </button>
                        <button
                          disabled={idx === sectionOrder.length - 1}
                          onClick={() => moveSection(idx, "down")}
                          className={`p-1 border border-zinc-800 hover:border-foreground bg-zinc-950 cursor-pointer disabled:opacity-30 disabled:hover:border-zinc-800 disabled:cursor-not-allowed`}
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5 text-zinc-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PREVIEW PANEL - 6 Columns ── */}
        <div className={`${isFullscreen ? "lg:col-span-12" : "lg:col-span-6"} border-2 border-foreground bg-[#0a0a0c] flex flex-col min-h-[680px]`}>
          {/* Preview Toolbar */}
          <div className="border-b border-foreground p-3 bg-black flex flex-wrap items-center justify-between gap-3 select-none">
            {/* Preview Modes */}
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode("preview")}
                className={`px-3 py-1.5 border-2 text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  previewMode === "preview"
                    ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_#000]"
                    : "bg-black border-zinc-800 hover:border-foreground text-zinc-400 hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>HTML Preview</span>
              </button>

              <button
                onClick={() => setPreviewMode("code")}
                className={`px-3 py-1.5 border-2 text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  previewMode === "code"
                    ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_#000]"
                    : "bg-black border-zinc-800 hover:border-foreground text-zinc-400 hover:text-foreground"
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                <span>Markdown Code</span>
              </button>
            </div>

            {/* Toolbar Actions */}
            <div className="flex items-center gap-3">
              {/* Theme toggle for Preview */}
              {previewMode === "preview" && (
                <div className="flex border border-zinc-800 bg-black text-[9px] uppercase font-bold overflow-hidden">
                  <button
                    onClick={() => setPreviewTheme("dark")}
                    className={`px-2 py-0.5 ${previewTheme === "dark" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-foreground cursor-pointer"}`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setPreviewTheme("light")}
                    className={`px-2 py-0.5 ${previewTheme === "light" ? "bg-zinc-200 text-black border-l border-zinc-850" : "text-zinc-500 hover:text-foreground cursor-pointer border-l border-zinc-800"}`}
                  >
                    Light
                  </button>
                </div>
              )}

              <CopyButton text={generatedMarkdown} />

              <button
                onClick={handleDownload}
                className="px-2 py-1.5 border-2 border-foreground bg-black hover:bg-zinc-900 text-foreground shadow-[2px_2px_0px_0px_#ffffff] text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-2 py-1.5 border-2 border-foreground bg-black hover:bg-zinc-900 text-foreground shadow-[2px_2px_0px_0px_#ffffff] text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview/Code"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
                <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="flex-grow p-4 bg-zinc-950 overflow-auto">
            {previewMode === "preview" ? (
              <div className="border border-zinc-800 rounded overflow-hidden shadow-lg bg-black">
                {/* Repository Header Box */}
                <div className="bg-zinc-900/40 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between select-none">
                  <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-sans">
                    <BookOpen className="h-4 w-4 text-zinc-500" />
                    <span className="font-semibold text-zinc-300">README</span>
                    <span className="text-zinc-500">.md</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-sans">
                    {new Blob([generatedMarkdown]).size} Bytes
                  </div>
                </div>

                {/* Content rendering box */}
                <div
                  className={`p-6 font-sans ${
                    previewTheme === "dark"
                      ? "bg-[#0d1117] text-[#c9d1d9]"
                      : "bg-[#ffffff] text-[#24292f]"
                  }`}
                >
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                    .readme-preview-content-dark h1 {
                      font-size: 1.8rem;
                      font-weight: 600;
                      border-bottom: 1px solid #21262d;
                      padding-bottom: 0.3rem;
                      margin-top: 1.5rem;
                      margin-bottom: 0.8rem;
                      color: #f0f6fc;
                    }
                    .readme-preview-content-dark h2 {
                      font-size: 1.4rem;
                      font-weight: 600;
                      border-bottom: 1px solid #21262d;
                      padding-bottom: 0.2rem;
                      margin-top: 1.3rem;
                      margin-bottom: 0.7rem;
                      color: #f0f6fc;
                    }
                    .readme-preview-content-dark h3 {
                      font-size: 1.2rem;
                      font-weight: 600;
                      margin-top: 1.1rem;
                      margin-bottom: 0.6rem;
                      color: #f0f6fc;
                    }
                    .readme-preview-content-dark p {
                      margin-top: 0.5rem;
                      margin-bottom: 0.8rem;
                      line-height: 1.6;
                      color: #c9d1d9;
                    }
                    .readme-preview-content-dark a {
                      color: #58a6ff;
                      text-decoration: none;
                      font-weight: 600;
                    }
                    .readme-preview-content-dark a:hover {
                      text-decoration: underline;
                    }
                    .readme-preview-content-dark img {
                      display: inline-block !important;
                      vertical-align: middle;
                      margin: 4px 2px;
                      max-width: 100%;
                    }
                    .readme-preview-content-dark ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                      margin-bottom: 1rem;
                      color: #c9d1d9;
                    }
                    .readme-preview-content-dark li {
                      margin-bottom: 0.25rem;
                    }
                    .readme-preview-content-dark hr {
                      border: 0;
                      border-bottom: 1px solid #21262d;
                      margin: 1.5rem 0;
                    }
                    .readme-preview-content-dark pre {
                      background-color: #161b22;
                      padding: 1rem;
                      border-radius: 6px;
                      overflow-x: auto;
                      margin-bottom: 1rem;
                    }
                    .readme-preview-content-dark code {
                      font-family: monospace;
                      background-color: rgba(110, 118, 129, 0.4);
                      padding: 0.2rem 0.4rem;
                      border-radius: 6px;
                      font-size: 85%;
                      color: #f0f6fc;
                    }
                    .readme-preview-content-dark pre code {
                      background-color: transparent;
                      padding: 0;
                      color: #c9d1d9;
                    }

                    .readme-preview-content-light h1 {
                      font-size: 1.8rem;
                      font-weight: 600;
                      border-bottom: 1px solid #d0d7de;
                      padding-bottom: 0.3rem;
                      margin-top: 1.5rem;
                      margin-bottom: 0.8rem;
                      color: #24292f;
                    }
                    .readme-preview-content-light h2 {
                      font-size: 1.4rem;
                      font-weight: 600;
                      border-bottom: 1px solid #d0d7de;
                      padding-bottom: 0.2rem;
                      margin-top: 1.3rem;
                      margin-bottom: 0.7rem;
                      color: #24292f;
                    }
                    .readme-preview-content-light h3 {
                      font-size: 1.2rem;
                      font-weight: 600;
                      margin-top: 1.1rem;
                      margin-bottom: 0.6rem;
                      color: #24292f;
                    }
                    .readme-preview-content-light p {
                      margin-top: 0.5rem;
                      margin-bottom: 0.8rem;
                      line-height: 1.6;
                      color: #24292f;
                    }
                    .readme-preview-content-light a {
                      color: #0969da;
                      text-decoration: none;
                      font-weight: 600;
                    }
                    .readme-preview-content-light a:hover {
                      text-decoration: underline;
                    }
                    .readme-preview-content-light img {
                      display: inline-block !important;
                      vertical-align: middle;
                      margin: 4px 2px;
                      max-width: 100%;
                    }
                    .readme-preview-content-light ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                      margin-bottom: 1rem;
                      color: #24292f;
                    }
                    .readme-preview-content-light li {
                      margin-bottom: 0.25rem;
                    }
                    .readme-preview-content-light hr {
                      border: 0;
                      border-bottom: 1px solid #d0d7de;
                      margin: 1.5rem 0;
                    }
                    .readme-preview-content-light pre {
                      background-color: #f6f8fa;
                      padding: 1rem;
                      border-radius: 6px;
                      overflow-x: auto;
                      margin-bottom: 1rem;
                    }
                    .readme-preview-content-light code {
                      font-family: monospace;
                      background-color: rgba(175, 184, 193, 0.2);
                      padding: 0.2rem 0.4rem;
                      border-radius: 6px;
                      font-size: 85%;
                      color: #24292f;
                    }
                    .readme-preview-content-light pre code {
                      background-color: transparent;
                      padding: 0;
                      color: #24292f;
                    }
                  `,
                    }}
                  />
                  <div
                    className={`readme-preview-content-${previewTheme}`}
                    dangerouslySetInnerHTML={{
                      __html:
                        renderedHtml ||
                        "<p class='text-zinc-500 italic'>No content generated yet.</p>",
                    }}
                  />
                </div>
              </div>
            ) : (
              /* Raw Code display */
              <pre className="bg-black border border-zinc-800 p-4 text-[10px] text-zinc-300 overflow-x-auto leading-relaxed select-all whitespace-pre-wrap font-mono h-full">
                <code>{generatedMarkdown}</code>
              </pre>
            )}
          </div>

          {/* Footer tips */}
          <div className="border-t border-foreground bg-black p-3 text-[10px] text-zinc-500 select-none flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>
              Copy and paste this compiled markdown directly into your GitHub
              profile repository README.md.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
