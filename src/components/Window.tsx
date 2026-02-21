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
import type { WindowConfig } from "@/data/desktopItems";
import TerminalLogs from "./TerminalLogs";
import FinderLayout from "./FinderLayout";
import { useLanguage } from "@/context/LanguageContext";

const WINDOW_WIDTH = 560;

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
    windowId,
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
            onPointerDown={(e) => {
                e.stopPropagation();
                onFocus();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
                position: "absolute",
                zIndex,
                width: WINDOW_WIDTH,
                top: "10%",
                left: `calc(50% - ${WINDOW_WIDTH / 2}px)`,
                boxShadow: isFocused
                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0,0,0,0.05)"
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
            className="flex flex-col bg-white/90 backdrop-blur-xl rounded-xl overflow-hidden"
        >
            {/* ─── Title Bar (Classic) ─── */}
            {/* For projects (headless), we skip this and let content handle it */}
            {config.contentType !== "project" && (
                <div
                    className="h-10 px-4 flex items-center justify-between bg-gray-100/50
             border-b border-gray-200/50 cursor-grab active:cursor-grabbing select-none"
                    onPointerDown={(e) => {
                        e.stopPropagation();
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
            )}

            {/* Content area — terminal gets dark bg, others white */}
            {config.contentType === "terminal" ? (
                <div onMouseDown={(e) => e.stopPropagation()}>
                    <TerminalLogs onOpenWindow={onOpenWindow} />
                </div>
            ) : config.contentType === "project" ? (
                /* Finder Layout: Full width/height, manages its own scroll/padding/controls */
                <div
                    className="flex-1 bg-white text-gray-800 overflow-hidden rounded-xl"
                    style={{ height: "100%", minHeight: 300 }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <FinderLayout
                        config={config}
                        projectId={windowId}
                        onOpenWindow={onOpenWindow}
                        onClose={onClose}
                        onMinimize={onMinimize}
                        dragControls={dragControls}
                        onFocus={onFocus}
                    />
                </div>
            ) : (
                /* Generic Content: Default padding */
                <div
                    className="p-6 overflow-y-auto bg-white text-gray-800"
                    style={{ maxHeight: "calc(80vh - 40px)", minHeight: 300 }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <WindowContent config={config} />
                </div>
            )}
        </motion.div>
    );
}

/** Routes content rendering based on contentType */
function WindowContent({ config }: { config: WindowConfig }) {
    const { language } = useLanguage();

    switch (config.contentType) {
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
        case "trash-content":
            return <TrashContent />;
        case "terminal":
            return null;
        default:
            return (
                <p className="text-gray-400">
                    {language === "fr" ? "Contenu à venir." : "Content coming soon."}
                </p>
            );
    }
}



/* ─── README Content ─── */
function ReadmeContent() {
    const { language } = useLanguage();
    const t =
        language === "fr"
            ? {
                intro: "Ce n’est pas seulement un portfolio.\nC’est un système en cours d’évolution.",
                whoTitle: "Qui je suis",
                whoBody1:
                    "J’ai grandi entouré d’ordinateurs. Je les ouvrais avant même de vraiment les comprendre.",
                whoBody2:
                    "J’ai exploré de nombreuses directions : développement, 3D, machines virtuelles, photographie, vidéo, systèmes IA. Je ne suis jamais resté dans une seule voie. J’ai exploré.",
                devTitle: "La phase développement",
                devBody1:
                    "Pendant des années, le développement a semblé être la voie logique. J’ai gagné en compétence. J’ai appris l’architecture et les contraintes de production.",
                devBody2:
                    "Mais à un moment, j’ai réalisé que je m’intéressais davantage au pourquoi nous construisons qu’au comment.",
                todayTitle: "Où j’en suis aujourd’hui",
                todayBody:
                    "Je suis toujours en évolution. Ce qui reste constant : je suis fasciné par les systèmes — techniques, créatifs, interactifs.",
                whyTitle: "Pourquoi Ingémédia",
                whyBody:
                    "Je veux explorer l’interaction au-delà de l’utilité. Concevoir des expériences, pas seulement des applications. Expérimenter la narration, le mouvement et le sens.",
                status: "Statut système : affinage de la direction.",
            }
            : {
                intro: "This is not just a portfolio.\nIt’s a system in progress.",
                whoTitle: "Who I Am",
                whoBody1:
                    "I grew up surrounded by computers. Opening them before I fully understood them.",
                whoBody2:
                    "I have explored many directions: development, 3D, virtual machines, photography, video, AI systems. I never stayed in one lane for long. I explored.",
                devTitle: "The Development Phase",
                devBody1:
                    "For years, development felt like the logical path. I became capable. I learned architecture and production constraints.",
                devBody2:
                    "But at some point, I realized I am more interested in why we build than only how we build.",
                todayTitle: "Where I Stand Today",
                todayBody:
                    "I am still evolving. What remains constant: I am fascinated by systems — technical systems, creative systems, interactive systems.",
                whyTitle: "Why Ingémédia",
                whyBody:
                    "I want to explore interaction beyond utility. To design experiences, not just applications. To experiment with narrative, motion and meaning.",
                status: "System status: refining direction.",
            };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Hugo Cohen--Cofflard</h2>

            <div className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {t.intro.split("\n").map((line, index) => (
                        <span key={`${line}-${index}`}>
                            {line}
                            {index === 0 && <br />}
                        </span>
                    ))}
                </p>

                <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1 mb-2">{t.whoTitle}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {t.whoBody1}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {t.whoBody2}
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1 mb-2">{t.devTitle}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {t.devBody1}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {language === "en" ? (
                            <>
                                But at some point, I realized I am more interested in
                                <span className="text-gray-900 font-medium"> why we build</span>
                                {" than only "}
                                <span className="text-gray-900 font-medium">how we build</span>.
                            </>
                        ) : (
                            <>
                                Mais à un moment, j’ai réalisé que je m’intéressais davantage au
                                <span className="text-gray-900 font-medium"> pourquoi nous construisons</span>
                                {" plutôt qu’au "}
                                <span className="text-gray-900 font-medium">comment nous construisons</span>.
                            </>
                        )}
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1 mb-2">{t.todayTitle}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {t.todayBody}
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1 mb-2">{t.whyTitle}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {t.whyBody}
                    </p>
                </div>

                <div className="pt-2">
                    <code className="text-xs text-green-600 font-mono block">{t.status}</code>
                </div>
            </div>
        </div>
    );
}

