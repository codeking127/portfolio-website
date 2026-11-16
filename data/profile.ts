// ─────────────────────────────────────────────────────────────
//  Everything on the site that is about you lives in this file.
//  Edit text, links, numbers and photos here; the layout picks it up.
//  Photos and videos go in /public/assets and are referenced as "/assets/<file>".
// ─────────────────────────────────────────────────────────────

export const links = {
  linkedin: "https://www.linkedin.com/in/aryanjain01/",
  github: "https://github.com/codeking127",
  githubCollege: "https://github.com/AryanJain22",
};

// A piece of the hero description: plain text, or a phrase that opens a window when clicked.
export type Segment = string | { text: string; open: "code" | "run" | "music" | "origami" | "lang" | "animals" | "journey" };

export const intro = {
  hello: "Hello, world! ( ^ ω ^ )",
  firstName: "Aryan",
  lastName: "Jain",
  // "Software engineer" stays; the second half flips through these, folding like paper
  rolePrefix: "Software engineer",
  roles: ["& runner", "& musician", "& origami folder", "& language learner", "& animal lover"],
  description: [
    "I build ",
    { text: "Python tools at HSBC", open: "code" },
    " that turn slow, repetitive work into something people can run in a few clicks. Off the clock I'm training for the ",
    { text: "Khardung La ultra", open: "run" },
    ", ",
    { text: "making music", open: "music" },
    ", ",
    { text: "folding paper", open: "origami" },
    " and ",
    { text: "learning Japanese and French", open: "lang" },
    ".",
  ] as Segment[],
};

export const about = {
  avatar: { src: "/assets/avatar.jpg", alt: "Aryan after finishing a 10K", zoom: "/assets/run-medal.jpg", cap: "10K done, medal on." },
  title: "Hi, I'm Aryan.",
  role: "Software Engineer · HSBC",
  glance: [
    { label: "Currently", value: "Software Engineer, HSBC" },
    { label: "Building", value: "CORE, a no-code platform" },
    { label: "Training for", value: "Khardung La ultra, 2027" },
    { label: "Learning", value: "日本語 · Français" },
  ],
  // shown as a pull quote between the paragraphs
  quote: "I like finding the repeating problem behind a pile of one-off tasks, and building the thing that makes it self-serve.",
  paragraphs: [
    "I work with financial data at HSBC, and most of my days go into Python tools. The kind that take a slow, manual process, the one somebody repeats every month in Excel, and turn it into something they can run themselves in a few clicks.",
    "The thing I'm proudest of is CORE, a no-code automation platform that more than 100 people now use to build their own workflows without waiting on a developer. I recently travelled to Chennai to demo it live to senior leadership.",
    "I care about clean architecture and code that holds up in production. Right now I'm going deeper into system design and backend engineering.",
    "Away from the keyboard I'm training for the Khardung La ultra, playing the Casio, mouth organ, guitar and a very new flute, folding paper into cranes and flowers, and learning Japanese and French. I also stop for every dog, cat and cow I pass.",
  ],
  signature: "Aryan",
};

// ── Code window ──────────────────────────────────────────────
export const codeIntro = {
  title: "Things I've built",
  text: "I like building software people actually use: internal platforms, data tools, and products for real businesses. Here's the work I'm proudest of, what each project does, and how it's made.",
  skills: [
    { group: "Languages", items: ["Python", "JavaScript", "PHP", "C++", "SQL"] },
    { group: "Frontend", items: ["React", "Vite", "Tailwind CSS", "HTML/CSS"] },
    { group: "Backend & data", items: ["FastAPI", "Express", "Firebase", "MySQL", "openpyxl"] },
    { group: "Tools", items: ["Docker", "Vercel", "Git", "Linux"] },
  ],
};

export type Project = {
  name: string;
  kind: string; // short label under the name
  badge: string;
  color: string;
  summary: string;
  points: string[];
  stack: string[];
  live?: string;
  code?: string;
  note?: string; // small print, e.g. why the repo is a trimmed version
  stats?: { value: string; label: string }[];
  photo?: { src: string; alt: string; cap: string; w: number; h: number };
};

