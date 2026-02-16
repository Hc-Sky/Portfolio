/**
 * Desktop items configuration — centralized data for all desktop icons and their window content.
 * Each item defines its icon appearance, position on the desktop, and window content when opened.
 *
 * Layout:
 *   Top-left    → SystemLogs.app (narrative entry point) -- MOVED DOWN to clear sticky note
 *   Mid-left    → README.md (personal intro)
 *   Right col   → Projects (Nutrika → HNC Studio → Referentiel → GameOnWeb → KakouQuest)
 *   Bottom-center → CoreModules.app (technical stack) -- MOVED UP to clear dock
 *   Bottom-right  → Trash (decorative)
 */

export type DesktopItemType = "folder" | "file" | "terminal" | "trash";

export type WindowContentType =
    | "project"
    | "resume"
    | "contact"
    | "about"
    | "terminal"
    | "readme"
    | "core-modules";

/* ─── Project Section — consistent structure across all projects ─── */

export interface ProjectSection {
    heading: string;
    body: string;
}

export interface ProjectBullet {
    label: string;
    value: string;
}

export interface WindowConfig {
    title: string;
    contentType: WindowContentType;
    description?: string;
    /** Legacy bullet format (kept for compatibility) */
    bullets?: ProjectBullet[];
    /** New structured project sections — consistent across all projects */
    sections?: ProjectSection[];
    caseStudyUrl?: string;
}

export interface DesktopItem {
    id: string;
    label: string;
    type: DesktopItemType;
    /** Percentage-based position on the desktop (0–100) */
    position: { x: number; y: number };
    window: WindowConfig;
}

/* ═══════════════════════════════════════════════════════════
   DESKTOP ITEMS
   ═══════════════════════════════════════════════════════════ */