/* ─── CoreModules Content ─── */
function CoreModulesContent() {
    const { language } = useLanguage();
    const data =
        language === "fr"
            ? {
                title: "CoreModules.app",
                subtitle: "Vue d’ensemble de l’architecture personnelle",
                technicalStackTitle: "Stack technique",
                softSkillsTitle: "Compétences transverses",
                coreFocusTitle: "Axes clés",
                experiencesTitle: "Projets & expériences",
                technicalStack: [
                    {
                        title: "IDE & Outils",
                        items: ["IntelliJ IDEA", "WebStorm", "Rider", "PyCharm", "VS Code"],
                    },
                    {
                        title: "Langages",
                        items: ["Java", "C#", "Python", "JavaScript", "TypeScript", "C++"],
                    },
                    {
                        title: "Web & Frameworks",
                        items: ["Vue.js", "Express.js", "Spring"],
                    },
                    {
                        title: "Bases de données & DevOps",
                        items: ["MySQL", "MongoDB", "Docker", "VMware", "Linux", "Windows"],
                    },
                ],
                leadershipSkills: [
                    "Résolution de problèmes",
                    "Collaboration en équipe",
                    "Communication efficace",
                    "Gestion du temps",
                    "Adaptabilité",
                    "Apprentissage continu",
                    "Leadership de projet (SAE, alternance)",
                ],
                softSkills: [
                    "Cycle complet de projet : concept à déploiement",
                    "Ingénierie backend avec Java & Spring",
                    "Expérience frontend avec Vue.js",
                    "Outils DevOps et environnements (Docker, VM)",
                    "Expérience du workflow de dev jeu (Unity)",
                ],
                experiences: [
                    {
                        title: "Alternance @ CSI (Cash Systèmes Industrie)",
                        desc: "Intégration de workflows, refactor et maintenance sur stack MongoDB/Java.",
                    },
                    {
                        title: "SAE – Studio Kakou (jeu RTS Java)",
                        desc: "Jeu de stratégie multijoueur avec backlog, sprints, Trello et Git.",
                    },
                    {
                        title: "TP IA & Jeux (Ms. PacMan)",
                        desc: "Réseaux de neurones avec Encog, rétropropagation résiliente, benchmark d’agents.",
                    },
                    {
                        title: "SAE Réseau & Docker",
                        desc: "Déploiement de microservices, NAT/iptables en VM et conteneurs.",
                    },
                    {
                        title: "SAE Gestion de Projet",
                        desc: "Rédaction de specs, planification, rétrospectives et suivi d’équipe.",
                    },
                    {
                        title: "Nutrika",
                        desc: "Conception produit IA orientée nutrition : structuration des ingrédients, logique de recommandation et UX.",
                    },
                    {
                        title: "HNC Studio",
                        desc: "Écosystème créatif et technique personnel : branding, développement web et structuration d’un système ERP interne.",
                    },
                ],
            }
            : {
                title: "CoreModules.app",
                subtitle: "Personal Architecture Overview",
                technicalStackTitle: "Technical Stack",
                softSkillsTitle: "Soft Skills",
                coreFocusTitle: "Core Focus",
                experiencesTitle: "Projects & Experiences",
                technicalStack: [
                    {
                        title: "IDE & Tools",
                        items: ["IntelliJ IDEA", "WebStorm", "Rider", "PyCharm", "VS Code"],
                    },
                    {
                        title: "Programming Languages",
                        items: ["Java", "C#", "Python", "JavaScript", "TypeScript", "C++"],
                    },
                    {
                        title: "Web & Frameworks",
                        items: ["Vue.js", "Express.js", "Spring"],
                    },
                    {
                        title: "Databases & DevOps",
                        items: ["MySQL", "MongoDB", "Docker", "VMware", "Linux", "Windows"],
                    },
                ],
                leadershipSkills: [
                    "Problem-solving",
                    "Team collaboration",
                    "Effective communication",
                    "Time management",
                    "Adaptability",
                    "Continuous learning",
                    "Leadership in projects (SAE, alternance)",
                ],
                softSkills: [
                    "Full project lifecycle: concept to deployment",
                    "Backend engineering with Java & Spring",
                    "Frontend experience with Vue.js",
                    "DevOps tooling and environments (Docker, VM)",
                    "Game development workflow exposure (Unity)",
                ],
                experiences: [
                    {
                        title: "Alternance @ CSI (Cash Systèmes Industrie)",
                        desc: "Workflow integration, refactor and maintenance on MongoDB/Java stack.",
                    },
                    {
                        title: "SAE – Studio Kakou (RTS Java game)",
                        desc: "Multiplayer strategy game with backlog, sprints, Trello and Git.",
                    },
                    {
                        title: "TP IA & Jeux (Ms. PacMan)",
                        desc: "Neural networks with Encog, resilient propagation, agent benchmarking.",
                    },
                    {
                        title: "SAE Réseau & Docker",
                        desc: "Microservices deployment, NAT/iptables in VMs and containers.",
                    },
                    {
                        title: "SAE Gestion de Projet",
                        desc: "Specs writing, planning, retrospectives, and team follow-up.",
                    },
                    {
                        title: "Nutrika",
                        desc: "AI product design focused on nutrition: ingredient structuring, recommendation logic, and UX.",
                    },
                    {
                        title: "HNC Studio",
                        desc: "Personal creative and technical ecosystem: branding, web development, and internal ERP system design.",
                    },
                ],
            };

    return (
        <div className="!space-y-3 px-6 py-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-900">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M4 7.5h16" />
                        <path d="M4 12h16" />
                        <path d="M4 16.5h16" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-[15px] font-semibold text-gray-900">{data.title}</h2>
                    <p className="text-[12px] text-gray-500">{data.subtitle}</p>
                </div>
            </div>

            <section className="space-y-3 rounded-xl bg-gray-50/70 border border-gray-100 p-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{data.technicalStackTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {data.technicalStack.map((group) => (
                        <div key={group.title} className="space-y-2">
                            <h4 className="text-[12px] font-semibold text-gray-700">{group.title}</h4>
                            <div className="flex flex-wrap gap-2">
                                {group.items.map((item) => (
                                    <span
                                        key={item}
                                        className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[11px] text-gray-700 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-3 rounded-xl bg-gray-50/70 border border-gray-100 p-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{data.softSkillsTitle}</h3>
                <ul className="text-[12px] text-gray-600 space-y-1">
                    {data.leadershipSkills.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="space-y-3 rounded-xl bg-gray-50/70 border border-gray-100 p-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{data.coreFocusTitle}</h3>
                <ul className="text-[12px] text-gray-600 space-y-1">
                    {data.softSkills.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="space-y-3 rounded-xl bg-gray-50/70 border border-gray-100 p-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{data.experiencesTitle}</h3>
                <div className="space-y-3">
                    {data.experiences.map((exp) => (
                        <div key={exp.title} className="text-[12px] text-gray-600">
                            <div className="font-semibold text-gray-700">{exp.title}</div>
                            <div className="text-gray-500 leading-relaxed">{exp.desc}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

/* ─── Trash Content ─── */
function TrashContent() {
    const { language } = useLanguage();
    const trashItems = [
        "unfinished_ideas.txt",
        "experimental_ui.fig",
        "bad_render_v1.png",
        "overcomplicated_system.js",
    ];

    return (
        <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded border border-gray-100 font-mono text-sm text-gray-500">
                <p className="text-xs uppercase text-gray-400 mb-3 tracking-widest">/dev/null/history</p>
                <ul className="space-y-2">
                    {trashItems.map((item) => (
                        <li key={item} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                            <span>📄</span>
                            <span className="line-through decoration-gray-300">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="text-center text-xs text-gray-400 italic">
                {language === "fr" ? (
                    <>
                        Petit clin d’œil à ton processus.
                        <br />
                        Rien ne se perd, tout se transforme.
                    </>
                ) : (
                    <>
                        A small nod to your process.
                        <br />
                        Nothing is lost, everything transforms.
                    </>
                )}
            </p>
        </div>
    );
}

/* ─── Resume Content ─── */
function ResumeContent() {
    const { language } = useLanguage();
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const resumeUrl = `${basePath}/resume.pdf`;

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
                        {language === "fr" ? "CV_2026.pdf" : "Resume_2026.pdf"}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {language === "fr" ? "Mis à jour le 12 janv. 2026" : "Updated Jan 12, 2026"}
                    </p>
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600 mb-3">
                    {language === "fr" ? "Tu cherches mon CV complet ?" : "Looking for my full resume?"}
                </p>
                <div className="flex gap-3">
                    <button
                        className="px-4 py-2 bg-white border border-gray-200 rounded-md
              text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => window.open(resumeUrl, "_blank")}
                    >
                        {language === "fr" ? "Aperçu" : "Preview"}
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-900 text-white rounded-md
              text-sm font-medium hover:bg-gray-800 transition-colors"
                        onClick={() => {
                            const link = document.createElement("a");
                            link.href = resumeUrl;
                            link.download =
                                language === "fr"
                                    ? "CV_Hugo_Cohen_Cofflard.pdf"
                                    : "Resume_Hugo_Cohen_Cofflard.pdf";
                            link.click();
                        }}
                    >
                        {language === "fr" ? "Télécharger le PDF" : "Download PDF"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Contact Content ─── */
function ContactContent() {
    const { language } = useLanguage();

    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-600 leading-relaxed">
                {language === "fr"
                    ? "Toujours ouvert à discuter de nouveaux projets, de défis techniques ou de collaborations créatives."
                    : "Always open to discussing new projects, technical challenges, or creative collaborations."}
            </p>

            <div className="space-y-4">
                <a
                    href="mailto:contact@hnc-studio.fr"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        ✉️
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">Email</div>
                        <div className="text-sm text-gray-800">contact@hnc-studio.fr</div>
                    </div>
                </a>

                <a
                    href="https://www.linkedin.com/in/hugo-cohen-cofflard-63ab7a23a/"
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
                            linkedin.com/in/hugo-cohen-cofflard-63ab7a23a/
                        </div>
                    </div>
                </a>

                <a
                    href="https://github.com/Hc-Sky"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 group-hover:scale-110 transition-transform">
                        Gh
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium">GitHub</div>
                        <div className="text-sm text-gray-800">github.com/Hc-Sky</div>
                    </div>
                </a>
            </div>
        </div>
    );
}

/* ─── About Content ─── */
function AboutContent() {
    const { language } = useLanguage();

    return (
        <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 overflow-hidden">
                {/* Placeholder for avatar */}
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Hugo Cohen-Cofflard</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
                {language === "fr"
                    ? "Développeur full-stack passionné par le design de systèmes et la direction créative. Actuellement en train de modifier le tissu du réel via le code."
                    : "Full-stack developer with a passion for system design and creative direction. Currently modifying the fabric of reality via code."}
            </p>
        </div>
    );
}