// The first project is shown large as the featured one.
export const projects: Project[] = [
  {
    name: "CORE",
    kind: "No-code automation platform · HSBC",
    badge: "{ }",
    color: "#3b55d9",
    summary:
      "A desktop app that lets non-technical teams automate their Excel work without writing a line of code. You register your workbooks, build a numbered list of steps (copy, filter, formula, format, pivot, chart and more), save it as a reusable profile, and press Run.",
    points: [
      "Plug-in architecture: 11 step types wired through a single dispatch table, so adding a new one touches a small, fixed set of files.",
      "The engine never imports the UI and the UI never touches Excel. They talk only through a thread-safe log queue.",
      "Every run writes an HTML and XLSX audit report, so people can see exactly what changed.",
      "Demoed live to senior leadership at Finance Inspire in Chennai.",
    ],
    stats: [
      { value: "100+", label: "People using it" },
      { value: "11", label: "Step types" },
      { value: "0", label: "Code needed per workflow" },
    ],
    stack: ["Python", "Tkinter", "openpyxl", "xlwings"],
    code: "https://github.com/codeking127/CORE-Shadow",
    note: "The public repo is a trimmed showcase build. The internal version adds access control, an approval workflow, database integration and telemetry.",
    photo: { src: "/assets/chennai-demo.jpg", alt: "Aryan presenting CORE on stage in Chennai", cap: "presenting CORE live at Finance Inspire, Chennai", w: 1000, h: 667 },
  },
  {
    name: "EPTech",
    kind: "Environmental compliance tool",
    badge: "EP",
    color: "#2f9e6e",
    summary:
      "Built for EPTECH, an environmental-services firm working since 1999. When industries file their annual environmental statements they have to report the air pollutants their equipment emits. EPTech does that calculation for them.",
    points: [
      "Takes a flue-gas (stack) monitoring report and the source's running hours for the financial year.",
      "Covers DG sets, boilers, furnaces and other emission sources.",
      "Gives a backup calculation companies can rely on while filing.",
    ],
    stack: ["React", "Vercel"],
    live: "https://eptech.vercel.app/",
  },
  {
    name: "Pg-Mation",
    kind: "Full-stack property management",
    badge: "PG",
    color: "#7a5af5",
    summary:
      "A management system for paying-guest (PG) accommodation. Owners run rooms, tenants, visitors and rent from one dashboard instead of notebooks and spreadsheets.",
    points: [
      "Role-based accounts with email or Google sign-in.",
      "React + Vite frontend talking to a FastAPI backend.",
      "Backend containerised with Docker and set up to deploy on Render; frontend on Vercel.",
    ],
    stack: ["React", "Vite", "Tailwind CSS", "FastAPI", "Firebase", "Docker"],
    live: "https://pg-mation-six.vercel.app",
    code: "https://github.com/codeking127/Pg-Mation",
  },
  {
    name: "CommodityIQ",
    kind: "Market intelligence dashboard",
    badge: "IQ",
    color: "#d9822b",
    summary:
      "A daily briefing for natural-gas trading. It tracks NYMEX natural gas, converts it into an estimated MCX (India) price, and turns the numbers into a bullish or bearish read with trade levels.",
    points: [
      "Pulls NYMEX prices, USD/INR, EIA storage data and Henry Hub weather into one view.",
      "Technicals built in: RSI, MACD, 50 and 200-day moving averages, support and resistance.",
      "Fetches by itself at 19:00 IST, keeps a report history on the device and sends a browser notification when the day's report is ready.",
    ],
    stack: ["JavaScript", "HTML/CSS", "Vercel serverless", "Yahoo Finance", "EIA API", "Open-Meteo"],
    live: "https://commodity-iq-three.vercel.app",
    code: "https://github.com/codeking127/CommodityIQ",
  },
  {
    name: "Suraksha Setu",
    kind: "Emergency response platform · college team project",
    badge: "SS",
    color: "#d64d42",
    summary:
      "A platform that connects people, organisations and government bodies during emergencies. People can post requests for help, offer resources and coordinate in real time.",
    points: [
      "Community channels, live chat and emergency alerts.",
      "Maps to locate help nearby, plus local weather cards.",
      "Verified users and resources to keep out fraud.",
    ],
    stack: ["React", "Tailwind CSS", "Firebase", "Google Maps API", "TensorFlow.js"],
    live: "https://suraksha-setu.vercel.app",
    code: "https://github.com/AryanJain22/suraksha-setu",
  },
  {
    name: "UnderBelly",
    kind: "Food ordering · VIT Bhopal food court",
    badge: "UB",
    color: "#c2410c",
    summary:
      "Online ordering for the UnderBelly food court at VIT Bhopal. Students browse and search the menu, customise an order and place it, and the kitchen runs everything from an admin panel.",
    points: [
      "Customer site with categories, search and ordering.",
      "Admin panel for managing foods, categories and incoming orders.",
    ],
    stack: ["PHP", "MySQL", "CSS"],
    live: "https://under-belly-website.vercel.app",
    code: "https://github.com/AryanJain22/UnderBelly-Website",
  },
];

// Smaller builds, shown as a compact list at the bottom of the code window.
export const moreProjects = [
  { name: "backend-epic", text: "A small REST API", stack: "Node.js · Express", code: "https://github.com/AryanJain22/backend-epic" },
  { name: "Server_Performance", text: "Linux server performance scripts", stack: "Shell", code: "https://github.com/AryanJain22/Server_Performance" },
  { name: "PackMan", text: "An arcade maze game", stack: "C++", code: "https://github.com/AryanJain22/PackMan" },
  { name: "SnakeGame", text: "Classic snake in the browser", stack: "HTML · JavaScript", code: "https://github.com/AryanJain22/SnakeGame" },
  { name: "100DaysofCode", text: "A LeetCode problem every day", stack: "C++", code: "https://github.com/AryanJain22/100DaysofCode" },
  { name: "Javascript30", text: "30 small builds in vanilla JS", stack: "JavaScript", code: "https://github.com/AryanJain22/Javascript30" },
];

