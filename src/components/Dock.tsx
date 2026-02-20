"use client";

/**
 * Dock — macOS-style dock matching inikaj.com reference.
 *
 * Key behaviors:
 *  • Dock background stays FIXED — only icons magnify upward on hover
 *  • All icons are unique official macOS Big Sur icons (no duplicates)
 *  • Interactive icons (Finder, Messages, Photos, Contacts, + more) open portfolio windows
 *  • Tooltips appear ONLY on interactive icons
 */

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Types ─── */

interface DockAppItem {
    id: string;
    label: string;
    labelFr?: string;
    /** When set, the icon is interactive: opens a window, shows tooltip */
    windowId?: string;
    /** When set, click opens external URL */
    externalUrl?: string;
    /** URL to the official macOS icon image */
    iconUrl: string;
    /** Show a small "running" dot below the icon (like macOS) */
    isRunning?: boolean;
    isSeparator?: false;
}

interface DockSeparator {
    id: string;
    isSeparator: true;
}

type DockEntry = DockAppItem | DockSeparator;

/* ─── Dock Items — all unique official macOS icons from Framer CDN ─── */

const dockEntries: DockEntry[] = [
    /* ── Main macOS apps ── */

    // Interactive: opens "About" window (like Finder shows files → shows who Hugo is)
    {
        id: "finder",
        label: "Finder",
        labelFr: "Finder",
        windowId: "finder",
        iconUrl: "https://framerusercontent.com/images/wtQkw1jK0MlEDOrW0Q1kE5PBqc.png",
    },
    {
        id: "launchpad",
        label: "Launchpad",
        labelFr: "Launchpad",
        iconUrl: "https://framerusercontent.com/images/KCaz69s4OvhKMUI25E1RBeuNIyA.png",
    },
    {
        id: "github",
        label: "GitHub",
        labelFr: "GitHub",
        externalUrl: "https://github.com/Hc-Sky",
        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    },
    // Interactive: opens "Contact" window (Messages → messaging)
    {
        id: "messages",
        label: "Messages",
        labelFr: "Messages",
        windowId: "contact",
        iconUrl: "https://framerusercontent.com/images/fm90fwzWoBMCvK5C0MOyKdo94.png",
    },
    {
        id: "mail",
        label: "Mail",
        labelFr: "Mail",
        iconUrl: "https://framerusercontent.com/images/CwKoPLck9kD8CifRkrpug3socM.png",
    },
    {
        id: "maps",
        label: "Maps",
        labelFr: "Plans",
        iconUrl: "https://framerusercontent.com/images/YtLyrfz2kFN2QhkzBWG6TrATw.png",
    },
    // Interactive: opens "Nutrika" project (Photos → visual project showcase)
    {
        id: "photos",
        label: "Photos",
        labelFr: "Photos",
        windowId: "nutrika",
        iconUrl: "https://framerusercontent.com/images/ogWIDEJmWxA8SVRZpEe7gk35FcM.png",
    },
    {
        id: "facetime",
        label: "FaceTime",
        labelFr: "FaceTime",
        iconUrl: "https://framerusercontent.com/images/xxKf6tPzYecSWOavDJjUB0MtXw.png",
    },
    {
        id: "calendar",
        label: "Calendar",
        labelFr: "Calendrier",
        iconUrl: "https://framerusercontent.com/images/VeljykK560qBRDkQkYyhx8ChI.png",
    },
    // Interactive: opens "HNC Studio" project (Contacts → creative network)
    {
        id: "contacts",
        label: "Contacts",
        labelFr: "Contacts",
        windowId: "hnc-studio",
        iconUrl: "https://framerusercontent.com/images/gi6dMq8dbjba0LyjZSuySu4X6zg.png",
    },
    {
        id: "reminders",
        label: "Reminders",
        labelFr: "Rappels",
        iconUrl: "https://framerusercontent.com/images/NMuItXJj2OKiPiAC2EdivhRPYY.png",
    },
    {
        id: "notes",
        label: "Notes",
        labelFr: "Notes",
        iconUrl: "https://framerusercontent.com/images/Z0d1XNe7wVINUiHydSL6noKho.png",
    },
    {
        id: "tv",
        label: "TV",
        labelFr: "TV",
        iconUrl: "https://framerusercontent.com/images/1pORyCnfgAxpXWyCa1l7s8IJeK0.png",
    },
    {
        id: "music",
        label: "Music",
        labelFr: "Musique",
        iconUrl: "https://framerusercontent.com/images/pjjxP6KY1Ttnqhuqt9oF3QBfmE.png",
    },
    {
        id: "podcasts",
        label: "Podcasts",
        labelFr: "Podcasts",
        iconUrl: "https://framerusercontent.com/images/y6Unx5f6vZ4SwFJ4bnDpnejmKM.png",
    },
    {
        id: "appstore",
        label: "App Store",
        labelFr: "App Store",
        iconUrl: "https://framerusercontent.com/images/mjYHu1WKSujuvzAuskfVJSx2w.png",
    },
    {
        id: "settings",
        label: "System Settings",
        labelFr: "Réglages",
        iconUrl: "https://framerusercontent.com/images/VbY44vBZlQp4srNQK6ohxpco.png",
    },

    /* ── Separator ── */
    { id: "sep-1", isSeparator: true },

    /* ── Right section: Downloads + Spotify + Trash (like inikaj.com) ── */

    // Downloads folder — opens "Resume" window
    {
        id: "downloads",
        label: "Downloads",
        labelFr: "Téléchargements",
        windowId: "resume",
        iconUrl: "https://framerusercontent.com/images/XYN0Nl9HILu4c0bzhEPmjha0Cg.png",
    },
    // Spotify — interactive, opens "KakouQuest" project
    {
        id: "spotify",
        label: "Spotify",
        labelFr: "Spotify",
        windowId: "kakouquest",
        iconUrl: "https://framerusercontent.com/images/lwNP7fGxNGl6VSwvqD3AorA1h0.png",
    },
];

