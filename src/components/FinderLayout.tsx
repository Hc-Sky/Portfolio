import React, { useState, useMemo } from "react";
import { desktopItems, WindowConfig, DesktopItem } from "@/data/desktopItems";
import { DragControls } from "framer-motion";
import {
    IconFolder,
    IconFileText,
    IconFileWeb,
    IconFileJson,
    MacSidebarIcon,
    IconChevronRight
} from "./FinderIcons";

/* ─── Virtual File System Types ─── */

type FileType = "folder" | "file" | "link";

interface VirtualFile {
    id: string;
    name: string;
    type: FileType;
    icon?: string; // Emoji or custom SVG path
    content?: string; // For text files
    url?: string; // For links
    meta?: string; // e.g., "4 KB"
}

/* ─── Helper: Generate Files from Config ─── */

function generateVirtualFiles(config: WindowConfig): VirtualFile[] {
    const files: VirtualFile[] = [];

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

    // 2. Case Study Link
    if (config.caseStudyUrl) {
        files.push({
            id: "casestudy",
            name: "Full Case Study.webloc",
            type: "link",
            url: config.caseStudyUrl,
            meta: "Web Link",
        });
    }

    // 3. Assets Folder (Decorative)
    files.push({
        id: "assets",
        name: "Assets",
        type: "folder",
        meta: "4 items",
    });

    // 4. Specs.json (Technical details)
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

/* ─── Components ─── */

interface FinderLayoutProps {
    config: WindowConfig;
    onOpenWindow?: (id: string) => void;
    onClose?: () => void;
    onMinimize?: () => void;
    dragControls?: DragControls;
    onFocus?: () => void;
}

export default function FinderLayout({
    config,
    onOpenWindow,
    onClose,
    onMinimize,
    dragControls,
    onFocus
}: FinderLayoutProps) {
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [openedFile, setOpenedFile] = useState<VirtualFile | null>(null);

    // Internal state for navigation (In-place updates)
    const [activeConfig, setActiveConfig] = useState(config);

    // Sync state if prop changes (e.g. window reused)
    React.useEffect(() => {
        setActiveConfig(config);
    }, [config]);

    // Handle Sidebar Navigation (In-place)
    const handleNavigate = (id: string) => {
        const targetItem = desktopItems.find(item => item.id === id);
        if (targetItem && targetItem.window) {
            // Update current window content
            setActiveConfig(targetItem.window);
            setSelectedFileId(null);
            setOpenedFile(null);
        } else {
            // Fallback: Open external app or special handling
            onOpenWindow?.(id);
        }
    };

    // Generate files for current view
    const files = useMemo(() => generateVirtualFiles(activeConfig), [activeConfig]);

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
                    className="h-[52px] border-b border-gray-100 flex items-center px-8 justify-between select-none bg-white shrink-0"
                    onPointerDown={(e) => {
                        dragControls?.start(e);
                        onFocus?.();
                    }}
                >
                    {/* Title / Breadcrumbs (Centered or Left) */}
                    <div className="flex flex-col gap-0.5 justify-center">
                        <h1 className="text-[15px] font-semibold text-gray-800 tracking-tight leading-none">{activeConfig.title}</h1>
                        <p className="text-[11px] text-gray-400 font-medium leading-none">Project Folder</p>
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
                <div className="flex-1 px-10 py-10 grid grid-cols-4 gap-y-12 gap-x-10 content-start overflow-y-auto"
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
    // Filter only projects for the "Locations" list
    const projects = desktopItems.filter(item =>
        item.window.contentType === "project" && item.id !== "trash"
    );

    return (
        <div className="w-[260px] flex flex-col bg-gray-50/90 backdrop-blur-3xl text-gray-600 border-r border-gray-200/50 rounded-tl-xl rounded-bl-xl">
            {/* Header with Traffic Lights - Aligned with Content Header Height */}
            <div
                className="h-[52px] pl-10 flex items-center gap-2 group shrink-0"
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
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                {/* Favorites Section */}
                <div className="space-y-1">
                    <div className="px-2 text-[11px] font-semibold text-gray-400/80 mb-1">Favorites</div>
                    <div className="space-y-[1px]">
                        <SidebarItem icon={<MacSidebarIcon type="work" size={16} />} label="Work" active={false} />
                        <SidebarItem icon={<MacSidebarIcon type="user" size={16} />} label="About Me" active={false} />
                        <SidebarItem icon={<MacSidebarIcon type="resume" size={16} />} label="Resume" active={false} />
                        <SidebarItem icon={<MacSidebarIcon type="trash" size={16} />} label="Trash" active={false} />
                    </div>
                </div>

                {/* Locations Section (Projects) */}
                <div className="space-y-1">
                    <div className="px-2 text-[11px] font-semibold text-gray-400/80 mb-1">Locations</div>
                    <div className="space-y-[1px]">
                        {projects.map((p) => (
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

            {/* Bottom Storage (Decorative) */}
            <div className="px-5 pt-8 pb-4">
                <div className="h-1.5 w-full bg-gray-200/60 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400/50 w-[70%] rounded-full"></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2.5 font-medium tracking-wide">100 GB available</p>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`px-3 py-2.5 rounded-[6px] flex items-center gap-3 cursor-pointer transition-colors
                ${active ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-100/80 text-gray-600 hover:text-black"}`}
        >
            <span className={`w-4 h-4 flex items-center justify-center opacity-80 ${active ? "opacity-100" : ""}`}>{icon}</span>
            <span className="text-[13px] tracking-tight">{label}</span>
        </div>
    );
}

function FileIcon({ file, selected, onSelect, onOpen }: { file: VirtualFile; selected: boolean; onSelect: (e: React.MouseEvent) => void; onOpen: () => void }) {
    // Visuals based on file type
    const getIcon = () => {
        if (file.type === "folder") return <IconFolder size={64} className="mb-1" />; // Assets
        if (file.name.endsWith(".md")) return <IconFileText size={58} className="mb-1" />; // Readme
        if (file.type === "link") return <IconFileWeb size={58} className="mb-1" />; // Web
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

function FilePreview({ file, onBack, dragControls, onFocus, onClose, onMinimize }: { file: VirtualFile; onBack: () => void; dragControls?: DragControls; onFocus?: () => void; onClose?: () => void; onMinimize?: () => void }) {
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
                    Done
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 font-mono text-[13px] leading-relaxed bg-white text-gray-800 whitespace-pre-wrap selection:bg-blue-100 selection:text-blue-900">
                {file.type === "link" ? (
                    <div className="flex flex-col items-center justify-center h-full gap-6">
                        <IconFileWeb size={96} />
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-xl text-gray-900">External Link</h3>
                            <p className="text-gray-500 text-sm">{file.url}</p>
                        </div>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all hover:scale-105 active:scale-95">Open Website</a>
                    </div>
                ) : (
                    file.content || "(No content)"
                )}
            </div>
        </div>
    );
}