export const desktopItems: DesktopItem[] = [
    /* ─── Top-left — Narrative entry point (moved far down to clear sticky note) ─── */
    {
        id: "system-logs",
        label: "SystemLogs.app",
        type: "terminal",
        position: { x: 6, y: 60 }, // Moved y:35 -> y:60
        window: {
            title: "SystemLogs",
            contentType: "terminal",
        },
    },

    /* ─── Mid-left — Personal intro ─── */
    {
        id: "readme",
        label: "README.md",
        type: "file",
        position: { x: 6, y: 78 }, // Moved y:55 -> y:78
        window: {
            title: "README.md",
            contentType: "readme",
        },
    },

    /* ─── Right column — Projects (strategic order) ─── */
    // Moved x:92 -> x:88 (standard mac desktop padding)

    // 1. Nutrika — vision intelligente
    {
        id: "nutrika",
        label: "Nutrika.app",
        type: "folder",
        position: { x: 88, y: 8 },
        window: {
            title: "Nutrika",
            contentType: "project",
            sections: [
                {
                    heading: "Context",
                    body: "In early 2025, I wanted to build something that combined AI, real-time data, and a genuine everyday problem. Nutrition felt like the perfect domain — complex enough to be interesting, personal enough to care about.",
                },
                {
                    heading: "Problem",
                    body: "Most nutrition apps treat food as static data entry. They ignore what people actually have at home, what they like, and how their needs evolve. The result? Apps that feel like spreadsheets, not coaches.",
                },
                {
                    heading: "My Role",
                    body: "Sole developer — from system architecture to UI polish. I designed the database schema, built the API, integrated OpenAI for intelligent meal generation, and crafted the mobile experience from scratch.",
                },
                {
                    heading: "Technical Approach",
                    body: "React Native + Expo for the mobile client. NestJS + Prisma + PostgreSQL for a typed, scalable backend. OpenAI API for personalized recipe generation based on fridge inventory, dietary habits, and metabolic profile. Real-time sync between inventory, planning, and shopping lists.",
                },
                {
                    heading: "What I Learned",
                    body: "How to architect a full production system alone — from database migrations to API rate limiting to mobile state management. The hardest part wasn't the code, it was designing the data model to be flexible enough for AI-generated content while staying predictable for the user.",
                },
                {
                    heading: "Why It Matters",
                    body: "Nutrika isn't a school project. It's a real product I use daily. It taught me that building for yourself is the fastest way to build something good — because you're the hardest user to satisfy.",
                },
            ],
            caseStudyUrl: "/p/nutrika",
        },
    },

    // 2. HNC Studio — vision produit + structure
    {
        id: "hnc-studio",
        label: "HNCStudio.app",
        type: "folder",
        position: { x: 88, y: 24 },
        window: {
            title: "HNC Studio",
            contentType: "project",
            sections: [
                {
                    heading: "Context",
                    body: "HNC Studio started as a creative label — a way to sign my freelance work. Over time, it evolved into a full operational system: brand identity, internal ERP, client management, and a structured creative pipeline I call the Golden Path.",
                },
                {
                    heading: "Problem",
                    body: "Freelancing without structure leads to inconsistent quality and lost time. I needed a system that could handle client briefs, project tracking, invoicing, and creative direction — all in one place, all my way.",
                },
                {
                    heading: "My Role",
                    body: "Founder, designer, and developer. I built the brand from scratch, designed the visual identity in Figma, developed the web presence, and engineered the internal tools that keep everything running.",
                },
                {
                    heading: "Technical Approach",
                    body: "Next.js for the public-facing site with Framer Motion animations. Internal ERP built with a custom data layer. Figma for all design work. The Golden Path methodology structures every project from brief to delivery with clear milestones.",
                },
                {
                    heading: "What I Learned",
                    body: "That creative direction and development aren't separate skills — they're two sides of the same coin. Building systems that enforce quality is more valuable than relying on talent alone.",
                },
                {
                    heading: "Why It Matters",
                    body: "HNC Studio is proof that I think in systems, not just features. It's where creative vision meets operational discipline — the exact intersection that Ingémédia explores.",
                },
            ],
            caseStudyUrl: "/p/hnc-studio",
        },
    },

    // 3. Referentiel — maturité pro
    {
        id: "referentiel",
        label: "Referentiel.app",
        type: "folder",
        position: { x: 88, y: 40 },
        window: {
            title: "Référentiel",
            contentType: "project",
            sections: [
                {
                    heading: "Context",
                    body: "During my BUT Informatique, I completed professional internships that put me in real production environments. The Référentiel project was born from these experiences — a structured tool for managing competency frameworks and professional evaluations.",
                },
                {
                    heading: "Problem",
                    body: "Tracking skills acquisition across multiple domains, mapping them to institutional frameworks, and generating meaningful progress reports is tedious when done manually. Existing tools were either too generic or too rigid.",
                },
                {
                    heading: "My Role",
                    body: "Full-stack developer in a professional context. I was responsible for translating institutional requirements into functional specifications, then building the tool from database design to user interface.",
                },
                {
                    heading: "Technical Approach",
                    body: "Structured data modeling to represent competency hierarchies. Clean CRUD operations with validation. Responsive interface designed for both administrators and students. Focus on data integrity and clear reporting.",
                },
                {
                    heading: "What I Learned",
                    body: "Working within institutional constraints taught me that real-world software isn't about what's technically elegant — it's about what actually gets adopted. Stakeholder communication became as important as code quality.",
                },
                {
                    heading: "Why It Matters",
                    body: "This project showed me the gap between academic projects and professional deliverables. It's where I learned that maturity in software engineering comes from shipping things that other people depend on.",
                },
            ],
        },
    },

    // 4. GameOnWeb — interaction
    {
        id: "gameonweb",
        label: "GameOnWeb.app",
        type: "folder",
        position: { x: 88, y: 56 },
        window: {
            title: "GameOnWeb",
            contentType: "project",
            sections: [
                {
                    heading: "Context",
                    body: "National web game competition. Our team had a few weeks to design and build a complete browser-based game from scratch.",
                },
                {
                    heading: "Problem",
                    body: "Building a performant 3D game in the browser with no game engine — just WebGL, math, and creativity.",
                },
                {
                    heading: "My Role",
                    body: "Lead developer — gameplay systems, 3D rendering pipeline, and overall architecture.",
                },
                {
                    heading: "Technical Approach",
                    body: "Babylon.js for 3D rendering. TypeScript for type safety at scale. Custom game loop, physics, and asset pipeline. Node.js backend for multiplayer features.",
                },
                {
                    heading: "What I Learned",
                    body: "Performance matters — every millisecond counts at 60fps. Also learned to scope aggressively under time pressure.",
                },
                {
                    heading: "Why It Matters",
                    body: "Proved I can build complex interactive experiences under constraints — exactly the kind of challenge Ingémédia specializes in.",
                },
            ],
            caseStudyUrl: "/p/gameonweb",
        },
    },

    // 5. KakouQuest — base académique
    {
        id: "kakouquest",
        label: "KakouQuest.app",
        type: "folder",
        position: { x: 88, y: 72 },
        window: {
            title: "KakouQuest",
            contentType: "project",
            sections: [
                {
                    heading: "Context",
                    body: "Academic project exploring gamification as a tool for cultural education and local heritage preservation.",
                },
                {
                    heading: "Problem",
                    body: "Young audiences don't engage with traditional cultural content. We needed an interactive format that makes learning feel like playing.",
                },
                {
                    heading: "My Role",
                    body: "Game designer and front-end developer — from concept to playable prototype.",
                },
                {
                    heading: "Technical Approach",
                    body: "JavaScript with Canvas API for the game engine. Node.js + Express backend for content management. Focus on progressive difficulty and narrative-driven level design.",
                },
                {
                    heading: "What I Learned",
                    body: "That the best technical solutions are invisible to the user. Good UX in a game means the player never thinks about the code.",
                },
                {
                    heading: "Why It Matters",
                    body: "My first real project combining interactivity, narrative, and technology — the foundation of everything I've built since.",
                },
            ],
            caseStudyUrl: "/p/kakouquest",
        },
    },

    /* ─── Bottom center — Technical stack ─── */
    {
        id: "core-modules",
        label: "CoreModules.app",
        type: "folder",
        position: { x: 45, y: 76 },
        window: {
            title: "CoreModules",
            contentType: "core-modules",
        },
    },

    /* ─── Bottom right — Trash (decorative) ─── */
    {
        id: "trash",
        label: "Trash",
        type: "trash",
        position: { x: 92, y: 88 },
        window: {
            title: "Trash",
            contentType: "about", // won't actually open
        },
    },
];

/* ═══════════════════════════════════════════════════════════
   DOCK & VIRTUAL WINDOWS
   ═══════════════════════════════════════════════════════════ */

export interface DockItem {
    id: string;
    label: string;
    color: string;
    windowId?: string;
}

export const dockItems: DockItem[] = [
    { id: "finder", label: "Finder", color: "#1C8EF9" },
    { id: "nutrika-dock", label: "Nutrika", color: "#22c55e", windowId: "nutrika" },
    { id: "hnc-dock", label: "HNC Studio", color: "#8b5cf6", windowId: "hnc-studio" },
    { id: "referentiel-dock", label: "Référentiel", color: "#f59e0b", windowId: "referentiel" },
    { id: "gameonweb-dock", label: "GameOnWeb", color: "#06b6d4", windowId: "gameonweb" },
    { id: "kakouquest-dock", label: "KakouQuest", color: "#f97316", windowId: "kakouquest" },
    { id: "contact-dock", label: "Contact", color: "#eab308", windowId: "contact" },
];

/** Virtual item for "Contact" — not a desktop icon but openable from TopBar/Dock */
export const contactWindow: WindowConfig = {
    title: "Contact",
    contentType: "contact",
};
