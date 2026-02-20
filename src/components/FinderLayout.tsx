import React, { useState, useMemo } from "react";
import { WindowConfig, DesktopItem, getDesktopItems } from "@/data/desktopItems";
import { DragControls } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
    IconFolder,
    IconFileText,
    IconFileWeb,
    IconFileJson,
    MacSidebarIcon,
    IconChevronRight
} from "./FinderIcons";

/* ─── Virtual File System Types ─── */

type FileType = "folder" | "file" | "link" | "image";

interface VirtualFile {
    id: string;
    name: string;
    type: FileType;
    icon?: string; // Emoji or custom SVG path
    content?: string; // For text files
    url?: string; // For links
    meta?: string; // e.g., "4 KB"
}

const PROJECT_RESOURCE_FILES: Record<string, string[]> = {
    nutrika: ["nutrika.png"],
    "hnc-studio": ["hnc_logo.svg"],
    referentiel: [],
    gameonweb: ["gameplay.png", "screen.png"],
    kakouquest: ["gameplay.png"],
};

function renderInlineWithLinks(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
        if (!part) return null;
        if (urlRegex.test(part)) {
            return (
                <a
                    key={`${part}-${index}`}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline underline-offset-2 break-all"
                >
                    {part}
                </a>
            );
        }
        return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
    });
}

