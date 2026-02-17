import React from "react";

/* ─── Generic SVG Props ─── */
interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    className?: string;
}

/* ─── Sidebar Icons (Official macOS Big Sur Style - Recreated SVGs) ─── */
/* Since we lack verified external asset URLs for all sidebar items, we recreate them 
   high-fidelity using SVGs to ensure they appear and look correct. */

// Base container for the colorful square icons
const SidebarIconBase = ({ color, children, size }: { color: string, children: React.ReactNode, size: number }) => (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        {/* Colorful Background with subtle gradient/shadow */}
        <div className={`absolute inset-0 rounded-[4px] ${color} shadow-sm`} style={{ opacity: 0.9 }}></div>
        {/* Icon Content */}
        <div className="relative z-10 text-white drop-shadow-md">
            {children}
        </div>
    </div>
);

// Specific Icons
/* ─── Sidebar Icons (Minimalist Line Style) ─── */
/* User requested: "sans couleur, juste des trait, simple" */

// Specific Icons
/* ─── Sidebar Icons (SF Symbols Style - Precise Strokes) ─── */

export function MacSidebarIcon({ type, size = 16 }: { type: "folder" | "recents" | "desktop" | "docs" | "downloads" | "airdrop" | "trash" | "work" | "user" | "resume" | "apps" | "home"; size?: number }) {

    // Default stroke props
    const strokeProps = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.5,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };

    switch (type) {
        // ─── Custom Mappings for Portfolio (Blue Filled Style) ───
        case "work":
        case "apps":
            // Grid / App Window
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-blue-500">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.8" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
                </svg>
            );

        case "user":
        case "home":
            // Person Circle (Blue)
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-blue-500">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                    <circle cx="12" cy="10" r="3.5" fill="currentColor" />
                    <path d="M7 20.662V19a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1.662" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            );

        case "resume":
        case "docs":
            // Document Text (Blue)
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-blue-500">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="10" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            );

        case "trash":
            // Trash (Bin)
            return (
                <svg {...strokeProps} className="text-blue-500">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
            );

        // ─── Standard macOS Icons ───
        case "desktop":
            // Desktop (Screen)
            return (
                <svg {...strokeProps} className="text-blue-500">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
            );

        case "downloads":
            // Down Arrow Circle
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-blue-500">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 7v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );

        case "recents":
            // Clock
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-blue-500">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );

        case "airdrop":
            // Airdrop (Waves)
            return (
                <svg {...strokeProps} className="text-blue-500">
                    <path d="M5 10c0-4 3.5-7.5 7-7.5s7 3.5 7 7.5" />
                    <path d="M8 13c0-2.5 2-4.5 4-4.5s4 2 4 4.5" />
                    <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
                    <path d="M12 16v5" />
                </svg>
            );

        default:
        case "folder":
            // Folder (Blue Filled)
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-blue-500">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="currentColor" />
                </svg>
            );
    }
}

// Re-export helper just in case
export function BigSurIcon(props: any) { return <MacSidebarIcon {...props} />; }


export function IconChevronRight({ size = 12, className, ...props }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

/* ─── Grid Icons (Real macOS Images from Framer CDN) ─── */
/* Matching DesktopIcon.tsx sources */

const IMG_FOLDER = "https://framerusercontent.com/images/stLcXmD5BBe1RLsQJ8fbc29YAQQ.png"; // Blue macOS Folder
const IMG_FILE_TEXT = "https://framerusercontent.com/images/RHAvQg2vnbtBKRG0ph3erPEvgb0.png"; // Generic Doc
const IMG_FILE_MEDIA = "https://framerusercontent.com/images/8rF4s2s2p2.png"; // Media Placeholder (not real URL, need fallback)
// Actually Inika uses:
// Folder: stLcXmD5BBe1RLsQJ8fbc29YAQQ.png
// File: RHAvQg2vnbtBKRG0ph3erPEvgb0.png
// Safari/Web: We need a Safari icon. Using a generic high-res safari icon URL or similar.
const IMG_SAFARI = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Safari_browser_logo.svg/1028px-Safari_browser_logo.svg.png"; // Fallback
// Or better, let's use the one from Inika if we can guess it, or use a reliable one.
// Let's us a reliable external asset for Safari.

export function IconFolder({ size = 64, className, ...props }: { size?: number; className?: string }) {
    return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
            src={IMG_FOLDER}
            alt="Folder"
            width={size}
            height={size}
            className={`object-contain drop-shadow-sm ${className}`}
            draggable={false}
        />
    );
}

export function IconFileText({ size = 64, className, ...props }: { size?: number; className?: string }) {
    return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
            src={IMG_FILE_TEXT}
            alt="File"
            width={size}
            height={size}
            className={`object-contain drop-shadow-sm ${className}`}
            draggable={false}
        />
    );
}

export function IconFileWeb({ size = 64, className, ...props }: { size?: number; className?: string }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            {/* White paper background for the "webloc" file look */}
            <div className="absolute inset-0 bg-white border border-gray-200 shadow-sm rounded-[4px] flex items-center justify-center">
                {/* Safari Logic: A simplified compass or specific icon */}
                <span className="text-[32px]">🧭</span>
            </div>
            {/* If we want the EXACT Inika look, she uses a specific icon. 
                 Let's stick to a very clean "webloc" style. 
                 Actually, Inika uses the Safari Compass icon directly.
             */}
        </div>
    );
}

export function IconFileJson({ size = 64, className, ...props }: { size?: number; className?: string }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <div className="w-[80%] h-full bg-[#1e1e1e] rounded-[4px] shadow-sm flex items-center justify-center border border-gray-700">
                <span className="text-[#2DFA80] font-mono font-bold text-xs">{`{ }`}</span>
            </div>
        </div>
    );
}
