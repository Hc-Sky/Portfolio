"use client";

/**
 * Window — macOS-style window with Framer Motion drag.
 *
 * Key fix: Uses margin-based centering instead of transform: translate(-50%, -50%)
 * so that Framer Motion's drag transform doesn't conflict with centering.
 * Position is purely managed by Framer Motion internally — no CSS left/top updates.
 */

import { type RefObject } from "react";
import { motion, useDragControls } from "framer-motion";
import type { WindowConfig, ProjectSection, ProjectBullet } from "@/data/desktopItems";
import TerminalLogs from "./TerminalLogs";

const WINDOW_WIDTH = 620;

interface WindowProps {
    windowId: string;
    config: WindowConfig;
    onClose: () => void;
    onFocus: () => void;
    onMinimize: () => void;
    onOpenWindow?: (id: string) => void;
    zIndex: number;
    isFocused: boolean;
    /** Cascade offset (pixels from center) — only used for initial position */
    initialOffset: { x: number; y: number };
    constraintsRef: RefObject<HTMLDivElement | null>;
}

export default function Window({
    config,
    onClose,
    onFocus,
    onMinimize,
    onOpenWindow,
    zIndex,
    isFocused,
    initialOffset,
    constraintsRef,
}: WindowProps) {
    const dragControls = useDragControls();

    return (
        <motion.div
            /* ─── Animations ─── */
            initial={{
                opacity: 0,
                scale: 0.92,
                x: initialOffset.x,
                y: initialOffset.y + 30,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                x: initialOffset.x,
                y: initialOffset.y,
            }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
            /* ─── Drag Logic ─── */
            drag
            dragControls={dragControls}
            dragListener={false} // Drag handle only
            dragMomentum={false}
            dragElastic={0.05}
            dragConstraints={constraintsRef} // Confine to desktop
            /* ─── Window Management ─── */
            onPointerDown={onFocus}
            style={{
                position: "absolute",
                zIndex,
                width: WINDOW_WIDTH,
                top: "15%", // Initial Y position (relative)
                left: `calc(50% - ${WINDOW_WIDTH / 2}px)`, // Centered X
                boxShadow: isFocused
                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0,0,0,0.05)"
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
            className="flex flex-col bg-white/90 backdrop-blur-xl rounded-xl overflow-hidden"
        >
            {/* ─── Title Bar ─── */}
            <div
                className="h-10 px-4 flex items-center justify-between bg-gray-100/50
             border-b border-gray-200/50 cursor-grab active:cursor-grabbing select-none"
                onPointerDown={(e) => {
                    dragControls.start(e);
                    onFocus();
                }}
            >
                {/* Traffic Lights */}
                <div className="flex gap-2 group" onPointerDown={(e) => e.stopPropagation()}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80
                   flex items-center justify-center border border-black/10 transition-colors"
                        aria-label="Close"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/50">
                            ×
                        </span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMinimize();
                        }}
                        className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80
                   flex items-center justify-center border border-black/10 transition-colors"
                        aria-label="Minimize"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/50">
                            –
                        </span>
                    </button>
                    <button
                        className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80
                   flex items-center justify-center border border-black/10 transition-colors"
                        aria-label="Maximize"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[6px] font-bold text-black/50">
                            ↗
                        </span>
                    </button>
                </div>

                {/* Title */}
                <div className="absolute inset-x-0 flex justify-center pointer-events-none">
                    <span className="text-xs font-semibold text-gray-500/90">
                        {config.title}
                    </span>
                </div>
            </div>
            {/* Content area — terminal gets dark bg, others white */}
            {config.contentType === "terminal" ? (
                <div onMouseDown={(e) => e.stopPropagation()}>
                    <TerminalLogs onOpenWindow={onOpenWindow} />
                </div>
            ) : (
                <div
                    className="p-6 overflow-y-auto bg-white text-gray-800"
                    style={{ maxHeight: "calc(80vh - 40px)", minHeight: 300 }}
                    onMouseDown={(e) => e.stopPropagation()} // Allow selecting text inside
                >
                    <WindowContent config={config} />
                </div>
            )}
        </motion.div>
    );
}

/** Routes content rendering based on contentType */
function WindowContent({ config }: { config: WindowConfig }) {
    switch (config.contentType) {
        case "project":
            return <ProjectContent config={config} />;
        case "resume":
            return <ResumeContent />;
        case "contact":
            return <ContactContent />;
        case "about":
            return <AboutContent />;
        case "readme":
            return <ReadmeContent />;
        case "core-modules":
            return <CoreModulesContent />;
        case "terminal":
            return null;
        default:
            return <p className="text-gray-400">Contenu à venir.</p>;
    }
}

