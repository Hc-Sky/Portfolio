"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { getDesktopItems } from "@/data/desktopItems";
import type { DesktopItem, Language } from "@/data/desktopItems";

/* ─── Types ─── */
type AppId = "projects" | "about" | "terminal" | "skills" | "contact";

type IosApp = {
    id: string;
    openId?: AppId;
    label: string;
    icon: string;
    interactive: boolean;
};

/* ─── Icon URLs ─── */
const ICONS = {
    facetime: "https://framerusercontent.com/images/xxKf6tPzYecSWOavDJjUB0MtXw.png",
    calendar: "https://framerusercontent.com/images/VeljykK560qBRDkQkYyhx8ChI.png",
    photos: "https://framerusercontent.com/images/ogWIDEJmWxA8SVRZpEe7gk35FcM.png",
    mail: "https://framerusercontent.com/images/CwKoPLck9kD8CifRkrpug3socM.png",
    notes: "https://framerusercontent.com/images/Z0d1XNe7wVINUiHydSL6noKho.png",
    podcasts: "https://framerusercontent.com/images/1pORyCnfgAxpXWyCa1l7s8IJeK0.png",
    appstore: "https://framerusercontent.com/images/KCaz69s4OvhKMUI25E1RBeuNIyA.png",
    maps: "https://framerusercontent.com/images/YtLyrfz2kFN2QhkzBWG6TrATw.png",
    phone: "https://framerusercontent.com/images/gi6dMq8dbjba0LyjZSuySu4X6zg.png",
    safari: "https://framerusercontent.com/images/YtLyrfz2kFN2QhkzBWG6TrATw.png",
    messages: "https://framerusercontent.com/images/fm90fwzWoBMCvK5C0MOyKdo94.png",
    music: "https://framerusercontent.com/images/pjjxP6KY1Ttnqhuqt9oF3QBfmE.png",
    reminders: "https://framerusercontent.com/images/NMuItXJj2OKiPiAC2EdivhRPYY.png",
    tv: "https://framerusercontent.com/images/1pORyCnfgAxpXWyCa1l7s8IJeK0.png",
};

/* ─── App grid (12 icons, 4 columns × 3 rows) ─── */
const APP_GRID: IosApp[] = [
    { id: "projects",    openId: "projects",  label: "Projets",     icon: ICONS.appstore,  interactive: true },
    { id: "about",       openId: "about",     label: "À propos",    icon: ICONS.reminders, interactive: true },
    { id: "terminal",    openId: "terminal",  label: "Terminal",    icon: ICONS.notes,     interactive: true },
    { id: "skills",      openId: "skills",    label: "Compétences", icon: ICONS.podcasts,  interactive: true },
    { id: "contact",     openId: "contact",   label: "Contact",     icon: ICONS.mail,      interactive: true },
    { id: "facetime",                         label: "FaceTime",    icon: ICONS.facetime,  interactive: false },
    { id: "calendar",                         label: "Calendrier",  icon: ICONS.calendar,  interactive: false },
    { id: "photos",                           label: "Photos",      icon: ICONS.photos,    interactive: false },
    { id: "maps",                             label: "Plans",       icon: ICONS.maps,      interactive: false },
    { id: "tv",                               label: "TV",          icon: ICONS.tv,        interactive: false },
    { id: "phone-grid",                       label: "Téléphone",   icon: ICONS.phone,     interactive: false },
    { id: "safari-grid",                      label: "Safari",      icon: ICONS.safari,    interactive: false },
];

/* ─── Dock (4 icons) ─── */
const DOCK_APPS: IosApp[] = [
    { id: "dock-phone",    label: "Téléphone", icon: ICONS.phone,    interactive: false },
    { id: "dock-safari",   label: "Safari",    icon: ICONS.safari,   interactive: false },
    { id: "dock-messages", label: "Messages",  icon: ICONS.messages, interactive: false },
    { id: "dock-music",    label: "Musique",   icon: ICONS.music,    interactive: false },
];

