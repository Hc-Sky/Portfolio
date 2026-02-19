/**
 * Desktop items configuration — centralized data for all desktop icons and their window content.
 * Each item defines its icon appearance, position on the desktop, and window content when opened.
 *
 * Layout:
 *   Top-left    → SystemLogs.app (narrative entry point)
 *   Mid-left    → README.md (personal intro)
 *   Right col   → Projects (Nutrika → HNC Studio → Referentiel → GameOnWeb → KakouQuest)
 *   Bottom-center → CoreModules.app (technical stack)
 *   Bottom-right  → Trash (Easter egg)
 */

export type DesktopItemType = "folder" | "file" | "terminal" | "trash";

export type Language = "fr" | "en";

export type WindowContentType =
    | "project"
    | "resume"
    | "contact"
    | "about"
    | "terminal"
    | "readme"
    | "core-modules"
    | "trash-content";

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

/* ─── Finder Window (Dock-only) ─── */
const finderWindowEn: WindowConfig = {
    title: "Finder",
    contentType: "project",
    sections: [
        {
            heading: "Projects",
            body: "Select a project in the sidebar to explore details, files, and case studies.",
        },
    ],
};

const finderWindowFr: WindowConfig = {
    title: "Finder",
    contentType: "project",
    sections: [
        {
            heading: "Projets",
            body: "Sélectionne un projet dans la barre latérale pour explorer les détails, fichiers et études de cas.",
        },
    ],
};

export const getFinderWindow = (language: Language) =>
    language === "fr" ? finderWindowFr : finderWindowEn;

/* ═══════════════════════════════════════════════════════════
   DESKTOP ITEMS
   ═══════════════════════════════════════════════════════════ */

const desktopItemsEn: DesktopItem[] = [
    /* ─── Top-left — Narrative entry point ─── */
    {
        id: "system-logs",
        label: "SystemLogs.app",
        type: "terminal",
        position: { x: 6, y: 60 },
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
        position: { x: 6, y: 78 },
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
                    body: "Nutrika started from a simple observation: people often know what they have in their fridge, but not what to do with it.",
                },
                {
                    heading: "Problem",
                    body: "Online recipes are disconnected from real-life constraints. How can we generate structured, healthy meal suggestions based on available ingredients, personal dietary goals, and macro objectives?",
                },
                {
                    heading: "My Role",
                    body: "Product conception, AI system architecture, ingredient parsing logic, UX structuring, and nutrition evaluation model.",
                },
                {
                    heading: "Technical Approach",
                    body: "Python backend with AI agents for structured data extraction. Macro-nutrient calculation and context-aware recommendation system.",
                },
                {
                    heading: "What I Learned",
                    body: "AI is not impressive by itself. The real challenge is designing intelligence around the user.",
                },
                {
                    heading: "Why It Matters",
                    body: "Nutrika reflects my interest in transforming chaos into structure — and designing systems that assist real decisions.",
                },
                {
                    heading: "Presentation",
                    body: "https://www.canva.com/design/DAG2VFv3Pd0/PVODIpzZ5xgj2N2w9dtGxA/edit?utm_content=DAG2VFv3Pd0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
                },
            ],
            caseStudyUrl: "https://www.hackster.io/542656/nutrika-5ff838#toc-r-duisez-le-gaspillage-alimentaire--optimisez-votre-nutrition-et-connectez-votre-cuisine---l--re-de-l-iot-1",
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
                    body: "HNC Studio started as a creative initiative. It evolved into a structured ecosystem.",
                },
                {
                    heading: "Problem",
                    body: "Creative projects become chaotic without structure: clients, deals, shootings, deliveries, invoicing. Most freelancers stack tools. I chose to design my own system.",
                },
                {
                    heading: "My Role",
                    body: "Founder, creative direction, web development, motion design, and ERP architecture.",
                },
                {
                    heading: "Technical Approach",
                    body: "Next.js + Tailwind + Framer Motion. Modular ERP logic with 'Golden Path' workflow structuring: Client → Deal → Project → Tasks → Delivery → Invoice.",
                },
                {
                    heading: "What I Learned",
                    body: "Creativity without structure collapses. Structure without creativity stagnates. The balance is intentional system design.",
                },
                {
                    heading: "Why It Matters",
                    body: "HNC reflects my desire to merge artistic direction with technical architecture.",
                },
            ],
            caseStudyUrl: "https://hnc-studio.fr/",
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
                    body: "Developed during my alternance at Cash Systèmes Industrie. Goal: centralize internal product and workflow logic.",
                },
                {
                    heading: "Problem",
                    body: "Disconnected data flows. Lack of tracking visibility. Need for structured states and transitions.",
                },
                {
                    heading: "My Role",
                    body: "Backend architecture, MongoDB workflow modeling, state management logic, and integration into existing ecosystem.",
                },
                {
                    heading: "Technical Approach",
                    body: "Spring Boot, Spring Data MongoDB. JSON-based workflow states and event-driven structure.",
                },
                {
                    heading: "What I Learned",
                    body: "Real systems involve real constraints. Architecture impacts people, not just code.",
                },
                {
                    heading: "Why It Matters",
                    body: "This project shifted my mindset from feature development to system design.",
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
                    body: "Exploration of 3D interaction directly in the browser.",
                },
                {
                    heading: "Problem",
                    body: "How to create spatial interaction within a traditionally flat medium?",
                },
                {
                    heading: "My Role",
                    body: "Scene setup, interaction logic, camera management, and animation loops.",
                },
                {
                    heading: "Technical Approach",
                    body: "Three.js, WebGL. Real-time rendering and interactive controls.",
                },
                {
                    heading: "What I Learned",
                    body: "Web interaction is evolving beyond static interfaces. Space changes perception.",
                },
                {
                    heading: "Why It Matters",
                    body: "",
                },
            ],
            caseStudyUrl: "https://fabyan09.github.io/gamesonweb/",
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
                    body: "First-year academic project. Objective: build a playable game using Java.",
                },
                {
                    heading: "Problem",
                    body: "Managing object-oriented architecture, game loop logic, and state handling.",
                },
                {
                    heading: "My Role",
                    body: "Gameplay mechanics, character system, and interaction logic.",
                },
                {
                    heading: "Technical Approach",
                    body: "Java OOP principles, game state management.",
                },
                {
                    heading: "What I Learned",
                    body: "Structure precedes complexity. Architecture determines scalability.",
                },
                {
                    heading: "Why It Matters",
                    body: "", // No "Why It Matters" in user prompt for KakouQuest/GameOnWeb? Wait, "Why It Matters" was in GameOnWeb prompt: "Proved I can build complex..." -> Wait, user prompt for GameOnWeb: "Web interaction is evolving... Space changes perception." (This was under "What I Learned"). "Why It Matters" section missing in prompt for GameOnWeb? And KakouQuest?
                    /*
                    Actually, looking closely at User Prompt:
                    GameOnWeb:
                    - Context
                    - Problem
                    - My Role
                    - Technical Approach
                    - What I Learned
                    (No "Why It Matters")

                    KakouQuest:
                    - Context
                    - Problem
                    - My Role
                    - Technical Approach
                    - What I Learned
                    (No "Why It Matters")
                    */
                },
            ],
            caseStudyUrl: "https://github.com/Hc-Sky/SAE-Rogue-Like",
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

    /* ─── Bottom right — Trash (Easter egg) ─── */
    {
        id: "trash",
        label: "Trash",
        type: "trash",
        position: { x: 92, y: 88 },
        window: {
            title: "Trash",
            contentType: "trash-content",
        },
    },
];