/* ─── Project Content (sections-based) ─── */
function ProjectContent({ config }: { config: WindowConfig }) {
    return (
        <div className="space-y-5">
            {/* Legacy description fallback */}
            {config.description && (
                <p className="text-sm text-gray-500 leading-relaxed">
                    {config.description}
                </p>
            )}

            {/* Sections — consistent 6-part structure */}
            {config.sections?.map((s: ProjectSection) => (
                <div key={s.heading}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                        {s.heading}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {s.body}
                    </p>
                </div>
            ))}

            {config.bullets && (
                <ul className="space-y-3">
                    {config.bullets.map((b: ProjectBullet) => (
                        <li key={b.label} className="flex gap-3 text-sm">
                            <span className="font-semibold text-gray-700 min-w-[80px] shrink-0">
                                {b.label}
                            </span>
                            <span className="text-gray-600">{b.value}</span>
                        </li>
                    ))}
                </ul>
            )}

            {config.caseStudyUrl && (
                <button
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
          bg-gray-900 text-white text-sm font-medium
          hover:bg-gray-800 transition-colors
          focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onClick={() => {
                        /* Phase 3: navigate to case study */
                    }}
                >
                    Open Case Study
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                            d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}

/* ─── README Content ─── */
function ReadmeContent() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📄</span>
                <h2 className="text-base font-semibold text-gray-800">README.md</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
                Hugo Cohen-Cofflard — Developer, designer, system thinker.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
                I build things that sit at the intersection of technology and creative direction.
                My work spans full-stack development, UI/UX design, photography, and video production.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
                I believe the best products come from people who understand both the system and the story.
                Code is structure. Design is emotion. The interesting work happens where they meet.
            </p>
            <div className="border-t pt-4 mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Currently</h3>
                <p className="text-sm text-gray-700">Applying to Master Ingémédia — Université de Toulon</p>
            </div>
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                    {["Full-Stack Dev", "UI/UX Design", "Creative Direction", "System Architecture", "AI Integration", "Photography"].map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── CoreModules Content ─── */
function CoreModulesContent() {
    const modules = [
        { name: "Frontend", items: ["React", "Next.js", "React Native", "Framer Motion", "Tailwind CSS", "TypeScript"] },
        { name: "Backend", items: ["Node.js", "NestJS", "Express", "Prisma", "PostgreSQL", "REST APIs"] },
        { name: "AI & Data", items: ["OpenAI API", "Prompt Engineering", "Structured Data Pipelines"] },
        { name: "Creative", items: ["Figma", "Blender", "DaVinci Resolve", "Lightroom", "Color Grading"] },
        { name: "DevOps", items: ["Git", "Docker", "Linux", "CI/CD", "Vercel"] },
        { name: "Soft Skills", items: ["System Thinking", "Project Management", "Client Communication", "Creative Direction"] },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🧠</span>
                <h2 className="text-base font-semibold text-gray-800">Core Modules</h2>
            </div>
            <p className="text-xs text-gray-400 mb-3">Technical stack &amp; competencies — loaded and active.</p>
            {modules.map(mod => (
                <div key={mod.name}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                        {mod.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {mod.items.map(item => (
                            <span key={item} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-md">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─── Resume Content ─── */
function ResumeContent() {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                        <path
                            d="M2 3C2 1.34 3.34 0 5 0H12L18 6V21C18 22.66 16.66 24 15 24H5C3.34 24 2 22.66 2 21V3Z"
                            fill="#EF4444"
                            fillOpacity="0.2"
                        />
                        <path
                            d="M14 2H6C5.45 2 5 2.45 5 3V21C5 21.55 5.45 22 6 22H14C14.55 22 15 21.55 15 21V3C15 2.45 14.55 2 14 2Z"
                            fill="#EF4444"
                        />
                    </svg>
                </div>
                <div>
                    <h3 className="text-base font-semibold text-gray-800">
                        Resume_2026.pdf
                    </h3>
                    <p className="text-xs text-gray-500">Updated Jan 12, 2026</p>
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600 mb-3">
                    Looking for my full resume?
                </p>
                <div className="flex gap-3">
                    <button
                        className="px-4 py-2 bg-white border border-gray-200 rounded-md
              text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => window.open("/resume.pdf", "_blank")}
                    >
                        Preview
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-900 text-white rounded-md
              text-sm font-medium hover:bg-gray-800 transition-colors"
                        onClick={() => {
                            const link = document.createElement("a");
                            link.href = "/resume.pdf";
                            link.download = "Resume_Hugo_Cohen_Cofflard.pdf";
                            link.click();
                        }}
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Contact Content ─── */
function ContactContent() {
    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-600 leading-relaxed">
                Always open to discussing new projects, technical challenges, or creative
                collaborations.
            </p>

            <div className="space-y-4">
                <a
                    href="mailto:contact@hnc-studio.corn"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        ✉️
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">Email</div>
                        <div className="text-sm text-gray-800">contact@hnc-studio.com</div>
                    </div>
                </a>

                <a
                    href="https://linkedin.com/in/hugocohencofflard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        In
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">LinkedIn</div>
                        <div className="text-sm text-gray-800">
                            linkedin.com/in/hugocohencofflard
                        </div>
                    </div>
                </a>

                <a
                    href="https://github.com/Start-sys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 group-hover:scale-110 transition-transform">
                        Gh
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">GitHub</div>
                        <div className="text-sm text-gray-800">github.com/Start-sys</div>
                    </div>
                </a>
            </div>
        </div>
    );
}

/* ─── About Content ─── */
function AboutContent() {
    return (
        <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 overflow-hidden">
                {/* Placeholder for avatar */}
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Hugo Cohen-Cofflard</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
                Full-stack developer with a passion for system design and creative
                direction. Currently modifying the fabric of reality via code.
            </p>
        </div>
    );
}