/* ─── Status bar ─── */
function IosStatusBar({ time, dark = false }: { time: string; dark?: boolean }) {
    const col = dark ? "text-white" : "text-black";
    return (
        <div className={`flex h-12 items-center justify-between px-5 ${col}`}>
            <span className="text-[15px] font-semibold tabular-nums">{time}</span>
            <div className="flex items-center gap-[6px]">
                {/* Signal bars */}
                <div className="flex gap-[2px] h-[13px] items-end">
                    {[5, 8, 11, 13].map((h, i) => (
                        <div
                            key={i}
                            style={{ height: h, width: 3, borderRadius: 1.5, backgroundColor: "currentColor", opacity: i < 3 ? 1 : 0.35 }}
                        />
                    ))}
                </div>
                {/* Wifi */}
                <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
                    <path d="M7.5 2.5C9.4 2.5 11.1 3.3 12.3 4.6L13.7 3.2C12.1 1.5 9.9 0.5 7.5 0.5C5.1 0.5 2.9 1.5 1.3 3.2L2.7 4.6C3.9 3.3 5.6 2.5 7.5 2.5Z" />
                    <path d="M7.5 5.5C8.8 5.5 10 6 10.9 6.9L12.3 5.5C11 4.2 9.3 3.5 7.5 3.5C5.7 3.5 4 4.2 2.7 5.5L4.1 6.9C5 6 6.2 5.5 7.5 5.5Z" />
                    <circle cx="7.5" cy="10" r="1.5" />
                </svg>
                {/* Battery */}
                <div className="relative flex items-center">
                    <div
                        style={{
                            width: 22, height: 12, borderRadius: 3,
                            border: "1.5px solid currentColor",
                            padding: "1.5px",
                            display: "flex", alignItems: "center",
                        }}
                    >
                        <div style={{ width: "75%", height: "100%", borderRadius: 1.5, backgroundColor: "currentColor" }} />
                    </div>
                    <div style={{ width: 2, height: 5, borderRadius: "0 1px 1px 0", backgroundColor: "currentColor", marginLeft: 1, opacity: 0.5 }} />
                </div>
            </div>
        </div>
    );
}

/* ─── App icon ─── */
function AppIcon({
    app,
    size,
    onOpen,
    showLabel,
}: {
    app: IosApp;
    size: number;
    onOpen: (id: AppId) => void;
    showLabel: boolean;
}) {
    return (
        <button
            className="flex flex-col items-center gap-[6px] select-none"
            onClick={() => {
                if (app.interactive && app.openId) onOpen(app.openId);
            }}
            style={{ WebkitTapHighlightColor: "transparent" }}
        >
            <motion.img
                src={app.icon}
                alt={app.label}
                draggable={false}
                whileTap={app.interactive ? { scale: 0.86 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size * 0.225,
                    boxShadow: "0 3px 12px rgba(0,0,0,0.25)",
                    objectFit: "cover",
                }}
            />
            {showLabel && (
                <span
                    className="text-white text-[11px] font-medium leading-none text-center"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)", maxWidth: size + 8 }}
                >
                    {app.label}
                </span>
            )}
        </button>
    );
}

/* ─── App modal container ─── */
const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, damping: 30, stiffness: 300 },
    },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.22 } },
};

function AppModal({
    title,
    icon,
    onClose,
    children,
}: {
    title: string;
    icon: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ backgroundColor: "#f2f2f7" }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Nav bar */}
            <div
                className="flex items-center px-4 pt-12 pb-3 gap-3"
                style={{ backgroundColor: "#f2f2f7", borderBottom: "1px solid rgba(0,0,0,0.1)" }}
            >
                <button
                    onClick={onClose}
                    className="flex items-center gap-1 text-[#007AFF] text-[17px] font-normal"
                >
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="#007AFF">
                        <path d="M8.5 1L1 9L8.5 17" strokeWidth="2" stroke="#007AFF" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Accueil
                </button>
                <div className="flex-1 flex items-center justify-center gap-2">
                    <img src={icon} alt={title} style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover" }} />
                    <span className="font-semibold text-[17px] text-black">{title}</span>
                </div>
                <div style={{ width: 70 }} />
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </motion.div>
    );
}

