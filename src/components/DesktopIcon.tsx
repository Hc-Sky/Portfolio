"use client";

/**
 * DesktopIcon — macOS-style desktop icon with official Apple folder/file icons.
 * Uses real macOS Big Sur icons from Framer CDN (same source as inikaj.com).
 */

import { motion } from "framer-motion";

/** Official macOS Big Sur icon URLs from Framer CDN */
const ICON_URLS: Record<string, string> = {
    /* Official macOS Big Sur blue folder — from inikaj.com */
    folder:
        "https://framerusercontent.com/images/stLcXmD5BBe1RLsQJ8fbc29YAQQ.png",
    /* Official macOS PDF/document icon — from inikaj.com */
    file: "https://framerusercontent.com/images/RHAvQg2vnbtBKRG0ph3erPEvgb0.png",
};

interface DesktopIconProps {
    id: string;
    label: string;
    type: "folder" | "file" | "terminal" | "trash";
    position: { x: number; y: number };
    index: number;
    onClick: () => void;
}

export default function DesktopIcon({
    label,
    type,
    position,
    index,
    onClick,
}: DesktopIconProps) {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
            onClick={onClick}
            className="absolute flex flex-col items-center gap-1 cursor-pointer
        group focus:outline-none select-none"
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
            }}
        >
            {/* Icon */}
            <div className="relative w-16 h-16 flex items-center justify-center
        group-hover:scale-105 transition-transform duration-150">
                {type === "terminal" ? (
                    <TerminalSVGIcon />
                ) : type === "trash" ? (
                    <TrashSVGIcon />
                ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={ICON_URLS[type] || ICON_URLS.folder}
                        alt={label}
                        className="w-full h-full object-contain drop-shadow-lg pointer-events-none"
                        draggable={false}
                    />
                )}
            </div>

            {/* Label */}
            <span
                className="text-[11px] leading-tight text-center text-white/90
          px-1.5 py-0.5 rounded max-w-[90px] truncate
          group-hover:bg-blue-500/40 group-focus:bg-blue-500/50
          transition-colors duration-100"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}
            >
                {label}
            </span>
        </motion.button>
    );
}

/** Inline SVG terminal icon — macOS-style dark terminal with >_ prompt */
function TerminalSVGIcon() {
    return (
        <svg
            viewBox="0 0 64 64"
            className="w-full h-full pointer-events-none"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}
        >
            {/* Background */}
            <rect x="2" y="2" width="60" height="60" rx="14" fill="#1e1e1e" />
            <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#termGrad)" />

            {/* Title bar */}
            <rect x="2" y="2" width="60" height="14" rx="14" fill="rgba(255,255,255,0.06)" />
            <rect x="2" y="10" width="60" height="6" fill="rgba(255,255,255,0.06)" />

            {/* Traffic light dots */}
            <circle cx="12" cy="9" r="2" fill="#FF5F57" />
            <circle cx="19" cy="9" r="2" fill="#FEBC2E" />
            <circle cx="26" cy="9" r="2" fill="#28C840" />

            {/* >_ prompt */}
            <text
                x="14"
                y="40"
                fontSize="18"
                fontFamily="'SF Mono', Monaco, Consolas, monospace"
                fontWeight="600"
                fill="#4af626"
            >
                {">_"}
            </text>

            {/* Subtle green glow */}
            <text
                x="14"
                y="40"
                fontSize="18"
                fontFamily="'SF Mono', Monaco, Consolas, monospace"
                fontWeight="600"
                fill="#4af626"
                opacity="0.3"
                style={{ filter: "blur(3px)" }}
            >
                {">_"}
            </text>

            <defs>
                <linearGradient id="termGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
                </linearGradient>
            </defs>
        </svg>
    );
}

/** Inline SVG trash icon — macOS-style trash can */
function TrashSVGIcon() {
    return (
        <svg
            viewBox="0 0 64 64"
            className="w-full h-full pointer-events-none"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
        >
            {/* Trash body */}
            <path
                d="M16 20 L18 54 C18 56 20 58 22 58 L42 58 C44 58 46 56 46 54 L48 20"
                fill="#8e8e93"
                stroke="#636366"
                strokeWidth="1"
            />
            {/* Lid */}
            <rect x="12" y="16" width="40" height="4" rx="2" fill="#aeaeb2" />
            {/* Handle */}
            <rect x="26" y="12" width="12" height="4" rx="2" fill="#aeaeb2" />
            {/* Lines on body */}
            <line x1="24" y1="26" x2="24" y2="52" stroke="#636366" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="32" y1="26" x2="32" y2="52" stroke="#636366" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="40" y1="26" x2="40" y2="52" stroke="#636366" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