const desktopItemsFr: DesktopItem[] = [
    /* ─── Top-left — Narrative entry point ─── */
    {
        id: "system-logs",
        label: "SystemLogs.app",
        type: "terminal",
        position: { x: 6, y: 60 },
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
        position: { x: 6, y: 78 },
        window: {
            title: "README.md",
            contentType: "readme",
        },
    },

    /* ─── Right column — Projects ─── */

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
                    heading: "Contexte",
                    body: "Nutrika est partie d’une observation simple : on sait souvent ce qu’on a dans le frigo, mais pas quoi en faire.",
                },
                {
                    heading: "Problème",
                    body: "Les recettes en ligne sont déconnectées des contraintes réelles. Comment générer des suggestions de repas structurées et saines selon les ingrédients disponibles, les objectifs alimentaires et les macros ?",
                },
                {
                    heading: "Mon rôle",
                    body: "Conception produit, architecture du système IA, logique de parsing d’ingrédients, structuration UX, et modèle d’évaluation nutritionnelle.",
                },
                {
                    heading: "Approche technique",
                    body: "Backend Python avec agents IA pour l’extraction structurée. Calcul des macronutriments et système de recommandation contextuelle.",
                },
                {
                    heading: "Ce que j’ai appris",
                    body: "L’IA n’est pas impressionnante seule. Le vrai défi est de concevoir l’intelligence autour de l’utilisateur.",
                },
                {
                    heading: "Pourquoi c’est important",
                    body: "Nutrika reflète mon intérêt pour transformer le chaos en structure — et concevoir des systèmes qui assistent de vraies décisions.",
                },
                {
                    heading: "Présentation",
                    body: "https://www.canva.com/design/DAG2VFv3Pd0/PVODIpzZ5xgj2N2w9dtGxA/edit?utm_content=DAG2VFv3Pd0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
                },
            ],
            caseStudyUrl: "https://www.hackster.io/542656/nutrika-5ff838#toc-r-duisez-le-gaspillage-alimentaire--optimisez-votre-nutrition-et-connectez-votre-cuisine---l--re-de-l-iot-1",
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
                    heading: "Contexte",
                    body: "HNC Studio a commencé comme une initiative créative. Elle a évolué en écosystème structuré.",
                },
                {
                    heading: "Problème",
                    body: "Les projets créatifs deviennent chaotiques sans structure : clients, deals, shootings, livrables, facturation. La plupart empilent des outils. J’ai choisi de concevoir mon propre système.",
                },
                {
                    heading: "Mon rôle",
                    body: "Fondateur, direction créative, développement web, motion design, architecture ERP.",
                },
                {
                    heading: "Approche technique",
                    body: "Next.js + Tailwind + Framer Motion. Logique ERP modulaire avec workflow « Golden Path » : Client → Deal → Projet → Tâches → Livraison → Facture.",
                },
                {
                    heading: "Ce que j’ai appris",
                    body: "La créativité sans structure s’effondre. La structure sans créativité stagne. L’équilibre se conçoit.",
                },
                {
                    heading: "Pourquoi c’est important",
                    body: "HNC reflète mon envie de fusionner direction artistique et architecture technique.",
                },
            ],
            caseStudyUrl: "https://hnc-studio.fr/",
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
                    heading: "Contexte",
                    body: "Développé durant mon alternance chez Cash Systèmes Industrie. Objectif : centraliser la logique produit et workflow interne.",
                },
                {
                    heading: "Problème",
                    body: "Flux de données déconnectés. Manque de visibilité de suivi. Besoin d’états structurés et de transitions.",
                },
                {
                    heading: "Mon rôle",
                    body: "Architecture backend, modélisation workflow MongoDB, logique de gestion d’état, intégration dans l’écosystème existant.",
                },
                {
                    heading: "Approche technique",
                    body: "Spring Boot, Spring Data MongoDB. États de workflow en JSON et structure événementielle.",
                },
                {
                    heading: "Ce que j’ai appris",
                    body: "Les systèmes réels impliquent des contraintes réelles. L’architecture impacte les personnes, pas seulement le code.",
                },
                {
                    heading: "Pourquoi c’est important",
                    body: "Ce projet a fait évoluer mon mindset : du développement de features vers le design de systèmes.",
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
                    heading: "Contexte",
                    body: "Exploration de l’interaction 3D directement dans le navigateur.",
                },
                {
                    heading: "Problème",
                    body: "Comment créer une interaction spatiale dans un médium traditionnellement plat ?",
                },
                {
                    heading: "Mon rôle",
                    body: "Mise en place de la scène, logique d’interaction, gestion de la caméra, boucles d’animation.",
                },
                {
                    heading: "Approche technique",
                    body: "Three.js, WebGL. Rendu temps réel et contrôles interactifs.",
                },
                {
                    heading: "Ce que j’ai appris",
                    body: "L’interaction web évolue au-delà des interfaces statiques. L’espace change la perception.",
                },
                {
                    heading: "Pourquoi c’est important",
                    body: "",
                },
            ],
            caseStudyUrl: "https://fabyan09.github.io/gamesonweb/",
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
                    heading: "Contexte",
                    body: "Projet académique de première année. Objectif : créer un jeu jouable en Java.",
                },
                {
                    heading: "Problème",
                    body: "Gérer l’architecture orientée objet, la boucle de jeu et la gestion d’état.",
                },
                {
                    heading: "Mon rôle",
                    body: "Mécaniques de gameplay, système de personnage, logique d’interaction.",
                },
                {
                    heading: "Approche technique",
                    body: "Principes POO Java, gestion de l’état de jeu.",
                },
                {
                    heading: "Ce que j’ai appris",
                    body: "La structure précède la complexité. L’architecture détermine la scalabilité.",
                },
                {
                    heading: "Pourquoi c’est important",
                    body: "",
                },
            ],
            caseStudyUrl: "https://github.com/Hc-Sky/SAE-Rogue-Like",
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

    /* ─── Bottom right — Trash (Easter egg) ─── */
    {
        id: "trash",
        label: "Corbeille",
        type: "trash",
        position: { x: 92, y: 88 },
        window: {
            title: "Corbeille",
            contentType: "trash-content",
        },
    },
];

export const getDesktopItems = (language: Language) =>
    language === "fr" ? desktopItemsFr : desktopItemsEn;

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
const contactWindowEn: WindowConfig = {
    title: "Contact",
    contentType: "contact",
};

const contactWindowFr: WindowConfig = {
    title: "Contact",
    contentType: "contact",
};

export const getContactWindow = (language: Language) =>
    language === "fr" ? contactWindowFr : contactWindowEn;