function renderMarkdownLike(content: string) {
    const lines = content.split("\n");

    return (
        <div className="space-y-3">
            {lines.map((line, index) => {
                const trimmedLine = line.trim();

                if (!trimmedLine) {
                    return <div key={`spacer-${index}`} className="h-1" />;
                }

                if (trimmedLine.startsWith("# ")) {
                    return (
                        <h3
                            key={`h1-${index}`}
                            className="text-[16px] font-semibold text-gray-900 mt-3 first:mt-0"
                        >
                            {renderInlineWithLinks(trimmedLine.replace(/^#\s+/, ""))}
                        </h3>
                    );
                }

                if (trimmedLine.startsWith("## ")) {
                    return (
                        <h4
                            key={`h2-${index}`}
                            className="text-[14px] font-semibold text-gray-800 mt-2"
                        >
                            {renderInlineWithLinks(trimmedLine.replace(/^##\s+/, ""))}
                        </h4>
                    );
                }

                if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
                    return (
                        <p key={`li-${index}`} className="text-[13px] leading-6 text-gray-700 pl-4 relative">
                            <span className="absolute left-0 top-[9px] w-1 h-1 rounded-full bg-gray-400" />
                            {renderInlineWithLinks(trimmedLine.replace(/^[-*]\s+/, ""))}
                        </p>
                    );
                }

                return (
                    <p key={`p-${index}`} className="text-[13px] leading-6 text-gray-700">
                        {renderInlineWithLinks(trimmedLine)}
                    </p>
                );
            })}
        </div>
    );
}

/* ─── Helper: Generate Files from Config ─── */

function generateVirtualFiles(
    config: WindowConfig,
    language: "fr" | "en",
    projectId?: string,
): VirtualFile[] {
    const files: VirtualFile[] = [];
    const resourceFiles = projectId ? PROJECT_RESOURCE_FILES[projectId] ?? [] : [];

    // 1. README.md (The main content)
    if (config.sections && config.sections.length > 0) {
        const mdContent = config.sections
            .map((s) => `# ${s.heading}\n\n${s.body}`)
            .join("\n\n");

        files.push({
            id: "readme",
            name: "README.md",
            type: "file",
            content: mdContent,
            meta: "2 KB",
        });
    } else if (config.description) {
        files.push({
            id: "readme",
            name: "README.md",
            type: "file",
            content: config.description,
            meta: "1 KB",
        });
    }

    // 2. Project Link
    if (config.caseStudyUrl) {
        files.push({
            id: "casestudy",
            name:
                language === "fr"
                    ? "Voir le projet.webloc"
                    : "View Project.webloc",
            type: "link",
            url: config.caseStudyUrl,
            meta: language === "fr" ? "Lien web" : "Web Link",
        });
    }

    // 3. Assets Folder (Decorative)
    files.push({
        id: "assets",
        name: language === "fr" ? "Ressources" : "Assets",
        type: "folder",
        meta:
            language === "fr"
                ? `${resourceFiles.length} élément${resourceFiles.length > 1 ? "s" : ""}`
                : `${resourceFiles.length} item${resourceFiles.length > 1 ? "s" : ""}`,
    });

    // 4. Image assets from /public/resources/projects/<projectId>
    resourceFiles.forEach((fileName, index) => {
        files.push({
            id: `resource-${index}`,
            name: fileName,
            type: "image",
            url: `/resources/projects/${projectId}/${fileName}`,
            meta: language === "fr" ? "Image" : "Image",
        });
    });

    // 5. Specs.json (Technical details)
    if (config.bullets) {
        const jsonContent = JSON.stringify(
            config.bullets.reduce((acc, curr) => ({ ...acc, [curr.label]: curr.value }), {}),
            null,
            2
        );
        files.push({
            id: "specs",
            name: "specs.json",
            type: "file",
            content: jsonContent,
            meta: "JSON",
        });
    }

    return files;
}

function getProjectOrder(item: DesktopItem) {
    return item.position.y * 1000 + item.position.x;
}

/* ─── Components ─── */

interface FinderLayoutProps {
    config: WindowConfig;
    projectId?: string;
    onOpenWindow?: (id: string) => void;
    onClose?: () => void;
    onMinimize?: () => void;
    dragControls?: DragControls;
    onFocus?: () => void;
}

export default function FinderLayout({
    config,
    projectId,
    onOpenWindow,
    onClose,
    onMinimize,
    dragControls,
    onFocus
}: FinderLayoutProps) {
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [openedFile, setOpenedFile] = useState<VirtualFile | null>(null);
    const [activeProjectId, setActiveProjectId] = useState<string | undefined>(projectId);
    const { language } = useLanguage();
    const desktopItems = getDesktopItems(language);

    // Internal state for navigation (In-place updates)
    const [activeConfig, setActiveConfig] = useState(config);

    // Sync state if prop changes (e.g. window reused)
    React.useEffect(() => {
        setActiveConfig(config);
        setActiveProjectId(projectId);
    }, [config, projectId]);

    // Handle Sidebar Navigation (In-place)
    const handleNavigate = (id: string) => {
        const targetItem = desktopItems.find(item => item.id === id);
        if (targetItem && targetItem.window) {
            // Update current window content
            setActiveConfig(targetItem.window);
            setActiveProjectId(targetItem.id);
            setSelectedFileId(null);
            setOpenedFile(null);
        } else {
            // Fallback: Open external app or special handling
            onOpenWindow?.(id);
        }
    };

    // Generate files for current view
    const files = useMemo(
        () => generateVirtualFiles(activeConfig, language, activeProjectId),
        [activeConfig, language, activeProjectId],
    );

    // Handle File Double Click
    const handleOpenFile = (file: VirtualFile) => {
        if (file.type === "link" && file.url) {
            console.log("Opening link:", file.url);
            setOpenedFile(file);
        } else if (file.type === "folder") {
            // Enter folder (not implemented fully, just empty view)
        } else {
            setOpenedFile(file);
        }
    };

    // If a file is opened (preview mode)
    if (openedFile) {
        return (
            <FilePreview
                file={openedFile}
                projectTitle={activeConfig.title}
                onBack={() => setOpenedFile(null)}
                dragControls={dragControls}
                onClose={onClose}
                onMinimize={onMinimize}
                onFocus={onFocus}
            />
        );
    }

    return (
        <div className="flex h-full absolute inset-0 text-[13px] font-sans bg-transparent">
            {/* ─── Sidebar ─── */}
            <FinderSidebar
                onNavigate={handleNavigate}
                currentTitle={activeConfig.title}
                onClose={onClose}
                onMinimize={onMinimize}
                dragControls={dragControls}
                onFocus={onFocus}
            />

            {/* ─── Main Content (Grid) ─── */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden rounded-tr-xl rounded-br-xl">
                {/* Content Header / Toolbar (Unified Look) */}
                <div
                    className="h-[52px] border-b border-gray-100 flex items-center !px-5 justify-between select-none bg-white shrink-0"
                    onPointerDown={(e) => {
                        dragControls?.start(e);
                        onFocus?.();
                    }}
                >
                    {/* Title / Breadcrumbs (Centered or Left) */}
                    <div className="flex flex-col gap-0.5 justify-center">
                        <h1 className="text-[15px] font-semibold text-gray-800 tracking-tight leading-none">{activeConfig.title}</h1>
                        <p className="text-[11px] text-gray-400 font-medium leading-none">
                            {language === "fr" ? "Dossier projet" : "Project Folder"}
                        </p>
                    </div>
                    {/* Search Icon (Reference Style) */}
                    <div className="flex gap-4 opacity-40">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>

                {/* Grid Area */}
                <div className="flex-1 !px-6 !py-6 grid grid-cols-3 gap-y-7 gap-x-5 content-start overflow-y-auto"
                    onClick={() => setSelectedFileId(null)} // Deselect on bg click
                >
                    {files.map((file) => (
                        <FileIcon
                            key={file.id}
                            file={file}
                            selected={selectedFileId === file.id}
                            onSelect={(e) => {
                                e.stopPropagation();
                                setSelectedFileId(file.id);
                            }}
                            onOpen={() => handleOpenFile(file)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Sub-Components ─── */

function FinderSidebar({
    onNavigate,
    currentTitle,
    onClose,
    onMinimize,
    dragControls,
    onFocus
}: {
    onNavigate?: (id: string) => void;
    currentTitle: string;
    onClose?: () => void;
    onMinimize?: () => void;
    dragControls?: DragControls;
    onFocus?: () => void;
}) {
    const { language } = useLanguage();
    const desktopItems = getDesktopItems(language);
    // Filter only projects for the "Locations" list
    const projects = desktopItems
        .filter((item: DesktopItem) => item.window.contentType === "project" && item.id !== "trash")
        .sort((a, b) => getProjectOrder(a) - getProjectOrder(b));

    return (
        <div className="w-[240px] flex flex-col bg-gray-50/90 backdrop-blur-3xl text-gray-600 border-r border-gray-200/50 rounded-tl-xl rounded-bl-xl">
            {/* Header with Traffic Lights - Aligned with Content Header Height */}
            <div
                className="h-[52px] !pl-3 flex items-center gap-2 group shrink-0"
                onPointerDown={(e) => {
                    dragControls?.start(e);
                    onFocus?.();
                }}
            >
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                        className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 flex items-center justify-center border border-black/10 transition-colors shadow-sm"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/50">×</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
                        className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 flex items-center justify-center border border-black/10 transition-colors shadow-sm"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/50">–</span>
                    </button>
                    <button
                        className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 flex items-center justify-center border border-black/10 transition-colors shadow-sm"
                    >
                        <span className="opacity-0 group-hover:opacity-100 text-[6px] font-bold text-black/50">↗</span>
                    </button>
                </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto !px-2 !py-2 space-y-2">
                {/* Favorites Section */}
                <div className="space-y-0">
                    <div className="px-2 text-[10px] font-semibold text-gray-400/80 mb-0.5">
                        {language === "fr" ? "Favoris" : "Favorites"}
                    </div>
                    <div className="space-y-[1px]">
                        <SidebarItem
                            icon={<MacSidebarIcon type="work" size={16} />}
                            label={language === "fr" ? "Travail" : "Work"}
                            active={false}
                        />
                        <SidebarItem
                            icon={<MacSidebarIcon type="user" size={16} />}
                            label={language === "fr" ? "À propos" : "About Me"}
                            active={false}
                        />
                        <SidebarItem
                            icon={<MacSidebarIcon type="resume" size={16} />}
                            label={language === "fr" ? "CV" : "Resume"}
                            active={false}
                        />
                        <SidebarItem
                            icon={<MacSidebarIcon type="trash" size={16} />}
                            label={language === "fr" ? "Corbeille" : "Trash"}
                            active={false}
                        />
                    </div>
                </div>

                {/* Locations Section (Projects) */}
                <div className="space-y-0">
                    <div className="px-2 text-[10px] font-semibold text-gray-400/80 mb-0.5">
                        {language === "fr" ? "Emplacements" : "Locations"}
                    </div>
                    <div className="space-y-[1px]">
                        {projects.map((p: DesktopItem) => (
                            <SidebarItem
                                key={p.id}
                                icon={<MacSidebarIcon type="folder" size={16} />}
                                label={p.window.title}
                                active={p.window.title === currentTitle}
                                onClick={() => onNavigate?.(p.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`!px-2 !py-1 rounded-[6px] flex items-center gap-2 cursor-pointer transition-colors
                ${active ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-100/80 text-gray-600 hover:text-black"}`}
        >
            <span className={`w-4 h-4 flex items-center justify-center opacity-80 ${active ? "opacity-100" : ""}`}>{icon}</span>
            <span className="text-[12px] tracking-tight">{label}</span>
        </div>
    );
}

function FileIcon({ file, selected, onSelect, onOpen }: { file: VirtualFile; selected: boolean; onSelect: (e: React.MouseEvent) => void; onOpen: () => void }) {
    // Visuals based on file type
    const getIcon = () => {
        if (file.type === "folder") return <IconFolder size={64} className="mb-1" />; // Assets
        if (file.name.endsWith(".md")) return <IconFileText size={58} className="mb-1" />; // Readme
        if (file.type === "link") return <IconFileWeb size={58} className="mb-1" />; // Web
        if (file.type === "image" && file.url) {
            return (
                <div className="w-[58px] h-[58px] rounded-md overflow-hidden border border-gray-200 shadow-sm mb-1 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover pointer-events-none"
                        draggable={false}
                    />
                </div>
            );
        }
        if (file.name.endsWith(".json")) return <IconFileJson size={58} className="mb-1" />; // JSON
        return <div className="w-14 h-16 bg-gray-200 rounded"></div>;
    };

    return (
        <div
            className="flex flex-col items-center gap-1 group cursor-default"
            onClick={onSelect}
            onDoubleClick={onOpen}
        >
            <div className={`p-2 rounded-[4px] transition-colors ${selected ? "bg-gray-200/50" : ""}`}>
                {getIcon()}
            </div>
            <span
                className={`text-center px-1.5 py-0.5 rounded-[3px] text-[12px] font-medium leading-tight max-w-[100px] break-words tracking-tight
                ${selected ? "bg-[#0058D0] text-white" : "text-gray-600"}`}
            >
                {file.name}
            </span>
        </div>
    );
}

function FilePreview({ file, projectTitle, onBack, dragControls, onFocus, onClose, onMinimize }: { file: VirtualFile; projectTitle?: string; onBack: () => void; dragControls?: DragControls; onFocus?: () => void; onClose?: () => void; onMinimize?: () => void }) {
    const { language } = useLanguage();
    const isHncReadme = projectTitle === "HNC Studio" && file.name.endsWith(".md");
    const isReadmeFile = file.name.endsWith(".md");
    // Default: Text Editor View (Markdown or JSON)
    return (
        <div className="flex flex-col h-full bg-white relative rounded-xl overflow-hidden shadow-2xl">
            {/* Preview Window Header */}
            <div
                className="h-10 px-4 flex items-center justify-between bg-gray-50 border-b border-gray-200 select-none"
                onPointerDown={(e) => {
                    dragControls?.start(e);
                    onFocus?.();
                }}
            >
                {/* Re-render Traffic Lights here because we are overlaying the whole Finder */}
                <div className="flex gap-2 group" onPointerDown={(e) => e.stopPropagation()}>
                    <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 flex items-center justify-center border border-black/10"><span className="opacity-0 group-hover:opacity-100 text-[8px]">×</span></button>
                    <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 flex items-center justify-center border border-black/10"><span className="opacity-0 group-hover:opacity-100 text-[8px]">–</span></button>
                    <button className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 flex items-center justify-center border border-black/10"><span className="opacity-0 group-hover:opacity-100 text-[6px]">↗</span></button>
                </div>

                <div className="font-semibold text-xs text-black">{file.name}</div>

                <button
                    onClick={onBack}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 active:opacity-70"
                >
                    {language === "fr" ? "Terminé" : "Done"}
                </button>
            </div>

            <div
                className={`flex-1 overflow-y-auto p-6 bg-white text-gray-800 whitespace-pre-wrap selection:bg-blue-100 selection:text-blue-900 ${
                    isReadmeFile
                        ? isHncReadme
                            ? "font-sans text-[14px] leading-7"
                            : "font-sans text-[13px] leading-6"
                        : file.type === "image"
                            ? "font-sans"
                        : "font-mono text-[13px] leading-relaxed"
                }`}
            >
                {file.type === "link" ? (
                    <div className="flex flex-col items-center justify-center h-full gap-6">
                        <IconFileWeb size={96} />
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-xl text-gray-900">
                                {language === "fr" ? "Lien externe" : "External Link"}
                            </h3>
                            <p className="text-gray-500 text-sm">{file.url}</p>
                        </div>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all hover:scale-105 active:scale-95">
                            {language === "fr" ? "Ouvrir le site" : "Open Website"}
                        </a>
                    </div>
                ) : file.type === "image" && file.url ? (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-auto max-h-[62vh] object-contain"
                                draggable={false}
                            />
                        </div>
                        <div className="text-xs text-gray-500">{file.name}</div>
                    </div>
                ) : isReadmeFile && file.content ? (
                    renderMarkdownLike(file.content)
                ) : (
                    file.content || (language === "fr" ? "(Aucun contenu)" : "(No content)")
                )}
            </div>
        </div>
    );
}