/* ─── Constants ─── */
const BASE_ICON_SIZE = 48;
const MAGNIFIED_ICON_SIZE = 64;
const MAGNIFY_RANGE = 120;

/* ─── Dock Component ─── */

interface DockProps {
    onOpenWindow: (windowId: string) => void;
    onRestoreWindow: (windowId: string) => void;
    openWindowIds: string[];
    minimizedWindowIds: string[];
}

export default function Dock({
    onOpenWindow,
    onRestoreWindow,
    openWindowIds,
    minimizedWindowIds,
}: DockProps) {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50"
        >
            {/* Dock shell — fixed height glassmorphism background */}
            <div
                    className="rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15
                shadow-[0_8px_32px_rgba(0,0,0,0.25)]
                flex items-end px-6 pb-0 overflow-visible"
                style={{ height: BASE_ICON_SIZE + 8 }}
            >
                {/* Icons grow upward beyond the shell on hover via overflow-visible */}
                <div className="flex items-end gap-[3px] overflow-visible">
                    {dockEntries.map((entry) => {
                        if (entry.isSeparator) {
                            return (
                                <div
                                    key={entry.id}
                                    className="w-px mx-1 bg-white/20 self-center"
                                    style={{ height: BASE_ICON_SIZE * 0.65 }}
                                    aria-hidden="true"
                                />
                            );
                        }

                        // Dynamic running state
                        const isRunning = entry.windowId
                            ? openWindowIds.includes(entry.windowId)
                            : false;
                        const isMinimized = entry.windowId
                            ? minimizedWindowIds.includes(entry.windowId)
                            : false;

                        return (
                            <DockIcon
                                key={entry.id}
                                item={entry}
                                mouseX={mouseX}
                                isRunning={isRunning}
                                isMinimized={isMinimized}
                                onOpenWindow={onOpenWindow}
                                onRestoreWindow={onRestoreWindow}
                            />
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Individual Dock Icon with Magnification ─── */

function DockIcon({
    item,
    mouseX,
    isRunning,
    isMinimized,
    onOpenWindow,
    onRestoreWindow,
}: {
    item: DockAppItem;
    mouseX: ReturnType<typeof useMotionValue<number>>;
    isRunning: boolean;
    isMinimized: boolean;
    onOpenWindow: (windowId: string) => void;
    onRestoreWindow: (windowId: string) => void;
}) {
    const { language } = useLanguage();
    const ref = useRef<HTMLButtonElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const label = language === "fr" && item.labelFr ? item.labelFr : item.label;
    const isInteractive = Boolean(item.windowId || item.externalUrl);

    // Distance from mouse to center of this icon
    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Map distance → size: close = 64px, far = 48px
    const widthSync = useTransform(
        distance,
        [-MAGNIFY_RANGE, 0, MAGNIFY_RANGE],
        [BASE_ICON_SIZE, MAGNIFIED_ICON_SIZE, BASE_ICON_SIZE],
    );
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });


    /** Click handler: restore if minimized, otherwise open */
    const handleClick = () => {
        if (item.externalUrl) {
            window.open(item.externalUrl, "_blank", "noopener,noreferrer");
            return;
        }
        if (!item.windowId) return;
        if (isMinimized) {
            onRestoreWindow(item.windowId);
        } else {
            onOpenWindow(item.windowId);
        }
    };

    return (
        <div className="relative flex flex-col items-center">
            {/* Tooltip — only for interactive icons */}
            {isInteractive && showTooltip && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-9 px-2.5 py-1 rounded-md text-[11px] font-medium
            bg-white text-gray-900 whitespace-nowrap z-50 shadow-[0_6px_20px_rgba(0,0,0,0.15)] border border-gray-200"
                >
                    {label}
                    <div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2
              bg-white rotate-45 border border-gray-200"
                    />
                </motion.div>
            )}

            <motion.button
                ref={ref}
                style={{ width, height: width }}
                onClick={handleClick}
                    onMouseEnter={() => isInteractive && setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                className={`flex items-center justify-center rounded-xl select-none
          transition-shadow duration-150
          focus:outline-none 
                ${isInteractive ? "cursor-pointer hover:shadow-lg" : "cursor-default"}`}
                aria-label={label}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={item.iconUrl}
                    alt={label}
                    className="w-full h-full rounded-xl object-contain pointer-events-none"
                    draggable={false}
                />
            </motion.button>

            {/* Running indicator dot — dynamic based on open windows */}
            <div
                className={`w-1 h-1 rounded-full bg-white/70 mt-0.5 transition-opacity duration-200 ${isRunning ? "opacity-100" : "opacity-0"
                    }`}
                aria-hidden="true"
            />
        </div>
    );
}