/* ─── Projects app ─── */
function ProjectsApp({ language, projects }: { language: Language; projects: DesktopItem[] }) {
    const [selected, setSelected] = useState<DesktopItem | null>(null);

    return (
        <div className="relative overflow-hidden" style={{ minHeight: "100%" }}>
            <AnimatePresence mode="wait">
                {!selected ? (
                    <motion.div
                        key="list"
                        initial={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="px-4 pt-4 pb-2">
                            <p className="text-[13px] text-gray-500 uppercase tracking-wide font-semibold mb-2">
                                {language === "fr" ? "Projets" : "Projects"}
                            </p>
                        </div>
                        <div
                            className="mx-4 rounded-xl overflow-hidden"
                            style={{ backgroundColor: "white" }}
                        >
                            {projects.map((proj, idx) => (
                                <button
                                    key={proj.id}
                                    onClick={() => setSelected(proj)}
                                    className="w-full flex items-center px-4 py-3 text-left"
                                    style={{
                                        borderBottom: idx < projects.length - 1 ? "1px solid #e5e5ea" : "none",
                                        backgroundColor: "white",
                                    }}
                                >
                                    <span className="flex-1 text-[17px] text-black">{proj.window.title}</span>
                                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                                        <path d="M1 1L7 7L1 13" stroke="#C7C7CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="detail"
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Back button */}
                        <div className="flex items-center px-4 pt-4 pb-2 gap-2">
                            <button
                                onClick={() => setSelected(null)}
                                className="flex items-center gap-1 text-[#007AFF] text-[17px]"
                            >
                                <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                                    <path d="M8.5 1L1 9L8.5 17" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {language === "fr" ? "Retour" : "Back"}
                            </button>
                        </div>

                        <div className="px-4 pb-2">
                            <h2 className="text-[22px] font-bold text-black mb-1">{selected.window.title}</h2>
                        </div>

                        {/* Sections */}
                        {selected.window.sections && selected.window.sections.length > 0 && (
                            <div className="px-4 mb-4 flex flex-col gap-3">
                                {selected.window.sections
                                    .filter((s) => s.body && s.body.trim() !== "")
                                    .map((s, i) => {
                                        const isUrl = s.body.startsWith("http");
                                        return (
                                            <div
                                                key={i}
                                                className="rounded-xl p-4"
                                                style={{ backgroundColor: "white" }}
                                            >
                                                <p className="text-[13px] font-semibold text-black uppercase tracking-wide mb-1">
                                                    {s.heading}
                                                </p>
                                                {isUrl ? (
                                                    <a
                                                        href={s.body}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[15px] text-[#007AFF] break-all"
                                                    >
                                                        {s.heading} →
                                                    </a>
                                                ) : (
                                                    <p className="text-[15px] text-gray-700 leading-relaxed">{s.body}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        )}

                        {/* Case study link */}
                        {selected.window.caseStudyUrl && (
                            <div className="px-4 mb-6">
                                <a
                                    href={selected.window.caseStudyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-full py-3 rounded-xl text-white text-[16px] font-semibold"
                                    style={{ backgroundColor: "#007AFF" }}
                                >
                                    {language === "fr" ? "Voir le projet ↗" : "View project ↗"}
                                </a>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── About app ─── */
function AboutApp({ language }: { language: Language }) {
    const isFr = language === "fr";
    const skills = ["Next.js", "TypeScript", "Spring Boot", "MongoDB", "Python", "Three.js", "Framer Motion", "Figma"];
    return (
        <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
            {/* Card */}
            <div className="rounded-xl p-5 flex flex-col items-center gap-3" style={{ backgroundColor: "white" }}>
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                >
                    H
                </div>
                <div className="text-center">
                    <h2 className="text-[20px] font-bold text-black">Hugo Cohen-Cofflard</h2>
                    <p className="text-[14px] text-gray-500 mt-0.5">
                        {isFr ? "Développeur & Créateur" : "Developer & Creator"}
                    </p>
                </div>
            </div>

            {/* Bio */}
            <div className="rounded-xl p-4" style={{ backgroundColor: "white" }}>
                <p className="text-[13px] font-semibold text-black uppercase tracking-wide mb-2">
                    {isFr ? "À propos" : "About"}
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                    {isFr
                        ? "Étudiant en informatique, passionné par l'intersection entre développement, design et stratégie produit. Je construis des systèmes qui ont du sens."
                        : "CS student passionate about the intersection of development, design, and product strategy. I build systems that make sense."}
                </p>
            </div>

            {/* Focus areas */}
            <div className="rounded-xl p-4" style={{ backgroundColor: "white" }}>
                <p className="text-[13px] font-semibold text-black uppercase tracking-wide mb-3">
                    {isFr ? "Ce que je fais" : "What I do"}
                </p>
                <div className="flex flex-wrap gap-2">
                    {[
                        isFr ? "Développement web" : "Web development",
                        isFr ? "Architecture système" : "System architecture",
                        isFr ? "Design produit" : "Product design",
                        isFr ? "Direction créative" : "Creative direction",
                    ].map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-[13px] font-medium text-white"
                            style={{ backgroundColor: "#007AFF" }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Stack */}
            <div className="rounded-xl p-4" style={{ backgroundColor: "white" }}>
                <p className="text-[13px] font-semibold text-black uppercase tracking-wide mb-3">Stack</p>
                <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                        <span key={s} className="px-3 py-1 rounded-full text-[13px] bg-gray-100 text-gray-700 font-medium">
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            {/* Links */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "white" }}>
                {[
                    { label: "GitHub", href: "https://github.com/Hc-Sky", color: "#333" },
                    { label: "Instagram HNC", href: "https://www.instagram.com/studiohnc/", color: "#E1306C" },
                ].map((link, i, arr) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-3"
                        style={{ borderBottom: i < arr.length - 1 ? "1px solid #e5e5ea" : "none" }}
                    >
                        <span className="flex-1 text-[17px]" style={{ color: link.color }}>{link.label}</span>
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                            <path d="M1 1L7 7L1 13" stroke="#C7C7CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ─── Skills app ─── */
function SkillsApp({ language }: { language: Language }) {
    const isFr = language === "fr";
    const categories = [
        {
            name: isFr ? "Frontend" : "Frontend",
            color: "#007AFF",
            items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
        },
        {
            name: "Backend",
            color: "#34C759",
            items: ["Spring Boot", "Java", "Node.js / Express", "Python", "REST API"],
        },
        {
            name: isFr ? "Base de données" : "Database",
            color: "#FF9500",
            items: ["MongoDB", "PostgreSQL", "Mongoose", "Spring Data"],
        },
        {
            name: isFr ? "Outils & DevOps" : "Tools & DevOps",
            color: "#AF52DE",
            items: ["Git / GitHub", "Docker", "Vercel", "GitHub Pages", "Vite"],
        },
        {
            name: "Design",
            color: "#FF2D55",
            items: ["Figma", "Adobe Suite", "Motion Design", "Brand Identity"],
        },
    ];

    return (
        <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
            {categories.map((cat) => (
                <div key={cat.name} className="rounded-xl p-4" style={{ backgroundColor: "white" }}>
                    <div className="flex items-center gap-2 mb-3">
                        <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: cat.color }} />
                        <p className="text-[15px] font-semibold text-black">{cat.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {cat.items.map((item) => (
                            <span
                                key={item}
                                className="px-3 py-1 rounded-full text-[13px] font-medium"
                                style={{ backgroundColor: cat.color + "18", color: cat.color }}
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─── Terminal app ─── */
const TERMINAL_LINES = [
    "$ whoami",
    "hugo_cohen_cofflard",
    "$ cat about.txt",
    "Développeur · Créateur · Architecte système",
    "$ ls projects/",
    "nutrika/   hnc-studio/   referentiel/   gameonweb/   kakouquest/",
    "$ cat stack.json | jq '.frontend'",
    '["Next.js", "TypeScript", "Framer Motion", "Three.js"]',
    "$ echo $MOTTO",
    "La structure, c'est la liberté.",
    "$ _",
];

function TerminalApp() {
    const lines = TERMINAL_LINES;

    const [displayed, setDisplayed] = useState<string[]>([]);
    const idx = useRef(0);

    useEffect(() => {
        idx.current = 0;
        setDisplayed([]);
        const interval = setInterval(() => {
            if (idx.current < lines.length) {
                setDisplayed((prev) => [...prev, lines[idx.current]]);
                idx.current++;
            } else {
                clearInterval(interval);
            }
        }, 340);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="px-4 pt-4 pb-8">
            <div
                className="rounded-2xl p-5 font-mono text-[13px] leading-[1.7]"
                style={{ backgroundColor: "#1a1a2e", minHeight: 300 }}
            >
                {displayed.filter((l): l is string => typeof l === "string").map((line, i) => {
                    const isCmd = line.startsWith("$");
                    const isCursor = line === "$ _";
                    return (
                        <div key={i} className={`${isCmd ? "text-green-400" : "text-gray-200"} ${isCursor ? "animate-pulse" : ""}`}>
                            {line}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Contact app ─── */
function ContactApp({ language }: { language: Language }) {
    const isFr = language === "fr";
    const contacts = [
        { label: "Email", value: "hugocohen.dev@gmail.com", href: "mailto:hugocohen.dev@gmail.com" },
        { label: "GitHub", value: "github.com/Hc-Sky", href: "https://github.com/Hc-Sky" },
        { label: "Instagram HNC", value: "@studiohnc", href: "https://www.instagram.com/studiohnc/" },
    ];

    return (
        <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
            <p className="text-[13px] text-gray-500 text-center">
                {isFr ? "N'hésite pas à me contacter." : "Feel free to reach out."}
            </p>
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "white" }}>
                {contacts.map((c, i, arr) => (
                    <a
                        key={c.label}
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col px-4 py-3"
                        style={{ borderBottom: i < arr.length - 1 ? "1px solid #e5e5ea" : "none" }}
                    >
                        <span className="text-[12px] text-gray-400 font-medium uppercase tracking-wide">{c.label}</span>
                        <span className="text-[16px] text-[#007AFF]">{c.value}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}

/* ─── App modal config ─── */
const APP_CONFIGS: Record<AppId, { title: string; iconKey: keyof typeof ICONS }> = {
    projects: { title: "Projets",    iconKey: "appstore" },
    about:    { title: "À propos",   iconKey: "reminders" },
    terminal: { title: "Terminal",   iconKey: "notes" },
    skills:   { title: "Compétences", iconKey: "podcasts" },
    contact:  { title: "Contact",    iconKey: "mail" },
};

/* ─── Main component ─── */
export default function DesktopOnly() {
    const [language] = useState<Language>("fr");
    const [time, setTime] = useState("");
    const [openApp, setOpenApp] = useState<AppId | null>(null);

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

    // Live clock
    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
        };
        update();
        const t = setInterval(update, 1000);
        return () => clearInterval(t);
    }, []);

    // Get projects from data
    const allItems = getDesktopItems(language);
    const projects = allItems.filter((item) => item.window.contentType === "project");

    return (
        <div
            className="flex flex-col h-screen w-screen overflow-hidden select-none"
            style={{
                backgroundImage: `url('${basePath}/image.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Status bar */}
            <IosStatusBar time={time} dark />

            {/* App grid */}
            <div className="flex-1 px-5 pt-2">
                <div
                    className="grid gap-y-6"
                    style={{ gridTemplateColumns: "repeat(4, 1fr)", justifyItems: "center" }}
                >
                    {APP_GRID.map((app) => (
                        <AppIcon
                            key={app.id}
                            app={app}
                            size={62}
                            onOpen={setOpenApp}
                            showLabel
                        />
                    ))}
                </div>
            </div>

            {/* Search bar */}
            <div className="px-5 mb-3 flex justify-center">
                <span
                    className="text-[11px] font-medium tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em" }}
                >
                    Meilleure expérience sur desktop ↗
                </span>
            </div>

            {/* Dock */}
            <div className="px-5 pb-8">
                <div
                    className="flex items-center justify-around rounded-[26px] py-3 px-4"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.22)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                        boxShadow: "0 2px 20px rgba(0,0,0,0.15)",
                    }}
                >
                    {DOCK_APPS.map((app) => (
                        <AppIcon
                            key={app.id}
                            app={app}
                            size={58}
                            onOpen={setOpenApp}
                            showLabel={false}
                        />
                    ))}
                </div>
            </div>

            {/* App modals */}
            <AnimatePresence>
                {openApp && (
                    <AppModal
                        key={openApp}
                        title={APP_CONFIGS[openApp].title}
                        icon={ICONS[APP_CONFIGS[openApp].iconKey]}
                        onClose={() => setOpenApp(null)}
                    >
                        {openApp === "projects" && <ProjectsApp language={language} projects={projects} />}
                        {openApp === "about"    && <AboutApp language={language} />}
                        {openApp === "terminal" && <TerminalApp />}
                        {openApp === "skills"   && <SkillsApp language={language} />}
                        {openApp === "contact"  && <ContactApp language={language} />}
                    </AppModal>
                )}
            </AnimatePresence>
        </div>
    );
}