export type JourneyItem = {
  when: string;
  title: string;
  text: string;
  kind?: "now" | "highlight";
  photos?: { src: string; alt: string; cap: string; w: number; h: number }[];
};

export const journey: JourneyItem[] = [
  { when: "Now", title: "Software Engineer · HSBC", text: "Python automation for financial data teams.", kind: "now" },
  {
    when: "Recently · Chennai",
    title: "Demoed CORE to leadership",
    text: "A business trip to Finance Inspire in Chennai, where I demoed CORE, the no-code platform I built, live on stage to senior leadership.",
    kind: "highlight",
    photos: [
      { src: "/assets/chennai-demo.jpg", alt: "Aryan on stage presenting CORE at Finance Inspire, Chennai", cap: "Presenting CORE live at Finance Inspire, Chennai.", w: 1000, h: 667 },
      { src: "/assets/chennai-team.jpg", alt: "Aryan with two colleagues on stage at Finance Inspire", cap: "With the team after the demo.", w: 1000, h: 667 },
    ],
  },
  { when: "At HSBC", title: "Built CORE", text: "A no-code platform for Excel automation, now used by 100+ people." },
  { when: "Before", title: "B.Tech CSE · VIT Bhopal", text: "Where the coding started." },
];

export const instruments = [
  { name: "Casio", note: "Since childhood · try it below", level: 100 },
  { name: "Mouth organ", note: "3 years", level: 45 },
  { name: "Guitar", note: "1 year", level: 18 },
  { name: "Flute", note: "3 months · the newest one", level: 5 },
];

// Add a video file to /public/assets and set `src` to show it in the music window.
export const musicVideos: { label: string; src?: string }[] = [
  { label: "Casio" },
  { label: "Mouth organ" },
  { label: "Guitar" },
  { label: "Flute" },
];

export const running = {
  title: "I run. A lot.",
  note: "These numbers are only a recent slice from one app, not the whole story.",
  stats: [
    { value: "10K", label: "Race · medal ✓" },
    { value: "5:52", label: "Recent best /km" },
    { value: "2027", label: "Ultra goal" },
  ],
  clip: "/assets/run-clip.mp4",
  // [date, km, time, pace]
  recentRuns: [
    ["26 sep", 1.19, "7:36", "6:23"],
    ["29 sep", 2.84, "16:54", "5:57"],
    ["1 oct", 3.16, "20:26", "6:28"],
    ["2 oct", 3.17, "20:12", "6:22"],
    ["5 oct", 3.31, "21:07", "6:22"],
    ["21 oct", 4.03, "23:46", "5:53"],
    ["24 oct", 2.81, "17:48", "6:20"],
    ["26 oct", 3.02, "18:13", "6:01"],
    ["27 oct", 4.19, "25:36", "6:06"],
    ["31 oct", 10.02, "1:07:00", "6:41"],
    ["11 nov", 2.11, "12:24", "5:52"],
  ] as [string, number, string, string][],
  photos: [
    { src: "/assets/run-medal.jpg", alt: "Aryan with his 10K medal and bib 13175", cap: "10K · bib 13175", w: 720, h: 956 },
    { src: "/assets/run-stadium.jpg", alt: "Aryan in the stadium after the 10K", cap: "Finished, medal on.", w: 720, h: 956 },
  ],
  goal: {
    when: "Next up · 2027",
    title: "Khardung La Challenge ultra",
    text: "One of the highest ultramarathons in the world. Training starts now.",
  },
};

export const languages = {
  greetings: [
    ["Hello", "English"],
    ["नमस्ते", "Hindi"],
    ["こんにちは", "Japanese · learning"],
    ["Bonjour", "French · learning"],
    ["ありがとう", "Japanese · thank you"],
    ["Merci", "French · thank you"],
  ] as [string, string][],
  fluent: ["हिन्दी", "English"],
  learning: ["日本語 · Japanese", "Français · French"],
};

export const origami = {
  title: "One sheet, no cuts",
  photos: [
    { src: "/assets/origami-crane.jpg", alt: "Blue paper crane", cap: "Crane, folded from one square sheet.", short: "Crane", w: 720, h: 542 },
    { src: "/assets/origami-flower.jpg", alt: "Yellow eight-petal paper flower", cap: "Eight-petal flower.", short: "Eight-petal flower", w: 600, h: 797 },
    { src: "/assets/origami-bunny.jpg", alt: "Paper flower and bunny next to a bamboo flute", cap: "Bunny and flower, with my flute in the corner.", short: "Bunny + my flute", w: 720, h: 542 },
  ],
};

export const animals = {
  title: "Animal lover",
  text: "If there's a dog, cat or cow nearby, I've probably already said hi to it.",
  // add photos here the same way as origami.photos
  photos: [] as { src: string; alt: string; cap: string; short: string; w: number; h: number }[],
};
